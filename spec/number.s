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
    (assert 3 (` ($number (@ 1 2 3),

    (assert 128 (` ($number (@ length: 128),
    (assert 128 (` ($number (@ size: 128),
    (assert 128 (` ($number (@ count: (= () 128),

    (assert (` (Number not-number ($number ""),
    (assert (` (Number not-number ($number "a"),
    (assert (` (Number not-number ($number (object),
  ),
  ($should "return the original value of a number" (= ()
    (assert 1 (` ($number 1),
    (assert 1.5 (` ($number 1.5),

    (assert (` (Number not-number ($number NaN),
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
    (assert 3 (` (number (@ 1 2 3),

    (assert 128 (` (number (@ length: 128),
    (assert 128 (` (number (@ size: 128),
    (assert 128 (` (number (@ count: (= () 128),

    (assert (` (Number not-number (number ""),
    (assert (` (Number not-number (number "a"),
    (assert (` (Number not-number (number (object),
  ),
  ($should "return the original value of a number" (= ()
    (assert 1 (` (number 1),
    (assert 1.5 (` (number 1.5),

    (assert (` (Number not-number (number NaN),
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
    (assert (` (Number is-finite (Number MAX_SAFE_INTEGER),
    (assert (` (Number is-finite (Number MIN_SAFE_INTEGER),

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
  ($should "(Number not-number )" "return true for NaN or non-number values" (= ()
    (assert (` (Number not-number NaN),
    (assert false (` (Number not-number 1),
    (assert false (` (Number not-number 0),
    (assert false (` (Number not-number (Number MAX_VALUE),
    (assert false (` (Number not-number (Number MIN_VALUE),

    (assert (` (Number not-number),
    (assert (` (Number not-number null),
    (assert (` (Number not-number true),
    (assert (` (Number not-number false),
    (assert (` (Number not-number ""),
    (assert (` (Number not-number "0"),
    (assert (` (Number not-number (@),
    (assert (` (Number not-number (object),
  ),
  ($should "(Number is-int )" "return true for integer values" (= ()
    (assert (` (Number is-int -1),
    (assert (` (Number is-int 1),
    (assert (` (Number is-int 0),
    (assert (` (Number is-int (Number MAX_SAFE_INTEGER),
    (assert (` (Number is-int (+(Number MAX_SAFE_INTEGER) 1),
    (assert (` (Number is-int (Number MIN_SAFE_INTEGER),
    (assert (` (Number is-int (-(Number MIN_SAFE_INTEGER) 1),
    (assert (` (Number is-int (Number MAX_VALUE),

    (assert false (` (Number is-int (Number MIN_VALUE),
    (assert false (` (Number is-int (Number Infinity),
    (assert false (` (Number is-int NaN),

    (assert false (` (Number is-int),
    (assert false (` (Number is-int null),
    (assert false (` (Number is-int true),
    (assert false (` (Number is-int false),
    (assert false (` (Number is-int ""),
    (assert false (` (Number is-int "0"),
    (assert false (` (Number is-int (@),
    (assert false (` (Number is-int (object),

  ),
  ($should "(Number safe-int )" "return true for safe integer values" (= ()
    (assert (` (Number safe-int -1),
    (assert (` (Number safe-int 1),
    (assert (` (Number safe-int 0),
    (assert (` (Number safe-int (Number MAX_SAFE_INTEGER),
    (assert (` (Number safe-int (Number MIN_SAFE_INTEGER),

    (assert false (` (Number safe-int (-(Number MIN_SAFE_INTEGER) 1),
    (assert false (` (Number safe-int (+(Number MAX_SAFE_INTEGER) 1),

    (assert false (` (Number safe-int (Number MAX_VALUE),
    (assert false (` (Number safe-int (Number MIN_VALUE),
    (assert false (` (Number safe-int (Number Infinity),
    (assert false (` (Number safe-int NaN),

    (assert false (` (Number safe-int),
    (assert false (` (Number safe-int null),
    (assert false (` (Number safe-int true),
    (assert false (` (Number safe-int false),
    (assert false (` (Number safe-int ""),
    (assert false (` (Number safe-int "0"),
    (assert false (` (Number safe-int (@),
    (assert false (` (Number safe-int (object),

  ),
  ($should "(Number parse-int )" "return an integer value from a string" (= ()
    (assert 0 (` (Number parse-int),
    (assert 0 (` (Number parse-int null),

    (assert 0 (` (Number parse-int "0"),
    (assert 0 (` (Number parse-int "0.0"),
    (assert 1 (` (Number parse-int "1"),
    (assert -1 (` (Number parse-int "-1"),
    (assert 1 (` (Number parse-int "1.5"),
    (assert -1 (` (Number parse-int "-1.5")
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
