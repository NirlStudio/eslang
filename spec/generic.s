(for spec in (@
    "null"
    "type"
    "bool"
    "string"
    "number"
    "date"
    "range"
    "symbol"
    "tuple"
    "operator"
    "lambda"
    "function"
    "iterator"
    "promise"
    "array"
    "object"
    "class"
    "instance"
    "global"
  ) (define spec (=> ()
    (load ("./generic/" + spec).
).
