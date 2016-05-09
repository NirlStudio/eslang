($define "invalid forms" (= ()
  ($should "Missing/invalid parameters" "return null" (= ()
    (assert null (` (= ),
    (assert null (` (= ""),
    (assert null (` (= null),
    (assert null (` (= true),

    (assert null (` (= x > ),
    (assert null (` (= x > ""),
    (assert null (` (= x > null),
    (assert null (` (= x > true),

    (assert null (` (=> ),
    (assert null (` (=> ""),
    (assert null (` (=> null),
    (assert null (` (=> true),

    (assert null (` ((=> x > ) call),
    (assert null (` ((=> x > "") call),
    (assert null (` ((=> x > null) call),
    (assert null (` ((=> x > true) call),
  ),

  ($should "Missing body" "return null" (= ()
    (assert null (` (= x ),

    (assert null (` (= x > y),

    (assert null (` (=> x ),
    (assert null (` ((=> x > x) call),
  ),
).

(let assert-exec (=> (code value) > ()
  (assert value (` ($exec code)
).

($define "function" (= ()
  ($define "operator: =" (= ()
    (let code "($ (= () (+ 10 10)) 10)."),
    ($should code "return 20" ($assert-exec code 20),

    (let code "($ (= x (+ x 10)) 10)."),
    ($should code "return 20" ($assert-exec code 20),

    (let code "($ (= (x) (+ x 10)) 10)."),
    ($should code "return 20" ($assert-exec code 20),

    (let code "($ (= (x y) (+ x y 10)) 10 10)."),
    ($should code "return 30" ($assert-exec code 30),
  ),

  ($define "operator: function" (= ()
    (let code "($ (function () (+ 10 10)) 10)."),
    ($should code "return 20" ($assert-exec code 20),

    (let code "($ (function x (+ x 10)) 10)."),
    ($should code "return 20" ($assert-exec code 20),

    (let code "($ (function (x) (+ x 10)) 10)."),
    ($should code "return 20" ($assert-exec code 20),

    (let code "($ (function (x y) (+ x y 10)) 10)."),
    ($should code "return 20" ($assert-exec code 20),
  ),
).

($define "closure" (= ()
  ($define "operator: = ... > ..." (= ()
    (let code "($ (= () > (x y) (+ x y 1000)) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code "(let base 1000)($ (= base > (x y) (+ x y base)) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code (+"(let (bx 1000) (by 100))"
      "($ (= (bx by) > (x y) (+ x y bx by)) 10 10).")
    ),
    ($should code "return 1120" ($assert-exec code 1120),

    (let code "($ (= (@ bx: 1000 by: 100) > (x y) (+ x y bx by)) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),
  ),
  ($define "operator: closure ... > ..." (= ()
    (let code "($ (closure () > (x y) (+ x y 1000)) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code "(let base 1000)($ (closure base > (x y) (+ x y base)) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code (+"(let (bx 1000) (by 100))"
      "($ (closure (bx by) > (x y) (+ x y bx by)) 10 10).")
    ),
    ($should code "return 1120" ($assert-exec code 1120),

    (let code "($ (closure (@ bx: 1000 by: 100) > (x y) (+ x y bx by)) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),
  ),
).

($define "high-order function" (= ()
  ($define "operator: =>" (= ()
    (let code "($ ($(=> () > (x y) (+ x y 100)) 1000) 10 10)."),
    ($should code "return 120" ($assert-exec code 120),

    (let code "($ ($(=> base > (x y) (+ x y base)) 1000) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code "($ ($(=> (base) > (x y) (+ x y base)) 1000) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code "($ ($(=> (bx by) > (x y) (+ x y bx by)) 1000 100) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),
  ),
  ($define "operator: = >" (= ()
    (let code "($ ($(= > () > (x y) (+ x y 100)) 1000) 10 10)."),
    ($should code "return 120" ($assert-exec code 120),

    (let code "($ ($(= > base > (x y) (+ x y base)) 1000) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code "($ ($(= > (base) > (x y) (+ x y base)) 1000) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code "($ ($(= > (bx by) > (x y) (+ x y bx by)) 1000 100) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),
  ),
  ($define "operator: lambda" (= ()
    (let code "($ ($(lambda () > (x y) (+ x y 100)) 1000) 10 10)."),
    ($should code "return 120" ($assert-exec code 120),

    (let code "($ ($(lambda base > (x y) (+ x y base)) 1000) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code "($ ($(lambda (base) > (x y) (+ x y base)) 1000) 10 10)."),
    ($should code "return 1020" ($assert-exec code 1020),

    (let code "($ ($(lambda (bx by) > (x y) (+ x y bx by)) 1000 100) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),
  ),
).

($define "high-order closure" (= ()
  ($define "operator: = ... > ... >" (= ()
    (let code "($ ($(= () > () > (x y) (+ x y 100)) 1000) 10 10)."),
    ($should code "return 120" ($assert-exec code 120),

    (let code "($ ($(= (@z:100) > base > (x y) (+ x y z base)) 1000) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),

    (let code "($ ($(= (@z:100) > (base) > (x y) (+ x y z base)) 1000) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),

    (let code "($ ($(= (@z:100) > (bx by) > (x y) (+ x y z bx by)) 1000 100) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1220),

    (let code "($($($(= (@z:100) > (bx) > (by) > (x y) (+ x y z bx by)) 1000) 100) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1220),

    (let code "($($($($(= (@z:100) > (bx) > (by) > (bz) > (x y) (+ x y z bx by bz)) 1000) 100) 1) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1221),
  ),
  ($define "operator: function ... > ... >" (= ()
    (let code "($ ($(function () > () > (x y) (+ x y 100)) 1000) 10 10)."),
    ($should code "return 120" ($assert-exec code 120),

    (let code "($ ($(function (@z:100) > base > (x y) (+ x y z base)) 1000) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),

    (let code "($ ($(function (@z:100) > (base) > (x y) (+ x y z base)) 1000) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),

    (let code "($ ($(function (@z:100) > (bx by) > (x y) (+ x y z bx by)) 1000 100) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1220),

    (let code "($($($(function (@z:100) > (bx) > (by) > (x y) (+ x y z bx by)) 1000) 100) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1220),

    (let code "($($($($(function (@z:100) > (bx) > (by) > (bz) > (x y) (+ x y z bx by bz)) 1000) 100) 1) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1221),
  ),
  ($define "operator: closure ... > ... >" (= ()
    (let code "($ ($(closure () > () > (x y) (+ x y 100)) 1000) 10 10)."),
    ($should code "return 120" ($assert-exec code 120),

    (let code "($ ($(closure (@z:100) > base > (x y) (+ x y z base)) 1000) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),

    (let code "($ ($(closure (@z:100) > (base) > (x y) (+ x y z base)) 1000) 10 10)."),
    ($should code "return 1120" ($assert-exec code 1120),

    (let code "($ ($(closure (@z:100) > (bx by) > (x y) (+ x y z bx by)) 1000 100) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1220),

    (let code "($($($(closure (@z:100) > (bx) > (by) > (x y) (+ x y z bx by)) 1000) 100) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1220),

    (let code "($($($($(closure (@z:100) > (bx) > (by) > (bz) > (x y) (+ x y z bx by bz)) 1000) 100) 1) 10 10)."),
    ($should code "return 1220" ($assert-exec code 1221),
  ),
).

($define "(func apply subject args)" (= ()
  ($should "execute a function with a subject and arguments from an array" (= ()
    (let f (= (*) (@ s: ($ ":") argc: argc argv: argv),
    (let r (f apply),
    (assert null (` (r s),
    (assert 0 (` (r argc),

    (let s (object),
    (let args (@ 1 2),
    (let r (f apply s args),
    (assert (` (is s (r s),
    (assert 2 (` (r argc),
    (assert 1 (` ((r argv):0),
    (assert 2 (` (-> r argv (:1),
).

($define "Function object" (= ()
  ($should "be reserved" (= ()
    (assert "object" (` (typeof ($Function),
).
