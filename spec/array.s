($define "function form" (=()
  ($should "return an array object including all arguments" (= ()
    (let a1 ($array ))
    (assert equal 0 (a1 length),

    (let a1 ($array 0))
    (assert equal 1 (a1 length),
    (assert equal 0 (a1:0),

    (let a1 ($array 2 4 6))
    (assert equal 3 (a1 length),
    (assert equal 2 (a1:0),
    (assert equal 4 (a1:1),
    (assert equal 6 (a1:2),
).

($define "operator form - (array ...)" (=()
  ($should "return an array object including all arguments" (= ()
    (let a1 (array ))
    (assert equal 0 (a1 length),

    (let a1 (array 0))
    (assert equal 1 (a1 length),
    (assert equal 0 (a1:0),

    (let a1 (array 2 4 6))
    (assert equal 3 (a1 length),
    (assert equal 2 (a1:0),
    (assert equal 4 (a1:1),
    (assert equal 6 (a1:2),
).

($define "operator form - (@ ...)" (=()
  ($should "return an array object including all arguments" (= ()
    (let a1 (@ ))
    (assert equal 0 (a1 length),

    (let a1 (@ 0))
    (assert equal 1 (a1 length),
    (assert equal 0 (a1:0),

    (let a1 (@ 2 4 6))
    (assert equal 3 (a1 length),
    (assert equal 2 (a1:0),
    (assert equal 4 (a1:1),
    (assert equal 6 (a1:2),
).

($define "arrayOf" (=()
  ($should "return an array with expanded arguments" (= ()
    (let a1 ($arrayOf ))
    (assert equal 0 (a1 length),

    (let a1 ($arrayOf 2 4 6))
    (assert equal 3 (a1 length),
    (assert equal 2 (a1:0),
    (assert equal 4 (a1:1),
    (assert equal 6 (a1:2),

    (let a1 ($arrayOf 2 4 (@ 6 8 10) 12 (@ 14 16),
    (assert equal 8 (a1 length),
    (assert equal 2 (a1:0),
    (assert equal 6 (a1:2),
    (assert equal 12 (a1:5),
    (assert equal 16 (a1:7),
).

($define "Array object" (= ()
  ($should "be reserved" (= ()
    (assert equal "object" (typeof ($Array)))
).
