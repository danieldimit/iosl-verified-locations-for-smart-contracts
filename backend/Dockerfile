FROM node:8.1

RUN mkdir -p /myapp/src
WORKDIR /myapp

MAINTAINER singh.1@campus.tu-berlin.de

ADD package.json /myapp/
RUN npm install

ADD src /myapp/src

EXPOSE 8080
CMD [ "npm", "start" ]
