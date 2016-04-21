($define "operator: ==" (= ()
  ($should "return false for different types" (= ()
    (assert equal false (== 1),
    (assert equal false (== 1 ""),
    (assert equal false (== "" (date 100)),
    (assert equal false (== (date 100) (` name),
    (assert equal false (== (` name) (@),
    (assert equal false (== (@) (object ),
    (assert equal false (== (object ) true),
    (assert equal false (== (= x x ) (object),
  ),

  ($should "return true for same values of bool, number, string, date and symbol." (= ()
    (assert equal true (==),

    (assert equal true (== true true),
    (assert equal true (== false false),
    (assert equal false (== true false),
    (assert equal false (== false true),

    (assert equal true (== -1 -1),
    (assert equal true (== 0 0),
    (assert equal true (== 1 1),
    (assert equal false (== -1 1),
    (assert equal false (== 0 1),
    (assert equal false (== -1 0),

    (assert equal true (== (date 100) (date 100),
    (assert equal false (== (date 100) (date 200),

    # native code may create different symbol instances for a same value.
    (assert equal true (== (` sym) (` sym),
    (assert equal false (== (` sym1) (` sym2),
  ),

  ($should "return true for same instance of function, array and object." (= ()
    (let (f1 (= x x),
    (let (f2 (= x x),
    (assert equal true (== f1 f1),
    (assert equal false (== f1 f2),

    (let (a1 (@ 1 2),
    (let (a2 (@ 1 2),
    (assert equal true (== a1 a1),
    (assert equal false (== a1 a2),

    (let (o1 (@ p: 1),
    (let (o2 (@ p: 1),
    (assert equal true (== o1 o1),
    (assert equal false (== o1 o2),
  ),
).

($define "operator: !=" (= ()
  ($should "return true for different types" (= ()
    (assert equal true (!= 1),
    (assert equal true (!= 1 ""),
    (assert equal true (!= "" (date 100)),
    (assert equal true (!= (date 100) (` name),
    (assert equal true (!= (` name) (@),
    (assert equal true (!= (@) (object ),
    (assert equal true (!= (object ) true),
    (assert equal true (!= (= x x ) (object),
  ),

  ($should "return false for same values of bool, number, string, date and symbol." (= ()
    (assert equal false (!=),

    (assert equal false (!= true true),
    (assert equal false (!= false false),
    (assert equal true (!= true false),
    (assert equal true (!= false true),

    (assert equal false (!= -1 -1),
    (assert equal false (!= 0 0),
    (assert equal false (!= 1 1),
    (assert equal true (!= -1 1),
    (assert equal true (!= 0 1),
    (assert equal true (!= -1 0),

    (assert equal false (!= (date 100) (date 100),
    (assert equal true (!= (date 100) (date 200),

    # native code may create different symbol instances for a same value.
    (assert equal false (!= (` sym) (` sym),
    (assert equal true (!= (` sym1) (` sym2),
  ),

  ($should "return false for same instance of function, array and object." (= ()
    (let (f1 (= x x),
    (let (f2 (= x x),
    (assert equal false (!= f1 f1),
    (assert equal true (!= f1 f2),

    (let (a1 (@ 1 2),
    (let (a2 (@ 1 2),
    (assert equal false (!= a1 a1),
    (assert equal true (!= a1 a2),

    (let (o1 (@ p: 1),
    (let (o2 (@ p: 1),
    (assert equal false (!= o1 o1),
    (assert equal true (!= o1 o2),
  ),

).
