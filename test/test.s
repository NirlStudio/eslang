(if fails is-missing
  (console code "# Are you kidding me? What have you done to me?")
  (halt -1).

(if define is-missing ($fails "missing function $define").
(if should is-missing ($fails "missing function $should").
(if assert is-missing ($fails "missing function $assert").

($define
  (+"--- Running in Sugly space now. ----\n\n"
    "  $fails, $define, $should and $assert"
  ), (= ()
    ($should "exist in current Sugly space" (= ()
      ($assert true).

(let run- (=> type > (*)
  (let i 0)
  (for (!= i argc) (++ i)
    (let name (argv:i),
    ($define (+ "$" name) (= (type name) > ()
      ($run (+ type "/" name ".s").

($ ($run-"spec")
  # run all specification.
  "eval"
  "space"
  "function"
  "iterate"

  "if"

  "bitwise"
  "logical"
  "arithmetic"
  "concat"
  "equivalence"
  "ordering"

  "flow"
  "pipe"
  "premise"
).

($ ($run-"test")
  # run extra test cases.
).
