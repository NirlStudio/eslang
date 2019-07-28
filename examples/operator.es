(let x 100)
(let y 200)
(let z 300)

(let and (=? (a b c)
  (print "a is a symbol?" (a type).
  (print "b is a tuple?" (b type).
  (print "c is a number?" (c type).
  (print "z is a number?" (z type).
  (print "a is (`x)?" (a to-code).
  (print "b is (y + 1000)?" (b to-code).
  (print "c is 1000?" (c to-code).
  (print "z is 300?" (z to-code).
  (print "the value of a is 100?" (a).
  (print "the value of b is 1200?" (b).
  (print "the value of c is 1000?" (c).
  (print "the value of z is 300?" z).
  (let "sum" (+ (a) (b) (c) z).
  (let "x" 10)
  (var "y" 20)
  (local "z" 30)
  (print "z in opeerator's scope is 30?" z)
  (sum)
).
(and x (y + 1000) 1000).
(print "(and x (y + 1000) 1000) is" sum (sum == 2600).
(print "x is 10?" x).
(print "y is 20?" y).
(print "z in module's scope is 300?" z).
