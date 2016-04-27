($define "(encode value some-value)" (= ()
  ($should "null" "be encoded to \"null\"" (= ()
    (assert equal "null" (encode value null),
  ),

  ($should "a string" "be encoded to \"...\"" (= ()
    (assert equal "\"ab\\\"12\"" (encode value "ab\"12"),

    (assert equal "null" (encode string),
    (assert equal "null" (encode string null),
    (assert equal "\"\"" (encode string false),
    (assert equal "\"\"" (encode string 12),
    (assert equal "\"\"" (encode string (date 1234)),
    (assert equal "\"\"" (encode string (` sym)),
    (assert equal "\"\"" (encode string (@)),
    (assert equal "\"\"" (encode string (object)),
    (assert equal "\"\"" (encode string (= x x),
  ),

  ($should "a symbol" "be encoded to its key" (= ()
    (assert equal "(` sym)" (encode value (` sym)),

    (assert equal "null" (encode symbol),
    (assert equal "null" (encode symbol null),
    (assert equal "" (encode symbol false),
    (assert equal "" (encode symbol 12),
    (assert equal "" (encode symbol (date 1234),
    (assert equal "" (encode symbol ""),
    (assert equal "" (encode symbol "abc"),
    (assert equal "" (encode symbol (@)),
    (assert equal "" (encode symbol (object)),
    (assert equal "" (encode symbol (= x x),
  ),

  ($should "a number" "be encoded to its value" (= ()
    (assert equal "-1" (encode value -1),
    (assert equal "0" (encode value -0),
    (assert equal "1" (encode value 1),
    (assert equal "1.987" (encode value 1.987),

    (assert equal "null" (encode number),
    (assert equal "null" (encode number null),
    (assert equal "NaN" (encode number false),
    (assert equal "NaN" (encode number (date 1234),
    (assert equal "NaN" (encode number ""),
    (assert equal "NaN" (encode number "abc"),
    (assert equal "NaN" (encode number (@)),
    (assert equal "NaN" (encode number (object)),
    (assert equal "NaN" (encode number (= x x),
  ),

  ($should "a boolean value" "be encoded to true or false" (= ()
    (assert equal "true" (encode value true),
    (assert equal "false" (encode value false),

    (assert equal "null" (encode bool),
    (assert equal "null" (encode bool null),
    (assert equal "false" (encode bool 12),
    (assert equal "false" (encode bool (date 1234),
    (assert equal "false" (encode bool ""),
    (assert equal "false" (encode bool "abc"),
    (assert equal "false" (encode bool (@)),
    (assert equal "false" (encode bool (object)),
    (assert equal "false" (encode bool (= x x),
  ),

  ($should "a date" "be encoded to (date xxx)" (= ()
    (assert equal "(date 1024)" (encode value (date 1024)),

    (assert equal "null" (encode date),
    (assert equal "null" (encode date null),
    (assert equal "(date 0)" (encode date false),
    (assert equal "(date 0)" (encode date 12),
    (assert equal "(date 0)" (encode date ""),
    (assert equal "(date 0)" (encode date (` sym)),
    (assert equal "(date 0)" (encode date (@),
    (assert equal "(date 0)" (encode date (object),
    (assert equal "(date 0)" (encode date (= x x),
  ),

  ($should "an object" "be encoded to its identityName or an expression" (= ()
    (let obj (object))
    (assert equal "(@>)" (encode value obj),

    (let obj (@ p : 1 ))
    (assert equal "(@p: 1)" (encode value obj),

    (let pt (@ identityName : "type" ))
    (let obj (@ pt >))
    (assert equal "(@type >)" (encode value obj),

    (let obj (@ pt > p : 1 ))
    (assert equal "(@type >\n  p: 1)" (encode value obj),

    (let obj (@ identityName : "special-object" ))
    (assert equal "special-object" (encode value obj),

    (assert equal "(date 1234)" (encode object (date 1234),
    (assert equal "(@ 1 2 3)" (encode object (@ 1 2 3),

    (assert equal "null" (encode object),
    (assert equal "null" (encode object null),
    (assert equal "(@>)" (encode object false),
    (assert equal "(@>)" (encode object 12),
    (assert equal "(@>)" (encode object ""),
    (assert equal "(@>)" (encode object (` sym)),
    (assert equal "(@>)" (encode object (object),
    (assert equal "(@>)" (encode object (= x x),
  ),

  ($should "an array" "be encoded to an expression" (= ()
    (assert equal "(@)" (encode value (@),
    (assert equal "(@ 1)" (encode value (@1),
    (assert equal "(@ 1 2 3)" (encode value (@1 2   3),

    (assert equal "null" (encode array),
    (assert equal "null" (encode array null),
    (assert equal "(@)" (encode array false),
    (assert equal "(@)" (encode array 12),
    (assert equal "(@)" (encode array (date 1234),
    (assert equal "(@)" (encode array ""),
    (assert equal "(@)" (encode array (` sym)),
    (assert equal "(@)" (encode array (object),
    (assert equal "(@)" (encode array (= x x),
  ),

  ($should "a function" "be encoded to an expression" (= ()
    (assert equal "(= (x) x)" (encode value (= x x),
    (assert equal "(= (x y) (+ x y))" (encode value (= (x y) (+ x y),
    (assert equal "(= (@base: null) > (x y) (+ x y base))" (encode value (= base > (x y) (+ x y base),
    (assert equal "(= (base) > (x y)\n  (+ x y base))" (encode value (=> base > (x y) (+ x y base),

    (assert equal "null" (encode function),
    (assert equal "null" (encode function null),
    (assert equal "null" (encode function false),
    (assert equal "null" (encode function 12),
    (assert equal "null" (encode function (date 1234),
    (assert equal "null" (encode function ""),
    (assert equal "null" (encode function (` sym)),
    (assert equal "null" (encode function (object),
    (assert equal "null" (encode function (@),
  ),
).

($define "(encode clause expr)" (= ()
  ($should "a symbol" "be encoded to its key" (= ()
    (assert equal "sym" (encode clause (` sym)),
  ),
  ($should "an array" "be encoded to a clause" (= ()
    (assert equal "(+ x y)" (encode clause (` (+ x y))),
  ),

  ($should "other types" "be encoded by its value" (= ()
    (assert equal "null" (encode clause),
    (assert equal "null" (encode clause null),

    (assert equal "true" (encode clause true),
    (assert equal "false" (encode clause false),
    (assert equal "12" (encode clause 12),
    (assert equal "(date 1234)" (encode clause (date 1234)),
    (assert equal "\"\"" (encode clause ""),
    (assert equal "\"abc\"" (encode clause "abc"),
    (assert equal "(@p: 1)" (encode clause (@ p: 1)),
  ),
).

($define "(encode program clauses)" (= ()
  ($should "an array" "be encoded as a list of clauses" (= ()
    (assert equal "+ x y" ($encode (` (+ x y),
    (assert equal "(+ x y)" ($encode (` ((+ x y),
    (assert equal "(+ x y)\n(- x y)" ($encode (` ((+ x y) (- x y),
    (assert equal "(+ x y\n  (- x y)." ($encode (` ((+ x y (- x y),

    (assert equal "()" ($encode),
    (assert equal "()" ($encode null),
    (assert equal "()" ($encode true),
    (assert equal "()" ($encode false),
    (assert equal "()" ($encode 12),
    (assert equal "()" ($encode ""),
    (assert equal "()" ($encode "abc"),
    (assert equal "()" ($encode (` sym)),
    (assert equal "()" ($encode (date 1234)),
    (assert equal "()" ($encode (@ p: 1)),
    (assert equal "()" ($encode (= x x)),
  ),
).
