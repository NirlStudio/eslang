# check the existence of testing framework
(if (:test is null) # running as an app.
  (let direct-testing true)
  (export * (import "test").

# define the full feature set.
(let all-specs (@
  # bootstrap
  "tokenizer" "compiler"

  # generic
  "null" "type" "bool" "string" "number" "date" "range" "symbol" "tuple"
  "operator" "lambda" "function" "object"
  "module" "array" "class" "device"
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
    (load ("../spec/" + name),
).

(if direct-testing
  (test )
  (`) # hide report from console.
).
