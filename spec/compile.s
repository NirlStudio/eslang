($define "compiling errors" (= ()
  ($should "report an error if a TAB appears in the beginning of a line." (= ()
    (print code "----")
    (let out ($compile "(let x 1)\n\t(let y 2"),
    (print code "----" out)

    (assert (` (out is-a Array),
    (assert 1 (` (out length),
    (assert (` ((out:0) is-a Array),
    (assert 0 (` ((out:0) length),
  ),
  ($should "report an error if a string is not correctly closed" (= ()
    (print code "----")
    (let out ($compile "(let x \"something"),
    (print code "----")

    (assert (` (out is-a Array),
    (assert 1 (` (out length),
    (assert (` ((out:0) is-a Array),
    (assert 0 (` ((out:0) length),
  ),
).
