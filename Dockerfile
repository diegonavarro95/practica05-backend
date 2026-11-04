# Actualizamos a Node.js 22 para soportar WebSockets nativos de Supabase
FROM node:22-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías dentro del contenedor
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa nuestra API
EXPOSE 3000

# Comando para arrancar el servidor
CMD ["node", "server.js"]