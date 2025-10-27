/**
 * Genera una contraseña aleatoria segura
 * @param length Longitud de la contraseña (por defecto 12)
 * @returns Contraseña aleatoria
 */
export function generateRandomPassword(length: number = 12): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
  let password = "";

  // Asegurar al menos un carácter de cada tipo
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%&*";

  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Completar el resto
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Mezclar la contraseña
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
