(var falsy-values (@ 0 -0 null false).
(var truthy-values (@
  bool true
  string "" " " "0" "null" "false"
  number -1 1 (number invalid) (number max) (number min) (number smallest)
  date (date of 0) (date of -1) (date of 1)
  range (range empty) (1 10)
  symbol (symbol empty) (` x)
  tuple (tuple empty) (` ()) (` (null)) (` (false)) (` (x y z).
  operator (operator empty) (=? X) (=? X null) (=? X (X).
  lambda (lambda empty) (= x) (= x null) (= x x)
  function (function empty) (=> x) (=> x null) (=> x x)
  array (array empty) (@) (@ null) (@ 1) (@ 10:10) (@ 1 10:10)
  iterator (iterator empty)
  (iterator of (@).
  (iterator of (@ null).
  (iterator of (@ 1 2).
  object (object empty) (@:) (@ x: null) (@:@ x ) (@ x: 1 y: 2)
  class (class empty)
  ((class empty) empty).
).

(define "falsy and truthy values" (=> ()
  (should "0 and -0 are falsy values." (= ()
    (assert ((if 0 true else false) is false).
    (assert ((if -0 true else false) is false).
  ).
  (should "null is a falsy value." (= ()
    (assert ((if null true else false) is false).
  ).
  (should "false is a falsy value." (= ()
    (assert ((if false true else false) is false).
  ).
  (should "all other values are truthy values." (=> ()
    (for value in truthy-values
      (assert ((if value true else false) is true).
    ).
  ).
).

(define "(! ...) - Logical NOT" (=> ()
  (should "(!) returns false." (= ()
    (assert ((!) is false).
  ).
  (should "(! falsy-value) returns true." (=> ()
    (for value in falsy-values
      (assert ((! value) is true).
    ).
  ).
  (should "(! truthy-value) returns false." (=> ()
    (for value in truthy-values
      (assert ((! value) is false).
    ).
  ).
  (should "operator 'not' is an alias of '!'." (=> ()
    (assert ((not) is false).
    (for value in falsy-values
      (assert ((not value) is true).
    ).
    (for value in truthy-values
      (assert ((not value) is false).
    ).
  ).
).

(define "(value && ...) - logical AND" (=> ()
  (should "(value &&) returns the value." (=> ()
    (for value in falsy-values
      (assert ((value &&) is value).
      (assert (($value &&) is value).
    ).
    (for value in truthy-values
      (assert ($($value &&) is value).
    ).
  ).
  (should "(falsy-value && values ...) returns the falsy-value." (=> ()
    (for value in falsy-values
      (assert ((value && true) is value).
      (assert ((value && true false) is value).
      (assert ((value && false) is value).
      (assert ((value && false true) is value).

      (assert (($value && true) is value).
      (assert (($value && true false) is value).
      (assert (($value && false) is value).
      (assert (($value && false true) is value).
    ).
  ).
  (should "(truthy-value && values ...) returns the first falsy-value." (=> ()
    (for value in truthy-values
      (for falsy-value in falsy-values
        (assert (($value && falsy-value) is falsy-value).
        (assert (($value && true falsy-value false) is falsy-value).
        (assert (($value && true false falsy-value) is false).
      ).
    ).
  ).
  (should "(truthy-value && values ...) returns the last truthy-value if no falsy value exists in values." (=> ()
    (for value in truthy-values
      (for truthy-value in truthy-values
        (assert ($($value && truthy-value) is truthy-value).
        (assert ($($value && true truthy-value) is truthy-value).
        (assert ($($value && true true truthy-value) is truthy-value).
      ).
    )
  ).
  (should "(value \"and\") is an alias of (value \"&&\")." (=> ()
    (for value in (falsy-values + truthy-values)
      (assert ($value "and":: is ($value "&&").
  ).
).

(define "(value || ...) - logical OR" (=> ()
  (should "(value ||) returns the value." (=> ()
    (for value in falsy-values
      (assert ((value ||) is value).
      (assert (($value ||) is value).
    ).
    (for value in truthy-values
      (assert ($($value ||) is value).
    ).
  ).
  (should "(truthy-value || values ...) returns the truthy-value." (=> ()
    (for value in truthy-value
      (assert ($($value && true) is value).
      (assert ($($value && true false) is value).
      (assert ($($value && false) is value).
      (assert ($($value && false true) is value).
    ).
  ).
  (should "(falsy-value || values ...) returns the first truthy-value." (=> ()
    (for value in falsy-values
      (for truthy-value in truthy-values
        (assert ($($value || truthy-value) is truthy-value).
        (assert ($($value || false truthy-value true) is truthy-value).
        (assert ($($value || false true truthy-value) is true).
      ).
    ).
  ).
  (should "(falsy-value || values ...) returns the last falsy-value if no truthy value exists in values." (=> ()
    (for value in falsy-values
      (for falsy-value in falsy-values
        (assert ($($value || falsy-value) is falsy-value).
        (assert ($($value || false falsy-value) is falsy-value).
        (assert ($($value || false false falsy-value) is falsy-value).
      ).
    ).
  ).
  (should "(value \"or\") is an alias of (value \"||\")." (=> ()
    (for value in (falsy-values + truthy-values)
      (assert ($value "or":: is ($value "||").
  ).
).

(define "(value ? ...) - boolean test" (=> ()
  (define "(a ?) - booleanize" (=> ()
    (should "(falsy-value ?) returns false." (=> ()
      (assert ((0 ?) is false).
      (for value in falsy-values
        (assert ((value ?) is false).
      ).
    ).
    (should "(truthy-value ?) returns true." (=> ()
      (assert ((1 ?) is true).
      (for value in truthy-values
        (assert (($value ?) is true).
      ).
    ).
  ).
  (define "(a ? b) - boolean fallback" (=> ()
    (should "(falsy-value ? value) returns the value." (=> ()
      (for value in (falsy-values + truthy-values)
        (for falsy-value in falsy-values
          (assert ($(falsy-value ? value) is value).
      ).
    ).
    (should "(truthy-value ? value) returns the truthy-value." (=> ()
      (for value in (falsy-values + truthy-values)
        (for truthy-value in truthy-values
          (assert ($($truthy-value ? value) is truthy-value).
      ).
    ).
  ).
  (define "(a ? b c) - boolean switch" (=> ()
    (should "(falsy-value ? b c) returns the value of c." (=> ()
      (for value in (falsy-values concat truthy-values)
        (for falsy-value in falsy-values
          (assert ($(falsy-value ? 100 value) is value).
      ).
    ).
    (should "(truthy-value ? b c) returns the value of b." (=> ()
      (for value in (falsy-values + truthy-values)
        (for truthy-value in truthy-values
          (assert ($($truthy-value ? value 100) is value).
      ).
    ).
  ).
).

(var empties (@
  null 0 -0 false
  "" (number invalid) (date of 0) (range empty) (symbol empty)
  (tuple empty) (` ())
  (operator empty) (=? X)
  (lambda empty) (= x)
  (function empty) (=> x)
  (array empty) (@)
  (iterator empty)
  (object empty) (@:)
  (class empty)
  ((class empty) empty).
  ((@:class x: 1) default).
).
(var non-empties (@
  bool true
  string " " "0" "null" "false"
  number -1 1 (number max) (number min) (number smallest)
  date (date of -1) (date of 1)
  range (1 10)
  symbol (` x)
  tuple (` (null)) (` (false)) (` (x y z).
  operator (=? X null) (=? X (X).
  lambda (= x null) (= x x)
  function (=> x null) (=> x x)
  array (@ null) (@ 1) (@ 10:10) (@ 1 10:10)
  iterator
  (iterator of (@).
  (iterator of (@ null).
  (iterator of (@ 1 2).
  object (@ x: null) (@:@ x ) (@ x: 1, y: 2)
  class (@:class x: 1)
  ((@:class x: 1) of (@ y: 2).
).

(define "(value ?* ...) - emptiness test" (=> ()
  (define "(a ?*) - booleanize" (=> ()
    (should "(empty-value ?*) returns false." (=> ()
      assert false ((10 + -10)?*);
      (for value in empties
        assert (($value ?*) is false);
      ).
    ).
    (should "(non-empty-value ?*) returns true." (=> ()
      assert ((10 + 10)?*);
      (for value in non-empties
        assert (($value ?*) is true);
      ).
    ).
  ).
  (define "(a ?* b) - empty fallback" (=> ()
    (should "(empty-value ?* value) returns the value." (=> ()
      (for b in (empties + non-empties)
        (for a in empties
          assert ($a ?* b:: is b);
      ).
    ).
    (should "(non-empty ?* value) returns the non-empty." (=> ()
      (for b in (empties + non-empties)
        (for a in non-empties
          assert ($a ?* b:: is a);
      ).
    ).
  ).
  (define "(a ?* b c) - empty switch" (=> ()
    (should "(empty-value ?* b c) returns the value of c." (=> ()
      (for c in (empties concat non-empties)
        (for a in empties
          assert ($a ?* 100 c:: is c);
      ).
    ).
    (should "(non-empty ?* b c) returns the value of b." (=> ()
      (for b in (empties concat non-empties)
        (for a in non-empties
          assert ($a ?* b 100:: is b);
      ).
    ).
  ).
).

(define "(value ?? ...) - Null Test" (=> ()
  (define "Booleanize Null: (value ??)" (= ()
    (should "(null ??) returns false." (= ()
      (assert ((null ??) is false).
      (assert (((null null) ??) is false).
    ).
  ).
  (define "Null Fallback: (value ?? another-value)" (=> ()
    (should "(null ?? value) returns value." (=> ()
      (for value in (truthy-values concat null, 0, -0, false)
        (assert ($(null ?? value) is value).
      ).
    ).
    (should "(value ?? another-value) returns value if value is not null." (=> ()
      (for a in (truthy-values concat 0, -0, false)
        (for b in (truthy-values concat null, 0, -0, false)
          (assert ($($a ?? b) is a).
        ).
      ).
    ).
  ).
  (define "Null Switch: (value ?? truthy, falsy)" (=> ()
    (should "(null ?? truthy, falsy) returns falsy." (=> ()
      (for a in (truthy-values concat null, 0, -0, false)
        (for b in (truthy-values concat null, 0, -0, false)
          (assert ($(null ?? a, b) is b).
        ).
      ).
    ).
    (should "(value ?? truthy, falsy) returns truthy if value is not null." (=> ()
      (for value in (truthy-values concat 0 -0 false)
        (for a in (truthy-values concat null, 0, -0, false)
          (for b in (truthy-values concat null, 0, -0, false)
            (assert ($($value ?? a, b) is a).
          ).
        ).
      ).
    ).
  ).
).
