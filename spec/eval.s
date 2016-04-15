# extend the feature definition function.
(let to (= (result cb)
  ($should (+ "be evaluated to " result) cb).

($define "a symbol" (= ()
  ($to "its value" (= ()
    (let x 123)
    (assert equal 123 ($eval (` x).

($define "an array" (= ()
  ($to "its final value as a piece of program" (= ()
    (let arr (@ (` +) 1 10),
    (assert equal 11 ($eval arr).

($define "other type of values" (= ()
  ($to "itself, incude string" (= ()
    (let str "string")
    (assert equal str ($eval str)
  ),
  ($to "itself, include number" (= ()
    (let num 12)
    (assert equal num ($eval num)
  ),
  ($to "itself, include boolean" (= ()
    (let b true)
    (assert equal true ($eval b)
  ),
  ($to "itself, include date" (= ()
    (let d ($date),
    (assert equal d ($eval d)
  ),
  ($to "itself, include function" (= ()
    (let f (= x (+ x 1),
    (assert equal f ($eval f)
  ),
  ($to "itself, include object" (= ()
    (let obj (@ p:0))
    (assert equal obj ($eval obj)
  ),
).
