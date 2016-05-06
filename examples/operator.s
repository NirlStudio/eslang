(operator add1
  (print code %0 " " %1 " " %2)
  (++ counter)
  (+ %0 %1).

(print code (add1 "xyz" 123).

(operator add2
  (++ counter )
  (+ %0 %1 (add1 %2 %3).

(print code (add2 1 10 100 1000 10000))
(print code counter)
