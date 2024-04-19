FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3009
CMD [ "yarn", "start"]
