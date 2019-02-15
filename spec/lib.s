(for spec in (@
    "emitter"
    "format"
    "json"
    "math"
    "stdout"
    "timer"
    "uri"
  ) (define spec (=> ()
    (load ("./lib/" + spec).
).
