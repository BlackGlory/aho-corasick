#!/bin/bash

yarn tsc \
  --module commonjs \
  --target esnext \
  --esModuleInterop \
  ./benchmark/*.ts

echo '======================='
echo 'benchmark: aho-corasick'
echo '======================='
node ./benchmark/benchmark-aho-corasick.js

echo ''

echo '==================='
echo 'benchmark: fastscan'
echo '==================='
node ./benchmark/benchmark-fastscan.js

rm ./benchmark/*.js
