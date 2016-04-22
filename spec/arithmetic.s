($define "and: +" (= ()
  ($should "return the sum of arugment values" (= ()
    (assert equal 0 (+),
    (assert equal 1 (+ 1),
    (assert equal 3 (+ 1 2),
    (assert equal 55 (+ 1 2 3 4 5 6 7 8 9 10),

    (assert equal 1 (+ 1 ""),
    (assert equal 1 (+ 1 "1"),
    (assert equal 1 (+ 1 (@)),
).

($define "and & save: +=" (= ()
  ($should "return the sum of argument values and assign it to the first\
            arugment if it's a symbol" (= ()
    (let num 1)
    (assert equal 11 (+= num 10),
    (assert equal 11 num),
).

($define "subtract: -" (= ()
  ($should "return the difference of the first argument and all other arguments" (= ()
    (assert equal 0 (-),
    (assert equal 1 (- 1),
    (assert equal -1 (- 1 2),
    (assert equal -4 (- 1 2 3),

    (assert equal 1 (- 1 ""),
    (assert equal 1 (- 1 "1"),
    (assert equal 1 (- 1 (@)),
).

($define "subtract & save: -=" (= ()
  ($should "return the difference of the first argument and all other arguments,\
            and assign it to the first arugment if it's a symbol" (= ()
    (let num 1)
    (assert equal -9 (-= num 10),
    (assert equal -9 num),
).

($define "multiply: *" (= ()
  ($should "return the product of arguments" (= ()
    (assert equal 0 (*),
    (assert equal 1 (* 1),
    (assert equal 2 (* 1 2),
    (assert equal 6 (* 1 2 3),

    (assert equal 0 (* 1 ""),
    (assert equal 0 (* 1 "1"),
    (assert equal 0 (* 1 (@)),
).

($define "multiply & save: *=" (= ()
  ($should "return the product of arguments, and assign it to the first \
            arugment if it's a symbol" (= ()
    (let num 2)
    (assert equal 20 (*= num 10),
    (assert equal 20 num),
).

($define "divide: /" (= ()
  ($should "return the quotient of dividing the first argument by other arguments" (= ()
    (assert equal 0 (/),
    (assert equal 1 (/ 1),
    (assert equal (Number "Infinity") (/ 1 0),
    (assert equal 2 (/ 4 2),
    (assert equal 3 (/ 18 2 3),

    (assert equal (Number "Infinity") (/ 1 ""),
    (assert equal (Number "Infinity") (/ 1 "1"),
    (assert equal (Number "Infinity") (/ 1 (@)),
).

($define "divide & save: /=" (= ()
  ($should "return the quotient of dividing the first argument by other arguments, \
            and assign it to the first arugment if it's a symbol" (= ()
    (let num 20)
    (assert equal 2 (/= num 10),
    (assert equal 2 num),
).

($define "self increment: ++" (= ()
  ($should "return the quotient of dividing the first argument by other arguments, \
            and assign it to the first arugment if it's a symbol" (= ()
    (assert equal 1 (++),
    (assert equal 1 (++ ""),
    (assert equal 1 (++ (@)),

    (let num 1)
    (assert equal 2 (++ num),
    (assert equal 2 num),
).

($define "self decrement: --" (= ()
  ($should "return the quotient of dividing the first argument by other arguments, \
            and assign it to the first arugment if it's a symbol" (= ()
    (assert equal -1 (--),
    (assert equal -1 (-- ""),
    (assert equal -1 (-- (@)),

    (let num 1)
    (assert equal 0 (-- num),
    (assert equal 0 num),
).
