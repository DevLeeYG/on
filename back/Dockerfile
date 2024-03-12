FROM node:16-alpine

RUN apk add python3
WORKDIR /app
COPY package*.json ./
COPY .sequelizerc ./
RUN npm install
ADD https://raw.githubusercontent.com/eficode/wait-for/master/wait-for /
RUN ["chmod", "+x", "/wait-for" ]
