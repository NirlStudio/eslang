($define "object combination" (= ()
  ($should "operator +"
           "return a new object with properties from source objects" (= ()
    (let s1 (@ p1: 100),
    (let s2 (@ p2: 200),

    (let obj (+))
    (assert equal 0 obj)

    (let obj (+ s1))
    (assert equal false (is s1 obj)),
    (let iter ($iterate obj),
    (assert equal true (iter next)
    (assert equal "p1" (iter key)
    (assert equal 100 (iter value)
    (assert equal false (iter next)

    (let obj (+ s1 s2))
    (assert equal false (is s1 obj)),
    (let iter ($iterate obj),
    (assert equal true (iter next)
    (assert equal "p1" (iter key)
    (assert equal 100 (iter value)
    (assert equal true (iter next)
    (assert equal "p2" (iter key)
    (assert equal 200 (iter value)
    (assert equal false (iter next)
  ),
  ($should "operator combine"
           "return a new object with properties from source objects" (= ()
    (let s1 (@ p1: 100),
    (let s2 (@ p2: 200),

    (let obj (combine))
    (assert equal null obj)

    (let obj (combine s1))
    (assert equal false (is s1 obj)),
    (let iter ($iterate obj),
    (assert equal true (iter next)
    (assert equal "p1" (iter key)
    (assert equal 100 (iter value)
    (assert equal false (iter next)

    (let obj (combine s1 s2))
    (assert equal false (is s1 obj)),
    (let iter ($iterate obj),
    (assert equal true (iter next)
    (assert equal "p1" (iter key)
    (assert equal 100 (iter value)
    (assert equal true (iter next)
    (assert equal "p2" (iter key)
    (assert equal 200 (iter value)
    (assert equal false (iter next)
  ),
).

($define "object mixin" (= ()
  ($should "operator +="
           "update the first object with properties from other source objects" (= ()
    (let s1 (@ p1: 100),
    (let s2 (@ p2: 200),

    (let obj (+=))
    (assert equal 0 obj)

    (let obj (+= s1))
    (assert equal true (is s1 obj)),
    (let iter ($iterate obj),
    (assert equal true (iter next)
    (assert equal "p1" (iter key)
    (assert equal 100 (iter value)
    (assert equal false (iter next)

    (let obj (+= s1 s2))
    (assert equal true (is s1 obj)),
    (let iter ($iterate obj),
    (assert equal true (iter next)
    (assert equal "p1" (iter key)
    (assert equal 100 (iter value)
    (assert equal true (iter next)
    (assert equal "p2" (iter key)
    (assert equal 200 (iter value)
    (assert equal false (iter next)
  ),
  ($should "operator mixin"
           "update the first object with properties from other source objects" (= ()
    (let s1 (@ p1: 100),
    (let s2 (@ p2: 200),

    (let obj (mixin))
    (assert equal null obj)

    (let obj (mixin s1))
    (assert equal true (is s1 obj)),
    (let iter ($iterate obj),
    (assert equal true (iter next)
    (assert equal "p1" (iter key)
    (assert equal 100 (iter value)
    (assert equal false (iter next)

    (let obj (mixin s1 s2))
    (assert equal true (is s1 obj)),
    (let iter ($iterate obj),
    (assert equal true (iter next)
    (assert equal "p1" (iter key)
    (assert equal 100 (iter value)
    (assert equal true (iter next)
    (assert equal "p2" (iter key)
    (assert equal 200 (iter value)
    (assert equal false (iter next)
  ),
).
