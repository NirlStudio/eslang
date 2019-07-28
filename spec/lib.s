(for spec in (@
    "emitter"
    "format"
    "json"
    "math"
    "stdout"
    "espress"
    "timer"
    "uri"
  ) (define spec (=> ()
    (load ("./lib/" + spec).
).
