# define feature sets
(let features (@
  "compile" "exec" "eval" "space"
  "bool" "string" "symbol" "number" "date" "array" "iterate" "encode"
  "object" "function" "merge" "if" "while" "for" "for-in"
  "bitwise" "logical" "arithmetic" "concat" "ordering"
  "operator" "is"
  # to be removed: "typeof" "flow" "pipe" "premise"
  # to be done.
  "math" "int" "float" "null" "uri" "json"
).

(= (*)
  (let scope (if argc argv features),
  (for name in scope
    ($define name (= name > ()
      ($run (+ "spec/" name),
).
