export const generateCode = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generiše broj između 1000 i 9999
  return `${randomNumber}#`;
};
