($define "(encode value some-value)" (= ()
  ($should "null" "be encoded to \"null\"" (= ()
    (assert "null" (` (encode value null),
  ),

  ($should "a string" "be encoded to \"...\"" (= ()
    (assert "\"ab\\\"12\"" (` (encode value "ab\"12"),

    (assert "null" (` (encode string),
    (assert "null" (` (encode string null),
    (assert "\"\"" (` (encode string false),
    (assert "\"\"" (` (encode string 12),
    (assert "\"\"" (` (encode string (date 1234),
    (assert "\"\"" (` (encode string (` sym),
    (assert "\"\"" (` (encode string (@),
    (assert "\"\"" (` (encode string (object),
    (assert "\"\"" (` (encode string (= x x),
  ),

  ($should "a symbol" "be encoded to its key" (= ()
    (assert "(` sym)" (` (encode value (` sym),

    (assert "null" (` (encode symbol),
    (assert "null" (` (encode symbol null),
    (assert "" (` (encode symbol false),
    (assert "" (` (encode symbol 12),
    (assert "" (` (encode symbol (date 1234),
    (assert "" (` (encode symbol ""),
    (assert "" (` (encode symbol "abc"),
    (assert "" (` (encode symbol (@),
    (assert "" (` (encode symbol (object),
    (assert "" (` (encode symbol (= x x),
  ),

  ($should "a number" "be encoded to its value" (= ()
    (assert "-1" (` (encode value -1),
    (assert "0" (` (encode value -0),
    (assert "1" (` (encode value 1),
    (assert "1.987" (` (encode value 1.987),

    (assert "null" (` (encode number),
    (assert "null" (` (encode number null),
    (assert "NaN" (` (encode number false),
    (assert "NaN" (` (encode number (date 1234),
    (assert "NaN" (` (encode number ""),
    (assert "NaN" (` (encode number "abc"),
    (assert "NaN" (` (encode number (@),
    (assert "NaN" (` (encode number (object),
    (assert "NaN" (` (encode number (= x x),
  ),

  ($should "a boolean value" "be encoded to true or false" (= ()
    (assert "true" (` (encode value true),
    (assert "false" (` (encode value false),

    (assert "null" (` (encode bool),
    (assert "null" (` (encode bool null),
    (assert "false" (` (encode bool 12),
    (assert "false" (` (encode bool (date 1234),
    (assert "false" (` (encode bool ""),
    (assert "false" (` (encode bool "abc"),
    (assert "false" (` (encode bool (@),
    (assert "false" (` (encode bool (object),
    (assert "false" (` (encode bool (= x x),
  ),

  ($should "a date" "be encoded to (date xxx)" (= ()
    (assert "(date 1024)" (` (encode value (date 1024),

    (assert "null" (` (encode date),
    (assert "null" (` (encode date null),
    (assert "(date 0)" (` (encode date false),
    (assert "(date 0)" (` (encode date 12),
    (assert "(date 0)" (` (encode date ""),
    (assert "(date 0)" (` (encode date (` sym),
    (assert "(date 0)" (` (encode date (@),
    (assert "(date 0)" (` (encode date (object),
    (assert "(date 0)" (` (encode date (= x x),
  ),

  ($should "an object" "be encoded to its identityName or an expression" (= ()
    (let obj (object),
    (assert "(@>)" (` (encode value obj),

    (let obj (@ p : 1 ),
    (assert "(@p: 1)" (` (encode value obj),

    (let pt (@ identityName : "type" ),
    (let obj (@ pt >),
    (assert "(@type >)" (` (encode value obj),

    (let obj (@ pt > p : 1 ),
    (assert "(@type >\n  p: 1)" (` (encode value obj),

    (let obj (@ identityName : "special-object" ),
    (assert "special-object" (` (encode value obj),

    (assert "(date 1234)" (` (encode object (date 1234),
    (assert "(@ 1 2 3)" (` (encode object (@ 1 2 3),

    (assert "null" (` (encode object),
    (assert "null" (` (encode object null),
    (assert "(@>)" (` (encode object false),
    (assert "(@>)" (` (encode object 12),
    (assert "(@>)" (` (encode object ""),
    (assert "(@>)" (` (encode object (` sym),
    (assert "(@>)" (` (encode object (object),
    (assert "(@>)" (` (encode object (= x x),
  ),

  ($should "an array" "be encoded to an expression" (= ()
    (assert "(@)" (` (encode value (@),
    (assert "(@ 1)" (` (encode value (@1),
    (assert "(@ 1 2 3)" (` (encode value (@1 2   3),

    (assert "null" (` (encode array),
    (assert "null" (` (encode array null),
    (assert "(@)" (` (encode array false),
    (assert "(@)" (` (encode array 12),
    (assert "(@)" (` (encode array (date 1234),
    (assert "(@)" (` (encode array ""),
    (assert "(@)" (` (encode array (` sym),
    (assert "(@)" (` (encode array (object),
    (assert "(@)" (` (encode array (= x x),
  ),

  ($should "a function" "be encoded to an expression" (= ()
    (assert "(= (x) x)" (` (encode value (= x x),
    (assert "(= (x y) (+ x y))" (` (encode value (= (x y) (+ x y),
    (assert "(= (@base: null) > (x y) (+ x y base))" (` (encode value (= base > (x y) (+ x y base),
    (assert "(= (base) > (x y)\n  (+ x y base))" (` (encode value (=> base > (x y) (+ x y base),

    (assert "null" (` (encode function),
    (assert "null" (` (encode function null),
    (assert "null" (` (encode function false),
    (assert "null" (` (encode function 12),
    (assert "null" (` (encode function (date 1234),
    (assert "null" (` (encode function ""),
    (assert "null" (` (encode function (` sym),
    (assert "null" (` (encode function (object),
    (assert "null" (` (encode function (@),
  ),
).

($define "(encode clause expr)" (= ()
  ($should "a symbol" "be encoded to its key" (= ()
    (assert "sym" (` (encode clause (` sym),
  ),
  ($should "an array" "be encoded to a clause" (= ()
    (assert "(+ x y)" (` (encode clause (` (+ x y),
  ),

  ($should "other types" "be encoded by its value" (= ()
    (assert "null" (` (encode clause),
    (assert "null" (` (encode clause null),

    (assert "true" (` (encode clause true),
    (assert "false" (` (encode clause false),
    (assert "12" (` (encode clause 12),
    (assert "(date 1234)" (` (encode clause (date 1234),
    (assert "\"\"" (` (encode clause ""),
    (assert "\"abc\"" (` (encode clause "abc"),
    (assert "(@p: 1)" (` (encode clause (@ p: 1),
  ),
).

($define "(encode program clauses)" (= ()
  ($should "an array" "be encoded as a list of clauses" (= ()
    (assert "x + y" (` ($encode (` (x + y),
    (assert "(x + y)" (` ($encode (` ((x + y),
    (assert "(x + y)\n(x - y)" (` ($encode (` ((x + y) (x - y),
    (assert "(x + y\n  (x - y)." (` ($encode (` ((x + y (x - y),

    (assert "()" ($encode),
    (assert "()" (` ($encode null),
    (assert "()" (` ($encode true),
    (assert "()" (` ($encode false),
    (assert "()" (` ($encode 12),
    (assert "()" (` ($encode ""),
    (assert "()" (` ($encode "abc"),
    (assert "()" (` ($encode (` sym),
    (assert "()" (` ($encode (date 1234),
    (assert "()" (` ($encode (@ p: 1),
    (assert "()" (` ($encode (= x x),
  ),
).
