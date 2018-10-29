# Compile worker classes
npm run tsc-worker

# Get start and end line number for both scripts
LamportGeneratorStart=$(grep -n "class" ./build/merkle/LamportGenerator.js | grep -Eo '^[^:]+')
LamportGeneratorEnd=$(grep -n "}" ./build/merkle/LamportGenerator.js | tail -1 | grep -Eo '^[^:]+')

SHA1PRNGStart=$(grep -n "class" ./build/random/SHA1PRNG.js | grep -Eo '^[^:]+')
SHA1PRNGEnd=$(grep -n "}" ./build/random/SHA1PRNG.js | tail -1 | grep -Eo '^[^:]+')

# Strip out file imports and exports
sed -n "$LamportGeneratorStart,$LamportGeneratorEnd p" ./build/merkle/LamportGenerator.js > ./build/merkle/LamportGenerator.tmp.js
sed -n "$SHA1PRNGStart,$SHA1PRNGEnd p" ./build/random/SHA1PRNG.js > ./build/random/SHA1PRNG.stripped.js

# Fix SHA1PRNG being renamed
sed -e 's/SHA1PRNG_1.SHA1PRNG/SHA1PRNG/g' ./build/merkle/LamportGenerator.tmp.js > ./build/merkle/LamportGenerator.stripped.js
