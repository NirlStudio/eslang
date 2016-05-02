
($define "(Bit and a b)" (= ()
  ($should "return a one in each bit position for which the corresponding bits\
            of both operands are ones." (= ()
    (assert 0 (` (Bit and 0 1),
    (assert 0 (` (Bit and 1 0),
    (assert 1 (` (Bit and 1 1),
    (assert 0 (` (Bit and 0 0),
    (assert 0 (` (Bit and),
    (assert 0 (` (Bit and NaN),
    (assert 0 (` (Bit and NaN NaN),
).

($define "(Bit or a b)" (= ()
  ($should "return a one in each bit position for which the corresponding bits\
            of either or both operands are ones." (= ()
    (assert 1 (` (Bit or 0 1),
    (assert 1 (` (Bit or 1 0),
    (assert 1 (` (Bit or 1 1),
    (assert 0 (` (Bit or 0 0),
    (assert 0 (` (Bit or),
    (assert 0 (` (Bit or NaN),
    (assert 0 (` (Bit or NaN NaN),
).

($define "(Bit xor a b)" (= ()
  ($should "return a one in each bit position for which the corresponding bits\
            of either but not both operands are ones." (= ()
    (assert 1 (` (Bit xor 0 1),
    (assert 1 (` (Bit xor 1 0),
    (assert 0 (` (Bit xor 1 1),
    (assert 0 (` (Bit xor 0 0),
    (assert 0 (` (Bit xor),
    (assert 0 (` (Bit xor NaN),
    (assert 0 (` (Bit xor NaN NaN),
).

($define "(Bit not a)" (= ()
  ($should "invert the bits of its operand." (= ()
    (assert -1 (` (Bit not 0),
    (assert -2 (` (Bit not 1),
    (assert 0 (` (Bit not -1),
    (assert 1 (` (Bit not -2),
    (assert -1 (` (Bit not),
    (assert -1 (` (Bit not NaN),
).

($define "(Bit lshift a b)" (= ()
  ($should "shift a in binary representation b (< 32) bits to the left,\
            shifting in zeroes from the right." (= ()
    (assert 0 (` (Bit lshift 0 1),
    (assert 0 (` (Bit lshift 0 3),
    (assert 2 (` (Bit lshift 1 1),
    (assert 8 (` (Bit lshift 1 3),
    (assert 0 (` (Bit lshift),
    (assert 0 (` (Bit lshift NaN),
    (assert 0 (` (Bit lshift NaN NaN),
).

($define "(Bit rshift a b)" (= ()
  ($should "shift a in binary representation b (< 32) bits to the right,\
            discarding bits shifted off." (= ()
    (assert 0 (` (Bit rshift 0 1),
    (assert 0 (` (Bit rshift 0 3),
    (assert -1 (` (Bit rshift -1 1),
    (assert -1 (` (Bit rshift -1 3),
    (assert 1 (` (Bit rshift 2 1),
    (assert 1 (` (Bit rshift 8 3),
    (assert 0 (` (Bit rshift),
    (assert 0 (` (Bit rshift NaN),
    (assert 0 (` (Bit rshift NaN NaN),
).

($define "(Bit zrshift a b)" (= ()
  ($should "shift a in binary representation b (< 32) bits to the right,\
            discarding bits shifted off, and shifting in zeroes from the left." (= ()
    (assert 0 (` (Bit zrshift 0 1),
    (assert 0 (` (Bit zrshift 0 3),
    (assert 2147483647 (` (Bit zrshift -1 1),
    (assert 536870911 (` (Bit zrshift -1 3),
    (assert 1 (` (Bit zrshift 2 1),
    (assert 1 (` (Bit zrshift 8 3),
    (assert 0 (` (Bit zrshift),
    (assert 0 (` (Bit zrshift NaN),
    (assert 0 (` (Bit zrshift NaN NaN),
).
