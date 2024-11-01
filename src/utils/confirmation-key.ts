export const generateCode = (): string => {
  const randomPassword = Math.floor(1000000 + Math.random() * 9000000); // Generiše broj između 1000000 i 9999999
  return randomPassword.toString();
};
