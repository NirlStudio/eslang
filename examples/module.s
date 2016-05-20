(let mVar null)
(let mVar null)

(let f1 (= (x)
  (global mVar x)
  (let fVar x)
).

(f1 123)
(print value mVar)
(print value fVar)
