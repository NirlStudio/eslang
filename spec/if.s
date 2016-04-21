(let assert-exec (=> (code value) > ()
  (assert equal value ($exec code).

($define "test condition" (= ()
  (let code "(if 0 true false)")
  ($should code "return false" ($assert-exec code false),

  (let code "(if false true false)")
  ($should code "return false" ($assert-exec code false),

  (let code "(if null true false)")
  ($should code "return false" ($assert-exec code false),

  (let code "(if 1 true false)")
  ($should code "return true" ($assert-exec code true),

  (let code "(if \"\" true false)")
  ($should code "return true" ($assert-exec code true),

  (let code "(if \"0\" true false)")
  ($should code "return true" ($assert-exec code true),

  (let code "(if \"false\" true false)")
  ($should code "return true" ($assert-exec code true),

  (let code "(if (@) true false)")
  ($should code "return true" ($assert-exec code true),

  (let code "(if (@>) true false)")
  ($should code "return true" ($assert-exec code true),
).

($define "without else" (= ()
  (let code "(if)")
  ($should code "return null" ($assert-exec code null),

  (let code "(if true 1 0)")
  ($should code "return 1" ($assert-exec code 1),

  (let code "(if false 1 0)")
  ($should code "return 0" ($assert-exec code 0),

  (let code "(if true (+ 1) (+ 2) (+ 3).")
  ($should code "return 1" ($assert-exec code 1),

  (let code "(if false (+ 1) (+ 2) (+ 3).")
  ($should code "return 3" ($assert-exec code 3),
).

($define "with else" (= ()
  (let code "(if else true)")
  ($should code "return null" ($assert-exec code null),

  (let code "(if true else 0)")
  ($should code "return null" ($assert-exec code null),

  (let code "(if true 1 else 0)")
  ($should code "return 1" ($assert-exec code 1),

  (let code "(if false 1 else 0)")
  ($should code "return 0" ($assert-exec code 0),

  (let code "(if true (+ 1) (+ 2) else (+ 3).")
  ($should code "return 2" ($assert-exec code 2),

  (let code "(if false (+ 1) (+ 2) else (+ 3).")
  ($should code "return 3" ($assert-exec code 3),

  (let code "(if false (+ 1) (+ 2) else (+ 3) (+ 4).")
  ($should code "return 4" ($assert-exec code 4),

  (let code "(if false (+ 1) (+ 2) (+ 3) else).")
  ($should code "return null" ($assert-exec code null),
).
