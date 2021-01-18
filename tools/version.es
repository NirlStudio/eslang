#!/usr/bin/env es

(print "Espresso" (@
  core: (env "runtime-core"),
  version: (env "runtime-version"),
  released\ by: "Nirl Studio, 2016 - 2021"
).

env "runtime-version";
