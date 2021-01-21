#!/usr/bin/env es

# check the existence of testing framework
(if ($test is null) # running as an app.
  const direct-testing true;
  export * (import "es/test");
).

# define the full feature set.
(const all-specs (@
  # core
  "generic", "operators", "runtime",
  # bootstrap
  "tokenizer", "compiler",
  # extra
   "lib"
).

# run given specs or all.
const scope (arguments ?* arguments, all-specs);
(for name in scope
  (define name (=> ()
    load '../spec/$name';
).

(if direct-testing
  test;
).
