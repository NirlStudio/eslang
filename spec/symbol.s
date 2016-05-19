
($define "Symbol object" (= ()
  ($should "exist with its members" (= ()
    (assert (` (Symbol is-a Type),
    (assert (` (Symbol is-not-a Class),
  ),
  ($should "(Symbol value-of )" "create an symbol for a key" (= ()
    (assert (Symbol Nothing) (` (Symbol value-of),
    (assert (Symbol Nothing) (` (Symbol value-of null),
    (assert (Symbol Nothing) (` (Symbol value-of 3),
    (assert (Symbol Nothing) (` (Symbol value-of (@),
    (assert (Symbol Nothing) (` (Symbol value-of (object),
    (assert (Symbol Nothing) (` (Symbol value-of (= x x),
    (assert (Symbol Nothing) (` (Symbol value-of ""),
    (assert (` sym) (` (Symbol value-of "sym"),
  ),
  ($should "(symbol key)" "retrieve the key of a symbol" (= ()
    (assert "" (` ((`) key),
    (assert "sym" (` ((` sym) key),
  ),
  ($should "(Symbol is-valid)" "return true for a valid symbol key." (= ()
    (assert true (` (Symbol is-valid "$"),
    (assert true (` (Symbol is-valid "`"),
    (assert true (` (Symbol is-valid "@"),
    (assert true (` (Symbol is-valid ":"),
    (assert true (` (Symbol is-valid "sym"),

    (assert false (` (Symbol is-valid "sym("),
    (assert false (` (Symbol is-valid "(sym"),
    (assert false (` (Symbol is-valid "s(ym"),

    (assert false (` (Symbol is-valid "s)ym"),
    (assert false (` (Symbol is-valid "s$ym"),
    (assert false (` (Symbol is-valid "s`ym"),
    (assert false (` (Symbol is-valid "s'ym"),
    (assert false (` (Symbol is-valid "s@ym"),
    (assert false (` (Symbol is-valid "s:ym"),
    (assert false (` (Symbol is-valid "s\"ym"),
    (assert false (` (Symbol is-valid "s#ym"),
    (assert false (` (Symbol is-valid "s\\ym"),
    (assert false (` (Symbol is-valid "s\rym"),
    (assert false (` (Symbol is-valid "s\nym"),
    (assert false (` (Symbol is-valid "s\tym"),
    (assert false (` (Symbol is-valid "s ym"),
  ),
).

($define "function form" (=()
  ($should "return the symbol value of a string" (= ()
    (assert "sym" (` (($symbol "sym") key),
    (assert (` $) (` ($symbol "$"),
    (assert (` `) (` ($symbol "`"),
    (assert (` @) (` ($symbol "@"),
    (assert (` :) (` ($symbol ":"),

    (assert (Symbol Nothing) (` ($symbol "sym("),
    (assert (Symbol Nothing) (` ($symbol "(sym"),
    (assert (Symbol Nothing) (` ($symbol "s(ym"),

    (assert (Symbol Nothing) (` ($symbol "s)ym"),
    (assert (Symbol Nothing) (` ($symbol "s$ym"),
    (assert (Symbol Nothing) (` ($symbol "s`ym"),
    (assert (Symbol Nothing) (` ($symbol "s'ym"),
    (assert (Symbol Nothing) (` ($symbol "s@ym"),
    (assert (Symbol Nothing) (` ($symbol "s:ym"),
    (assert (Symbol Nothing) (` ($symbol "s\"ym"),
    (assert (Symbol Nothing) (` ($symbol "s#ym"),
    (assert (Symbol Nothing) (` ($symbol "s\\ym"),
    (assert (Symbol Nothing) (` ($symbol "s\rym"),
    (assert (Symbol Nothing) (` ($symbol "s\nym"),
    (assert (Symbol Nothing) (` ($symbol "s\tym"),
    (assert (Symbol Nothing) (` ($symbol "s ym"),
).

($define "operator form" (=()
  ($should "return the symbol value of a string" (= ()
    (assert "sym" (` ((symbol "sym") key),
    (assert (` $) (` (symbol "$"),
    (assert (` `) (` (symbol "`"),
    (assert (` @) (` (symbol "@"),
    (assert (` :) (` (symbol ":"),

    (assert (Symbol Nothing) (` (symbol "sym("),
    (assert (Symbol Nothing) (` (symbol "(sym"),
    (assert (Symbol Nothing) (` (symbol "s(ym"),

    (assert (Symbol Nothing) (` (symbol "s)ym"),
    (assert (Symbol Nothing) (` (symbol "s$ym"),
    (assert (Symbol Nothing) (` (symbol "s`ym"),
    (assert (Symbol Nothing) (` (symbol "s'ym"),
    (assert (Symbol Nothing) (` (symbol "s@ym"),
    (assert (Symbol Nothing) (` (symbol "s:ym"),
    (assert (Symbol Nothing) (` (symbol "s\"ym"),
    (assert (Symbol Nothing) (` (symbol "s#ym"),
    (assert (Symbol Nothing) (` (symbol "s\\ym"),
    (assert (Symbol Nothing) (` (symbol "s\rym"),
    (assert (Symbol Nothing) (` (symbol "s\nym"),
    (assert (Symbol Nothing) (` (symbol "s\tym"),
    (assert (Symbol Nothing) (` (symbol "s ym"),
).
