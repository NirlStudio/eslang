(define "value-of" (= ()
  (should "accept a number and return it" (= ()
    (assert 321 (` (Float value-of 321),
  ),
  (should "accept empty or null and return 0" (= ()
    (assert 0 (` (Float value-of),
    (assert 0 (` (Float value-of null),
  ),
  (should "accept a string and parse it" (= ()
    (assert 12.3 (` (Float value-of "12.3"),
    (assert -21 (` (Float value-of "-21"),
  ),
  (should "return NaN for any other type of values" (= ()
    (assert 0 (` (Float value-of true),
    (assert 0 (` (Float value-of false),
    (assert 0 (` (Float value-of (` sym),
    (assert 0 (` (Float value-of (@),
    (assert 0 (` (Float value-of (object),
    (assert 0 (` (Float value-of (= () 1),
  ),
).
