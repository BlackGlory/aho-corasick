#!/bin/bash

yarn tsc \
  --module commonjs \
  --target esnext \
  --esModuleInterop \
  ./benches/**/*.ts

echo '-------------------'
echo 'aho-corasick'
echo '-------------------'
node --expose-gc ./benches/aho-corasick/benchmark.js

echo ''

echo '-------------------'
echo 'fastscan'
echo '-------------------'
node --expose-gc ./benches/fastscan/benchmark.js

rm ./benches/**/*.js
