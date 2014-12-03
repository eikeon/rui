#!/bin/bash
chmod -R 644 /var/rui
cd /var/rui; bower --allow-root install
cd /var/rui; npm install


