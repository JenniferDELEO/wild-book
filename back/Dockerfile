FROM node:lts-alpine

RUN apk --no-cache add curl

WORKDIR /app
COPY package*.json ./
RUN npm i

COPY tsconfig.json tsconfig.json
COPY src src

CMD npm start
