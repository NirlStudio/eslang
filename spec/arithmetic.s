($define "and: +" (= ()
  ($should "return the sum of arugment values" (= ()
    (assert 0 (` (+),
    (assert 1 (` (+ 1),
    (assert 3 (` (+ 1 2),
    (assert 55 (` (+ 1 2 3 4 5 6 7 8 9 10),

    (assert 1 (` (+ 1 ""),
    (assert 1 (` (+ 1 "1"),
    (assert 1 (` (+ 1 (@),
).

(let mVar1 20)
($define "and & save: +=" (= ()
  ($should "return the sum of argument values and assign it to the first\
            arugment if it's a symbol" (= ()
    (let num 1)
    (assert 11 (` (+= num 10),
    (assert 11 (` num),

    (assert 30 (` (+= mVar1 10),
    (assert 30 (` mVar1),
).

($define "subtract: -" (= ()
  ($should "return the difference of the first argument and all other arguments" (= ()
    (assert 0 (` (-),
    (assert 1 (` (- 1),
    (assert -1 (` (- 1 2),
    (assert -4 (` (- 1 2 3),

    (assert 1 (` (- 1 ""),
    (assert 1 (` (- 1 "1"),
    (assert 1 (` (- 1 (@),
).

(let mVar2 20)
($define "subtract & save: -=" (= ()
  ($should "return the difference of the first argument and all other arguments,\
            and assign it to the first arugment if it's a symbol" (= ()
    (let num 1)
    (assert -9 (` (-= num 10),
    (assert -9 (` num),

    (assert 19 (` (-= mVar2 1),
    (assert 19 (` mVar2),
).

($define "multiply: *" (= ()
  ($should "return the product of arguments" (= ()
    (assert 0 (` (*),
    (assert 1 (` (* 1),
    (assert 2 (` (* 1 2),
    (assert 6 (` (* 1 2 3),

    (assert 0 (` (* 1 ""),
    (assert 0 (` (* 1 "1"),
    (assert 0 (` (* 1 (@),
).

(let mVar3 20)
($define "multiply & save: *=" (= ()
  ($should "return the product of arguments, and assign it to the first \
            arugment if it's a symbol" (= ()
    (let num 2)
    (assert 20 (` (*= num 10),
    (assert 20 (` num),

    (assert 200 (` (*= mVar3 10),
    (assert 200 (` mVar3),
).

($define "divide: /" (= ()
  ($should "return the quotient of dividing the first argument by other arguments" (= ()
    (assert 0 (` (/),
    (assert 1 (` (/ 1),
    (assert false (` (Number is-finite (/ 1 0),
    (assert 2 (` (/ 4 2),
    (assert 3 (` (/ 18 2 3),

    (assert true (` (Number is-not (/ 1 ""),
    (assert true (` (Number is-not (/ 1 "1"),
    (assert true (` (Number is-not (/ 1 (@),
).

(let mVar4 20)
($define "divide & save: /=" (= ()
  ($should "return the quotient of dividing the first argument by other arguments, \
            and assign it to the first arugment if it's a symbol" (= ()
    (let num 20)
    (assert 2 (` (/= num 10),
    (assert 2 (` num),

    (assert 10 (` (/= mVar4 2),
    (assert 10 (` mVar4),
).

(let mVar5 20)
($define "self increment: ++" (= ()
  ($should "return the quotient of dividing the first argument by other arguments, \
            and assign it to the first arugment if it's a symbol" (= ()
    (assert 1 (` (++),
    (assert 1 (` (++ ""),
    (assert 1 (` (++ (@),

    (let num 1)
    (assert 2 (` (++ num),
    (assert 2 (` num),

    (assert 21 (` (++ mVar5),
    (assert 21 (` mVar5),
).

(let mVar6 20)
($define "self decrement: --" (= ()
  ($should "return the quotient of dividing the first argument by other arguments, \
            and assign it to the first arugment if it's a symbol" (= ()
    (assert -1 (` (--),
    (assert -1 (` (-- ""),
    (assert -1 (` (-- (@),

    (let num 1)
    (assert 0 (` (-- num),
    (assert 0 (` num),

    (assert 19 (` (-- mVar6 10),
    (assert 19 (` mVar6),
).
