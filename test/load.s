# define feature sets
(let features (@
  spec: (@
    "exec" "eval" "space"
    "bool" "string" "symbol" "number" "date" "array" "iterate" "encode"
    "object" "function" "is" "typeof" "mixin" "if" "while" "for" "for-in"
    "bitwise" "logical" "arithmetic" "concat" "ordering"
    "flow" "pipe" "premise" "operator"
  )
  test: (@
    "compile"
  )
),

(let run- (= type
  (for name in (features:type)
    ($define name (= (type name) > ()
      ($run (+ type "/" name)),
).

(= (type)
  ($run- (if ($isEmpty type) "spec" type)
).
