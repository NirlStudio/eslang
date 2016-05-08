($define "constants" (= ()
  ($should "have constant E" (= ()
    (assert (` (typeof (Math E) "number"),
).

($define "functions" (= ()
  ($should "have function abs" (= ()
    (assert 1 (` (Math abs -1),
).
