FROM node:8

WORKDIR /matchid
COPY package.json .
VOLUME /matchid/src
VOLUME /matchid/build
VOLUME /matchid/config
VOLUME /matchid/matchIdConfig


# cache package.json and node_modules to speed up builds
RUN npm install
#COPY . . 

EXPOSE 8080
CMD ["npm","run","dev"]
