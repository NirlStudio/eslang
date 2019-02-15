(define "(` ...)" (= ()
  (should "(`) returns (symbol empty)." (=> ()
    (assert ((`) is (symbol empty).
  ).
  (should "(` sym) returns the symbol with a key of sym." (=> ()
    (assert (symbol of "x") (` x).
    (assert (symbol of "x") (` x y).
  ).
  (should "(` value) returns the original value in the expression." (=> ()
    (assert ((` null) is null).
    (assert ((` true) is true).
    (assert ((` false) is false).

    (assert ((` 1) is 1).
    (assert ((` -1) is -1).
  ).
  (should "(` (...)) returns the tuple of (...)." (=> ()
    (assert (tuple of (`x)) (` (x).
    (assert (tuple of (`x)) (` (x) (y).
    (assert (tuple of (`x) (`y)) (` (x y) (z).
    (assert (tuple of null true false) (` (null true false).
    (assert (tuple of (`1) (`0) (`-1)) (` (1 0 -1).
  ).
).

(define "(quote ...)" (= ()
  (should "(quote) returns (tuple empty)." (=> ()
    (assert ((quote) is (tuple empty).
  ).
  (should "(quote sym) returns a tuple with the symbol of sym." (=> ()
    (assert (`(x)) (quote x).
    (assert (tuple of (`x)) (quote x).

    (assert (`(x y)) (quote x y).
    (assert (tuple of (`x) (`y)) (quote x y).
  ).
  (should "(quote value) returns a tuple with the value." (=> ()
    (assert (`(null)) (quote null).
    (assert (tuple of null) (quote null).

    (assert (`(null)) (quote null).
    (assert (tuple of true) (quote true).

    (assert (`(false)) (quote false).
    (assert (tuple of false) (quote false).

    (assert (`(1)) (quote 1).
    (assert (tuple of 1) (quote 1).

    (assert (`(-1)) (quote -1).
    (assert (tuple of -1) (quote -1).

    (assert (`((x))) (quote (x).
    (assert (tuple of (`(x))) (quote (x).
  ).
  (should "(quote ...) returns a tuple with the elements." (=> ()
    (assert (` (x y)) (quote x y).
    (assert (` ((x y))) (quote (x y)).

    (assert (` (x y z)) (quote x y z).
    (assert (` ((x y) z)) (quote (x y) z).

    (assert (`(null true false)) (quote null true false).
    (assert (`((null true false))) (quote (null true false)).

    (assert (`(1 0 -1)) (quote 1 0 -1).
    (assert (`((1 0 -1))) (quote (1 0 -1).
  ).
).

(define "(unquote ...)" (= ()
  (should "(unquote) returns (tuple blank)." (=> ()
    (assert ((unquote) is (tuple blank).
  ).
  (should "(unquote sym) returns a tuple with the symbol of sym." (=> ()
    (assert ((`(x)) as-plain) (unquote x).
    (assert ((quote x) as-plain) (unquote x).
    (assert (tuple of-plain (`x)) (unquote x).

    (assert ((`(x y)) as-plain) (unquote x y).
    (assert ((quote x y) as-plain) (unquote x y).
    (assert (tuple of-plain (`x) (`y)) (unquote x y).
  ).
  (should "(unquote value) returns a tuple with the value." (=> ()
    (assert ((`(null)) as-plain) (unquote null).
    (assert ((quote null) as-plain) (unquote null).
    (assert (tuple of-plain null) (unquote null).

    (assert ((`(true)) as-plain) (unquote true).
    (assert ((quote true) as-plain) (unquote true).
    (assert (tuple of-plain true) (unquote true).

    (assert ((`(false)) as-plain) (unquote false).
    (assert ((quote false) as-plain) (unquote false).
    (assert (tuple of-plain false) (unquote false).

    (assert ((`(1)) as-plain) (unquote 1).
    (assert ((quote 1) as-plain) (unquote 1).
    (assert (tuple of-plain 1) (unquote 1).

    (assert ((`(-1)) as-plain) (unquote -1).
    (assert ((quote -1) as-plain) (unquote -1).
    (assert (tuple of-plain -1) (unquote -1).

    (assert ((`((x))) as-plain) (unquote (x).
    (assert ((quote (x)) as-plain) (unquote (x).
    (assert (tuple of-plain (`(x))) (unquote (x).
  ).
  (should "(unquote ...) returns a tuple with the elements." (=> ()
    (assert ((`(x y)) as-plain) (unquote x y).
    (assert ((quote x y) as-plain) (unquote x y).
    (assert (tuple of-plain (`x) (`y)) (unquote x y).

    (assert ((`((x y))) as-plain) (unquote (x y).
    (assert ((quote (x y)) as-plain) (unquote (x y)).
    (assert (tuple of-plain (`(x y))) (unquote (x y).

    (assert ((`(x y z)) as-plain) (unquote x y z).
    (assert ((quote x y z) as-plain) (unquote x y z).
    (assert (tuple of-plain (`x) (`y) (`z)) (unquote x y z).

    (assert ((`((x y) z)) as-plain) (unquote (x y) z).
    (assert ((quote (x y) z) as-plain) (unquote (x y) z).
    (assert (tuple of-plain (`(x y)) (`z)) (unquote (x y) z).

    (assert ((`(null true false)) as-plain) (unquote null true false).
    (assert ((quote null true false) as-plain) (unquote null true false).
    (assert (tuple of-plain null true false) (unquote null true false).

    (assert ((`((null true) false)) as-plain) (unquote (null true) false).
    (assert ((quote (null true) false) as-plain) (unquote (null true) false).
    (assert (tuple of-plain (`(null true)) false) (unquote (null true) false).

    (assert ((`(1 0 -1)) as-plain) (unquote 1 0 -1).
    (assert ((quote 1 0 -1) as-plain) (unquote 1 0 -1).
    (assert (tuple of-plain 1 0 -1) (unquote 1 0 -1).

    (assert ((`((1 0) -1)) as-plain) (unquote (1 0) -1).
    (assert ((quote (1 0) -1) as-plain) (unquote (1 0) -1).
    (assert (tuple of-plain (`(1 0)) -1) (unquote (1 0) -1).
  ).
).
