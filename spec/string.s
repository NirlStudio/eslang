($define "function form" (=()
  ($should "return the concatation of strings" (= ()
    (assert "" (` ($string),
    (assert "1" (` ($string "1"),
    (assert "12" (` ($string "1" "2"),
    (assert "123" (` ($string "1" "2" "3"),
  ),
  ($should "return the concatation of encoded values" (= ()
    (assert "true" (` ($string true),
    (assert "false" (` ($string false),

    (assert "1" (` ($string 1),
    (assert "1 2" (` ($string 1 2),
    (assert "1 2 3" (` ($string 1 2 3),
  ),
).

($define "operator form" (=()
  ($should "return the concatation of strings" (= ()
    (assert "" (` (string),
    (assert "1" (` (string "1"),
    (assert "12" (` (string "1" "2"),
    (assert "123" (` (string "1" "2" "3"),
  ),
  ($should "return the concatation of encoded values" (= ()
    (assert "true" (` (string true),
    (assert "false" (` (string false),

    (assert "1" (` (string 1),
    (assert "1 2" (` (string 1 2),
    (assert "1 2 3" (` (string 1 2 3),
  ),
).

($define "string of chars" (=()
  ($should "return the string of characters' code values" (= ()
    (assert "" (` (String of-char-codes),
    (assert "A" (` (String of-char-codes 65),
    (assert "AB" (` (String of-char-codes 65 66),
    (assert "ABC" (` (String of-char-codes 65 66 67),
).

($define "String object" (= ()
  ($should "be a type" (= ()
    (assert (` (String is-not-a Class),
    (assert (` (String is-a Type),
).
