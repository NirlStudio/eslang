(for spec in (@
    "env"
    "eval"
    "evaluate"
    "interpreter"
    "run"
    "signal"
    "space"
  ) (define spec (=> ()
    (load ("./runtime/" + spec).
).
