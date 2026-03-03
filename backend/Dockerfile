FROM node:20-alpine

WORKDIR /app/backend

# Install dependencies first (better layer caching)
COPY package.json ./
RUN npm install --omit=dev

# Copy backend source and database folder
COPY . .
WORKDIR /app
COPY ../database ./database

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

WORKDIR /app/backend
CMD ["node", "server.js"]

