FROM node:18-alpine

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .
RUN npm install

COPY src/workers/sessionCleanup/index.mts .

RUN npm install -g ts-node typescript

CMD ["ts-node", "/app/index.mts"]