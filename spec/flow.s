# prepare testing data
(let obj1 (@
  prop: 100
  add: (= (x y) (+ x y),
).
(let obj2 (@
  name: "obj2"
  obj1: obj1
  getObj: (= () (:"obj1")
).
(let obj3 (@
  name: "obj3"
  obj2: obj2
  getObj: (= () (:"obj2")
).
(let getObj3 (= () obj3).

# testing cases
($define "operator: ->" (= ()
  ($should "work correctly" (= ()
    (assert equal 100 (-> obj3 "obj2" "obj1" "prop") "failed to read property",
    (assert equal 11 (-> obj3 "obj2" "obj1" (add 10 1)) "failed to invoke method",
).

($define "keyword: flow" (= ()
  ($should "work correctly" (= ()
    (assert equal 100 (flow obj3 "obj2" "obj1" "prop") "failed to read property",
    (assert equal 11 (flow obj3 "obj2" "obj1" (add 10 1)) "failed to invoke method",
).

($define "flow evaluation" (= ()
  ($should "work correctly" (= ()
    (assert equal 100 (-> ($getObj3) "obj2" "obj1" "prop") "failed to read property",
    (assert equal 11 (-> ($getObj3) (getObj) (getObj) (add 10 1)) "failed to invoke method",
).
