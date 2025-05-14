FROM node:22-alpine

WORKDIR /app

COPY package.json .

COPY . .
RUN npm install
RUN npm run build


EXPOSE 80

CMD ["node", "dist/src/mcp-server.js"]