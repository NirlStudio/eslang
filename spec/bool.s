($define "function form" (= ()
  ($should "return false for false, zero and null" (= ()
    (assert false (` ($bool ),
    (assert false (` ($bool false),
    (assert false (` ($bool 0),
    (assert false (` ($bool null),
  ),
  ($should "return true for any other values" (= ()
    (assert true (` ($bool true),
    (assert true (` ($bool 1),
    (assert true (` ($bool -1),
    (assert true (` ($bool ""),
    (assert true (` ($bool "0"),
    (assert true (` ($bool "false"),
    (assert true (` ($bool (@),
    (assert true (` ($bool (object),
  ),
).

($define "operator form" (= ()
  ($should "return false for false, zero and null" (= ()
    (assert false (` (bool ),
    (assert false (` (bool false),
    (assert false (` (bool 0),
    (assert false (` (bool null),
  ),
  ($should "return true for any other values" (= ()
    (assert true (` (bool true),
    (assert true (` (bool 1),
    (assert true (` (bool -1),
    (assert true (` (bool ""),
    (assert true (` (bool "0"),
    (assert true (` (bool "false"),
    (assert true (` (bool (@),
    (assert true (` (bool (object),
  ),
).

($define "Bool object" (= ()
  ($should "be reserved" (= ()
    (assert "object" (` (typeof ($Bool),
).
