################################################################################
# Common sample data of priamry types.
################################################################################
(export samples (@).
(let e.g. (=> (a-type a-value ...)
  (samples push (@
    the-type: a-type
    empty: (a-type empty)
    values: (arguments slice 1)
).

(e.g. bool true)
(e.g. string
  "a" "ab" "abc"
  "A" "AB" "ABC"
).
(e.g. number
  0.5 -0.5
  1 -1 100 -100
  (number min) (number max)
  (number min-int) (number max-int)
  (number min-bits) (number max-bits)
  (number infinite) (number -infinite)
  (number invalid)
).
(e.g. date
  (date of -100000)
  (date now)
  ((date now) - (* 24 60 60 1000),
  ((date now) + (* 24 60 60 1000),
).
(e.g. range
  (0 10) (0 10 2) (0 10 -2)
  (1 10) (1 10 2) (1 10 -2)
  (0 -10) (0 -10 -2) (0 -10 2)
  (-1 -10) (-1 -10 -2) (-1 -10 2)
  (-10 10) (-10 10 2) (-10 10 -2)
  (10 -10) (10 -10 -2) (10 -10 2)
).
(e.g. symbol (` x) (` x1) (` x1-).
(e.g. tuple (` (x)) (` (x 1)) (` (x 1 true)) (` (x 1 true "abc").

(e.g. operator (=? (X Y) (+ (X) (Y).
(e.g. lambda (= (x y) (+ x y).
(e.g. function (=> (x y) (+ x y z).

(e.g. array (@ 1) (@ 1 2).
(e.g. object (@ x: 1) (@ x: 1 y: 2).

(var summer (@:class
  z: 100
  add: (= (x y) (+ x y (this z),
).
(e.g. class summer)
(e.g. summer
  (summer default)
  (summer of (@ z: 1000),
).

(export choose (=> matched (@
    others: (var others (@))
    target: (collect samples (=> (target sample)
      (if ((sample the-type) is matched) sample else (others push sample) target),
).
