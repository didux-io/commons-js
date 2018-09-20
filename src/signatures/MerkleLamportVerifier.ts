import { CryptoHelper } from "../crypto/CryptoHelper";
import { AddressHelper } from "../address/AddressHelper";

export class MerkleLamportVerifier {
    private cryptoHelper = new CryptoHelper();
    private addressHelper = new AddressHelper();

    /**
     * Verifies if the signature applied to the given message is correct.
     * 
     * Verifying the Merkle signature requires us to work up the Merkle Tree until we reach the public key at the root of the tree.
     * Of course for the given message we do not have the actual Merkle Tree. Instead the message signer send us a part of this Merkle Tree.
     * This part can be used to verify the authenticity of the signature. E.g. it makes it impossible to forge a fake but seemingly valid signature.

     * We perform these steps:
     * 1) construct the leaf node public key based on half the private keys and half the public keys we received.
     * 2) work our way up the Merkle Tree (e.g. the authentication path) until we reach the root of the tree.
     * 3) check if the computed root value of the Merkle Tree equals the input address of the message.
     */
    verifyMerkleSignature(message: string, signature: string, index: number, layerCount: number, expectedRootAddress: string, bitCount: number = 100): boolean {
        let signatureParts = signature.split(",");

        let lamportSignatures = signatureParts[0].split("::");
        let merkleAuthenticationPath = signatureParts[1];

        // Convert the transaction to a binary string. Next take the first 100 bits of this string.
        let binaryMessage = this.cryptoHelper.sha256Binary(message).substr(0, bitCount);

        // Compute the leaf node value based on the private and public parts.
        let leafKey: string = "";
        for(let i = 0; i < binaryMessage.length; i++) {
            let sign = binaryMessage[i];
            let isLast = i == binaryMessage.length - 1;

            let privatePublicPair = lamportSignatures[i].split(":");

            if(sign == "0") {
                if(isLast) {
                    leafKey += this.cryptoHelper.sha512(privatePublicPair[0]) + 
                                        privatePublicPair[1]; 
                }
                else {
                    leafKey += this.cryptoHelper.sha256Short(privatePublicPair[0]) + 
                                        privatePublicPair[1]; 
                }
            }
            else if(sign == "1") {
                if(isLast) {
                    leafKey += privatePublicPair[0] + 
                                        this.cryptoHelper.sha512(privatePublicPair[1]); 
                }
                else {
                    leafKey += privatePublicPair[0] + 
                                        this.cryptoHelper.sha256Short(privatePublicPair[1]); 
                }
            }
            else {
                // Oh oh! We really only expect '0' or '1' when working with this binary message.
                // Something is really wrong...
                return false;
            }
        }

        // To get the actual leaf node value we must hash it.
        leafKey = this.cryptoHelper.sha256(leafKey);

        // Using the verification path and the leaf node value
        // we can reconstruct the root node of the Merkle Tree.
        // With this root node we can verify if this transaction was
        // signed with the original Merkle Tree.

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // WARNING: we do not actually reconstruct the root node.
        // Instead we reconstruct the second to last layer.
        // We do this because this is 'in line' with core.
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let path = merkleAuthenticationPath.split(":");
        let nextRoot: string = leafKey;
        let workingIndex = index;
        for(let i = 0; i < layerCount - 2; i++) {
            let publicKey: string;
            let otherPublicKey = path[i];
            if(workingIndex % 2 == 0) {
                publicKey = this.cryptoHelper.sha256(nextRoot + otherPublicKey);
            }
            else {
                publicKey = this.cryptoHelper.sha256(otherPublicKey + nextRoot);
            }

            // Store the computed public key as we need it
            // in the next iteration.
            nextRoot = publicKey;

            // We use bit shift instead of a division by 2
            // because Javascript does not support integer and we would
            // end up with floats...
            // Alternative would be divide by 2 and round down.
            workingIndex >>= 1;
        }

        // Convert the last public key to a Smilo address.
        // This address should match the input address of the transaction.
        // Otherwise we know the signature is invalid.
        let combinedHashes: string;
        if(workingIndex % 2 == 0)
            combinedHashes = nextRoot + path[path.length - 1];
        else
            combinedHashes = path[path.length - 1] + nextRoot;

        let rootAddress = this.addressHelper.addressFromPublicKey(combinedHashes, layerCount);
        return rootAddress == expectedRootAddress
    }
}