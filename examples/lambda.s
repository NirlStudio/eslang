(let z 100)
(let and (= (x y) (+ x y z).

(let sum (and 111 222).
(print "(and 111 222):" sum (sum == 333).

(let x-and (= y
  (= x (+ x y z)
).
(let and0 (x-and 1000).
(let sum (and0 111).
(print "(and0 111)" sum (sum == 111).

(let x-and (= y
  (=> x (+ x y z)
).
(let and100 (x-and 100).
(let sum (and100 111).
(print "(and100 111)" sum (sum == 211).

(let x-and (=> y
  (= x (+ x y z)
).
(let and0 (x-and 1000).
(let sum (and0 222).
(print "(and0 222)" sum (sum == 222).

# instant evaluation
(print "(= :() (10 + z)) is" (= :() (10 + z).
(print "(=(1 2) :(x y) (+ x y) is" (= (1 2) :(x y) (+ x y).
