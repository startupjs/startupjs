#!/bin/bash

# Fail script on first failed command
set -e

# function to compare version numbers
function version_greater_or_equal() {
   [ "$1" == "`echo -e "$1\n$2" | sort -V | tail -n1`" ]
}

function main () {
  # check if 'corepack' exists
  if ! command -v corepack &> /dev/null
  then
      echo "corepack could not be found"

      read -p "Do you want to install it? (Y/n) " answer
      case ${answer:0:1} in
          y|Y )
              npm i -g corepack@latest
          ;;
          * )
              echo "Aborting the script as per your request."
              exit 1
          ;;
      esac
  fi

  # check if the version is >=0.20.0
  version=$(corepack --version)
  required_version="0.20.0"

  if version_greater_or_equal $required_version $version; then
      echo "corepack version is less than ${required_version}"

      read -p "Would you like to update it now? (Y/n) " answer
      case ${answer:0:1} in
          y|Y )
              npm i -g corepack@latest
          ;;
          * )
              echo "Aborting the script as per your request."
              exit 1
          ;;
      esac
  fi

  # do 'corepack enable'
  corepack enable
}

main "$@"; exit
