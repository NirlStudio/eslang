# check the existence of testing framework
(if (:test is null) # running as an app.
  (let direct-testing true)
  (export * (import "test").

# define the full feature set.
(let all-specs (@
  # bootstrap
  "tokenizer" "compiler"

  "generic"
  "runtime"
  "operators"
  "lib"
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
