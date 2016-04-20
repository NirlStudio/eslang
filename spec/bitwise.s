
($define "(Bit and a b)" (= ()
  ($should "return a one in each bit position for which the corresponding bits\
            of both operands are ones." (= ()
    (assert equal 0 (Bit and 0 1) "0 AND 1 should return 0"),
    (assert equal 0 (Bit and 1 0) "1 AND 0 should return 0"),
    (assert equal 1 (Bit and 1 1) "1 AND 1 should return 1"),
    (assert equal 0 (Bit and 0 0) "0 AND 0 should return 0"),
    (assert equal 0 (Bit and) "NaN AND NaN should return 0"),
).

($define "(Bit or a b)" (= ()
  ($should "return a one in each bit position for which the corresponding bits\
            of either or both operands are ones." (= ()
    (assert equal 1 (Bit or 0 1) "0 OR 1 should return 1"),
    (assert equal 1 (Bit or 1 0) "1 OR 0 should return 1"),
    (assert equal 1 (Bit or 1 1) "1 OR 1 should return 1"),
    (assert equal 0 (Bit or 0 0) "0 OR 0 should return 0"),
    (assert equal 0 (Bit or) "NaN OR NaN should return 0"),
).

($define "(Bit xor a b)" (= ()
  ($should "return a one in each bit position for which the corresponding bits\
            of either but not both operands are ones." (= ()
    (assert equal 1 (Bit xor 0 1) "0 XOR 1 should return 1"),
    (assert equal 1 (Bit xor 1 0) "1 XOR 0 should return 1"),
    (assert equal 0 (Bit xor 1 1) "1 XOR 1 should return 0"),
    (assert equal 0 (Bit xor 0 0) "0 XOR 0 should return 0"),
    (assert equal 0 (Bit xor) "NaN XOR NaN should return 0"),
).

($define "(Bit not a)" (= ()
  ($should "invert the bits of its operand." (= ()
    (assert equal -1 (Bit not 0) "NOT 0 should return -1"),
    (assert equal -2 (Bit not 1) "NOT 1 should return -2"),
    (assert equal 0 (Bit not -1) "NOT -1 should return 0"),
    (assert equal 1 (Bit not -2) "NOT -2 should return 1"),
    (assert equal -1 (Bit not) "NOT NaN should return -1"),
).

($define "(Bit lshift a b)" (= ()
  ($should "shift a in binary representation b (< 32) bits to the left,\
            shifting in zeroes from the right." (= ()
    (assert equal 0 (Bit lshift 0 1) "LEFT-SHIFT 0 1 should return 0"),
    (assert equal 0 (Bit lshift 0 3) "LEFT-SHIFT 0 3 should return 0"),
    (assert equal 2 (Bit lshift 1 1) "LEFT-SHIFT 1 1 should return 2"),
    (assert equal 8 (Bit lshift 1 3) "LEFT-SHIFT 1 3 should return 8"),
    (assert equal 0 (Bit lshift) "LEFT-SHIFT NaN should return 0"),
).

($define "(Bit rshift a b)" (= ()
  ($should "shift a in binary representation b (< 32) bits to the right,\
            discarding bits shifted off." (= ()
    (assert equal 0 (Bit rshift 0 1) "RIGHT-SHIFT 0 1 should return 0"),
    (assert equal 0 (Bit rshift 0 3) "RIGHT-SHIFT 0 3 should return 0"),
    (assert equal -1 (Bit rshift -1 1) "RIGHT-SHIFT -1 1 should return -1"),
    (assert equal -1 (Bit rshift -1 3) "RIGHT-SHIFT -1 3 should return -1"),
    (assert equal 1 (Bit rshift 2 1) "RIGHT-SHIFT 2 1 should return 1"),
    (assert equal 1 (Bit rshift 8 3) "RIGHT-SHIFT 8 3 should return 1"),
    (assert equal 0 (Bit rshift) "RIGHT-SHIFT NaN should return 0"),
).

($define "(Bit zrshift a b)" (= ()
  ($should "shift a in binary representation b (< 32) bits to the right,\
            discarding bits shifted off, and shifting in zeroes from the left." (= ()
    (assert equal 0 (Bit zrshift 0 1) "Zero-fill RIGHT-SHIFT 0 1 should return 0"),
    (assert equal 0 (Bit zrshift 0 3) "Zero-fill RIGHT-SHIFT 0 3 should return 0"),
    (assert equal 2147483647 (Bit zrshift -1 1) "Zero-fill RIGHT-SHIFT -1 1 should return 2147483647"),
    (assert equal 536870911 (Bit zrshift -1 3) "Zero-fill RIGHT-SHIFT -1 3 should return 536870911"),
    (assert equal 1 (Bit zrshift 2 1) "Zero-fill RIGHT-SHIFT 2 1 should return 1"),
    (assert equal 1 (Bit zrshift 8 3) "Zero-fill RIGHT-SHIFT 8 3 should return 1"),
    (assert equal 0 (Bit zrshift) "Zero-fill RIGHT-SHIFT NaN should return 0"),
).
