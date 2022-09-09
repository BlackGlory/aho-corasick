#!/bin/bash

yarn tsc \
  --module commonjs \
  --target esnext \
  --esModuleInterop \
  ./benches/*.ts

node --expose-gc ./benches/benchmark.js

rm ./benches/*.js
