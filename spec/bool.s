($define "function form" (= ()
  ($should "return false for false, zero and null" (= ()
    (assert equal false ($bool ))
    (assert equal false ($bool false))
    (assert equal false ($bool 0))
    (assert equal false ($bool null))
  ),
  ($should "return true for any other values" (= ()
    (assert equal true ($bool true),
    (assert equal true ($bool 1),
    (assert equal true ($bool -1),
    (assert equal true ($bool ""),
    (assert equal true ($bool "0"),
    (assert equal true ($bool "false"),
    (assert equal true ($bool (@),
    (assert equal true ($bool (object),
  ),
).

($define "operator form" (= ()
  ($should "return false for false, zero and null" (= ()
    (assert equal false (bool ))
    (assert equal false (bool false))
    (assert equal false (bool 0))
    (assert equal false (bool null))
  ),
  ($should "return true for any other values" (= ()
    (assert equal true (bool true),
    (assert equal true (bool 1),
    (assert equal true (bool -1),
    (assert equal true (bool ""),
    (assert equal true (bool "0"),
    (assert equal true (bool "false"),
    (assert equal true (bool (@),
    (assert equal true (bool (object),
  ),
).

($define "Bool object" (= ()
  ($should "be reserved" (= ()
    (assert equal "object" (typeof ($Bool)))
).
