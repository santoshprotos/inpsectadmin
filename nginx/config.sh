#!/bin/sh

if [ ! -z "$API_URL" ];
then
	echo '{' > /usr/share/nginx/html/assets/config.json
	echo "  " \"apiUrl\": \"$API_URL\", >> /usr/share/nginx/html/assets/config.json
	echo "  " \"theme\": \"default\" >> /usr/share/nginx/html/assets/config.json
	echo } >> /usr/share/nginx/html/assets/config.json
fi



