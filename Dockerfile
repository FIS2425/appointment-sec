FROM node:lts-alpine

# TODO: Cambiar el nombre de la carpeta por el nombre de tu proyecto
WORKDIR /appointment-svc

COPY . .

RUN npm ci --production && \
    rm -rf $(npm get cache)

ENTRYPOINT ["npm", "start"]
# ENTRYPOINT ["npm", "run", "dev"]