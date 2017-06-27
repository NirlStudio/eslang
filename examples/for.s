(let counter 0)
(for (let i 10) (i < 20) (i ++)
  (counter ++).
(print "i from 10 after loop of 10 times is" i).
(print "counter is" counter).

(let counter 0)
(for i in (10 20)
  (counter ++).
(print "i in (10 20) after loop of 10 times is" i).
(print "counter is" counter).

(for (k v) in (@ x:1 y:2)
  (print k ":" v).
