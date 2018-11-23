################################################################################
# Common sample data of priamry types.
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
  ((date now) - (24 * 60 60 1000),
  ((date now) + (24 * 60 60 1000),
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
  (` (null),
  (` (x),
  (` (x null),
  (` (x null 1),
  (` (x null 1 true),
  (` (x null 1 true "abc"),
  (tuple of-plain null)
  (tuple of-plain (` x),
  (tuple of-plain (` x) null)
  (tuple of-plain (` x) null 1)
  (tuple of-plain (` x) null 1 true)
  (tuple of-plain (` x) null 1 true "abc")
).

(e.g. operator
  (=? X)
  (=? X)
  (=? X null)
  (=? X (X))
  (=? X (X))
  (=? (X Y),
  (=? (X Y) null),
  (=? (X Y) (+ (X) (Y),
  (=? (X Y) (var z 100) (+ (X) (Y) z),
).

(e.g. lambda
  (= x)
  (= x)
  (= x null)
  (= x x)
  (= x x)
  (= (x y),
  (= (x y) null),
  (= (x y) (+ x y),
  (= (x y) (var z) (+ x y z),
).

(e.g. function
  (=> x)
  (=> x)
  (=> x null)
  (=> x x)
  (=> x x)
  (=> (x y),
  (=> (x y) null),
  (=> (x y) (+ x y),
  (=> (x y) (var z) (+ x y z),
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

(e.g. iterator
  (iterator of (@),
  (iterator of (@ null),
  (iterator of (@ 1 2),
  (iterator of (@ 1 2 10:10),
  (iterator of (@ 1 2 100:100),
).

(e.g. object
  (@ x: 1) (@ x: 1)
  (@:object x ) (@:object x)
  (@ x: 1 y: 2) (@ x: 1 y: 2)
  (@:object x y) (@:object x y)
).

(var spring (@:class
  z: 100
  add: (= (x y) (+ x y (this z),
).
(var summer (@:class
  z: 200
  constructor: (= z (this "z" z),
  add: (= (x y) (+ x y (this z),
).
(var autumn (@:class
  z: 400
  constructor: (= z (this "z" z),
  activator: (=) (src) (),
  add: (= (x y) (+ x y (this z),
).
(e.g. class
  spring summer autumn
).

(var winter (@:class
  z: 400
  activator: (=) (src) (this "z" (src z),
  constructor: (= z (this "z" z),
  add: (= (x y) (+ x y (this z),
).
(e.g. winter
  (winter default)
  (winter of (@ z: 401),
  (winter of (@ z: 4000),
  (@:winter z: 4001)
).

(export choose (=> matched (@
    others: (var others (@))
    target: (samples reduce (=> (target sample)
      (if ((sample the-type) is matched) sample else (others push sample) target),
).
