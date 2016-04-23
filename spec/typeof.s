($define "query type" (= ()
  ($should "(typeof null)" "be 'null'" (= ()
    (assert equal "null" (typeof ),
    (assert equal "null" (typeof null),
  ),
  ($should "(typeof true/false)" "be 'bool'" (= ()
    (assert equal "bool" (typeof true),
    (assert equal "bool" (typeof false),
  ),
  ($should "(typeof number)" "be 'number'" (= ()
    (assert equal "number" (typeof 1),
    (assert equal "number" (typeof 0),
    (assert equal "number" (typeof -1),
    (assert equal "number" (typeof (Number NaN)),
    (assert equal "number" (typeof (Number Infinity)),
  ),
  ($should "(typeof string)" "be 'string'" (= ()
    (assert equal "string" (typeof ""),
    (assert equal "string" (typeof " "),
    (assert equal "string" (typeof "false"),
    (assert equal "string" (typeof "null"),
  ),
  ($should "(typeof symbol)" "be 'symbol'" (= ()
    (assert equal "symbol" (typeof (` sym)),
  ),
  ($should "(typeof function/closure/lambda)" "be 'function'" (= ()
    (assert equal "function" (typeof (= x x)),
    (assert equal "function" (typeof (=  x > y (+ x y)),
    (assert equal "function" (typeof (=> x > y (+ x y)),
  ),
  ($should "(typeof object)" "be 'object'" (= ()
    (assert equal "object" (typeof (@p:1)),
  ),
  ($should "(typeof date)" "be 'date'" (= ()
    (assert equal "date" (typeof (Date now)),
    (assert equal "date" (typeof ($date)),
    (assert equal "date" (typeof (date)),
  ),
  ($should "(typeof array)" "be 'array'" (= ()
    (assert equal "array" (typeof (@)),
    (assert equal "array" (typeof (@ 0)),
    (assert equal "array" (typeof (@ 1 2 3)),
  ),
  ($should "(typeof typed-object)" "be its typeIdentifier property" (= ()
    (let obj (@ typeIdentifier: "user-type"))
    (assert equal "user-type" (typeof obj),
  ),
).

($define "verify type" (= ()
  ($should "(typeof null \"null\")" "be true" (= ()
    (assert equal "null" (typeof ),
    (assert equal "null" (typeof null),
    (assert equal false (typeof null null),
    (assert equal true (typeof null "null"),
  ),
  ($should "(typeof true/false \"bool\")" "be true" (= ()
    (assert equal true (typeof true "bool"),
    (assert equal true (typeof false "bool"),
    (assert equal false (typeof 0 "bool"),
    (assert equal false (typeof null "bool"),
  ),
  ($should "(typeof number \"number\")" "be true" (= ()
    (assert equal true (typeof 1 "number"),
    (assert equal true (typeof 0 "number"),
    (assert equal true (typeof -1 "number"),
    (assert equal true (typeof (Number NaN) "number"),
    (assert equal true (typeof (number Infinity) "number"),
    (assert equal false (typeof null "number"),
    (assert equal false (typeof false "number"),
  ),
  ($should "(typeof string \"string\")" "be true" (= ()
    (assert equal true (typeof "" "string"),
    (assert equal true (typeof " " "string"),
    (assert equal true (typeof "str" "string"),
    (assert equal true (typeof "0" "string"),
    (assert equal true (typeof "null" "string"),
    (assert equal true (typeof "false" "string"),
  ),
  ($should "(typeof symbol \"symbol\")" "be true" (= ()
    (assert equal true (typeof (` sym) "symbol"),
    (assert equal false (typeof "sym" "symbol"),
  ),
  ($should "(typeof function/closure/lambda \"function\")" "be true" (= ()
    (assert equal true (typeof (= x x) "function"),
    (assert equal true (typeof (=  x > y (+ x y)) "function"),
    (assert equal true (typeof (=> x > y (+ x y)) "function"),
    (assert equal false (typeof null "function"),
  ),
  ($should "(typeof object \"object\")" "be true" (= ()
    (assert equal true (typeof (@p:1) "object"),
  ),
  ($should "(typeof date \"date\")" "be true" (= ()
    (assert equal true (typeof (Date now) "date"),
    (assert equal true (typeof ($date) "date"),
    (assert equal true (typeof (date) "date"),
  ),
  ($should "(typeof date \"object\")" "be true" (= ()
    (assert equal true (typeof (Date now) "object"),
    (assert equal true (typeof ($date) "object"),
    (assert equal true (typeof (date) "object"),
  ),
  ($should "(typeof array \"array\")" "be true" (= ()
    (assert equal true (typeof (@) "array"),
    (assert equal true (typeof (@ 0) "array"),
    (assert equal true (typeof (@ 1 2 3) "array"),
  ),
  ($should "(typeof array \"object\")" "be true" (= ()
    (assert equal true (typeof (@) "object"),
    (assert equal true (typeof (@ 0) "object"),
    (assert equal true (typeof (@ 1 2 3) "object"),
  ),
  ($should "(typeof typed-object typeIdentifier)" "be true" (= ()
    (let obj (@ typeIdentifier: "user-type"))
    (assert equal true (typeof obj "user-type"),
  ),
).

($define "verify inheritance" (= ()
  ($should "(typeof object prototype)" "be true" (= ()
    (let pt (@ p1:1))
    (let obj1 (@ pt > p2:2))
    (let obj2 (@ pt > p3:3))
    (assert equal true (typeof obj1 pt),
    (assert equal false (typeof pt obj1),
    (assert equal false (typeof obj2 obj1),
    (assert equal false (typeof obj1 obj2),
  ),
).
