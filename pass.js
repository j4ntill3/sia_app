import bcrypt from "bcryptjs";

// La contraseña que deseas encriptar
const password = "contraseña123";

// Generar el hash
bcrypt.hash(password, 10).then((hashedPassword) => {
  console.log(hashedPassword);
});
