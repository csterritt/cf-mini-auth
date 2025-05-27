#!/bin/bash
set -Eeuo pipefail

./clean-for-production.rb || exit 1
echo clean
git reset --hard HEAD
msg=$(./update-version.rb)
git commit -a -m "$msg"

git checkout main
git merge --no-commit -s ort -Xtheirs dev
./clean-for-production.rb || exit 1
echo Changes brought over, please check and commit.
