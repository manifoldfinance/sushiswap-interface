#!/usr/bin/env bash
node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'
