(define "Logical NOT: (! the-value)" (=> ()
  (should "(! the-value) returns true." (=> ()
    (assert (! the-value).
    (var x the-value)
    (assert (! x).
  ).
  (should "(not the-value) returns true." (=> ()
    (assert (not the-value).
    (var x the-value)
    (assert (not x).
  ).
).

(define "Logical AND: (the-value && ...)" (=> ()
  (should "(the-value &&) returns the-value." (=> ()
    (assert the-value ($the-value &&).
    (var x the-value)
    (assert the-value ($x &&).
  ).
  (should "(type && x) returns x." (=> ()
    (assert the-value ($the-value && true).
    (var x the-value)
    (assert the-value ($x && true).
  ).
  (should "(type && x y) returns y." (=> ()
    (assert the-value ($the-value && 1 2).
    (var x the-value)
    (assert the-value ($x && 1 2).
  ).
).

(define "Logical OR: (the-value || ...)" (=> ()
  (should "(the-value ||) returns the-value." (=> ()
    (assert the-value ($the-value ||).
    (var x the-value)
    (assert the-value ($x ||).
  ).
  (should "(the-value || x) returns the-value." (=> ()
    (assert 1 ($the-value || 1).
    (var x the-value)
    (assert 1 ($x || 1).
  ).
  (should "(the-value || x y) returns the-value." (=> ()
    (assert 1 ($the-value || 0 1).
    (var x the-value)
    (assert 1 ($x || 0 1).
  ).
).

(define "Boolean Test: (the-value ? ...)" (=> ()
  (should "Booleanize: (the-value ?) returns false." (=> ()
    (assert false ($the-value ?).
    (var x the-value)
    (assert false ($x ?).
  ).
  (should "Boolean Fallback: (the-value ? x) returns x." (=> ()
    (assert 1 ($the-value ? 1).
    (assert 1 ($the-value ? (1).
    (var x the-value)
    (assert 1 ($x ? 1).
    (assert 1 ($x ? (1).
  ).
  (should "Boolean Switch: (the-value ? x y) returns y." (=> ()
    (var x -1)
    (var y  1)
    (assert 1 ($the-value ? (-- x) y).
    (assert -1 x)

    (assert 2 ($the-value ? (-- x) (++ y).
    (assert -1 x)
    (assert 2 y)
  ).
).
