FROM node:20-alpine

WORKDIR /app

COPY package*.json /app/
RUN npm ci

COPY . /app

ARG VITE_API_BASE_URL=http://127.0.0.1:7000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

EXPOSE 7001
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "7001"]
