($define "function form" (=()
  ($should "return the concatation of strings" (= ()
    (assert equal "" ($string))
    (assert equal "1" ($string "1"))
    (assert equal "12" ($string "1" "2"))
    (assert equal "123" ($string "1" "2" "3"))
  ),
  ($should "return the concatation of encoded values" (= ()
    (assert equal "true" ($string true))
    (assert equal "false" ($string false))

    (assert equal "1" ($string 1))
    (assert equal "1 2" ($string 1 2))
    (assert equal "1 2 3" ($string 1 2 3))
  ),
).

($define "operator form" (=()
  ($should "return the concatation of strings" (= ()
    (assert equal "" (string))
    (assert equal "1" (string "1"))
    (assert equal "12" (string "1" "2"))
    (assert equal "123" (string "1" "2" "3"))
  ),
  ($should "return the concatation of encoded values" (= ()
    (assert equal "true" (string true))
    (assert equal "false" (string false))

    (assert equal "1" (string 1))
    (assert equal "1 2" (string 1 2))
    (assert equal "1 2 3" (string 1 2 3))
  ),
).

($define "stringOfChars" (=()
  ($should "return the string of characters" (= ()
    (assert equal "" ($stringOfChars)
    (assert equal "A" ($stringOfChars 65)
    (assert equal "AB" ($stringOfChars 65 66)
).

($define "String object" (= ()
  ($should "be reserved" (= ()
    (assert equal true (typeof ($String) "object"),
).
