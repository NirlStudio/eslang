# define the full feature set.
(let all-specs (@
  # obsolete
  "compile" "exec" "eval" "space"
  "bool" "string" "symbol" "number" "date" "array" "iterate" "encode"
  "object" "function" "merge" "if" "while" "for" "for-in"
  "bitwise" "logical" "arithmetic" "concat" "ordering"
  "operator" "is"
  # bootstrap
  "tokenizer" "compiler"

  # runtime
  "runtime" "space" "signal" "evaluate"
  "lambda" "function" "operator"
  "load" "import" "include" "eval" "run" "interpreter"

  # type system
  "null" "type" "bool" "string" "number" "date" "range" "symbol" "tuple"
  "module" "array" "set" "map" "class" # "device"

  # operators
  "quote" "assignment" "control"
  "logical" "bitwise" "arithmetic" "general"
  "function" "operator" "object"

  # libs
  "encode" "print" "math" "uri" "json" "timer"
).

# run given specs or all.
(let scope ((arguments is-empty) ? all-specs arguments).
(for name in scope
  (define name (=> ()
    (load ("spec/" + name),
).
