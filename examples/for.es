(let counter 0)
(for (10, 20, 5)
  (counter ++)
).
(print "_ from 10 after loop of 2 times by 5 is" _ (_ == 15).
(print "counter is" counter (counter == 2).

(let counter 0)
(for i in (10 20)
  (counter ++)
).
(print "i in (10 20) after loop of 10 times is" i (i == 19).
(print "counter is" counter (counter == 10).

(let counter 0)
(for (k v) in (@ x:1 y:2)
  (counter ++)
  (print k ":" v)
).
(print "counter is" counter (counter == 2).
