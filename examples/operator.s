(operator add1
  (print %0 " " %1 " " %2)
  (++ counter)
  (+ %0 %1).

(print (add1 "xyz" 123).

(operator export add2
  (++ counter )
  (+ %0 %1 (add1 %2 %3).

(print (add2 1 10 100 1000 10000))
(print counter)

(operator export add3
  (+ 100 %0 %1).
(print (add3 10 1).

(operator add3
  (+ 10000 %0 %1).

(operator add3
  (+ 1000000 %0 %1).

(print (add3 10 1).

(operator opr5 # (operands)
  (@ %C %V %0 %9)
).

(let r (opr5 10 11 12 13 14 15 16 17 18 19 20 21).
(print r)
(print (r:0).
