($define "basic" (= ()
  ($should "keep looping until the condtion is evaluated to false." (= ()
    (let counter 0)
    (let i 10)
    (let result (for (> i 0) (-- i)
      (++ counter)
      (* counter 2)
    ),
    (assert equal counter 10)
    (assert equal i 0)
    (assert equal result 20)

    (let counter 0)
    (let i 10)
    (let result (for (> i 0) (-- i)
      (++ counter)
      (let j 0)
      (for (< j 101) (++ j) (* j j),
    ),
    (assert equal counter 10)
    (assert equal i 0)
    (assert equal result 10000)
).

($define "continue" (= ()
  ($should "skip to next loop ignoring following clauses and use the argument(s)\
            as result." (= ()
    (let counter 0)
    (let i 10)
    (let result (for (> i 0) (-- i)
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
    (let result (for (> i 0) (-- i)
      (if (< i 5) (break (* i i),
      (++ counter)
    ),
    (assert equal counter 6)
    (assert equal i 4)
    (assert equal result 16)
).
