($define "function form" (=()
  ($should "return the number value of a string" (= ()
    (assert 0 (` ($number),
    (assert 0 (` ($number null),

    (assert 0 (` ($number "0"),
    (assert 0 (` ($number "0.0"),
    (assert 1 (` ($number "1"),
    (assert -1 (` ($number "-1"),
    (assert 1.5 (` ($number "1.5"),
    (assert -1.5 (` ($number "-1.5"),

    (assert 0 (` ($number false),
    (assert 1 (` ($number true),

    (assert 123 (` ($number (date 123)),

    (assert 0 (` ($number (@),
    (assert 0 (` ($number (@ 1 2 3),

    (assert 0 (` ($number (object),
    (assert 0 (` ($number (= x x),

    (assert 0 (` ($number ""),
    (assert 0 (` ($number "a"),
  ),
  ($should "return the original value of a number" (= ()
    (assert 1 (` ($number 1),
    (assert 1.5 (` ($number 1.5),

    (assert (` (Number is-nan ($number NaN),
    (assert false (` (Number is-finite ($number Infinity),
  ),
).

($define "operator form" (=()
  ($should "return the number value of a string" (= ()
    (assert 0 (` (number),
    (assert 0 (` (number null),

    (assert 0 (` (number "0"),
    (assert 0 (` (number "0.0"),
    (assert 1 (` (number "1"),
    (assert -1 (` (number "-1"),
    (assert 1.5 (` (number "1.5"),
    (assert -1.5 (` (number "-1.5"),

    (assert 0 (` (number false),
    (assert 1 (` (number true),

    (assert 123 (` (number (date 123)),

    (assert 0 (` (number (@),
    (assert 0 (` (number (@ 1 2 3),

    (assert 0 (` (number (object p:1),
    (assert 0 (` (number (= x x),

    (assert 0 (` (number ""),
    (assert 0 (` (number "a"),
  ),
  ($should "return the original value of a number" (= ()
    (assert 1 (` (number 1),
    (assert 1.5 (` (number 1.5),

    (assert (` (Number is-nan (number NaN),
    (assert false (` (Number is-finite (number Infinity),
  ),
).

($define "Number object" (=()
  ($should "(Number is-finite )" "return true for finite number values" (= ()
    (assert (` (Number is-finite -1),
    (assert (` (Number is-finite 1),
    (assert (` (Number is-finite 0),
    (assert (` (Number is-finite (Number MAX_VALUE),
    (assert (` (Number is-finite (Number MIN_VALUE),
    (assert (` (Number is-finite (Int MAX_VALUE),
    (assert (` (Number is-finite (Int MIN_VALUE),

    (assert false (` (Number is-finite Infinity),
    (assert false (` (Number is-finite (Number "POSITIVE_INFINITY"),
    (assert false (` (Number is-finite (Number "NEGATIVE_INFINITY"),

    (assert false (` (Number is-finite),
    (assert false (` (Number is-finite null),
    (assert false (` (Number is-finite true),
    (assert false (` (Number is-finite false),
    (assert false (` (Number is-finite ""),
    (assert false (` (Number is-finite "0"),
    (assert false (` (Number is-finite (@),
    (assert false (` (Number is-finite (object),
  ),
  ($should "(Int is-safe )" "return true for safe integer values" (= ()
    (assert (` (Int is-safe -1),
    (assert (` (Int is-safe 1),
    (assert (` (Int is-safe 0),
    (assert (` (Int is-safe (Int MAX_VALUE),
    (assert (` (Int is-safe (Int MIN_VALUE),

    (assert false (` (Int is-safe (-(Int MIN_VALUE) 1),
    (assert false (` (Int is-safe (+(Int MAX_VALUE) 1),

    (assert false (` (Int is-safe (Number MAX_VALUE),
    (assert false (` (Int is-safe (Number MIN_VALUE),
    (assert false (` (Int is-safe Infinity),
    (assert false (` (Int is-safe NaN),

    (assert false (` (Int is-safe),
    (assert false (` (Int is-safe null),
    (assert false (` (Int is-safe true),
    (assert false (` (Int is-safe false),
    (assert false (` (Int is-safe ""),
    (assert false (` (Int is-safe "0"),
    (assert false (` (Int is-safe (@),
    (assert false (` (Int is-safe (object),

  ),
  ($should "(Int parse )" "return an integer value from a string" (= ()
    (assert 0 (` (Int parse),
    (assert 0 (` (Int parse null),

    (assert 0 (` (Int parse "0"),
    (assert 0 (` (Int parse "0.0"),
    (assert 1 (` (Int parse "1"),
    (assert -1 (` (Int parse "-1"),
    (assert 1 (` (Int parse "1.5"),
    (assert -1 (` (Int parse "-1.5")
  ),
  ($should "(Number parse )" "return a float or int value from a string" (= ()
    (assert 0 (` (Number parse),
    (assert 0 (` (Number parse null),

    (assert 0 (` (Number parse "0"),
    (assert 0 (` (Number parse "0.0"),
    (assert 1 (` (Number parse "1"),
    (assert -1 (` (Number parse "-1"),
    (assert 1.5 (` (Number parse "1.5"),
    (assert -1.5 (` (Number parse "-1.5")
  ),
).
