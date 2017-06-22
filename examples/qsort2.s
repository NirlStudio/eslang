(let data (import "sort-data").
(warn data)

(let sort (= (arr)
  (if (arr < 2) (return arr),
  (let (mid (arr 0)) (left (@)) (right (@),
  (for i in (1 : (arr length))
    (let v (arr:i),
    (((v >= mid) ? right left) push v),
  ),
  ((do left) += mid (do right),
).

(exit (sort data).
