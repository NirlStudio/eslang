($define "test objects/values (is A B)" (= ()
  ($should "return true for the same object" (= ()
    (assert equal true (is),
    (assert equal true (is null),
    (assert equal true (is null null),
    (assert equal true (is (Number NaN) (Number NaN),
    (assert equal false (== (Number NaN) (Number NaN),

    (let obj1 (@p:1))
    (let obj2(@p:1))
    (assert equal true (is obj1 obj1))
    (assert equal false (is obj1 obj2))

    (let obj1 (@ 1 2))
    (let obj2 (@ 1 2))
    (assert equal true (is obj1 obj1))
    (assert equal false (is obj1 obj2))

    (let obj1 (=  x (+ x 2),
    (let obj2 (= x (+ x 2),
    (assert equal true (is obj1 obj1))
    (assert equal false (is obj1 obj2))
  ),
  ($should "return true for the same values of bool, number, string and symbol" (= ()
    (let v1 true)
    (let v2 true)
    (assert equal true (is v1 v2))
    (let v1 false)
    (let v2 false)
    (assert equal true (is v1 v2))

    (let v1 1)
    (let v2 1)
    (assert equal true (is v1 v2))
    (let v1 0)
    (let v2 0)
    (assert equal true (is v1 v2))
    (let v1 -1)
    (let v2 -1)
    (assert equal true (is v1 v2))
    (let v1 (number Infinity))
    (let v2 (number Infinity))
    (assert equal true (is v1 v2))

    (let v1 "")
    (let v2 "")
    (assert equal true (is v1 v2))
    (let v1 "1")
    (let v2 "1")
    (assert equal true (is v1 v2))

    (let v1 (` sym))
    (let v2 (` sym))
    (assert equal true (is v1 v2))
).

($define "analyze objects (is A like B ...)" (= ()
  ($should "return true if A has all B's properties, but ignoring their values" (= ()
    (assert equal false (is like),
    (assert equal false (is like null),
    (assert equal true (is null like null),
    (assert equal true (is (Number NaN) like (Number NaN),

    (assert equal true (is true like true),
    (assert equal true (is false like false),
    (assert equal true (is true like false),
    (assert equal true (is false like true),

    (assert equal true (is 0 like 0),
    (assert equal true (is 0 like 0 1),
    (assert equal true (is 1 like 0 -1),

    # depends on the version of JS - TODO: fix it?
    (assert equal true (is "" like ""),
    (assert equal true (is " " like ""),
    (assert equal false (is "" like " "),

    (assert equal true (is (` s1) like (` s1)),
    (assert equal true (is (` s1) like (` s22)),
    (assert equal true (is (` s22) like (` s1)),
    (assert equal true (is (` s1) like (` s22) (` s333)),

    (let obj1 (@p1:1 p2:2))
    (let obj2 (@p1:11))
    (let obj3 (@p2:22))
    (assert equal true (is obj1 like obj1),
    (assert equal true (is obj1 like obj2),
    (assert equal true (is obj1 like obj3),
    (assert equal true (is obj1 like obj2 obj3),
    (assert equal false (is obj2 like obj3),

    (let obj1 (@p1:11))
    (let obj2 (@  obj1 > p2:22))
    (assert equal true (is obj1 like obj1),
    (assert equal false (is obj1 like obj2),
    (assert equal true (is obj2 like obj1),

    (let obj1 (@ 1 2))
    (let obj2 (@ 3 4 5))
    (let obj3 (@ 4 7 8 9))
    (assert equal true (is obj3 like obj2),
    (assert equal true (is obj2 like obj1),
    (assert equal false (is obj1 like obj2),
    (assert equal false (is obj2 like obj3),

    (let f (= x (+ 2 x),
    (let c (= b > x (* 2 x),
    (assert equal true (is c like f),
    (assert equal false (is f like c),
).
