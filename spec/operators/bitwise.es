(define "(~ ...)" (= ()
  (should "(~ ) returns -1." (=> ()
    (assert -1 (~).
  ).
  (should "(~ not-a-number) returns -1." (=> ()
    (assert -1 (~ null).
    (assert -1 (~ type).

    (assert -1 (~ bool).
    (assert -1 (~ true).
    (assert -1 (~ false).

    (assert -1 (~ string).
    (assert -1 (~ "").
    (assert -1 (~ "1").

    (assert -1 (~ number).

    (assert -1 (~ date).
    (assert -1 (~ (date of 1).
    (assert -1 (~ (date of 0).
    (assert -1 (~ (date of -1).

    (assert -1 (~ range).
    (assert -1 (~ (range empty).
    (assert -1 (~ (0 10).
    (assert -1 (~ (0 10 2).

    (assert -1 (~ symbol).
    (assert -1 (~ (symbol empty).
    (assert -1 (~ (` x).

    (assert -1 (~ tuple).
    (assert -1 (~ (tuple empty).
    (assert -1 (~ (` ().
    (assert -1 (~ (` (x).
    (assert -1 (~ (` (x y).

    (assert -1 (~ operator).
    (assert -1 (~ (=?().
    (assert -1 (~ (=? X (X).

    (assert -1 (~ lambda).
    (assert -1 (~ (=().
    (assert -1 (~ (= x x).

    (assert -1 (~ function).
    (assert -1 (~ (=>().
    (assert -1 (~ (=> x x).

    (assert -1 (~ iterator).
    (assert -1 (~ (iterator of (@).
    (assert -1 (~ (iterator of (@ 1 2).

    (assert -1 (~ array).
    (assert -1 (~ (array empty).
    (assert -1 (~ (@ 1 2).
    (assert -1 (~ (@ 1 10:10 100:100).

    (assert -1 (~ object).
    (assert -1 (~ (object empty).
    (assert -1 (~ (@ x: 1).

    (assert -1 (~ class).
    (assert -1 (~ (class empty).
    (assert -1 (~ (@:class x: 1).
  ).
  (should "(~ num) applies bitwise NOT on number." (=> ()
    (var num 0x0F0F0F0F)
    (assert 0xF0F0F0F0i (~ num).
  ).
).

(define "(num &= ...)" (=> ()
  (should "(num &=) returns 0." (=> ()
    (assert 0 (0 &=).
    (assert 0 (1 &=).
    (assert 0 (-1 &=).

    (var num 1)
    (assert 0 (num &=).

    (let num 1)
    (assert 0 ((num + 10) &=).
    (assert 1 num)
  ).
  (should "(num &= mask) applies bitwise AND on num and mask." (=> ()
    (assert 0x10000000 (0x10F0F0F0 &= 0x1F0F0F0F).

    (var num 0x10F0F0F0)
    (assert 0x10000000 (num &= 0x1F0F0F0F).

    (assert 0x10000001 ((num + 1) &= 0x1F0F0F0F).
  ).
  (should "(num &= mask) sets the new value back to num if num is a symbol." (=> ()
    (var num 0x10F0F0F0)
    (assert 0x10000000 (num &= 0x1F0F0F0F).
    (assert 0x10000000 num)
  ).
).

(define "(num |= ...)" (=> ()
  (should "(num |=) returns the original value." (=> ()
    (assert 0 (0 |=).
    (assert 1 (1 |=).
    (assert -1 (-1 |=).

    (var num 1)
    (assert 1 (num |=).

    (let num 1)
    (assert 11 ((num + 10) |=).
    (assert 1 num)
  ).
  (should "(num |= mask) applies bitwise OR on num and mask." (=> ()
    (assert 0x1FFFFFFF (0x10F0F0F0 |= 0x1F0F0F0F).

    (var num 0x10F0F0F0)
    (assert 0x1FFFFFFF (num |= 0x1F0F0F0F).

    (let num 0x10F0F0F0)
    (assert 0x1FFFFFFF ((num + 1) |= 0x1F0F0F0F).
  ).
  (should "(num |= mask) sets the new value back to num if num is a symbol." (=> ()
    (var num 0x10F0F0F0)
    (assert 0x1FFFFFFF (num |= 0x1F0F0F0F).
    (assert 0x1FFFFFFF num)
  ).
).

(define "(num ^= ...)" (=> ()
  (should "(num ^=) returns the original value." (=> ()
    (assert 0 (0 ^=).
    (assert 1 (1 ^=).
    (assert -1 (-1 ^=).

    (var num 1)
    (assert 1 (num ^=).

    (let num 1)
    (assert 11 ((num + 10) ^=).
    (assert 1 num)
  ).
  (should "(num ^= mask) applies bitwise XOR on num and mask." (=> ()
    (assert 0x0FFFFFFF (0x10F0F0F0 ^= 0x1F0F0F0F).

    (var num 0x10F0F0F0)
    (assert 0x0FFFFFFF (num ^= 0x1F0F0F0F).

    (let num 0x10F0F0F0)
    (assert 0x0FFFFFFE ((num + 1) ^= 0x1F0F0F0F).
  ).
  (should "(num ^= mask) sets the new value back to num if num is a symbol." (=> ()
    (var num 0x10F0F0F0)
    (assert 0x0FFFFFFF (num ^= 0x1F0F0F0F).
    (assert 0x0FFFFFFF num)
  ).
).

(define "(num <<= ...)" (=> ()
  (should "(num <<=) returns the original value." (=> ()
    (assert 0 (0 <<=).
    (assert 1 (1 <<=).
    (assert -1 (-1 <<=).

    (var num 1)
    (assert 1 (num <<=).

    (let num 1)
    (assert 11 ((num + 10) <<=).
    (assert 1 num)
  ).
  (should "(num <<= offset) left-shifts num by <offset> bits." (=> ()
    (assert 0x0F0F0F00 (0x10F0F0F0 <<= 4).

    (var num 0x10F0F0F0)
    (assert 0x0F0F0F00 (num <<= 4).

    (let num 0x10F0F0F0)
    (assert 0x0F0F0F10 ((num + 1) <<= 4).
  ).
  (should "(num <<= offset) sets the new value back to num if num is a symbol." (=> ()
    (var num 0x10F0F0F0)
    (assert 0x0F0F0F00 (num <<= 4).
    (assert 0x0F0F0F00 num)
  ).
).

(define "(num >>= ...)" (=> ()
  (should "(num >>=) returns the original value." (=> ()
    (assert 0 (0 >>=).
    (assert 1 (1 >>=).
    (assert -1 (-1 >>=).

    (var num 1)
    (assert 1 (num >>=).

    (let num 1)
    (assert 11 ((num + 10) >>=).
    (assert 1 num)
  ).
  (should "(num >>= offset) right-shifts num by <offset> bits." (=> ()
    (assert 0xFF0F0F0Fi (0xF0F0F0F0 >>= 4).

    (var num 0xF0F0F0F0)
    (assert 0xFF0F0F0Fi (num >>= 4).

    (let num 0xF0F0F0F0)
    (assert 0xFF0F0F0Fi ((num + 1) >>= 4).
  ).
  (should "(num >>= offset) sets the new value back to num if num is a symbol." (=> ()
    (var num 0xF0F0F0F0)
    (assert 0xFF0F0F0Fi (num >>= 4).
    (assert 0xFF0F0F0Fi num)
  ).
).

(define "(num >>>= ...)" (=> ()
  (should "(num >>>=) returns the original value." (=> ()
    (assert 0 (0 >>>=).
    (assert 1 (1 >>>=).
    (assert 0xFFFFFFFF (-1 >>>=).

    (var num 1)
    (assert 1 (num >>>=).

    (let num 1)
    (assert 11 ((num + 10) >>>=).
    (assert 1 num)
  ).
  (should "(num >>>= offset) zero-fill right-shifts num by <offset> bits." (=> ()
    (assert 0x0F0F0F0Fi (0xF0F0F0F0 >>>= 4).

    (var num 0xF0F0F0F0)
    (assert 0x0F0F0F0F (num >>>= 4).

    (let num 0xF0F0F0F0)
    (assert 0x0F0F0F0F ((num + 1) >>>= 4).
  ).
  (should "(num >>>= offset) sets the new value back to num if num is a symbol." (=> ()
    (var num 0xF0F0F0F0)
    (assert 0x0F0F0F0F (num >>>= 4).
    (assert 0x0F0F0F0F num)
  ).
).
