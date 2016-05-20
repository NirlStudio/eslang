(define "operator: ==" (= ()
  (should "return false for different types" (= ()
    (assert false (` (1 == ),
    (assert false (` (1 == ""),
    (assert false (` ("" == (date 100),
    (assert false (` ((date 100) == (` name),
    (assert false (` ((` name) == (@),
    (assert false (` ((@) == (object ),
    (assert false (` ((object ) == true),
    (assert false (` ((= x x ) == (object),
  ),

  (should "return true for same values of bool, number, string, date and symbol." (= ()
    (assert (` (null ==),

    (assert (` (true == true),
    (assert (` (false == false),
    (assert false (` (true == false),
    (assert false (` (false == true),

    (assert (` (-1 == -1),
    (assert (` (0 == 0),
    (assert (` (1 == 1),
    (assert false (` (-1 == 1),
    (assert false (` (0 == 1),
    (assert false (` (-1 == 0),

    (assert (` ((date 100) == (date 100),
    (assert false (` ((date 100) == (date 200),

    # native code may create different symbol instances for a same value.
    (assert (` ((` sym) == (` sym),
    (assert false (` ((` sym1) == (` sym2),
  ),

  (should "return true for same instance of function, array and object." (= ()
    (let (f1 (= x x),
    (let (f2 (= x x),
    (assert (` (f1 == f1),
    (assert false (` (f1 == f2),

    (let (a1 (@ 1 2),
    (let (a2 (@ 1 2),
    (assert (` (a1 == a1),
    (assert false (` (a1 == a2),

    (let (o1 (@ p: 1),
    (let (o2 (@ p: 1),
    (assert (` (o1 == o1),
    (assert false (` (o1 == o2),
  ),
).

(define "operator: !=" (= ()
  (should "return true for different types" (= ()
    (assert (` (1 != ),
    (assert (` (1 != ""),
    (assert (` ("" != (date 100),
    (assert (` ((date 100) != (` name),
    (assert (` ((` name) != (@),
    (assert (` ((@) != (object ),
    (assert (` ((object ) != true),
    (assert (` ((= x x ) != (object),
  ),

  (should "return false for same values of bool, number, string, date and symbol." (= ()
    (assert false (` (!=),

    (assert false (` (true != true),
    (assert false (` (false != false),
    (assert (` (true != false),
    (assert (` (false != true),

    (assert false (` (-1 != -1),
    (assert false (` (0 != 0),
    (assert false (` (1 != 1),
    (assert (` (-1 != 1),
    (assert (` (0 != 1),
    (assert (` (-1 != 0),

    (assert false (` ((date 100) != (date 100),
    (assert (` ((date 100) != (date 200),

    # native code may create different symbol instances for a same value.
    (assert false (` ((` sym) != (` sym),
    (assert (` ((` sym1) != (` sym2),
  ),

  (should "return false for same instance of function, array and object." (= ()
    (let (f1 (= x x),
    (let (f2 (= x x),
    (assert false (` (f1 != f1),
    (assert (` (f1 != f2),

    (let (a1 (@ 1 2),
    (let (a2 (@ 1 2),
    (assert false (` (a1 != a1),
    (assert (` (a1 != a2),

    (let (o1 (@ p: 1),
    (let (o2 (@ p: 1),
    (assert false (` (o1 != o1),
    (assert (` (o1 != o2),
  ),
).
