FROM node:8-alpine

RUN apk update && apk add --no-cache git tini


ENV NODE_ENV=production
ENV TINI_VERSION v0.16.1

ENV APP_URL=https://viblo.asia
ENV API_URL=https://api.viblo.asia
ENV PORT=3000


WORKDIR /server-render


COPY package.json yarn.lock ./

RUN yarn install --production --no-cache
RUN apk del git

COPY ./src ./src

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["/usr/local/bin/node", "-r", "esm", "/server-render/src/index.js"]
