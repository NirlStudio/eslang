(define "compiler" (= ()
  (should "(compiler ...) returns a function to receive code." (= ()
    (let compiling (compiler ),
    (assert (:compiling is-a function),
).

(define "compile" (= ()
  (should "(compile ...) returns a tuple." (= ()
    (let expr (compile "x y z"),
    (assert (expr is-a tuple),
    (assert ((expr length) is 3),
).
