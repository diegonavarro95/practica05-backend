# Usamos una imagen oficial de Node.js ligera (Alpine Linux)
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías (Express y CORS) dentro del contenedor
RUN npm install

# Copiamos el resto del código (server.js)
COPY . .

# Exponemos el puerto que usa nuestra API
EXPOSE 3000

# Comando para arrancar el servidor
CMD ["node", "server.js"]