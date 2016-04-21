($define "(for value in x)" (= ()
  ($should "iterate all values in range [0 x) by step 1" (= ()
    (let counter 0)
    (let result (for i in 3
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 3)
    (assert equal i 2)
    (assert equal result 4)

    (let counter 0)
    (let result (for i in -3
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 3)
    (assert equal i -2)
    (assert equal result -4)

    (let counter 0)
    (let x 3)
    (let result (for i in x
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 3)
    (assert equal i 2)
    (assert equal result 4)

    (let counter 0)
    (let result (for i in (+ 2 1)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 3)
    (assert equal i 2)
    (assert equal result 4)
).

($define "(for value in ($range x y)" (= ()
  ($should "iterate all values in the range [x y) by step 1" (= ()
    (let counter 0)
    (let result (for i in ($range 1 3)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 2)
    (assert equal i 2)
    (assert equal result 4)

    (let counter 0)
    (let result (for i in ($range -1 -3)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 2)
    (assert equal i -2)
    (assert equal result -4)
).

($define "(for value in ($range x y s)" (= ()
  ($should "iterate all values in the range [x y) by step s" (= ()
    (let counter 0)
    (let result (for i in ($range 1 5 2)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 2)
    (assert equal i 3)
    (assert equal result 6)

    (let counter 0)
    (let result (for i in ($range -1 -4 -2)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 2)
    (assert equal i -3)
    (assert equal result -6)
).

($define "(for value in array)" (= ()
  ($should "iterate all values in the array" (= ()
    (let counter 0)
    (let i -1)
    (let result (for i in (@)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 0)
    (assert equal i -1)
    (assert equal result null)

    (let counter 0)
    (let result (for i in (@ 2 4 6)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 3)
    (assert equal i 6)
    (assert equal result 12)

    (let counter 0)
    (let result (for (k v) in (@ 2 4 6)
      (++ counter)
      (* v 2)
    ),
    (assert equal counter 3)
    (assert equal k 2)
    (assert equal v 6)
    (assert equal result 12)
).

($define "(for value in object)" (= ()
  ($should "iterate all values in the object" (= ()
    (let counter 0)
    (let i -1)
    (let result (for i in (@>)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 0)
    (assert equal i -1)
    (assert equal result null)

    (let counter 0)
    (let result (for i in (@ p1: 1 p2: 2)
      (++ counter)
      (* i 2)
    ),
    (assert equal counter 2)
    (assert equal i 2)
    (assert equal result 4)

    (let counter 0)
    (let result (for (k v) in (@ p1: 1 p2: 2)
      (++ counter)
      (* v 2)
    ),
    (assert equal counter 2)
    (assert equal k "p2")
    (assert equal v 2)
    (assert equal result 4)
).
