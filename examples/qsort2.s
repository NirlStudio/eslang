(let data ($import "sort-data").
(print warn data)

(let quick (= (arr)
  (if (< (arr length) 2) (return arr),

  (let (mid (arr:0)) (left (@)) (right (@),
  (for i in ($range 1 (arr length))
    (let v (arr:i),
    ((if (>= v mid) right left) push v),
  ),
  (($quick left) concat (@mid) ($quick right),
).

($quick data)
