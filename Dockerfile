# Use Node.js LTS version as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the entry point to ts-node
ENTRYPOINT ["npx", "ts-node", "index.ts"]

# Provide default arguments for the command
CMD ["--config", "/app/config.json"]
