
FROM nginx

#WORKDIR dist
COPY www /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY nginx/config.sh /docker-entrypoint.d/40-config.sh
RUN chmod +x /docker-entrypoint.d/40-config.sh
