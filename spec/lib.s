(for spec in (@
    "emitter"
    "format"
    "json"
    "math"
    "stdout"
    "suglify"
    "timer"
    "uri"
  ) (define spec (=> ()
    (load ("./lib/" + spec).
).
