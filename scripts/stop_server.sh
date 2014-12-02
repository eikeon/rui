#!/bin/bash
isExistApp=`pgrep gulp`
if [[ -n  \$isExistApp ]]; then
   pkill gulp
fi
