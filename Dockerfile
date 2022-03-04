FROM node:17-buster

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "."]