# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files
COPY . .

# Expose port (Cloud Run will still override PORT)
EXPOSE 3001

# Start app
CMD ["node", "server.js"]
