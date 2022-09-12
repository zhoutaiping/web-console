cd /home
if [ ! -d "home-v5-bundle" ]; then
  git clone git@git.nodevops.cn:frontend-team/home-v5-bundle.git
fi

cd home-v5-bundle
git pull

/bin/cp -R -f /tmp/home-console/* bundle/dist
git add .
git commit -m $1
git push
rm -rf /tmp/home-console