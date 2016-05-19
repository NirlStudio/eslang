(to define "feature1" (= ()
  (to define "sub-feature-1.1" (= ()
    (it should "do something (1.1)" (= ()
      (assert (` true)
  ),
  (to define "sub-feature-1.2" (= ()
    (it should "do something (1.2)" (= ()
      (assert (` false)
  ),
).

(to define "feature2" (= ()
  (to define "sub-feature-2.1" (= ()
    (it should "a component" "do something (2.1)" (= ()
      (assert 2 (` (+ 1 1)
  ),
  (to define "sub-feature-2.2" (= ()
    (it should "another component" "do something (2.2)" (= ()
      (assert 0 (` (+ 1 1)) "this feature is made to fail."
  ),
).
