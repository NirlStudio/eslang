(let mVar null)

(let f1 (= (x)
  (let mVar x)
  (let fVar x)
).

($ f1 123)
($print mVar)
($print fVar)
