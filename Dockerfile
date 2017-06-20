FROM node:8.1-alpine
COPY node_modules /node_modules
COPY *.js /

CMD node /example.js
