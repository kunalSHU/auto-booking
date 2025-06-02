FROM node:23.11.1-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./
CMD ["npm", "start"]