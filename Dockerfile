# ---------- Build Stage ----------
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# ---------- Runtime Stage ----------
FROM gcr.io/distroless/nodejs18

WORKDIR /app
COPY --from=build /app /app

EXPOSE 8080
CMD ["server.js"]
