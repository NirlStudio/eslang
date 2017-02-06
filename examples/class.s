(let P (class (@
  _x: 123
  constructor: (= ()
    (print "P constructor called" (this _x) (this _y).

(let C (P define (@
  _y: 456
  constructor: (= ()
    (this upper)
    (print "C constructor called" (this _x) (this _y).

(C construct)
