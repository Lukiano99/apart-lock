import { encrypt_AES_128 } from "./encript-decript";

export const createTemporaryPassword = (password: string) => {
  const secret = "95b146954c904bc0a28531ee058ef8aa";
  const encryptedPassword = encrypt_AES_128(password, secret);

  return encryptedPassword;

  //   const url = "https://tuya.com/password/" + uuid;
  //   const res = await axios.get(url, {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer <API_TOKEN>",
  //     },
  //   });
  //   return res.data as Response;
};
