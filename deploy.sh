#!/bin/sh

# Author : Richard
# Copyright (c) Tutorialspoint.com
# Script follows here:
# Reference: https://www.tutorialspoint.com/unix/unix-file-management.htm

echo upload files to the server

echo copy scripts
host=www.gismall.com
root=/root/apps/wechat
distination=root@$host:$root
scp -r ./bin $distination
scp -r ./controllers $distination
scp -r ./middlewares $distination
scp -r ./routes $distination
scp -r ./services $distination
scp -r ./utils $distination
scp -r ./views $distination
scp app.js $distination
scp configs.js $distination
scp package-lock.json $distination
scp package.json $distination
scp README.md $distination
scp yarn.lock $distination
ssh root@$host << remotessh
  cd $root
  npm install
  exit
remotessh
