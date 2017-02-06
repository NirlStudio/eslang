(define "(encode clause expr)" (= ()
  (should "a symbol" "be encoded to its key" (= ()
    (assert "sym" (` (encode clause (` sym),
  ),
  (should "an array" "be encoded to a clause" (= ()
    (assert "(+ x y)" (` (encode clause (` (+ x y),
  ),

  (should "other types" "be encoded by its value" (= ()
    (assert "null" (` (encode clause),
    (assert "null" (` (encode clause null),

    (assert "true" (` (encode clause true),
    (assert "false" (` (encode clause false),
    (assert "12" (` (encode clause 12),
    (assert "(date 1234)" (` (encode clause (date 1234),
    (assert "\"\"" (` (encode clause ""),
    (assert "\"abc\"" (` (encode clause "abc"),
    (assert "(@\np: 1\n)" (` (encode clause (@ p: 1),
  ),
).

(define "(encode program clauses)" (= ()
  (should "an array" "be encoded as a list of clauses" (= ()
    (assert "x\n+\ny" (` (encode program (` (x + y),
    (assert "(x + y)" (` (encode program (` ((x + y),
    (assert "(x + y)\n(x - y)" (` (encode program (` ((x + y) (x - y),
    (assert "(x + y (x - y))" (` (encode program (` ((x + y (x - y),

    (assert "null" (` (encode program),
    (assert "null" (` (encode program null),
    (assert "true" (` (encode program true),
    (assert "false" (` (encode program false),
    (assert "12" (` (encode program 12),
    (assert "\"\"" (` (encode program ""),
    (assert "\"abc\"" (` (encode program "abc"),
    (assert "sym" (` (encode program (` sym),
    (assert "(date 1234)" (` (encode program (date 1234),
    (assert "(@\np: 1\n)" (` (encode program (@ p: 1),
    (assert "(=(x)\nx)" (` (encode program (= x x),
  ),
).
