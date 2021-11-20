import {getRandomBytes} from "expo-random";
import {box, randomBytes} from 'tweetnacl';
import {decodeBase64, decodeUTF8, encodeBase64, encodeUTF8} from 'tweetnacl-util';

export const PRNG = (x, n) => {
        // we get random bytes
        const randomBytes = getRandomBytes(n);
        for(let i = 0; i < n; i++) {
                x[i] = randomBytes[i];
        }
};

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

        return encodeBase64(fullMessage);
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

