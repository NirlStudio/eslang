(for spec in (@
    "arithmetic"
    "assignment"
    "bitwise"
    "control"
    "fetch"
    "function"
    "general"
    "generator"
    "import"
    "literal"
    "load"
    "logical"
    "pattern"
    "operator"
    "quote"
  ) (define spec (=> ()
    (load ("./operators/" + spec).
).
