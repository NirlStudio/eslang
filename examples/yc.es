# the well formatted version of code.
(const YC (= f
  ((= x (x x))
    (=> x
      (f (=> y
        ((x x) y).
).
(const factorial (YC
  (= f
    (=> n
      ((n == 0) ? 1 (n * (f (n - 1).
).

# 5!
printf (factorial 5);
(print " =", # the anonymous version in full lisp style.
  (((= f ((= x (x x)) (=> x (f (=> y ((x x) y)))))) (= f (=> n ((n == 0) ? 1 (n * (f (n - 1))))))) 5)
).

# 15!
printf (factorial 15);
(print " =",
  (((= f ((= x (x x)) (=> x (f (=> y ((x x) y)))))) (= f (=> n ((n == 0) ? 1 (n * (f (n - 1))))))) 15)
).
