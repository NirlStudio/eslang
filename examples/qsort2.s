(let data (load "sort-data").
(warn data)

(let sort (= (arr)
  (if ((arr length) < 2) (return arr),
  (let mid (arr:0)),
  (let left (@),
  (let right (@),
  (for i in (1 (arr length))
    (let v (arr:i),
    (((v >= mid) ? right left) push v)
  ),
  ((do left) += mid (do right),
).

(sort data)
