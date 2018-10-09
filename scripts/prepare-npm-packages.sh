# Build production code
npm run build-prod

# Build readme for web
cat ./dist/readme/header.web.md > ./dist/web/README.md
cat ./dist/readme/intro.md >> ./dist/web/README.md
cat ./dist/readme/install.web.md >> ./dist/web/README.md
cat ./dist/readme/examples.md >> ./dist/web/README.md

# Build readme for node
cat ./dist/readme/header.node.md > ./dist/node/README.md
cat ./dist/readme/intro.md >> ./dist/node/README.md
cat ./dist/readme/install.node.md >> ./dist/node/README.md
cat ./dist/readme/examples.md >> ./dist/node/README.md

# Copy licenses
cp ./LICENCE ./dist/node/LICENCE
cp ./LICENCE ./dist/web/LICENCE

mkdir -p ./dist/node/licences
mkdir -p ./dist/web/licences

cp ./dist/licences/* ./dist/node/licences
cp ./dist/licences/* ./dist/web/licences
