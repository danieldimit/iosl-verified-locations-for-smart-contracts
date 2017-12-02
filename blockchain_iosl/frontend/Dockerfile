FROM node:8.1

RUN mkdir -p /frontend
WORKDIR /frontend

MAINTAINER singh.1@campus.tu-berlin.de

RUN npm install -g create-react-app

RUN npm install -g react-scripts

RUN npm install --save react react-dom react-scripts

ADD package.json /frontend/spackage.json

RUN npm install

COPY src /frontend/src/

ADD public /frontend/public/

# start app
CMD ["npm", "start"]
