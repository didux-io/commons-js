/*
 * Copyright (c) 2013 Pavol Rusnak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/** The MIT License (MIT)
 * Copyright (c) 2014-2016 Ian Coleman
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 */

/*
 * Javascript port from python by Ian Coleman
 *
 * Requires code from sjcl
 * https://github.com/bitwiseshiftleft/sjcl
 */

 /**
  * Modified for use within Angular by the Smilo Platform B.V. team.
  */

const PBKDF2_ROUNDS = 2048;

import * as forge from "node-forge";
import * as sjcl from "./sjcl";

declare const BIP39WordLists: {
    en: string;
} 

export interface IPassphraseValidationResult {
    /**
     * True if the passphrase is valid.
     */
    isValid: boolean;
    /**
     * True if the passphrase is not valid and this is blocking (e.g. the passphrase cannot be used for generating a private key).
     */
    isBlocking?: boolean;
    /**
     * An optional error message which can be presented to the user.
     */
    errorMessage?: BIP39Error;
}

export type BIP39Error = "invalid_size" | "invalid_word" | "invalid_checksum";

export class BIP39 {
    private activeWordList: string[];
    private language: string = "english";

    /**
     * Loads the word list.
     */
    private initialize() {
        this.activeWordList = BIP39WordLists.en.split("\n");
    }

    /**
     * Generates a new mnemonic string
     * @param strength The entropy size in bits.
     */
    generate(strength: number): string {
        this.initialize();

        var r = strength % 32;
        if (r > 0) {
            throw 'Strength should be divisible by 32, but it is not (' + r + ').';
        }

        return this.toMnemonic(this.getRandomBytes(strength));
    }

    private getRandomBytes(strength: number): Uint8Array {
        // Generate a random collection of bytes
        let randomString = forge.random.getBytesSync(strength / 8);
        let forgeBuffer = forge.util.createBuffer(randomString, "raw");

        let bytes = [];
        while(forgeBuffer.length() > 0) {
            let byte = forgeBuffer.getByte();

            bytes.push(byte);
        }

        return new Uint8Array(bytes);
    }

    private toMnemonic(byteArray): string {
        if (byteArray.length % 4 > 0) {
            throw 'Data length in bits should be divisible by 32, but it is not (' + byteArray.length + ' bytes = ' + byteArray.length*8 + ' bits).'
        }

        var entropy = this.byteArrayToWordArray(byteArray);
        var hashedEntropy = sjcl.hash.sha256.hash(entropy);
        var h = sjcl.codec.hex.fromBits(hashedEntropy);

        var bitBase = this.byteArrayToBinaryString(byteArray);
        var c = this.zfill(this.hexStringToBinaryString(h), 256);
        var bitChecksum = c.substring(0, byteArray.length * 8 / 32);
        var bitComplete = bitBase + bitChecksum;

        var words = [];
        var wordCount = bitComplete.length / 11;
        for (var i=0; i<wordCount; i++) {
            // Parse part of the bit string as a binary number.
            var wordIndex = parseInt(
                bitComplete.substring(i * 11, (i + 1) * 11), 2
            );
            words.push(this.activeWordList[wordIndex]);
        }
        return this.joinWords(words);
    }

    /**
     * Checks if the given mnemonic phrase is valid.
     * 
     * If the phrase is not valid it means it is not generated by this wallet.
     * @param mnemonic 
     */
    check(phrase: string): IPassphraseValidationResult {
        this.initialize();

        phrase = phrase.toLowerCase();

        var mnemonic = this.splitWords(phrase);
        if (mnemonic.length == 0 || mnemonic.length % 3 > 0) {
            let result: IPassphraseValidationResult = {
                isValid: false,
                isBlocking: true,
                errorMessage: "invalid_size"
            };

            return result;
        }

        // Convert each word into a binary string index in the word list.
        var wordIndices = [];
        for (var i = 0; i < mnemonic.length; i++) {
            var word = mnemonic[i];
            var wordIndex = this.activeWordList.indexOf(word);
            if (wordIndex == -1) {
                // Word not found, this means the phrase is not valid
                let result: IPassphraseValidationResult = {
                    isValid: false,
                    isBlocking: true,
                    errorMessage: "invalid_word"
                };

                return result;
            }
            var binaryIndex = this.zfill(wordIndex.toString(2), 11);
            wordIndices.push(binaryIndex);
        }

        var wordIndicesString = wordIndices.join('');
        var l = wordIndicesString.length;
        
        // Extract the base part and the check sum part
        var baseBinaryString = wordIndicesString.substring(0, l / 33 * 32);
        var checksumBinaryString = wordIndicesString.substring(l - l / 33, l);
        
        // Now calculate based on the extracted base string what the check sum really should be
        var entropy = this.binaryStringToWordArray(baseBinaryString);
        var entropyHash = sjcl.hash.sha256.hash(entropy);
        var entropyHashHexString = sjcl.codec.hex.fromBits(entropyHash);
        var entropyHashPaddedHexString = this.zfill(this.hexStringToBinaryString(entropyHashHexString), 256);
        var checksum = entropyHashPaddedHexString.substring(0,l/33);

        // Return true if the check sums match
        if(checksumBinaryString == checksum) {
            let result: IPassphraseValidationResult = {
                isValid: true
            };

            return result;
        }
        else {
            let result: IPassphraseValidationResult = {
                isValid: false,
                isBlocking: false,
                errorMessage: "invalid_checksum"
            };

            return result;
        }
    }

    /**
     * Convert the given mnemonic phrase and an optional password
     * into a seed for a random generator.
     */
    toSeed(mnemonic: string, passphrase: string = ""): string {
        mnemonic = this.joinWords(this.splitWords(mnemonic)); // removes duplicate blanks
        var mnemonicNormalized = this.normalizeString(mnemonic);
        passphrase = this.normalizeString(passphrase)
        passphrase = "mnemonic" + passphrase;
        var mnemonicBits = sjcl.codec.utf8String.toBits(mnemonicNormalized);
        var passphraseBits = sjcl.codec.utf8String.toBits(passphrase);
        var result = sjcl.misc.pbkdf2(mnemonicBits, passphraseBits, PBKDF2_ROUNDS, 512, function(key) {
            var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha512);
            this.encrypt = function() {
                return hasher.encrypt.apply(hasher, arguments);
            };
        });
        var hashHex = sjcl.codec.hex.fromBits(result);
        return hashHex;
    }

    private splitWords(mnemonic) {
        return mnemonic.split(/\s/g).filter(function(x) { return x.length; });
    }

    private joinWords(words) {
        // Set space correctly depending on the language
        // see https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md#japanese
        var space = " ";
        if (this.language == "japanese") {
            space = "\u3000"; // ideographic space
        }
        return words.join(space);
    }

    private normalizeString(str) {
        return str.normalize("NFKD");
    }

    private byteArrayToWordArray(data) {
        var a = [];
        for (var i=0; i<data.length/4; i++) {
            let v = 0;
            v += data[i*4 + 0] << 8 * 3;
            v += data[i*4 + 1] << 8 * 2;
            v += data[i*4 + 2] << 8 * 1;
            v += data[i*4 + 3] << 8 * 0;
            a.push(v);
        }
        return a;
    }

    private byteArrayToBinaryString(data) {
        var bin = "";
        for (var i=0; i<data.length; i++) {
            bin += this.zfill(data[i].toString(2), 8);
        }
        return bin;
    }

    private hexStringToBinaryString(hexString) {
        let binaryString = "";
        for (var i=0; i<hexString.length; i++) {
            binaryString += this.zfill(parseInt(hexString[i], 16).toString(2),4);
        }
        return binaryString;
    }

    private binaryStringToWordArray(binary) {
        var aLen = binary.length / 32;
        var a = [];
        for (var i=0; i<aLen; i++) {
            var valueStr = binary.substring(0,32);
            var value = parseInt(valueStr, 2);
            a.push(value);
            binary = binary.slice(32);
        }
        return a;
    }

    // Pad a numeric string on the left with zero digits until the given width
    // is reached.
    // Note this differs to the python implementation because it does not
    // handle numbers starting with a sign.
    private zfill(source, length) {
        source = source.toString();
        while (source.length < length) {
            source = '0' + source;
        }
        return source;
    }
}