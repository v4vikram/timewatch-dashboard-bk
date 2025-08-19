# Use Google Cloud distroless Node.js 18 image
FROM gcr.io/distroless/nodejs18

WORKDIR /app

# Copy package files and source
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8080
CMD ["server.js"]
