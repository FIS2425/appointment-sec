FROM node:lts-alpine

WORKDIR /appointment-svc

COPY . .

RUN npm ci --omit=dev && \
rm -rf $(npm get cache)

ENTRYPOINT ["npm", "start"]
# ENTRYPOINT ["npm", "run", "dev"]