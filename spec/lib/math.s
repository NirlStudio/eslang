(define "math constants" (= ()
  (should "(math e)" (= ()
    assert (math e:: is-a number);
    assert (math abs (math e:: - 2.7182818):: < 0.0000001);
  ).
  (should "(math pi)" (= ()
    assert (math pi:: is-a number);
    assert (math abs (math pi:: - 3.1415926):: < 0.0000001);
  ).
  (should "(math ln2)" (= ()
    assert (math ln2:: is-a number);
    assert (math abs (math ln 2:: - (math ln2)):: < 0.0000001);
  ).
  (should "(math ln10)" (= ()
    assert (math ln10:: is-a number);
    assert (math abs (math ln 10:: - (math ln10)):: < 0.0000001);
  ).
  (should "(math log2-e)" (= ()
    assert (math log2-e:: is-a number);
    assert (math abs (math log2 (math e):: - (math log2-e)):: < 0.0000001);
  ).
  (should "(math log-e)" (= ()
    assert (math log-e:: is-a number);
    assert (math abs (math log10 (math e):: - (math log-e)):: < 0.0000001);
  ).
  (should "(math sqrt-2)" (= ()
    assert (math sqrt-2:: is-a number);
    assert (math abs (math sqrt 2:: - (math sqrt-2)):: < 0.0000001);
  ).
  (should "(math sqrt-1/2)" (= ()
    assert (math sqrt-1/2:: is-a number);
    assert (math abs (math sqrt 0.5:: - (math sqrt-1/2)):: < 0.0000001);
  ).
).

(define "math functions" (= ()
  (should "(math sin x)" (= ()
    assert (math "sin":: is-a lambda);
    assert (math sin:: is-a number);
    assert (math sin 1:: is-a number);
  ).
  (should "(math cos x)" (= ()
    assert (math "cos":: is-a lambda);
    assert (math cos:: is-a number);
    assert (math cos 1:: is-a number);
  ).
  (should "(math tan x)" (= ()
    assert (math "tan":: is-a lambda);
    assert (math tan:: is-a number);
    assert (math tan 1:: is-a number);
  ).
  (should "(math asin x)" (= ()
    assert (math "asin":: is-a lambda);
    assert (math asin:: is-a number);
    assert (math asin 1:: is-a number);
  ).
  (should "(math acos x)" (= ()
    assert (math "acos":: is-a lambda);
    assert (math acos:: is-a number);
    assert (math acos 1:: is-a number);
  ).
  (should "(math atan x)" (= ()
    assert (math "atan":: is-a lambda);
    assert (math atan:: is-a number);
    assert (math atan 1:: is-a number);
  ).
  (should "(math atan2 x)" (= ()
    assert (math "atan2":: is-a lambda);
    assert (math atan2:: is-a number);
    assert (math atan2 1:: is-a number);
  ).
  (should "(math exp x)" (= ()
    assert (math "exp":: is-a lambda);
    assert (math exp:: is-a number);
    assert 1 (math exp 0);
    assert 1 (math exp -0);
    assert (math e) (math exp 1);
  ).
  (should "(math pow base exp)" (= ()
    assert (math "pow":: is-a lambda);
    assert (math pow:: is-a number);
    assert (math pow 1:: is-a number);
    assert (math pow 2 2:: is 4);
  ).
  (should "(math ln x)" (= ()
    assert (math "ln":: is-a lambda);
    assert (math ln:: is-a number);
    assert (math ln (math e):: is 1);
  ).
  (should "(math log x)" (= ()
    assert (math "log":: is-a lambda);
    assert (math log:: is-a number);
    assert (math log 100:: is 2);
  ).
  (should "(math log2 x)" (= ()
    assert (math "log2":: is-a lambda);
    assert (math log2:: is-a number);
    assert (math log2 4:: is 2);
  ).
  (should "(math sqrt x)" (= ()
    assert (math "sqrt":: is-a lambda);
    assert (math sqrt:: is-a number);
    assert (math sqrt 4:: is 2);
  ).
  (should "(math abs x)" (= ()
    assert (math "abs":: is-a lambda);
    assert (math abs:: is-a number);
    assert (math abs 1:: is 1);
    assert (math abs -1:: is 1);
    assert (math abs 0:: is 0);
  ).
  (should "(math max x ...)" (= ()
    assert (math "max":: is-a lambda);
    assert (math max:: is-a number);
    assert (math max 1:: is 1);
    assert (math max 1 2:: is 2);
    assert (math max 1 2 3:: is 3);
  ).
  (should "(math min x ...)" (= ()
    assert (math "min":: is-a lambda);
    assert (math min:: is-a number);
    assert (math min 1:: is 1);
    assert (math min 1 2:: is 1);
    assert (math min 1 2 3:: is 1);
  ).
  (should "(math random)" (= ()
    assert (math "random":: is-a lambda);
    assert (math random:: is-a number);
    assert (math random:: >= 0);
    assert (math random:: >= 0);
    assert (math random:: >= 0);
    assert (math random:: < 1);
    assert (math random:: < 1);
    assert (math random:: < 1);
  ).
).

(define "(max ...) - a general max function" (= ()
  (should "(max ) returns null" (= ()
    assert null (max);
    assert null (max null);
    assert null (max null null);
  ).
  (should "(max x y ...) returns the explicit largest one from left to right." (= ()
    assert 1 (max 1);
    assert 1 (max null 1);
    assert 2 (max 1 2);
    assert 2 (max null 1 2);
    assert 2 (max 1 null 2);
    assert 2 (max 1 2 null);
    assert 3 (max 1 2 null 3);
    assert 3 (max null 1 2 3);
  ).
).

(define "(min ...) - a general min function" (= ()
  (should "(min ) returns null" (= ()
    assert null (min);
    assert null (min null);
  ).
  (should "(min x y ...) returns the explicit largest one from left to right." (= ()
    assert 1 (min 1);
    assert 1 (min null 1);
    assert 1 (min 1 2);
    assert 1 (min null 1 2);
    assert 1 (min 1 null 2);
    assert 1 (min 1 2 null);
    assert -1 (min 1 2 null 3 -1);
    assert -1 (min null 1 2 3 -1);
  ).
).
