(for spec in (@
    "app"
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
