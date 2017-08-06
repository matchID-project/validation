FROM node:8


WORKDIR /matchID

# cache package.json and node_modules to speed up builds
COPY package.json .
RUN npm install

# Add your source files
COPY . .
EXPOSE 8080
CMD ["npm","run","dev"]
