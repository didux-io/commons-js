## Examples

Below you will find several examples on how to use the most common functionality of the library. As part of this library we also provide a Typescript definitions file ('diduxio-*.d.ts') with a more detailed description of each part of this library.

#### Generating

To generate a new Merkle Tree you must use the `MerkleTreeBuilder` class.

```
var builder = new DiduxIo.MerkleTreeBuilder();

var privateKey = "PRIVATE_KEY";
var layerCount = 14;

builder.generate(
    privateKey, 
    layerCount, 
    function(progress) {
        var progressPercentage = Math.round(progress * 100);

        console.log(`Progress = ${ progressPercentage }%`);
    }
).then(
    function(merkleTree) {
        // Merkle Tree generated!
    },
    function(error) {
        // Something went wrong...
        console.error(error);
    }
);
```

For web environments [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) will be used to efficiently generate the layers of the Merkle Tree. Node environments will use [child processes](https://nodejs.org/api/child_process.html) to achieve the same effect.

#### Write to storage

The `MerkleTreeBuilder` is only responsible for creating a Merkle Tree. It is not responsible for storing a Merkle Tree. 

To serialize and deserialize a Merkle Tree you can use the `MerkleTreeSerializer` class.

This class requires a storage manager responsible for the actual writing and reading from whatever storage device you require.

A storage manager is defined, in Typescript, as shown below:

```
interface IStorageManager {
    /**
     * Reads the content of a file as text.
     */
    read(path: string): Promise<string>;
    /**
     * Writes the given text data to the given path.
     */
    write(path: string, data: string): Promise<void>;

    /**
     * Reads the content of a file and parses it as JSON.
     * A Javascript object will be returned.
     */
    readJSON<T>(path: string): Promise<T>;
    /**
     * Writes the given Javascript object as JSON to the given path.
     */
    writeJSON(path: string, data: any): Promise<void>;

    /**
     * Removes the data at the given path from storage.
     */
    remove(path: string): Promise<void>;
}
```

A simple storage manager writing to local storage could then look like this:

```
function LocalStorageManager() {
    this.read = function(path) {
        var data = localStorage.getItem(path);

        return Promise.resolve(data);
    }    
    this.write = function(path, data) {
        localStorage.setItem(path, data);

        return Promise.resolve();
    }

    this.readJSON = function(path) {
        return this.read(path).then(
            function(data){ 
                return JSON.parse(data);
            }
        );
    }
    this.writeJSON = function(path, data) {
        return this.write(path, JSON.stringify(data));
    }

    this.remove = function(path) {
        localStorage.removeItem(path);

        return Promise.resolve();
    }
}
```

The storage manager will be passed a fully encrypted Merkle Tree.

To serialize a Merkle Tree you could do this:

```
// We use the LocalStorageManager described above.
var storageManager = new LocalStorageManager();
var serializer = new DiduxIo.MerkleTreeSerializer(storageManager);
var merkleTree = ...;

serializer.serialize(merkleTree).then(
    function() {
        // Merkle Tree was written to storage.
    },
    function(error) {
        // Failed to write Merkle Tree to storage.
    }
);
```

To deserialize a Merkle Tree you could do this:

```
// We use the LocalStorageManager described above.
var storageManager = new LocalStorageManager();
var serializer = new DiduxIo.MerkleTreeSerializer(storageManager);

serializer.serialize("path/to/merkle/tree").then(
    function(merkleTree) {
        // Merkle tree was read from storage.
    },
    function(error) {
        // Something went wrong reading the Merkle Tree.
    }
);
```

To clean a Merkle Tree from storage you could do this:

```
// We use the LocalStorageManager described above.
var storageManager = new LocalStorageManager();
var serializer = new DiduxIo.MerkleTreeSerializer(storageManager);

serializer.clean("path/to/merkle/tree").then(
    function() {
        // Merkle tree was cleaned from storage
    },
    function(error) {
        // Something went wrong cleaning the Merkle Tree from storage
    }
);
```
### Signatures

Every transaction on the Didux.io Blockchain has to be cryptographically signed with a valid Lamport signature. Because a Lamport private key, used to create a Lamport signature, should only ever be used once we use a Merkle Tree to easily provide many private keys derived from a single root key.

To sign a message you therefore need a Merkle Tree. You also need to provide a signature index which specifies which private key in the Merkle Tree should be used. The DiduxIo Commons JS library does __not__ track which index has been used and/or is available.

#### Sign a message

To sign a message use the `MerkleLamportSigner` class.

```
var signer = new DiduxIo.MerkleLamportSigner();

var merkleTree = ...;           // Your Merkle Tree
var data = "Hello World";       // Data you want to sign
var privateKey = "PRIVATE_KEY"; // Private key used to generate the Merkle Tree
var signatureIndex = 0;         // Merkle Tree leaf index

var signature = signer.getSignature(merkleTree, data, privateKey, signatureIndex);
```

The signature is a string combining the signature and the authentication path. The authentication path is used when other people want to verify the signature.

#### Verify a signature

To verify a message signature use the `MerkleLamportVerifier` class.

```
var verifier = new DiduxIo.MerkleLamportVerifier();

var data = "Hello World";       // The message
var signature = ...;            // The signature part of the message
var signatureIndex = 0;         // The Merkle tree leaf index used to sign this message
var layerCount = 14;            // The amount of layers of the Merkle Tree
var expectedRootAddress = ...;  // The expected root address e.g. public key

if(verifier.verifyMerkleSignature(data, signature, signatureIndex, layerCount, expectedRootAddress)) {
    // Valid signature
}
else {
    // Invalid signature
}
```

### Transactions

The below example demonstrates how to create and sign a transaction. Next you could send this transaction to the blockchain for processing.

Note how we use the `TransactionHelper` class. This class contains several methods which help when creating a transaction.

```
// Create the base of the transaction
var transaction = {
    timestamp: Date().now(),
    inputAddress: "FROM_ADDRESS",                               // The address we are sending from.
    fee: new DiduxIo.FixedBigNumber(0, 0),                       // The fee for the miners.
    assetId: "000x0123",                                        // The asset we are sending.
    inputAmount: new DiduxIo.FixedBigNumber(100, 0),             // The amount of the asset we want to send.
    transactionOutputs: [
        {
            outputAddress: "TO_ADDRESS",                        // The address we are sending to.
            outputAmount: new DiduxIo.FixedBigNumber(100, 0)     // The amount of we are sending to this address.
        }
    ]
};

// Compute data hash for transaction
var transactionHelper = new DiduxIo.TransactionHelper();
transaction.dataHash = transactionHelper.getDataHash(transaction);

// Sign transaction
var signer = new DiduxIo.MerkleLamportSigner();

var merkleTree = ...;           // Your Merkle Tree
var privateKey = "PRIVATE_KEY"; // Private key used to generate the Merkle Tree
var signatureIndex = 0;         // Merkle Tree leaf index

transaction.signatureData = signer.getSignature(merkleTree, transactionHelper.transactionToString(transaction), privateKey, signatureIndex);
transaction.signatureIndex = signatureIndex;
```

You can also add input data to a transaction. This data will be used by smart contracts. This input data must be formatted correctly as shown in the example below.

```
var transaction = {...};
var transactionHelper = new DiduxIo.TransactionHelper();

transaction.inputData = transactionHelper.formatInputData("Your input data goes here");
```

### Big Number

Because Javascript numbers are not precise enough to accurately describe all transaction amounts on the Didux blockchain we use big numbers instead.

These numbers are defined with two parameters. The initial value and the amount of decimals.

We have defined the `FixedBigNumber` class to easily deal with big numbers.

### Defining big numbers

To define a `FixedBigNumber` you need to pass an initial value and the amount of decimals.

__100 Didux__

Didux does not support fractional numbers. Therefore we set the amount of decimals to 0. Values like 0.1 can therefore never be defined.

```
var amount = new DiduxIo.FixedBigNumber(100, 0);
```

__100 DiduxPay__

DiduxPay does support fractional numbers up to 18 decimals.

```
var amount = new DiduxIo.FixedBigNumber(100, 18);
```

### Comparing big numbers

Big numbers can be compared against each other:

```
var bn1 = new DiduxIo.FixedBigNumber(100, 18);
var bn2 = new DiduxIo.FixedBigNumber(200, 18);

// ==
bn1.eq(bn2);    // false

// >
bn1.gt(bn2);    // false

// >=
bn1.gte(bn2);   // false

// <
bn1.lt(bn2);    // true

// <=
bn1.lte(bn2);   // true
```

You can also mix `FixedBigNumbers` with Javascript numbers or strings:

```
var bn1 = new DiduxIo.FixedBigNumber(100, 18);

bn1.eq(100);    // true

bn1.lte("90");  // false
```

### Doing math on big numbers

Basic mathematical operations can be performed on big numbers. The decimal count of the big number you call these methods on are preserved. For example if you multiply a `FixedBigNumber` with 10 decimals with another `FixedBigNumber` with 20 decimals the resulting `FixedBigNumber` will have 10 decimals.

```
var bn1 = new DiduxIo.FixedBigNumber(100, 18);
var bn2 = new DiduxIo.FixedBigNumber(200, 18);

// Multiply
bn1.mul(bn2);

// Divide
bn1.div(bn2);

// Add
bn1.add(bn2);

// Subtract
bn1.sub(bn2);
```

These operations return a new `FixedBigNumber` so the original operand remain unaltered. This also allows for chaining function calls:

```
var bn1 = new DiduxIo.FixedBigNumber(100, 18);
var bn2 = new DiduxIo.FixedBigNumber(200, 18);
var bn3 = new DiduxIo.FixedBigNumber(300, 18);

// (bn1 + bn2) * bn3;
bn1.add(bn2).mul(bn3);
```

You can also mix `FixedBigNumbers` with Javascript numbers or strings:

```
var bn1 = new DiduxIo.FixedBigNumber(100, 18);

bn1.add(10);

bn1.mul("100");
```

### BIP39

The BIP39 standard can be used to generate mnemonic phrases which serve as a base for a private key seed.

The DiduxIo Commons JS has integrated support for BIP39.

The example below shows how to generate a mnemonic phrase.

```
var bip39 = new DiduxIo.BIP39();

var mnemonicPhrase = bip39.generate(256);
```

To generate a phrase a strength in bits must be given. This number will determine how many words are generated. You cannot however just enter any number.

For reference the following parameters generate X amount of words:
- 128 bits = 12 words
- 160 bits = 15 words
- 192 bits = 18 words
- 224 bits = 21 words
- 256 bits = 24 words

Given a mnemonic passphrase you can also validate its correctness:

```
var bip39 = new DiduxIo.BIP39();

var phrase = ...;

var result = bip39.check(phrase);
if(result.isValid) {
    // Phrase is valid
}
else if(!result.isBlocking) {
    // Phrase might not be valid
    // This happens when the checksum is invalid
    // At the very least we can say the phrase was not 
    // generated by this library. It can still be used
    // to generate a seed though.
}
else {
    // Phrase is certainly not valid
    // This can mean:
    // - The phrase has an invalid size
    // - The phrase contains an unrecognized word
    // Check result.errorMessage for more info
}
```

To convert the phrase to a seed ready for a random number generator do:

```
var bip39 = new DiduxIo.BIP39();

var phrase = ...;

// Seed without passphrase
var seed = bip39.toSeed(phrase);

// Seed with extra passphrase
var seedWithPassphrase = bip39.toSeed(phrase, "PASSPHRASE");
```

The generated seed can then be used to generate a private key (see chapter `BIP32`).

### BIP32

The BIP32 standard is used to generate a private key from a seed. The DiduxIo Commons JS library combines BIP32 with BIP44.

To generate a private key do:

```
var bip32 = new DiduxIo.BIP32();

var privateKey = bip32.getPrivateKey("SOME_RANDOM_SEED");
```

This will generate a private key using the BIP32 path `m/44'/0x1991'/0'/0/0`.

You can change the coin type and index:

```
var bip32 = new DiduxIo.BIP32();

var coinType = ...;
var index = ...;

var privateKey = bip32.getPrivateKey("SOME_RANDOM_SEED", coinType, index);
```
