(for spec in (@
    "global"
    "null" "type"
    "bool" "string" "number" "date" "range" "symbol" "tuple"
    "operator" "lambda" "function"
    "iterator" "array" "object" "class" "instance"
  )
  (load ("generic/" + spec)
),
