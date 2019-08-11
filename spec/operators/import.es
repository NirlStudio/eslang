(define "(import ...)" (=> ()
  (should "(import) returns null." (= ()
    (assert null (import).
  ).
  (should "(import \"module\") returns an object with all exports." (=> ()
    (var mod (import "./_module").
    (assert 1 (mod x).
    (assert 2 (mod y).
    (assert 3 (mod z).

    (assert 10 (mod p).
    (assert 10 (mod q).

    (assert ($(mod "l") is-a lambda).
    (assert ($(mod "f") is-a function).

    (assert 101 (mod a).
    (assert 102 (mod b).
    (assert null (mod c).

    (assert null (mod -a).
    (assert null (mod _b).
  ).
  (should "(import field from \"module\") returns the value of field." (=> ()
    (var y (import y from "./_module").
    (assert 2 y)

    (var p (import p from "./_module").
    (assert 10 p)

    (var b (import b from "./_module").
    (assert 102 b)
  ).
  (should "(import (fields ...) from \"module\") returns the values of fields as an array." (=> ()
    (var (y p b) (import (y p b) from "./_module").
    (assert 2 y)
    (assert 10 p)
    (assert 102 b)
  ).
).
