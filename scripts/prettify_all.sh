#!/bin/sh

# Prettify all selected files
find ./src -name "*.ts*" | xargs ./node_modules/.bin/prettier --ignore-unknown --write

exit 0
