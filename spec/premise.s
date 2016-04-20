
(?($define "operator: ?")
  (then () ($should "work correctly" next),
  (= () ($assert true),
).

(premise
  ($define "keyword: premise")
  (then () ($should "work correctly" next),
  (= () ($assert true),
).

(?($define "explicitly call 'next'")
  (then () ($should "work correctly" next),
  (then () (assert equal 111 ($next 10 1),
  (= (x y) (+ x y 100)
).

(?($define "explicit lambda")
  ($ (=> next > () ($should "work correctly" next),
  ($ (=> add > () (assert equal 111 ($add 10 1),
  (= (x y) (+ x y 100)
).

(?($define "compound step")
  (then () ($should "work correctly" ($next 100),
  (then base > () (assert equal 111 ($($next base) 10 1),
  (=> base > (x y) (+ x y base)
).

(?($define "multiple levels: 5")
  (then () ($define "level-1" next),
  (then () ($define "level-2" next),
  (then () ($define "level-3" next),
  (then () ($define "level-4" next),
  (then () ($define "level-5" next),
  (then () ($should "work correctly" next),
  (= () ($assert true)
).
