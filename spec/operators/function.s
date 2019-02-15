(define "(= ...)" (= ()
  (should "(=) returns the empty lambda." (=> ()
    (var f (=).
    (assert ($f is-a lambda).
    (assert ($f is-empty).

    (assert ($f is (lambda empty).
    (assert ($(=()) is (lambda empty).
  ).
  (should "(= param) returns an empty lambda." (=> ()
    (var f (= x).
    (assert ($f is-a lambda).
    (assert ($f is-empty).
  ).
  (should "(= (params ...)) returns an empty lambda." (=> ()
    (var f (= (x y).
    (assert ($f is-a lambda).
    (assert ($f is-empty).
  ).
  (should "(= () body ...) returns a new lambda which has no explicit parameter." (=> ()
    (var f (=() 10).
    (assert ($f is-a lambda).
    (assert ($f not-empty).

    (assert "f" ($f name).
    (assert 0 (($f parameters) length).
    (assert 10 (($f body) 0).
  ).
  (should "(= param body ...) returns a new lambda having an explicit parameter." (=> ()
    (var f (= x 10 x).
    (assert ($f is-a lambda).
    (assert ($f not-empty).

    (assert "f" ($f name).
    (assert (($f parameters) is-a tuple).
    (assert (quote x) ($f parameters).

    (assert 2 (($f body) length).
    (assert 10 (($f body) 0).
    (assert (`x) (($f body) 1).
  ).
  (should "(= (params ...) body ...) returns a new lambda." (=> ()
    (var f (= (x y) 10 (x + y).
    (assert ($f is-a lambda).
    (assert ($f not-empty).

    (assert "f" ($f name).
    (assert (($f parameters) is-a tuple).
    (assert 2 (($f parameters) length).
    (assert (`x) (($f parameters) 0).
    (assert (`y) (($f parameters) 1).

    (assert 2 (($f body) length).
    (assert 10 (($f body) 0).
    (assert (`(x + y)) (($f body) 1).
  ).
  (should "(= :() body ...) calls the new lambda immediately and returns the result." (= ()
    (var r (=: () 100).
    (assert 100 r).
  ).
  (should "(= ():() body ...) calls the new lambda immediately and returns the result." (= ()
    (var r (= ():() 100).
    (assert 100 r).
  ).
  (should "(= arg:param body ...) calls the new lambda immediately with an argument and returns the result." (= ()
    (var r (= 10:x (100 + x).
    (assert 110 r).
  ).
  (should "(= (args ...):(params ...) body ...) calls the new lambda immediately with arguments and returns the result." (= ()
    (var r (= (1 10):(x y) (100 + x y).
    (assert 111 r).
  ).
).

(define "(=> ...)" (= ()
  (should "(=>) returns the empty function." (=> ()
    (var f (=>).
    (assert ($f is-a function).
    (assert ($f is-empty).

    (assert ($f is (function empty).
    (assert ($(=>()) is (function empty).
  ).
  (should "(=> param) returns an empty function." (=> ()
    (var f (=> x).
    (assert ($f is-a function).
    (assert ($f is-empty).
  ).
  (should "(=> (params ...)) returns an empty function." (=> ()
    (var f (=> (x y).
    (assert ($f is-a function).
    (assert ($f is-empty).
  ).
  (should "(=> () body ...) returns a new function which has no explicit parameter." (=> ()
    (var f (=>() 10).
    (assert ($f is-a function).
    (assert ($f not-empty).

    (assert "f" ($f name).
    (assert 0 (($f parameters) length).
    (assert 10 (($f body) 0).
  ).
  (should "(=> param body ...) returns a new function having an explicit parameter." (=> ()
    (var f (=> x 10 x).
    (assert ($f is-a function).
    (assert ($f not-empty).

    (assert "f" ($f name).
    (assert (($f parameters) is-a tuple).
    (assert (quote x) ($f parameters).

    (assert 2 (($f body) length).
    (assert 10 (($f body) 0).
    (assert (`x) (($f body) 1).
  ).
  (should "(=> (params ...) body ...) returns a new function." (=> ()
    (var f (=> (x y) 10 (x + y).
    (assert ($f is-a function).
    (assert ($f not-empty).

    (assert "f" ($f name).
    (assert (($f parameters) is-a tuple).
    (assert 2 (($f parameters) length).
    (assert (`x) (($f parameters) 0).
    (assert (`y) (($f parameters) 1).

    (assert 2 (($f body) length).
    (assert 10 (($f body) 0).
    (assert (`(x + y)) (($f body) 1).
  ).
  (should "(=> :() body ...) calls the new function immediately and returns the result." (= ()
    (var base 100)
    (var r (=>:() base).
    (assert 100 r).
  ).
  (should "(=> ():() body ...) calls the new function immediately and returns the result." (= ()
    (var base 100)
    (var r (=>():() base).
    (assert 100 r).
  ).
  (should "(=> arg:param body ...) calls the new function immediately with an argument and returns the result." (= ()
    (var base 100)
    (var r (=> 10:x (base + x).
    (assert 110 r).
  ).
  (should "(=> (args ...):(params ...) body ...) calls the new function immediately with arguments and returns the result." (= ()
    (var base 100)
    (var r (=> (1 10):(x y) (base + x y).
    (assert 111 r).
  ).
).

(define "(redo ...)" (= ()
  (should "(redo) indicates a tail recursive call in a lambda." (=> ()
    (assert 100 (=:x
      (if (x is-not null) (redo)) 100).
  ).
  (should "(redo args ...) can pass one or more arguments to next round of call of current lambda." (=> ()
    (var f (= x
      (if (x < 100000) (redo (++ x).
      (10 + x)
    ).
    (assert 100010 (f 10).
    (assert 100000000000010 (f 100000000000000).
  ).
  (should "(redo) indicates a tail recursive call in a function." (=> ()
    (assert 100 (=>:x
      (if (x is-not null) (redo)) 100).
  ).
  (should "(redo args ...) can pass one or more arguments to next round of call of current function." (=> ()
    (var f (=> (x y)
      (if (x < 100000) (redo (++ x) y).
      (x + y)
    ).
    (assert 100010 (f 10 10).
    (assert 100000000000100 (f 100000000000000 100).
  ).
).

(define "(return ...)" (= ()
  (should "(return) returns null for current lambda or function." (=> ()
    (assert null (=:() (return) 100).
    (assert null (=>:() (return) "").
  ).
  (should "(return value) returns value for current lambda or function." (=> ()
    (assert 10 (=:() (return 10) 100).
    (assert 10 (=>:() (return 10) "").
  ).
  (should "(return values ...) returns an array which contains the values for current lambda or function." (=> ()
    (var a (=:() (return 1 2) 100).
    (assert (a is-a array).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (=:() (return 3 4 5) 100).
    (assert (a is-a array).
    (assert 3 (a length).
    (assert 3 (a 0).
    (assert 4 (a 1).
    (assert 5 (a 2).
  ).
).

(define "(exit ...)" (= ()
  (should "(exit) returns null for current module." (=> ()
    (assert null (eval "(exit) 100").
  ).
  (should "(exit value) returns value for current module." (=> ()
    (assert 10 (eval "(exit 10) 100").
  ).
  (should "(exit values ...) returns an array which contains the values for current module." (=> ()
    (var a (eval "(exit 1 2) 100").
    (assert (a is-a array).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (eval "(exit 3 4 5) 100").
    (assert (a is-a array).
    (assert 3 (a length).
    (assert 3 (a 0).
    (assert 4 (a 1).
    (assert 5 (a 2).
  ).
).
