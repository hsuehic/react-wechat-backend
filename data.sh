#!/bin/sh

# sudo mongodump -h 127.0.0.1:27017 -d wechat -o ./db

mongodump -h 127.0.0.1:27017 -d wechat -o ./db
scp -r ./db root@www.gismall.com:/root/apps/wechat
ssh root@www.gismall.com << remotessh
  mongorestore -h 127.0.0.1:27017 -d wechat --dir /root/apps/wechat/db/wechat/
remotessh