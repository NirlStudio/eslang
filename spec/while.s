($define "basic" (= ()
  ($should "keep looping until the condtion is evaluated to false." (= ()
    (let counter 0)
    (let i 10)
    (let result (while (> i 0)
      (++ counter)(-- i)
    ),
    (assert equal counter 10)
    (assert equal i 0)
    (assert equal result 0)

    (let counter 0)
    (let i 10)
    (let result (while (> i 0)
      (++ counter)(-- i)
      (let j 0)
      (while (< j 100) (++ j),
    ),
    (assert equal counter 10)
    (assert equal i 0)
    (assert equal result 100)
).

($define "continue" (= ()
  ($should "skip to next loop ignoring following clauses and use the argument(s)\
            as result." (= ()
    (let counter 0)
    (let i 10)
    (let result (while (> i 0)
      (-- i)
      (continue 99)
      (++ counter)
    ),
    (assert equal counter 0)
    (assert equal i 0)
    (assert equal result 99)
).

($define "break" (= ()
  ($should "stop looping and use the argument(s) as result." (= ()
    (let counter 0)
    (let i 10)
    (let result (while (> i 0)
      (-- i)
      (if (< i 5) (break (* i i),
      (++ counter)
    ),
    (assert equal counter 5)
    (assert equal i 4)
    (assert equal result 16)
).
