# Stage 1: Build the application
FROM node:18-alpine as build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built application from the previous stage
COPY --from=build /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
