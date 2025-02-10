# Usa la imagen oficial de Node.js como base
FROM node:20-alpine AS builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo los archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./ 

# Instala las dependencias (se pueden incluir devDependencies en desarrollo)
RUN npm ci

# Copia el resto del código
COPY . .

# Expone el puerto en el que Next.js correrá
EXPOSE 3000

# Comando para ejecutar en modo desarrollo
CMD ["npm", "run", "dev"]

