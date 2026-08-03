ARG NODE_VERSION=24
FROM node:${NODE_VERSION}
RUN apt-get update && apt-get install -y curl

WORKDIR /app

# Copy project
COPY . .

# Build admin
RUN npm --prefix admin install
RUN npm --prefix admin run build

# Build web
RUN npm --prefix web install
RUN npm --prefix web run build

# Build api
RUN npm --prefix api install

# Copy and set permissions for entrypoint script
COPY prod/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the API port
EXPOSE 3000

# Use entrypoint to run migrations before starting the app
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "--prefix", "api", "start"]
