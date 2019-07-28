################################################################################
# Common sample data of primary types.
################################################################################
(export samples (@).
(let e.g. (=> (a-type value ...)
  (samples push (@
    the-type: a-type
    empty: (a-type empty)
    values: (arguments slice 1)
).

(e.g. bool true)
(e.g. string
  " " "\t" "\n"
  "a" "ab" "abc"
  "A" "AB" "ABC"
).
(e.g. number
  -0
  0.5 -0.5
  1 -1 100 -100
  (number smallest)
  (number min) (number max)
  (number min-int) (number max-int)
  (number min-bits) (number max-bits)
  (number -infinite) (number infinite)
  (number invalid)
).
(e.g. date
  (date of 1)
  (date of -1)
  (date of 100)
  (date of -100)
  (date invalid)
  (date now)
  ((date now) - (24 * 60 60 1000).
  ((date now) + (24 * 60 60 1000).
).
(e.g. range
  (0 10) (0 10 2) (0 10 -2)
  (1 10) (1 10 2) (1 10 -2)
  (0 -10) (0 -10 -2) (0 -10 2)
  (-1 -10) (-1 -10 -2) (-1 -10 2)
  (-10 10) (-10 10 2) (-10 10 -2)
  (10 -10) (10 -10 -2) (10 -10 2)
).
(e.g. symbol
  (` x) (` x1)
  (` x-) (` -x) (` x-1)
  (` x_) (` _x) (` x_1)
).

(e.g. tuple
  (` (null).
  (` (x).
  (` (x null).
  (` (x null 1).
  (` (x null 1 true).
  (` (x null 1 true "abc").
  (unquote null)
  (unquote (` x).
  (unquote (` x) null)
  (unquote (` x) null 1)
  (unquote (` x) null 1 true)
  (unquote (` x) null 1 true "abc")
).

(e.g. operator
  (=? X)
  (=? X)
  (=? X null)
  (=? X (X))
  (=? X (X))
  (=? (X Y).
  (=? (X Y) null).
  (=? (X Y) (+ (X) (Y).
  (=? (X Y) (var z 100) (+ (X) (Y) z).
).

(e.g. lambda
  (= x)
  (= x)
  (= x null)
  (= x x)
  (= x x)
  (= (x y).
  (= (x y) null).
  (= (x y) (+ x y).
  (= (x y) (var z) (+ x y z).
).

(e.g. function
  (=> x)
  (=> x)
  (=> x null)
  (=> x x)
  (=> x x)
  (=> (x y).
  (=> (x y) null).
  (=> (x y) (+ x y).
  (=> (x y) (var z) (+ x y z).
).

(e.g. iterator
  (iterator of (@).
  (iterator of (@ null).
  (iterator of (@ 1 2).
  (iterator of (@ 1 2 10:10).
  (iterator of (@ 1 2 100:100).
).

(e.g. promise
  (promise of false).
  (promise of 1).
  (promise of 1 2).
  (promise of (@ false).
  (promise of (@ true).
  (promise of (@ true false).
  (promise of (= async
    (timer timeout 100 (=>()
      async resolve 100;
    ).
  ).
  (promise of (= async
    (timer timeout 200 (=>()
      async reject 200;
    ).
  ).
).

(e.g. array
  (@ null) (@ null)
  (@ 1) (@ 1)
  (@ 10:10) (@ 100:100)
  (@ 1 10:10) (@ 1 10:10)
  (@ 1 100:100) (@ 1 100:100)
  (@ 1 2) (@ 1 2)
  (@ 1 2 100:100) (@ 1 2 100:100)
  (@ 1 2 true "x" (@) (@ x:1) 100:100)
).

(e.g. object
  (@ x: 1) (@ x: 1)
  (@:@ x ) (@:@ x)
  (@ x: 1 y: 2) (@ x: 1 y: 2)
  (@:object x y) (@:object x y)
).

(var spring (@:class
  z: 100
  add: (= (x y) (+ x y (this z).
).
(var summer (@:class type: null
  z: 200
  constructor: (= z (this "z" z).
  add: (= (x y) (+ x y (this z).
).
(var autumn (@:class type: (@ x: 1)
  z: 400
  constructor: (= z (this "z" z).
  activator: (=) (src) ().
  add: (= (x y) (+ x y (this z).
).
(var winter (@:class
  type: (@
    x: 1
    add: (= (x y) (+ x y).
  ).
  z: 400
  activator: (=) (src) (this "z" (src z).
  constructor: (= z (this "z" z).
  add: (= (x y) (+ x y (this z).
).
(e.g. class
  spring summer autumn winter
).

(export choose (=> (matched values) (@
    others: (var others (@))
    target: (samples reduce
      (@ the-type: matched
        empty: (matched empty)
        values: (values ?? (@).
      ).
      (=> (target sample)
        (if ((sample the-type) is matched)
          sample
        else
          (if (matched is-not-a (sample the-type)) (others push sample).
          target
).
