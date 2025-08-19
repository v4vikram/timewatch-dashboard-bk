FROM mirror.gcr.io/library/node:18

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
