(let test ($require "test/test.s").

($define "feature1" (= ()
  ($define "sub-feature-1.1" (= ()
    ($should "do something (1.1)" (= ()
      (assert (` true)
  ),
  ($define "sub-feature-1.2" (= ()
    ($should "do something (1.2)" (= ()
      (assert (` false)
  ),
).

($define "feature2" (= ()
  ($define "sub-feature-2.1" (= ()
    ($should "a component" "do something (2.1)" (= ()
      (assert 2 (` (+ 1 1)
  ),
  ($define "sub-feature-2.2" (= ()
    ($should "another component" "do something (2.2)" (= ()
      (assert 0 (` (+ 1 1))
  ),
).

(let report ($test).
() # surpress report
