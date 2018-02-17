(let P (@:class
  _x: 123
  constructor: (= ()
    (print "P constructor called" (this _x) (this _y),
  )
  activator: (= (obj)
    (print "P activator called " obj "=>" (this _x) (this _y)
  ).
(print (P default).

(let C (class of P (@
  _y: 456
  constructor: (= ()
    (print "C constructor called" (this _x) (this _y).
(print (C default).

(print (@:C _x: 100 _y: 200).
