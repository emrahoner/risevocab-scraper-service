FROM node:12.16.1-alpine3.11

WORKDIR /usr/app

COPY ./package*.json ./

RUN npm ci

COPY . .

EXPOSE 80

CMD ["npm", "start"]