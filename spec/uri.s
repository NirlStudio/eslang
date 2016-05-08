($define "functions" (= ()
  ($should "include function 'encode'" (= ()
    (assert "function" (` (typeof (Uri "encode"),
  ),
  ($should "include function 'decode'" (= ()
    (assert "function" (` (typeof (Uri "decode"),
  ),
  ($should "include function 'escape'" (= ()
    (assert "function" (` (typeof (Uri "escape"),
  ),
  ($should "include function 'unescape'" (= ()
    (assert "function" (` (typeof (Uri "unescape"),
  ),
).
