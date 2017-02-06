(let gVar null)
(let lVar null)
(var vVar 1)

(let f1 (= (x)
  (let gVar x)
  (var lVar x)
  (+= vVar 2)
).

(f1 123)
(print gVar)
(print lVar)
(print vVar)
