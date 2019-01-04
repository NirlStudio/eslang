(for spec in (@
    "format"
    "json"
    "math"
    "print"
    "timer"
    "uri"
  ) (define spec (=> ()
    (load ("./lib/" + spec).
