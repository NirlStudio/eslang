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

print (factorial 5);
(print "=",
  (((= f ((= x (x x)) (=> x (f (=> y ((x x) y)))))) (= f (=> n ((n == 0) ? 1 (n * (f (n - 1))))))) 5)
).
print (factorial 15);
(print "=",
  (((= f ((= x (x x)) (=> x (f (=> y ((x x) y)))))) (= f (=> n ((n == 0) ? 1 (n * (f (n - 1))))))) 15)
).
