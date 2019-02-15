(let P (@:class
  _x: 123
  constructor: (= ()
    (print "No.1 P constructor called" (this _x) (this _y).
    (if (1 < 2)
      (print "No.2 1 < 2")
  ).
  activator: (= (obj)
    (print "No.6 P activator called " obj "=>" (this _x) (this _y)
).

(print "No.3 (P default)" (P default).

(let C (class of P (@
  _y: 456
  constructor: (= ()
    (print "No.4 C constructor called" (this _x) (this _y)
).

(print "No.5 (C default)" (C default).
(let c (@:C _x: 100 _y: 200).
(print "No.7 (@:C _x: 100 _y: 200)" ((c _x) == 100) ((c _y) == 200).
