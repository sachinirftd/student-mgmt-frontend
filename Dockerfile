FROM node:14.17.3-alpine AS build
WORKDIR /student-ms
 
COPY package*.json ./
RUN npm install .
RUN npm install -g npm@latest
COPY . .
RUN npm run build

EXPOSE 4200

# FROM nginx:1.17.1-alpine
# COPY --from=build /student-ms/dist/student-ms/ /usr/share/nginx/html