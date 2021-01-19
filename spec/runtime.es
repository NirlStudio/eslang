(for spec in (@
    "env"
    "eval"
    "evaluate"
    "run"
    "signal"
    "space"
  ) (define spec (=> ()
    (load ("./runtime/" + spec).
).
