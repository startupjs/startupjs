#!/bin/sh

# Fail script on first failed command
set -e

main () {
  _command=$1

  case "$_command" in
    "pr"    ) pr;;
    "task"  ) task;;
    *       ) echo "ERROR! Command '${_command}' not found.";;
  esac
}

# TODO
pr () {
  echo "NOT IMPLEMENTED"
}

# TODO
task () {
  echo "NOT IMPLEMENTED"
}

main "$@"; exit
