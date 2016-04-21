($define "sequence generator" (= ()
  ($should "return a sequence iterator with finite states" ( =()
    (let iter ($iterate 0),
    (assert equal false (iter next),

    (let iter ($iterate 3 0 -1),
    (assert equal true (iter next),
    (assert equal false (iter next),

    (let iter ($iterate -3 0 1),
    (assert equal true (iter next),
    (assert equal false (iter next),

    (let iter ($iterate 2),
    (assert equal true (iter next),
    (assert equal 0 (iter "value"),
    (assert equal true (iter next),
    (assert equal 1 (iter "value"),
    (assert equal false (iter next),

    (let iter ($iterate -2),
    (assert equal true (iter next),
    (assert equal 0 (iter "value"),
    (assert equal true (iter next),
    (assert equal -1 (iter "value"),
    (assert equal false (iter next),

    (let iter ($iterate 2 0 2),
    (assert equal true (iter next),
    (assert equal 0 (iter "value"),
    (assert equal false (iter next),
).

($define "property iterator" (= ()
  ($should "return an iterator to traverse all properties of an object or a function" ( =()
    (let obj (object))
    (let iter ($iterate obj),
    (assert equal false (iter next),

    (let obj (= x x))
    (let iter ($iterate obj),
    (assert equal true (iter next),
    (assert equal true (iter next),
    (assert equal true (iter next),
    (assert equal false (iter next),

    (let obj (= base > x x))
    (let iter ($iterate obj),
    (assert equal true (iter next),
    (assert equal true (iter next),
    (assert equal true (iter next),
    (assert equal true (iter next),
    (assert equal false (iter next),

    (let obj (@ p1: 1))
    (let iter ($iterate obj),
    (assert equal true (iter next),
    (assert equal (` p1) (iter "key"),
    (assert equal 1 (iter "value"),

    (let obj (@ p1: 1 p2: 2))
    (let iter ($iterate obj),
    (assert equal true (iter next),
    (assert equal true (iter next),
    (assert equal false (iter next),
).

($define "array iterator" (= ()
  ($should "return an iterator to traverse items in an array" ( =()
    (let arr (@))
    (let iter ($iterate arr),
    (assert equal false (iter next),

    (let arr (@ "x"))
    (let iter ($iterate arr),
    (assert equal true (iter next),
    (assert equal 0 (iter "key"),
    (assert equal "x" (iter "value"),
    (assert equal false (iter next),

    (let arr (@ "x" "y"))
    (let iter ($iterate arr),
    (assert equal true (iter next),
    (assert equal 0 (iter "key"),
    (assert equal "x" (iter "value"),
    (assert equal true (iter next),
    (assert equal 1 (iter "key"),
    (assert equal "y" (iter "value"),
    (assert equal false (iter next),
).
