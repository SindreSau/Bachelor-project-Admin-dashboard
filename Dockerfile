# Use the official Node.js image as the base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Run the prebuild script to run eslint and prettier
RUN pnpm run prebuild

# Build the Next.js application
RUN pnpm run build

# Clean up node_modules to reduce image size
RUN rm -rf node_modules

# Use a smaller base image for the final stage
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the built application from the builder stage
COPY --from=builder /app ./

# Install only production dependencies
RUN pnpm install --prod

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]
