FROM node:21-alpine3.18 AS builder

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
RUN npm install -g npm@latest && npm ci && npm run build


FROM node:21-alpine3.18

WORKDIR /app
RUN apk add --no-cache curl
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
RUN npm install -g pm2 npm@latest && npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4002

CMD ["npm", "run", "start"]
