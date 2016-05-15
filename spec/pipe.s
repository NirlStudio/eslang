# prepare data
(let step1 (= (x) (* x x).
(let step2 (= (count)
  (let list (@),
  (let i 1)
  (for (i <= count) (++ i)
    (list push i)
  ),
  (return count list)
).
(let step3 (= (count list)
  (let sum 0)
  (-- count)
  (for (count >= 0) (-- count)
    (+= sum (list:count),
).

# testing cases
($define "operator: |" (= ()
  ($should "work correctly" (= ()
    (assert 9 (` (| 3 ($step1 ),
).

($define "keyword: pipe" (= ()
  ($should "work correctly" (= ()
    (assert 9 (` (pipe 3 ($step1 ),
).

($define "data pipeline" (= ()
  ($should "work correctly" (= ()
    (assert 45 (` (pipe ($step1 3) ($step2 ) ($step3 ),
).
