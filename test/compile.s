($define "compiling errors" (= ()
  ($should "report an error if a TAB appears in the beginning of a line." (= ()
    (let out ($compile "(let x 1)\n\t(let y 2"),
    (print program out)

    (assert equal "array" (typeof out),
    (assert equal 1 (out length),
    (assert equal "array" (typeof (out:0),
    (assert equal 0 ((out:0) length),
  ),
  ($should "report an error if a string is not correctly closed" (= ()
    (let out ($compile "(let x \"something"),
    (print program out)

    (assert equal "array" (typeof out),
    (assert equal 1 (out length),
    (assert equal "array" (typeof (out:0),
    (assert equal 0 ((out:0) length),
  ),
).
