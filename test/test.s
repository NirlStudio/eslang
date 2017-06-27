# define the full feature set.
(let all-specs (@
  # bootstrap
  "tokenizer" "compiler"

  # generic
  "null" "type" "bool" "string" "number" "date" "range" "symbol" "tuple"
  "operator" "lambda" "function" "object"
  "module" "array" "set" "map" "class" "device"
  "iterate" "global"

  # runtime
  "runtime" "space" "signal" "evaluate"
  "eval" "run" "interpreter"

  # operators
  "quote" "assignment" "control"
  "logical" "arithmetic" "bitwise" "general"
  "load" "import" "include"

  # libs
  "encode" "print" "math" "uri" "json" "timer"
).

# run given specs or all.
(let scope ((arguments is-empty) ? all-specs arguments).
(for name in scope
  (define name (=> ()
    (load ("spec/" + name),
).
(test ).
