
(let sum (= (x base)
  ((x <= 1) ?
    (x + base).
    (redo (x - 1) (x + base)
).

(print "sum 1" (sum 1).
(print "sum 2" (sum 2).
(print "sum 3" (sum 3).
(print "sum 10" (sum 10).
(print "sum 100" (sum 100).
(print "sum 1000" (sum 1000).
(print "sum 10000" (sum 10000).
(print "sum 100000" (sum 100000).
