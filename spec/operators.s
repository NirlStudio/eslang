(for spec in (@
    "arithmetic"
    "assignment"
    "bitwise"
    "control"
    "function"
    "general"
    "import"
    "literal"
    "load"
    "logical"
    "operator"
    "quote"
  ) (define spec (=> ()
    (load ("./operators/" + spec).
