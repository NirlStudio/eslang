(var the-type number)
(include "type_")

(define "Common Behaviours" (= ()
  (define "Identity" (=> ()
    (should "a number is its value" (= ()
      (assert (0 is 0),
      (assert false (0 is-not 0),

      (assert (-1 is -1),
      (assert false (-1 is-not -1),

      (assert (1 is 1),
      (assert false (1 is-not 1),
    ),
    (should "(number invalid) is (number invalid)" (=> ()
      (assert ((number invalid) is (number invalid)),
      (assert false ((number invalid) is-not (number invalid)),
    ),
    (should "(number infinite) is (number infinite)" (=> ()
      (assert ((number infinite) is (number infinite)),
      (assert false ((number infinite) is-not (number infinite)),
    ),
    (should "(number -infinite) is (number -infinite)" (=> ()
      (assert ((number -infinite) is (number -infinite)),
      (assert false ((number -infinite) is-not (number -infinite)),
    ),
  ),

  (define "Equivalence" (=> ()
    (should "a number is equivalent with its value" (=> ()
      (assert (0 equals 0),
      (assert false (0 not-equals 0),

      (assert (-1 equals -1),
      (assert false (-1 not-equals -1),

      (assert (1 equals 1),
      (assert false (1 not-equals 1),
    ),
    (should "(number invalid) is equivalent with (number invalid)" (=> ()
      (assert (((number invalid)) equals (number invalid)),
      (assert false ((number invalid) not-equals (number invalid)),
    ),
    (should "(number infinite) is equivalent with (number infinite)" (=> ()
      (assert ((number infinite) equals (number infinite)),
      (assert false ((number infinite) not-equals (number infinite)),
    ),
    (should "(number -infinite) is equivalent with (number -infinite)" (=> ()
      (assert ((number -infinite) equals (number -infinite)),
      (assert false ((number -infinite) not-equals (number -infinite)),
    ),
  ),

  (define "Equivalence (operators)" (=> ()
    (should "a number is equivalent with its value" (=> ()
      (assert (0 == 0),
      (assert false (0 != 0),

      (assert (-1 == -1),
      (assert false (-1 != -1),

      (assert (1 == 1),
      (assert false (1 != 1),
    ),
    (should "(number invalid) is equivalent with (number invalid)" (=> ()
      (assert ((number invalid) == (number invalid)),
      (assert false ((number invalid) != (number invalid)),
    ),
    (should "(number infinite) is equivalent with (number infinite)" (=> ()
      (assert ((number infinite) == (number infinite)),
      (assert false ((number infinite) != (number infinite)),
    ),
    (should "(number -infinite) is equivalent with (number -infinite)" (=> ()
      (assert ((number -infinite) == (number -infinite)),
      (assert false ((number -infinite) != (number -infinite)),
    ),
  ),

  (define "Ordering" (=> ()
    (should "a common number can be compared with other common numbers." (=> ()
      (assert 0 (0 compare 0),
      (assert 1 (0 compare -1),
      (assert -1 (0 compare 1),
      (assert -1 (-1 compare 0),
      (assert 1 (1 compare 0),
    ),
    (should "(number infinite) equals with itself." (=> ()
      (assert 0 ((number infinite) compare (number infinite)),
    ),
    (should "(number infinite) is great than other common numbers." (=> ()
      (assert 1 ((number infinite) compare 0),
      (assert 1 ((number infinite) compare -1),
      (assert 1 ((number infinite) compare 1),
      (assert 1 ((number infinite) compare (number max),
      (assert 1 ((number infinite) compare (number min),
      (assert 1 ((number infinite) compare (number max-int),
      (assert 1 ((number infinite) compare (number min-int),
      (assert 1 ((number infinite) compare (number -infinite)),

      (assert -1 (0 compare (number infinite)),
      (assert -1 (-1 compare (number infinite)),
      (assert -1 (1 compare (number infinite)),
      (assert -1 ((number max) compare (number infinite)),
      (assert -1 ((number min) compare (number infinite)),
      (assert -1 ((number max-int) compare (number infinite)),
      (assert -1 ((number min-int) compare (number infinite)),
      (assert -1 ((number -infinite) compare (number infinite)),
    ),
    (should "(number -infinite) is less than other common numbers." (=> ()
      (assert -1 ((number -infinite) compare 0),
      (assert -1 ((number -infinite) compare -1),
      (assert -1 ((number -infinite) compare 1),
      (assert -1 ((number -infinite) compare (number max),
      (assert -1 ((number -infinite) compare (number min),
      (assert -1 ((number -infinite) compare (number max-int),
      (assert -1 ((number -infinite) compare (number min-int),
      (assert -1 ((number -infinite) compare (number infinite)),

      (assert 1 (0 compare (number -infinite)),
      (assert 1 (-1 compare (number -infinite)),
      (assert 1 (1 compare (number -infinite)),
      (assert 1 ((number max) compare (number -infinite)),
      (assert 1 ((number min) compare (number -infinite)),
      (assert 1 ((number max-int) compare (number -infinite)),
      (assert 1 ((number min-int) compare (number -infinite)),
      (assert 1 ((number infinite) compare (number -infinite)),
    ),
    (should "(number invalid) is comparable with itself." (=> ()
      (assert 0 ((number invalid) compare (number invalid)),
    ),
    (should "(number invalid) is not comparable with other common numbers." (=> ()
      (assert null ((number invalid) compare 0),
      (assert null ((number invalid) compare -1),
      (assert null ((number invalid) compare 1),
      (assert null ((number invalid) compare (number infinite)),
      (assert null ((number invalid) compare (number -infinite)),

      (assert null (0 compare (number invalid)),
      (assert null (-1 compare (number invalid)),
      (assert null (1 compare (number invalid)),
      (assert null ((number infinite) compare (number invalid)),
      (assert null ((number -infinite) compare (number invalid)),
    ),
  ),

  (define "Emptiness" (=> ()
    (should "0 is defined as the empty value." (=> ()
      (assert 0 (number empty),
      (assert (0 is-empty),
    ),
    (should "(number invalid) is defined as an empty value too." (=> ()
      (assert ((number invalid) is-empty),
    ),
    (should "Other values are not empty." (=> ()
      (assert false (1 is-empty),
      (assert false (-1 is-empty),
      (assert false ((number min) is-empty),
      (assert false ((number max) is-empty),
      (assert false ((number min-int) is-empty),
      (assert false ((number max-int) is-empty),
      (assert false ((number infinite) is-empty),
      (assert false ((number -infinite) is-empty),
    ),
  ),

  (define "Encoding" (=> ()
    (should "a number is encoded to itself." (=> ()
      (assert 0 (0 to-code),
      (assert -1 (-1 to-code),
      (assert 1 (1 to-code),
      (assert (number invalid) ((number invalid) to-code),
      (assert (number infinite) ((number infinite) to-code),
      (assert (number -infinite) ((number -infinite) to-code),
    ),
  ),

  (define "Representation" (=> ()
    (should "a common nubmer is represented as a decimal string." (=> ()
      (assert "0" (0 to-string),
      (assert "1" (1 to-string),
      (assert "-1" (-1 to-string),
    ),
    (should "(number invalid) is represented as '(number invalid)'." (=> ()
      (assert "(number invalid)" ((number invalid) to-string),
    ),
    (should "(number infinite) is represented as '(number infinite)'." (=> ()
      (assert "(number infinite)" ((number infinite) to-string),
    ),
    (should "(number -infinite) is represented as '(number -infinite)'." (=> ()
      (assert "(number -infinite)" ((number -infinite) to-string),
  ),
).

(define "Constant Values" (= ()
  (should "the max value" (= ()
    (assert ((number max) is-a number),
  ),
  (should "the min value" (= ()
    (assert ((number min) is-a number),
  ),
  (should "the positive infinity value" (= ()
    (assert ((number infinite) is-a number),
  ),
  (should "the negative infinity value" (= ()
    (assert ((number -infinite) is-a number),
  ),
  (should "the max integer value" (= ()
    (assert ((number max-int) is-a number),
  ),
  (should "the min integer value" (= ()
    (assert ((number min-int) is-a number),
  ),
  (should "the bit number of a value for valid bitwise operations" (= ()
    (assert ((number bits) is-a number),
  ),
  (should "the max valid bitwise operation value" (= ()
    (assert ((number max-bits) is-a number),
  ),
  (should "the min valid bitwise operation value" (= ()
    (assert ((number min-bits) is-a number),
  ),
),

(define "Number Parsing" (= ()
  (should "parse a decimal string to its number value" (= ()
    (assert 0 (number parse "0"),
    (assert 1.5 (number parse "1.5"),
    (assert -1.5 (number parse "-1.5"),
    (assert (number invalid) (number parse "(number invalid)"),
    (assert (number infinite) (number parse "(number infinite)"),
    (assert (number -infinite) (number parse "(number -infinite)"),

    (assert (number invalid) (number parse ""),
    (assert (number invalid) (number parse "X"),
    (assert (number invalid) (number parse),
    (assert (number invalid) (number parse null),
    (assert (number invalid) (number parse false),
    (assert (number invalid) (number parse true),

    (assert 0 (number parse 0),
    (assert 1.5 (number parse 1.5),
    (assert -1.5 (number parse -1.5),
  ),
  (should "parse a decimal string to its integer value" (= ()
    (assert 0 (number parse-int "0"),
    (assert 1 (number parse-int "1"),
    (assert -1 (number parse-int "-1"),
    (assert 1 (number parse-int "1.5"),
    (assert -1 (number parse-int "-1.5"),
  ),
  (should "parse a hex string to its integer value" (= ()
    (assert 0 (number parse-int "0x0"),
    (assert 1 (number parse-int "0x1"),
    (assert 1 (number parse-int "0x01"),
    (assert 1 (number parse-int "0x0001"),
    (assert 1 (number parse-int "0x000001"),
    (assert 1 (number parse-int "0x00000001"),
  ),
  (should "parse a bit string to its integer value" (= ()
    (assert 0 (number parse-int "0b0"),
    (assert 1 (number parse-int "0b1"),
    (assert 1 (number parse-int "0b01"),
    (assert 3 (number parse-int "0b11"),
    (assert 7 (number parse-int "0b111"),
  ),
  (should "parse a octal string to its integer value" (= ()
    (assert 0 (number parse-int "00"),
    (assert 1 (number parse-int "01"),
    (assert 9 (number parse-int "011"),
    (assert 73 (number parse-int "0111"),
  ),
),

(define "Value Conversion" (= ()
  (should "a number converted to itself." (= ()
    (assert 0 (number of 0),
    (assert 1 (number of 1),
    (assert -1 (number of -1),
    (assert (number invalid) (number of (number invalid)),
    (assert (number infinite) (number of (number infinite)),
    (assert (number -infinite) (number of (number -infinite)),
  ),
  (should "false is converted to 0." (= ()
    (assert 0 (number of false),
  ),
  (should "true is converted to 1." (= ()
    (assert 1 (number of true),
  ),
  (should "a string is converted by parsing." (= ()
    (assert 0 (number of "0"),
    (assert 1 (number of "1"),
    (assert -1 (number of "-1"),
    (assert (number invalid) (number of "(number invalid)"),
    (assert (number infinite) (number of "(number infinite)"),
    (assert (number -infinite) (number of "(number -infinite)"),
  ),
  (should "a date is converted to its timestamp value." (= ()
    (assert 0 (number of (date of 0),
    (assert 1 (number of (date of 1),
  ),
  (should "Other values is converted to (number invalid)." (= ()
    (assert (number invalid) (number of (range of 0),
    (assert (number invalid) (number of (symbol of "X"),
    (assert (number invalid) (number of (tuple of (@ 1 2),
    (assert (number invalid) (number of (@),
    (assert (number invalid) (number of (@:),
  ),
  (should "A (number invalid) result is converted to the default value if it's provided." (= ()
    (assert 1 (number of (number invalid) 1),
    (assert 1 (number of (symbol of "X") 1),
    (assert 1 (number of (tuple of (@ 1 2)) 1),
    (assert 1 (number of (@) 1),
    (assert 1 (number of (@:) 1),
  ),
).

(define "Integer Conversion" (= ()
  (should "a number converted to its integer part." (= ()
    (assert 0 (number of-int 0),
    (assert 1 (number of-int 1.5),
    (assert -1 (number of-int -1.5),
  ),
  (should "(number invalid) is converted to 0." (= ()
    (assert 0 (number of-int (number invalid)),
  ),
  (should "(number infinite) is converted to 0." (= ()
    (assert 0 (number of-int (number infinite)),
  ),
  (should "(number -infinite) is converted to 0." (= ()
    (assert 0 (number of-int (number -infinite)),
  ),
  (should "false is converted to 0." (= ()
    (assert 0 (number of-int false),
  ),
  (should "true is converted to 1." (= ()
    (assert 1 (number of-int true),
  ),
  (should "a string is converted by parsing." (= ()
    (assert 0 (number of-int "0"),
    (assert 1 (number of-int "1.5"),
    (assert -1 (number of-int "-1.5"),
    (assert 0 (number of-int "(number invalid)"),
    (assert 0 (number of-int "(number infinite)"),
    (assert 0 (number of-int "(number -infinite)"),
  ),
  (should "Other values is converted to 0." (= ()
    (assert 0 (number of-int (date of 0),
    (assert 0 (number of-int (range of 0),
    (assert 0 (number of-int (symbol of "X"),
    (assert 0 (number of-int (tuple of (@ 1 2),
    (assert 0 (number of-int (@),
    (assert 0 (number of-int (@:),
  ),
  (should "An invalid conversion returns the default value if it's provided." (= ()
    (assert 1 (number of-int (date of 0) 1),
    (assert 1 (number of-int (range of 0) 1),
    (assert 1 (number of-int (symbol of "X") 1),
    (assert 1 (number of-int (tuple of (@ 1 2)) 1),
    (assert 1 (number of-int (@) 1),
    (assert 1 (number of-int (@:) 1),
  ),
).

(define "Bits (32-bit signed) Integer Conversion" (= ()
  (should "an integer smaller than max-bits keeps the same." (= ()
    (assert 0 (number of-bits 0),
    (assert 1 (number of-bits 1.5),
    (assert -1 (number of-bits -1.5),
  ),
  (should "an integer great than max-bits converts to a signed value." (= ()
    (assert -1 (number of-bits 0xFFFFFFFF),
    (assert -2 (number of-bits 0xFFFFFFFE),

    (assert false (-1 == 0xFFFFFFFF),
    (assert false (-2 == 0xFFFFFFFE),
  ),
).

(define "Test Special Values" (= ()
  (should "(number invalid): not a valid number." (= ()
    (assert false ((number invalid) is-valid),
    (assert true ((number invalid) is-invalid),
  ),
  (should "Integer Values is integer." (= ()
    (assert (0 is-int),
    (assert false (0 is-not-int),

    (assert (1 is-int),
    (assert false (1 is-not-int),

    (assert (-1 is-int),
    (assert false (-1 is-not-int),

    (assert false (1.5 is-int),
    (assert (1.5 is-not-int),

    (assert false (-1.5 is-int),
    (assert (-1.5 is-not-int),
  ),
  (should "Bits is safe for a 32-bit integer." (= ()
    (assert (0 is-bits),
    (assert (1 is-bits),
    (assert (-1 is-bits),
    (assert false (0 is-not-bits),
    (assert false (1 is-not-bits),
    (assert false (-1 is-not-bits),

    (assert false (0x80000000 is-bits),
    (assert (0x80000000 is-not-bits),
  ),
  (should "(number invalid) is not integer." (= ()
    (assert false ((number invalid) is-int),
    (assert ((number invalid) is-not-int),
  ),
  (should "Inifinite values are not integer." (= ()
    (assert false ((number infinite) is-int),
    (assert true ((number infinite) is-not-int),

    (assert false ((number -infinite) is-int),
    (assert true ((number -infinite) is-not-int),

    (assert false ((number infinite) is-int),
    (assert true ((number infinite) is-not-int),

    (assert false ((number -infinite) is-int),
    (assert true ((number -infinite) is-not-int),
  ),
  (should "Inifinite Values is not finite." (= ()
    (assert false ((number infinite) is-finite),
    (assert true ((number infinite) is-infinite),

    (assert false ((number -infinite) is-finite),
    (assert true ((number -infinite) is-infinite),

    (assert false ((number infinite) is-finite),
    (assert true ((number infinite) is-infinite),

    (assert false ((number -infinite) is-finite),
    (assert true ((number -infinite) is-infinite),
  ),
  (should "(number invalid) is taken as a special infinite value." (= ()
    (assert false ((number invalid) is-finite),
    (assert ((number invalid) is-infinite),
  ),
).

(define "Arithmetic Operations" (= ()
  (should "+: and" (= ()
    (assert 0 (0 +),
    (assert 1 (1 +),
    (assert -1 (-1 +),

    (assert 0 (0 + 0),
    (assert -1 (0 + -1),
    (assert -2 (0 + -1 -1),
    (assert 1 (0 + 1),
    (assert 2 (0 + 1 1),

    (assert 1 (1 + 0),
    (assert 2 (1 + 1),
    (assert 0 (1 + -1),

    (assert -1 (-1 + 0),
    (assert 0 (-1 + 1),
    (assert -2 (-1 + -1),

    (assert (number invalid) ((number invalid) + 0),
    (assert (number invalid) ((number invalid) + 1),
    (assert (number invalid) ((number invalid) + -1),
    (assert (number invalid) (0 + (number invalid)),
    (assert (number invalid) (1 + (number invalid)),
    (assert (number invalid) (-1 + (number invalid)),

    (assert (number infinite) ((number infinite) + 0),
    (assert (number infinite) ((number infinite) + 1),
    (assert (number infinite) ((number infinite) + -1),
    (assert (number infinite) (0 + (number infinite)),
    (assert (number infinite) (1 + (number infinite)),
    (assert (number infinite) (-1 + (number infinite)),
  ),
  (should "-: subtract" (= ()
    (assert 0 (0 -),
    (assert 1 (1 -),
    (assert -1 (-1 -),

    (assert 0 (0 - 0),
    (assert 1 (0 - -1),
    (assert 2 (0 - -1 -1),
    (assert -1 (0 - 1),
    (assert -2 (0 - 1 1),

    (assert 1 (1 - 0),
    (assert 0 (1 - 1),
    (assert 2 (1 - -1),

    (assert -1 (-1 - 0),
    (assert -2 (-1 - 1),
    (assert 0 (-1 - -1),

    (assert (number invalid) ((number invalid) - 0),
    (assert (number invalid) ((number invalid) - 1),
    (assert (number invalid) ((number invalid) - -1),
    (assert (number invalid) (0 - (number invalid)),
    (assert (number invalid) (1 - (number invalid)),
    (assert (number invalid) (-1 - (number invalid)),

    (assert (number infinite) ((number infinite) - 0),
    (assert (number infinite) ((number infinite) - 1),
    (assert (number infinite) ((number infinite) - -1),
    (assert (number -infinite) (0 - (number infinite)),
    (assert (number -infinite) (1 - (number infinite)),
    (assert (number -infinite) (-1 - (number infinite)),
  ),
  (should "*: times" (= ()
    (assert 0 (0 *),
    (assert 1 (1 *),
    (assert -1 (-1 *),

    (assert 0 (0 * 0),
    (assert 0 (0 * -1),
    (assert 0 (0 * -1 -1),
    (assert 0 (0 * 1),
    (assert 0 (0 * 1 1),

    (assert 0 (1 * 0),
    (assert 1 (1 * 1),
    (assert -1 (1 * -1),

    (assert 0 (-1 * 0),
    (assert -1 (-1 * 1),
    (assert 1 (-1 * -1),

    (assert (number invalid) ((number invalid) * 0),
    (assert (number invalid) ((number invalid) * 1),
    (assert (number invalid) ((number invalid) * -1),
    (assert (number invalid) (0 * (number invalid)),
    (assert (number invalid) (1 * (number invalid)),
    (assert (number invalid) (-1 * (number invalid)),

    (assert (number invalid) ((number infinite) * 0),
    (assert (number infinite) ((number infinite) * 1),
    (assert (number -infinite) ((number infinite) * -1),
    (assert (number invalid) (0 * (number infinite)),
    (assert (number infinite) (1 * (number infinite)),
    (assert (number -infinite) (-1 * (number infinite)),
  ),
  (should "/: divide" (= ()
    (assert 0 (0 /),
    (assert 1 (1 /),
    (assert -1 (-1 /),

    (assert (number invalid) (0 / 0),
    (assert 0 (0 / -1),
    (assert 0 (0 / -1 -1),
    (assert 0 (0 / 1),
    (assert 0 (0 / 1 1),

    (assert (number infinite) (1 / 0),
    (assert 1 (1 / 1),
    (assert -1 (1 / -1),

    (assert (number -infinite) (-1 / 0),
    (assert -1 (-1 / 1),
    (assert 1 (-1 / -1),

    (assert (number invalid) ((number invalid) / 0),
    (assert (number invalid) ((number invalid) / 1),
    (assert (number invalid) ((number invalid) / -1),
    (assert (number invalid) (0 / (number invalid)),
    (assert (number invalid) (1 / (number invalid)),
    (assert (number invalid) (-1 / (number invalid)),

    (assert (number infinite) ((number infinite) / 0),
    (assert (number infinite) ((number infinite) / 1),
    (assert (number -infinite) ((number infinite) / -1),
    (assert 0 (0 / (number infinite)),
    (assert 0 (1 / (number infinite)),
    (assert 0 (-1 / (number infinite)),
  ),
).

(define "Bitwise Operations" (= ()
  (should "Bitwise AND: &" (= ()
    (assert 0 (0 & 0),
    (assert 0 (0 & 1),
    (assert 0 (0 & -1),

    (assert 0 (1 & 0),
    (assert 1 (1 & 1),
    (assert 1 (1 & -1),
  ),
  (should "Bitwise OR: |" (= ()
    (assert 0 (0 | 0),
    (assert 1 (0 | 1),
    (assert -1 (0 | -1),

    (assert 1 (1 | 0),
    (assert 1 (1 | 1),
    (assert -1 (1 | -1),
  ),
  (should "Bitwise OR: |" (= ()
    (assert 0 (0 | 0),
    (assert 1 (0 | 1),
    (assert -1 (0 | -1),

    (assert 1 (1 | 0),
    (assert 1 (1 | 1),
    (assert -1 (1 | -1),
  ),
  (should "Bitwise XOR: ^" (= ()
    (assert 0 (0 ^ 0),
    (assert 1 (0 ^ 1),
    (assert -1 (0 ^ -1),

    (assert 1 (1 ^ 0),
    (assert 0 (1 ^ 1),
    (assert -2 (1 ^ -1),
  ),
  (should "Bitwise left-shift: <<" (= ()
    (assert 0 (0 << 0),
    (assert 0 (0 << 1),
    (assert 0 (0 << 2),

    (assert 1 (1 << 0),
    (assert 2 (1 << 1),
    (assert 4 (1 << 2),
  ),
  (should "Bitwise zere-based right-shift: >>" (= ()
    (assert 0 (0 >>> 0),
    (assert 0 (0 >>> 1),
    (assert 0 (0 >>> 2),

    (assert 1 (1 >>> 0),
    (assert 1 (2 >>> 1),
    (assert 1 (4 >>> 2),

    (assert 0x80000001 (0x80000001 >>> 0),
    (assert 0x40000000 (0x80000001 >>> 1),
    (assert 0x20000000 (0x80000001 >>> 2),
  ),
  (should "Bitwise signed right-shift: >>>" (= ()
    (assert 0 (0 >> 0),
    (assert 0 (0 >> 1),
    (assert 0 (0 >> 2),

    (assert 1 (1 >> 0),
    (assert 1 (2 >> 1),
    (assert 1 (4 >> 2),

    (assert (number of-bits 0x80000001) (0x80000001 >> 0),
    (assert (number of-bits 0xC0000000) (0x80000001 >> 1),
    (assert (number of-bits 0xE0000000) (0x80000001 >> 2),
  ),
).

(define "Ordering Operators" (= ()
  (should "Great-Than: >" (= ()
    (assert false (0 > 0),
    (assert false (0 > 1),
    (assert true (0 > -1),
    (assert null (0 > (number invalid)),
    (assert false (0 > (number infinite)),
    (assert true (0 > (number -infinite)),

    (assert true (1 > 0),
    (assert false (1 > 1),
    (assert true (1 > -1),
    (assert null (1 > (number invalid)),
    (assert false (1 > (number infinite)),
    (assert true (1 > (number -infinite)),

    (assert false (-1 > 0),
    (assert false (-1 > 1),
    (assert false (-1 > -1),
    (assert null (-1 > (number invalid)),
    (assert false (-1 > (number infinite)),
    (assert true (-1 > (number -infinite)),

    (assert true ((number infinite) > 0),
    (assert true ((number infinite) > 1),
    (assert true ((number infinite) > -1),
    (assert null ((number infinite) > (number invalid)),
    (assert false ((number infinite) > (number infinite)),
    (assert true ((number infinite) > (number -infinite)),

    (assert false ((number -infinite) > 0),
    (assert false ((number -infinite) > 1),
    (assert false ((number -infinite) > -1),
    (assert null ((number -infinite) > (number invalid)),
    (assert false ((number -infinite) > (number infinite)),
    (assert false ((number -infinite) > (number -infinite)),

    (assert null ((number invalid) > 0),
    (assert null ((number invalid) > 1),
    (assert null ((number invalid) > -1),
    (assert false ((number invalid) > (number invalid)), # (number invalid) is comparable with itself
    (assert null ((number invalid) > (number infinite)),
    (assert null ((number invalid) > (number -infinite)),
  ),
  (should "Great-or-Equal: >=" (= ()
    (assert true (0 >= 0),
    (assert false (0 >= 1),
    (assert true (0 >= -1),
    (assert null (0 >= (number invalid)),
    (assert false (0 >= (number infinite)),
    (assert true (0 >= (number -infinite)),

    (assert true (1 >= 0),
    (assert true (1 >= 1),
    (assert true (1 >= -1),
    (assert null (1 >= (number invalid)),
    (assert false (1 >= (number infinite)),
    (assert true (1 >= (number -infinite)),

    (assert false (-1 >= 0),
    (assert false (-1 >= 1),
    (assert true (-1 >= -1),
    (assert null (-1 >= (number invalid)),
    (assert false (-1 >= (number infinite)),
    (assert true (-1 >= (number -infinite)),

    (assert true ((number infinite) >= 0),
    (assert true ((number infinite) >= 1),
    (assert true ((number infinite) >= -1),
    (assert null ((number infinite) >= (number invalid)),
    (assert true ((number infinite) >= (number infinite)),
    (assert true ((number infinite) >= (number -infinite)),

    (assert false ((number -infinite) >= 0),
    (assert false ((number -infinite) >= 1),
    (assert false ((number -infinite) >= -1),
    (assert null ((number -infinite) >= (number invalid)),
    (assert false ((number -infinite) >= (number infinite)),
    (assert true ((number -infinite) >= (number -infinite)),

    (assert null ((number invalid) >= 0),
    (assert null ((number invalid) >= 1),
    (assert null ((number invalid) >= -1),
    (assert true ((number invalid) >= (number invalid)), # (number invalid) is comparable with itself
    (assert null ((number invalid) >= (number infinite)),
    (assert null ((number invalid) >= (number -infinite)),
  ),
  (should "Less-Than: <" (= ()
    (assert false (0 < 0),
    (assert true (0 < 1),
    (assert false (0 < -1),
    (assert null (0 < (number invalid)),
    (assert true (0 < (number infinite)),
    (assert false (0 < (number -infinite)),

    (assert false (1 < 0),
    (assert false (1 < 1),
    (assert false (1 < -1),
    (assert null (1 < (number invalid)),
    (assert true (1 < (number infinite)),
    (assert false (1 < (number -infinite)),

    (assert true (-1 < 0),
    (assert true (-1 < 1),
    (assert false (-1 < -1),
    (assert null (-1 < (number invalid)),
    (assert true (-1 < (number infinite)),
    (assert false (-1 < (number -infinite)),

    (assert false ((number infinite) < 0),
    (assert false ((number infinite) < 1),
    (assert false ((number infinite) < -1),
    (assert null ((number infinite) < (number invalid)),
    (assert false ((number infinite) < (number infinite)),
    (assert false ((number infinite) < (number -infinite)),

    (assert true ((number -infinite) < 0),
    (assert true ((number -infinite) < 1),
    (assert true ((number -infinite) < -1),
    (assert null ((number -infinite) < (number invalid)),
    (assert true ((number -infinite) < (number infinite)),
    (assert false ((number -infinite) < (number -infinite)),

    (assert null ((number invalid) < 0),
    (assert null ((number invalid) < 1),
    (assert null ((number invalid) < -1),
    (assert false ((number invalid) < (number invalid)), # (number invalid) is comparable with itself
    (assert null ((number invalid) < (number infinite)),
    (assert null ((number invalid) < (number -infinite)),
  ),
  (should "Less-or-Equal: <=" (= ()
    (assert true (0 <= 0),
    (assert true (0 <= 1),
    (assert false (0 <= -1),
    (assert null (0 <= (number invalid)),
    (assert true (0 <= (number infinite)),
    (assert false (0 <= (number -infinite)),

    (assert false (1 <= 0),
    (assert true (1 <= 1),
    (assert false (1 <= -1),
    (assert null (1 <= (number invalid)),
    (assert true (1 <= (number infinite)),
    (assert false (1 <= (number -infinite)),

    (assert true (-1 <= 0),
    (assert true (-1 <= 1),
    (assert true (-1 <= -1),
    (assert null (-1 <= (number invalid)),
    (assert true (-1 <= (number infinite)),
    (assert false (-1 <= (number -infinite)),

    (assert false ((number infinite) <= 0),
    (assert false ((number infinite) <= 1),
    (assert false ((number infinite) <= -1),
    (assert null ((number infinite) <= (number invalid)),
    (assert true ((number infinite) <= (number infinite)),
    (assert false ((number infinite) <= (number -infinite)),

    (assert true ((number -infinite) <= 0),
    (assert true ((number -infinite) <= 1),
    (assert true ((number -infinite) <= -1),
    (assert null ((number -infinite) <= (number invalid)),
    (assert true ((number -infinite) <= (number infinite)),
    (assert true ((number -infinite) <= (number -infinite)),

    (assert null ((number invalid) <= 0),
    (assert null ((number invalid) <= 1),
    (assert null ((number invalid) <= -1),
    (assert true ((number invalid) <= (number invalid)), # (number invalid) is comparable with itself
    (assert null ((number invalid) <= (number infinite)),
    (assert null ((number invalid) <= (number -infinite)),
  ),
).

(define "Number Conversion" (= ()
  (should "ceil returns the integer value great or equal this number." (= ()
    (assert 0 (0 ceil),
    (assert -1 (-1 ceil),
    (assert 1 (1 ceil),
    (assert -1 (-1.5 ceil),
    (assert 2 (1.5 ceil),
    (assert (number invalid) ((number invalid) ceil),
    (assert (number infinite) ((number infinite) ceil),
    (assert (number -infinite) ((number -infinite) ceil),
  ),
  (should "floor returns the integer value less or equal this number." (= ()
    (assert 0 (0 floor),
    (assert -1 (-1 floor),
    (assert 1 (1 floor),
    (assert -2 (-1.5 floor),
    (assert 1 (1.5 floor),
    (assert (number invalid) ((number invalid) floor),
    (assert (number infinite) ((number infinite) floor),
    (assert (number -infinite) ((number -infinite) floor),
  ),
  (should "round returns the closest integer value of this number by 0.5." (= ()
    (assert 0 (0 round),
    (assert -1 (-1 round),
    (assert 1 (1 round),
    (assert -1 (-1.49 round),
    (assert -1 (-1.5 round),
    (assert -2 (-1.51 round),
    (assert 1 (1.49 round),
    (assert 2 (1.5 round),
    (assert 2 (1.51 round),
    (assert (number invalid) ((number invalid) round),
    (assert (number infinite) ((number infinite) round),
    (assert (number -infinite) ((number -infinite) round),
  ),
  (should "trunc returns the integer part of this number." (= ()
    (assert 0 (0 trunc),
    (assert -1 (-1 trunc),
    (assert 1 (1 trunc),
    (assert -1 (-1.49 trunc),
    (assert -1 (-1.5 trunc),
    (assert -1 (-1.51 trunc),
    (assert 1 (1.49 trunc),
    (assert 1 (1.5 trunc),
    (assert 1 (1.51 trunc),
    (assert (number invalid) ((number invalid) trunc),
    (assert (number infinite) ((number infinite) trunc),
    (assert (number -infinite) ((number -infinite) trunc),
  ),
).
