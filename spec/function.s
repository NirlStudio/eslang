($define "invalid forms" (= ()
  ($should "Missing parameters" "return null" (= ()
    (assert equal null ($exec "(= )")
  ),

  ($should "Missing body" "return null" (= ()
    (assert equal null ($exec "(= x)")
  ),
).

(let assert-exec (=> (code value) > ()
  (assert equal value ($exec code)
).

($define "basic forms" (= ()
  (let code "($ (= x (+ x 10)) 10)."),
  ($should code "return 20" ($assert-exec code 20),

  (let code "($ (function x (+ x 10)) 10)."),
  ($should code "return 20" ($assert-exec code 20),

  (let code "($ (= (x y) (+ x y 10)) 10 10)."),
  ($should code "return 30" ($assert-exec code 30),

  (let code "($ (function (x y) (+ x y 10)) 10)."),
  ($should code "return 20" ($assert-exec code 20),
).

($define "closure forms" (= ()
  (let code "(let base 1000)($ (= base > (x y) (+ x y base)) 10 10)."),
  ($should code "return 1020" ($assert-exec code 1020),

  (let code (+"(let (bx 1000) (by 100))"
    "($ (= (bx by) > (x y) (+ x y bx by)) 10 10).")
  ),
  ($should code "return 1120" ($assert-exec code 1120),

  (let code "(let base 1000)($ (closure base > (x y) (+ x y base)) 10 10)."),
  ($should code "return 1020" ($assert-exec code 1020),

  (let code (+"(let (bx 1000) (by 100))"
    "($ (closure (bx by) > (x y) (+ x y bx by)) 10 10).")
  ),
  ($should code "return 1120" ($assert-exec code 1120),
).

($define "lambda(high-order function) forms" (= ()
  (let code "($ ($(=> base > (x y) (+ x y base)) 1000) 10 10)."),
  ($should code "return 1020" ($assert-exec code 1020),

  (let code "($ ($(=> (bx by) > (x y) (+ x y bx by)) 1000 100) 10 10)."),
  ($should code "return 1120" ($assert-exec code 1120),

  (let code "($ ($(lambda base > (x y) (+ x y base)) 1000) 10 10)."),
  ($should code "return 1020" ($assert-exec code 1020),

  (let code "($ ($(lambda (bx by) > (x y) (+ x y bx by)) 1000 100) 10 10)."),
  ($should code "return 1120" ($assert-exec code 1120),
).

($define "Function object" (= ()
  ($should "be reserved" (= ()
    (assert equal "object" (typeof ($Function)))
).
