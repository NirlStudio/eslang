(define "(Json of ...)" (= ()
  (should "return a json string of a value" (= ()
    (assert "[1,2,3]" (` (Json of (@1 2 3),
  ),
).
(define "(Json parse ...)" (= ()
  (should "return an object or value from a json string." (= ()
    (assert (` ((Json parse "[1,2,3]") is-a Array),
  ),
).
