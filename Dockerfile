FROM node:14.16.0-alpine AS REACT_BUILD
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
RUN apk add --update python krb5 krb5-libs gcc make g++ krb5-dev
WORKDIR /app


COPY tsconfig.json ./
COPY package.json ./
RUN npm install
COPY src ./src
COPY public ./public
RUN npm run build



FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
#RUN rm /etc/nginx/conf.d/examplessl.conf

COPY --from=REACT_BUILD /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/

# Default port exposure
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html




CMD ["/bin/sh", "-c", "nginx -g \"daemon off;\""]
