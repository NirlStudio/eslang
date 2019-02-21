(if ($define is null)
  (var direct-testing true)
  (var * (import "test").
  (print "---- testing framework is loaded. ----\n").
else
  (print "---- testing framework has been loaded. ----\n")
).

(define "feature1" (=> ()
  (define "sub-feature-1.1" (=> ()
    (should "do something right (1.1)" (=> ()
      (assert true)
  ).
  (define "sub-feature-1.2" (=> ()
    (should "do something wrong (1.2)" (=> ()
      (assert false)
  ).
).

(define "feature2" (=> ()
  (define "sub-feature-2.1" (=> ()
    (should "a component do something right (2.1)" (=> ()
      (assert 2 (+ 1 1) "this feature is made to succeed",
  ).
  (define "sub-feature-2.2" (=> ()
    (should "another component do some other wrong things (2.2)" (=> ()
      (assert 0 (+ 1 1) "this feature is made to fail.").
  ).
).

(if direct-testing
  (test )
).
