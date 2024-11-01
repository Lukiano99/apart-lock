var CryptoJs = require("crypto-js");

export const encrypt_AES_128 = (data: string, secretKey: string) => {
  const key = CryptoJs.enc.Utf8.parse(secretKey);
  const encrypted = CryptoJs.AES.encrypt(data, key, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJs.enc.Hex);
};

export const decrypt_AES_128 = (data: string, secretKey: string) => {
  const key = CryptoJs.enc.Utf8.parse(secretKey);
  const encryptedHexStr = CryptoJs.enc.Hex.parse(data);
  const encryptedBase64Str = CryptoJs.enc.Base64.stringify(encryptedHexStr);
  const decryptedData = CryptoJs.AES.decrypt(encryptedBase64Str, key, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7,
  });
  return decryptedData.toString(CryptoJs.enc.Utf8);
};
