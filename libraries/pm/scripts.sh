#!/bin/sh
# shellcheck disable=SC2059

# Fail script on first failed command
set -e

# ----- Constants -----

RED="\\033[0;31m"
GREEN="\\033[0;32m"
CYAN="\\033[0;36m"
NO_COLOR="\\033[0m"

STATUS_IN_PROGRESS="ᴅᴇᴠ: 🚀 In progress"
STATUS_ON_REVIEW="ᴅᴇᴠ: 🔍 On review"

PRIORITY_FIELD_NAME="Priority"
HOURS_FIELD_NAME="Hours"
DIFFICULTY_FIELD_NAME="Difficulty"

PROJECT_TEMPLATE_ORG="startupjs"
PROJECT_TEMPLATE_NUMBER="2"

# path to config file from the current working directory (project root)
CONFIG_FILE_PATH="$(pwd)/.github/github.config.json"

ERROR_NO_ISSUE_PR="\
${RED}ERROR!!! Your branch is not numeric so the Issue number cannot \n\
be determined automatically. You MUST explicitly specify the Issue number \n\
which you are making a PR for.\n\
\n\
Example: yarn pr 9999\
"
ERROR_NO_ISSUE_TASK="\
${RED}ERROR!!! You MUST specify the Issue number of your task.\n\
\n\
Example: yarn task 9999\
"
ERROR_NO_GH="\
${RED}ERROR!!! You don't have 'gh' installed.\n\
Please follow instructions here to install it: https://cli.github.com/\
"
ERROR_WRONG_GITHUB_CONFIG="\
You must create it with the following content:\n\
\n\
{\n\
  \"reviewers\": \"user1,user2\",\n\
  \"branchesDomain\": \"example.com\"\n\
}\n\
\n\
Where 'user1' and 'user2' are the github usernames of the teamleads, PMs and testers on your project who are doing the PR reviews.\n\
And 'branchesDomain' is the wildcard domain for feature-branches\n\
where each branch gets deployed to as a subdomain: 7.example.com, 42.example.com, etc.\
"

# ----- main -----

main () {
  _command=$1
  shift # Remove the command from the argument list

  case "$_command" in
    "pr"      ) pr "$@";;
    "task"    ) task "$@";;
    "init-pm" ) initPm "$@";;
    *         ) echo "ERROR! Command '${_command}' not found.";;
  esac
}

# ----- commands -----

# Create a new project on github from template
initPm () {
  # Check that gh cli is present and login if needed
  _checkAndInitGh

  echo "Copy template https://github.com/orgs/${PROJECT_TEMPLATE_ORG}/projects/${PROJECT_TEMPLATE_NUMBER} to a new project"
  _projectUrl=$(gh project copy \
    $PROJECT_TEMPLATE_NUMBER \
    --source-owner $PROJECT_TEMPLATE_ORG \
    --target-owner "$(_getOwner)" \
    --title "$(_getRepo)" --format json | sed -n 's/.*\(https[^"]*\)".*/\1/p')

  _linkProjectToRepo "$(_getProjectFromUrl "$_projectUrl")"

  printf "\n\n${GREEN}SUCCESS! Created a new Project: ${CYAN}${_projectUrl}${NO_COLOR}\n\n"

  echo "${RED}IMPORTANT 1!!! Please do the following manually:${NO_COLOR}"
  echo "${RED}1.${NO_COLOR} Go to the Workflows here: ${CYAN}${_projectUrl}/workflows${NO_COLOR}"
  echo "${RED}2.${NO_COLOR} In the left sidebar select ${CYAN}Auto-add to project${NO_COLOR}"
  echo "${RED}3.${NO_COLOR} Click ${CYAN}Edit${NO_COLOR} in the top right corner"
  echo "${RED}4.${NO_COLOR} In ${CYAN}Filters${NO_COLOR} select your repo ${CYAN}$(_getRepo)${NO_COLOR}"
  echo "${RED}5.${NO_COLOR} In the search field near it specify the following: ${CYAN}is:issue is:open${NO_COLOR}"
  echo "${RED}6.${NO_COLOR} Click ${CYAN}Save and turn on workflow${NO_COLOR} in the top right corner"
  printf "\n"
  echo "${RED}IMPORTANT 2!!!${NO_COLOR}"
  echo "Your ${CYAN}package.json${NO_COLOR} was updated to add ${CYAN}yarn pr${NO_COLOR} and ${CYAN}yarn task${NO_COLOR} commands."
  echo "Please commit it and push!"
}

# Make new PR or request review for existing PR
pr () {
  _issue=$1

  _branch=
  _myUsername=
  _filteredReviewers=

  if [ -z "$_issue" ] ; then
    _branch=$( git symbolic-ref --short HEAD )
    # Check if branch is an integer
    # https://stackoverflow.com/questions/6245570/how-do-i-get-the-current-branch-name-in-git#comment59307718_12142066
    if [ "$_branch" -eq "$_branch" ] 2> /dev/null ; then
      _issue=$_branch
    else
      echo "${ERROR_NO_ISSUE_PR}"
      exit 1
    fi
  fi
  echo "Using issue number: ${_issue}"

  # Check that gh cli is present and login if needed
  _checkAndInitGh

  echo "Pushing current branch if it wasn't pushed before"
  git push -u origin HEAD || true
  echo "Pushed"

  # --- Detect and detach from parent if this is a Sub-Issue ---
  _parentIssue=$(_getParentIssueNumber "$_issue" || true)
  if [ -n "$_parentIssue" ] ; then
    echo "Detected parent issue: #${_parentIssue}. Unlinking sub-issue from parent before conversion..."
    _unlinkIssueFromParent "$_issue" "$_parentIssue" || true
    echo "Unlinked sub-issue from parent."
  else
    echo "No parent issue detected for #${_issue}."
  fi

  # Submit a new PR if it doesn't exist yet
  if ! _hasPr "$_issue" ; then
    _makeNewPr "$_issue"
    printf "\n\n${GREEN}SUCCESS! Created a new PR.${NO_COLOR}\n\n"
  fi

  _requestPrReviewIfNeeded "$_issue"

  # Change status to 'On review' if pr is linked to the project
  _projectId=$(_getPrProjectId $_issue)
  if [ -n "$_projectId" ] ; then
    echo "Change task status to '$STATUS_ON_REVIEW'"
    _prNodeId=$(_getPrNodeId $_issue)
    _statusId=$(_getFieldId "Status")
    _onReviewOptionId=$(_getFieldOptionId "Status" "$STATUS_ON_REVIEW")
    _setFieldValue $_prNodeId $_projectId $_statusId $_onReviewOptionId
  fi

  # --- NEW: link the new PR back to the original parent, if any ---
  if [ -n "$_parentIssue" ] ; then
    echo "Linking PR #${_issue} to parent issue #${_parentIssue}..."
    _linkPrToIssue "$_issue" "$_parentIssue" || true
    echo "Linked PR to parent."
    echo "Appending PR to the end of parent issue description..."
    _appendPrToParentIssueBody "$_issue" "$_parentIssue" || true
    echo "Parent issue updated."
  fi

  echo "Link to PR:"
  echo "${CYAN}https://github.com/$(_getOwner)/$(_getRepo)/pull/$_issue${NO_COLOR}"
}

# Switch to the task branch or create a new one
task () {
  _issue=$1

  if [ -z "$_issue" ] ; then
    echo "${ERROR_NO_ISSUE_TASK}"
    exit 1
  fi

  # Check that gh cli is present and login if needed
  _checkAndInitGh

  _defaultBranch=$(_getDefaultBranch)
  git checkout $_defaultBranch
  git pull origin $_defaultBranch
  git fetch origin $_issue 2>/dev/null || true

  if git show-ref --verify --quiet refs/heads/$_issue || git show-ref --verify --quiet refs/remotes/origin/$_issue ; then
    # Branch exists locally or in the remote (origin, which must be github)

    # Simply switch into it
    git checkout $_issue
    git pull origin $_issue 2>/dev/null || true

  else
    # Doesn't have a branch yet

    # Create a new branch
    git checkout -b $_issue

    # If the branch also doesn't exist on remote then we are the first
    # who started working on this task. Then we need to change its status to
    # 'In progress' if it's linked to a project
    if ! git show-ref --verify --quiet refs/remotes/origin/$_issue ; then
      _projectId=$(_getIssueProjectId $_issue)
      if [ -n "$_projectId" ] ; then
        echo "Change task status to '$STATUS_IN_PROGRESS'"
        _issueNodeId=$(_getIssueNodeId $_issue)
        _statusId=$(_getFieldId "Status")
        _inProgressOptionId=$(_getFieldOptionId "Status" "$STATUS_IN_PROGRESS")
        _setFieldValue $_issueNodeId $_projectId $_statusId $_inProgressOptionId
      fi
    fi

  fi
}

# ----- helpers -----

_requestPrReviewIfNeeded () {
  _issue=$1
  _reviewers=$( _getConfigValue "reviewers" )

  if [ -n "$_reviewers" ]; then
    echo "Loaded reviewers: ${_reviewers}"
    # Remove own username from reviewers list because you cannot
    # request review from yourself
    _myUsername=$( gh api user -q '.login' | cat )
    _filteredReviewers=$( _removeEntry "$_reviewers" "$_myUsername" )
    if [ -n "$_filteredReviewers" ]; then
      echo "Requesting reviews from ${_filteredReviewers}."
      _requestPrReview "$_issue" "$_filteredReviewers"
      printf "${GREEN}SUCCESS! Requested PR review from: ${_filteredReviewers}${NO_COLOR}\n\n"
    fi
  else
    echo "No reviewers set in ${CONFIG_FILE_PATH}. No review requested."
  fi
}

_getConfigValue () {
  _key=$1
  if [ ! -f "$CONFIG_FILE_PATH" ] ; then return; fi
  _getJsonValue "$( cat "$CONFIG_FILE_PATH" )" "$_key"
}

_getJsonValue () {
  _json=$1
  _key=$2
  echo "$_json" | grep -o "\"${_key}\"[^\"]*\"[^\"]*" | sed -n 's/"[^"]*"[^"]*"//p'
}

_getOwner () {
  git remote get-url origin | sed -n 's/.*github\.com[:\/]\([^\/]*\)\/[^\/]*.git/\1/p'
}

_getRepo () {
  git remote get-url origin | sed -n 's/.*github\.com[:\/][^\/]*\/\([^\/]*\).git/\1/p'
}

_getDefaultBranch () {
  gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name' | cat
}

# project url example: https://github.com/orgs/dmstartups/projects/4
_getProjectFromUrl () {
  _url=$1
  echo "$_url" | sed -n 's#.*/projects/\([0-9]*\)#\1#p'
}

_removeEntry () {
  _entries=$1
  _entry=$2

  echo $_entries \
  | sed -e "s/${_entry}//g" \
  | sed -e "s/^,//g" \
  | sed -e "s/,$//g" \
  | sed -e "s/,,/,/g"
}

_getRepoId () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.id' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -f query='
    query ($owner: String!, $repo: String!) {
      repository (owner: $owner, name: $repo) {
        id
      }
    }
  ' | cat
}

_getProjectIdByNumber () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.organization.projectV2.id' \
    -F owner="$(_getOwner)" \
    -F projectNumber="$1" \
    -f query='
    query ($owner: String!, $projectNumber: Int!) {
      organization (login: $owner) {
        projectV2(number: $projectNumber) {
          id
        }
      }
    }
  ' | cat
}

_linkProjectToRepo () {
  # shellcheck disable=SC2016
  gh api graphql --silent \
    -F repositoryId="$(_getRepoId)" \
    -F projectId="$(_getProjectIdByNumber "$1")" \
    -f query='
    mutation ($repositoryId: ID!, $projectId: ID!) {
      linkProjectV2ToRepository (input: {
        projectId: $projectId,
        repositoryId: $repositoryId
      }) {
        clientMutationId
      }
    }
  '
}

# Delete issue https://docs.github.com/en/graphql/reference/mutations#deleteprojectv2item
# Add issue https://docs.github.com/en/graphql/reference/mutations#addprojectv2itembyid

_removeIssueFromProject () {
  # shellcheck disable=SC2016
  gh api graphql --silent \
    -F issueNodeId="$1" \
    -F projectId="$2" \
    -f query='
    mutation ($issueNodeId: ID!, $projectId: ID!) {
      deleteProjectV2Item (input: { projectId: $projectId, itemId: $issueNodeId }) {
        deletedItemId
      }
    }
  '
}

_getIssueProjectId () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.issue.projectItems.nodes[0].project.id' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F issue="$1" \
    -f query='
    query ($owner: String!, $repo: String!, $issue: Int!) {
      repository (owner: $owner, name: $repo) {
        issue (number: $issue) {
          projectItems (first: 1) {
            nodes {
              project {
                id
              }
            }
          }
        }
      }
    }
  ' || true
}

_getPrProjectId () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.pullRequest.projectItems.nodes[0].project.id' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F pr="$1" \
    -f query='
    query ($owner: String!, $repo: String!, $pr: Int!) {
      repository (owner: $owner, name: $repo) {
        pullRequest (number: $pr) {
          projectItems (first: 1) {
            nodes {
              project {
                id
              }
            }
          }
        }
      }
    }
  ' || true
}

_getIssueNodeId () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.issue.projectItems.nodes[0].id' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F issue="$1" \
    -f query='
    query ($owner: String!, $repo: String!, $issue: Int!) {
      repository (owner: $owner, name: $repo) {
        issue (number: $issue) {
          projectItems (first: 1) {
            nodes {
              id
            }
          }
        }
      }
    }
  ' || true
}

_getPrNodeId () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.pullRequest.projectItems.nodes[0].id' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F pr="$1" \
    -f query='
    query ($owner: String!, $repo: String!, $pr: Int!) {
      repository (owner: $owner, name: $repo) {
        pullRequest (number: $pr) {
          projectItems (first: 1) {
            nodes {
              id
            }
          }
        }
      }
    }
  ' || true
}

_getIssueFieldId () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.issue.projectItems.nodes[0].fieldValueByName.field.id' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F issue="$1" \
    -F field="$2" \
    -f query='
    query ($owner: String!, $repo: String!, $issue: Int!, $field: String!) {
      repository (owner: $owner, name: $repo) {
        issue (number: $issue) {
          projectItems (first: 1) {
            nodes {
              fieldValueByName (name: $field) {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  field {
                    ... on ProjectV2SingleSelectField {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ' || true
}

_getIssueFieldOptionId () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.issue.projectItems.nodes[0].fieldValueByName.optionId' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F issue="$1" \
    -F field="$2" \
    -f query='
    query ($owner: String!, $repo: String!, $issue: Int!, $field: String!) {
      repository (owner: $owner, name: $repo) {
        issue (number: $issue) {
          projectItems (first: 1) {
            nodes {
              fieldValueByName (name: $field) {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  optionId
                }
              }
            }
          }
        }
      }
    }
  ' || true
}

_hasPr () {
  _getPrId $1 2>&1 | grep -q 'Could not resolve' && return 1 || return 0
}

_getPrId () {
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.pullRequest.id' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F pr="$1" \
    -f query='
    query ($owner: String!, $repo: String!, $pr: Int!) {
      repository (owner: $owner, name: $repo) {
        pullRequest (number: $pr) {
          id
        }
      }
    }
  ' | cat
}

_addPrToProject () {
  # shellcheck disable=SC2016
  gh api graphql --silent \
    -F prId="$1" \
    -F projectId="$2" \
    -f query='
    mutation ($prId: ID!, $projectId: ID!) {
      addProjectV2ItemById (input: { projectId: $projectId, contentId: $prId }) {
        clientMutationId
      }
    }
  '
}

_setFieldValue () {
  # shellcheck disable=SC2016
  gh api graphql --silent \
    -F nodeId="$1" \
    -F projectId="$2" \
    -F fieldId="$3" \
    -F optionId="$4" \
    -f query='
    mutation ($nodeId: ID!, $projectId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue (input: {
        projectId: $projectId,
        itemId: $nodeId,
        fieldId: $fieldId,
        value: {
          singleSelectOptionId: $optionId
        }
      }) {
        clientMutationId
      }
    }
  '
}

_convertIssueToPr () {
  _issue=$1
  gh api "repos/$(_getOwner)/$(_getRepo)/pulls" --silent -f head="$_issue" -f base="$(_getDefaultBranch)" -F issue="$_issue"
}

_getFieldOptionId () {
  _field=$1
  _optionName=$2
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.projectsV2.nodes[0].field.options.[] | {id,name}' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F field="$_field" \
    -f query='
      query ($owner: String!, $repo: String!, $field: String!) {
        repository (owner: $owner, name: $repo) {
          projectsV2 (first: 1) {
            nodes {
              field (name: $field) {
                ... on ProjectV2SingleSelectField {
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    ' | grep "$_optionName" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p'
}

_getFieldId () {
  _field=$1
  # shellcheck disable=SC2016
  gh api graphql -q '.data.repository.projectsV2.nodes[0].field.id' \
    -F owner="$(_getOwner)" \
    -F repo="$(_getRepo)" \
    -F field="$_field" \
    -f query='
      query ($owner: String!, $repo: String!, $field: String!) {
        repository (owner: $owner, name: $repo) {
          projectsV2 (first: 1) {
            nodes {
              field (name: $field) {
                ... on ProjectV2FieldCommon {
                  id
                }
              }
            }
          }
        }
      }
    '
}

# Add link to the test branch to the beginning of PR description
_addTestBranchLink () {
  _pullRequest=$1
  _branchesDomain=$( _getConfigValue "branchesDomain" )
  if [ -z "$_branchesDomain" ] ; then return 0; fi

  echo "Add link to the test branch into PR description"

  ( \
    printf "> 🕹️ ᴛᴇsᴛ ʜᴇʀᴇ: [\`%s.%s\`](https://%s.%s)\n\n" \
    "$_pullRequest" "$_branchesDomain" "$_pullRequest" "$_branchesDomain" && \
    gh pr view $_pullRequest --json body -q '.body' \
  ) | gh pr edit $_pullRequest -F -
}

_makeNewPr () {
  _issue=$1

  echo "Make PR. owner: $(_getOwner); repo: $(_getRepo); issue: $_issue"

  # Get project id
  _projectId=$(_getIssueProjectId $_issue)

  if [ -n "$_projectId" ] ; then

    # Get field ids and values (selected option ids)
    echo "Getting fields data..."

    echo "get $HOURS_FIELD_NAME"
    _hoursId=$(_getIssueFieldId $_issue $HOURS_FIELD_NAME)
    _hoursOptionId=$(_getIssueFieldOptionId $_issue $HOURS_FIELD_NAME)
    if [ -n "$_hoursId" ] ; then
      echo "${HOURS_FIELD_NAME}: id - $_hoursId; optionId - $_hoursOptionId"
    fi

    echo "get $PRIORITY_FIELD_NAME"
    _priorityId=$(_getIssueFieldId $_issue $PRIORITY_FIELD_NAME)
    _priorityOptionId=$(_getIssueFieldOptionId $_issue $PRIORITY_FIELD_NAME)
    if [ -n "$_priorityId" ] ; then
      echo "${PRIORITY_FIELD_NAME}: id - $_priorityId; optionId - $_priorityOptionId"
    fi

    echo "get $DIFFICULTY_FIELD_NAME"
    _difficultyId=$(_getIssueFieldId $_issue $DIFFICULTY_FIELD_NAME)
    _difficultyOptionId=$(_getIssueFieldOptionId $_issue $DIFFICULTY_FIELD_NAME)
    if [ -n "$_difficultyId" ] ; then
      echo "${DIFFICULTY_FIELD_NAME}: id - $_difficultyId; optionId - $_difficultyOptionId"
    fi

    # Remove issue from project
    _issueNodeId=$(_getIssueNodeId $_issue)
    echo "Issue nodeId: $_issueNodeId; projectId: $_projectId"
    echo "Removing issue from project..."
    _removeIssueFromProject $_issueNodeId $_projectId
    echo "Removed"

  fi

  # Convert issue to PR
  echo "Converting issue to PR..."
  _convertIssueToPr $_issue
  echo "Converted"

  # PR keeps the same number from when it was the issue
  _pullRequest=$_issue

  if [ -n "$_projectId" ] ; then

    # Add PR back to project
    _prId=$(_getPrId $_pullRequest)
    echo "prId: $_prId"
    echo "Adding PR to project..."
    _addPrToProject "$_prId" "$_projectId"
    echo "Added"

    _prNodeId=$(_getPrNodeId $_pullRequest)
    echo "prNodeId: $_prNodeId"

    # Set field values back to PR
    if [ -n "$_hoursId" ] ; then
      echo "set $HOURS_FIELD_NAME"
      _setFieldValue $_prNodeId $_projectId $_hoursId $_hoursOptionId
    fi
    if [ -n "$_priorityId" ] ; then
      echo "set $PRIORITY_FIELD_NAME"
      _setFieldValue $_prNodeId $_projectId $_priorityId $_priorityOptionId
    fi
    if [ -n "$_difficultyId" ] ; then
      echo "set $DIFFICULTY_FIELD_NAME"
      _setFieldValue $_prNodeId $_projectId $_difficultyId $_difficultyOptionId
    fi

  fi

  _addTestBranchLink $_pullRequest
}

_checkAndInitGh () {
  # Check if the remote origin exists
  if ! git remote get-url origin >/dev/null 2>&1; then
    echo "Error: Remote 'origin' does not exist. You need to add it first and push your repo to GitHub."
    exit 1
  fi

  # Check if the repository name from 'origin' is from GitHub
  if [ -z "$(_getRepo)" ]; then
    echo "Error: The remote 'origin' is not a GitHub repository."
    exit 1
  fi

  if ! hash gh 2>/dev/null ; then
    echo "${ERROR_NO_GH}"
    exit 1
  fi

  if ! gh auth status ; then
    echo "${RED}WARNING!!! You are not logged into 'gh'. Follow instructions below:"
    echo "1. choose GitHub.com"
    echo "2. choose SSH"
    echo "3. choose Skip"
    echo "4. choose 'Login with a web browser' and follow instructions"

    gh auth login -s project
  fi
}

_requestPrReview () {
  _pullRequest=$1
  _users=$2

  # Add reviewers
  _usersArray=$( echo $_users \
    | sed -e 's/,/","/g' \
    | sed -e 's/$/"/g' \
    | sed -e 's/^/"/g' \
  )
  _body=$( echo "{ \"reviewers\": [ ${_usersArray} ] }" )
  echo "pr api reviewers:" "$_body"
  echo $_body | gh api "/repos/$(_getOwner)/$(_getRepo)/pulls/${_pullRequest}/requested_reviewers" --silent --input -
}

# ============================
# Sub-Issue helpers (REST, official)
# ============================

# Returns the parent issue number (empty if none)
_getParentIssueNumber () {
  _child=$1
  _num=$(gh api \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "repos/$(_getOwner)/$(_getRepo)/issues/${_child}/parent" \
    -q '.number' 2>/dev/null || true)

  # trim only CR/LF/spaces; accept only pure digits
  _num=$(printf '%s' "$_num" | tr -d '\r\n ')

  case "$_num" in
    (''|*[!0-9]*)
      return 1
      ;;
    (*)
      printf '%s\n' "$_num"
      return 0
      ;;
  esac
}

# Internal: fetch the REST "id" of an issue (not the number)
_getIssueRestId () {
  _num=$1
  gh api \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "repos/$(_getOwner)/$(_getRepo)/issues/${_num}" \
    -q '.id'
}

# Remove the child from the parent's sub-issues (official endpoint)
_unlinkIssueFromParent () {
  _child=$1
  _parent=$2

  _childId=$(_getIssueRestId "$_child")
  [ -z "$_childId" ] && return 0

  printf '{"sub_issue_id": %s}\n' "$_childId" \
  | gh api \
      -X DELETE \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "repos/$(_getOwner)/$(_getRepo)/issues/${_parent}/sub_issue" \
      --input - --silent
}

# Adds a non-closing backlink from PR -> Parent issue at the top of the PR body
_linkPrToIssue () {
  _pr=$1
  _parent=$2

  _body=$( gh pr view "$_pr" --json body -q '.body' | cat )
  printf "%s\n" "$_body" | grep -Eq "(^|\s)#${_parent}(\b|[^0-9])" && return 0

  { printf "Parent issue: #%s\n\n" "$_parent"; printf "%s" "$_body"; } \
  | gh pr edit "$_pr" -F -
}

# Appends "- #<prNumber>" to the end of the parent issue body (idempotent).
_appendPrToParentIssueBody () {
  _pr=$1        # PR number (same as original issue number post-conversion)
  _parent=$2    # parent issue number

  # Get current body (normalize CRLF -> LF)
  _body=$( gh issue view "$_parent" --json body -q '.body' | tr -d '\r' | cat )

  # If already present, do nothing
  printf "%s\n" "$_body" | grep -Eq '(^|\n)-[[:space:]]+#'"$_pr"'([[:space:]]|$)' && return 0

  # Ensure a single newline separator before appending
  if [ -n "$_body" ]; then
    case "$_body" in
      *$'\n') _sep="";;
      *)      _sep=$'\n';;
    esac
    _newBody="${_body}${_sep}- #${_pr}
"
  else
    _newBody="- #${_pr}
"
  fi

  # Patch the parent body (raw-field preserves newlines)
  gh api -X PATCH \
    "repos/$(_getOwner)/$(_getRepo)/issues/${_parent}" \
    --silent \
    --raw-field body="$_newBody"
}

main "$@"; exit
