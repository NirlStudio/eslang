(define "(- ...)" (= ()
  (should "(- ) returns -0." (=> ()
    (assert ((-) is -0).
    (assert ((-) is-not 0).
  ).
  (should "(- 0) returns -0." (=> ()
    (assert ((- 0) is -0).
    (assert ((- 0) is-not 0).
  ).
  (should "(- -0) returns 0." (=> ()
    (assert ((- -0) is 0).
    (assert ((- -0) is-not -0).
  ).
  (should "(- a-number) returns the number's opposite number." (=> ()
    (assert ((- 1) is -1).
    (assert ((- -1) is 1).

    (assert ((- 0.5) is -0.5).
    (assert ((- -0.5) is 0.5).

    (assert ((- 1.5) is -1.5).
    (assert ((- -1.5) is 1.5).
  ).
).

(define "(++ ...)" (= ()
  (should "(++ ) returns 1." (=> ()
    (assert 1 (++).
  ).
  (should "(++ not-a-number) returns 1." (=> ()
    (assert 1 (++ null).
    (assert 1 (++ type).

    (assert 1 (++ bool).
    (assert 1 (++ true).
    (assert 1 (++ false).

    (assert 1 (++ string).
    (assert 1 (++ "").
    (assert 1 (++ "1").

    (assert 1 (++ number).

    (assert 1 (++ date).
    (assert 1 (++ (date of 1).
    (assert 1 (++ (date of 0).
    (assert 1 (++ (date of -1).

    (assert 1 (++ range).
    (assert 1 (++ (range empty).
    (assert 1 (++ (0 10).
    (assert 1 (++ (0 10 2).

    (assert 1 (++ symbol).
    (assert 1 (++ (symbol empty).
    (assert 1 (++ (` x).

    (assert 1 (++ tuple).
    (assert 1 (++ (tuple empty).
    (assert 1 (++ (` ().
    (assert 1 (++ (` (x).
    (assert 1 (++ (` (x y).

    (assert 1 (++ operator).
    (assert 1 (++ (=?().
    (assert 1 (++ (=? X (X).

    (assert 1 (++ lambda).
    (assert 1 (++ (=().
    (assert 1 (++ (= x x).

    (assert 1 (++ function).
    (assert 1 (++ (=>().
    (assert 1 (++ (=> x x).

    (assert 1 (++ iterator).
    (assert 1 (++ (iterator of (@).
    (assert 1 (++ (iterator of (@ 1 2).

    (assert 1 (++ array).
    (assert 1 (++ (array empty).
    (assert 1 (++ (@ 1 2).
    (assert 1 (++ (@ 1 10:10 100:100).

    (assert 1 (++ object).
    (assert 1 (++ (object empty).
    (assert 1 (++ (@ x: 1).

    (assert 1 (++ class).
    (assert 1 (++ (class empty).
    (assert 1 (++ (@:class x: 1).
  ).
  (should "(++ num) increases num value by 1, set the new value back to num and returns it." (=> ()
    (var num 100)
    (assert 101 (++ num).
    (assert 101 num).
  ).
  (should "(++ (expr)) increases the number value of expr by 1 and returns it." (=> ()
    (assert 101 (++ (100).
    (assert 301 (++ (100 + 200).
  ).
).

(define "(-- ...)" (= ()
  (should "(-- ) returns -1." (=> ()
    (assert -1 (--).
  ).
  (should "(-- not-a-number) returns -1." (=> ()
    (assert -1 (-- null).
    (assert -1 (-- type).

    (assert -1 (-- bool).
    (assert -1 (-- true).
    (assert -1 (-- false).

    (assert -1 (-- string).
    (assert -1 (-- "").
    (assert -1 (-- "1").

    (assert -1 (-- number).

    (assert -1 (-- date).
    (assert -1 (-- (date of 1).
    (assert -1 (-- (date of 0).
    (assert -1 (-- (date of -1).

    (assert -1 (-- range).
    (assert -1 (-- (range empty).
    (assert -1 (-- (0 10).
    (assert -1 (-- (0 10 2).

    (assert -1 (-- symbol).
    (assert -1 (-- (symbol empty).
    (assert -1 (-- (` x).

    (assert -1 (-- tuple).
    (assert -1 (-- (tuple empty).
    (assert -1 (-- (` ().
    (assert -1 (-- (` (x).
    (assert -1 (-- (` (x y).

    (assert -1 (-- operator).
    (assert -1 (-- (=?().
    (assert -1 (-- (=? X (X).

    (assert -1 (-- lambda).
    (assert -1 (-- (=().
    (assert -1 (-- (= x x).

    (assert -1 (-- function).
    (assert -1 (-- (=>().
    (assert -1 (-- (=> x x).

    (assert -1 (-- iterator).
    (assert -1 (-- (iterator of (@).
    (assert -1 (-- (iterator of (@ 1 2).

    (assert -1 (-- array).
    (assert -1 (-- (array empty).
    (assert -1 (-- (@ 1 2).
    (assert -1 (-- (@ 1 10:10 100:100).

    (assert -1 (-- object).
    (assert -1 (-- (object empty).
    (assert -1 (-- (@ x: 1).

    (assert -1 (-- class).
    (assert -1 (-- (class empty).
    (assert -1 (-- (@:class x: 1).
  ).
  (should "(-- num) decreases num value by 1, set the new value back to num and returns it." (=> ()
    (var num 100)
    (assert 99 (-- num).
    (assert 99 num).
  ).
  (should "(-- (expr)) decreases the number value of expr by 1 and returns it." (=> ()
    (assert 99 (-- (100).
    (assert 299 (-- (100 + 200).
  ).
).

(define "(num ++)" (= ()
  (should "(num ++) returns the value of num, then increases its by 1." (=> ()
    (assert 0 (0 ++).
    (assert 1 (1 ++).
    (assert -1 (-1 ++).
  ).
  (should "(num ++) sets the new value back to num if it's a symbol." (=> ()
    (var num 0)
    (assert 0 (num ++).
    (assert 1 num).

    (let num 1)
    (assert 1 (num ++).
    (assert 2 num).

    (let num -1)
    (assert -1 (num ++).
    (assert 0 num).
  ).
).

(define "(num --)" (= ()
  (should "(num --) returns the value of num, then decreases its by 1." (=> ()
    (assert 0 (0 --).
    (assert 1 (1 --).
    (assert -1 (-1 --).
  ).
  (should "(num ++) sets the new value back to num if it's a symbol." (=> ()
    (var num 0)
    (assert 0 (num --).
    (assert -1 num).

    (let num 1)
    (assert 1 (num --).
    (assert 0 num).

    (let num -1)
    (assert -1 (num --).
    (assert -2 num).
  ).
).

(define "(num += ...)" (=> ()
  (should "(num +=) returns the original value of num." (=> ()
    (assert 0 (0 +=).
    (assert 1 (1 +=).
    (assert -1 (-1 +=).

    (var num 1)
    (assert 1 (num +=).

    (let num 1)
    (assert 11 ((num + 10) +=).
    (assert 1 num)
  ).
  (should "(num += values ...) increases the value of num by values and returns the new value." (=> ()
    (assert 10 (0 += 10).
    (assert 21 (1 += 10 10).
    (assert 29 (-1 += 10 10 10).

    (var num 1)
    (assert 11 (num += 10).

    (let num 1)
    (assert 21 ((num + 10) += 10).
    (assert 1 num)
  ).
  (should "(num += values ...) sets the new value back to num if num is a symbol." (=> ()
    (var num 1)
    (assert 11 (num += 10).
    (assert 11 num)

    (let num 0)
    (assert 20 (num += 10 10).
    (assert 20 num)

    (let num -1)
    (assert 29 (num += 10 10 10).
    (assert 29 num)

    (let num (number invalid).
    (assert (number invalid) (num += 10).
    (assert (number invalid) num)
  ).
).

(define "(num -= ...)" (=> ()
  (should "(num -=) returns the original value of num." (=> ()
    (assert 0 (0 -=).
    (assert 1 (1 -=).
    (assert -1 (-1 -=).

    (var num 1)
    (assert 1 (num -=).

    (let num 1)
    (assert -9 ((num - 10) -=).
    (assert 1 num)
  ).
  (should "(num -= values ...) decreases the value of num by values and returns the new value." (=> ()
    (assert -10 (0 -= 10).
    (assert -19 (1 -= 10 10).
    (assert -31 (-1 -= 10 10 10).

    (var num 1)
    (assert -9 (num -= 10).

    (let num 1)
    (assert -89 ((num + 10) -= 100).
    (assert 1 num)
  ).
  (should "(num -= values ...) sets the new value back to num if num is a symbol." (=> ()
    (var num 1)
    (assert -9 (num -= 10).
    (assert -9 num)

    (let num 0)
    (assert -20 (num -= 10 10).
    (assert -20 num)

    (let num -1)
    (assert -31 (num -= 10 10 10).
    (assert -31 num)

    (let num (number invalid).
    (assert (number invalid) (num -= 10).
    (assert (number invalid) num)
  ).
).

(define "(num *= ...)" (=> ()
  (should "(num *=) returns the original value of num." (=> ()
    (assert 0 (0 *=).
    (assert 1 (1 *=).
    (assert -1 (-1 *=).

    (var num 1)
    (assert 1 (num *=).

    (let num 1)
    (assert 11 ((num + 10) *=).
    (assert 1 num)
  ).
  (should "(num *= values ...) multiplies the value of num by values and returns the new value." (=> ()
    (assert 0 (0 *= 10).
    (assert 100 (1 *= 10 10).
    (assert -1000 (-1 *= 10 10 10).

    (var num 1)
    (assert 10 (num *= 10).

    (let num 1)
    (assert 110 ((num + 10) *= 10).
    (assert 1 num)
  ).
  (should "(num *= values ...) sets the new value back to num if num is a symbol." (=> ()
    (var num 1)
    (assert 10 (num *= 10).
    (assert 10 num)

    (let num 0)
    (assert 0 (num *= 10 10).
    (assert 0 num)

    (let num -1)
    (assert -1000 (num *= 10 10 10).
    (assert -1000 num)

    (let num (number invalid).
    (assert (number invalid) (num *= 10).
    (assert (number invalid) num)
  ).
).

(define "(num /= ...)" (=> ()
  (should "(num /=) returns the original value of num." (=> ()
    (assert 0 (0 /=).
    (assert 1 (1 /=).
    (assert -1 (-1 /=).

    (var num 1)
    (assert 1 (num /=).

    (let num 1)
    (assert 11 ((num + 10) /=).
    (assert 1 num)
  ).
  (should "(num /= values ...) divides the value of num by values and returns the new value." (=> ()
    (assert 0 (0 /= 10).
    (assert 0.01 (1 /= 10 10).
    (assert -0.001 (-1 /= 10 10 10).

    (var num 1)
    (assert 0.1 (num /= 10).

    (let num 1)
    (assert 1.1 ((num + 10) /= 10).
    (assert 1 num)
  ).
  (should "(num /= values ...) sets the new value back to num if num is a symbol." (=> ()
    (var num 1)
    (assert 0.1 (num /= 10).
    (assert 0.1 num)

    (let num 0)
    (assert 0 (num /= 10 10).
    (assert 0 num)

    (let num -1)
    (assert -0.001 (num /= 10 10 10).
    (assert -0.001 num)

    (let num (number invalid).
    (assert (number invalid) (num /= 10).
    (assert (number invalid) num)
  ).
).

(define "(num %= ...)" (=> ()
  (should "(num %=) returns the original value of num." (=> ()
    (assert 0 (0 %=).
    (assert 1 (1 %=).
    (assert -1 (-1 %=).

    (var num 1)
    (assert 1 (num %=).

    (let num 1)
    (assert 11 ((num + 10) %=).
    (assert 1 num)
  ).
  (should "(num %= base) computes the reminder of num to base." (=> ()
    (assert 0 (0 %= 10).
    (assert 1 (1 %= 10).
    (assert 2 (12 %= 10).
    (assert 2 (102 %= 10).

    (var num 1)
    (assert 1 (num %= 10).

    (let num 1)
    (assert 4 ((num + 3) %= 10).
    (assert 1 num)
  ).
  (should "(num %= base) sets the reminder value back to num if num is a symbol." (=> ()
    (var num 1)
    (assert 1 (num %= 10).
    (assert 1 num)

    (let num 0)
    (assert 0 (num %= 10).
    (assert 0 num)

    (let num -1)
    (assert -1 (num %= 10).
    (assert -1 num)

    (let num (number invalid).
    (assert (number invalid) (num %= 10).
    (assert (number invalid) num)
  ).
).
