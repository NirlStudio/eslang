($define "function form" (=()
  ($should "return the number value of a string" (= ()
    (assert 0 (`($number))
    (assert 0 (`($number null))

    (assert 0 (`($number "0"))
    (assert 0 (`($number "0.0"))
    (assert 1 (`($number "1"))
    (assert -1 (`($number "-1"))
    (assert 1.5 (`($number "1.5"))
    (assert -1.5 (`($number "-1.5"))

    (assert (`(Number isNaN ($number ""))
    (assert (`(Number isNaN ($number "a"))
    (assert (`(Number isNaN ($number (@)))
    (assert (`(Number isNaN ($number (object))
  ),
  ($should "return the original value of a number" (= ()
    (assert 1 (`($number 1))
    (assert 1.5 (`($number 1.5))

    (assert (`(Number isNaN ($number (Number "NaN"),
    (assert false (`(Number isFinite ($number (Number "Infinity"),
  ),
).

($define "operator form" (=()
  ($should "return the number value of a string" (= ()
    (assert 0 (`(number))
    (assert 0 (`(number null))

    (assert 0 (`(number "0"))
    (assert 0 (`(number "0.0"))
    (assert 1 (`(number "1"))
    (assert -1 (`(number "-1"))
    (assert 1.5 (`(number "1.5"))
    (assert -1.5 (`(number "-1.5"))

    (assert (`(Number isNaN (number false))
    (assert (`(Number isNaN (number true))
    (assert (`(Number isNaN (number ""))
    (assert (`(Number isNaN (number "a"))
    (assert (`(Number isNaN (number (@)))
    (assert (`(Number isNaN (number (object))
  ),
  ($should "return the original value of a number" (= ()
    (assert 1 (`(number 1))
    (assert 1.5 (`(number 1.5))

    (assert (`(Number isNaN (number (Number "NaN"),
    (assert false (`(Number isFinite (number (Number "Infinity"),
  ),
).

($define "Number object" (=()
  ($should "(Number isFinite )" "return true for finite number values" (= ()
    (assert (`(Number isFinite -1))
    (assert (`(Number isFinite 1))
    (assert (`(Number isFinite 0))
    (assert (`(Number isFinite (Number MAX_VALUE)))
    (assert (`(Number isFinite (Number MIN_VALUE)))
    (assert (`(Number isFinite (Number MAX_SAFE_INTEGER)))
    (assert (`(Number isFinite (Number MIN_SAFE_INTEGER)))

    (assert false (`(Number isFinite (Number "Infinity")))
    (assert false (`(Number isFinite (Number "POSITIVE_INFINITY")))
    (assert false (`(Number isFinite (Number "NEGATIVE_INFINITY")))

    (assert false (`(Number isFinite))
    (assert false (`(Number isFinite null))
    (assert false (`(Number isFinite true))
    (assert false (`(Number isFinite false))
    (assert false (`(Number isFinite ""))
    (assert false (`(Number isFinite "0"))
    (assert false (`(Number isFinite (@)))
    (assert false (`(Number isFinite (object)))
  ),
  ($should "(Number isNaN )" "return true for NaN or non-number values" (= ()
    (assert (`(Number isNaN (Number "NaN")))
    (assert false (`(Number isNaN 1))
    (assert false (`(Number isNaN 0))
    (assert false (`(Number isNaN (Number MAX_VALUE)))
    (assert false (`(Number isNaN (Number MIN_VALUE)))

    (assert (`(Number isNaN))
    (assert (`(Number isNaN null))
    (assert (`(Number isNaN true))
    (assert (`(Number isNaN false))
    (assert (`(Number isNaN ""))
    (assert (`(Number isNaN "0"))
    (assert (`(Number isNaN (@)))
    (assert (`(Number isNaN (object)))
  ),
  ($should "(Number isInteger )" "return true for integer values" (= ()
    (assert (`(Number isInteger -1))
    (assert (`(Number isInteger 1))
    (assert (`(Number isInteger 0))
    (assert (`(Number isInteger (Number MAX_SAFE_INTEGER)))
    (assert (`(Number isInteger (+(Number MAX_SAFE_INTEGER) 1))
    (assert (`(Number isInteger (Number MIN_SAFE_INTEGER)))
    (assert (`(Number isInteger (-(Number MIN_SAFE_INTEGER) 1))
    (assert (`(Number isInteger (Number MAX_VALUE)))

    (assert false (`(Number isInteger (Number MIN_VALUE)))
    (assert false (`(Number isInteger (Number Infinity)))
    (assert false (`(Number isInteger (Number NaN)))

    (assert false (`(Number isInteger))
    (assert false (`(Number isInteger null))
    (assert false (`(Number isInteger true))
    (assert false (`(Number isInteger false))
    (assert false (`(Number isInteger ""))
    (assert false (`(Number isInteger "0"))
    (assert false (`(Number isInteger (@)))
    (assert false (`(Number isInteger (object)))

  ),
  ($should "(Number isSafeInteger )" "return true for safe integer values" (= ()
    (assert (`(Number isSafeInteger -1))
    (assert (`(Number isSafeInteger 1))
    (assert (`(Number isSafeInteger 0))
    (assert (`(Number isSafeInteger (Number MAX_SAFE_INTEGER)))
    (assert (`(Number isSafeInteger (Number MIN_SAFE_INTEGER)))

    (assert false (`(Number isSafeInteger (-(Number MIN_SAFE_INTEGER) 1))
    (assert false (`(Number isSafeInteger (+(Number MAX_SAFE_INTEGER) 1))

    (assert false (`(Number isSafeInteger (Number MAX_VALUE)))
    (assert false (`(Number isSafeInteger (Number MIN_VALUE)))
    (assert false (`(Number isSafeInteger (Number Infinity)))
    (assert false (`(Number isSafeInteger (Number NaN)))

    (assert false (`(Number isSafeInteger))
    (assert false (`(Number isSafeInteger null))
    (assert false (`(Number isSafeInteger true))
    (assert false (`(Number isSafeInteger false))
    (assert false (`(Number isSafeInteger ""))
    (assert false (`(Number isSafeInteger "0"))
    (assert false (`(Number isSafeInteger (@)))
    (assert false (`(Number isSafeInteger (object)))

  ),
  ($should "(Number parseInt )" "return an integer value from a string" (= ()
    (assert 0 (`(Number parseInt))
    (assert 0 (`(Number parseInt null))

    (assert 0 (`(Number parseInt "0"))
    (assert 0 (`(Number parseInt "0.0"))
    (assert 1 (`(Number parseInt "1"))
    (assert -1 (`(Number parseInt "-1"))
    (assert 1 (`(Number parseInt "1.5"))
    (assert -1 (`(Number parseInt "-1.5")
  ),
  ($should "(Number parseFloat )" "return a float value from a string" (= ()
    (assert 0 (`(Number parseFloat))
    (assert 0 (`(Number parseFloat null))

    (assert 0 (`(Number parseFloat "0"))
    (assert 0 (`(Number parseFloat "0.0"))
    (assert 1 (`(Number parseFloat "1"))
    (assert -1 (`(Number parseFloat "-1"))
    (assert 1.5 (`(Number parseFloat "1.5"))
    (assert -1.5 (`(Number parseFloat "-1.5")
  ),
).
