#!/usr/bin/env bash

# constants of the universe
export TZ='UTC' LC_ALL='C'
umask 0002
# view the diff
#git hash-object -t tree /dev/null | git diff -p
git hash-object -t tree /dev/null
git hash-object yarn.lock
#git diff -p $(git genhash) .next/ >> HASH_SECURE
