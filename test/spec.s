# define feature sets
(let features (@
  "compile" "exec" "eval" "space"
  "bool" "string" "symbol" "number" "date" "array" "iterate" "encode"
  "object" "function" "is" "typeof" "mixin" "if" "while" "for" "for-in"
  "bitwise" "logical" "arithmetic" "concat" "ordering"
  "flow" "pipe" "premise" "operator"
).

(= (*)
  (let scope (if argc argv features))
  (for name in scope
    ($define name (= name > ()
      ($run (+ "spec/" name)),
).
