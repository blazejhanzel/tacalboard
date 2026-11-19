FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY web/package.json ./web/package.json
COPY server/package.json ./server/package.json
COPY shared/package.json ./shared/package.json

RUN npm ci

COPY . .

ARG BUILD_CHANNEL=dev
ARG BUILD_NUMBER
ARG BUILD_SHA

ENV BUILD_CHANNEL=$BUILD_CHANNEL
ENV BUILD_NUMBER=$BUILD_NUMBER
ENV BUILD_SHA=$BUILD_SHA

RUN npm run build-only --workspace=@tacalboard/web

ENV NODE_ENV=production
ENV PORT=8080
ENV TACALBOARD_DATA_DIR=/data

RUN mkdir -p /data \
    && chown -R node:node /app /data

USER node

EXPOSE 8080

CMD ["npm", "run", "start", "--workspace=@tacalboard/server"]