(var * (load "./share/type" (@ the-type: number).

(define "Number Common Behaviors" (=> ()
  (define "Identity" (=> ()
    (should "-0 is not 0." (= ()
      (assert false (0 is -0).
      (assert (0 is-not -0).

      (assert false (-0 is 0).
      (assert (-0 is-not 0).
    ).
    (should "(0 - (number infinite)) is (number -infinite)." (= ()
      (assert ((0 - (number infinite)) is (number -infinite).
      (assert false ((0 - (number infinite)) is-not (number -infinite).

      (assert ((number -infinite) is (0 - (number infinite).
      (assert false ((number -infinite) is-not (0 - (number infinite).
    ).
    (should "(0 - (number -infinite)) is (number infinite)." (= ()
      (assert ((0 - (number -infinite)) is (number infinite).
      (assert false ((0 - (number -infinite)) is-not (number infinite).

      (assert ((number infinite) is (0 - (number -infinite).
      (assert false ((number infinite) is-not (0 - (number -infinite).
    )
  ).

  (define "Equivalence" (=> ()
    (should "-0 equals 0." (=> ()
      (assert (0 equals -0).
      (assert false (0 not-equals -0).

      (assert (-0 equals 0).
      (assert false (-0 not-equals 0).
    )
  ).

  (define "Ordering" (=> ()
    (var compares-to (= pairs
      (for pair in pairs
        (assert 1 ((pair 0) compares-to (pair 1).
        (assert -1 ((pair 1) compares-to (pair 0).
      ).
    ).
    (should "a common number can be compared with other common numbers." (=> ()
      (compare (@
        (@ 1 0)
        (@ 0 -1)
        (@ 0.5 0)
        (@ 0 -0.5)
        (@ 1 0.5)
        (@ -0.5 -1)
        (@ 0.5 -0.5)
        (@ 1 -1)
      ).
    ).
    (should "(number infinite) is great than other common numbers." (=> ()
      (var _ (= value
        (@ (number infinite) value)
      ).
      (compare (@
        (_ 0)
        (_ 0.5)
        (_ -0.5)
        (_ 1)
        (_ -1)
        (_ (number max).
        (_ (number min).
        (_ (number max-int).
        (_ (number min-int).
        (_ (number max-bits).
        (_ (number min-bits).
        (_ (number -infinite).
      ).
    ).
    (should "(number -infinite) is less than other common numbers." (=> ()
      (var _ (= value
        (@ value (number -infinite).
      ).
      (compare (@
        (_ 0)
        (_ 0.5)
        (_ -0.5)
        (_ 1)
        (_ -1)
        (_ (number max).
        (_ (number min).
        (_ (number max-int).
        (_ (number min-int).
        (_ (number max-bits).
        (_ (number min-bits).
        (_ (number infinite).
      ).
    ).
    (should "(number invalid) is not comparable with other common numbers." (=> ()
      (for value
          in ((the-values remove (number invalid)) append 0).
        (assert null ((number invalid) compares-to value).
        (assert null (value compares-to (number invalid).
      ).
    ).
  ).

  (define "Emptiness" (=> ()
    (should "0 is defined as the empty value." (=> ()
      (assert 0 (number empty).
      (assert (0 is-empty).
      (assert false (0 not-empty).
    ).
    (should "-0 is defined as another empty value." (=> ()
      (assert (-0 is-empty).
      (assert false (-0 not-empty).
    ).
    (should "(number invalid) is defined as an empty value too." (=> ()
      (assert ((number invalid) is-empty).
      (assert false ((number invalid) not-empty).
    ).
    (should "Other values are not empty." (=> ()
      (for value
          in (the-values remove -0 (number invalid).
        (assert (value not-empty).
        (assert false (value is-empty).
      ).
    ).
  ).

  (define "Encoding" (=> ()
    (should "a number is encoded to itself." (=> ()
      (for value
          in (the-values concat (number empty).
        (assert value (value to-code).
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "common numbers are represented as decimal strings." (=> ()
      (assert "0" (0 to-string).
      (assert "-0" (-0 to-string).

      (assert "0.5" (0.5 to-string).
      (assert "-0.5" (-0.5 to-string).

      (assert "1" (1 to-string).
      (assert "-1" (-1 to-string).
    ).
    (should "some special numbers are represented as decimal strings." (=> ()
      (assert (((number smallest) to-string) is-a string).

      (assert (((number max) to-string) is-a string).
      (assert (((number min) to-string) is-a string).

      (assert (((number max-int) to-string) is-a string).
      (assert (((number min-int) to-string) is-a string).

      (assert (((number max-bits) to-string) is-a string).
      (assert (((number min-bits) to-string) is-a string).
    ).
    (should "(number infinite) is represented as '(number infinite)'." (=> ()
      (assert "(number infinite)" ((number infinite) to-string).
    ).
    (should "(number -infinite) is represented as '(number -infinite)'." (=> ()
      (assert "(number -infinite)" ((number -infinite) to-string).
    ).
    (should "(number invalid) is represented as '(number invalid)'." (=> ()
      (assert "(number invalid)" ((number invalid) to-string).
    ).
  ).
).

(define "Constant Values" (= ()
  (var basic-arith-ops (= value
    (assert value (value + 0).
    (assert value (value - 0).
    (assert 0 (value - value).
    (assert value (value * 1).
    (assert value (value / 1).
    (assert 1 (value / value).
  ).
  (define "(number max)" (=> ()
    (should "the value is positive." (= ()
      (assert ((number max) > 0).
    ).
    (should "the value may be used in arithmetic operations." (=> ()
      (basic-arith-ops (number max).
    ).
  ).
  (define "(number min)" (=> ()
    (should "the value is negative." (= ()
      (assert ((number min) < 0).
    ).
    (should "the value may be used in arithmetic operations." (=> ()
      (basic-arith-ops (number min).
    ).
  ).
  (define "(number smallest)" (=> ()
    (should "the value is positive." (= ()
      (assert ((number smallest) > 0).
    ).
    (should "the value is smaller than 1." (= ()
      (assert ((number smallest) < 1).
    ).
    (should "the value may be used in arithmetic operations." (=> ()
      (basic-arith-ops (number smallest).
    ).
    (should "(number smallest) is the closest value to zero." (=> ()
      (assert 1 ((number smallest) + 1).
      (assert -1 ((number smallest) - 1).

      (assert 0 ((number smallest) * 0.5).
      (assert 0 ((number smallest) / 2).
    ).
  ).
  (define "(number max-int)" (=> ()
    (should "the value is positive." (= ()
      (assert ((number max-int) > 0).
    ).
    (should "the value may be used in arithmetic operations." (=> ()
      (basic-arith-ops (number max-int).
    ).
    (should "the value may be safely used to generate a smaller value." (=> ()
      (assert 1 ((number max-int) - ((number max-int) - 1).
    ).
  ).
  (define "(number min-int)" (=> ()
    (should "the value is negative." (= ()
      (assert ((number min-int) < 0).
    ).
    (should "the value may be used in arithmetic operations." (=> ()
      (basic-arith-ops (number min-int).
    ).
    (should "the value may be safely used to generate a great value." (= ()
      (assert -1 ((number min-int) - ((number min-int) + 1).
    ).
  ).
  (define "(number max-bits)" (=> ()
    (should "the value is positive." (= ()
      (assert ((number max-bits) > 0).
    ).
    (should "the value may be used in arithmetic operations." (=> ()
      (basic-arith-ops (number max-bits).

      (assert (number max-bits) ((number max-bits) >> 0)

      (assert ((number max-bits) >> 1) (((number max-bits) / 2) floor).
      (assert ((number max-bits) >>> 1) (((number max-bits) / 2) floor).
    ).
    (should "the value may be safely used to generate a smaller value." (=> ()
      (assert 1 ((number max-bits) - ((number max-bits) - 1).
    ).
    (should "the value is safe for bitwise operations." (=> ()
      (assert (number max-bits) ((number max-bits) >> 0)
      (assert (number max-bits) ((number max-bits) << 0)

      (assert (number max-bits) ((number max-bits) >>> 0)

      (assert ((number max-bits) >> 1) (((number max-bits) / 2) floor).
      (assert ((number max-bits) >>> 1) (((number max-bits) / 2) floor).
    ).
  ).
  (define "(number min-bits)" (=> ()
    (should "the value is negative." (= ()
      (assert ((number min-bits) < 0).
    ).
    (should "the value may be used in arithmetic operations." (=> ()
      (basic-arith-ops (number min-bits).
    ).
    (should "the value may be safely used to generate a great value." (= ()
      (assert -1 ((number min-bits) - ((number min-bits) + 1).
    ).
    (should "the value is safe for bitwise operations." (=> ()
      (assert (number min-bits) ((number min-bits) >> 0)
      (assert (number min-bits) ((number min-bits) << 0)

      (assert (number min-bits) ((number min-bits) >>> 0)
    ).
  ).
  (define "(number bits)" (=> ()
    (should "(number bits) is 32." (=> ()
      (assert 32 (number bits).
    ).
  ).
).

(define "Special Values" (= ()
  (define "(number infinite)" (=> ()
    (should "most of operations of the value generate itself." (= ()
      (assert (number infinite) ((number infinite) + 0).
      (assert (number infinite) ((number infinite) - 0).
      (assert (number infinite) ((number infinite) + 1).
      (assert (number infinite) ((number infinite) - 1).
      (assert (number infinite) ((number infinite) * 2).
      (assert (number infinite) ((number infinite) / 2).
    ).
    (should "some operations are invalid." (= ()
      (assert (number invalid) ((number infinite) - (number infinite).
      (assert (number invalid) ((number infinite) * 0).
      (assert (number invalid) ((number infinite) / (number infinite).
      (assert (number invalid) ((number infinite) + (number -infinite).
    ).
  ).
  (define "(number -infinite)" (=> ()
    (should "most of operations of the value generate itself." (= ()
      (assert (number -infinite) ((number -infinite) + 0).
      (assert (number -infinite) ((number -infinite) - 0).
      (assert (number -infinite) ((number -infinite) + 1).
      (assert (number -infinite) ((number -infinite) - 1).
      (assert (number -infinite) ((number -infinite) * 2).
      (assert (number -infinite) ((number -infinite) / 2).
    ).
    (should "some operations are invalid." (= ()
      (assert (number invalid) ((number -infinite) - (number -infinite).
      (assert (number invalid) ((number -infinite) * 0).
      (assert (number invalid) ((number -infinite) / (number infinite).
      (assert (number invalid) ((number -infinite) + (number infinite).
    ).
  ).
  (define "(number invalid)" (=> ()
    (should "all arithmetic operations of the value generate itself." (= ()
      (assert (number invalid) ((number invalid) + 1).
      (assert (number invalid) ((number invalid) - 1).
      (assert (number invalid) ((number invalid) - (number invalid).
      (assert (number invalid) ((number invalid) * 0).
      (assert (number invalid) ((number invalid) / 1).
      (assert (number invalid) ((number invalid) / (number invalid).
    ).
  ).
).

(define "(number parse ...)" (= ()
  (should "(number parse str) parses a decimal string to its real number value" (= ()
    (assert 0 (number parse "0").
    (assert ((number parse "-0") is -0).

    (assert 0.5 (number parse "0.5").
    (assert -0.5 (number parse "-0.5").

    (assert 1 (number parse "1").
    (assert -1 (number parse "-1").

    (assert (number invalid) (number parse "(number invalid)").
    (assert (number infinite) (number parse "(number infinite)").
    (assert (number -infinite) (number parse "(number -infinite)").
  ).
  (should "(number parse a-number) returns a-number." (= ()
    (assert 0 (number parse 0).
    (assert ((number parse -0) is -0).

    (assert 0.5 (number parse 0.5).
    (assert -0.5 (number parse -0.5).

    (assert 1 (number parse 1).
    (assert -1 (number parse -1).

    (assert (number invalid) (number parse (number invalid).
    (assert (number infinite) (number parse (number infinite).
    (assert (number -infinite) (number parse (number -infinite).
  ).
  (should "(number parse non-number-string) returns (number invalid)." (= ()
    (assert (number invalid) (number parse "").
    (assert (number invalid) (number parse "a").
    (assert (number invalid) (number parse "A").
    (assert (number invalid) (number parse "xyz").
    (assert (number invalid) (number parse "XYZ").
    (assert (number invalid) (number parse "\t").
    (assert (number invalid) (number parse "\r").
    (assert (number invalid) (number parse "\n").
  ).
  (should "(number parse other-value) returns (number invalid)." (= ()
    (assert (number invalid) (number parse).
    (assert (number invalid) (number parse null).
    (assert (number invalid) (number parse type).
    (assert (number invalid) (number parse (bool empty).
    (assert (number invalid) (number parse (range empty).
    (assert (number invalid) (number parse (symbol empty).
    (assert (number invalid) (number parse (tuple empty).
    (assert (number invalid) (number parse (operator empty).
    (assert (number invalid) (number parse (lambda empty).
    (assert (number invalid) (number parse (function empty).
    (assert (number invalid) (number parse (array empty).
    (assert (number invalid) (number parse (object empty).
    (assert (number invalid) (number parse (class empty).
  ).
).

(define "(number parse-int ...)" (= ()
  (should "(number parse-int str) parses a decimal string to its integer value" (= ()
    (assert 0 (number parse-int "0").
    (assert ((number parse-int "-0") is 0).

    (assert 1 (number parse-int "1").
    (assert -1 (number parse-int "-1").

    (assert 127 (number parse-int "127").
    (assert -127 (number parse-int "-127").

    (assert 65537 (number parse-int "65537").
    (assert -65537 (number parse-int "-65537").
  ).
  (should "(number parse-int a-number) returns the truncated number value." (= ()
    (assert 0 (number parse-int 0).
    (assert ((number parse-int -0) is 0).

    (assert 0 (number parse-int 0.5).
    (assert 0 (number parse-int -0.5).

    (assert 1 (number parse-int 1).
    (assert -1 (number parse-int -1).

    (assert 1 (number parse-int 1.5).
    (assert -1 (number parse-int -1.5).

    (assert 127 (number parse-int 127).
    (assert -127 (number parse-int -127).

    (assert 127 (number parse-int 127.5).
    (assert -127 (number parse-int -127.5).

    (assert 65537 (number parse-int 65537).
    (assert -65537 (number parse-int -65537).

    (assert 65537 (number parse-int 65537.5).
    (assert -65537 (number parse-int -65537.5).
  ).
  (should "(number parse-int hex-str) parses a hex string to its integer value." (= ()
    (assert 0 (number parse-int "0x0").
    (assert 1 (number parse-int "0x1").
    (assert 1 (number parse-int "0x01").
    (assert 1 (number parse-int "0x0001").
    (assert 1 (number parse-int "0x000001").
    (assert 1 (number parse-int "0x00000001").
    (assert 65535 (number parse-int "0x000FFFF").
    (assert 65535 (number parse-int "0x000ffff").
  ).
  (should "(number parse-int bit-str) parses a octal string to its integer value" (= ()
    (assert 0 (number parse-int "00").
    (assert 1 (number parse-int "01").
    (assert 7 (number parse-int "07").
    (assert 9 (number parse-int "011").
    (assert 15 (number parse-int "017").
    (assert 16 (number parse-int "020").
  ).
  (should "(number parse-int bit-str) parses a bit string to its integer value" (= ()
    (assert 0 (number parse-int "0b0").
    (assert 1 (number parse-int "0b1").
    (assert 1 (number parse-int "0b01").
    (assert 3 (number parse-int "0b11").
    (assert 7 (number parse-int "0b111").
  ).
  (should "(number parse-int int-value) returns value between min-int and max-int or (number invalid)" (= ()
    (assert (number invalid) (number parse-int ((number min-int) - 1).
    (assert (number invalid) (number parse-int ((number max-int) + 1).

    (assert (number invalid) (number parse-int (((number min-int) - 1) to-string).
    (assert (number invalid) (number parse-int (((number max-int) + 1) to-string).
  ).
  (should "(number parse-int (number invalid)) returns (number invalid)" (= ()
    (assert (number invalid) (number parse-int (number invalid).
  ).
  (should "(number parse-int invalid-int-str) returns (number invalid)." (= ()
    (assert (number invalid) (number parse-int "").
    (assert (number invalid) (number parse-int "a").
    (assert (number invalid) (number parse-int "A").
    (assert (number invalid) (number parse-int "xyz").
    (assert (number invalid) (number parse-int "XYZ").
    (assert (number invalid) (number parse-int "\t").
    (assert (number invalid) (number parse-int "\r").
    (assert (number invalid) (number parse-int "\n").

    (assert (number invalid) (number parse-int "0B1").
    (assert (number invalid) (number parse-int "0X1").
    (assert (number invalid) (number parse-int "08").

    (assert (number invalid) (number parse-int "0xG").
    (assert (number invalid) (number parse-int "0b2").
  ).
  (should "(number parse-int other-value) returns (number invalid)." (= ()
    (assert (number invalid) (number parse-int).
    (assert (number invalid) (number parse-int null).
    (assert (number invalid) (number parse-int type).
    (assert (number invalid) (number parse-int (bool empty).
    (assert (number invalid) (number parse-int (range empty).
    (assert (number invalid) (number parse-int (symbol empty).
    (assert (number invalid) (number parse-int (tuple empty).
    (assert (number invalid) (number parse-int (operator empty).
    (assert (number invalid) (number parse-int (lambda empty).
    (assert (number invalid) (number parse-int (function empty).
    (assert (number invalid) (number parse-int (array empty).
    (assert (number invalid) (number parse-int (object empty).
    (assert (number invalid) (number parse-int (class empty).
  ).
).

(define "(number of ...)" (= ()
  (should "(number of) returns 0." (= ()
    (assert ((number of) is 0).
  ).
  (should "(number of null) returns 0." (= ()
    (assert ((number of null) is 0).
  ).
  (should "(number of a-number) returns a-number." (= ()
    (assert 0 (number of 0).
    (assert ((number of -0) is -0).

    (assert 1 (number of 1).
    (assert -1 (number of -1).

    (assert 1.5 (number of 1.5).
    (assert -1.5 (number of -1.5).

    (assert (number infinite) (number of (number infinite).
    (assert (number -infinite) (number of (number -infinite).
    (assert (number invalid) (number of (number invalid).
  ).
  (should "(number of false) returns 0." (= ()
    (assert ((number of false) is 0).
  ).
  (should "(number of true) returns 1." (= ()
    (assert 1 (number of true).
  ).
  (should "(number of str) is converted by calling (number parse str)." (= ()
    (assert 0 (number of "0").
    (assert ((number of "-0") is -0).

    (assert 1 (number of "1").
    (assert -1 (number of "-1").

    (assert 1.5 (number of "1.5").
    (assert -1.5 (number of "-1.5").

    (assert 1 (number of "0x01").
    (assert 1 (number of "0b01").
    (assert 1 (number of "01").

    (assert 0 (number of "0X1").
    (assert 0 (number of "0B1").
    (assert 7 (number of "07").
    (assert 8 (number of "08").

    (assert (number invalid) (number of "").
    (assert (number invalid) (number of "ABC").
    (assert (number invalid) (number of "0xG").
    (assert (number invalid) (number of "0b2").
    (assert (number invalid) (number of "(number invalid)").

    (assert (number infinite) (number of "(number infinite)").
    (assert (number -infinite) (number of "(number -infinite)").
  ).
  (should "(number of a-date) is converted to its timestamp value." (= ()
    (assert 0 (number of (date of 0).
    (assert 1 (number of (date of 1).
    (assert -1 (number of (date of -1).
  ).
  (should "(number of other-value) returns (number invalid)." (= ()
    (assert (number invalid) (number of type).
    (assert (number invalid) (number of bool).
    (assert (number invalid) (number of string).
    (assert (number invalid) (number of number).
    (assert (number invalid) (number of date).
    (assert (number invalid) (number of range).
    (assert (number invalid) (number of symbol).
    (assert (number invalid) (number of tuple).
    (assert (number invalid) (number of operator).
    (assert (number invalid) (number of lambda).
    (assert (number invalid) (number of function).
    (assert (number invalid) (number of array).
    (assert (number invalid) (number of object).
    (assert (number invalid) (number of class).

    (assert (number invalid) (number of (range empty).
    (assert (number invalid) (number of (symbol empty).
    (assert (number invalid) (number of (tuple empty).
    (assert (number invalid) (number of (operator empty).
    (assert (number invalid) (number of (lambda empty).
    (assert (number invalid) (number of (function empty).
    (assert (number invalid) (number of (array empty).
    (assert (number invalid) (number of (object empty).
    (assert (number invalid) (number of (class empty).
  ).
  (should "(number of invalid default-value) returns the default-value." (= ()
    (assert 1 (number of "" 1).
    (assert 1 (number of "ABC" 1).
    (assert 1 (number of "XYZ" 1).

    (assert 1 (number of "0xG" 1).
    (assert 1 (number of "0b2" 1).

    (assert 1 (number of type 1).
    (assert 1 (number of bool 1).
    (assert 1 (number of string 1).
    (assert 1 (number of number 1).
    (assert 1 (number of date 1).
    (assert 1 (number of range 1).
    (assert 1 (number of symbol 1).
    (assert 1 (number of tuple 1).
    (assert 1 (number of operator 1).
    (assert 1 (number of lambda 1).
    (assert 1 (number of function 1).
    (assert 1 (number of array 1).
    (assert 1 (number of object 1).
    (assert 1 (number of class 1).

    (assert 1 (number of (range empty) 1).
    (assert 1 (number of (symbol empty) 1).
    (assert 1 (number of (tuple empty) 1).
    (assert 1 (number of (operator empty) 1).
    (assert 1 (number of (lambda empty) 1).
    (assert 1 (number of (function empty) 1).
    (assert 1 (number of (array empty) 1).
    (assert 1 (number of (object empty) 1).
    (assert 1 (number of (class empty) 1).
  ).
).

(define "(number of-int ...)" (= ()
  (should "(number of-int) returns 0." (= ()
    (assert ((number of-int) is 0).
  ).
  (should "(number of-int null) returns 0." (= ()
    (assert ((number of-int null) is 0).
  ).
  (should "(number of-int -0) returns 0." (= ()
    (assert ((number of-int -0) is 0).
  ).
  (should "(number of-int a-number) returns a-number's integer part." (= ()
    (assert 0 (number of-int 0).

    (assert 1 (number of-int 1.5).
    (assert -1 (number of-int -1.5).

    (assert 2 (number of-int 2).
    (assert -2 (number of-int -2).
  ).
  (should "(number of-int (number invalid)) returns 0." (= ()
    (assert 0 (number of-int (number invalid).
  ).
  (should "(number of-int (number infinite)) returns 0." (= ()
    (assert (number max-int) (number of-int (number infinite).
  ).
  (should "(number of-int (number -infinite)) returns 0." (= ()
    (assert (number min-int) (number of-int (number -infinite).
  ).
  (should "(number of-int false) returns 0." (= ()
    (assert ((number of-int false) is 0).
  ).
  (should "(number of-int true) returns 1." (= ()
    (assert 1 (number of-int true).
  ).
  (should "(number of-int str) returns (number parse-int str)." (= ()
    (assert 0 (number of-int "0").
    (assert ((number of-int "-0") is 0).

    (assert 1 (number of-int "1.5").
    (assert -1 (number of-int "-1.5").

    (assert 2 (number of-int "2").
    (assert -2 (number of-int "-2").

    (assert 17 (number of-int "0x11").
    (assert 3 (number of-int "0b11").

    (assert -1 (number of-int "0xFFFFFFFFi").
    (assert -1 (number of-int "0b11111111111111111111111111111111i").

    (assert 0 (number of-int "(number invalid)").
    (assert 0 (number of-int "(number infinite)").
    (assert 0 (number of-int "(number -infinite)").
  ).
  (should "(number of-int other-value) returns 0." (= ()
    (assert 0 (number of-int "").
    (assert 0 (number of-int "ABC").
    (assert 0 (number of-int "XYZ").

    (assert 0 (number of-int "0xG").
    (assert 0 (number of-int "0b2").

    (assert 0 (number of-int type).
    (assert 0 (number of-int bool).
    (assert 0 (number of-int string).
    (assert 0 (number of-int number).
    (assert 0 (number of-int date).
    (assert 0 (number of-int range).
    (assert 0 (number of-int symbol).
    (assert 0 (number of-int tuple).
    (assert 0 (number of-int operator).
    (assert 0 (number of-int lambda).
    (assert 0 (number of-int function).
    (assert 0 (number of-int array).
    (assert 0 (number of-int object).
    (assert 0 (number of-int class).

    (assert 0 (number of-int (date empty).
    (assert 0 (number of-int (range empty).
    (assert 0 (number of-int (symbol empty).
    (assert 0 (number of-int (tuple empty).
    (assert 0 (number of-int (operator empty).
    (assert 0 (number of-int (lambda empty).
    (assert 0 (number of-int (function empty).
    (assert 0 (number of-int (array empty).
    (assert 0 (number of-int (object empty).
    (assert 0 (number of-int (class empty).
  ).
  (should "An invalid conversion returns the default value if it's provided." (= ()
    (assert 1 (number of-int "" 1).
    (assert 1 (number of-int "ABC" 1).
    (assert 1 (number of-int "XYZ" 1).

    (assert 1 (number of-int "0xG" 1).
    (assert 1 (number of-int "0b2" 1).

    (assert 1 (number of-int type 1).
    (assert 1 (number of-int bool 1).
    (assert 1 (number of-int string 1).
    (assert 1 (number of-int number 1).
    (assert 1 (number of-int date 1).
    (assert 1 (number of-int range 1).
    (assert 1 (number of-int symbol 1).
    (assert 1 (number of-int tuple 1).
    (assert 1 (number of-int operator 1).
    (assert 1 (number of-int lambda 1).
    (assert 1 (number of-int function 1).
    (assert 1 (number of-int array 1).
    (assert 1 (number of-int object 1).
    (assert 1 (number of-int class 1).

    (assert 1 (number of-int (date empty) 1).
    (assert 1 (number of-int (range empty) 1).
    (assert 1 (number of-int (symbol empty) 1).
    (assert 1 (number of-int (tuple empty) 1).
    (assert 1 (number of-int (operator empty) 1).
    (assert 1 (number of-int (lambda empty) 1).
    (assert 1 (number of-int (function empty) 1).
    (assert 1 (number of-int (array empty) 1).
    (assert 1 (number of-int (object empty) 1).
    (assert 1 (number of-int (class empty) 1).
  ).
).

(define "(number of-bits ...) # 32-bit signed integer" (= ()
  (should "(number of-bits ...) generally works like (number of-int ...)." (= ()
    (assert ((number of-bits) is 0).
    (assert ((number of-bits null) is 0).

    (assert ((number of-bits 0) is 0).
    (assert ((number of-bits -0) is 0).

    (assert 1 (number of-bits 1.5).
    (assert -1 (number of-bits -1.5).

    (assert 0 (number of-bits (number invalid).
    (assert -1 (number of-bits (number infinite).
    (assert 1 (number of-bits (number -infinite).

    (assert ((number of-bits false) is 0).
    (assert 1 (number of-bits true).

    (assert 0 (number of-bits "0").
    (assert ((number of-bits "-0") is 0).

    (assert 1 (number of-bits "1.5").
    (assert -1 (number of-bits "-1.5").

    (assert 2 (number of-bits "2").
    (assert -2 (number of-bits "-2").

    (assert 17 (number of-bits "0x11").
    (assert 3 (number of-bits "0b11").

    (assert 0 (number of-bits "(number invalid)").
    (assert 0 (number of-bits "(number infinite)").
    (assert 0 (number of-bits "(number -infinite)").

    (assert 0 (number of-bits "").
    (assert 0 (number of-bits "ABC").
    (assert 0 (number of-bits "XYZ").

    (assert 0 (number of-bits "0xG").
    (assert 0 (number of-bits "0b2").

    (assert 0 (number of-bits type).
    (assert 0 (number of-bits bool).
    (assert 0 (number of-bits string).
    (assert 0 (number of-bits number).
    (assert 0 (number of-bits date).
    (assert 0 (number of-bits range).
    (assert 0 (number of-bits symbol).
    (assert 0 (number of-bits tuple).
    (assert 0 (number of-bits operator).
    (assert 0 (number of-bits lambda).
    (assert 0 (number of-bits function).
    (assert 0 (number of-bits array).
    (assert 0 (number of-bits object).
    (assert 0 (number of-bits class).

    (assert 0 (number of-bits (date empty).
    (assert 0 (number of-bits (range empty).
    (assert 0 (number of-bits (symbol empty).
    (assert 0 (number of-bits (tuple empty).
    (assert 0 (number of-bits (operator empty).
    (assert 0 (number of-bits (lambda empty).
    (assert 0 (number of-bits (function empty).
    (assert 0 (number of-bits (array empty).
    (assert 0 (number of-bits (object empty).
    (assert 0 (number of-bits (class empty).
  ).
  (should "an integer exceeding (number bits) is truncated to a signed value." (= ()
    (assert (number max-bits) (number of-bits ((number min-bits) - 1).
    (assert (number min-bits) (number of-bits ((number max-bits) + 1).

    (assert 1 (number of-bits 0x100000001).
    (assert 2 (number of-bits 0x100000002).

    (assert -1 (number of-bits 0xFFFFFFFF).
    (assert -1 (number of-bits 0x1FFFFFFFF).

    (assert -2 (number of-bits 0xFFFFFFFE).
    (assert -2 (number of-bits 0x1FFFFFFFE).
  ).
).

(define "(a-number is-valid)" (= ()
  (should "((number invalid) is-valid) returns false." (= ()
    (assert false ((number invalid) is-valid).
  ).
  (should "(valid-number is-valid) returns true." (= ()
    (assert (0 is-valid).
    (assert (-0 is-valid).

    (assert (1 is-valid).
    (assert (-1 is-valid).

    (assert (1.5 is-valid).
    (assert (-1.5 is-valid).

    (assert ((number min) is-valid).
    (assert ((number max) is-valid).

    (assert ((number smallest) is-valid).

    (assert ((number min-bits) is-valid).
    (assert ((number max-bits) is-valid).

    (assert ((number min-int) is-valid).
    (assert ((number max-int) is-valid).

    (assert ((number infinite) is-valid).
    (assert ((number -infinite) is-valid).
  ).
).

(define "(a-number is-invalid)" (= ()
  (should "((number invalid) is-invalid) returns true." (= ()
    (assert ((number invalid) is-invalid).
  ).
  (should "(valid-number is-invalid) returns false." (= ()
    (assert false (0 is-invalid).
    (assert false (-0 is-invalid).

    (assert false (1 is-invalid).
    (assert false (-1 is-invalid).

    (assert false (1.5 is-invalid).
    (assert false (-1.5 is-invalid).

    (assert false ((number min) is-invalid).
    (assert false ((number max) is-invalid).

    (assert false ((number smallest) is-invalid).

    (assert false ((number min-bits) is-invalid).
    (assert false ((number max-bits) is-invalid).

    (assert false ((number min-int) is-invalid).
    (assert false ((number max-int) is-invalid).

    (assert false ((number infinite) is-invalid).
    (assert false ((number -infinite) is-invalid).
  ).
).

(define "(a-number is-finite)" (= ()
  (should "((number infinite) is-finite) returns false." (= ()
    (assert false ((number infinite) is-finite).
  ).
  (should "((number -infinite) is-finite) returns false." (= ()
    (assert false ((number -infinite) is-finite).
  ).
  (should "((number invalid) is-finite) returns false." (= ()
    (assert false ((number invalid) is-finite).
  ).
  (should "(finite-number is-finite) returns true." (= ()
    (assert (0 is-finite).
    (assert (-0 is-finite).

    (assert (1 is-finite).
    (assert (-1 is-finite).

    (assert (1.5 is-finite).
    (assert (-1.5 is-finite).

    (assert ((number min) is-finite).
    (assert ((number max) is-finite).

    (assert ((number smallest) is-finite).

    (assert ((number min-bits) is-finite).
    (assert ((number max-bits) is-finite).

    (assert ((number min-int) is-finite).
    (assert ((number max-int) is-finite).
  ).
).

(define "(a-number is-infinite)" (= ()
  (should "((number infinite) is-infinite) returns true." (= ()
    (assert ((number infinite) is-infinite).
  ).
  (should "((number -infinite) is-infinite) returns true." (= ()
    (assert ((number -infinite) is-infinite).
  ).
  (should "((number invalid) is-infinite) returns true." (= ()
    (assert ((number invalid) is-infinite).
  ).
  (should "(finite-number is-infinite) returns false." (= ()
    (assert false (0 is-infinite).
    (assert false (-0 is-infinite).

    (assert false (1 is-infinite).
    (assert false (-1 is-infinite).

    (assert false (1.5 is-infinite).
    (assert false (-1.5 is-infinite).

    (assert false ((number min) is-infinite).
    (assert false ((number max) is-infinite).

    (assert false ((number smallest) is-infinite).

    (assert false ((number min-bits) is-infinite).
    (assert false ((number max-bits) is-infinite).

    (assert false ((number min-int) is-infinite).
    (assert false ((number max-int) is-infinite).
  ).
).

(define "(a-number is-int)" (= ()
  (should "(an-int-value is-int) returns true." (= ()
    (assert (0 is-int).

    (assert (1 is-int).
    (assert (-1 is-int).

    (assert (2 is-int).
    (assert (-2 is-int).

    (assert ((number min-int) is-int).
    (assert ((number max-int) is-int).
  ).
  (should "(non-int-value is-int) returns false." (= ()
    (assert false (-0 is-int).

    (assert false (1.5 is-int).
    (assert false (-1.5 is-int).

    (assert false ((number max) is-int).
    (assert false ((number min) is-int).

    (assert false ((number smallest) is-int).

    (assert false ((number invalid) is-int).
    (assert false ((number infinite) is-int).
    (assert false ((number -infinite) is-int).
  ).
).

(define "(a-number is-not-int)" (= ()
  (should "(an-int-value is-not-int) returns false." (= ()
    (assert false (0 is-not-int).

    (assert false (1 is-not-int).
    (assert false (-1 is-not-int).

    (assert false (2 is-not-int).
    (assert false (-2 is-not-int).

    (assert false ((number min-int) is-not-int).
    (assert false ((number max-int) is-not-int).
  ).
  (should "(non-int-value is-not-int) returns true." (= ()
    (assert (-0 is-not-int).

    (assert (1.5 is-not-int).
    (assert (-1.5 is-not-int).

    (assert ((number max) is-not-int).
    (assert ((number min) is-not-int).

    (assert ((number smallest) is-not-int).

    (assert ((number invalid) is-not-int).
    (assert ((number infinite) is-not-int).
    (assert ((number -infinite) is-not-int).
  ).
).

(define "(a-number is-bits)" (= ()
  (should "(a-bits-value is-bits) returns true." (= ()
    (assert (0 is-bits).

    (assert (1 is-bits).
    (assert (-1 is-bits).

    (assert (2 is-bits).
    (assert (-2 is-bits).

    (assert ((number min-bits) is-bits).
    (assert ((number max-bits) is-bits).
  ).
  (should "(non-int-value is-bits) returns false." (= ()
    (assert false (-0 is-bits).

    (assert false (1.5 is-bits).
    (assert false (-1.5 is-bits).

    (assert false ((number max) is-bits).
    (assert false ((number min) is-bits).

    (assert false ((number smallest) is-bits).

    (assert false ((number invalid) is-bits).
    (assert false ((number infinite) is-bits).
    (assert false ((number -infinite) is-bits).
  ).
).

(define "(a-number is-not-bits)" (= ()
  (should "(an-int-value is-not-bits) returns false." (= ()
    (assert false (0 is-not-bits).

    (assert false (1 is-not-bits).
    (assert false (-1 is-not-bits).

    (assert false (2 is-not-bits).
    (assert false (-2 is-not-bits).

    (assert false ((number min-bits) is-not-bits).
    (assert false ((number max-bits) is-not-bits).
  ).
  (should "(non-bits-value is-not-bits) returns true." (= ()
    (assert (-0 is-not-bits).

    (assert (1.5 is-not-bits).
    (assert (-1.5 is-not-bits).

    (assert ((number max) is-not-bits).
    (assert ((number min) is-not-bits).

    (assert ((number smallest) is-not-bits).

    (assert ((number invalid) is-not-bits).
    (assert ((number infinite) is-not-bits).
    (assert ((number -infinite) is-not-bits).
  ).
).

(define "(a-number as-int)" (= ()
  (should "(an-int as-int) returns the original value." (= ()
    (assert ((0 as-int) is 0).

    (assert -1 (-1 as-int).
    (assert 1 (1 as-int)

    (assert (number max-int) ((number max-int) as-int).
    (assert (number min-int) ((number min-int) as-int)
  ).
  (should "(a-float as-int) returns the integer part of the value." (= ()
    (assert ((-0 as-int) is 0).

    (assert ((0.1 as-int) is 0).
    (assert ((-0.1 as-int) is 0).

    (assert 1 (1.5 as-int)
    (assert -1 (-1.5 as-int)
  ).
  (should "((number invalid) as-int) returns 0." (= ()
    (assert (((number invalid) as-int) is 0).
  ).
  (should "(a-large-number as-int) returns (number max-int)." (= ()
    (assert (number max-int) (((number max-int) + 1) as-int).
    (assert (number max-int) ((number max) as-int).
    (assert (number max-int) ((number infinite) as-int).
  ).
  (should "(a-small-number as-int) returns (number min-int)." (= ()
    (assert (number min-int) (((number min-int) - 1) as-int).
    (assert (number min-int) ((number min) as-int).
    (assert (number min-int) ((number -infinite) as-int).
  ).
).

(define "(a-number as-bits)" (= ()
  (should "(a-bits-int as-bits) returns the original value." (= ()
    (assert ((0 as-bits) is 0).

    (assert -1 (-1 as-bits).
    (assert 1 (1 as-bits)

    (assert (number max-bits) ((number max-bits) as-bits).
    (assert (number min-bits) ((number min-bits) as-bits)
  ).
  (should "(a-float-value as-bits) returns the integer part of the value." (= ()
    (assert ((-0 as-bits) is 0).

    (assert ((0.1 as-bits) is 0).
    (assert ((-0.1 as-bits) is 0).

    (assert 1 (1.5 as-bits)
    (assert -1 (-1.5 as-bits)
  ).
  (should "((number invalid) as-bits) returns 0." (= ()
    (assert (((number invalid) as-bits) is 0).
  ).
  (should "(a-wide-number as-bits) returns the value of low 4 bytes." (= ()
    (assert ((0x100000000 as-bits) is 0).
    (assert 1 (0x100000001 as-bits).
    (assert 0x7FFFFFFF (0x17FFFFFFF as-bits).

    (assert (number min-bits) (((number max-bits) + 1) as-bits).
    (assert (number max-bits) (((number min-bits) - 1) as-bits).

    (assert (((number infinite) as-bits) is 0).
    (assert (((number -infinite) as-bits) is 0).
  ).
).

(define "(a-number th)" (= ()
  (should "(a-number th) always returns a safe integer." (= ()
    (assert -1 (0.1 th).
    (assert -1 (-0 th).
    (assert -1 (-0.1 th).

    (assert -1 ((number smallest) th).

    (assert (number min-int) ((number min) th).
    (assert (number max-int:: - 1) ((number max) th).

    (assert (number min-int) ((number min-int) th).
    (assert (number max-int:: - 1) ((number max-int) th).

    (assert (number min-int) ((number -infinite) th).
    (assert (number max-int:: - 1) ((number infinite) th).
  ).
  (should "(0 th) returns -1." (= ()
    (assert -1 (0 th).
    (assert -1 (-0 th).
  ).
  (should "(a-number th) returns (a-number - 1) if the number is positive." (= ()
    (assert 0 (1 th).
    (assert 1 (2 th).
    (assert 2 (3 th).
    (assert 9 (10 th).
    (assert 99 (100 th).
  ).
  (should "(a-number th) returns the original number if it's negative." (= ()
    (assert -1 (-1 th).
    (assert -2 (-2 th).
    (assert -3 (-3 th).
    (assert -10 (-10 th).
    (assert -100 (-100 th).
  ).
).

(define "(a-number st)" (= ()
  (should "(a-number \"st\") is an alias of (a-number \"th\")." (= ()
    (assert (1 "st":: is (1 "th").
  ).
).

(define "(a-number nd)" (= ()
  (should "(a-number \"nd\") is another alias of (a-number \"th\")." (= ()
    (assert (1 "nd":: is (1 "th").
  ).
).

(define "(a-number rd)" (= ()
  (should "(a-number \"rd\") is another alias of (a-number \"th\")." (= ()
    (assert (1 "rd":: is (1 "th").
  ).
).

(define "(++ a-number)" (= ()
  (should "(++ num) increments the value of num by 1 and returns the incremented value." (= ()
    (assert 1 (++ 0).
    (assert 1 (++ -0).

    (var x -2)
    (assert -1 (++ x).
    (assert 0 (++ x).
    (assert 1 (++ x).
    (assert 2 (++ x).
    (assert 2 x).
  ).
  (should "(++ (number smallest)) produces 1." (= ()
    (var x (number smallest).
    (assert 1 (++ x).
    (assert 1 x).
  ).
  (should "(++ (number max)) still produces (number max)." (= ()
    (var x (number max).
    (assert (number max) (++ x).
    (assert (number max) x).
  ).
  (should "(++ (number infinite)) still produces (number infinite)." (= ()
    (var x (number infinite).
    (assert (number infinite) (++ x).
    (assert (number infinite) x).
  ).
  (should "(++ (number -infinite)) still produces (number -infinite)." (= ()
    (var x (number -infinite).
    (assert (number -infinite) (++ x).
    (assert (number -infinite) x).
  ).
  (should "(++ (number invalid)) still produces (number invalid)." (= ()
    (var x (number invalid).
    (assert (number invalid) (++ x).
    (assert (number invalid) x).
  ).
).

(define "(-- a-number)" (= ()
  (should "(-- num) decrements the value of num by 1 and returns the decremented value." (= ()
    (assert -1 (-- 0).
    (assert -1 (-- -0).

    (var x 2)
    (assert 1 (-- x).
    (assert 0 (-- x).
    (assert -1 (-- x).
    (assert -2 (-- x).
    (assert -2 x).
  ).
  (should "(-- (number smallest)) produces -1." (= ()
    (var x (number smallest).
    (assert -1 (-- x).
    (assert -1 x).
  ).
  (should "(-- (number min)) still produces (number min)." (= ()
    (var x (number min).
    (assert (number min) (-- x).
    (assert (number min) x).
  ).
  (should "(-- (number infinite)) still produces (number infinite)." (= ()
    (var x (number infinite).
    (assert (number infinite) (-- x).
    (assert (number infinite) x).
  ).
  (should "(-- (number -infinite)) still produces (number -infinite)." (= ()
    (var x (number -infinite).
    (assert (number -infinite) (-- x).
    (assert (number -infinite) x).
  ).
  (should "(-- (number invalid)) still produces (number invalid)." (= ()
    (var x (number invalid).
    (assert (number invalid) (-- x).
    (assert (number invalid) x).
  ).
).

(define "(a-number ++)" (= ()
  (should "(num ++) increments the value of num by 1 but returns the original value." (= ()
    (assert 0 (0 ++).
    (assert ((-0 ++) is -0).

    (var x -1)
    (assert -1 (x ++).
    (assert 0 (x ++).
    (assert 1 (x ++).
    (assert 2 (x ++).
    (assert 3 x).
  ).
  (should "((number smallest) ++) produces 1." (= ()
    (var x (number smallest).
    (assert (number smallest) (x ++).
    (assert 1 x).
  ).
  (should "((number max) ++) still produces (number max)." (= ()
    (var x (number max).
    (assert (number max) (x ++).
    (assert (number max) x).
  ).
  (should "((number infinite) ++) still produces (number infinite)." (= ()
    (var x (number infinite).
    (assert (number infinite) (x ++).
    (assert (number infinite) x).
  ).
  (should "((number -infinite) ++) still produces (number -infinite)." (= ()
    (var x (number -infinite).
    (assert (number -infinite) (x ++).
    (assert (number -infinite) x).
  ).
  (should "((number invalid) ++) still produces (number invalid)." (= ()
    (var x (number invalid).
    (assert (number invalid) (x ++).
    (assert (number invalid) x).
  ).
).

(define "(a-number --)" (= ()
  (should "(num --) decrements the value of num by 1 but returns the original value." (= ()
    (assert 0 (0 --).
    (assert ((-0 --) is -0).

    (var x 1)
    (assert 1 (x --).
    (assert 0 (x --).
    (assert -1 (x --).
    (assert -2 (x --).
    (assert -3 x).
  ).
  (should "((number smallest) --) produces -1." (= ()
    (var x (number smallest).
    (assert (number smallest) (x --).
    (assert -1 x).
  ).
  (should "((number max) --) still produces (number max)." (= ()
    (var x (number max).
    (assert (number max) (x --).
    (assert (number max) x).
  ).
  (should "((number infinite) --) still produces (number infinite)." (= ()
    (var x (number infinite).
    (assert (number infinite) (x --).
    (assert (number infinite) x).
  ).
  (should "((number -infinite) --) still produces (number -infinite)." (= ()
    (var x (number -infinite).
    (assert (number -infinite) (x --).
    (assert (number -infinite) x).
  ).
  (should "((number invalid) --) still produces (number invalid)." (= ()
    (var x (number invalid).
    (assert (number invalid) (x --).
    (assert (number invalid) x).
  ).
).

(define "(a-number + ...)" (= ()
  (should "(num +) returns num." (= ()
    (assert 0 (0 +).
    (assert ((-0 +) is -0).

    (assert 1 (1 +).
    (assert -1 (-1 +).

    (assert 1.5 (1.5 +).
    (assert -1.5 (-1.5 +).

    (assert (number max) ((number max) +).
    (assert (number min) ((number min) +).

    (assert (number smallest) ((number smallest) +).

    (assert (number max-int) ((number max-int) +).
    (assert (number min-int) ((number min-int) +).

    (assert (number max-bits) ((number max-bits) +).
    (assert (number min-bits) ((number min-bits) +).

    (assert (number invalid) ((number invalid) +).

    (assert (number infinite) ((number infinite) +).
    (assert (number -infinite) ((number -infinite) +).
  ).
  (should "(num + x) increments the value of num by x." (= ()
    (assert 0 (0 + 0).
    (assert 1 (0 + 1).
    (assert -1 (0 + -1).

    (assert ((0 + -0) is 0).
    (assert ((-0 + 0) is 0).
    (assert ((-0 + -0) is -0).

    (assert ((-0 + 1) is 1).
    (assert ((-0 + -1) is -1).

    (assert 1 (1 + 0).
    (assert 2 (1 + 1).
    (assert 0 (1 + -1).
    (assert 0 (-1 + 1).
    (assert -2 (-1 + -1).

    (assert 1.5 (1.5 + 0).
    (assert 1.5 (0 + 1.5).

    (assert 2.5 (1.5 + 1).
    (assert 2.5 (1 + 1.5).

    (assert 0.5 (1.5 + -1).
    (assert 0.5 (-1 + 1.5).
  ).
  (should "(num + x y) increments the value of num by x and y." (= ()
    (assert 1 (0 + 0 1).
    (assert 2 (0 + 1 1).
    (assert 0 (0 + -1 1).

    (assert ((0 + -0 1) is 1).
    (assert ((-0 + 0 1) is 1).
    (assert ((-0 + -0 1) is 1).

    (assert ((-0 + 1 1) is 2).
    (assert ((-0 + -1 1) is 0).

    (assert 2 (1 + 0 1).
    (assert 3 (1 + 1 1).
    (assert 1 (1 + -1 1).
    (assert 1 (-1 + 1 1).
    (assert -1 (-1 + -1 1).

    (assert 2.5 (1.5 + 0 1).
    (assert 2.5 (0 + 1.5 1).

    (assert 3.5 (1.5 + 1 1).
    (assert 3.5 (1 + 1.5 1).

    (assert 1.5 (1.5 + -1 1).
    (assert 1.5 (-1 + 1.5 1).
  ).
  (should "(num + ...) accepts 3 or more arguments." (= ()
    (assert 3 (0 + 1 1 1).
    (assert 4 (0 + 1 1 1 1).
    (assert 5 (0 + 1 1 1 1 1).
    (assert 6 (0 + 1 1 1 1 1 1).
    (assert 7 (0 + 1 1 1 1 1 1 1).
    (assert 8 (0 + 1 1 1 1 1 1 1 1).
    (assert 16 (0 + 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert 32 (0 + 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert 64 (0 + 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert 128 (0 + 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert 256 (0 + 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert 512 (0 + 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert 1024 (0 + 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
  ).
  (should "((number max) + small-non-negative-value) still produces (number max)." (= ()
    (assert (number max) ((number max) + 0).
    (assert (number max) (0 + (number max).

    (assert (number max) ((number max) + -0).
    (assert (number max) (-0 + (number max).

    (assert (number max) ((number max) + 1).
    (assert (number max) (1 + (number max).

    (assert (number max) ((number max) + 1.5).
    (assert (number max) (1.5 + (number max).
  ).
  (should "((number min) + small-negative-value) still produces (number min)." (= ()
    (assert (number min) ((number min) + -1).
    (assert (number min) (-1 + (number min).

    (assert (number min) ((number min) + -1.5).
    (assert (number min) (-1.5 + (number min).
  ).
  (should "((number infinite) + non-negative-infinite) still produces (number infinite)." (= ()
    (assert (number infinite) ((number infinite) + 0).
    (assert (number infinite) (0 + (number infinite).

    (assert (number infinite) ((number infinite) + -0).
    (assert (number infinite) (-0 + (number infinite).

    (assert (number infinite) ((number infinite) + 1).
    (assert (number infinite) (1 + (number infinite).

    (assert (number infinite) ((number infinite) + -1).
    (assert (number infinite) (-1 + (number infinite).

    (assert (number infinite) ((number infinite) + 1.5).
    (assert (number infinite) (1.5 + (number infinite).

    (assert (number infinite) ((number infinite) + -1.5).
    (assert (number infinite) (-1.5 + (number infinite).

    (assert (number infinite) ((number infinite) + (number min).
    (assert (number infinite) ((number min) + (number infinite).

    (assert (number infinite) ((number infinite) + (number max).
    (assert (number infinite) ((number max) + (number infinite).

    (assert (number infinite) ((number infinite) + (number infinite).
  ).
  (should "((number infinite) + (number -infinite)) produces (number invalid)." (= ()
    (assert (number invalid) ((number infinite) + (number -infinite).
    (assert (number invalid) ((number -infinite) + (number infinite).
  ).
  (should "((number -infinite) + non-positive-infinite) still produces (number -infinite)." (= ()
    (assert (number -infinite) ((number -infinite) + 0).
    (assert (number -infinite) (0 + (number -infinite).

    (assert (number -infinite) ((number -infinite) + -0).
    (assert (number -infinite) (-0 + (number -infinite).

    (assert (number -infinite) ((number -infinite) + 1).
    (assert (number -infinite) (1 + (number -infinite).

    (assert (number -infinite) ((number -infinite) + -1).
    (assert (number -infinite) (-1 + (number -infinite).

    (assert (number -infinite) ((number -infinite) + 1.5).
    (assert (number -infinite) (1.5 + (number -infinite).

    (assert (number -infinite) ((number -infinite) + -1.5).
    (assert (number -infinite) (-1.5 + (number -infinite).

    (assert (number -infinite) ((number -infinite) + (number min).
    (assert (number -infinite) ((number min) + (number -infinite).

    (assert (number -infinite) ((number -infinite) + (number max).
    (assert (number -infinite) ((number max) + (number -infinite).

    (assert (number -infinite) ((number -infinite) + (number -infinite).
  ).
  (should "((number invalid) + any-number) still produces (number invalid)." (= ()
    (assert (number invalid) ((number invalid) + 0).
    (assert (number invalid) (0 + (number invalid).

    (assert (number invalid) ((number invalid) + -0).
    (assert (number invalid) (-0 + (number invalid).

    (assert (number invalid) ((number invalid) + 1).
    (assert (number invalid) (1 + (number invalid).

    (assert (number invalid) ((number invalid) + -1).
    (assert (number invalid) (-1 + (number invalid).

    (assert (number invalid) ((number invalid) + 1.5).
    (assert (number invalid) (1.5 + (number invalid).

    (assert (number invalid) ((number invalid) + -1.5).
    (assert (number invalid) (-1.5 + (number invalid).

    (assert (number invalid) ((number invalid) + (number min).
    (assert (number invalid) ((number min) + (number invalid).

    (assert (number invalid) ((number invalid) + (number max).
    (assert (number invalid) ((number max) + (number invalid).

    (assert (number invalid) ((number invalid) + (number infinite).
    (assert (number invalid) ((number infinite) + (number invalid).

    (assert (number invalid) ((number invalid) + (number -infinite).
    (assert (number invalid) ((number -infinite) + (number invalid).

    (assert (number invalid) ((number invalid) + (number invalid).
  ).
).

(define "(a-number plus ...)" (= ()
  (should "(num \"plus\") is the same of (number \"+\")." (= ()
    (assert ($(0 "plus") is (0 "+").
    (assert ($(-0 "plus") is (-0 "+").

    (assert ($(1 "plus") is (1 "+").
    (assert ($(-1 "plus") is (-1 "+").

    (assert ($(1.5 "plus") is (1.5 "+").
    (assert ($(-1.5 "plus") is (-1.5 "+").

    (assert ($((number max) "plus") is ((number max) "+").
    (assert ($((number min) "plus") is ((number min) "+").

    (assert ($((number infinite) "plus") is ((number infinite) "+").
    (assert ($((number -infinite) "plus") is ((number -infinite) "+").

    (assert ($((number invalid) "plus") is ((number invalid) "+").
  ).
).

(define "(a-number - ...)" (= ()
  (should "(num -) returns num." (= ()
    (assert 0 (0 -).
    (assert ((-0 -) is -0).

    (assert 1 (1 -).
    (assert -1 (-1 -).

    (assert 1.5 (1.5 -).
    (assert -1.5 (-1.5 -).

    (assert (number max) ((number max) -).
    (assert (number min) ((number min) -).

    (assert (number smallest) ((number smallest) -).

    (assert (number max-int) ((number max-int) -).
    (assert (number min-int) ((number min-int) -).

    (assert (number max-bits) ((number max-bits) -).
    (assert (number min-bits) ((number min-bits) -).

    (assert (number infinite) ((number infinite) -).
    (assert (number -infinite) ((number -infinite) -).

    (assert (number invalid) ((number invalid) -).
  ).
  (should "(num - x) decrements the value of num by x." (= ()
    (assert 0 (0 - 0).
    (assert -1 (0 - 1).
    (assert 1 (0 - -1).

    (assert ((0 - -0) is 0).
    (assert ((-0 - 0) is -0).
    (assert ((-0 - -0) is 0).

    (assert ((-0 - 1) is -1).
    (assert ((-0 - -1) is 1).

    (assert 1 (1 - 0).
    (assert 0 (1 - 1).
    (assert 2 (1 - -1).
    (assert -2 (-1 - 1).
    (assert 0 (-1 - -1).

    (assert 1.5 (1.5 - 0).
    (assert -1.5 (0 - 1.5).

    (assert 0.5 (1.5 - 1).
    (assert -0.5 (1 - 1.5).

    (assert 2.5 (1.5 - -1).
    (assert -2.5 (-1 - 1.5).
  ).
  (should "(num - x y) increments the value of num by x and y." (= ()
    (assert -1 (0 - 0 1).
    (assert -2 (0 - 1 1).
    (assert 0 (0 - -1 1).

    (assert ((0 - -0 1) is -1).
    (assert ((-0 - 0 1) is -1).
    (assert ((-0 - -0 1) is -1).

    (assert ((-0 - 1 1) is -2).
    (assert ((-0 - -1 1) is 0).

    (assert 0 (1 - 0 1).
    (assert -1 (1 - 1 1).
    (assert 1 (1 - -1 1).
    (assert -3 (-1 - 1 1).
    (assert -1 (-1 - -1 1).

    (assert 0.5 (1.5 - 0 1).
    (assert -2.5 (0 - 1.5 1).

    (assert -0.5 (1.5 - 1 1).
    (assert -1.5 (1 - 1.5 1).

    (assert 1.5 (1.5 - -1 1).
    (assert -3.5 (-1 - 1.5 1).
  ).
  (should "(num - ...) accepts 3 or more arguments." (= ()
    (assert -3 (0 - 1 1 1).
    (assert -4 (0 - 1 1 1 1).
    (assert -5 (0 - 1 1 1 1 1).
    (assert -6 (0 - 1 1 1 1 1 1).
    (assert -7 (0 - 1 1 1 1 1 1 1).
    (assert -8 (0 - 1 1 1 1 1 1 1 1).
    (assert -16 (0 - 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert -32 (0 - 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert -64 (0 - 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert -128 (0 - 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert -256 (0 - 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert -512 (0 - 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
    (assert -1024 (0 - 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1).
  ).
  (should "((number max) - small-negative-value) still produces (number max)." (= ()
    (assert (number max) ((number max) - 0).
    (assert (number max) ((number max) - -0).

    (assert (number max) ((number max) - -1).
    (assert (number max) ((number max) - -1.5).
  ).
  (should "((number min) - small-positive-value) still produces (number min)." (= ()
    (assert (number min) ((number min) - 1).
    (assert (number min) ((number min) - 1.5).
  ).
  (should "((number infinite) - non-positive-infinite-infinite) still produces (number infinite)." (= ()
    (assert (number infinite) ((number infinite) - 0).
    (assert (number infinite) ((number infinite) - -0).

    (assert (number infinite) ((number infinite) - 1).
    (assert (number infinite) ((number infinite) - -1).

    (assert (number infinite) ((number infinite) - 1.5).
    (assert (number infinite) ((number infinite) - -1.5).

    (assert (number infinite) ((number infinite) - (number min).
    (assert (number infinite) ((number infinite) - (number max).

    (assert (number infinite) ((number infinite) - (number -infinite).
  ).
  (should "((number infinite) - (number infinite)) produces (number invalid)." (= ()
    (assert (number invalid) ((number infinite) - (number infinite).
  ).
  (should "((number -infinite) - non-negative-infinite-infinite) still produces (number -infinite)." (= ()
    (assert (number -infinite) ((number -infinite) - 0).
    (assert (number -infinite) ((number -infinite) - -0).

    (assert (number -infinite) ((number -infinite) - 1).
    (assert (number -infinite) ((number -infinite) - -1).

    (assert (number -infinite) ((number -infinite) - 1.5).
    (assert (number -infinite) ((number -infinite) - -1.5).

    (assert (number -infinite) ((number -infinite) - (number min).
    (assert (number -infinite) ((number -infinite) - (number max).

    (assert (number -infinite) ((number -infinite) - (number infinite).
  ).
  (should "((number invalid) - any-number) still produces (number invalid)." (= ()
    (assert (number invalid) ((number invalid) - 0).
    (assert (number invalid) (0 - (number invalid).

    (assert (number invalid) ((number invalid) - -0).
    (assert (number invalid) (-0 - (number invalid).

    (assert (number invalid) ((number invalid) - 1).
    (assert (number invalid) (1 - (number invalid).

    (assert (number invalid) ((number invalid) - -1).
    (assert (number invalid) (-1 - (number invalid).

    (assert (number invalid) ((number invalid) - 1.5).
    (assert (number invalid) (1.5 - (number invalid).

    (assert (number invalid) ((number invalid) - -1.5).
    (assert (number invalid) (-1.5 - (number invalid).

    (assert (number invalid) ((number invalid) - (number min).
    (assert (number invalid) ((number min) - (number invalid).

    (assert (number invalid) ((number invalid) - (number max).
    (assert (number invalid) ((number max) - (number invalid).

    (assert (number invalid) ((number invalid) - (number infinite).
    (assert (number invalid) ((number infinite) - (number invalid).

    (assert (number invalid) ((number invalid) - (number -infinite).
    (assert (number invalid) ((number -infinite) - (number invalid).

    (assert (number invalid) ((number invalid) - (number invalid).
  ).
).

(define "(a-number minus ...)" (= ()
  (should "(num \"minus\") is the same of (number \"-\")." (= ()
    (assert ($(0 "minus") is (0 "-").
    (assert ($(-0 "minus") is (-0 "-").

    (assert ($(1 "minus") is (1 "-").
    (assert ($(-1 "minus") is (-1 "-").

    (assert ($(1.5 "minus") is (1.5 "-").
    (assert ($(-1.5 "minus") is (-1.5 "-").

    (assert ($((number max) "minus") is ((number max) "-").
    (assert ($((number min) "minus") is ((number min) "-").

    (assert ($((number infinite) "minus") is ((number infinite) "-").
    (assert ($((number -infinite) "minus") is ((number -infinite) "-").

    (assert ($((number invalid) "minus") is ((number invalid) "-").
  ).
).

(define "(a-number * ...)" (= ()
  (should "(num *) returns num." (= ()
    (assert 0 (0 *).
    (assert ((-0 *) is -0).

    (assert 1 (1 *).
    (assert -1 (-1 *).

    (assert 1.5 (1.5 *).
    (assert -1.5 (-1.5 *).

    (assert (number max) ((number max) *).
    (assert (number min) ((number min) *).

    (assert (number smallest) ((number smallest) *).

    (assert (number max-int) ((number max-int) *).
    (assert (number min-int) ((number min-int) *).

    (assert (number max-bits) ((number max-bits) *).
    (assert (number min-bits) ((number min-bits) *).

    (assert (number invalid) ((number invalid) *).

    (assert (number infinite) ((number infinite) *).
    (assert (number -infinite) ((number -infinite) *).
  ).
  (should "(num * 0) returns 0 or -0 if num is a valid & finite number." (= ()
    (assert ((0 * 0) is 0).
    (assert ((0 * -0) is -0).
    (assert ((-0 * 0) is -0).
    (assert ((-0 * -0) is 0).

    (assert ((0 * 1) is 0).
    (assert ((1 * 0) is 0).

    (assert ((0 * -1) is -0).
    (assert ((-1 * 0) is -0).

    (assert ((-0 * 1) is -0).
    (assert ((1 * -0) is -0).

    (assert ((1.5 * 0) is 0).
    (assert ((0 * 1.5) is 0).

    (assert ((-0 * 1.5) is -0).
    (assert ((1.5 * -0) is -0).

    (assert ((0 * -1.5) is -0).
    (assert ((-1.5 * 0) is -0).

    (assert (((number max) * 0) is 0).
    (assert ((0 * (number max)) is 0).

    (assert (((number min) * 0) is -0).
    (assert ((0 * (number min)) is -0).
  ).
  (should "((number infinite) * 0) returns (number invalid)." (= ()
    (assert (number invalid) ((number infinite) * 0).
    (assert (number invalid) ((number infinite) * -0).
  ).
  (should "((number -infinite) * 0) returns (number invalid)." (= ()
    (assert (number invalid) ((number -infinite) * 0).
    (assert (number invalid) ((number -infinite) * -0).
  ).
  (should "(num * 1) returns num." (= ()
    (assert 1 (1 * 1).

    (assert -1 (-1 * 1).
    (assert -1 (1 * -1).

    (assert 1.5 (1.5 * 1).
    (assert 1.5 (1 * 1.5).

    (assert -1.5 (-1.5 * 1).
    (assert -1.5 (1 * -1.5).

    (assert (number max) ((number max) * 1).
    (assert (number max) (1 * (number max).

    (assert (number min) ((number min) * 1).
    (assert (number min) (1 * (number min).

    (assert (number infinite) ((number infinite) * 1).
    (assert (number infinite) (1 * (number infinite).

    (assert (number -infinite) ((number -infinite) * 1).
    (assert (number -infinite) (1 * (number -infinite).
  ).
  (should "(num * -1) returns (0 - num)." (= ()
    (assert -1 (1 * -1).

    (assert -1.5 (1.5 * -1).
    (assert -1.5 (-1 * 1.5).

    (assert 1.5 (-1.5 * -1).
    (assert 1.5 (-1 * -1.5).

    (assert (0 - (number max)) ((number max) * -1).
    (assert (0 - (number max)) (-1 * (number max).

    (assert (0 - (number min)) ((number min) * -1).
    (assert (0 - (number min)) (-1 * (number min).

    (assert (0 - (number infinite)) ((number infinite) * -1).
    (assert (0 - (number infinite)) (-1 * (number infinite).

    (assert (0 - (number -infinite)) ((number -infinite) * -1).
    (assert (0 - (number -infinite)) (-1 * (number -infinite).
  ).
  (should "(num * x) returns the value of num times x." (= ()
    (assert 1 (-1 * -1).

    (assert -1.5 (1.5 * -1).
    (assert -1.5 (-1 * 1.5).

    (assert 1.5 (-1.5 * -1).
    (assert 1.5 (-1 * -1.5).

    (assert 2.25 (1.5 * 1.5).
    (assert -2.25 (1.5 * -1.5).
    (assert -2.25 (-1.5 * 1.5).
    (assert 2.25 (-1.5 * -1.5).
  ).
  (should "(num * x y) returns the value of num times x times y." (= ()
    (assert 4.5 (1.5 * 1.5 2).
    (assert -4.5 (1.5 * 1.5 -2).

    (assert -4.5 (1.5 * -1.5 2).
    (assert 4.5 (1.5 * -1.5 -2).

    (assert -4.5 (-1.5 * 1.5 2).
    (assert 4.5 (-1.5 * 1.5 -2).

    (assert 4.5 (-1.5 * -1.5 2).
    (assert -4.5 (-1.5 * -1.5 -2).
  ).
  (should "(num * ...) accepts 3 or more arguments." (= ()
    (assert -2 (1 * 1 1 -2).
    (assert -2 (1 * 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -2 (1 * 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
  ).
  (should "((number max) * x) produces (number infinite) if x > 1." (= ()
    (assert (number infinite) ((number max) * 1.000000000000001).
    (assert (number infinite) (1.000000000000001 * (number max).

    (assert (number infinite) ((number max) * 1.5).
    (assert (number infinite) (1.5 * (number max).

    (assert (number infinite) ((number max) * 2).
    (assert (number infinite) (2 * (number max).
  ).
  (should "((number min) * x) produces (number -infinite) if x > 1." (= ()
    (assert (number -infinite) ((number min) * 1.000000000000001).
    (assert (number -infinite) (1.000000000000001 * (number min).

    (assert (number -infinite) ((number min) * 1.5).
    (assert (number -infinite) (1.5 * (number min).

    (assert (number -infinite) ((number min) * 2).
    (assert (number -infinite) (2 * (number min).
  ).
  (should "((number infinite) * -1) produces (number -infinite)." (= ()
    (assert (number -infinite) ((number infinite) * -1).
    (assert (number -infinite) (-1 * (number infinite).
  ).
  (should "((number -infinite) * -1) produces (number infinite)." (= ()
    (assert (number infinite) ((number -infinite) * -1).
    (assert (number infinite) (-1 * (number -infinite).
  ).
  (should "((number infinite) * x) produces (number infinite) if x is a valid positive value." (= ()
    (assert (number infinite) ((number infinite) * 1.5).
    (assert (number infinite) (1.5 + (number infinite).

    (assert (number infinite) ((number infinite) * (number smallest)).
    (assert (number infinite) ((number smallest) * (number infinite).

    (assert (number infinite) ((number infinite) * (number max).
    (assert (number infinite) ((number max) * (number infinite).

    (assert (number infinite) ((number infinite) * (number infinite).
  ).
  (should "((number -infinite) * x) produces (number -infinite) if x is a valid positive value." (= ()
    (assert (number -infinite) ((number -infinite) * 1.5).
    (assert (number -infinite) (1.5 + (number -infinite).

    (assert (number -infinite) ((number -infinite) * (number smallest)).
    (assert (number -infinite) ((number smallest) * (number -infinite).

    (assert (number -infinite) ((number -infinite) * (number max).
    (assert (number -infinite) ((number max) + (number -infinite).

    (assert (number -infinite) ((number -infinite) * (number infinite).
    (assert (number -infinite) ((number infinite) * (number -infinite).
  ).
  (should "((number -infinite) * (number -infinite)) produces (number infinite)." (= ()
    (assert (number infinite) ((number -infinite) * (number -infinite)).
  ).
  (should "((number invalid) * any-number) still produces (number invalid)." (= ()
    (assert (number invalid) ((number invalid) * 0).
    (assert (number invalid) (0 * (number invalid).

    (assert (number invalid) ((number invalid) * -0).
    (assert (number invalid) (-0 * (number invalid).

    (assert (number invalid) ((number invalid) * 1).
    (assert (number invalid) (1 * (number invalid).

    (assert (number invalid) ((number invalid) * -1).
    (assert (number invalid) (-1 * (number invalid).

    (assert (number invalid) ((number invalid) * 1.5).
    (assert (number invalid) (1.5 * (number invalid).

    (assert (number invalid) ((number invalid) * -1.5).
    (assert (number invalid) (-1.5 * (number invalid).

    (assert (number invalid) ((number invalid) * (number min).
    (assert (number invalid) ((number min) * (number invalid).

    (assert (number invalid) ((number invalid) * (number max).
    (assert (number invalid) ((number max) * (number invalid).

    (assert (number invalid) ((number invalid) * (number infinite).
    (assert (number invalid) ((number infinite) * (number invalid).

    (assert (number invalid) ((number invalid) * (number -infinite).
    (assert (number invalid) ((number -infinite) * (number invalid).

    (assert (number invalid) ((number invalid) * (number invalid).
  ).
).

(define "(a-number times ...)" (= ()
  (should "(num \"times\") is the same of (number \"*\")." (= ()
    (assert ($(0 "times") is (0 "*").
    (assert ($(-0 "times") is (-0 "*").

    (assert ($(1 "times") is (1 "*").
    (assert ($(-1 "times") is (-1 "*").

    (assert ($(1.5 "times") is (1.5 "*").
    (assert ($(-1.5 "times") is (-1.5 "*").

    (assert ($((number max) "times") is ((number max) "*").
    (assert ($((number min) "times") is ((number min) "*").

    (assert ($((number infinite) "times") is ((number infinite) "*").
    (assert ($((number -infinite) "times") is ((number -infinite) "*").

    (assert ($((number invalid) "times") is ((number invalid) "*").
  ).
).

(define "(a-number / ...)" (= ()
  (should "(num /) returns num." (= ()
    (assert 0 (0 /).
    (assert ((-0 /) is -0).

    (assert 1 (1 /).
    (assert -1 (-1 /).

    (assert 1.5 (1.5 /).
    (assert -1.5 (-1.5 /).

    (assert (number max) ((number max) /).
    (assert (number min) ((number min) /).

    (assert (number smallest) ((number smallest) /).

    (assert (number max-int) ((number max-int) /).
    (assert (number min-int) ((number min-int) /).

    (assert (number max-bits) ((number max-bits) /).
    (assert (number min-bits) ((number min-bits) /).

    (assert (number invalid) ((number invalid) /).

    (assert (number infinite) ((number infinite) /).
    (assert (number -infinite) ((number -infinite) /).
  ).
  (should "(0 / 0) returns (number invalid)." (= ()
    (assert (number invalid) (0 / 0).
    (assert (number invalid) (0 / -0).
    (assert (number invalid) (-0 / 0).
    (assert (number invalid) (-0 / -0).
  ).
  (should "(0 / num) returns 0 or -0 if num is valid and non-zero." (= ()
    (assert ((0 / (number smallest)) is 0).

    (assert ((0 / 1) is 0).
    (assert ((0 / -1) is -0).

    (assert ((0 / 1.5) is 0).
    (assert ((0 / -1.5) is -0).

    (assert ((0 / (number max)) is 0).
    (assert ((0 / (number min)) is -0).

    (assert ((0 / (number infinite)) is 0).
    (assert ((0 / (number -infinite)) is -0).
  ).
  (should "(-0 / num) returns -0 or 0 if num is valid and non-zero." (= ()
    (assert ((-0 / (number smallest)) is -0).

    (assert ((-0 / 1) is -0).
    (assert ((-0 / -1) is 0).

    (assert ((-0 / 1.5) is -0).
    (assert ((-0 / -1.5) is 0).

    (assert ((-0 / (number max)) is -0).
    (assert ((-0 / (number min)) is 0).

    (assert ((-0 / (number infinite)) is -0).
    (assert ((-0 / (number -infinite)) is 0).
  ).
  (should "(num / 0) returns (number infinite) or (number -infinite) if num is valid and non-zero." (= ()
    (assert (number infinite) ((number smallest) / 0).

    (assert (number infinite) (1 / 0).
    (assert (number -infinite) (-1 / 0).

    (assert (number infinite) (1.5 / 0).
    (assert (number -infinite) (-1.5 / 0).

    (assert (number infinite) ((number max) / 0).
    (assert (number -infinite) ((number min) / 0).

    (assert (number infinite) ((number infinite) / 0).
    (assert (number -infinite) ((number -infinite) / 0).
  ).
  (should "(num / -0) returns (number -infinite) or (number infinite) if num is valid and non-zero." (= ()
    (assert (number -infinite) ((number smallest) / -0).

    (assert (number -infinite) (1 / -0).
    (assert (number infinite) (-1 / -0).

    (assert (number -infinite) (1.5 / -0).
    (assert (number infinite) (-1.5 / -0).

    (assert (number -infinite) ((number max) / -0).
    (assert (number infinite) ((number min) / -0).

    (assert (number -infinite) ((number infinite) / -0).
    (assert (number infinite) ((number -infinite) / -0).
  ).
  (should "(num / 1) returns num." (= ()
    (assert 1 (1 / 1).
    (assert -1 (-1 / 1).

    (assert 1.5 (1.5 / 1).
    (assert -1.5 (-1.5 / 1).

    (assert (number max) ((number max) / 1).
    (assert (number min) ((number min) / 1).

    (assert (number infinite) ((number infinite) / 1).
    (assert (number -infinite) ((number -infinite) / 1).
  ).
  (should "(num / -1) returns -num." (= ()
    (assert -1 (1 / -1).
    (assert 1 (-1 / -1).

    (assert -1.5 (1.5 / -1).
    (assert 1.5 (-1.5 / -1).

    (assert (0 - (number max)) ((number max) / -1).
    (assert (0 - (number min)) ((number min) / -1).

    (assert (0 - (number infinite)) ((number infinite) / -1).
    (assert (0 - (number -infinite)) ((number -infinite) / -1).
  ).
  (should "(num / x) returns the value of num divided by x." (= ()
    (assert 2 (4 / 2).
    (assert -2 (-4 / 2).
    (assert -2 (4 / -2).
    (assert 2 (-4 / -2).

    (assert 0.5 (1 / 2).
    (assert -0.5 (-1 / 2).
    (assert -0.5 (1 / -2).
    (assert 0.5 (-1 / -2).

    (assert 2.5 (1.5 / 0.6).
    (assert -2.5 (-1.5 / 0.6).
    (assert -2.5 (1.5 / -0.6).
    (assert 2.5 (-1.5 / -0.6).
  ).
  (should "(num / x y) returns the value of num divided by x, then divided by y." (= ()
    (assert 1.25 (1.5 / 0.6 2).
    (assert -1.25 (-1.5 / 0.6 2).
    (assert -1.25 (1.5 / -0.6 2).
    (assert 1.25 (-1.5 / -0.6 2).

    (assert -1.25 (1.5 / 0.6 -2).
    (assert 1.25 (-1.5 / 0.6 -2).
    (assert 1.25 (1.5 / -0.6 -2).
    (assert -1.25 (-1.5 / -0.6 -2).
  ).
  (should "(num / ...) accepts 3 or more arguments." (= ()
    (assert -0.5 (1 / 1 1 -2).
    (assert -0.5 (1 / 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
    (assert -0.5 (1 / 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 -2).
  ).
  (should "((number max) / x) produces (number infinite) if x > 0 and x < 1." (= ()
    (assert (number infinite) ((number max) / 0.9999999999999999).
    (assert (number infinite) ((number max) / 0.5).
    (assert (number infinite) ((number max) / (number smallest).
  ).
  (should "((number min) / x) produces (number -infinite) if x > 0 and x < 1." (= ()
    (assert (number -infinite) ((number min) / 0.9999999999999999).
    (assert (number -infinite) ((number min) / 0.5).
    (assert (number -infinite) ((number min) / (number smallest).
  ).
  (should "((number infinite) / -1) produces (number -infinite)." (= ()
    (assert (number -infinite) ((number infinite) / -1).
  ).
  (should "((number -infinite) / -1) produces (number infinite)." (= ()
    (assert (number infinite) ((number -infinite) / -1).
  ).
  (should "(num / (number infinite)) produces 0 if num > 0." (= ()
    (assert (((number smallest) / (number infinite)) is 0).
    (assert ((1 / (number infinite)) is 0).
    (assert (((number max) / (number infinite)) is 0).
  ).
  (should "(num / (number -infinite)) produces -0 if num > 0." (= ()
    (assert (((number smallest) / (number -infinite)) is -0).
    (assert ((1 / (number -infinite)) is -0).
    (assert (((number max) / (number -infinite)) is -0).
  ).
  (should "((number infinite) / (number infinite)) produces (number invalid)." (= ()
    (assert (number invalid) ((number infinite) / (number infinite)).
    (assert (number invalid) ((number -infinite) / (number infinite)).
    (assert (number invalid) ((number infinite) / (number -infinite)).
    (assert (number invalid) ((number -infinite) / (number -infinite)).
  ).
  (should "((number invalid) / any-number) and (any-number / (number invalid)) still produce (number invalid)." (= ()
    (assert (number invalid) ((number invalid) / 0).
    (assert (number invalid) (0 / (number invalid).

    (assert (number invalid) ((number invalid) / -0).
    (assert (number invalid) (-0 / (number invalid).

    (assert (number invalid) ((number invalid) / 1).
    (assert (number invalid) (1 / (number invalid).

    (assert (number invalid) ((number invalid) / -1).
    (assert (number invalid) (-1 / (number invalid).

    (assert (number invalid) ((number invalid) / 1.5).
    (assert (number invalid) (1.5 / (number invalid).

    (assert (number invalid) ((number invalid) / -1.5).
    (assert (number invalid) (-1.5 / (number invalid).

    (assert (number invalid) ((number invalid) / (number min).
    (assert (number invalid) ((number min) / (number invalid).

    (assert (number invalid) ((number invalid) / (number max).
    (assert (number invalid) ((number max) / (number invalid).

    (assert (number invalid) ((number invalid) / (number infinite).
    (assert (number invalid) ((number infinite) / (number invalid).

    (assert (number invalid) ((number invalid) / (number -infinite).
    (assert (number invalid) ((number -infinite) / (number invalid).

    (assert (number invalid) ((number invalid) / (number invalid).
  ).
).

(define "(a-number divided-by ...)" (= ()
  (should "(num \"divided-by\") is the same of (number \"/\")." (= ()
    (assert ($(0 "divided-by") is (0 "/").
    (assert ($(-0 "divided-by") is (-0 "/").

    (assert ($(1 "divided-by") is (1 "/").
    (assert ($(-1 "divided-by") is (-1 "/").

    (assert ($(1.5 "divided-by") is (1.5 "/").
    (assert ($(-1.5 "divided-by") is (-1.5 "/").

    (assert ($((number max) "divided-by") is ((number max) "/").
    (assert ($((number min) "divided-by") is ((number min) "/").

    (assert ($((number infinite) "divided-by") is ((number infinite) "/").
    (assert ($((number -infinite) "divided-by") is ((number -infinite) "/").

    (assert ($((number invalid) "divided-by") is ((number invalid) "/").
  ).
).

(define "Remainder/Modulus: (a-number % base)" (= ()
  (should "(num %) return num." (= ()
    (assert ((0 %) is 0).
    (assert ((-0 %) is -0).

    (assert ((1 %) is 1).
    (assert ((-1 %) is -1).

    (assert ((1.5 %) is 1.5).
    (assert ((-1.5 %) is -1.5).

    (assert (((number max) %) is (number max).
    (assert (((number min) %) is (number min).

    (assert (((number infinite) %) is (number infinite).
    (assert (((number -infinite) %) is (number -infinite).

    (assert (((number invalid) %) is (number invalid).
  ).
  (should "(num % (number infinite)) return num." (= ()
    (assert ((0 % (number infinite)) is 0).
    (assert ((-0 % (number infinite)) is -0).

    (assert ((1 % (number infinite)) is 1).
    (assert ((-1 % (number infinite)) is -1).

    (assert ((1.5 % (number infinite)) is 1.5).
    (assert ((-1.5 % (number infinite)) is -1.5).

    (assert (((number max) % (number infinite)) is (number max).
    (assert (((number min) % (number infinite)) is (number min).

    (assert (((number infinite) % (number infinite)) is (number infinite).
    (assert (((number -infinite) % (number infinite)) is (number -infinite).

    (assert (((number invalid) % (number infinite)) is (number invalid).
  ).
  (should "(num % (number -infinite)) return num." (= ()
    (assert ((0 % (number -infinite)) is 0).
    (assert ((-0 % (number -infinite)) is -0).

    (assert ((1 % (number -infinite)) is 1).
    (assert ((-1 % (number -infinite)) is -1).

    (assert ((1.5 % (number -infinite)) is 1.5).
    (assert ((-1.5 % (number -infinite)) is -1.5).

    (assert (((number max) % (number -infinite)) is (number max).
    (assert (((number min) % (number -infinite)) is (number min).

    (assert (((number infinite) % (number -infinite)) is (number infinite).
    (assert (((number -infinite) % (number -infinite)) is (number -infinite).

    (assert (((number invalid) % (number -infinite)) is (number invalid).
  ).
  (should "(num % base) returns the remainder of num over base." (= ()
    (assert 0 (0 % 1).
    (assert 0 (0 % -1).

    (assert 0 (1 % 1).
    (assert 0 (1 % -1).

    (assert 0 (-1 % 1).
    (assert 0 (-1 % -1).

    (assert 0 (2 % 1).
    (assert 0 (2 % -1).

    (assert 0 (-2 % 1).
    (assert 0 (-2 % -1).

    (assert 1 (3 % 2).
    (assert 1 (3 % -2).

    (assert -1 (-3 % 2).
    (assert -1 (-3 % -2).

    (assert (1.1 - 1) (1.1 % 1).
    (assert (1.1 - 1) (1.1 % -1).

    (assert (-1.1 + 1) (-1.1 % 1).
    (assert (-1.1 + 1) (-1.1 % -1).
  ).
  (should "(num % 0) returns (number invalid)." (= ()
    (assert (number invalid) (0 % 0).
    (assert (number invalid) (1 % 0).
    (assert (number invalid) (-1 % 0).

    (assert (number invalid) ((number infinite) % 0).
    (assert (number invalid) ((number -infinite) % 0).
    (assert (number invalid) ((number invalid) % 0).
  ).
  (should "(num % (number invalid)) returns (number invalid)." (= ()
    (assert (number invalid) (0 % (number invalid).
    (assert (number invalid) (1 % (number invalid).
    (assert (number invalid) (-1 % (number invalid).

    (assert (number invalid) ((number infinite) % (number invalid).
    (assert (number invalid) ((number -infinite) % (number invalid).
    (assert (number invalid) ((number invalid) % (number invalid).
  ).
).

(define "Bitwise NOT: (~ a-number)" (= ()
  (should "(~ a-bits-value) keeps and reverses each bit of low 4 bytes." (= ()
    (assert (0xFFFFFFFF as-bits) (~ 0).
    (assert ((~ 0xFFFFFFFF) is 0).

    (assert (0xFFFFFFFE as-bits) (~ 1).
    (assert 1 (~ 0xFFFFFFFE).

    (assert (0xFFFFFFF8 as-bits) (~ 7).
    (assert 7 (~ 0xFFFFFFF8).
  ).
  (should "(~ an-out-of-range-value) return (~ (an-out-of-range-value as-bits))" (= ()
    (assert (~ (-0 as-bits)) (~ -0).
    (assert (~ (0.1 as-bits)) (~ 0.1).
    (assert (~ (-0.1 as-bits)) (~ -0.1).

    (assert (~ ((number max) as-bits)) (~ (number max)).
    (assert (~ ((number min) as-bits)) (~ (number min)).

    (assert (~ ((number max-int) as-bits)) (~ (number max-int)).
    (assert (~ ((number min-int) as-bits)) (~ (number min-int)).

    (assert (~ ((number infinite) as-bits)) (~ (number infinite)).
    (assert (~ ((number -infinite) as-bits)) (~ (number -infinite)).
  ).
  (should "(~ (number invalid)) return (~ 0)" (= ()
    (assert (~ 0) (~ (number invalid).
  ).
).

(define "Bitwise AND: (a-number & a-number)" (= ()
  (should "(0 & num) and (num & 0) return 0." (= ()
    (assert ((0 & 0) is 0).
    (assert ((0 & -0) is 0).
    (assert ((-0 & 0) is 0).
    (assert ((-0 & -0) is 0).

    (assert ((0 & 1) is 0).
    (assert ((1 & 0) is 0).

    (assert ((0 & -1) is 0).
    (assert ((-1 & 0) is 0).

    (assert ((0 & 1.5) is 0).
    (assert ((1.5 & 0) is 0).

    (assert ((0 & -1.5) is 0).
    (assert ((-1.5 & 0) is 0).

    (assert ((0 & (number max)) is 0).
    (assert (((number max) & 0) is 0).

    (assert ((0 & (number min)) is 0).
    (assert (((number min) & 0) is 0).

    (assert ((0 & (number infinite)) is 0).
    (assert (((number infinite) & 0) is 0).

    (assert ((0 & (number -infinite)) is 0).
    (assert (((number -infinite) & 0) is 0).

    (assert ((0 & (number invalid)) is 0).
    (assert (((number invalid) & 0) is 0).
  ).
  (should "(a & b) returns a value by applying bitwise AND." (= ()
    (assert ((0x01 & 0x10) is 0).
    (assert ((0x10 & 0x01) is 0).

    (assert 0x11 (0x011 & 0x111).
    (assert 0x11 (0x111 & 0x011).
  ).
  (should "(a & an-out-of-range-value) returns (a & (an-out-of-range-value as-bits))." (= ()
    (assert (0x100000000 as-bits) (0xFFFFFFFF & 0x100000000).
    (assert (0x100000001 as-bits) (0xFFFFFFFF & 0x100000001).
    (assert (0x1FFFFFFFF as-bits) (0xFFFFFFFF & 0x1FFFFFFFF).

    (assert ((number max) as-bits) (0xFFFFFFFF & (number max)).
    (assert ((number min) as-bits) (0xFFFFFFFF & (number min)).

    (assert ((number infinite) as-bits) (0xFFFFFFFF & (number infinite)).
    (assert ((number -infinite) as-bits) (0xFFFFFFFF & (number -infinite)).

    (assert ((number invalid) as-bits) (0xFFFFFFFF & (number invalid)).
  ).
).

(define "Bitwise OR: (a-number | a-number)" (= ()
  (should "(0 | num) and (num | 0) return (num as-bits)." (= ()
    (assert ((0 | 0) is 0).
    (assert ((0 | -0) is 0).
    (assert ((-0 | 0) is 0).
    (assert ((-0 | -0) is 0).

    (assert 1 (0 | 1).
    (assert 1 (1 | 0).

    (assert -1 (0 | -1).
    (assert -1 (-1 | 0).

    (assert 1 (0 | 1.5).
    (assert 1 (1.5 | 0).

    (assert -1 (0 | -1.5).
    (assert -1 (-1.5 | 0).

    (assert ((number max) as-bits) (0 | (number max).
    (assert ((number max) as-bits) ((number max) | 0).

    (assert ((number min) as-bits) (0 | (number min).
    (assert ((number min) as-bits) ((number min) | 0).

    (assert ((number infinite) as-bits) (0 | (number infinite).
    (assert ((number infinite) as-bits) ((number infinite) | 0).

    (assert ((number -infinite) as-bits) (0 | (number -infinite).
    (assert ((number -infinite) as-bits) ((number -infinite) | 0).

    (assert ((number invalid) as-bits) (0 | (number invalid).
    (assert ((number invalid) as-bits) ((number invalid) | 0).
  ).
  (should "(a | b) returns a value by applying bitwise OR." (= ()
    (assert 0x11 (0x01 | 0x10).
    (assert 0x11 (0x10 | 0x01).

    (assert 0x101 (0x001 | 0x100).
    (assert 0x101 (0x100 | 0x001).
  ).
  (should "(a | an-out-of-range-value) returns (a | (an-out-of-range-value as-bits))." (= ()
    (assert (0xAAAAAAAA | (0x100000000 as-bits)) (0xAAAAAAAA | 0x100000000).
    (assert (0xAAAAAAAA | (0x100000001 as-bits)) (0xAAAAAAAA | 0x100000001).
    (assert (0xAAAAAAAA | (0x1FFFFFFFF as-bits)) (0xAAAAAAAA | 0x1FFFFFFFF).

    (assert (0xAAAAAAAA | ((number max) as-bits)) (0xAAAAAAAA | (number max)).
    (assert (0xAAAAAAAA | ((number min) as-bits)) (0xAAAAAAAA | (number min)).

    (assert (0xAAAAAAAA | ((number infinite) as-bits)) (0xAAAAAAAA | (number infinite)).
    (assert (0xAAAAAAAA | ((number -infinite) as-bits)) (0xAAAAAAAA | (number -infinite)).

    (assert (0xAAAAAAAA | ((number invalid) as-bits)) (0xAAAAAAAA | (number invalid)).
  ).
).

(define "Bitwise XOR: (a-number ^ a-number)" (= ()
  (should "(0 ^ num) and (num ^ 0) return (num as-bits)." (= ()
    (assert ((0 ^ 0) is 0).
    (assert ((0 ^ -0) is 0).
    (assert ((-0 ^ 0) is 0).
    (assert ((-0 ^ -0) is 0).

    (assert 1 (0 ^ 1).
    (assert 1 (1 ^ 0).

    (assert -1 (0 ^ -1).
    (assert -1 (-1 ^ 0).

    (assert 1 (0 ^ 1.5).
    (assert 1 (1.5 ^ 0).

    (assert -1 (0 ^ -1.5).
    (assert -1 (-1.5 ^ 0).

    (assert ((number max) as-bits) (0 ^ (number max).
    (assert ((number max) as-bits) ((number max) ^ 0).

    (assert ((number min) as-bits) (0 ^ (number min).
    (assert ((number min) as-bits) ((number min) ^ 0).

    (assert ((number infinite) as-bits) (0 ^ (number infinite).
    (assert ((number infinite) as-bits) ((number infinite) ^ 0).

    (assert ((number -infinite) as-bits) (0 ^ (number -infinite).
    (assert ((number -infinite) as-bits) ((number -infinite) ^ 0).

    (assert ((number invalid) as-bits) (0 ^ (number invalid).
    (assert ((number invalid) as-bits) ((number invalid) ^ 0).
  ).
  (should "(0xFFFFFFFF ^ num) and (num ^ 0xFFFFFFFF) return (~ num)." (= ()
    (assert (~ 0) (0xFFFFFFFF ^ 0).
    (assert (~ 0) (0 ^ 0xFFFFFFFF).

    (assert (~ -0) (0xFFFFFFFF ^ -0).
    (assert (~ -0) (-0 ^ 0xFFFFFFFF).

    (assert (~ 1) (0xFFFFFFFF ^ 1).
    (assert (~ 1) (1 ^ 0xFFFFFFFF).

    (assert (~ -1) (0xFFFFFFFF ^ -1).
    (assert (~ -1) (-1 ^ 0xFFFFFFFF).

    (assert (~ 1.5) (0xFFFFFFFF ^ 1.5).
    (assert (~ 1.5) (1.5 ^ 0xFFFFFFFF).

    (assert (~ -1.5) (0xFFFFFFFF ^ -1.5).
    (assert (~ -1.5) (-1.5 ^ 0xFFFFFFFF).

    (assert (~ (number max)) (0xFFFFFFFF ^ (number max).
    (assert (~ (number max)) ((number max) ^ 0xFFFFFFFF).

    (assert (~ (number min)) (0xFFFFFFFF ^ (number min).
    (assert (~ (number min)) ((number min) ^ 0xFFFFFFFF).

    (assert (~ (number infinite)) (0xFFFFFFFF ^ (number infinite).
    (assert (~ (number infinite)) ((number infinite) ^ 0xFFFFFFFF).

    (assert (~ (number -infinite)) (0xFFFFFFFF ^ (number -infinite).
    (assert (~ (number -infinite)) ((number -infinite) ^ 0xFFFFFFFF).

    (assert (~ (number invalid)) (0xFFFFFFFF ^ (number invalid).
    (assert (~ (number invalid)) ((number invalid) ^ 0xFFFFFFFF).
  ).
  (should "(a ^ b) returns a value by applying bitwise XOR." (= ()
    (assert 0x11 (0x01 ^ 0x10).
    (assert 0x11 (0x10 ^ 0x01).

    (assert 0x101 (0x001 ^ 0x100).
    (assert 0x101 (0x100 ^ 0x001).

    (assert 0x101 (0x011 ^ 0x110).
    (assert 0x101 (0x110 ^ 0x011).
  ).
  (should "(a ^ an-out-of-range-value) returns (a ^ (an-out-of-range-value as-bits))." (= ()
    (assert (0xAAAAAAAA ^ (0x100000000 as-bits)) (0xAAAAAAAA ^ 0x100000000).
    (assert (0xAAAAAAAA ^ (0x100000001 as-bits)) (0xAAAAAAAA ^ 0x100000001).
    (assert (0xAAAAAAAA ^ (0x1FFFFFFFF as-bits)) (0xAAAAAAAA ^ 0x1FFFFFFFF).

    (assert (0xAAAAAAAA ^ ((number max) as-bits)) (0xAAAAAAAA ^ (number max)).
    (assert (0xAAAAAAAA ^ ((number min) as-bits)) (0xAAAAAAAA ^ (number min)).

    (assert (0xAAAAAAAA ^ ((number infinite) as-bits)) (0xAAAAAAAA ^ (number infinite)).
    (assert (0xAAAAAAAA ^ ((number -infinite) as-bits)) (0xAAAAAAAA ^ (number -infinite)).

    (assert (0xAAAAAAAA ^ ((number invalid) as-bits)) (0xAAAAAAAA ^ (number invalid)).
  ).
).

(define "Bitwise Left-Shift: (a-number << bits)" (= ()
  (should "(num <<) and (num << 0) return (num as-bits)." (= ()
    (assert ((0 <<) is 0).
    (assert ((-0 <<) is 0).

    (assert ((0 << 0) is 0).
    (assert ((0 << -0) is 0).
    (assert ((-0 << 0) is 0).
    (assert ((-0 << -0) is 0).

    (assert 1 (1 <<).
    (assert 1 (1 << 0).

    (assert -1 (-1 <<).
    (assert -1 (-1 << 0).

    (assert 1 (1.5 <<).
    (assert 1 (1.5 << 0).

    (assert -1 (-1.5 <<).
    (assert -1 (-1.5 << 0).

    (assert ((number max) as-bits) ((number max) <<).
    (assert ((number max) as-bits) ((number max) << 0).

    (assert ((number min) as-bits) ((number min) <<).
    (assert ((number min) as-bits) ((number min) << 0).

    (assert ((number infinite) as-bits) ((number infinite) <<).
    (assert ((number infinite) as-bits) ((number infinite) << 0).

    (assert ((number -infinite) as-bits) ((number -infinite) <<).
    (assert ((number -infinite) as-bits) ((number -infinite) << 0).

    (assert ((number invalid) as-bits) ((number invalid) <<).
    (assert ((number invalid) as-bits) ((number invalid) << 0).
  ).
  (should "(num << n) returns a value by shifting all bits by n." (= ()
    (assert (1 << 30) (1 << -2).
    (assert (1 << 31) (1 << -1).
    (assert 2 (1 << 1).
    (assert 0x10 (1 << 4).
    (assert 0x100 (1 << 8).
    (assert 0x1000 (1 << 12).
    (assert 0x10000 (1 << 16).
    (assert 0x100000 (1 << 20).
    (assert 0x1000000 (1 << 24).
    (assert 0x10000000 (1 << 28).
    (assert (1 << 0) (1 << 32).
    (assert (1 << 4) (1 << 36).
  ).
).

(define "Bitwise Signed Right-Shift: (a-number >> bits)" (= ()
  (should "(num >>) and (num >> 0) return (num as-bits)." (= ()
    (assert ((0 >>) is 0).
    (assert ((-0 >>) is 0).

    (assert ((0 >> 0) is 0).
    (assert ((0 >> -0) is 0).
    (assert ((-0 >> 0) is 0).
    (assert ((-0 >> -0) is 0).

    (assert 1 (1 >>).
    (assert 1 (1 >> 0).

    (assert -1 (-1 >>).
    (assert -1 (-1 >> 0).

    (assert 1 (1.5 >>).
    (assert 1 (1.5 >> 0).

    (assert -1 (-1.5 >>).
    (assert -1 (-1.5 >> 0).

    (assert ((number max) as-bits) ((number max) >>).
    (assert ((number max) as-bits) ((number max) >> 0).

    (assert ((number min) as-bits) ((number min) >>).
    (assert ((number min) as-bits) ((number min) >> 0).

    (assert ((number infinite) as-bits) ((number infinite) >>).
    (assert ((number infinite) as-bits) ((number infinite) >> 0).

    (assert ((number -infinite) as-bits) ((number -infinite) >>).
    (assert ((number -infinite) as-bits) ((number -infinite) >> 0).

    (assert ((number invalid) as-bits) ((number invalid) >>).
    (assert ((number invalid) as-bits) ((number invalid) >> 0).
  ).
  (should "(num >> n) returns a value by shifting all bits by n, padding with highest bit." (= ()
    (assert (0x40000000 >> 30) (0x40000000 >> -2).
    (assert (0x40000000 >> 31) (0x40000000 >> -1).
    (assert 0x20000000 (0x40000000 >> 1).
    (assert 0x4000000 (0x40000000 >> 4).
    (assert 0x400000 (0x40000000 >> 8).
    (assert 0x40000 (0x40000000 >> 12).
    (assert 0x4000 (0x40000000 >> 16).
    (assert 0x400 (0x40000000 >> 20).
    (assert 0x40 (0x40000000 >> 24).
    (assert 0x4 (0x40000000 >> 28).
    (assert 1 (0x40000000 >> 30).
    (assert 0 (0x40000000 >> 31).
    (assert 0x40000000 (0x40000000 >> 32).
    (assert (0x40000000 >> 4) (0x40000000 >> 36).

    (assert -1 (-2 >> 1)
    (assert -1 (-4 >> 2)
    (assert -1 (-8 >> 4)
    (assert -1 ((number min-bits) >> 31)
    (assert -1 ((number min-bits) >> 32)
    (assert -1 ((number min-bits) >> 36)
  ).
  (should "(-1 >> n) always returns -1." (= ()
    (assert (-1 >> 30) (-1 >> -2).
    (assert (-1 >> 31) (-1 >> -1).
    (assert -1 (-1 >> 1).
    (assert -1 (-1 >> 4).
    (assert -1 (-1 >> 8).
    (assert -1 (-1 >> 12).
    (assert -1 (-1 >> 16).
    (assert -1 (-1 >> 20).
    (assert -1 (-1 >> 24).
    (assert -1 (-1 >> 28).
    (assert -1 (-1 >> 32).
    (assert -1 (-1 >> 36).
  ).
).

(define "Bitwise Zero-Based Right-Shift: (a-number >>> bits)" (= ()
  (should "(num >>>) and (num >>> 0) return (num as-bits)." (= ()
    (assert ((0 >>>) is 0).
    (assert ((-0 >>>) is 0).

    (assert ((0 >>> 0) is 0).
    (assert ((0 >>> -0) is 0).
    (assert ((-0 >>> 0) is 0).
    (assert ((-0 >>> -0) is 0).

    (assert 1 (1 >>>).
    (assert 1 (1 >>> 0).

    (assert (-1 >>> 0) (-1 >>>).
    (assert 0xFFFFFFFF (-1 >>> 0).

    (assert 1 (1.5 >>>).
    (assert 1 (1.5 >>> 0).

    (assert (-1 >>> 0) (-1.5 >>>).
    (assert (-1 >>> 0) (-1.5 >>> 0).

    (assert ((number max) as-bits) ((number max) >>>).
    (assert ((number max) as-bits) ((number max) >>> 0).

    (assert ((number min) as-bits) ((number min) >>>).
    (assert ((number min) as-bits) ((number min) >>> 0).

    (assert ((number infinite) as-bits) ((number infinite) >>>).
    (assert ((number infinite) as-bits) ((number infinite) >>> 0).

    (assert ((number -infinite) as-bits) ((number -infinite) >>>).
    (assert ((number -infinite) as-bits) ((number -infinite) >>> 0).

    (assert ((number invalid) as-bits) ((number invalid) >>>).
    (assert ((number invalid) as-bits) ((number invalid) >>> 0).
  ).
  (should "(num >>> n) returns a value by shifting all bits by n, padding with 0." (= ()
    (assert (0x40000000 >>> 30) (0x40000000 >>> -2).
    (assert (0x40000000 >>> 31) (0x40000000 >>> -1).
    (assert 0x20000000 (0x40000000 >>> 1).
    (assert 0x4000000 (0x40000000 >>> 4).
    (assert 0x400000 (0x40000000 >>> 8).
    (assert 0x40000 (0x40000000 >>> 12).
    (assert 0x4000 (0x40000000 >>> 16).
    (assert 0x400 (0x40000000 >>> 20).
    (assert 0x40 (0x40000000 >>> 24).
    (assert 0x4 (0x40000000 >>> 28).
    (assert 1 (0x40000000 >>> 30).
    (assert 0 (0x40000000 >>> 31).
    (assert 0x40000000 (0x40000000 >>> 32).
    (assert (0x40000000 >>> 4) (0x40000000 >>> 36).

    (assert 0x7FFFFFFF (-1 >>> 1)
    (assert 0xFFFFFFF (-1 >>> 4)
    (assert 0xFFFFFF (-1 >>> 8)
    (assert 0xFFFFF (-1 >>> 12)
    (assert 0xFFFF (-1 >>> 16)
    (assert 0xFFF (-1 >>> 20)
    (assert 0xFF (-1 >>> 24)
    (assert 0xF (-1 >>> 28)
    (assert 1 (-1 >>> 31)
    (assert 0 ((number min-bits) >>> 32)
    (assert 0 ((number min-bits) >>> 36)
  ).
).

(define "(a-number compares-to ...)" (= ()
  (should "(num compares-to) returns null." (= ()
    (assert null (0 compares-to).
    (assert null (-0 compares-to).

    (assert null (1 compares-to).
    (assert null (-1 compares-to).

    (assert null (1.5 compares-to).
    (assert null (-1.5 compares-to).

    (assert null ((number max) compares-to).
    (assert null ((number min) compares-to).

    (assert null ((number infinite) compares-to).
    (assert null ((number -infinite) compares-to).

    (assert null ((number invalid) compares-to).
  ).
  (should "((number invalid) compares-to a-valid-num) returns null." (= ()
    (assert null ((number invalid) compares-to 0).
    (assert null (0 compares-to (number invalid).

    (assert null ((number invalid) compares-to 1).
    (assert null (1 compares-to (number invalid).

    (assert null ((number invalid) compares-to -1).
    (assert null (-1 compares-to (number invalid).

    (assert null ((number invalid) compares-to 1.5).
    (assert null (1.5 compares-to (number invalid).

    (assert null ((number invalid) compares-to -1.5).
    (assert null (-1.5 compares-to (number invalid).

    (assert null ((number invalid) compares-to (number max).
    (assert null ((number max) compares-to (number invalid).

    (assert null ((number invalid) compares-to (number min).
    (assert null ((number min) compares-to (number invalid).

    (assert null ((number invalid) compares-to (number infinite).
    (assert null ((number infinite) compares-to (number invalid).

    (assert null ((number invalid) compares-to (number -infinite).
    (assert null ((number -infinite) compares-to (number invalid).
  ).
  (should "(0 compares-to -0) and (-0 compares-to 0) return 0." (= ()
    (assert ((0 compares-to -0) is 0).
    (assert ((-0 compares-to 0) is 0).
  ).
  (should "(num compares-to num) returns 0." (= ()
    (assert ((0 compares-to 0) is 0).
    (assert ((-0 compares-to -0) is 0).

    (assert ((1 compares-to 1) is 0).
    (assert ((-1 compares-to -1) is 0).

    (assert ((1.5 compares-to 1.5) is 0).
    (assert ((-1.5 compares-to -1.5) is 0).

    (assert (((number max) compares-to (number max)) is 0).
    (assert (((number min) compares-to (number min)) is 0).

    (assert (((number infinite) compares-to (number infinite)) is 0).
    (assert (((number -infinite) compares-to (number -infinite)) is 0).

    (assert (((number invalid) compares-to (number invalid)) is 0).
  ).
  (should "(num compares-to a-smaller-num) returns 1." (= ()
    (assert 1 (1 compares-to 0).
    (assert 1 (1 compares-to -0).
    (assert 1 (0 compares-to -1).
    (assert 1 (-0 compares-to -1).
    (assert 1 (1 compares-to -1).

    (assert 1 (1.5 compares-to 0).
    (assert 1 (1.5 compares-to -0).
    (assert 1 (0 compares-to -1.5).
    (assert 1 (-0 compares-to -1.5).
    (assert 1 (1.5 compares-to -1.5).

    (assert 1 ((number max) compares-to 0).
    (assert 1 ((number max) compares-to -0).
    (assert 1 (0 compares-to (number min).
    (assert 1 (-0 compares-to (number min).
    (assert 1 ((number max) compares-to (number min).

    (assert 1 ((number infinite) compares-to (number max).
    (assert 1 ((number min) compares-to (number -infinite).
  ).
  (should "(num compares-to a-great-num) returns -1." (= ()
    (assert -1 (-1 compares-to 0).
    (assert -1 (-1 compares-to -0).
    (assert -1 (0 compares-to 1).
    (assert -1 (-0 compares-to 1).
    (assert -1 (-1 compares-to 1).

    (assert -1 (-1.5 compares-to 0).
    (assert -1 (-1.5 compares-to -0).
    (assert -1 (0 compares-to 1.5).
    (assert -1 (-0 compares-to 1.5).
    (assert -1 (-1.5 compares-to 1.5).

    (assert -1 (0 compares-to (number max).
    (assert -1 (-0 compares-to (number max).
    (assert -1 ((number min) compares-to 0).
    (assert -1 ((number min) compares-to -0).
    (assert -1 ((number min) compares-to (number max).

    (assert -1 ((number -infinite) compares-to (number min).
    (assert -1 ((number max) compares-to (number infinite).
  ).
).

(define "Comparison Operators" (=> ()
  (var equal-pairs (@
    (@ 0 0) (@ 0 -0) (@ -0 0)
    (@ 1 1) (@ -1 -1) (@ 1.5 1.5) (@ -1.5 -1.5)
    (@ (number max) (number max).
    (@ (number min) (number min).
    (@ (number infinite) (number infinite).
    (@ (number -infinite) (number -infinite).
    (@ (number invalid) (number invalid).
  ).
  (var descending-pairs (@
    (@ 1 0) (@ 1 -0) (@ 0 -1) (@ -0 -1) (@ 1 -1)
    (@ 1.5 0) (@ 1.5 -0) (@ 0 -1.5) (@ -0 -1.5) (@ 1.5 -1.5)
    (@ (number max) 0) (@ (number max) -0) (@ 0 (number min)) (@ -0 (number min)) (@ (number max) (number min))
    (@ (number infinite) (number max)) (@ (number min) (number -infinite))
  ).
  (var ascending-pairs (@
    (@ -1 0) (@ -1 -0) (@ 0 1) (@ -0 1) (@ -1 1)
    (@ -1.5 0) (@ -1.5 -0) (@ 0 1.5) (@ -0 1.5) (@ -1.5 1.5)
    (@ (number min) 0) (@ (number min) -0) (@ 0 (number max)) (@ -0 (number max)) (@ (number min) (number max))
    (@ (number -infinite) (number min)) (@ (number max) (number infinite))
  ).
  (define "(a-number > another-number)" (=> ()
    (should "(x >) returns null." (=> ()
      (assert null (the-empty >).
      (for num in the-values
        (assert null (num >).
      ).
    ).
    (should "(x > y) returns true for descending-pairs." (=> ()
      (for p in descending-pairs
        (assert ((p 0) > (p 1).
      ).
    ).
    (should "(x > y) returns false for equal-pairs and ascending-pairs." (=> ()
      (for p in (equal-pairs + ascending-pairs)
        (assert false ((p 0) > (p 1).
      ).
    ).
  ).
  (define "(a-number >= another-number)" (=> ()
    (should "(x >=) returns null." (=> ()
      (assert null (the-empty >=).
      (for num in the-values
        (assert null (num >=).
      ).
    ).
    (should "(x >= y) returns true for equal-pairs and descending-pairs." (=> ()
      (for p in (equal-pairs + descending-pairs)
        (assert ((p 0) >= (p 1).
      ).
    ).
    (should "(x >= y) returns false for ascending-pairs." (=> ()
      (for p in ascending-pairs
        (assert false ((p 0) >= (p 1).
      ).
    ).
  ).
  (define "(a-number < another-number)" (=> ()
    (should "(x <) returns null." (=> ()
      (assert null (the-empty <).
      (for num in the-values
        (assert null (num <).
      ).
    ).
    (should "(x < y) returns true for ascending-pairs." (=> ()
      (for p in ascending-pairs
        (assert ((p 0) < (p 1).
      ).
    ).
    (should "(x < y) returns false for equal-pairs and descending-pairs." (=> ()
      (for p in (equal-pairs + descending-pairs)
        (assert false ((p 0) < (p 1).
      ).
    ).
  ).
  (define "(a-number <= another-number)" (=> ()
    (should "(x <=) returns null." (=> ()
      (assert null (the-empty <=).
      (for num in the-values
        (assert null (num <=).
      ).
    ).
    (should "(x <= y) returns true for equal-pairs and ascending-pairs." (=> ()
      (for p in (equal-pairs + ascending-pairs)
        (assert ((p 0) <= (p 1).
      ).
    ).
    (should "(x <= y) returns false for descending-pairs." (=> ()
      (for p in descending-pairs
        (assert false ((p 0) <= (p 1).
      ).
    ).
  ).
  (define "(a-number == another-number)" (=> ()
    (should "(x ==) returns false." (=> ()
      (assert false (the-empty ==).
      (for num in the-values
        (assert false (num ==).
      ).
    ).
    (should "(x == y) returns true for equal-pairs." (=> ()
      (for p in equal-pairs
        (assert ((p 0) == (p 1).
      ).
    ).
    (should "(x == y) returns false for ascending-pairs and descending-pairs." (=> ()
      (for p in (ascending-pairs + descending-pairs)
        (assert false ((p 0) == (p 1).
      ).
    ).
  ).
  (define "(a-number != another-number)" (=> ()
    (should "(x !=) returns true." (=> ()
      (assert (the-empty !=).
      (for num in the-values
        (assert (num !=).
      ).
    ).
    (should "(x != y) returns false for equal-pairs." (=> ()
      (for p in equal-pairs
        (assert false ((p 0) != (p 1).
      ).
    ).
    (should "(x != y) returns true for ascending-pairs and descending-pairs." (=> ()
      (for p in (ascending-pairs + descending-pairs)
        (assert ((p 0) != (p 1).
      ).
    ).
  ).
).

(define "(a-number ceil)" (= ()
  (should "(num ceil) returns num for an integer value." (= ()
    (assert 0 (0 ceil).
    (assert 0 (-0 ceil).

    (assert 1 (1 ceil).
    (assert -1 (-1 ceil).

    (assert (number max) ((number max) ceil).
    (assert (number min) ((number min) ceil).

    (assert (number infinite) ((number infinite) ceil).
    (assert (number -infinite) ((number -infinite) ceil).

    (assert (number invalid) ((number invalid) ceil).
  ).
  (should "(num ceil) returns the ceiling value of a non-integer." (= ()
    (assert 1 (0.1 ceil).
    (assert 0 (-0.1 ceil).

    (assert 1 (0.5 ceil).
    (assert 0 (-0.5 ceil).

    (assert 1 (0.9 ceil).
    (assert 0 (-0.9 ceil).

    (assert 2 (1.1 ceil).
    (assert -1 (-1.1 ceil).

    (assert 2 (1.5 ceil).
    (assert -1 (-1.5 ceil).

    (assert 2 (1.9 ceil).
    (assert -1 (-1.9 ceil).
  ).
).

(define "(a-number floor)" (= ()
  (should "(num floor) returns num for an integer value." (= ()
    (assert 0 (0 floor).
    (assert 0 (-0 floor).

    (assert 1 (1 floor).
    (assert -1 (-1 floor).

    (assert (number max) ((number max) floor).
    (assert (number min) ((number min) floor).

    (assert (number infinite) ((number infinite) floor).
    (assert (number -infinite) ((number -infinite) floor).

    (assert (number invalid) ((number invalid) floor).
  ).
  (should "(num floor) returns the floor value of a non-integer." (= ()
    (assert 0 (0.1 floor).
    (assert -1 (-0.1 floor).

    (assert 0 (0.5 floor).
    (assert -1 (-0.5 floor).

    (assert 0 (0.9 floor).
    (assert -1 (-0.9 floor).

    (assert 1 (1.1 floor).
    (assert -2 (-1.1 floor).

    (assert 1 (1.5 floor).
    (assert -2 (-1.5 floor).

    (assert 1 (1.9 floor).
    (assert -2 (-1.9 floor).
  ).
).

(define "(a-number round)" (= ()
  (should "(num round) returns num for an integer value." (= ()
    (assert 0 (0 round).
    (assert 0 (-0 round).

    (assert 1 (1 round).
    (assert -1 (-1 round).

    (assert (number max) ((number max) round).
    (assert (number min) ((number min) round).

    (assert (number infinite) ((number infinite) round).
    (assert (number -infinite) ((number -infinite) round).

    (assert (number invalid) ((number invalid) round).
  ).
  (should "(num round) returns the rounding value of a non-integer." (= ()
    (assert 0 (0.1 round).
    (assert 0 (-0.1 round).

    (assert 1 (0.5 round).
    (assert 0 (-0.5 round).

    (assert 1 (0.9 round).
    (assert -1 (-0.9 round).

    (assert 1 (1.1 round).
    (assert -1 (-1.1 round).

    (assert 2 (1.5 round).
    (assert -1 (-1.5 round).

    (assert 2 (1.9 round).
    (assert -2 (-1.9 round).
  ).
).

(define "(a-number trunc)" (= ()
  (should "(num trunc) returns num for an integer value." (= ()
    (assert 0 (0 trunc).
    (assert 0 (-0 trunc).

    (assert 1 (1 trunc).
    (assert -1 (-1 trunc).

    (assert (number max) ((number max) trunc).
    (assert (number min) ((number min) trunc).

    (assert (number infinite) ((number infinite) trunc).
    (assert (number -infinite) ((number -infinite) trunc).

    (assert (number invalid) ((number invalid) trunc).
  ).
  (should "(num trunc) returns a value by removing fractional part." (= ()
    (assert 0 (0.1 trunc).
    (assert 0 (-0.1 trunc).

    (assert 0 (0.5 trunc).
    (assert 0 (-0.5 trunc).

    (assert 0 (0.9 trunc).
    (assert 0 (-0.9 trunc).

    (assert 1 (1.1 trunc).
    (assert -1 (-1.1 trunc).

    (assert 1 (1.5 trunc).
    (assert -1 (-1.5 trunc).

    (assert 1 (1.9 trunc).
    (assert -1 (-1.9 trunc).
  ).
).

(define "(a-number to-string format)" (= ()
  (should "format will be ignored for invalid and infinite value." (= ()
    (assert ((number invalid) to-string) ((number invalid) to-string "hex").
    (assert ((number invalid) to-string) ((number invalid) to-string "oct").
    (assert ((number invalid) to-string) ((number invalid) to-string "bin").

    (assert ((number infinite) to-string) ((number infinite) to-string "hex").
    (assert ((number infinite) to-string) ((number infinite) to-string "oct").
    (assert ((number infinite) to-string) ((number infinite) to-string "bin").

    (assert ((number -infinite) to-string) ((number -infinite) to-string "hex").
    (assert ((number -infinite) to-string) ((number -infinite) to-string "oct").
    (assert ((number -infinite) to-string) ((number -infinite) to-string "bin").
  ).
  (should "(num to-string \"hex\") returns the hexadecimal string of num." (= ()
    (assert "0x0" (0 to-string "hex").
    (assert "0x1" (1 to-string "hex").

    (assert "0x9" (9 to-string "hex").
    (assert "0xa" (10 to-string "hex").
    (assert "0xb" (11 to-string "hex").
    (assert "0xc" (12 to-string "hex").
    (assert "0xd" (13 to-string "hex").
    (assert "0xe" (14 to-string "hex").
    (assert "0xf" (15 to-string "hex").
    (assert "0x10" (16 to-string "hex").
    (assert "0xff" (255 to-string "hex").
    (assert "0xffff" (65535 to-string "hex").
    (assert "0xffffffff" (0xFFFFFFFF to-string "hex").

    (assert "0xffffffff" (-1 to-string "hex").
    (assert "0xfffffffe" (-2 to-string "hex").
    (assert "0x80000001" ((0 - 0x7FFFFFFF) to-string "hex").
    (assert "0x80000000" ((0 - 0x80000000) to-string "hex").
  ).
  (should "(num to-string \"oct\") returns the octal string of num." (= ()
    (assert "00" (0 to-string "oct").
    (assert "01" (1 to-string "oct").

    (assert "07" (7 to-string "oct").
    (assert "010" (8 to-string "oct").
    (assert "011" (9 to-string "oct").
    (assert "012" (10 to-string "oct").
    (assert "013" (11 to-string "oct").
    (assert "014" (12 to-string "oct").
    (assert "015" (13 to-string "oct").
    (assert "016" (14 to-string "oct").
    (assert "017" (15 to-string "oct").
    (assert "020" (16 to-string "oct").
    (assert "0377" (255 to-string "oct").
    (assert "0177777" (65535 to-string "oct").
    (assert "037777777777" (0xFFFFFFFF to-string "oct").

    (assert "037777777777" (-1 to-string "oct").
    (assert "037777777776" (-2 to-string "oct").
    (assert "020000000001" ((0 - 0x7FFFFFFF) to-string "oct").
    (assert "020000000000" ((0 - 0x80000000) to-string "oct").
  ).
  (should "(num to-string \"bin\") returns the binary string of num." (= ()
    (assert "0b0" (0 to-string "bin").
    (assert "0b1" (1 to-string "bin").

    (assert "0b10" (2 to-string "bin").
    (assert "0b11" (3 to-string "bin").
    (assert "0b100" (4 to-string "bin").

    (assert "0b11111111" (255 to-string "bin").
    (assert "0b1111111111111111" (65535 to-string "bin").
    (assert "0b11111111111111111111111111111111" (0xFFFFFFFF to-string "bin").

    (assert "0b11111111111111111111111111111111" (-1 to-string "bin").
    (assert "0b11111111111111111111111111111110" (-2 to-string "bin").
    (assert "0b10000000000000000000000000000001" ((0 - 0x7FFFFFFF) to-string "bin").
    (assert "0b10000000000000000000000000000000" ((0 - 0x80000000) to-string "bin").
  ).
).

(define "(a-number : num ...)" (= ()
  (should "(num const-num) returns a range." (= ()
    (assert ((0 1) is-a range).
    (assert ((1 1) is-a range).
    (assert ((-1 1) is-a range).

    (assert ((1.5 1.5) is-a range).
    (assert ((-1.5 1.5) is-a range).

    (assert (((number max) 1) is-a range).
    (assert (((number min) 1) is-a range).

    (assert (((number infinite) 1) is-a range).
    (assert (((number -infinite) 1) is-a range).

    (assert (((number invalid) 1) is-a range).
  ).
  (should "(num : end) returns a range." (= ()
    (var end 1)
    (assert ((0 : end) is-a range).
    (assert ((1 : end) is-a range).
    (assert ((-1 : end) is-a range).

    (assert ((1.5 : end) is-a range).
    (assert ((-1.5 : end) is-a range).

    (assert (((number max) : end) is-a range).
    (assert (((number min) : end) is-a range).

    (assert (((number infinite) : end) is-a range).
    (assert (((number -infinite) : end) is-a range).

    (assert (((number invalid) : end) is-a range).
  ).
  (should "(num const-end const-step) works like (range of num const-end const-step)." (= ()
    (assert (range of 0 0) (0 0).
    (assert (range of 0 0 1) (0 0 1).

    (assert (range of 1 0) (1 0).
    (assert (range of 1 0 1) (1 0 1).
    (assert (range of -1 0) (-1 0).
    (assert (range of -1 0 1) (-1 0 1).

    (assert (range of 1.5 0) (1.5 0).
    (assert (range of 1.5 0 1) (1.5 0 1).
    (assert (range of -1.5 0) (-1.5 0).
    (assert (range of -1.5 0 1) (-1.5 0 1).

    (assert (range of (number max) 0) ((number max) 0).
    (assert (range of (number max) 0 1) ((number max) 0 1).
    (assert (range of (number min) 0) ((number min) 0).
    (assert (range of (number min) 0 1) ((number min) 0 1).

    (assert (range of (number infinite) 0) ((number infinite) 0).
    (assert (range of (number infinite) 0 1) ((number infinite) 0 1).
    (assert (range of (number -infinite) 0) ((number -infinite) 0).
    (assert (range of (number -infinite) 0 1) ((number -infinite) 0 1).

    (assert (range of (number invalid) 0) ((number invalid) 0).
    (assert (range of (number invalid) 0 1) ((number invalid) 0 1).
  ).
  (should "(num : end step) works like (range of num end step)." (= ()
    (var end 0.5)
    (var step 1.5)

    (assert (range of 0 end) (0 : end).
    (assert (range of 0 end step) (0 : end step).

    (assert (range of 1 end) (1 : end).
    (assert (range of 1 end step) (1 : end step).
    (assert (range of -1 end) (-1 : end).
    (assert (range of -1 end step) (-1 : end step).

    (assert (range of 1.5 end) (1.5 : end).
    (assert (range of 1.5 end step) (1.5 : end step).
    (assert (range of -1.5 end) (-1.5 : end).
    (assert (range of -1.5 end step) (-1.5 : end step).

    (assert (range of (number max) end) ((number max) : end).
    (assert (range of (number max) end step) ((number max) : end step).
    (assert (range of (number min) end) ((number min) : end).
    (assert (range of (number min) end step) ((number min) : end step).

    (assert (range of (number infinite) end) ((number infinite) : end).
    (assert (range of (number infinite) end step) ((number infinite) : end step).
    (assert (range of (number -infinite) end) ((number -infinite) : end).
    (assert (range of (number -infinite) end step) ((number -infinite) : end step).

    (assert (range of (number invalid) end) ((number invalid) : end).
    (assert (range of (number invalid) end step) ((number invalid) : end step).
  ).
).
