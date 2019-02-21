(var sort (=> (start end)
  (if (start >= end) (return).

  var mid (data:end);
  var left start;
  var right (end - 1);
  (while (left < right)
    (while
      ((data:left) < mid:: && (left < right).
      (++ left)
    ).
    (while
      ((data:right) >= mid:: && (left < right).
      (-- right)
    ).
    (data swap left right)
  ).
  ((data:left) >= mid:: ? (data swap left end) (++ left).
  do start (left - 1);
  do (left + 1) end;
).

print (var data (load "sort-data");
sort 0 (-- (data length);
print '=> $data';
