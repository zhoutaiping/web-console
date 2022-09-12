cd /home
if [ ! -d "home-v5-bundle" ]; then
  git clone git@git.nodevops.cn:frontend-team/home-v5-bundle.git
fi

cd home-v5-bundle

git checkout master
git branch -d release_$1
git pull
git checkout release_$1

sh startOrReload.sh