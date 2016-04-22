($define "function form" (=()
  ($should "return the symbol value of a string" (= ()
    (assert equal (` sym) ($symbol "sym"))
).

($define "operator form" (=()
  ($should "return the symbol value of a string" (= ()
    (assert equal (` sym) (symbol "sym"))
).

($define "keyOfSymbol" (=()
  ($should "return the string key of a symbol" (= ()
    (assert equal "sym" ($keyOfSymbol (` sym))
).

($define "Symbol object" (= ()
  ($should "be reserved" (= ()
    (assert equal "object" (typeof ($Symbol)))
).
