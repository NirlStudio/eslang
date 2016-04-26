
($define "Symbol object" (= ()
  ($should "exist with its members" (= ()
    (assert equal "object" (typeof ($Symbol),
    (assert equal "symbol" (typeof (Symbol Nothing),
    (assert equal "function" (typeof (Symbol "for"),
    (assert equal "function" (typeof (Symbol "keyFor"),
    (assert equal "function" (typeof (Symbol "isKey"),
    (assert equal "function" (typeof (Symbol "is"),
  ),
  ($should "(Symbol for)" "create an symbol for a key" (= ()
    assert equal (Symbol Nothing) (Symbol for),
    assert equal (Symbol Nothing) (Symbol for null),
    assert equal (Symbol Nothing) (Symbol for 3),
    assert equal (Symbol Nothing) (Symbol for (@)),
    assert equal (Symbol Nothing) (Symbol for (object)),
    assert equal (Symbol Nothing) (Symbol for (= x x)),
    assert equal (Symbol Nothing) (Symbol for ""),
    assert equal (` sym) (Symbol for "sym"),
  ),
  ($should "(Symbol keyFor)" "retrieve the key for a symbol" (= ()
    assert equal "" (Symbol keyFor),
    assert equal "" (Symbol keyFor null),
    assert equal "" (Symbol keyFor 3),
    assert equal "" (Symbol keyFor (@)),
    assert equal "" (Symbol keyFor (object)),
    assert equal "" (Symbol keyFor (= x x)),
    assert equal "" (Symbol keyFor "symbol"),
    assert equal "" (Symbol keyFor (Symbol Nothing)),
    assert equal "sym" (Symbol keyFor (` sym),
  ),
  ($should "(Symbol isKey)" "return true for a valid symbol key." (= ()
    (assert equal true (Symbol isKey "$"))
    (assert equal true (Symbol isKey "`"))
    (assert equal true (Symbol isKey "@"))
    (assert equal true (Symbol isKey ":"))
    (assert equal true (Symbol isKey "sym"))

    (assert equal false (Symbol isKey "sym("))
    (assert equal false (Symbol isKey "(sym"))
    (assert equal false (Symbol isKey "s(ym"))

    (assert equal false (Symbol isKey "s)ym"))
    (assert equal false (Symbol isKey "s$ym"))
    (assert equal false (Symbol isKey "s`ym"))
    (assert equal false (Symbol isKey "s'ym"))
    (assert equal false (Symbol isKey "s@ym"))
    (assert equal false (Symbol isKey "s:ym"))
    (assert equal false (Symbol isKey "s\"ym"))
    (assert equal false (Symbol isKey "s#ym"))
    (assert equal false (Symbol isKey "s\\ym"))
    (assert equal false (Symbol isKey "s\rym"))
    (assert equal false (Symbol isKey "s\nym"))
    (assert equal false (Symbol isKey "s\tym"))
    (assert equal false (Symbol isKey "s ym"))
  ),
  ($should "(Symbol is)" "return true for a symbol." (= ()
    (assert equal true (Symbol is (Symbol Nothing),
    (assert equal true (Symbol is (` sym),

    (assert equal false (Symbol is),
    (assert equal false (Symbol is null),
    (assert equal false (Symbol is true),
    (assert equal false (Symbol is false),
    (assert equal false (Symbol is 2),
    (assert equal false (Symbol is ""),
    (assert equal false (Symbol is "symbol"),
    (assert equal false (Symbol is (@)),
    (assert equal false (Symbol is (object)),
    (assert equal false (Symbol is (= x x),
  ),
).

($define "function form" (=()
  ($should "return the symbol value of a string" (= ()
    (assert equal "sym" (Symbol keyFor ($symbol "sym"),
    (assert equal (` $) ($symbol "$"))
    (assert equal (` `) ($symbol "`"))
    (assert equal (` @) ($symbol "@"))
    (assert equal (` :) ($symbol ":"))

    (assert equal (Symbol Nothing) ($symbol "sym("))
    (assert equal (Symbol Nothing) ($symbol "(sym"))
    (assert equal (Symbol Nothing) ($symbol "s(ym"))

    (assert equal (Symbol Nothing) ($symbol "s)ym"))
    (assert equal (Symbol Nothing) ($symbol "s$ym"))
    (assert equal (Symbol Nothing) ($symbol "s`ym"))
    (assert equal (Symbol Nothing) ($symbol "s'ym"))
    (assert equal (Symbol Nothing) ($symbol "s@ym"))
    (assert equal (Symbol Nothing) ($symbol "s:ym"))
    (assert equal (Symbol Nothing) ($symbol "s\"ym"))
    (assert equal (Symbol Nothing) ($symbol "s#ym"))
    (assert equal (Symbol Nothing) ($symbol "s\\ym"))
    (assert equal (Symbol Nothing) ($symbol "s\rym"))
    (assert equal (Symbol Nothing) ($symbol "s\nym"))
    (assert equal (Symbol Nothing) ($symbol "s\tym"))
    (assert equal (Symbol Nothing) ($symbol "s ym"))
).

($define "operator form" (=()
  ($should "return the symbol value of a string" (= ()
    (assert equal "sym" (Symbol keyFor (symbol "sym"))
    (assert equal (` $) (symbol "$"))
    (assert equal (` `) (symbol "`"))
    (assert equal (` @) (symbol "@"))
    (assert equal (` :) (symbol ":"))

    (assert equal (Symbol Nothing) (symbol "sym("))
    (assert equal (Symbol Nothing) (symbol "(sym"))
    (assert equal (Symbol Nothing) (symbol "s(ym"))

    (assert equal (Symbol Nothing) (symbol "s)ym"))
    (assert equal (Symbol Nothing) (symbol "s$ym"))
    (assert equal (Symbol Nothing) (symbol "s`ym"))
    (assert equal (Symbol Nothing) (symbol "s'ym"))
    (assert equal (Symbol Nothing) (symbol "s@ym"))
    (assert equal (Symbol Nothing) (symbol "s:ym"))
    (assert equal (Symbol Nothing) (symbol "s\"ym"))
    (assert equal (Symbol Nothing) (symbol "s#ym"))
    (assert equal (Symbol Nothing) (symbol "s\\ym"))
    (assert equal (Symbol Nothing) (symbol "s\rym"))
    (assert equal (Symbol Nothing) (symbol "s\nym"))
    (assert equal (Symbol Nothing) (symbol "s\tym"))
    (assert equal (Symbol Nothing) (symbol "s ym"))
).
