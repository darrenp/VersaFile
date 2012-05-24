cd ./public/javascripts
rm -rf dojo-1.6.1.d
cd ../..
rm -rf system
rm -rf tmp

cd log
rm -rf *.log
cd ..

find . -type d -name '.svn' -exec rm -rf {} \;

git add .
git commit
git push origin development