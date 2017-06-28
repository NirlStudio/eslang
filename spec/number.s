(let the-type number)
(let the-value 0)
(include "type_")

(define "common behaviour" (= ()
  (define "Identity" (=> ()
    (should "a number is its value" (= ()
      (assert (0 is 0),
      (assert false (0 is-not 0),

      (assert (-1 is -1),
      (assert false (-1 is-not -1),

      (assert (1 is 1),
      (assert false (1 is-not 1),
    ),
    (should "NaN is NaN" (=> ()
      (assert (NaN is NaN),
      (assert false (NaN is-not NaN),
    ),
    (should "Infinity is Infinity" (=> ()
      (assert (Infinity is Infinity),
      (assert false (Infinity is-not Infinity),
    ),
    (should "-Infinity is -Infinity" (=> ()
      (assert (-Infinity is -Infinity),
      (assert false (-Infinity is-not -Infinity),
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
    (should "NaN is equivalent with NaN" (=> ()
      (assert (NaN equals NaN),
      (assert false (NaN not-equals NaN),
    ),
    (should "Infinity is equivalent with Infinity" (=> ()
      (assert (Infinity equals Infinity),
      (assert false (Infinity not-equals Infinity),
    ),
    (should "-Infinity is equivalent with -Infinity" (=> ()
      (assert (-Infinity equals -Infinity),
      (assert false (-Infinity not-equals -Infinity),
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
    (should "NaN is equivalent with NaN" (=> ()
      (assert (NaN == NaN),
      (assert false (NaN != NaN),
    ),
    (should "Infinity is equivalent with Infinity" (=> ()
      (assert (Infinity == Infinity),
      (assert false (Infinity != Infinity),
    ),
    (should "-Infinity is equivalent with -Infinity" (=> ()
      (assert (-Infinity == -Infinity),
      (assert false (-Infinity != -Infinity),
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
    (should "Infinity equals with itself." (=> ()
      (assert 0 (Infinity compare Infinity),
    ),
    (should "Infinity is great than other common numbers." (=> ()
      (assert 1 (Infinity compare 0),
      (assert 1 (Infinity compare -1),
      (assert 1 (Infinity compare 1),
      (assert 1 (Infinity compare (number max),
      (assert 1 (Infinity compare (number min),
      (assert 1 (Infinity compare (number max-int),
      (assert 1 (Infinity compare (number min-int),
      (assert 1 (Infinity compare -Infinity),

      (assert -1 (0 compare Infinity),
      (assert -1 (-1 compare Infinity),
      (assert -1 (1 compare Infinity),
      (assert -1 ((number max) compare Infinity),
      (assert -1 ((number min) compare Infinity),
      (assert -1 ((number max-int) compare Infinity),
      (assert -1 ((number min-int) compare Infinity),
      (assert -1 (-Infinity compare Infinity),
    ),
    (should "-Infinity is less than other common numbers." (=> ()
      (assert -1 (-Infinity compare 0),
      (assert -1 (-Infinity compare -1),
      (assert -1 (-Infinity compare 1),
      (assert -1 (-Infinity compare (number max),
      (assert -1 (-Infinity compare (number min),
      (assert -1 (-Infinity compare (number max-int),
      (assert -1 (-Infinity compare (number min-int),
      (assert -1 (-Infinity compare Infinity),

      (assert 1 (0 compare -Infinity),
      (assert 1 (-1 compare -Infinity),
      (assert 1 (1 compare -Infinity),
      (assert 1 ((number max) compare -Infinity),
      (assert 1 ((number min) compare -Infinity),
      (assert 1 ((number max-int) compare -Infinity),
      (assert 1 ((number min-int) compare -Infinity),
      (assert 1 (Infinity compare -Infinity),
    ),
    (should "NaN is comparable with itself." (=> ()
      (assert 0 (NaN compare NaN),
    ),
    (should "NaN is not comparable with other common numbers." (=> ()
      (assert null (NaN compare 0),
      (assert null (NaN compare -1),
      (assert null (NaN compare 1),
      (assert null (NaN compare Infinity),
      (assert null (NaN compare -Infinity),

      (assert null (0 compare NaN),
      (assert null (-1 compare NaN),
      (assert null (1 compare NaN),
      (assert null (Infinity compare NaN),
      (assert null (-Infinity compare NaN),
    ),
  ),

  (define "Emptiness" (=> ()
    (should "0 is defined as the empty value." (=> ()
      (assert 0 (number empty),
      (assert (0 is-empty),
    ),
    (should "NaN is defined as an empty value too." (=> ()
      (assert (NaN is-empty),
    ),
    (should "Other values are not empty." (=> ()
      (assert false (1 is-empty),
      (assert false (-1 is-empty),
      (assert false ((number min) is-empty),
      (assert false ((number max) is-empty),
      (assert false ((number min-int) is-empty),
      (assert false ((number max-int) is-empty),
      (assert false (Infinity is-empty),
      (assert false (-Infinity is-empty),
    ),
  ),

  (define "Encoding" (=> ()
    (should "a number is encoded to itself." (=> ()
      (assert 0 (0 to-code),
      (assert -1 (-1 to-code),
      (assert 1 (1 to-code),
      (assert NaN (NaN to-code),
      (assert Infinity (Infinity to-code),
      (assert -Infinity (-Infinity to-code),
    ),
  ),

  (define "Representation" (=> ()
    (should "a common nubmer is represented as a decimal string." (=> ()
      (assert "0" (0 to-string),
      (assert "1" (1 to-string),
      (assert "-1" (-1 to-string),
    ),
    (should "NaN is represented as 'NaN'." (=> ()
      (assert "NaN" (NaN to-string),
    ),
    (should "Infinity is represented as 'Infinity'." (=> ()
      (assert "Infinity" (Infinity to-string),
    ),
    (should "-Infinity is represented as '-Infinity'." (=> ()
      (assert "-Infinity" (-Infinity to-string),
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
    (assert ((number infinity) is-a number),
  ),
  (should "the negative infinity value" (= ()
    (assert ((number -infinity) is-a number),
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
    (assert NaN (number parse "NaN"),
    (assert Infinity (number parse "Infinity"),
    (assert -Infinity (number parse "-Infinity"),

    (assert NaN (number parse ""),
    (assert NaN (number parse "X"),
    (assert NaN (number parse),
    (assert NaN (number parse null),
    (assert NaN (number parse 0),
    (assert NaN (number parse 1.5),
    (assert NaN (number parse -1.5),
    (assert NaN (number parse false),
    (assert NaN (number parse true),
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
    (assert NaN (number of NaN),
    (assert Infinity (number of Infinity),
    (assert -Infinity (number of -Infinity),
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
    (assert NaN (number of "NaN"),
    (assert Infinity (number of "Infinity"),
    (assert -Infinity (number of "-Infinity"),
  ),
  (should "a date is converted to its timestamp value." (= ()
    (assert 0 (number of (date of 0),
    (assert 1 (number of (date of 1),
  ),
  (should "Other values is converted to NaN." (= ()
    (assert NaN (number of (range of 0),
    (assert NaN (number of (symbol of "X"),
    (assert NaN (number of (tuple of (@ 1 2),
    (assert NaN (number of (@),
    (assert NaN (number of (@:),
  ),
  (should "A NaN result is converted to the default value if it's provided." (= ()
    (assert 1 (number of NaN 1),
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
  (should "NaN is converted to 0." (= ()
    (assert 0 (number of-int NaN),
  ),
  (should "Infinity is converted to 0." (= ()
    (assert 0 (number of-int Infinity),
  ),
  (should "-Infinity is converted to 0." (= ()
    (assert 0 (number of-int -Infinity),
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
    (assert 0 (number of-int "NaN"),
    (assert 0 (number of-int "Infinity"),
    (assert 0 (number of-int "-Infinity"),
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
  (should "NaN: not a valid number." (= ()
    (assert false (NaN is-valid),
    (assert true (NaN is-not-valid),
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
  (should "NaN is not integer." (= ()
    (assert false (NaN is-int),
    (assert (NaN is-not-int),
  ),
  (should "Inifinite values are not integer." (= ()
    (assert false (Infinity is-int),
    (assert true (Infinity is-not-int),

    (assert false (-Infinity is-int),
    (assert true (-Infinity is-not-int),

    (assert false ((number infinity) is-int),
    (assert true ((number infinity) is-not-int),

    (assert false ((number -infinity) is-int),
    (assert true ((number -infinity) is-not-int),
  ),
  (should "Inifinite Values is not finite." (= ()
    (assert false (Infinity is-finite),
    (assert true (Infinity is-infinite),

    (assert false (-Infinity is-finite),
    (assert true (-Infinity is-infinite),

    (assert false ((number infinity) is-finite),
    (assert true ((number infinity) is-infinite),

    (assert false ((number -infinity) is-finite),
    (assert true ((number -infinity) is-infinite),
  ),
  (should "NaN is taken as a special infinite value." (= ()
    (assert false (NaN is-finite),
    (assert (NaN is-infinite),
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

    (assert NaN (NaN + 0),
    (assert NaN (NaN + 1),
    (assert NaN (NaN + -1),
    (assert NaN (0 + NaN),
    (assert NaN (1 + NaN),
    (assert NaN (-1 + NaN),

    (assert Infinity (Infinity + 0),
    (assert Infinity (Infinity + 1),
    (assert Infinity (Infinity + -1),
    (assert Infinity (0 + Infinity),
    (assert Infinity (1 + Infinity),
    (assert Infinity (-1 + Infinity),
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

    (assert NaN (NaN - 0),
    (assert NaN (NaN - 1),
    (assert NaN (NaN - -1),
    (assert NaN (0 - NaN),
    (assert NaN (1 - NaN),
    (assert NaN (-1 - NaN),

    (assert Infinity (Infinity - 0),
    (assert Infinity (Infinity - 1),
    (assert Infinity (Infinity - -1),
    (assert -Infinity (0 - Infinity),
    (assert -Infinity (1 - Infinity),
    (assert -Infinity (-1 - Infinity),
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

    (assert NaN (NaN * 0),
    (assert NaN (NaN * 1),
    (assert NaN (NaN * -1),
    (assert NaN (0 * NaN),
    (assert NaN (1 * NaN),
    (assert NaN (-1 * NaN),

    (assert NaN (Infinity * 0),
    (assert Infinity (Infinity * 1),
    (assert -Infinity (Infinity * -1),
    (assert NaN (0 * Infinity),
    (assert Infinity (1 * Infinity),
    (assert -Infinity (-1 * Infinity),
  ),
  (should "/: divide" (= ()
    (assert 0 (0 /),
    (assert 1 (1 /),
    (assert -1 (-1 /),

    (assert NaN (0 / 0),
    (assert 0 (0 / -1),
    (assert 0 (0 / -1 -1),
    (assert 0 (0 / 1),
    (assert 0 (0 / 1 1),

    (assert Infinity (1 / 0),
    (assert 1 (1 / 1),
    (assert -1 (1 / -1),

    (assert -Infinity (-1 / 0),
    (assert -1 (-1 / 1),
    (assert 1 (-1 / -1),

    (assert NaN (NaN / 0),
    (assert NaN (NaN / 1),
    (assert NaN (NaN / -1),
    (assert NaN (0 / NaN),
    (assert NaN (1 / NaN),
    (assert NaN (-1 / NaN),

    (assert Infinity (Infinity / 0),
    (assert Infinity (Infinity / 1),
    (assert -Infinity (Infinity / -1),
    (assert 0 (0 / Infinity),
    (assert 0 (1 / Infinity),
    (assert 0 (-1 / Infinity),
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
    (assert 0 (0 >> 0),
    (assert 0 (0 >> 1),
    (assert 0 (0 >> 2),

    (assert 1 (1 >> 0),
    (assert 1 (2 >> 1),
    (assert 1 (4 >> 2),

    (assert 0x80000001 (0x80000001 >> 0),
    (assert 0x40000000 (0x80000001 >> 1),
    (assert 0x20000000 (0x80000001 >> 2),
  ),
  (should "Bitwise signed right-shift: >>>" (= ()
    (assert 0 (0 >>> 0),
    (assert 0 (0 >>> 1),
    (assert 0 (0 >>> 2),

    (assert 1 (1 >>> 0),
    (assert 1 (2 >>> 1),
    (assert 1 (4 >>> 2),

    (assert (number of-bits 0x80000001) (0x80000001 >>> 0),
    (assert (number of-bits 0xC0000000) (0x80000001 >>> 1),
    (assert (number of-bits 0xE0000000) (0x80000001 >>> 2),
  ),
).

(define "Ordering Operators" (= ()
  (should "Great-Than: >" (= ()
    (assert false (0 > 0),
    (assert false (0 > 1),
    (assert true (0 > -1),
    (assert null (0 > NaN),
    (assert false (0 > Infinity),
    (assert true (0 > -Infinity),

    (assert true (1 > 0),
    (assert false (1 > 1),
    (assert true (1 > -1),
    (assert null (1 > NaN),
    (assert false (1 > Infinity),
    (assert true (1 > -Infinity),

    (assert false (-1 > 0),
    (assert false (-1 > 1),
    (assert false (-1 > -1),
    (assert null (-1 > NaN),
    (assert false (-1 > Infinity),
    (assert true (-1 > -Infinity),

    (assert true (Infinity > 0),
    (assert true (Infinity > 1),
    (assert true (Infinity > -1),
    (assert null (Infinity > NaN),
    (assert false (Infinity > Infinity),
    (assert true (Infinity > -Infinity),

    (assert false (-Infinity > 0),
    (assert false (-Infinity > 1),
    (assert false (-Infinity > -1),
    (assert null (-Infinity > NaN),
    (assert false (-Infinity > Infinity),
    (assert false (-Infinity > -Infinity),

    (assert null (NaN > 0),
    (assert null (NaN > 1),
    (assert null (NaN > -1),
    (assert false (NaN > NaN), # NaN is comparable with itself
    (assert null (NaN > Infinity),
    (assert null (NaN > -Infinity),
  ),
  (should "Great-or-Equal: >=" (= ()
    (assert true (0 >= 0),
    (assert false (0 >= 1),
    (assert true (0 >= -1),
    (assert null (0 >= NaN),
    (assert false (0 >= Infinity),
    (assert true (0 >= -Infinity),

    (assert true (1 >= 0),
    (assert true (1 >= 1),
    (assert true (1 >= -1),
    (assert null (1 >= NaN),
    (assert false (1 >= Infinity),
    (assert true (1 >= -Infinity),

    (assert false (-1 >= 0),
    (assert false (-1 >= 1),
    (assert true (-1 >= -1),
    (assert null (-1 >= NaN),
    (assert false (-1 >= Infinity),
    (assert true (-1 >= -Infinity),

    (assert true (Infinity >= 0),
    (assert true (Infinity >= 1),
    (assert true (Infinity >= -1),
    (assert null (Infinity >= NaN),
    (assert true (Infinity >= Infinity),
    (assert true (Infinity >= -Infinity),

    (assert false (-Infinity >= 0),
    (assert false (-Infinity >= 1),
    (assert false (-Infinity >= -1),
    (assert null (-Infinity >= NaN),
    (assert false (-Infinity >= Infinity),
    (assert true (-Infinity >= -Infinity),

    (assert null (NaN >= 0),
    (assert null (NaN >= 1),
    (assert null (NaN >= -1),
    (assert true (NaN >= NaN), # NaN is comparable with itself
    (assert null (NaN >= Infinity),
    (assert null (NaN >= -Infinity),
  ),
  (should "Less-Than: <" (= ()
    (assert false (0 < 0),
    (assert true (0 < 1),
    (assert false (0 < -1),
    (assert null (0 < NaN),
    (assert true (0 < Infinity),
    (assert false (0 < -Infinity),

    (assert false (1 < 0),
    (assert false (1 < 1),
    (assert false (1 < -1),
    (assert null (1 < NaN),
    (assert true (1 < Infinity),
    (assert false (1 < -Infinity),

    (assert true (-1 < 0),
    (assert true (-1 < 1),
    (assert false (-1 < -1),
    (assert null (-1 < NaN),
    (assert true (-1 < Infinity),
    (assert false (-1 < -Infinity),

    (assert false (Infinity < 0),
    (assert false (Infinity < 1),
    (assert false (Infinity < -1),
    (assert null (Infinity < NaN),
    (assert false (Infinity < Infinity),
    (assert false (Infinity < -Infinity),

    (assert true (-Infinity < 0),
    (assert true (-Infinity < 1),
    (assert true (-Infinity < -1),
    (assert null (-Infinity < NaN),
    (assert true (-Infinity < Infinity),
    (assert false (-Infinity < -Infinity),

    (assert null (NaN < 0),
    (assert null (NaN < 1),
    (assert null (NaN < -1),
    (assert false (NaN < NaN), # NaN is comparable with itself
    (assert null (NaN < Infinity),
    (assert null (NaN < -Infinity),
  ),
  (should "Less-or-Equal: <=" (= ()
    (assert true (0 <= 0),
    (assert true (0 <= 1),
    (assert false (0 <= -1),
    (assert null (0 <= NaN),
    (assert true (0 <= Infinity),
    (assert false (0 <= -Infinity),

    (assert false (1 <= 0),
    (assert true (1 <= 1),
    (assert false (1 <= -1),
    (assert null (1 <= NaN),
    (assert true (1 <= Infinity),
    (assert false (1 <= -Infinity),

    (assert true (-1 <= 0),
    (assert true (-1 <= 1),
    (assert true (-1 <= -1),
    (assert null (-1 <= NaN),
    (assert true (-1 <= Infinity),
    (assert false (-1 <= -Infinity),

    (assert false (Infinity <= 0),
    (assert false (Infinity <= 1),
    (assert false (Infinity <= -1),
    (assert null (Infinity <= NaN),
    (assert true (Infinity <= Infinity),
    (assert false (Infinity <= -Infinity),

    (assert true (-Infinity <= 0),
    (assert true (-Infinity <= 1),
    (assert true (-Infinity <= -1),
    (assert null (-Infinity <= NaN),
    (assert true (-Infinity <= Infinity),
    (assert true (-Infinity <= -Infinity),

    (assert null (NaN <= 0),
    (assert null (NaN <= 1),
    (assert null (NaN <= -1),
    (assert true (NaN <= NaN), # NaN is comparable with itself
    (assert null (NaN <= Infinity),
    (assert null (NaN <= -Infinity),
  ),
).
