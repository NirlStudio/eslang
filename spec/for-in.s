($define "(for value in x)" (= ()
  ($should "iterate all values in range [0 x) by step 1" (= ()
    (let counter 0)
    (let result (for i in 3
      (++ counter)
      (i * 2)
    ),
    (assert 3 (` counter),
    (assert 2 (` i),
    (assert 4 (` result),

    (let counter 0)
    (let result (for i in -3
      (++ counter)
      (i * 2)
    ),
    (assert 3 (` counter),
    (assert -2  (` i),
    (assert -4 (` result),

    (let counter 0)
    (let x 3)
    (let result (for i in x
      (++ counter)
      (i * 2)
    ),
    (assert 3 (` counter),
    (assert 2 (` i),
    (assert 4 (` result),

    (let counter 0)
    (let result (for i in (+ 2 1)
      (++ counter)
      (i * 2)
    ),
    (assert 3 (` counter),
    (assert 2 (` i),
    (assert 4 (` result),
).

($define "(for value in ($range x y)" (= ()
  ($should "iterate all values in the range [x y) by step 1" (= ()
    (let counter 0)
    (let result (for i in ($range 1 3)
      (++ counter)
      (i * 2)
    ),
    (assert 2 (` counter),
    (assert 2 (` i),
    (assert 4 (` result),

    (let counter 0)
    (let result (for i in ($range -1 -3)
      (++ counter)
      (i * 2)
    ),
    (assert 2 (` counter),
    (assert -2 (` i),
    (assert -4 (` result),
).

($define "(for value in ($range x y s)" (= ()
  ($should "iterate all values in the range [x y) by step s" (= ()
    (let counter 0)
    (let result (for i in ($range 1 5 2)
      (++ counter)
      (i * 2)
    ),
    (assert 2 (` counter),
    (assert 3 (` i),
    (assert 6 (` result),

    (let counter 0)
    (let result (for i in ($range -1 -4 -2)
      (++ counter)
      (i * 2)
    ),
    (assert 2 (` counter),
    (assert -3 (` i),
    (assert -6 (` result),
).

($define "(for value in array)" (= ()
  ($should "iterate all values in the array" (= ()
    (let counter 0)
    (let i -1)
    (let result (for i in (@)
      (++ counter)
      (i * 2)
    ),
    (assert 0 (` counter),
    (assert -1 (` i),
    (assert null (` result),

    (let counter 0)
    (let result (for i in (@ 2 4 6)
      (++ counter)
      (i * 2)
    ),
    (assert 3 (` counter),
    (assert 6 (` i),
    (assert 12 (` result),

    (let counter 0)
    (let result (for (k v) in (@ 2 4 6)
      (++ counter)
      (v * 2)
    ),
    (assert 3 (` counter),
    (assert 2 (` k),
    (assert 6 (` v),
    (assert 12 (` result),
).

($define "(for value in object)" (= ()
  ($should "iterate all properties in the object" (= ()
    (let counter 0)
    (let i -1)
    (let result (for i in (@>)
      (++ counter)
      (i * 2)
    ),
    (assert 0 (` counter),
    (assert -1 (` i),
    (assert null (` result),

    (let counter 0)
    (let result (for i in (@ p1: 1 p2: 2)
      (++ counter)
      (i * 2)
    ),
    (assert 2 (` counter)
    (assert 2 (` i)
    (assert 4 (` result)

    (let counter 0)
    (let result (for (k v) in (@ p1: 1 p2: 2)
      (++ counter)
      (v * 2)
    ),
    (assert 2 (` counter),
    (assert "p2" (` k),
    (assert 2 (` v),
    (assert 4 (` result),
).
