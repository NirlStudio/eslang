(define "basic" (= ()
  (should "keep looping until the condtion is evaluated to false." (= ()
    (let counter 0)
    (let i 10)
    (let result (while (i > 0)
      (++ counter)(-- i)
    ),
    (assert 10 (` counter),
    (assert 0 (` i),
    (assert 0 (` result),

    (let counter 0)
    (let i 10)
    (let result (while (i > 0)
      (++ counter)(-- i)
      (let j 0)
      (while (j < 100) (++ j),
    ),
    (assert 10 (` counter),
    (assert 0 (` i),
    (assert 100 (` result),
).

(define "continue" (= ()
  (should "skip to next loop ignoring following clauses and use the argument(s)\
            as result." (= ()
    (let counter 0)
    (let i 10)
    (let result (while (i > 0)
      (-- i)
      (continue 99)
      (++ counter)
    ),
    (assert 0 (` counter),
    (assert 0  (` i),
    (assert 99  (` result),
).

(define "break" (= ()
  (should "stop looping and use the argument(s) as result." (= ()
    (let counter 0)
    (let i 10)
    (let result (while (i > 0)
      (-- i)
      (if (i < 5) (break (i * i),
      (++ counter)
    ),
    (assert 5 (` counter),
    (assert 4 (` i),
    (assert 16 (` result),
).
