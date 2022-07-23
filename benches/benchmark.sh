#!/bin/bash

yarn tsc \
  --module commonjs \
  --target esnext \
  --esModuleInterop \
  ./benches/*.ts

echo '======================='
echo 'benchmark: aho-corasick'
echo '======================='
node --expose-gc ./benches/benchmark-aho-corasick.js

echo ''

echo '==================='
echo 'benchmark: fastscan'
echo '==================='
node --expose-gc ./benches/benchmark-fastscan.js

rm ./benches/*.js
