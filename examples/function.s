(let z 100)
(let and (=> (x y) (+ x y z).

(let sum (and 111 222).
(print "(and 111 222)" sum (sum == 433).

(let x-and (=> y
  (=> x (+ x y z)
).
(let and300 (x-and 200).
(let and1100 (x-and 1000).

(let sum1 (and300 300).
(let sum2 (and1100 400).
(print "(and300 300)" sum1 (sum1 == 600).
(print "(and1100 400)" sum2 (sum2 == 1500).

# instant evaluation
(print "(=> :() (10 + z)) is" (=> :() (10 + z).
(print "(=>(1 2) :(x y) (+ x y z) is" (=> (1 2) :(x y) (+ x y z).
