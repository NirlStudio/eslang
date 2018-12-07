(define "(import ...)" (=> ()
  (should "(import) returns null." (= ()
    (assert null (import),
  ),
  (should "(import \"module\") returns an object with all exports ." (=> ()
    (print -module)
    (var mod (import "_module"),
    (assert 1 (mod x),
    (assert 2 (mod y),
    (assert 3 (mod z),

    (assert 10 (mod p),
    (assert 10 (mod q),

    (assert (:(mod "l") is-a lambda),
    (assert (:(mod "f") is-a function),

    (assert 101 (mod a),
    (assert 102 (mod b),
    (assert null (mod c),
  ),
),
