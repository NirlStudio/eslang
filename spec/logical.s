($define "Logical AND: &&" (= ()
  ($should "return the first FALSE value (0, false or null) or the last value in arguments." (= ()
    (assert equal null (&&) "(&& ) should return null"),
    (assert equal 0 (&& true 0) "(&& true 0) should return 0"),
    (assert equal 1 (&& true (@) 1) "(&& true (@) 1) should return 1"),
    (assert equal false (&& true (@) false 1) "(&& true (@) false 1) should return false"),
).

($define "Logical OR: ||" (= ()
  ($should "return the first TRUE value (not a 0, false or null) or the last value in arguments." (= ()
    (assert equal null (||) "(|| ) should return null"),
    (assert equal true (|| 0 true 1) "(|| 0 true 1) should return true"),
    (assert typeOf (|| false 0 (object)) "object" "(|| false 0 (@)) should return an object"),
    (assert equal false (|| null 0 false) "(|| null 0 false) should return false"),
).

($define "Logical NOT: !" (= ()
  ($should "return true for 0, false and null, false for any other values." (= ()
    (assert equal true (!) "(! ) should return true"),
    (assert equal true (! 0) "(! 0) should return true"),
    (assert equal true (! false) "(! false) should return true"),
    (assert equal true (! null) "(! null) should return true"),
    (assert equal false (! 1) "(! 1) should return false"),
    (assert equal false (! true) "(! true) should return false"),
    (assert equal false (! (@)) "(! (@)) should return false"),
    (assert equal false (! "false") "(! \"false\") should return false"),
).
