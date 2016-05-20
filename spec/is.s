(define "test objects/values (A is B)" (= ()
  (should "return true for the same object" (= ()
    (assert (` (null is),
    (assert (` (null is null),
    (assert (` (NaN is NaN),
    (assert (` (NaN != NaN),
    (assert (` (NaN not-equals NaN),
    (assert false (` (NaN == NaN),
    (assert false (` (NaN equals NaN),

    (let obj1 (@p:1),
    (let obj2(@p:1),
    (assert (` (obj1 is obj1),
    (assert false (` (obj1 is obj2),

    (let obj1 (@ 1 2),
    (let obj2 (@ 1 2),
    (assert (` (obj1 is obj1),
    (assert false (` (obj1 is obj2),

    (let func1 (=  x (+ x 2),
    (let func2 (= x (+ x 2),
    (assert (` ($func1 is func1),
    (assert false (` ($func1 is func2),
  ),
  (should "return true for the same values of bool, number, string and symbol" (= ()
    (let v1 true)
    (let v2 true)
    (assert (` (v1 is v2),
    (let v1 false)
    (let v2 false)
    (assert (` (v1 is v2),

    (let v1 1)
    (let v2 1)
    (assert (` (v1 is v2),
    (let v1 0)
    (let v2 0)
    (assert (` (v1 is v2),
    (let v1 -1)
    (let v2 -1)
    (assert (` (v1 is v2),
    (let v1 (number Infinity),
    (let v2 (number Infinity),
    (assert (` (v1 is v2),

    (let v1 "")
    (let v2 "")
    (assert (` (v1 is v2),
    (let v1 "1")
    (let v2 "1")
    (assert (` (v1 is v2),

    (let v1 (` sym),
    (let v2 (` sym),
    (assert (` (v1 is v2),
).
