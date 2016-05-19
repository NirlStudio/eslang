(let data (it import "sort-data").
(print warn data)

(let sort (= (arr)
  (if (arr < 2) (return arr),

  (let (mid (arr 0)) (left (@)) (right (@),
  (for i in (1 (arr length))
    (let v (arr:i),
    (((v >= mid) ? right left) push v),
  ),
  ((it do left) concat (@mid) (it do right),
).

(exit (it sort data).
