
(define "(Bit and a b)" (= ()
  (should "return a one in each bit position for which the corresponding bits\
            of both operands are ones." (= ()
    (assert 0 (0 & 1),
    (assert 0 (1 & 0),
    (assert 1 (1 & 1),
    (assert 0 (0 & 0),
).

(define "(Bit or a b)" (= ()
  (should "return a one in each bit position for which the corresponding bits\
            of either or both operands are ones." (= ()
    (assert 1 (0 | 1),
    (assert 1 (1 | 0),
    (assert 1 (1 | 1),
    (assert 0 (0 | 0),
).

(define "(Bit xor a b)" (= ()
  (should "return a one in each bit position for which the corresponding bits\
            of either but not both operands are ones." (= ()
    (assert 1 (0 ^ 1),
    (assert 1 (1 ^ 0),
    (assert 0 (1 ^ 1),
    (assert 0 (0 ^ 0),
).

(define "(Bit not a)" (= ()
  (should "invert the bits of its operand." (= ()
    (assert -1 (0 ~),
    (assert -2 (1 ~),
    (assert 0 (-1 ~),
    (assert 1 (-2 ~),
).

(define "(Bit lshift a b)" (= ()
  (should "shift a in binary representation b (< 32) bits to the left,\
            shifting in zeroes from the right." (= ()
    (assert 0 (0 << 1),
    (assert 0 (0 << 3),
    (assert 2 (1 << 1),
    (assert 8 (1 << 3),
).

(define "(Bit rshift a b)" (= ()
  (should "shift a in binary representation b (< 32) bits to the right,\
            discarding bits shifted off." (= ()
    (assert 0 (0 >> 1),
    (assert 0 (0 >> 3),
    (assert 2147483647 (-1 >> 1),
    (assert 536870911 (-1 >> 3),
    (assert 1 (2 >> 1),
    (assert 1 (8 >> 3),
).

(define "(Bit zrshift a b)" (= ()
  (should "shift a in binary representation b (< 32) bits to the right,\
            discarding bits shifted off, and shifting in zeroes from the left." (= ()
    (assert 0 (0 >>> 1),
    (assert 0 (0 >>> 3),
    (assert -1 (-1 >>> 1),
    (assert -1 (-1 >>> 3),
    (assert 1 (2 >>> 1),
    (assert 1 (8 >>> 3),
).
