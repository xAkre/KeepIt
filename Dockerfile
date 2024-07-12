FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl gnupg

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | \
    tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
    apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \
    apt-get update && \
    apt-get install -y google-cloud-sdk

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run database:migrate

RUN npm run build

RUN cp package*.json dist/

RUN sed -i '/"type": "module"/d' dist/package.json

WORKDIR /usr/src/app/dist

COPY service-account-key.json /usr/src/app/

ENV GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/service-account-key.json"

COPY .env .

RUN npm install --production

CMD ["node", "index.js"]