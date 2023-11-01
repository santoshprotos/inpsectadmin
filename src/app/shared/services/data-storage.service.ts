import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CryptoJS from 'crypto-js';
@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    key: string = "test1234";
    localDecryptData: any;
    constructor(private storage: Storage) {
        storage.create();
    }

    async setLocalData(key: string, data: any) {
        let encryptData = this.encryptionAES(data);
        return await this.storage.set(`${key}`, encryptData);
    }

    async removeLocalData(key: string) {
        return await this.storage.remove(`${key}`);
    }

    async getLocalData(key: any) {
        return await this.storage.get(`${key}`)
            .then(res => { return this.decryptionAES(res) })
            .catch((err) => { console.log(err) })
    }

    encryptionAES(msg: any) {
        // Encrypt
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(msg), this.key);
        return ciphertext.toString();
    }

    decryptionAES(msg: any) {
        // Decrypt
        const bytes = CryptoJS.AES.decrypt(msg, this.key);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(plaintext);

        // if (msg !== null) {
        //     const decrypted = CryptoJS.AES.decrypt(msg, this.key);
        //     if (decrypted) {
        //         try {
        //             const str = decrypted.toString(CryptoJS.enc.Utf8);
        //             if (str.length > 0) {
        //                 return JSON.parse(str);
        //             } else {
        //                 return ['error 1'];
        //             }
        //         } catch (e) {
        //             return ['error 2'];
        //         }
        //     }
        //     return ['error 3'];

        // }

    }
}
