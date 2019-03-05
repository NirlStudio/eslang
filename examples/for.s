(let counter 0)
(for (let i 10) (i < 20) (i ++)
  (counter ++)
).
(print "i from 10 after loop of 10 times is" i (i == 20).
(print "counter is" counter (counter == 10).

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
