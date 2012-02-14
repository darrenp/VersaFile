cd ./public/javascripts
rm -rf dojo-1.6.1.d
cd ../..
rm -rf system

find . -type d -name '.svn' -exec rm -rf {} \;
git add .
find . -type d -name '.svn' -exec git rm -rf {} \;
git commit
git push origin