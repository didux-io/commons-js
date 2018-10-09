## Examples

Below you will find several examples on how to use the most common functionality of the library. As part of this library we also provide a Typescript definitions file ('smilo-*.d.ts') with a more detailed description of each part of this library.

### Merkle Trees

The Smilo blockchain uses a Merkle Tree to sign transactions.

#### Generating

To generate a new Merkle Tree you must use the `MerkleTreeBuilder` class.

```
var builder = new Smilo.MerkleTreeBuilder();

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

To serialize and deserialize a Merkle Tree you can use the `MerkleTreeSerializer` and `MerkleTreeDeserializer` classes.

Both classes require a storage manager responsible for the actual writing and reading from whatever storage device you require.

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
}
```

The storage manager will be passed a fully encrypted Merkle Tree.

To serialize a Merkle Tree you could do this:

```
// We use the LocalStorageManager described above.
var storageManager = new LocalStorageManager();
var serializer = new Smilo.MerkleTreeSerializer(storageManager);
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
var serializer = new Smilo.MerkleTreeDeserializer(storageManager);

serializer.serialize("path/to/merkle/tree").then(
    function(merkleTree) {
        // Merkle tree was read from storage.
    },
    function(error) {
        // Something went wrong reading the Merkle Tree.
    }
);
```

### Signatures

Every transaction on the Smilo Blockchain has to be cryptographically signed with a valid Lamport signature. Because a Lamport private key, used to create a Lamport signature, should only ever be used once we use a Merkle Tree to easily provide many private keys derived from a single root key.

To sign a message you therefore need a Merkle Tree. You also need to provide a signature index which specifies which private key in the Merkle Tree should be used. The Smilo Commons JS library does __not__ track which index has been used and/or is available.

#### Sign a message

To sign a message use the `MerkleLamportSigner` class.

```
var signer = new Smilo.MerkleLamportSigner();

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
var verifier = new Smilo.MerkleLamportVerifier();

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
    fee: new Smilo.FixedBigNumber(0, 0),                       // The fee for the miners.
    assetId: "000x0123",                                        // The asset we are sending.
    inputAmount: new Smilo.FixedBigNumber(100, 0),             // The amount of the asset we want to send.
    transactionOutputs: [
        {
            outputAddress: "TO_ADDRESS",                        // The address we are sending to.
            outputAmount: new Smilo.FixedBigNumber(100, 0)     // The amount of we are sending to this address.
        }
    ]
};

// Compute data hash for transaction
var transactionHelper = new Smilo.TransactionHelper();
transaction.dataHash = transactionHelper.getDataHash(transaction);

// Sign transaction
var signer = new Smilo.MerkleLamportSigner();

var merkleTree = ...;           // Your Merkle Tree
var privateKey = "PRIVATE_KEY"; // Private key used to generate the Merkle Tree
var signatureIndex = 0;         // Merkle Tree leaf index

transaction.signatureData = signer.getSignature(merkleTree, transactionHelper.transactionToString(transaction), privateKey, signatureIndex);
transaction.signatureIndex = signatureIndex;
```

### Big Number

Because Javascript numbers are not precise enough to accurately describe all transaction amounts on the Smilo blockchain we use big numbers instead.

These numbers are defined with two parameters. The initial value and the amount of decimals.

We have defined the `FixedBigNumber` class to easily deal with big numbers.

### Defining big numbers

To define a `FixedBigNumber` you need to pass an initial value and the amount of decimals.

__100 Smilo__

Smilo does not support fractional numbers. Therefore we set the amount of decimals to 0. Values like 0.1 can therefore never be defined.

```
var amount = new Smilo.FixedBigNumber(100, 0);
```

__100 SmiloPay__

SmiloPay does support fractional numbers up to 18 decimals.

```
var amount = new Smilo.FixedBigNumber(100, 18);
```

### Comparing big numbers

Big numbers can be compared against each other:

```
var bn1 = new Smilo.FixedBigNumber(100, 18);
var bn2 = new Smilo.FixedBigNumber(200, 18);

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
var bn1 = new Smilo.FixedBigNumber(100, 18);

bn1.eq(100);    // true

bn1.lte("90");  // false
```

### Doing math on big numbers

Basic mathematical operations can be performed on big numbers. The decimal count of the big number you call these methods on are preserved. For example if you multiply a `FixedBigNumber` with 10 decimals with another `FixedBigNumber` with 20 decimals the resulting `FixedBigNumber` will have 10 decimals.

```
var bn1 = new Smilo.FixedBigNumber(100, 18);
var bn2 = new Smilo.FixedBigNumber(200, 18);

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
var bn1 = new Smilo.FixedBigNumber(100, 18);
var bn2 = new Smilo.FixedBigNumber(200, 18);
var bn3 = new Smilo.FixedBigNumber(300, 18);

// (bn1 + bn2) * bn3;
bn1.add(bn2).mul(bn3);
```

You can also mix `FixedBigNumbers` with Javascript numbers or strings:

```
var bn1 = new Smilo.FixedBigNumber(100, 18);

bn1.add(10);

bn1.mul("100");
```
