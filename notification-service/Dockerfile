FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3003
CMD ["node", "dist/main.js"]