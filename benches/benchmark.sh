#!/bin/bash

yarn tsc \
  --module commonjs \
  --target esnext \
  --esModuleInterop \
  ./benches/*.ts

node --expose-gc ./benches/benchmark-buidling.js
node --expose-gc ./benches/benchmark-matching.js

rm ./benches/*.js
