# Use the latest Node.js Alpine as the base image
FROM node:alpine AS base

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install OpenSSH client for SSH tunneling
RUN apk add --no-cache openssh-client

# Copy package manager lockfile and configuration files
COPY pnpm-lock.yaml package.json tsconfig.json ./

# Install Node.js dependencies with pnpm, respecting the lockfile
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY src ./src

# Default command to run the application
CMD ["pnpm", "start"]
