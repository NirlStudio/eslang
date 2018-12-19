(for spec in (@
    "eval"
    "evaluate"
    "interpreter"
    "run"
    "runtime"
    "signal"
    "space"
  ) (define spec (=> ()
    (load ("./runtime/" + spec).
