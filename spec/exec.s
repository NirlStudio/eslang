(define "execute a piece of code" (= ()
  (should "return the value from the last line of code" (= ()
    (assert 4 (` (exec "(@ 1 2 3) 4"),
  ),
  (should "return the value from operator 'exit'" (= ()
    (assert 4 (` (exec "(@ 1 2 3) (exit 4) 5"),
  ),
).

(define "execute a function with arguments" (= ()
  (should "return the evaluation of the function" (= ()
    (let func (= (x y) (+ x y 100),
    (assert 111 (` (execute func 10 1),
  ),
  (should "return the value from operator 'exit'" (= ()
    (let func (= (x y) (exit 1000)(+ x y 100) (exit 1),
    (assert 1000 (` (execute func 10 1),
  ),
).
