(for spec in (@
    "json"
    "math"
    "print"
    "timer"
    "uri"
  ) (define spec (=> ()
    (load ("./lib/" + spec).
