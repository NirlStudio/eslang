(define "(json of ...)" (= ()
  (should "return a json string of a value" (= ()
    (assert "[1,2,3]" (json of (@1 2 3),
  ),
).
(define "(json parse ...)" (= ()
  (should "return an object or value from a json string." (= ()
    (assert ((json parse "[1,2,3]") is-a array),
  ),
).
