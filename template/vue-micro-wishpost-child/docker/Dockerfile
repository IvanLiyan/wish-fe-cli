# build environment
FROM node:14.17.6 as build
WORKDIR /tmp
# ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm install
RUN npm rebuild node-sass
RUN npm run build

FROM nginx:1.19.4
COPY --from=build /tmp/dist /home/nginx/static/dist
# new
COPY ./docker/static.conf /etc/nginx/conf.d/static.conf