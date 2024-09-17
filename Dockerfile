FROM node:22

WORKDIR /app
COPY . .

RUN npm install && chown -R node:node /app
USER node

ENTRYPOINT ["npm", "run", "dev"]
