(let data ($import "sort-data").
(print warn data)

(let swap (= (x y)
  (let t (data:x),
  (data:x (data:y),
  (data:y t)
).

(let quick (= (start end)
  (if (start >= end) (return),

  (let mid (data:end),
  (let (left start) (right (end - 1),
  (while (left < right)
    (while
      (&& ((data:left) < mid) (left < right),
      (++ left)
    ),
    (while
      (&& ((data:right) >= mid) (left < right),
      (-- right 1)
    ),
    ($swap left right)
  ),
  (if
    ((data:left) >= mid),
    ($swap left end)
    (++ left)
  ),
  ($quick start (left - 1),
  ($quick (+ left 1) end)
).

($quick 0 ((data length) - 1).
(exit data)
