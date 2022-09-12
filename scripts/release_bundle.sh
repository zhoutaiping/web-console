cd /home
if [ ! -d "home-v5-bundle" ]; then
  git clone git@git.nodevops.cn:frontend-team/home-v5-bundle.git
fi

cd home-v5-bundle
git checkout master
git pull
git branch -d release_$1
git push origin --delete release_$1
git checkout -b release_$1

/bin/cp -R -f /tmp/home-console/dist/* bundle/dist
git add .
git commit -m $1
git push --set-upstream origin release_$1
rm -rf /tmp/home-console