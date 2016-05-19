($define "object combination" (= ()
  ($should "(obj + ...)"
           "return a new object with properties from source objects" (= ()
    (let s1 (@ p1: 100),
    (let s2 (@ p2: 200),

    (let obj (+),
    (assert 0 (` obj),

    (let obj (s1 +),
    (assert false (` (s1 is obj),
    (let iter ($iterate obj),
    (assert (` (iter next),
    (assert "p1" (` (iter key),
    (assert 100 (` (iter value),
    (assert false (` (iter next),

    (let obj (s1 + s2),
    (assert false (` (s1 is obj),
    (let iter ($iterate obj),
    (assert (` (iter next),
    (assert "p1" (` (iter key),
    (assert 100 (` (iter value),
    (assert (` (iter next),
    (assert "p2" (` (iter key),
    (assert 200 (` (iter value),
    (assert false (` (iter next),
  ),
).

($define "object merge" (= ()
  ($should "(obj += ...)"
           "update the first object with properties from other source objects" (= ()
    (let s1 (@ p1: 100),
    (let s2 (@ p2: 200),

    (let obj (+=),
    (assert 0 (` obj),

    (let obj (s1 += ),
    (assert (` (s1 is obj),
    (let iter ($iterate obj),
    (assert (` (iter next),
    (assert "p1" (` (iter key),
    (assert 100 (` (iter value),
    (assert false (` (iter next),

    (let obj (s1 += s2),
    (assert (` (s1 is obj),
    (let iter ($iterate obj),
    (assert (` (iter next),
    (assert "p1" (` (iter key),
    (assert 100 (` (iter value),
    (assert (` (iter next),
    (assert "p2" (` (iter key),
    (assert 200 (` (iter value),
    (assert false (` (iter next),
  ),
).
