# Serve static Student Registration app with nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# Copy only the built/static frontend into nginx
COPY frontend/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
