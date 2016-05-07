($define "query type" (= ()
  ($should "(typeof null)" "be 'null'" (= ()
    (assert "null" (` (typeof ),
    (assert "null" (` (typeof null),
  ),
  ($should "(typeof true/false)" "be 'bool'" (= ()
    (assert "bool" (` (typeof true),
    (assert "bool" (` (typeof false),
  ),
  ($should "(typeof number)" "be 'number'" (= ()
    (assert "number" (` (typeof 1),
    (assert "number" (` (typeof 0),
    (assert "number" (` (typeof -1),
    (assert "number" (` (typeof (Number NaN)),
    (assert "number" (` (typeof (Number Infinity)),
  ),
  ($should "(typeof string)" "be 'string'" (= ()
    (assert "string" (` (typeof ""),
    (assert "string" (` (typeof " "),
    (assert "string" (` (typeof "false"),
    (assert "string" (` (typeof "null"),
  ),
  ($should "(typeof symbol)" "be 'symbol'" (= ()
    (assert "symbol" (` (typeof (` sym)),
  ),
  ($should "(typeof function/closure/lambda)" "be 'function'" (= ()
    (assert "function" (` (typeof (= x x)),
    (assert "function" (` (typeof (=  x > y (+ x y)),
    (assert "function" (` (typeof (=> x > y (+ x y)),
  ),
  ($should "(typeof object)" "be 'object'" (= ()
    (assert "object" (` (typeof (@p:1)),
  ),
  ($should "(typeof date)" "be 'date'" (= ()
    (assert "date" (` (typeof (Date now)),
    (assert "date" (` (typeof ($date)),
    (assert "date" (` (typeof (date)),
  ),
  ($should "(typeof array)" "be 'array'" (= ()
    (assert "array" (` (typeof (@)),
    (assert "array" (` (typeof (@ 0)),
    (assert "array" (` (typeof (@ 1 2 3)),
  ),
  ($should "(typeof typed-object)" "be its typeId property" (= ()
    (let obj (@ typeId: "user-type"))
    (assert "user-type" (` (typeof obj),
  ),
).

($define "verify type" (= ()
  ($should "(typeof null \"null\")" "be true" (= ()
    (assert "null" (` (typeof ),
    (assert "null" (` (typeof null),
    (assert false (` (typeof null null),
    (assert (` (typeof null "null"),
  ),
  ($should "(typeof true/false \"bool\")" "be true" (= ()
    (assert (` (typeof true "bool"),
    (assert (` (typeof false "bool"),
    (assert false (` (typeof 0 "bool"),
    (assert false (` (typeof null "bool"),
  ),
  ($should "(typeof number \"number\")" "be true" (= ()
    (assert (` (typeof 1 "number"),
    (assert (` (typeof 0 "number"),
    (assert (` (typeof -1 "number"),
    (assert (` (typeof NaN "number"),
    (assert (` (typeof (number Infinity) "number"),
    (assert false (` (typeof null "number"),
    (assert false (` (typeof false "number"),
  ),
  ($should "(typeof string \"string\")" "be true" (= ()
    (assert (` (typeof "" "string"),
    (assert (` (typeof " " "string"),
    (assert (` (typeof "str" "string"),
    (assert (` (typeof "0" "string"),
    (assert (` (typeof "null" "string"),
    (assert (` (typeof "false" "string"),
  ),
  ($should "(typeof symbol \"symbol\")" "be true" (= ()
    (assert (` (typeof (` sym) "symbol"),
    (assert false (` (typeof "sym" "symbol"),
  ),
  ($should "(typeof function/closure/lambda \"function\")" "be true" (= ()
    (assert (` (typeof (= x x) "function"),
    (assert (` (typeof (=  x > y (+ x y)) "function"),
    (assert (` (typeof (=> x > y (+ x y)) "function"),
    (assert false (` (typeof null "function"),
  ),
  ($should "(typeof object \"object\")" "be true" (= ()
    (assert (` (typeof (@p:1) "object"),
  ),
  ($should "(typeof date \"date\")" "be true" (= ()
    (assert (` (typeof (Date now) "date"),
    (assert (` (typeof ($date) "date"),
    (assert (` (typeof (date) "date"),
  ),
  ($should "(typeof date \"object\")" "be true" (= ()
    (assert (` (typeof (Date now) "object"),
    (assert (` (typeof ($date) "object"),
    (assert (` (typeof (date) "object"),
  ),
  ($should "(typeof array \"array\")" "be true" (= ()
    (assert (` (typeof (@) "array"),
    (assert (` (typeof (@ 0) "array"),
    (assert (` (typeof (@ 1 2 3) "array"),
  ),
  ($should "(typeof array \"object\")" "be true" (= ()
    (assert (` (typeof (@) "object"),
    (assert (` (typeof (@ 0) "object"),
    (assert (` (typeof (@ 1 2 3) "object"),
  ),
  ($should "(typeof typed-object typeId)" "be true" (= ()
    (let obj (@ typeId: "user-type"),
    (assert (` (typeof obj "user-type"),
  ),
).

($define "verify inheritance" (= ()
  ($should "(typeof object prototype)" "be true" (= ()
    (let pt (@ p1:1))
    (let obj1 (@ pt > p2:2))
    (let obj2 (@ pt > p3:3))
    (assert (` (typeof obj1 pt),
    (assert false (` (typeof pt obj1),
    (assert false (` (typeof obj2 obj1),
    (assert false (` (typeof obj1 obj2),
  ),
).
