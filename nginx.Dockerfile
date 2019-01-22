FROM node:10-alpine

WORKDIR /usr/src/app

COPY public ./public
COPY src ./src
COPY package.json yarn.lock ./

RUN yarn && yarn build

FROM nginx:1.15-alpine

COPY --from=0 /usr/src/app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
