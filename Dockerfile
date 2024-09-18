FROM node:22

WORKDIR /app
COPY . .

RUN npm install && npm run build && chown -R node:node /app
USER node

ENTRYPOINT ["npm", "start"]
