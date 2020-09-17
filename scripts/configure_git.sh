#!/bin/zsh
echo 'echo $GIT_TOKEN' > $HOME/.git-askpass
chmod +x $HOME/.git-askpass
GIT_ASKPASS=$HOME/.git-askpass
git clone $GIT_REPO
