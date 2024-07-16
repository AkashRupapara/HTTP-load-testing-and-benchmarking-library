# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the TypeScript code.
RUN npx tsc

# Run the load tester.
ENTRYPOINT ["npx", "ts-node", "loadTester.ts"]