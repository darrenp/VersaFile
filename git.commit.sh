cd ./public/javascripts
rm -rf dojo-1.6.1.d
cd ../..
rm -rf system
rm -rf tmp

find . -type d -name '.svn' -exec rm -rf {} \;
git add .
find . -type d -name '.svn' -exec git rm -rf {} \;
git commit
git push origin development