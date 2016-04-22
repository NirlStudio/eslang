($define "function form" (=()
  ($should "return the number value of a string" (= ()
    (assert equal 0 ($number))
    (assert equal 0 ($number null))

    (assert equal 0 ($number "0"))
    (assert equal 0 ($number "0.0"))
    (assert equal 1 ($number "1"))
    (assert equal -1 ($number "-1"))
    (assert equal 1.5 ($number "1.5"))
    (assert equal -1.5 ($number "-1.5"))

    (assert equal true (Number isNaN ($number ""))
    (assert equal true (Number isNaN ($number "a"))
    (assert equal true (Number isNaN ($number (@)))
    (assert equal true (Number isNaN ($number (object))
  ),
  ($should "return the original value of a number" (= ()
    (assert equal 1 ($number 1))
    (assert equal 1.5 ($number 1.5))

    (assert equal true (Number isNaN ($number (Number "NaN"),
    (assert equal false (Number isFinite ($number (Number "Infinity"),
  ),
).

($define "operator form" (=()
  ($should "return the number value of a string" (= ()
    (assert equal 0 (number))
    (assert equal 0 (number null))

    (assert equal 0 (number "0"))
    (assert equal 0 (number "0.0"))
    (assert equal 1 (number "1"))
    (assert equal -1 (number "-1"))
    (assert equal 1.5 (number "1.5"))
    (assert equal -1.5 (number "-1.5"))

    (assert equal true (Number isNaN (number false))
    (assert equal true (Number isNaN (number true))
    (assert equal true (Number isNaN (number ""))
    (assert equal true (Number isNaN (number "a"))
    (assert equal true (Number isNaN (number (@)))
    (assert equal true (Number isNaN (number (object))
  ),
  ($should "return the original value of a number" (= ()
    (assert equal 1 (number 1))
    (assert equal 1.5 (number 1.5))

    (assert equal true (Number isNaN (number (Number "NaN"),
    (assert equal false (Number isFinite (number (Number "Infinity"),
  ),
).

($define "Number object" (=()
  ($should "(Number isFinite )" "return true for finite number values" (= ()
    (assert equal true (Number isFinite -1))
    (assert equal true (Number isFinite 1))
    (assert equal true (Number isFinite 0))
    (assert equal true (Number isFinite (Number MAX_VALUE)))
    (assert equal true (Number isFinite (Number MIN_VALUE)))
    (assert equal true (Number isFinite (Number MAX_SAFE_INTEGER)))
    (assert equal true (Number isFinite (Number MIN_SAFE_INTEGER)))

    (assert equal false (Number isFinite (Number "Infinity")))
    (assert equal false (Number isFinite (Number "POSITIVE_INFINITY")))
    (assert equal false (Number isFinite (Number "NEGATIVE_INFINITY")))

    (assert equal false (Number isFinite))
    (assert equal false (Number isFinite null))
    (assert equal false (Number isFinite true))
    (assert equal false (Number isFinite false))
    (assert equal false (Number isFinite ""))
    (assert equal false (Number isFinite "0"))
    (assert equal false (Number isFinite (@)))
    (assert equal false (Number isFinite (object)))
  ),
  ($should "(Number isNaN )" "return true for NaN or non-number values" (= ()
    (assert equal true (Number isNaN (Number "NaN")))
    (assert equal false (Number isNaN 1))
    (assert equal false (Number isNaN 0))
    (assert equal false (Number isNaN (Number MAX_VALUE)))
    (assert equal false (Number isNaN (Number MIN_VALUE)))

    (assert equal true (Number isNaN))
    (assert equal true (Number isNaN null))
    (assert equal true (Number isNaN true))
    (assert equal true (Number isNaN false))
    (assert equal true (Number isNaN ""))
    (assert equal true (Number isNaN "0"))
    (assert equal true (Number isNaN (@)))
    (assert equal true (Number isNaN (object)))
  ),
  ($should "(Number isInteger )" "return true for integer values" (= ()
    (assert equal true (Number isInteger -1))
    (assert equal true (Number isInteger 1))
    (assert equal true (Number isInteger 0))
    (assert equal true (Number isInteger (Number MAX_SAFE_INTEGER)))
    (assert equal true (Number isInteger (+(Number MAX_SAFE_INTEGER) 1))
    (assert equal true (Number isInteger (Number MIN_SAFE_INTEGER)))
    (assert equal true (Number isInteger (-(Number MIN_SAFE_INTEGER) 1))
    (assert equal true (Number isInteger (Number MAX_VALUE)))

    (assert equal false (Number isInteger (Number MIN_VALUE)))
    (assert equal false (Number isInteger (Number Infinity)))
    (assert equal false (Number isInteger (Number NaN)))

    (assert equal false (Number isInteger))
    (assert equal false (Number isInteger null))
    (assert equal false (Number isInteger true))
    (assert equal false (Number isInteger false))
    (assert equal false (Number isInteger ""))
    (assert equal false (Number isInteger "0"))
    (assert equal false (Number isInteger (@)))
    (assert equal false (Number isInteger (object)))

  ),
  ($should "(Number isSafeInteger )" "return true for safe integer values" (= ()
    (assert equal true (Number isSafeInteger -1))
    (assert equal true (Number isSafeInteger 1))
    (assert equal true (Number isSafeInteger 0))
    (assert equal true (Number isSafeInteger (Number MAX_SAFE_INTEGER)))
    (assert equal true (Number isSafeInteger (Number MIN_SAFE_INTEGER)))

    (assert equal false (Number isSafeInteger (-(Number MIN_SAFE_INTEGER) 1))
    (assert equal false (Number isSafeInteger (+(Number MAX_SAFE_INTEGER) 1))

    (assert equal false (Number isSafeInteger (Number MAX_VALUE)))
    (assert equal false (Number isSafeInteger (Number MIN_VALUE)))
    (assert equal false (Number isSafeInteger (Number Infinity)))
    (assert equal false (Number isSafeInteger (Number NaN)))

    (assert equal false (Number isSafeInteger))
    (assert equal false (Number isSafeInteger null))
    (assert equal false (Number isSafeInteger true))
    (assert equal false (Number isSafeInteger false))
    (assert equal false (Number isSafeInteger ""))
    (assert equal false (Number isSafeInteger "0"))
    (assert equal false (Number isSafeInteger (@)))
    (assert equal false (Number isSafeInteger (object)))

  ),
  ($should "(Number parseInt )" "return an integer value from a string" (= ()
    (assert equal 0 (Number parseInt))
    (assert equal 0 (Number parseInt null))

    (assert equal 0 (Number parseInt "0"))
    (assert equal 0 (Number parseInt "0.0"))
    (assert equal 1 (Number parseInt "1"))
    (assert equal -1 (Number parseInt "-1"))
    (assert equal 1 (Number parseInt "1.5"))
    (assert equal -1 (Number parseInt "-1.5")
  ),
  ($should "(Number parseFloat )" "return a float value from a string" (= ()
    (assert equal 0 (Number parseFloat))
    (assert equal 0 (Number parseFloat null))

    (assert equal 0 (Number parseFloat "0"))
    (assert equal 0 (Number parseFloat "0.0"))
    (assert equal 1 (Number parseFloat "1"))
    (assert equal -1 (Number parseFloat "-1"))
    (assert equal 1.5 (Number parseFloat "1.5"))
    (assert equal -1.5 (Number parseFloat "-1.5")
  ),
).
