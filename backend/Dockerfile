# Use Bun base image
FROM oven/bun:latest
WORKDIR /usr/src/app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Set user for security
USER bun

# Expose the port your Express server runs on
EXPOSE 4000/tcp

# Run the server directly using TypeScript
ENTRYPOINT [ "bun", "run", "src/server.ts" ]