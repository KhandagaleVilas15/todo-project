# Serve static Student Registration app with nginx
FROM nginx:alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy app into nginx web root
COPY index.html /usr/share/nginx/html/

# Optional: custom nginx config for SPA-style routing (uncomment if you add client-side routing later)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
