import {getRandomBytes} from "expo-random";

export const PRNG = (x, n) => {
        // we get random bytes
        const randomBytes = getRandomBytes(n);
        for(let i = 0; i < n; i++) {
                x[i] = randomBytes[i];
        }
};


