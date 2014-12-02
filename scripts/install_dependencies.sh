#!/bin/bash
yum groupinstall -y "Development tools" "Development Libraries"
curl -sL https://rpm.nodesource.com/setup | bash -
yum install -y nodejs
npm install -g bower gulp
cd /var/rui; bower --allow-root install
cd /var/rui; npm install
