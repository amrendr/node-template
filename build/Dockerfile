# This approach promotes docker layer caching
FROM node:18.0 AS package_image
RUN apt-get update && apt-get install -y --no-install-recommends jq

COPY package.json /tmp

# Extract only npm dependecies. 
# Any other changes in package.json, such as version bump etc. 
# shouldn't invalidate docker layer cache for npm_install
RUN jq '{ dependencies, devDependencies }' < /tmp/package.json > /tmp/deps.json

FROM node:18.0 AS base_image

# Create app directory
WORKDIR /usr/src/app

COPY --from=package_image /tmp/deps.json ./package.json
COPY package-lock.json .

# Install app dependencies required in production mode 
ENV NODE_ENV=production
RUN npm install


FROM base_image AS build_image
# Install dependencies including dev dependencies
ENV NODE_ENV=development
RUN npm install

# Copy Source code after installing the node module
# This will not invalidate cache for npm install layer due to any code changes.
COPY . .

# Build assets for production, This will minify and uglify.
ENV NODE_ENV=production

RUN ./node_modules/.bin/gulp

FROM node:18.0-alpine

WORKDIR /usr/src/app

# Copy production node_modules from base image
# This layer should only have production node_modules
COPY --from=base_image /usr/src/app/node_modules ./node_modules

#Copy rest of required files from build image
COPY --from=build_image /usr/src/app/src ./src
COPY --from=build_image /usr/src/app/public ./public
COPY --from=build_image /usr/src/app/package*.json .

ENV NODE_ENV=production
ENV APP_RUN_ENV=prod

EXPOSE 3000
CMD [ "node", "./src/server.js" ]
