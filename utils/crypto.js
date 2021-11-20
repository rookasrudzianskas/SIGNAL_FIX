import {getRandomBytes, box, setPRNG} from "expo-random";
import { decode as decodeUTF8, encode as encodeUTF8 } from '@stablelib/utf8';
import { decode as decodeBase64, encode as encodeBase64 } from '@stablelib/base64';
import {randomBytes} from "tweetnacl";

export const PRNG = (x, n) => {
        // we get random bytes
        const randomBytes = getRandomBytes(n);
        for(let i = 0; i < n; i++) {
                x[i] = randomBytes[i];
        }
};

setPRNG(PRNG);


const newNonce = () => randomBytes(box.nonceLength);
export const generateKeyPair = () => box.keyPair();


export const encrypt = (
        secretOrSharedKey,
        json,
        key) => {
        const nonce = newNonce();
        const messageUint8 = decodeUTF8(JSON.stringify(json));
        const encrypted = key
                ? box(messageUint8, nonce, key, secretOrSharedKey)
                : box.after(messageUint8, nonce, secretOrSharedKey);

        const fullMessage = new Uint8Array(nonce.length + encrypted.length);
        fullMessage.set(nonce);
        fullMessage.set(encrypted, nonce.length);


        const base64FullMessage = encodeBase64(fullMessage);
        return base64FullMessage;
};

export const decrypt = (
        secretOrSharedKey,
        messageWithNonce,
        key) => {
        const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
        const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
        const message = messageWithNonceAsUint8Array.slice(
                box.nonceLength,
                messageWithNonce.length
        );

        const decrypted = key
                ? box.open(message, nonce, key, secretOrSharedKey)
                : box.open.after(message, nonce, secretOrSharedKey);

        if (!decrypted) {
                throw new Error('Could not decrypt message');
        }

        const base64DecryptedMessage = encodeUTF8(decrypted);
        return JSON.parse(base64DecryptedMessage);
};



