(define "Logical NOT: (! the-value)" (=> ()
  (should "(! the-value) returns false." (=> ()
    (assert false (! the-value).
    (var x the-value)
    (assert false (! x).
  ).
  (should "(not the-value) returns false." (=> ()
    (assert false (not the-value).
    (var x the-value)
    (assert false (not x).
  ).
).

(define "Logical AND: (the-value && ...)" (=> ()
  (should "(the-value &&) returns the-value." (=> ()
    (assert the-value ($the-value &&).
    (var x the-value)
    (assert the-value ($x &&).
  ).
  (should "(the-value && x) returns x." (=> ()
    (assert true ($the-value && true).
    (var x the-value)
    (assert true ($x && true).
  ).
  (should "(the-value && truthy-value x) returns x." (=> ()
    (assert false ($the-value && true false).
    (var x the-value)
    (assert false ($x && true false).
  ).
  (should "(the-value \"and\") is an alias of (the-value \"&&\")." (=> ()
    (assert ($the-value "and":: is ($the-value "&&").
  ).
).

(define "Logical OR: (the-value || ...)" (=> ()
  (should "(the-value ||) returns the-value." (=> ()
    (assert the-value ($the-value ||).
    (var x the-value)
    (assert the-value ($x ||).
  ).
  (should "(the-value || x) returns the-value." (=> ()
    (assert the-value ($the-value || 1).
    (var x the-value)
    (assert the-value ($x || 1).
  ).
  (should "(the-value || x y) returns the-value." (=> ()
    (assert the-value ($the-value || 1 2).
    (var x the-value)
    (assert the-value ($x || 1 2).
  ).
  (should "(the-value \"or\") is an alias of (the-value \"||\")." (=> ()
    (assert ($the-value "or":: is ($the-value "||").
  ).
).

(define "Boolean Test: (the-value ? ...)" (=> ()
  (should "Booleanize: (the-value ?) returns true." (=> ()
    (assert true ($the-value ?).
    (var x the-value)
    (assert true ($x ?).
  ).
  (should "Boolean Fallback: (the-value ? x) returns the-value." (=> ()
    (assert the-value ($the-value ? 1).
    (assert the-value ($the-value ? (1).
    (var x the-value)
    (assert the-value ($x ? 1).
    (assert the-value ($x ? (1).
  ).
  (should "Boolean Switch: (the-value ? x y) returns x." (=> ()
    (var x -1)
    (var y  1)
    (assert -1 ($the-value ? x (++ y).
    (assert 1 y)

    (assert -2 ($the-value ? (-- x) (++ y).
    (assert -2 x)
    (assert 1 y)
  ).
).
