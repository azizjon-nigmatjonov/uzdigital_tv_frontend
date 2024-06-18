FROM node:14.20-alpine
RUN apk update && apk add yarn nginx


LABEL stage=builder
RUN mkdir app
WORKDIR /app

COPY package*.json ./
RUN rm package-lock.json && yarn install --network-timeout 1000000000


COPY . ./
RUN yarn build

#COPY nginx.conf /etc/nginx/nginx.conf
#EXPOSE 80
CMD ["yarn", "start"]

