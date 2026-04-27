FROM node:20-alpine AS build

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

WORKDIR /app
COPY *.json ./
RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
