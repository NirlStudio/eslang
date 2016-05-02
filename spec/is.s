($define "test objects/values (is A B)" (= ()
  ($should "return true for the same object" (= ()
    (assert (` (is),
    (assert (` (is null),
    (assert (` (is null null),
    (assert (` (is (Number NaN) (Number NaN),
    (assert false (` (== (Number NaN) (Number NaN),

    (let obj1 (@p:1),
    (let obj2(@p:1),
    (assert (` (is obj1 obj1),
    (assert false (` (is obj1 obj2),

    (let obj1 (@ 1 2),
    (let obj2 (@ 1 2),
    (assert (` (is obj1 obj1),
    (assert false (` (is obj1 obj2),

    (let obj1 (=  x (+ x 2),
    (let obj2 (= x (+ x 2),
    (assert (` (is obj1 obj1),
    (assert false (` (is obj1 obj2),
  ),
  ($should "return true for the same values of bool, number, string and symbol" (= ()
    (let v1 true)
    (let v2 true)
    (assert (` (is v1 v2),
    (let v1 false)
    (let v2 false)
    (assert (` (is v1 v2),

    (let v1 1)
    (let v2 1)
    (assert (` (is v1 v2),
    (let v1 0)
    (let v2 0)
    (assert (` (is v1 v2),
    (let v1 -1)
    (let v2 -1)
    (assert (` (is v1 v2),
    (let v1 (number Infinity))
    (let v2 (number Infinity))
    (assert (` (is v1 v2),

    (let v1 "")
    (let v2 "")
    (assert (` (is v1 v2),
    (let v1 "1")
    (let v2 "1")
    (assert (` (is v1 v2),

    (let v1 (` sym),
    (let v2 (` sym),
    (assert (` (is v1 v2),
).

($define "analyze objects (is A like B ...)" (= ()
  ($should "return true if A has all B's properties, but ignoring their values" (= ()
    (assert false (` (is like),
    (assert false (` (is like null),
    (assert (` (is null like null),
    (assert (` (is (Number NaN) like (Number NaN),

    (assert (` (is true like true),
    (assert (` (is false like false),
    (assert (` (is true like false),
    (assert (` (is false like true),

    (assert (` (is 0 like 0),
    (assert (` (is 0 like 0 1),
    (assert (` (is 1 like 0 -1),

    # depends on the version of JS - TODO: fix it?
    (assert (` (is "" like ""),
    (assert (` (is " " like ""),
    (assert false (` (is "" like " "),

    (assert (` (is (` s1) like (` s1),
    (assert (` (is (` s1) like (` s22),
    (assert (` (is (` s22) like (` s1),
    (assert (` (is (` s1) like (` s22) (` s333),

    (let obj1 (@p1:1 p2:2),
    (let obj2 (@p1:11),
    (let obj3 (@p2:22),
    (assert (` (is obj1 like obj1),
    (assert (` (is obj1 like obj2),
    (assert (` (is obj1 like obj3),
    (assert (` (is obj1 like obj2 obj3),
    (assert false (` (is obj2 like obj3),

    (let obj1 (@p1:11),
    (let obj2 (@  obj1 > p2:22),
    (assert (` (is obj1 like obj1),
    (assert false (` (is obj1 like obj2) "here"),
    (assert (` (is obj2 like obj1),

    (let obj1 (@ 1 2),
    (let obj2 (@ 3 4 5),
    (let obj3 (@ 4 7 8 9),
    (assert (` (is obj3 like obj2),
    (assert (` (is obj2 like obj1),
    (assert false (` (is obj1 like obj2),
    (assert false (` (is obj2 like obj3),

    (let f (= x (+ 2 x),
    (let c (= b > x (* 2 x),
    (assert (` (is c like f),
    (assert false (` (is f like c),
).
