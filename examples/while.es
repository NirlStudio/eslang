(while ((++ i) < 10).
(print "i with (++ i) is 10?" i).

(let i 0)
(let counter 0)
(while ((i ++) < 10)
  (counter ++)
).
(print "i with (i ++) is 11?" i).
(print "counter is 10?" counter).

(let i 0)
(while ((i ++) < 10)
  (if (i == 3) (break )
).
(print "i breaking at 3 is 3?" i).

(let i 0)
(let counter 0)
(while ((i ++) < 10)
  (if (i == 3) (continue ).
  (counter ++)
).
(print "counter with skipping at 3 is 9?" counter).
