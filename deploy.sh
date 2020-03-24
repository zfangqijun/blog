#!/bin/bash

echo "压缩dist"
zip -r dist dist/

echo "上传dist.zip"
scp ./dist.zip root@172.81.246.118:/usr/share/nginx/html/ 

echo "连接服务器，解压"
ssh root@172.81.246.118 "cd /usr/share/nginx/html/ ; unzip -o dist.zip"

echo "删除本地dist.zip"
rm dist.zip