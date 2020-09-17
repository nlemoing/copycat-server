#!/bin/zsh
set -e
cd $PROJECT

# Don't fail on these commands since they sometimes give exit codes
set +e
local_branch_exists=$(git branch | grep $1)
remote_branch_exists=$(git ls-remote --heads $GIT_REPO $1)

set -e
if [ $local_branch_exists ] || [ $remote_branch_exists ]; then
    echo "Local or remote branch exists, switching to it"
    git fetch && git checkout $1
else
    echo "No branch found, creating a new one"
    git checkout -b $1
fi
git add .
git commit -m "Updated by copycat"
if [ $remote_branch_exists ]; then
   git push
else 
   git push --set-upstream origin $1
fi 
git checkout -
