FROM node:8.1

RUN mkdir -p /frontend
WORKDIR /frontend

COPY . /frontend

RUN npm install

# start app
CMD ["npm", "start"]