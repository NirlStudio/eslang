(for spec in (@
    "arithmetic"
    "assignment"
    "bitwise"
    "control"
    "fetch"
    "function"
    "general"
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
