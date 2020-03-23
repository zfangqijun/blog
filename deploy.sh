zip -r dist dist/

scp ./dist.zip root@172.81.246.118://usr/share/nginx/html/ 
unzip -o dist.zip 