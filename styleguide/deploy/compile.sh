#!/bin/bash

# https://pempek.net/articles/2013/07/08/bash-sh-as-template-engine/
# Improved to properly handle "
# since the original script was stripping them
render_template() {
  eval "echo \"$(cat $1 | sed s/\"/\__q__/g)\"" | sed s/__q__/\"/g
}

compile() {
  printf "\n\n----- Compile $1\n\n"
  render_template $1
  mkdir -p compiled
  render_template $1 > compiled/$1
}

cd deploy

compile deployment.yaml
compile service.yaml

printf "\n\nCompiled files:\n\n"
ls compiled
