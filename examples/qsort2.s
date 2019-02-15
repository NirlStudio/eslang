(let sort (= (data)
  (if ((data length) < 2) (return data).
  (let mid (data 0)).
  (let left (@).
  (let right (@).
  (for i in (1 (data length))
    (let v (data:i).
    (((v >= mid) ? right left) push v).
  ).
  ((do left) += mid (do right).
).

(print (let data (load "sort-data").
(sort data)
