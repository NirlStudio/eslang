(let i 0)
(while ((++ i) < 10).
(print "i with (++ i) is" i).

(let i 0)
(let counter 0)
(while ((i ++) < 10)
  (counter ++).
(print "i with (i ++) is" i).
(print "counter is" counter).

(let i 0)
(while ((i ++) < 10)
  (if (i == 3) (break ).
(print "i breaking at 3 is" i).

(let i 0)
(let counter 0)
(while ((i ++) < 10)
  (if (i == 3) (continue ),
  (counter ++).
(print "counter with skipping at 3 is" counter).
