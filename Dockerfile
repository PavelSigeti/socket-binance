FROM node:18.12

WORKDIR /var/www/socket

RUN npm install

COPY . .

EXPOSE 8000

CMD node index.js