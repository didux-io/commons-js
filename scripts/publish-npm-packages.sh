# Make sure dist files are updated
npm run prepare-npm-packages

# Publish node
cd ./dist/node
npm publish --access public

cd ../..

# Publish web
cd ./dist/web
npm publish --access public
