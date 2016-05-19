(let data (to import "sort-data").
(print warn data)

(let sort (= (start end)
  (if (start >= end) (return),

  (let mid (data:end),
  (let (left start) (right (end - 1),
  (while (left < right)
    (while
      (((data:left) < mid) && (left < right),
      (++ left)
    ),
    (while
      (((data:right) >= mid) && (left < right),
      (-- right)
    ),
    (data swap left right)
  ),
  (if
    ((data:left) >= mid),
    (data swap left end)
    (++ left)
  ),
  (to do start (left - 1),
  (to do (left + 1) end)
).

(to sort 0 ((data length) - 1).
(exit data)
