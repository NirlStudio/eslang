(var sort (= (data)
  (if (data length:: < 2) (return data).

  var mid (data 0);
  var left (@);
  var right (@);
  (for i in (1, (data length))
    var v (data:i);
    (v >= mid:: ? right left) push v;
  ).
  (do left) += mid (do right);
).

print (let data (load "./sort-data");
print '=> $(sort data)';
