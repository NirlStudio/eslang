# this will be a global operator
(let r1 (operator opr1 (+ %0 %1),
(let r11 (operator opr1))
(let r12 (operator opr2))

# re-declaration will happen in module scope.
(let r2 (operator opr1 (- %0 %1),

# further re-declaration will be just ignored.
(let r21 (operator opr1 (* %0 %1),

(let r3 (operator),
(let r4 (operator 123),

($define "declaration" (= ()
  ($should "operator" "only be defined in module space" (= ()
    (assert (` (r1),
    (assert null (` (operator oprx (),
  ),
  ($should "(operator opr-name)" "return if an operator with the given name does exist." (= ()
    (assert (` (r11),
    (assert false (` (r12),
  ),
  ($should "re-declaration" "only happen once in a module" (= ()
    (assert (` (r2),
    (assert (` (r21),
    (assert 9 (` (opr1 10 1),
  ),
  ($should "declaration without a valid operator name" "return null" (= ()
    # invalid delcaration
    (assert null (` (r3),
    (assert null (` (r4),
  ),
).

(operator opr5 # (operands)
  (@ %C %V %0 %9)
).
($define "operands" (= ()
  ($should "be passed correctly" (= ()
    (let r (opr5 10 11 12 13 14 15 16 17 18 19 20 21),
    (assert 12 (` (r:0),
    (assert "array" (` (typeof (r:1),
    (assert 12 (` ((r:1) length),
    (assert 10 (` (r:2),
    (assert 19 (` (r:3),
  ),
).

(operator opr6
  (@ x y z spaceIdentifier)
).
($define "space" (= ()
  ($should "be the same one of caller" (= ()
    (let (x 100) (y 200),
    (let r (opr6)
    (assert 100 (` (r:0),
    (assert 200 (` (r:1),
    (assert null (` (r:2),
    (assert spaceIdentifier (` (r:3),
).

(operator opr7
  (@ %0 %1 %2)
).
(operator opr8
  (@ %0 %1 %2 (opr7 %3 %4 %5) %6 %7 %8 %0 %1 %2 %3 %4 %5),
).
($define "nested operators" (= ()
  ($should "each level" "have the correct operands" (= ()
    (let r (opr8 90 91 92 93 94 95 96 97 98),
    (assert 90 (` (r:0),
    (assert 91 (` (r:1),
    (assert 92 (` (r:2),
    (assert 96 (` (r:4),
    (assert 97 (` (r:5),
    (assert 98 (` (r:6),

    (assert "array" (` (typeof (r:3),
    (let r (r:3),
    (assert 93 (` (r:0),
    (assert 94 (` (r:1),
    (assert 95 (` (r:2),
).
