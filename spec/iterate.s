(define "range iterator" (= ()
  (should "return a sequence iterator in a range with finite states" ( =()
    (let iter (iterate 0),
    (assert false (` (iter next),

    (let iter (iterate (range 0 3 -1),
    (assert (` (iter next),
    (assert false (` (iter next),

    (let iter (iterate (range 0 -3 1),
    (assert (` (iter next),
    (assert false (` (iter next),

    (let iter (iterate 2),
    (assert (` (iter next),
    (assert 0 (` (iter "value"),
    (assert (` (iter next),
    (assert 1 (` (iter "value"),
    (assert false (` (iter next),

    (let iter (iterate -2),
    (assert (` (iter next),
    (assert 0 (` (iter "value"),
    (assert (` (iter next),
    (assert -1 (` (iter "value"),
    (assert false (` (iter next),

    (let iter (iterate (range 0 2 2),
    (assert (` (iter next),
    (assert 0 (` (iter "value"),
    (assert false (` (iter next),
).

(define "property iterator" (= ()
  (should "return an iterator to traverse all properties of an object or a function" ( =()
    (let obj (object),
    (let iter (obj iterate),
    (assert false (` (iter next),

    (let obj (@ p1: 1),
    (let iter (obj iterate),
    (assert (` (iter next),
    (assert "p1" (` (iter "key"),
    (assert 1 (` (iter "value"),

    (let obj (@ p1: 1 p2: 2),
    (let iter (obj iterate),
    (assert (` (iter next),
    (assert (` (iter next),
    (assert false (` (iter next),
).

(define "array iterator" (= ()
  (should "return an iterator to traverse items in an array" ( =()
    (let arr (@),
    (let iter (arr iterate),
    (assert false (` (iter next),

    (let arr (@ "x"),
    (let iter (arr iterate),
    (assert (` (iter next),
    (assert 0 (` (iter "key"),
    (assert "x" (` (iter "value"),
    (assert false (` (iter next),

    (let arr (@ "x" "y"),
    (let iter (arr iterate),
    (assert (` (iter next),
    (assert 0 (` (iter "key"),
    (assert "x" (` (iter "value"),
    (assert (` (iter next),
    (assert 1 (` (iter "key"),
    (assert "y" (` (iter "value"),
    (assert false (` (iter next),
).
