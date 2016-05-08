($define "function form" (=()
  ($should "return an array object including all arguments" (= ()
    (let a1 ($array ),
    (assert 0 (`(a1 length),

    (let a1 ($array 0),
    (assert 1 (`(a1 length),
    (assert 0 (`(a1:0),

    (let a1 ($array 2 4 6),
    (assert 3 (`(a1 length),
    (assert 2 (`(a1:0),
    (assert 4 (`(a1:1),
    (assert 6 (`(a1:2),
).

($define "operator form - (array ...)" (=()
  ($should "return an array object including all arguments" (= ()
    (let a1 (array ),
    (assert 0 (`(a1 length),

    (let a1 (array 0),
    (assert 1 (`(a1 length),
    (assert 0 (`(a1:0),

    (let a1 (array 2 4 6),
    (assert 3 (`(a1 length),
    (assert 2 (`(a1:0),
    (assert 4 (`(a1:1),
    (assert 6 (`(a1:2),
).

($define "operator form - (@ ...)" (=()
  ($should "return an array object including all arguments" (= ()
    (let a1 (@ ),
    (assert 0 (`(a1 length),

    (let a1 (@ 0),
    (assert 1 (`(a1 length),
    (assert 0 (`(a1:0),

    (let a1 (@ 2 4 6),
    (assert 3 (`(a1 length),
    (assert 2 (`(a1:0),
    (assert 4 (`(a1:1),
    (assert 6 (`(a1:2),
).

($define "(Array concat ...)" (=()
  ($should "return an array with expanded arguments" (= ()
    (let a1 (Array concat ),
    (assert 0 (`(a1 length),

    (let a1 (Array concat 2 4 6),
    (assert 3 (`(a1 length),
    (assert 2 (`(a1:0),
    (assert 4 (`(a1:1),
    (assert 6 (`(a1:2),

    (let a1 (Array concat 2 4 (@ 6 8 10) 12 (@ 14 16),
    (assert 8 (`(a1 length),
    (assert 2 (`(a1:0),
    (assert 6 (`(a1:2),
    (assert 12 (`(a1:5),
    (assert 16 (`(a1:7),
).

($define "(Array comparison ...)" (=()
  ($should "return whether two arrays have equivalent values." (= ()
    (let a1 (@),
    (let a2 (@),
    (assert false (` (a1 is a2),
    (assert (` (a1 equals a2),

    (let a1 (@1),
    (let a2 (@1),
    (assert false (` (a1 is a2),
    (assert (` (a1 equals a2),

    (let a1 (@1 2 "" false),
    (let a2 (@1 2 "" false),
    (assert false (` (a1 is a2),
    (assert (` (a1 equals a2),
).

($define "Array object" (= ()
  ($should "be reserved" (= ()
    (assert "object" (`(typeof ($Array),
).
