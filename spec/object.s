(define "function form" (=()
  (should "return a new object with properties from other objects" (= ()
    (let obj (object),
    (assert (` (obj is-a Object),
    (assert false (` ((iterate obj) next),

    (let t (object),
    (let obj (object t),
    (assert (` (obj is-a Object),
    (assert false (` ((iterate obj) next),

    (let t (object),
    (let obj (object t (@ p: 2),
    (assert (` (obj is-a Object),
    (let iter (iterate obj),
    (assert (` (iter next),
    (assert "p" (` (iter key),
    (assert 2 (` (iter value),
    (assert false (` (iter next),
).

(define "operator form - (@ p:v ...)" (=()
  (should "return an object with customized properties" (= ()
    (let obj (@ p: 2),
    (assert (` (obj is-a Object),
    (let iter (iterate obj),
    (assert (` (iter next),
    (assert "p" (` (iter key),
    (assert 2 (` (iter value),
    (assert false (` (iter next),
).

(define "Object" (= ()
  (should "be an alias of type Class" (= ()
    (assert (` (Object is-a Type),
    (assert (` (Object is-not-a Class),
    (assert (` (Class is-a Object),
).
