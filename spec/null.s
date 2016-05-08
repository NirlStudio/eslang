($define "Null object" (= ()
  ($should "include function 'is'" (= ()
    (assert "function" (` (typeof (Null "is"),
  ),
  ($should "include function 'equals'" (= ()
    (assert "function" (` (typeof (Null "equals"),
  ),
  ($should "include function 'to-code'" (= ()
    (assert "function" (` (typeof (Null "to-string"),
  ),
  ($should "include function 'equals'" (= ()
    (assert "function" (` (typeof (Null "equals"),
  ),
  ($should "include function 'is-empty'" (= ()
    (assert "function" (` (typeof (Null "is-empty"),
  ),
  ($should "include function 'not-empty'" (= ()
    (assert "function" (` (typeof (Null "not-empty"),
  ),
).
