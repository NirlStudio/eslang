(var * (load "./share/type" (@ the-type: array).

(define "Array Common Behaviors" (=> ()
  (define "Identity" (=> ()
    (should "an empty array is also identified by its instance." (= ()
      (assert ((@) is-not (@).
      (assert false ((@) is (@).

      (assert ((@:array) is-not (@:array).
      (assert false ((@:array) is (@:array).

      (assert ((array empty) is-not (array empty).
      (assert false ((array empty) is (array empty).

      (assert ((array of) is-not (array of).
      (assert false ((array of) is (array of).

      (assert ((array from) is-not (array from).
      (assert false ((array from) is (array from).
    ).
  ).

  (define "Equivalence" (= ()
    (should "an array's equivalence is defined as the same of its identity." (= ()
      (var a (array of 1 10).
      (assert ($(a "is") is (a "equals").
      (assert ($(a "is-not") is (a "not-equals").
    ).
  ).

  (define "Ordering" (=> ()
    (should "comparison of an array with itself returns 0." (=> ()
      (for a in (the-values concat (@) (@))
        (assert 0 (a compares-to a).
      ).
    ).
    (should "comparison of two different arrays return null." (=> ()
      (var values (the-values concat (@) (@).
      (for a in values
        (for b in values
          (if (a is-not b)
            (assert null (a compares-to b).
      ).
    ).
  ).

  (define "Emptiness" (= ()
    (should "an array is defined as empty if its length is 0." (= ()
      (assert ((@) is-empty).
      (assert false ((@) not-empty).

      (assert ((array empty) is-empty).
      (assert false ((array empty) not-empty).

      (assert ((array of) is-empty).
      (assert false ((array of) not-empty).

      (assert ((array from) is-empty).
      (assert false ((array from) not-empty).
    ).
  ).

  (define "Encoding" (=> ()
    (should "an array is encoded to a tuple." (=> ()
      (for value in (the-values concat (@))
        (assert ((value to-code) is-a tuple).
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "(array empty) is represented as (@)." (=> ()
      (assert "(@)" ((array empty) to-string).
      (assert "(@)" ((array empty) to-string " ").
      (assert "(@)" ((array empty) to-string "  ").
      (assert "(@)" ((array empty) to-string "   ").
      (assert "(@)" ((array empty) to-string " " " ").
      (assert "(@)" ((array empty) to-string " " "  ").
      (assert "(@)" ((array empty) to-string " " "   ").
    ).
  ).
).

(define "(array empty)" (= ()
  (should "(array empty) returns a new empty array." (= ()
    (assert 0 ((array empty) length).
    (assert ((array empty) is-empty).
  ).
).

(define "(array of ...)" (= ()
  (should "(array of) returns a new empty array." (= ()
    (assert 0 ((array of) length).
    (assert ((array of) is-empty).
  ).
  (should "(array of item ...) returns an array of items." (= ()
    (var a (array of null true 1 "a" (date of 1) (0 1) (` x) (` (x y)) (@ 1 2) (@:).
    (assert (a is-an array).
    (assert 10 (a length).

    (assert null (a 0).
    (assert true (a 1).
    (assert 1 (a 2).
    (assert "a" (a 3).
    (assert (date of 1) (a 4).
    (assert (0 1) (a 5).
    (assert (` x) (a 6).
    (assert (`(x y)) (a 7).
    (assert ((a 8) is-an array).
    (assert ((a 9) is-an object).
  ).
).

(define "(array from ...)" (= ()
  (should "(array from) returns a new empty array." (= ()
    (assert 0 ((array from) length).
    (assert ((array from) is-empty).
  ).
  (should "(array from item ...) returns an array of items." (= ()
    (var a (array from null true 1 "a" (date of 1) (` x).
    (assert (a is-an array).
    (assert 6 (a length).

    (assert null (a 0).
    (assert true (a 1).
    (assert 1 (a 2).
    (assert "a" (a 3).
    (assert (date of 1) (a 4).
    (assert (` x) (a 5).
  ).
  (should "(array from list ...) returns an array which consisted of items from all lists." (= ()
    (var a (array from (0 2) (` (x y)) (@ 1 2) (@ x: 1 y: 2).
    (assert (a is-an array).
    (assert 8 (a length).

    (assert 0 (a 0).
    (assert 1 (a 1).
    (assert (`x) (a 2).
    (assert (`y) (a 3).
    (assert 1 (a 4).
    (assert 2 (a 5).
    (assert "x" (a 6).
    (assert "y" (a 7).
  ).
).

(define "(an-array length)" (= ()
  (should "(an-array length) returns the length of the whole array." (= ()
    (var a (@).
    (assert 0 (a length).
    (a 0 10)
    (assert 1 (a length).
    (a 1 20)
    (assert 2 (a length).
    (a 100 100)
    (assert 101 (a length).
    (a 1000 null)
    (assert 1001 (a length).
  ).
).

(define "(an-array count ...)" (= ()
  (should "(an-array count) returns the count of items in the array." (= ()
    (var a (@).
    (assert 0 (a count).
    (a 0 10)
    (assert 1 (a count).
    (a 1 20)
    (assert 2 (a count).
    (a 100 100)
    (assert 3 (a count).
    (a 1000 null)
    (assert 4 (a count).
  ).
  (should "(an-array count filter) returns the count of items matched with filter." (= ()
    (var a (@ 1 2 3 4 5).
    (assert 3 (a count (= x (x > 2).

    (a 10 10)
    (assert 4 (a count (= x (x > 2).

    (a 100 100)
    (assert 5 (a count (= x (x > 2).
  ).
).

(define "(an-array for-each ...)" (= ()
  (should "(an-array for-each ...) is an alias of (an-array count ...)." (= ()
    (var a (@).
    (assert (a "count":: is (a "for-each").
    (assert (a "for-each":: is (a "count").
).

(define "(an-array is-sealed)" (= ()
  (should "(an-array is-sealed) returns true if the array is read-only." (= ()
    (var a (@ 1 2).
    (assert false (a is-sealed).
    (a seal)
    (assert (a is-sealed).
  ).
).

(define "(an-array seal)" (= ()
  (should "(an-array seal) makes the array as read-only and returns it." (= ()
    (var a (@ 1 2).
    (assert false (a is-sealed).

    (a 10 10)
    (assert 11 (a length).

    (a seal)
    (assert (a is-sealed).

    (a push 11)
    (assert 11 (a length).

    (a 100 100)
    (assert 11 (a length).
  ).
).

(define "(an-array trace ...)" (= ()
  (should "(an-array trace) returns the subject array." (= ()
    (var a (@).
    (assert a (a trace).

    (let a (@ 1 2).
    (assert a (a trace).
    (assert a (a trace null).
    (assert a (a trace true).
    (assert a (a trace 1).
  ).
  (should "(an-empty-array trace tracer) only returns the subject array." (= ()
    (var a (@).
    (var counter 0)
    (a trace (=> () (counter ++).
    (assert 0 counter)
  ).
  (should "(an-array trace tracer) stops when a tracer returns a truthy value." (= ()
    (var a (@ 0 1 2 3 4 5 6 7 8 9).
    (var counter 0)
    (a trace (=> (v i) (counter ++) (i > 1).
    (assert 3 counter)

    (let counter 0)
    (a trace (=> (v i) (counter ++) (i > 5).
    (assert 7 counter)

    (let counter 0)
    (a trace (=> (v i) (counter ++) (i > 10).
    (assert 10 counter)
  ).
  (should "(an-array trace tracer) call tracer for each element with its index and returns the subject array." (= ()
    (var a (@ 1 2 3).
    (var counter 0)
    (a trace (=> (v i)
      (assert counter i).
      (assert (a: (counter ++)) v).
    ).
    (assert 3 counter)
  ).
  (should "(a-discrete-array trace tracer) call tracer for each element with its index and returns the subject array." (= ()
    (var a (@ 1).
    (a 2 5)
    (a 4 9)

    (var counter 0)
    (a trace (=> (v i)
      (assert ((i * 2) + 1) v).
      (assert (a: i) v).
      (assert ((counter ++) * 2) i).
    ).
    (assert 3 counter)
  ).
  (should "(a-sparse-array trace tracer) call tracer for each element with its index and returns the subject array." (= ()
    (var a (@ 1).
    (a 100 201)
    (a 200 401)

    (var counter 0)
    (a trace (=> (v i)
      (assert ((i * 2) + 1) v).
      (assert (a: i) v).
      (assert ((counter ++) * 100) i).
    ).
    (assert 3 counter)
  ).
).

(define "(an-array retrace ...)" (= ()
  (should "(an-array retrace) returns the subject array." (= ()
    (var a (@).
    (assert a (a retrace).

    (let a (@ 1 2).
    (assert a (a retrace).
    (assert a (a retrace null).
    (assert a (a retrace true).
    (assert a (a retrace 1).
  ).
  (should "(an-empty-array retrace tracer) only returns the subject array." (= ()
    (var a (@).
    (var counter 0)
    (a retrace (=> () (counter ++).
    (assert 0 counter)
  ).
  (should "(an-array retrace tracer) stops when a tracer returns a truthy value." (= ()
    (var a (@ 0 1 2 3 4 5 6 7 8 9).
    (var counter 0)
    (a retrace (=> (v i) (counter ++) (i < 8).
    (assert 3 counter)

    (let counter 0)
    (a retrace (=> (v i) (counter ++) (i < 4).
    (assert 7 counter)

    (let counter 0)
    (a retrace (=> (v i) (counter ++) (i < 0).
    (assert 10 counter)
  ).
  (should "(an-array retrace tracer) call tracer for each element with its index from the last element and returns the subject array." (= ()
    (var a (@ 1 2 3).
    (var counter 0)
    (a retrace (=> (v i)
      (assert (2 - (counter ++)) i).
      (assert (a:i) v).
    ).
    (assert 3 counter)
  ).
  (should "(a-discrete-array retrace tracer) call tracer for each element with its index from the last element and returns the subject array." (= ()
    (var a (@ 1).
    (a 2 5)
    (a 4 9)

    (var counter 0)
    (a retrace (=> (v i)
      (assert ((i * 2) + 1) v).
      (assert (a: i) v).
      (assert (counter ++) ((4 - i) / 2).
    ).
    (assert 3 counter)
  ).
  (should "(a-sparse-array retrace tracer) call tracer for each element with its index from the last element and returns the subject array." (= ()
    (var a (@ 1).
    (a 100 201)
    (a 200 401)

    (var counter 0)
    (a retrace (=> (v i)
      (assert ((i * 2) + 1) v).
      (assert (a: i) v).
      (assert (counter ++) (2 - (i / 100)).
    ).
    (assert 3 counter)
  ).
).

(define "(an-array iterate ...)" (= ()
  (should "(an-array iterate) returns an iterator function to traverse all its items." (= ()
    (var a (array of null true 10).
    (var iter (a iterate).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).
  ).
  (should "(a-discrete-array iterate) returns an iterator function to traverse all its items." (= ()
    (var a (@ null true).
    (a 10 11).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 11 (a 10).

    (var iter (a iterate).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 11 ((iter true) 0).
    (assert 10 ((iter true) 1).
    (assert null (iter).
  ).
  (should "(a-sparse-array iterate) returns an iterator function to traverse all its items." (= ()
    (var a (@ null true).
    (a 100 101).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 101 (a 100).

    (var iter (a iterate).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 101 ((iter true) 0).
    (assert 100 ((iter true) 1).
    (assert null (iter).
  ).
  (should "(an-array iterate begin) returns an iterator function to traverse all items from the position of begin." (= ()
    (var a (array of null true 10).
    (var iter (a iterate 1).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -2).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -4).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -1).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 2).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 3).
    (assert null (iter).
  ).
  (should "(a-discrete-array iterate begin) returns an iterator function to traverse all items from the position of begin." (= ()
    (var a (@ null true).
    (a 10 11).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 11 (a 10).

    (var iter (a iterate 1).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 11 ((iter true) 0).
    (assert 10 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -10).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 11 ((iter true) 0).
    (assert 10 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -12).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 11 ((iter true) 0).
    (assert 10 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -1).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 11 ((iter true) 0).
    (assert 10 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 10).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 11 ((iter true) 0).
    (assert 10 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 11).
    (assert null (iter).
  ).
  (should "(a-sparse-array iterate begin) returns an iterator function to traverse all items from the position of begin." (= ()
    (var a (@ null true).
    (a 100 101).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 101 (a 100).

    (var iter (a iterate 1).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 101 ((iter true) 0).
    (assert 100 ((iter true) 1).
    (assert null (iter).

    (var iter (a iterate -101).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 101 ((iter true) 0).
    (assert 100 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -1).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 101 ((iter true) 0).
    (assert 100 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 100).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 101 ((iter true) 0).
    (assert 100 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 101).
    (assert null (iter).
  ).

  (should "(an-array iterate begin end) returns an iterator function to traverse all items between begin and end." (= ()
    (var a (array of null true 10).
    (var iter (a iterate 1 3).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -2 4).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -4 -1).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -1 3).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 10 ((iter true) 0).
    (assert 2 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 2 -1).
    (assert null (iter).

    (let iter (a iterate 3).
    (assert null (iter).
  ).
  (should "(a-discrete-array iterate begin end) returns an iterator function to traverse all items between begin and end." (= ()
    (var a (@ null true).
    (a 10 11).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 11 (a 10).

    (var iter (a iterate 1 11).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 11 ((iter true) 0).
    (assert 10 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -10 -1).
    (assert ($iter is-a function).
f
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -12 5).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -1 11).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 11 ((iter true) 0).
    (assert 10 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 10 -1).
    (assert null (iter).

    (let iter (a iterate 11).
    (assert null (iter).
  ).
  (should "(a-sparse-array iterate begin end) returns an iterator function to traverse all items between begin and end." (= ()
    (var a (@ null true).
    (a 100 101).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 101 (a 100).

    (var iter (a iterate 1 101).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 101 ((iter true) 0).
    (assert 100 ((iter true) 1).
    (assert null (iter).

    (var iter (a iterate -101 -1).
    (assert ($iter is-a function).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert null ((iter true) 0).
    (assert 0 ((iter true) 1).

    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert true ((iter true) 0).
    (assert 1 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate -1 101).
    (assert ((iter) is-an array).
    (assert 2 ((iter true) length).
    (assert 101 ((iter true) 0).
    (assert 100 ((iter true) 1).
    (assert null (iter).

    (let iter (a iterate 100 -1).
    (assert null (iter).

    (let iter (a iterate 101).
    (assert null (iter).
  ).
  (should "an array can be used in a for loop to traverse all its items." (= ()
    (var list (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (var i 0)
    (for v in list
      (assert (list: (i ++)) v).
    ).
  ).
  (should "a discrete array can be used in a for loop to traverse all its valid items." (= ()
    (var values (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (var list (@).
    (for (v i) in values (list:(i * 2) v).
    (var i 0)
    (for v in list
      (assert (values: (i ++)) v).
    ).
  ).
  (should "a sparse array can be used in a for loop to traverse all its valid items." (= ()
    (var values (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (var list (@).
    (for (v i) in values (list:(i * i) v).
    (let i 0)
    (for v in list
      (assert (values: (i ++)) v).
    ).
  ).
  (should "an array can be used in a for loop to traverse all its items and indices." (= ()
    (var list (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (for (v i) in list
      (assert (list:i) v).
    ).
  ).
  (should "a discrete array can be used in a for loop to traverse all its valid items and indices." (= ()
    (var values (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (var list (@).
    (for (v i) in values (list:(i * 64) v).

    (var j 0)
    (for (v i) in list
      (assert (j * 64) i).
      (assert (values: (j ++)) v).
    ).
  ).
  (should "a sparse array can be used in a for loop to traverse all its valid items and indices." (= ()
    (var values (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (var list (@).
    (for (v i) in values (list:(i * 64) v).

    (var j 0)
    (for (v i) in list
      (assert (j * 64) i).
      (assert (values: (j ++)) v).
    ).
  ).
).

(define "(an-array copy ...)" (= ()
  (should "(an-array copy) returns a shallow copy of the subject array.." (= ()
    (var a (@ 1 2).
    (var c (a copy).
    (assert 2 (c length).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert (c is-not a).

    (a 10 11)
    (var c (a copy).
    (assert 11 (c length).
    (assert 3 (c count).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert ((c 10) is 11).
    (assert (c is-not a).

    (a 100 101)
    (var c (a copy).
    (assert 101 (c length).
    (assert 4 (c count).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert ((c 10) is 11).
    (assert ((c 100) is 101).
    (assert (c is-not a).
  ).
  (should "(an-array copy begin) returns the items in range of begin to the end of the array." (= ()
    (var a (@ 1 2).
    (var c (a copy 0).
    (assert 2 (c length).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert (c is-not a).

    (let c (a copy -2).
    (assert 2 (c length).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert (c is-not a).

    (var c (a copy -3).
    (assert 2 (c length).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert (c is-not a).

    (let c (a copy 1).
    (assert 1 (c length).
    (assert ((c 0) is 2).

    (let c (a copy -1).
    (assert 1 (c length).
    (assert ((c 0) is 2).

    (let c (a copy 2).
    (assert 0 (c length).
    (let c (a copy 3).
    (assert 0 (c length).

    (a 10 11)
    (var c (a copy 1).
    (assert 10 (c length).
    (assert 2 (c count).
    (assert ((c 0) is 2).
    (assert ((c 9) is 11).
    (assert (c is-not a).

    (a 100 101)
    (var c (a copy 1).
    (assert 100 (c length).
    (assert 3 (c count).
    (assert ((c 0) is 2).
    (assert ((c 9) is 11).
    (assert ((c 99) is 101).
    (assert (c is-not a).
  ).
  (should "(an-array copy begin count) returns the first <count> item(s) from the begin." (= ()
    (var a (@ 1 2 3).
    (var c (a copy 0 3).
    (assert 3 (c length).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert ((c 2) is 3).
    (assert (c is-not a).

    (let c (a copy -3 3).
    (assert 3 (c length).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert ((c 2) is 3).
    (assert (c is-not a).

    (let c (a copy -4 3).
    (assert 3 (c length).
    (assert ((c 0) is 1).
    (assert ((c 1) is 2).
    (assert ((c 2) is 3).
    (assert (c is-not a).

    (let c (a copy 1 1).
    (assert 1 (c length).
    (assert ((c 0) is 2).

    (let c (a copy 1 2).
    (assert 2 (c length).
    (assert ((c 0) is 2).
    (assert ((c 1) is 3).

    (let c (a copy -1 1).
    (assert 1 (c length).
    (assert ((c 0) is 3).

    (let c (a copy 2 4).
    (assert 1 (c length).
    (assert ((c 0) is 3).

    (let c (a copy -1 4).
    (assert 1 (c length).
    (assert ((c 0) is 3).

    (let c (a copy 2 1).
    (assert 1 (c length).
    (assert ((c 0) is 3).

    (let c (a copy -2 2).
    (assert 2 (c length).
    (assert ((c 0) is 2).
    (assert ((c 1) is 3).

    (a 10 11)
    (a 11 12)
    (assert 12 (a length).
    (assert 5 (a count).
    (var c (a copy 1 10).
    (assert 10 (c length).
    (assert 3 (c count).
    (assert ((c 0) is 2).
    (assert ((c 1) is 3).
    (assert ((c 9) is 11).
    (assert (c is-not a).

    (a 100 101)
    (a 101 102)
    (assert 102 (a length).
    (assert 7 (a count).
    (var c (a copy 1 100).
    (assert 100 (c length).
    (assert 5 (c count).
    (assert ((c 0) is 2).
    (assert ((c 1) is 3).
    (assert ((c 9) is 11).
    (assert ((c 99) is 101).
    (assert (c is-not a).
  ).
  (should "(an-array copy begin count) returns an empty array if count is not great than 0." (= ()
    (var a (@ 1 2 3).
    (assert ((a copy 0 0) is-empty).
    (assert ((a copy 0 -1) is-empty).
    (assert ((a copy -2 0) is-empty).
    (assert ((a copy -3 -1) is-empty).

    (a 10 11)
    (a 11 12)
    (assert ((a copy 1 0) is-empty).

    (a 100 101)
    (a 101 102)
    (assert ((a copy 10 0) is-empty).
  ).
).

(define "(an-array slice ...)" (= ()
  (should "(an-array slice) returns a shallow copy of the subject array." (= ()
    (var a (@ 1 2).
    (var s (a slice).
    (assert 2 (s length).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert (s is-not a).

    (a 10 11)
    (let s (a slice).
    (assert 11 (s length).
    (assert 3 (s count).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert ((s 10) is 11).
    (assert (s is-not a).

    (a 100 101)
    (let s (a slice).
    (assert 101 (s length).
    (assert 4 (s count).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert ((s 10) is 11).
    (assert ((s 100) is 101).
    (assert (s is-not a).
  ).
  (should "(an-array slice begin) returns the elements in the range of begin to end." (= ()
    (var a (@ 1 2).

    (var s (a slice 0).
    (assert 2 (s length).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert (s is-not a).

    (let s (a slice -2).
    (assert 2 (s length).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert (s is-not a).

    (var s (a slice -3).
    (assert 2 (s length).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert (s is-not a).

    (let s (a slice 1).
    (assert 1 (s length).
    (assert ((s 0) is 2).

    (let s (a slice -1).
    (assert 1 (s length).
    (assert ((s 0) is 2).

    (let s (a slice 2).
    (assert 0 (s length).
    (let s (a slice 3).
    (assert 0 (s length).

    (a 10 11)
    (var s (a slice 1).
    (assert 10 (s length).
    (assert 2 (s count).
    (assert ((s 0) is 2).
    (assert ((s 9) is 11).
    (assert (s is-not a).

    (a 100 101)
    (var s (a slice 1).
    (assert 100 (s length).
    (assert 3 (s count).
    (assert ((s 0) is 2).
    (assert ((s 9) is 11).
    (assert ((s 99) is 101).
    (assert (s is-not a).
  ).
  (should "(an-array slice begin end) returns the elements in the range of (begin end)." (= ()
    (var a (@ 1 2 3).
    (var s (a slice 0 3).
    (assert 3 (s length).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert ((s 2) is 3).
    (assert (s is-not a).

    (let s (a slice -3 3).
    (assert 3 (s length).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert ((s 2) is 3).
    (assert (s is-not a).

    (let s (a slice -4 3).
    (assert 3 (s length).
    (assert ((s 0) is 1).
    (assert ((s 1) is 2).
    (assert ((s 2) is 3).
    (assert (s is-not a).

    (let s (a slice 2 3).
    (assert 1 (s length).
    (assert ((s 0) is 3).

    (let s (a slice -1 3).
    (assert 1 (s length).
    (assert ((s 0) is 3).

    (let s (a slice 2 4).
    (assert 1 (s length).
    (assert ((s 0) is 3).

    (let s (a slice -1 4).
    (assert 1 (s length).
    (assert ((s 0) is 3).

    (let s (a slice 1 2).
    (assert 1 (s length).
    (assert ((s 0) is 2).

    (let s (a slice -2 2).
    (assert 1 (s length).
    (assert ((s 0) is 2).

    (a 10 11)
    (a 11 12)
    (var s (a slice 1 -1).
    (assert 10 (s length).
    (assert 3 (s count).
    (assert ((s 0) is 2).
    (assert ((s 1) is 3).
    (assert ((s 9) is 11).
    (assert (s is-not a).

    (a 100 101)
    (a 101 102)
    (var s (a slice 1 -1).
    (assert 100 (s length).
    (assert 5 (s count).
    (assert ((s 0) is 2).
    (assert ((s 1) is 3).
    (assert ((s 9) is 11).
    (assert ((s 10) is 12).
    (assert ((s 99) is 101).
    (assert (s is-not a).
  ).
  (should "(an-array slice begin end) returns an empty array if begin is after end)." (= ()
    (var a (@ 1 2 3).
    (assert ((a slice 0 0) is-empty).
    (assert ((a slice 1 0) is-empty).
    (assert ((a slice 1 1) is-empty).
    (assert ((a slice 3 1) is-empty).
    (assert ((a slice -2 0) is-empty).
    (assert ((a slice -1 1) is-empty).
    (assert ((a slice -1 -1) is-empty).
    (assert ((a slice -1 -2) is-empty).

    (a 10 11)
    (assert ((a slice 0 0) is-empty).

    (a 100 101)
    (assert ((a slice 10 0) is-empty).
  ).
).

(define "(an-array concat ...)" (= ()
  (should "(an-array concat) returns a shallow copy of the original array." (= ()
    (var a (@ 1 2).
    (var b (a concat).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (a 10 10).
    (let b (a concat).
    (assert (b is-not a).
    (assert 11 (b length).
    (assert 3 (b count).

    (a 100 100).
    (let b (a concat).
    (assert (b is-not a).
    (assert 101 (b length).
    (assert 4 (b count).
  ).
  (should "(an-array concat value ...) returns a new array with the value(s) appended to the end." (= ()
    (var a (@ 1 2).
    (var b (a concat 3).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 3 (b 2).

    (let c (b concat true "x").
    (assert 2 (a length).
    (assert 3 (b length).
    (assert 5 (c length).
    (assert true (c 3).
    (assert "x" (c 4).

    (a 10 11)
    (let b (a concat 12).
    (assert 12 (b length).
    (assert 4 (b count).

    (a 100 101)
    (let b (a concat 102 103).
    (assert 103 (b length).
    (assert 6 (b count).
  ).
).

(define "(an-array append ...)" (= ()
  (should "(an-array append) returns the original array." (= ()
    (var a (@ 1 2).
    (assert ((a append) is a).
    (assert 2 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (a 10 10).
    (assert ((a append) is a).
    (assert 11 (a length).
    (assert 3 (a count).

    (a 100 100).
    (assert ((a append) is a).
    (assert 101 (a length).
    (assert 4 (a count).
  ).
  (should "(an-array append value ...) returns the original array with the value(s) appended to the end." (= ()
    (var a (@ 1 2).
    (assert ((a append 3) is a).
    (assert 3 (a length).
    (assert 3 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (a 10 10).
    (assert ((a append 11) is a).
    (assert 12 (a length).
    (assert 5 (a count).

    (a 100 100).
    (assert ((a append 101 102) is a).
    (assert 103 (a length).
    (assert 8 (a count).
  ).
  (should "(an-array append an-array ...) returns the original array appending other array's elements." (= ()
    (var a (@ 1 2).
    (var b (@ 3 4).
    (assert ((a append b) is a).
    (assert 4 (a length).
    (assert 4 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).
    (assert 4 (a 3).

    (let a (@ 1 2).
    (b 10 10)
    (assert ((a append b (@ 11 12)) is a).
    (assert 15 (a length).
    (assert 7 (a count).
    (assert 10 (a 12).
    (assert 11 (a 13).
    (assert 12 (a 14).

    (let a (@ 1 2).
    (b 100 100)
    (assert ((a append b 101 102) is a).
    (assert 105 (a length).
    (assert 8 (a count).
    (assert 10 (a 12).
    (assert 100 (a 102).
    (assert 101 (a 103).
    (assert 102 (a 104).
  ).
  (should "(an-array append an-iterable ...) returns the original array appending iterable source's elements." (= ()
    (var a (@ 1 2).
    (assert ((a append (3 5)) is a).
    (assert 4 (a length).
    (assert 4 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).
    (assert 4 (a 3).

    (let a (@ 1 2).
    (a 10 10)
    (assert ((a append (11 13) (@ 13 14)) is a).
    (assert 15 (a length).
    (assert 7 (a count).
    (assert 10 (a 10).
    (assert 11 (a 11).
    (assert 12 (a 12).
    (assert 13 (a 13).
    (assert 14 (a 14).

    (let a (@ 1 2).
    (a 100 100)
    (assert ((a append (101 103) 103 104) is a).
    (assert 105 (a length).
    (assert 7 (a count).
    (assert 100 (a 100).
    (assert 101 (a 101).
    (assert 102 (a 102).
    (assert 103 (a 103).
    (assert 104 (a 104).
  ).
).

(define "(an-array += ...)" (= ()
  (should "(an-array += ...) is just an alias of (an-array append ...)." (= ()
    (var a (@ 1 2).
    (assert ($(a "+=") is (a "append").
  ).
).

(define "(an-array merge ...)" (= ()
  (should "(an-array merge) returns a shallow copy of the original array." (= ()
    (var a (@ 1 2).
    (var b (a merge).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (a 10 10)
    (let b (a merge).
    (assert (b is-not a).
    (assert 11 (b length).
    (assert 3 (b count).
    (assert 10 (b 10).

    (a 100 100)
    (let b (a merge).
    (assert (b is-not a).
    (assert 101 (b length).
    (assert 4 (b count).
    (assert 100 (b 100).
  ).
  (should "(an-array merge value ...) returns a new array with the value(s) appended to the end." (= ()
    (var a (@ 1 2).
    (var b (a merge 3).
    (assert (b is-not a).
    (assert 3 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 3 (b 2).

    (a 10 10)
    (let b (a merge 11 12).
    (assert (b is-not a).
    (assert 13 (b length).
    (assert 5 (b count).
    (assert 10 (b 10).
    (assert 11 (b 11).
    (assert 12 (b 12).

    (a 100 100)
    (let b (a merge 101 102).
    (assert (b is-not a).
    (assert 103 (b length).
    (assert 6 (b count).
    (assert 100 (b 100).
    (assert 101 (b 101).
    (assert 102 (b 102).
  ).
  (should "(an-array merge an-array ...) returns a new array appending other array's elements." (= ()
    (var a (@ 1 2).
    (var aa (@ 3 4).
    (var b (a merge aa).
    (assert (b is-not a).
    (assert 4 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 3 (b 2).
    (assert 4 (b 3).

    (aa 10 10)
    (let b (a merge aa 11).
    (assert (b is-not a).
    (assert 14 (b length).
    (assert 6 (b count).
    (assert 10 (b 12).
    (assert 11 (b 13).

    (aa 100 100)
    (let b (a merge aa 101 102).
    (assert (b is-not a).
    (assert 105 (b length).
    (assert 8 (b count).
    (assert 100 (b 102).
    (assert 101 (b 103).
    (assert 102 (b 104).
  ).
  (should "(an-array merge an-iterable ...) returns a new array appending iterable source(s)'s elements." (= ()
    (var a (@ 1 2).
    (var b (a merge (3 5).
    (assert (b is-not a).
    (assert 4 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 3 (b 2).
    (assert 4 (b 3).

    (a 10 10)
    (let b (a merge (@ 11 12) 13).
    (assert (b is-not a).
    (assert 14 (b length).
    (assert 6 (b count).
    (assert 10 (b 10).
    (assert 11 (b 11).
    (assert 12 (b 12).
    (assert 13 (b 13).

    (a 100 100)
    (let b (a merge (@ 101 102) 103 104).
    (assert (b is-not a).
    (assert 105 (b length).
    (assert 8 (b count).
    (assert 100 (b 100).
    (assert 101 (b 101).
    (assert 102 (b 102).
    (assert 103 (b 103).
    (assert 104 (b 104).
  ).
).

(define "(an-array + ...)" (= ()
  (should "(an-array + ...) is just an alias of (an-array merge ...)." (= ()
    (var a (@ 1 2).
    (assert ($(a "+") is (a "merge").
  ).
).

(define "(an-array get ...)" (= ()
  (should "(an-array get) returns the first element or null." (= ()
    (assert null ((@) get).
    (assert 1 ((@ 1) get).
    (assert 1 ((@ 1 2) get).

    (let a (@).
    (a 10 10).
    (assert null (a get).

    (a 100 100).
    (assert null (a get).
  ).
  (should "(an-array get offset) returns the element at offset or null." (= ()
    (assert null ((@) get 0).
    (assert 1 ((@ 1) get 0).
    (assert 1 ((@ 1 2) get 0).

    (assert null ((@) get 1).
    (assert null ((@ 1) get 1).
    (assert 2 ((@ 1 2) get 1).

    (assert null ((@) get 2).
    (assert null ((@ 1) get 2).
    (assert null ((@ 1 2) get 2).

    (assert null ((@) get -1).
    (assert 1 ((@ 1) get -1).
    (assert 2 ((@ 1 2) get -1).

    (assert null ((@) get -2).
    (assert null ((@ 1) get -2).
    (assert 1 ((@ 1 2) get -2).

    (let a (@ 1 2).
    (a 10 10).
    (assert 1 (a get 0).
    (assert 2 (a get 1).
    (assert null (a get 2).
    (assert null (a get -2).
    (assert null (a get 9).
    (assert 10 (a get -1).
    (assert 10 (a get 10).
    (assert null (a get 11).

    (a 100 100).
    (assert null (a get -2).
    (assert null (a get 99).
    (assert 100 (a get -1).
    (assert 100 (a get 100).
    (assert null (a get 101).
  ).
  (should "(an-array: offset) returns the element at offset or null." (= ()
    (assert null ((@): 0).
    (assert 1 ((@ 1): 0).
    (assert 1 ((@ 1 2): 0).

    (assert null ((@): 1).
    (assert null ((@ 1): 1).
    (assert 2 ((@ 1 2): 1).

    (assert null ((@): 2).
    (assert null ((@ 1): 2).
    (assert null ((@ 1 2): 2).

    (assert null ((@): -1).
    (assert 1 ((@ 1): -1).
    (assert 2 ((@ 1 2): -1).

    (assert null ((@): -2).
    (assert null ((@ 1): -2).
    (assert 1 ((@ 1 2): -2).

    (let a (@ 1 2).
    (a 10 10).
    (assert 1 (a: 0).
    (assert 2 (a: 1).
    (assert null (a: 2).
    (assert null (a: -2).
    (assert null (a: 9).
    (assert 10 (a: -1).
    (assert 10 (a: 10).
    (assert null (a: 11).

    (a 100 100).
    (assert null (a: -2).
    (assert null (a: 99).
    (assert 100 (a: -1).
    (assert 100 (a: 100).
    (assert null (a: 101).
  ).
  (should "(an-array const-offset) returns the element at offset or null." (= ()
    (assert null ((@) 0).
    (assert 1 ((@ 1) 0).
    (assert 1 ((@ 1 2) 0).

    (assert null ((@) 1).
    (assert null ((@ 1) 1).
    (assert 2 ((@ 1 2) 1).

    (assert null ((@) 2).
    (assert null ((@ 1) 2).
    (assert null ((@ 1 2) 2).

    (assert null ((@) -1).
    (assert 1 ((@ 1) -1).
    (assert 2 ((@ 1 2) -1).

    (assert null ((@) -2).
    (assert null ((@ 1) -2).
    (assert 1 ((@ 1 2) -2).

    (let a (@ 1 2).
    (a 10 10).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).
    (assert null (a -2).
    (assert null (a 9).
    (assert 10 (a -1).
    (assert 10 (a 10).
    (assert null (a 11).

    (a 100 100).
    (assert null (a -2).
    (assert null (a 99).
    (assert 100 (a -1).
    (assert 100 (a 100).
    (assert null (a 101).
  ).
).

(define "(an-array set offset value)" (= ()
  (should "(an-array set) sets the first element to null." (= ()
    (var (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert null (a1 set).
    (assert 1 (a1 length).
    (assert null (a1 0).

    (assert null (a2 set).
    (assert 1 (a2 length).
    (assert null (a2 0).

    (assert null (a3 set).
    (assert 2 (a3 length).
    (assert null (a3 0).
    (assert 2 (a3 1).

    (var a (@ 1 2).
    (a 10 10)
    (assert null (a set).
    (assert null (a 0).

    (a 100 100)
    (assert 1 (a set 0 1).
    (assert null (a set).
    (assert null (a 0).
  ).
  (should "(an-array set offset) sets the element at offset as null." (= ()
    (var (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert null (a1 set 0).
    (assert 1 (a1 length).
    (assert null (a1 0).

    (assert null (a2 set 0).
    (assert 1 (a2 length).
    (assert null (a2 0).

    (assert null (a3 set 0).
    (assert 2 (a3 length).
    (assert null (a3 0).
    (assert 2 (a3 1).

    (let (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert null (a1 set 1).
    (assert 1 (a1 count).
    (assert 2 (a1 length).
    (assert null (a1 0).
    (assert null (a1 1).

    (assert null (a2 set 1).
    (assert 2 (a2 count).
    (assert 2 (a2 length).
    (assert 1 (a2 0).
    (assert null (a2 1).

    (assert null (a3 set 1).
    (assert 2 (a3 count).
    (assert 2 (a3 length).
    (assert 1 (a3 0).
    (assert null (a3 1).

    (let (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert null (a1 set -1).
    (assert 0 (a1 count).
    (assert 0 (a1 length).
    (assert null (a1 0).

    (assert null (a2 set -1).
    (assert 1 (a2 count).
    (assert 1 (a2 length).
    (assert null (a2 0).

    (assert null (a3 set -1).
    (assert 2 (a3 count).
    (assert 2 (a3 length).
    (assert 1 (a3 0).
    (assert null (a3 1).

    (var a (@ 1 2).
    (a 10 10)
    (assert null (a set 0).
    (assert null (a 0).

    (assert null (a -2).
    (assert null (a set -2).
    (assert null (a -2).

    (assert 10 (a -1).
    (assert null (a set -1).
    (assert null (a -1).

    (a 100 100)
    (assert 1 (a set 0 1).
    (assert null (a set).
    (assert null (a 0).

    (assert null (a -2).
    (assert null (a set -2).
    (assert null (a -2).

    (assert 100 (a -1).
    (assert null (a set -1).
    (assert null (a -1).
  ).
  (should "(an-array set offset value) sets the element at offset as value." (= ()
    (var (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert 9 (a1 set 0 9).
    (assert 1 (a1 length).
    (assert 9 (a1 0).

    (assert 9 (a2 set 0 9).
    (assert 1 (a2 length).
    (assert 9 (a2 0).

    (assert 9 (a3 set 0 9).
    (assert 2 (a3 length).
    (assert 9 (a3 0).
    (assert 2 (a3 1).

    (let (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert 9 (a1 set 1 9).
    (assert 1 (a1 count).
    (assert 2 (a1 length).
    (assert null (a1 0).
    (assert 9 (a1 1).

    (assert 9 (a2 set 1 9).
    (assert 2 (a2 count).
    (assert 2 (a2 length).
    (assert 1 (a2 0).
    (assert 9 (a2 1).

    (assert 9 (a3 set 1 9).
    (assert 2 (a3 count).
    (assert 2 (a3 length).
    (assert 1 (a3 0).
    (assert 9 (a3 1).

    (let (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert null (a1 set -1 9).
    (assert 0 (a1 count).
    (assert 0 (a1 length).
    (assert null (a1 0).

    (assert 9 (a2 set -1 9).
    (assert 1 (a2 count).
    (assert 1 (a2 length).
    (assert 9 (a2 0).

    (assert 9 (a3 set -1 9).
    (assert 2 (a3 count).
    (assert 2 (a3 length).
    (assert 1 (a3 0).
    (assert 9 (a3 1).

    (var a (@ 1 2).
    (a 10 10)
    (assert 1 (a set 0 1).
    (assert 1 (a 0).

    (assert null (a -2).
    (assert -20 (a set -2 -20).
    (assert -20 (a -2).

    (assert 10 (a -1).
    (assert -10 (a set -1 -10).
    (assert -10 (a -1).

    (a 100 100)
    (assert 1 (a set 0 1).
    (assert 1 (a 0).

    (assert null (a -2).
    (assert -20 (a set -2 -20).
    (assert -20 (a -2).

    (assert 100 (a -1).
    (assert -10 (a set -1 -10).
    (assert -10 (a -1).
  ).
  (should "(an-array: offset value) sets the element at offset as value." (= ()
    (var (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert 9 (a1: 0 9).
    (assert 1 (a1 length).
    (assert 9 (a1 0).

    (assert 9 (a2: 0 9).
    (assert 1 (a2 length).
    (assert 9 (a2 0).

    (assert 9 (a3: 0 9).
    (assert 2 (a3 length).
    (assert 9 (a3 0).
    (assert 2 (a3 1).

    (let (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert 9 (a1: 1 9).
    (assert 1 (a1 count).
    (assert 2 (a1 length).
    (assert null (a1 0).
    (assert 9 (a1 1).

    (assert 9 (a2: 1 9).
    (assert 2 (a2 count).
    (assert 2 (a2 length).
    (assert 1 (a2 0).
    (assert 9 (a2 1).

    (assert 9 (a3: 1 9).
    (assert 2 (a3 count).
    (assert 2 (a3 length).
    (assert 1 (a3 0).
    (assert 9 (a3 1).

    (let (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert null (a1: -1 9).
    (assert 0 (a1 count).
    (assert 0 (a1 length).
    (assert null (a1 0).

    (assert 9 (a2: -1 9).
    (assert 1 (a2 count).
    (assert 1 (a2 length).
    (assert 9 (a2 0).

    (assert 9 (a3: -1 9).
    (assert 2 (a3 count).
    (assert 2 (a3 length).
    (assert 1 (a3 0).
    (assert 9 (a3 1).

    (var a (@ 1 2).
    (a 10 10)
    (assert 1 (a: 0 1).
    (assert 1 (a 0).

    (assert null (a -2).
    (assert -20 (a: -2 -20).
    (assert -20 (a -2).

    (assert 10 (a -1).
    (assert -10 (a: -1 -10).
    (assert -10 (a -1).

    (a 100 100)
    (assert 1 (a set 0 1).
    (assert 1 (a 0).

    (assert null (a -2).
    (assert -20 (a: -2 -20).
    (assert -20 (a -2).

    (assert 100 (a -1).
    (assert -10 (a: -1 -10).
    (assert -10 (a -1).
  ).
  (should "(an-array const-offset value) sets the element at offset as value." (= ()
    (var (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert 9 (a1 0 9).
    (assert 1 (a1 length).
    (assert 9 (a1 0).

    (assert 9 (a2 0 9).
    (assert 1 (a2 length).
    (assert 9 (a2 0).

    (assert 9 (a3 0 9).
    (assert 2 (a3 length).
    (assert 9 (a3 0).
    (assert 2 (a3 1).

    (let (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert 9 (a1 1 9).
    (assert 1 (a1 count).
    (assert 2 (a1 length).
    (assert null (a1 0).
    (assert 9 (a1 1).

    (assert 9 (a2 1 9).
    (assert 2 (a2 count).
    (assert 2 (a2 length).
    (assert 1 (a2 0).
    (assert 9 (a2 1).

    (assert 9 (a3 1 9).
    (assert 2 (a3 count).
    (assert 2 (a3 length).
    (assert 1 (a3 0).
    (assert 9 (a3 1).

    (let (a1 a2 a3) (@
      (@) (@ 1) (@ 1 2)
    ).
    (assert null (a1 -1 9).
    (assert 0 (a1 count).
    (assert 0 (a1 length).
    (assert null (a1 0).

    (assert 9 (a2 -1 9).
    (assert 1 (a2 count).
    (assert 1 (a2 length).
    (assert 9 (a2 0).

    (assert 9 (a3 -1 9).
    (assert 2 (a3 count).
    (assert 2 (a3 length).
    (assert 1 (a3 0).
    (assert 9 (a3 1).

    (var a (@ 1 2).
    (a 10 10)
    (assert 1 (a 0 1).
    (assert 1 (a 0).

    (assert null (a -2).
    (assert -20 (a -2 -20).
    (assert -20 (a -2).

    (assert 10 (a -1).
    (assert -10 (a: -1 -10).
    (assert -10 (a -1).

    (a 100 100)
    (assert 1 (a set 0 1).
    (assert 1 (a 0).

    (assert null (a -2).
    (assert -20 (a -2 -20).
    (assert -20 (a -2).

    (assert 100 (a -1).
    (assert -10 (a -1 -10).
    (assert -10 (a -1).
  ).
).

(define "(an-array reset ...)" (= ()
  (should "(an-array reset offset) removes the element at offset." (= ()
    (var a (@ 1 2 3).
    (assert 3 (a length).
    (assert 3 (a count).

    (assert a (a reset 0).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert null (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (let a (@ 1 2 3).
    (assert a (a reset 1).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert null (a 1).
    (assert 3 (a 2).

    (let a (@ 1 2 3).
    (assert a (a reset 2).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).

    (let a (@ 1 2 3).
    (assert a (a reset -1).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).

    (let a (@ 1 2 3).
    (assert a (a reset -4).
    (assert 3 (a length).
    (assert 3 (a count).

    (let a (@ 1 2 3).
    (assert a (a reset 3).
    (assert 3 (a length).
    (assert 3 (a count).

    (let a (@ 1 2 3).
    (a 10 10)
    (assert a (a reset 3).
    (assert 11 (a length).
    (assert 4 (a count).
    (a 11 11)
    (assert 12 (a length).
    (assert 5 (a count).
    (assert a (a reset -1).
    (assert 12 (a length).
    (assert 4 (a count).

    (let a (@ 1 2 3).
    (a 100 100)
    (assert a (a reset 3).
    (assert 101 (a length).
    (assert 4 (a count).
    (a 101 101)
    (assert 102 (a length).
    (assert 5 (a count).
    (assert a (a reset -1).
    (assert 102 (a length).
    (assert 4 (a count).
  ).
  (should "(an-array reset offset ...) removes elements at offsets." (= ()
    (var a (@ 1 2 3).
    (assert a (a reset 0 2).
    (assert 3 (a length).
    (assert 1 (a count).
    (assert null (a 0).
    (assert 2 (a 1).
    (assert null (a 2).

    (let a (@ 1 2 3).
    (assert a (a reset 0 -1).
    (assert 3 (a length).
    (assert 1 (a count).
    (assert null (a 0).
    (assert 2 (a 1).
    (assert null (a 2).

    (let a (@ 1 2 3).
    (a 10 10)
    (a 11 11)
    (assert a (a reset 2 3 10).
    (assert 12 (a length).
    (assert 3 (a count).

    (let a (@ 1 2 3).
    (a 100 100)
    (a 101 101)
    (assert a (a reset 2 3 -2).
    (assert 102 (a length).
    (assert 3 (a count).
  ).
).

(define "(an-array clear ...)" (= ()
  (should "(an-array clear) remove all elements in this array." (= ()
    (var a (@ 1 2 3).
    (assert a (a clear).
    (assert 0 (a length).
    (assert 0 (a count).

    (a 10 10).
    (assert 11 (a length).
    (assert 1 (a count).

    (assert a (a clear).
    (assert 0 (a length).
    (assert 0 (a count).

    (a 100 100).
    (assert 101 (a length).
    (assert 1 (a count).

    (assert a (a clear).
    (assert 0 (a length).
    (assert 0 (a count).
  ).
  (should "(an-array clear value) remove all occurrences of value in this array." (= ()
    (var a (@ 1 2 3 1 2 3).
    (assert a (a clear 2).
    (assert 4 (a length).
    (assert 4 (a count).
    (assert 1 (a 0).
    (assert 3 (a 1).
    (assert 1 (a 2).
    (assert 3 (a 3).

    (let a (@ 1 2 3 1 2 3).
    (assert a (a clear 4).
    (assert 6 (a length).
    (assert 6 (a count).

    (let a (@ 1 2 3 1 2 3).
    (a 10 10).
    (a 11 1).
    (a 12 2).
    (a 13 3).
    (assert 14 (a length).
    (assert 10 (a count).

    (assert a (a clear 2).
    (assert 11 (a length).
    (assert 7 (a count).

    (a 100 100).
    (a 101 1).
    (a 102 2).
    (a 103 3).
    (assert 104 (a length).
    (assert 11 (a count).

    (assert a (a clear 3).
    (assert 100 (a length).
    (assert 7 (a count).
  ).
  (should "(an-array clear value ...) remove all occurrences of any value in this array." (= ()
    (var a (@ 1 2 3 4 1 2 3).
    (assert a (a clear 2 4).
    (assert 4 (a length).
    (assert 4 (a count).
    (assert 1 (a 0).
    (assert 3 (a 1).
    (assert 1 (a 2).
    (assert 3 (a 3).

    (let a (@ 1 2 3 4 1 2 3).
    (assert a (a clear 4 9).
    (assert 6 (a length).
    (assert 6 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).
    (assert 1 (a 3).
    (assert 2 (a 4).
    (assert 3 (a 5).

    (let a (@ 1 2 3 4 1 2 3).
    (a 10 10).
    (a 11 1).
    (a 12 2).
    (a 13 3).
    (assert 14 (a length).
    (assert 11 (a count).

    (assert a (a clear 2 4).
    (assert 10 (a length).
    (assert 7 (a count).

    (a 100 100).
    (a 101 1).
    (a 102 2).
    (a 103 3).
    (a 104 4).
    (assert 105 (a length).
    (assert 12 (a count).

    (assert a (a clear 3 4).
    (assert 100 (a length).
    (assert 7 (a count).
  ).
).

(define "(an-array remove ...)" (= ()
  (should "(an-array remove) returns a shallow copy of the original array." (= ()
    (var a (@ 1 2 3).
    (var b (a remove).
    (assert (b is-not a).
    (assert 3 (b length).
    (assert 3 (b count).

    (a 10 10).
    (let b (a remove).
    (assert (b is-not a).
    (assert 11 (b length).
    (assert 4 (b count).

    (a 100 100).
    (let b (a remove).
    (assert (b is-not a).
    (assert 101 (b length).
    (assert 5 (b count).
  ).
  (should "(an-array remove value) returns a shallow copy by removing all occurrences of value in this array." (= ()
    (var a (@ 1 2 3 1 2 3).
    (var b (a remove 2).
    (assert 6 (a length).
    (assert 6 (a count).

    (assert (b is-not a).
    (assert 4 (b length).
    (assert 4 (b count).
    (assert 1 (b 0).
    (assert 3 (b 1).
    (assert 1 (b 2).
    (assert 3 (b 3).

    (let a (@ 1 2 3 1 2 3).
    (let b (a remove 4).
    (assert 6 (b length).
    (assert 6 (b count).

    (let a (@ 1 2 3 1 2 3).
    (a 11 1).
    (a 12 2).
    (a 13 3).
    (let b (a remove 2).
    (assert (b is-not a).
    (assert 11 (b length).
    (assert 6 (b count).

    (let a (@ 1 2 3 1 2 3).
    (a 101 1).
    (a 102 2).
    (a 104 3).
    (let b (a remove 2).
    (assert (b is-not a).
    (assert 102 (b length).
    (assert 6 (b count).
  ).
  (should "(an-array remove value ...) returns a shallow copy by removing all occurrences of any value in this array." (= ()
    (var a (@ 1 2 3 4 1 2 3).
    (var b (a remove 2 4).
    (assert 7 (a length).
    (assert 7 (a count).

    (assert (b is-not a).
    (assert 4 (b length).
    (assert 4 (b count).
    (assert 1 (b 0).
    (assert 3 (b 1).
    (assert 1 (b 2).
    (assert 3 (b 3).

    (let a (@ 1 2 3 4 1 2 3).
    (let b (a remove 6 4).
    (assert 6 (b length).
    (assert 6 (b count).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 3 (b 2).
    (assert 1 (b 3).
    (assert 2 (b 4).
    (assert 3 (b 5).

    (let a (@ 1 2 3 4 1 2 3).
    (a 11 1).
    (a 12 2).
    (a 13 3).
    (let b (a remove 2 4).
    (assert (b is-not a).
    (assert 10 (b length).
    (assert 6 (b count).

    (let a (@ 1 2 3 4 1 2 3).
    (a 101 1).
    (a 102 2).
    (a 104 3).
    (let b (a remove 2 4).
    (assert (b is-not a).
    (assert 101 (b length).
    (assert 6 (b count).
  ).
).

(define "(an-array replace ...)" (= ()
  (should "(an-array replace) returns the original array." (= ()
    (var a (@).
    (assert a (a replace).
    (assert 0 (a length).

    (let a (@ 1 2).
    (assert a (a replace).
    (assert 2 (a length).

    (a 10 10).
    (assert a (a replace).
    (assert 11 (a length).

    (a 100 100).
    (assert a (a replace).
    (assert 101 (a length).
  ).
  (should "(an-array replace value) reset all occurrences of value and returns the subject array." (= ()
    (var a (@).
    (assert a (a replace 2).
    (assert 0 (a length).
    (assert 0 (a count).

    (let a (@ 1 2 1.5 2).
    (assert a (a replace 2).
    (assert 4 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 1.5 (a 2).

    (let a (@ 1 2 1.5 2).
    (a 10 10).
    (assert a (a replace 2).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 1 (a 0).
    (assert 1.5 (a 2).
    (assert 10 (a 10).

    (let a (@ 1 2 1.5 2).
    (a 100 100).
    (assert a (a replace 2).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 1 (a 0).
    (assert 1.5 (a 2).
    (assert 100 (a 100).
  ).
  (should "(an-array replace value new-value) replace all occurrences of value to new-value and returns the subject array." (= ()
    (var a (@).
    (assert a (a replace 2 3).
    (assert 0 (a length).
    (assert 0 (a count).

    (let a (@ 1 2 1.5 2).
    (assert a (a replace 2 3).
    (assert 4 (a length).
    (assert 4 (a count).
    (assert 1 (a 0).
    (assert 3 (a 1).
    (assert 1.5 (a 2).
    (assert 3 (a 3).

    (let a (@ 1 2 1.5 2).
    (a 10 10).
    (assert a (a replace 2 3).
    (assert 11 (a length).
    (assert 5 (a count).
    (assert 1 (a 0).
    (assert 3 (a 1).
    (assert 1.5 (a 2).
    (assert 3 (a 3).
    (assert 10 (a 10).

    (let a (@ 1 2 1.5 2).
    (a 100 100).
    (assert a (a replace 2 3).
    (assert 101 (a length).
    (assert 5 (a count).
    (assert 1 (a 0).
    (assert 3 (a 1).
    (assert 1.5 (a 2).
    (assert 3 (a 3).
    (assert 100 (a 100).
  ).
).

(define "(an-array has ...)" (= ()
  (should "(an-array has) returns false if the first element does not exist." (= ()
    (var a (@).
    (assert false (a has).

    (let a (@).
    (a 10 10)
    (assert false (a has).

    (let a (@).
    (a 100 100)
    (assert false (a has).
  ).
  (should "(an-array has) returns true if the first element exists." (= ()
    (var a (@ 1).
    (assert true (a has).

    (let a (@ 1).
    (a 10 10)
    (assert true (a has).

    (let a (@ 1).
    (a 100 100)
    (assert true (a has).
  ).
  (should "(an-array has offset) returns a boolean value indicating if an element does exist at offset." (= ()
    (var a (@).
    (assert false (a has 0).
    (assert false (a has 1).
    (assert false (a has 2).
    (assert false (a has -1).
    (assert false (a has -2).
    (assert false (a has -3).

    (let a (@ 1).
    (assert true (a has 0).
    (assert false (a has 1).
    (assert false (a has 2).
    (assert true (a has -1).
    (assert false (a has -2).
    (assert false (a has -3).

    (let a (@ 1).
    (assert 3 (a 2 3).
    (assert true (a has 0).
    (assert false (a has 1).
    (assert true (a has 2).
    (assert false (a has 3).
    (assert true (a has -1).
    (assert false (a has -2).
    (assert true (a has -3).
    (assert false (a has -4).

    (let a (@ 1 2).
    (assert 100 (a 100 100).
    (assert true (a has 0).
    (assert true (a has 1).
    (assert false (a has 2).
    (assert true (a has -1).
    (assert false (a has -2).
    (assert false (a has 101).
  ).
  (should "(an-array has filter) returns a boolean value indicating if an element matched by filter." (= ()
    (var a (@).
    (assert false (a has (= x (x == 2).

    (let a (@ 1).
    (assert false (a has (= x (x == 2).

    (let a (@ 1 2).
    (assert (a has (= x (x == 2).

    (let a (@ 1 2).
    (a 11 11)
    (a 12 12)
    (a 13 13)
    (assert (a has (= x (x == 12).

    (let a (@ 1 2).
    (a 101 101)
    (a 102 102)
    (a 103 103)
    (assert (a has (= x (x == 102).
  ).
).

(define "(an-array contains ...)" (= ()
  (should "(an-array contains) always returns false." (= ()
    (var a (@).
    (assert false (a contains).

    (let a (@ 1).
    (assert false (a contains).

    (let a (@ 1 2).
    (assert false (a contains).

    (a 10 10).
    (assert false (a contains).

    (a 100 100).
    (assert false (a contains).
  ).
  (should "(an-array contains value) returns a boolean value indicating if the value exists in the array." (= ()
    (var r (1 10).
    (var t (`(1 2).
    (var l (= x x).
    (var f (=> x x).
    (var opr (=? X (X).
    (var arr (@ 1 2).
    (var obj (@ x: 1).
    (var src (@ 100 true r t l f opr arr obj).
    (assert (src contains 100).
    (assert false (src contains 1).
    (assert false (src contains 0).
    (assert false (src contains -1).

    (assert (src contains true).
    (assert false (src contains false).

    (assert (src contains r).
    (assert (src contains (1 10).
    (assert false (src contains (1 10 2).

    (assert (src contains t).
    (assert (src contains (`(1 2).
    (assert false (src contains (`(1 3).

    (assert (src contains l).
    (assert false (src contains (= x x).

    (assert (src contains f).
    (assert false (src contains (=> x x).

    (assert (src contains opr).
    (assert false (src contains (=? X (X).

    (assert (src contains arr).
    (assert false (src contains (@ 1 2).

    (assert (src contains obj).
    (assert false (src contains (@ x: 1).

    (src 10 10).
    (assert true (src contains 10).

    (src 100 100).
    (src 101 101).
    (assert true (src contains 100).
  ).
).

(define "(an-array swap ...)" (= ()
  (should "(an-array swap) always returns false for it takes both i and j are 0." (= ()
    (var a (@).
    (assert false (a swap).

    (let a (@ 1).
    (assert false (a swap).

    (let a (@ 1 2).
    (assert false (a swap).

    (a 10 10).
    (assert false (a swap).

    (a 100 100).
    (assert false (a swap).
  ).
  (should "(an-array swap i) always tries to swap the elements at i with the first one." (= ()
    (var a (@).
    (assert false (a swap 0).
    (assert false (a swap 1).
    (assert false (a swap -1).

    (let a (@ 1).
    (assert false (a swap 0).
    (assert false (a swap 1).
    (assert false (a swap -1).

    (let a (@ 1 2).
    (assert false (a swap 0).
    (assert true (a swap 1).
    (assert 2 (a 0).
    (assert 1 (a 1).
    (assert true (a swap -1).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 1 2).
    (a 10 10).
    (assert false (a swap 0).
    (assert true (a swap 10).
    (assert 10 (a 0).
    (assert 1 (a 10).

    (let a (@ 1 2).
    (a 100 100).
    (assert false (a swap 0).
    (assert true (a swap -1).
    (assert 100 (a 0).
    (assert 1 (a 100).
  ).
  (should "(an-array swap i j) returns true if the elements at i and j have been swapped." (= ()
    (var a (@ 1 2).
    (assert true (a swap 0 1).
    (assert 2 (a 0).
    (assert 1 (a 1).

    (let a (@ 1 2 3).
    (assert true (a swap 0 1).
    (assert 2 (a 0).
    (assert 1 (a 1).
    (assert 3 (a 2).

    (let a (@ 1 2 3).
    (assert true (a swap 0 -1).
    (assert 3 (a 0).
    (assert 2 (a 1).
    (assert 1 (a 2).

    (let a (@ 1 2 3).
    (a 11 11).
    (a 12 12).
    (a 13 13).
    (assert true (a swap 1 -1).
    (assert 13 (a 1).
    (assert 2 (a 13).

    (a 101 101).
    (a 102 102).
    (a 103 103).
    (assert true (a swap 2 -2).
    (assert 102 (a 2).
    (assert 3 (a 102).
  ).
  (should "(an-array swap i j) returns false if either i or j is an invalid offset." (= ()
    (let a (@ 1 2).
    (assert false (a swap 0 2).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 1 2 3).
    (assert false (a swap -4 1).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (let a (@ 1 2 3).
    (assert false (a swap -3 4).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).
  ).
).

(define "(an-array first ...)" (= ()
  (should "(an-array first) returns the first element or null." (= ()
    (var a (@).
    (assert null (a first).

    (let a (@ 1).
    (assert 1 (a first).

    (let a (@ 1 2).
    (assert 1 (a first).

    (let a (@ 1 2).
    (a 10 10)
    (assert 1 (a first).

    (a 100 100)
    (assert 1 (a first).
  ).
  (should "(an-array first filter) returns the first matched element by filter or null." (= ()
    (var a (@).
    (var value (a first (= x (x > 1).
    (assert null value).

    (let a (@ 1).
    (let value (a first (= x (x > 1).
    (assert null value).

    (let a (@ 1 2).
    (let value (a first (= x (x > 1).
    (assert 2 value).

    (let a (@ 1 2 3).
    (let value (a first (= x (x > 1).
    (assert 2 value).

    (let a (@ 1 2).
    (a 10 10)
    (a 11 11)
    (assert 10 (a first (= x (x >= 10).

    (a 100 100)
    (a 101 101)
    (assert 101 (a first (= x (x > 100).
  ).
  (should "(an-array first count) returns an empty array if count <= 0." (= ()
    (var a (@).
    (assert ((a first 0) is-empty).
    (assert ((a first -1) is-empty).

    (let a (@ 1).
    (assert ((a first 0) is-empty).
    (assert ((a first -1) is-empty).

    (let a (@ 1 2).
    (assert ((a first 0) is-empty).
    (assert ((a first -1) is-empty).

    (let a (@ 1 2).
    (a 10 10)
    (assert ((a first 0) is-empty).
    (assert ((a first -1) is-empty).

    (a 100 100)
    (assert ((a first 0) is-empty).
    (assert ((a first -1) is-empty).
  ).
  (should "(an-array first count) returns the first at most <count> elements as a new array." (= ()
    (var a (@).
    (var b (a first 2).
    (assert (b is-not a).
    (assert (b is-empty).
    (assert 0 (b length).

    (let a (@ 1).
    (let b (a first 2).
    (assert (b is-not a).
    (assert 1 (b length).
    (assert 1 (b 0).

    (let a (@ 1 2).
    (let b (a first 2).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2 3).
    (let b (a first 2).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2).
    (a 10 10)
    (a 11 11)
    (let b (a first 3).
    (assert 3 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 10 (b 2).

    (let a (@ 1 2).
    (a 100 100)
    (a 101 101)
    (let b (a first 3).
    (assert 3 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 100 (b 2).
  ).
  (should "(an-array first count filter) returns the first at most <count> matched element(s) by filter in a new array." (= ()
    (var a (@).
    (var b (a first 0 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a first 1 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a first 2 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).

    (let a (@ 1).
    (let b (a first 0 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a first 1 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a first 2 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).

    (let a (@ 1 2).
    (let b (a first 0 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a first 1 (= x (x > 1).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).
    (let b (a first 2 (= x (x > 1).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).

    (let a (@ 1 2 3).
    (let b (a first 0 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a first 1 (= x (x > 1).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).
    (let b (a first 2 (= x (x > 1).
    (assert (b is-an array).
    (assert 2 (b length).
    (assert 2 (b 0).
    (assert 3 (b 1).

    (let a (@ 1 2 3).
    (a 10 10)
    (a 11 11)
    (let b (a first 3 (= x (x > 2).
    (assert 3 (b length).
    (assert 3 (b 0).
    (assert 10 (b 1).
    (assert 11 (b 2).

    (let a (@ 1 2 3).
    (a 100 100)
    (a 101 101)
    (let b (a first 3 (= x (x > 2).
    (assert 3 (b length).
    (assert 3 (b 0).
    (assert 100 (b 1).
    (assert 101 (b 2).
  ).
).

(define "(an-array first-of ...)" (= ()
  (should "(an-array first-of) returns null." (= ()
    (var a (@).
    (assert null (a first-of).
    (let a (@ null).
    (assert null (a first-of).
    (let a (@ null 1).
    (assert null (a first-of).

    (a 10 10).
    (assert null (a first-of).

    (a 100 100).
    (assert null (a first-of).
  ).
  (should "(an-array first-of value) returns the offset of the first occurrence of value." (= ()
    (var a (@ 1 2 3 null 3 2 1).
    (assert 0 (a first-of 1).
    (assert 1 (a first-of 2).
    (assert 2 (a first-of 3).
    (assert 3 (a first-of null).

    (a 10 10).
    (a 11 11).
    (a 12 10).
    (assert 10 (a first-of 10).

    (a 100 100).
    (a 101 101).
    (a 102 100).
    (assert 100 (a first-of 100).
  ).
  (should "(an-array first-of value) returns null if value is not an element of the array." (= ()
    (var a (@ 1 2 3 null 3 2 1 "p" "0" "true").
    (assert null (a first-of (`p).
    (assert null (a first-of 0).
    (assert null (a first-of true).

    (a 10 10).
    (assert null (a first-of 11).

    (a 100 100).
    (assert null (a first-of 101).
  ).
).

(define "(an-array last ...)" (= ()
  (should "(an-array last) returns the last element or null." (= ()
    (var a (@).
    (assert null (a last).

    (let a (@ 1).
    (assert 1 (a last).

    (let a (@ 1 2).
    (assert 2 (a last).

    (a 10 10)
    (assert 10 (a last).

    (a 100 100)
    (assert 100 (a last).
  ).
  (should "(an-array last filter) returns the last matched element by filter or null." (= ()
    (var a (@).
    (var value (a last (= x (x > 1).
    (assert null value).

    (let a (@ 1).
    (let value (a last (= x (x > 1).
    (assert null value).

    (let a (@ 1 2).
    (let value (a last (= x (x > 1).
    (assert 2 value).

    (let a (@ 1 2 3).
    (let value (a last (= x (x > 1).
    (assert 3 value).

    (a 10 10)
    (a 11 11)
    (assert 10 (a last (= x (x < 11).

    (a 100 100)
    (a 101 101)
    (assert 100 (a last (= x (x < 101).
  ).
  (should "(an-array last count) returns an empty array if count <= 0." (= ()
    (var a (@).
    (assert ((a last 0) is-empty).
    (assert ((a last -1) is-empty).

    (let a (@ 1).
    (assert ((a last 0) is-empty).
    (assert ((a last -1) is-empty).

    (let a (@ 1 2).
    (assert ((a last 0) is-empty).
    (assert ((a last -1) is-empty).

    (a 10 10).
    (assert ((a last 0) is-an array).
    (assert ((a last 0) is-empty).
    (assert ((a last -1) is-empty).

    (a 100 100).
    (assert ((a last 0) is-an array).
    (assert ((a last 0) is-empty).
    (assert ((a last -1) is-empty).
  ).
  (should "(an-array last count) returns the last at most <count> elements as a new array." (= ()
    (var a (@).
    (var b (a last 2).
    (assert (b is-not a).
    (assert (b is-empty).
    (assert 0 (b length).

    (let a (@ 1).
    (let b (a last 2).
    (assert (b is-not a).
    (assert 1 (b length).
    (assert 1 (b 0).

    (let a (@ 1 2).
    (let b (a last 2).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2 3).
    (let b (a last 2).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 2 (b 0).
    (assert 3 (b 1).

    (a 10 10).
    (a 11 11).
    (a 13 13).
    (let b (a last 2).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 2 (b count).
    (assert 11 (b 0).
    (assert 13 (b 1).

    (a 100 100).
    (a 101 101).
    (a 103 103).
    (let b (a last 2).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 2 (b count).
    (assert 101 (b 0).
    (assert 103 (b 1).
  ).
  (should "(an-array last count filter) returns the last at most <count> matched element(s) by filter in a new array." (= ()
    (var a (@).
    (var b (a last 0 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a last 1 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a last 2 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).

    (let a (@ 1).
    (let b (a last 0 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a last 1 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a last 2 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).

    (let a (@ 2 1).
    (let b (a last 0 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a last 1 (= x (x > 1).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).
    (let b (a last 2 (= x (x > 1).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).

    (let a (@ 3 2 1).
    (let b (a last 0 (= x (x > 1).
    (assert (b is-an array).
    (assert 0 (b length).
    (let b (a last 1 (= x (x > 1).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).
    (let b (a last 2 (= x (x > 1).
    (assert (b is-an array).
    (assert 2 (b length).
    (assert 3 (b 0).
    (assert 2 (b 1).

    (a 10 10).
    (a 12 12).
    (a 14 14).
    (let b (a last 2 (= x (x < 14).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 2 (b count).
    (assert 10 (b 0).
    (assert 12 (b 1).

    (a 100 100).
    (a 102 102).
    (a 104 104).
    (let b (a last 2 (= x (x < 104).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 2 (b count).
    (assert 100 (b 0).
    (assert 102 (b 1).
  ).
).

(define "(an-array last-of ...)" (= ()
  (should "(an-array last-of) returns null." (= ()
    (var a (@).
    (assert null (a last-of).
    (let a (@ null).
    (assert null (a last-of).
    (let a (@ null 1).
    (assert null (a last-of).

    (a 10 10).
    (assert null (a last-of).

    (a 100 100).
    (assert null (a last-of).
  ).
  (should "(an-array last-of value) returns the offset of the last occurrence of value." (= ()
    (var a (@ 1 2 3 null 3 2 1).
    (assert 6 (a last-of 1).
    (assert 5 (a last-of 2).
    (assert 4 (a last-of 3).
    (assert 3 (a last-of null).

    (a 10 10).
    (a 11 11).
    (a 13 13).
    (assert 11 (a last-of 11).

    (a 100 100).
    (a 101 101).
    (a 103 103).
    (assert 101 (a last-of 101).
  ).
  (should "(an-array last-of value) returns null if value is not an element of the array." (= ()
    (var a (@ 1 2 3 null 3 2 1 "p" "0" "true").
    (assert null (a last-of (`p).
    (assert null (a last-of 0).
    (assert null (a last-of true).

    (a 10 10).
    (assert null (a last-of 11).

    (a 100 100).
    (assert null (a last-of 101).
  ).
).

(define "(an-array insert ...)" (= ()
  (should "(an-array insert) inserts an empty as the first element and returns the original array." (= ()
    (var a (@).
    (assert ((a insert) is a).
    (assert 1 (a length).
    (assert 0 (a count).
    (assert null (a 0).
    (assert false (a has 0).

    (let a (@ 1 2).
    (assert ((a insert) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert null (a 0).
    (assert false (a has 0).
    (assert 1 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (a 10 10).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert ((a insert) is a).
    (assert 12 (a length).
    (assert 3 (a count).
    (assert null (a 0).
    (assert false (a has 0).

    (let a (@ 1 2).
    (a 100 100).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert ((a insert) is a).
    (assert 102 (a length).
    (assert 3 (a count).
    (assert null (a 0).
    (assert false (a has 0).
  ).
  (should "(an-array insert index) inserts an empty at index and returns the original array." (= ()
    (var a (@).
    (assert ((a insert 0) is a).
    (assert 1 (a length).
    (assert 0 (a count).
    (assert null (a 0).
    (assert false (a has 0).

    (let a (@).
    (assert ((a insert -1) is a).
    (assert 1 (a length).
    (assert 0 (a count).
    (assert null (a 0).
    (assert false (a has 0).

    (let a (@).
    (assert ((a insert 1) is a).
    (assert 1 (a length).
    (assert 0 (a count).
    (assert null (a 0).
    (assert false (a has 0).

    (let a (@ 1 2).
    (assert ((a insert 0) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert null (a 0).
    (assert false (a has 0).
    (assert 1 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert -1) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert null (a 1).
    (assert false (a has 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert -2) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert null (a 0).
    (assert false (a has 0).
    (assert 1 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert -3) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert null (a 0).
    (assert false (a has 0).
    (assert 1 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert 1) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert null (a 1).
    (assert false (a has 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert 2) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).
    (assert false (a has 2).

    (let a (@ 1 2).
    (assert ((a insert 3) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).
    (assert false (a has 2).

    (let a (@ 1 2).
    (a 10 10).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert ((a insert 9) is a).
    (assert 12 (a length).
    (assert 3 (a count).
    (assert false (a has 9).
    (assert null (a 9).
    (assert false (a has 10).
    (assert 10 (a 11).

    (let a (@ 1 2).
    (a 100 100).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert ((a insert 99) is a).
    (assert 102 (a length).
    (assert 3 (a count).
    (assert false (a has 99).
    (assert null (a 99).
    (assert false (a has 100).
    (assert 100 (a 101).
  ).
  (should "(an-array insert index value) inserts value at index and returns the original array." (= ()
    (var a (@).
    (assert ((a insert 0 100) is a).
    (assert 1 (a length).
    (assert 100 (a 0).

    (let a (@).
    (assert ((a insert -1 100) is a).
    (assert 1 (a length).
    (assert 100 (a 0).

    (let a (@).
    (assert ((a insert 1 100) is a).
    (assert 1 (a length).
    (assert 100 (a 0).

    (let a (@ 1 2).
    (assert ((a insert 0 100) is a).
    (assert 3 (a length).
    (assert 100 (a 0).
    (assert 1 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert -1 100) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 100 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert -2 100) is a).
    (assert 3 (a length).
    (assert 100 (a 0).
    (assert 1 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert -3 100) is a).
    (assert 3 (a length).
    (assert 100 (a 0).
    (assert 1 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert 1 100) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 100 (a 1).
    (assert 2 (a 2).

    (let a (@ 1 2).
    (assert ((a insert 2 100) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 100 (a 2).

    (let a (@ 1 2).
    (assert ((a insert 3 100) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 100 (a 2).

    (let a (@ 1 2).
    (a 10 10).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert ((a insert 9 null) is a).
    (assert 12 (a length).
    (assert 4 (a count).
    (assert (a has 9).
    (assert null (a 9).
    (assert false (a has 10).
    (assert 10 (a 11).

    (let a (@ 1 2).
    (a 100 100).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert ((a insert 99 false) is a).
    (assert 102 (a length).
    (assert 4 (a count).
    (assert (a has 99).
    (assert false (a 99).
    (assert false (a has 100).
    (assert 100 (a 101).
  ).
  (should "(an-array insert index value ...) can insert multiple values in once." (= ()
    (var a (@).
    (assert ((a insert 0 100 101) is a).
    (assert 2 (a length).
    (assert 100 (a 0).
    (assert 101 (a 1).

    (let a (@ 1).
    (assert ((a insert -1 100 101) is a).
    (assert 3 (a length).
    (assert 100 (a 0).
    (assert 101 (a 1).
    (assert 1 (a 2).

    (let a (@ 1).
    (assert ((a insert 1 100 101) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 100 (a 1).
    (assert 101 (a 2).

    (let a (@ 1 2).
    (assert ((a insert 1 100 101) is a).
    (assert 4 (a length).
    (assert 1 (a 0).
    (assert 100 (a 1).
    (assert 101 (a 2).
    (assert 2 (a 3).

    (let a (@ 1 2).
    (assert ((a insert 1 100 101 102) is a).
    (assert 5 (a length).
    (assert 1 (a 0).
    (assert 100 (a 1).
    (assert 101 (a 2).
    (assert 102 (a 3).
    (assert 2 (a 4).

    (let a (@ 1 2).
    (a 10 10).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert ((a insert 9 null 0) is a).
    (assert 13 (a length).
    (assert 5 (a count).
    (assert (a has 9).
    (assert null (a 9).
    (assert (a has 10).
    (assert 0 (a 10).
    (assert false (a has 11).
    (assert 10 (a 12).

    (let a (@ 1 2).
    (a 100 100).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert ((a insert 99 false 0 1) is a).
    (assert 104 (a length).
    (assert 6 (a count).
    (assert (a has 99).
    (assert false (a 99).
    (assert (a has 100).
    (assert 0 (a 100).
    (assert (a has 101).
    (assert 1 (a 101).
    (assert false (a has 102).
    (assert 100 (a 103).
  ).
).

(define "(an-array delete ...)" (= ()
  (should "(an-array delete) deletes the first element and returns the original array." (= ()
    (var a (@).
    (assert ((a delete) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a delete) is a).
    (assert 0 (a length).

    (let a (@ 1 2).
    (assert ((a delete) is a).
    (assert 1 (a length).
    (assert 2 (a 0).

    (let a (@ 1 2 3).
    (assert ((a delete) is a).
    (assert 2 (a length).
    (assert 2 (a 0).
    (assert 3 (a 1).

    (let a (@ 1 2).
    (a 10 10).
    (assert ((a delete) is a).
    (assert 10 (a length).
    (assert 2 (a count).
    (assert 2 (a 0).
    (assert 10 (a 9).

    (let a (@ 1 2).
    (a 100 100).
    (assert ((a delete) is a).
    (assert 100 (a length).
    (assert 2 (a count).
    (assert 2 (a 0).
    (assert 100 (a 99).
  ).
  (should "(an-array delete index) deletes the element at index and returns the original array." (= ()
    (var a (@).
    (assert ((a delete 0) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a delete 0) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a delete -1) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a delete -2) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1).
    (assert ((a delete 1) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1).
    (assert ((a delete 2) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1 2).
    (assert ((a delete 0) is a).
    (assert 1 (a length).
    (assert 2 (a 0).

    (let a (@ 1 2).
    (assert ((a delete -1) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1 2).
    (assert ((a delete -2) is a).
    (assert 1 (a length).
    (assert 2 (a 0).

    (let a (@ 1 2).
    (assert ((a delete -3) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 1 2).
    (assert ((a delete 1) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1 2).
    (assert ((a delete 2) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 1 2).
    (assert ((a delete 3) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 1 2 3).
    (assert ((a delete 1) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 3 (a 1).

    (let a (@ 1 2).
    (a 10 10).
    (a 11 11).
    (a 13 13).
    (assert ((a delete 11) is a).
    (assert 13 (a length).
    (assert 4 (a count).
    (assert 13 (a 12).

    (let a (@ 1 2).
    (a 100 100).
    (a 101 101).
    (a 103 103).
    (assert ((a delete 101) is a).
    (assert 103 (a length).
    (assert 4 (a count).
    (assert 103 (a 102).
  ).
  (should "(an-array delete index count) deletes no more than count element(s) from index." (= ()
    (var a (@).
    (assert ((a delete 0 1) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a delete 0 0) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1).
    (assert ((a delete 0 -1) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1).
    (assert ((a delete 0 -2) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1).
    (assert ((a delete -1 1) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a delete 1 1) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1 2 3).
    (assert ((a delete 0 2) is a).
    (assert 1 (a length).
    (assert 3 (a 0).

    (let a (@ 1 2 3).
    (assert ((a delete 1 2) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1 2 3).
    (assert ((a delete 2 2) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 1 2 3).
    (assert ((a delete 3 2) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (let a (@ 1 2 3).
    (assert ((a delete -4 2) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (let a (@ 1 2).
    (a 10 10).
    (a 11 11).
    (a 13 13).
    (assert ((a delete 11 2) is a).
    (assert 12 (a length).
    (assert 4 (a count).
    (assert 13 (a 11).

    (let a (@ 1 2).
    (a 100 100).
    (a 101 101).
    (a 103 103).
    (assert ((a delete 99 3) is a).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 103 (a 100).
  ).
).

(define "(an-array splice ...)" (= ()
  (should "(an-array splice) returns an empty array." (= ()
    (var a (@).
    (var b (a splice).
    (assert (b is-not a).
    (assert 0 (a length).
    (assert 0 (b length).

    (let a (@ 1 2).
    (let b (a splice).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 0 (b length).

    (let a (@ 1 2).
    (a 10 10)
    (let b (a splice).
    (assert (b is-not a).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 0 (b length).
    (assert 0 (b count).

    (let a (@ 1 2).
    (a 100 100)
    (let b (a splice).
    (assert (b is-not a).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 0 (b length).
    (assert 0 (b count).
  ).
  (should "(an-array splice index) returns a new array with element(s) deleted from the original one." (= ()
    (var a (@).
    (var b (a splice 1).
    (assert (b is-not a).
    (assert 0 (a length).
    (assert 0 (b length).

    (let a (@ 1 2).
    (let b (a splice 0).
    (assert (b is-not a).
    (assert 0 (a length).
    (assert 2 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2).
    (let b (a splice -2).
    (assert (b is-not a).
    (assert 0 (a length).
    (assert 2 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2).
    (let b (a splice 1).
    (assert (b is-not a).
    (assert 1 (a length).
    (assert 1 (b length).
    (assert 1 (a 0).
    (assert 2 (b 0).

    (let a (@ 1 2).
    (let b (a splice 2).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 0 (b length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 1 2).
    (a 10 10)
    (let b (a splice 1).
    (assert (b is-not a).
    (assert 1 (a length).
    (assert 1 (a count).
    (assert 10 (b length).
    (assert 2 (b count).

    (let a (@ 1 2).
    (a 100 100)
    (let b (a splice 1).
    (assert (b is-not a).
    (assert 1 (a length).
    (assert 1 (a count).
    (assert 100 (b length).
    (assert 2 (b count).
  ).
  (should "(an-array splice index count) returns a new array with no more than (count) element(s) deleted from the original one." (= ()
    (var a (@).
    (var b (a splice 1 1).
    (assert (b is-not a).
    (assert 0 (a length).
    (assert 0 (b length).

    (let a (@ 1 2 3).
    (let b (a splice 0 2).
    (assert (b is-not a).
    (assert 1 (a length).
    (assert 2 (b length).
    (assert 3 (a 0).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2 3).
    (let b (a splice -3 2).
    (assert (b is-not a).
    (assert 1 (a length).
    (assert 2 (b length).
    (assert 3 (a 0).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2 3).
    (let b (a splice 1 2).
    (assert (b is-not a).
    (assert 1 (a length).
    (assert 2 (b length).
    (assert 1 (a 0).
    (assert 2 (b 0).
    (assert 3 (b 1).

    (let a (@ 1 2 3).
    (let b (a splice -2 2).
    (assert (b is-not a).
    (assert 1 (a length).
    (assert 2 (b length).
    (assert 1 (a 0).
    (assert 2 (b 0).
    (assert 3 (b 1).

    (let a (@ 1 2 3).
    (let b (a splice 2 2).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 1 (b length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (b 0).

    (let a (@ 1 2 3).
    (let b (a splice -1 2).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 1 (b length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (b 0).

    (let a (@ 1 2 3).
    (let b (a splice 4 2).
    (assert (b is-not a).
    (assert 3 (a length).
    (assert 0 (b length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (let a (@ 1 2 3).
    (let b (a splice -4 2).
    (assert (b is-not a).
    (assert 3 (a length).
    (assert 0 (b length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (let a (@ 1 2).
    (a 10 10)
    (a 11 11)
    (a 12 12)
    (let b (a splice 1 11).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 2 (a count).
    (assert 11 (b length).
    (assert 3 (b count).

    (let a (@ 1 2).
    (a 100 100)
    (a 101 101)
    (a 102 102)
    (let b (a splice 1 101).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 2 (a count).
    (assert 101 (b length).
    (assert 3 (b count).
  ).
  (should "(an-array splice index count value ...) works like combination of delete and insert, but returns really deleted elements." (= ()
    (var a (@).
    (var b (a splice 1 2 3 4).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 0 (b length).
    (assert 3 (a 0).
    (assert 4 (a 1).

    (let a (@ 1 2 3).
    (let b (a splice 0 2 100).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 2 (b length).
    (assert 100 (a 0).
    (assert 3 (a 1).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2 3).
    (let b (a splice -3 2 100 200).
    (assert (b is-not a).
    (assert 3 (a length).
    (assert 2 (b length).
    (assert 100 (a 0).
    (assert 200 (a 1).
    (assert 3 (a 2).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2 3).
    (let b (a splice 1 2 100).
    (assert (b is-not a).
    (assert 2 (a length).
    (assert 2 (b length).
    (assert 1 (a 0).
    (assert 100 (a 1).
    (assert 2 (b 0).
    (assert 3 (b 1).

    (let a (@ 1 2 3).
    (let b (a splice -2 2 100 200).
    (assert (b is-not a).
    (assert 3 (a length).
    (assert 2 (b length).
    (assert 1 (a 0).
    (assert 100 (a 1).
    (assert 200 (a 2).
    (assert 2 (b 0).
    (assert 3 (b 1).

    (let a (@ 1 2 3).
    (let b (a splice 2 2 100).
    (assert (b is-not a).
    (assert 3 (a length).
    (assert 1 (b length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 100 (a 2).
    (assert 3 (b 0).

    (let a (@ 1 2 3).
    (let b (a splice -1 2 100 200).
    (assert (b is-not a).
    (assert 4 (a length).
    (assert 1 (b length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 100 (a 2).
    (assert 200 (a 3).
    (assert 3 (b 0).

    (let a (@ 1 2 3).
    (let b (a splice 4 2 100).
    (assert (b is-not a).
    (assert 4 (a length).
    (assert 0 (b length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).
    (assert 100 (a 3).

    (let a (@ 1 2 3).
    (let b (a splice -4 2 100 200).
    (assert (b is-not a).
    (assert 5 (a length).
    (assert 0 (b length).
    (assert 100 (a 0).
    (assert 200 (a 1).
    (assert 1 (a 2).
    (assert 2 (a 3).
    (assert 3 (a 4).

    (let a (@ 1 2).
    (a 10 10)
    (a 11 11)
    (a 12 12)
    (let b (a splice 1 11 5).
    (assert (b is-not a).
    (assert 3 (a length).
    (assert 3 (a count).
    (assert 11 (b length).
    (assert 3 (b count).

    (let a (@ 1 2).
    (a 100 100)
    (a 101 101)
    (a 102 102)
    (let b (a splice 1 101 10 11).
    (assert (b is-not a).
    (assert 4 (a length).
    (assert 4 (a count).
    (assert 101 (b length).
    (assert 3 (b count).
  ).
).

(define "(an-array push ...)" (= ()
  (should "(an-array push) returns the unmodified original array." (= ()
    (var a (@).
    (assert ((a push) is a).
    (assert 0 (a length).

    (let  a (@ 1).
    (assert ((a push) is a).
    (assert 1 (a length).

    (let  a (@ 1 2).
    (assert ((a push) is a).
    (assert 2 (a length).

    (let  a (@ 1 2).
    (a 10 10)
    (assert ((a push) is a).
    (assert 11 (a length).
    (assert 3 (a count).

    (let  a (@ 1 2).
    (a 100 100)
    (assert ((a push) is a).
    (assert 101 (a length).
    (assert 3 (a count).
  ).
  (should "(an-array push value ...) returns the original array with value(s) inserted into the end." (= ()
    (var a (@).
    (assert ((a push 100) is a).
    (assert 1 (a length).
    (assert 100 (a 0).

    (assert ((a push null) is a).
    (assert 2 (a length).
    (assert null (a 1).

    (let  a (@ 1).
    (assert ((a push 100) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 100 (a 1).

    (let  a (@ 1 2).
    (assert ((a push 100 200) is a).
    (assert 4 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 100 (a 2).
    (assert 200 (a 3).

    (let  a (@ 1 2).
    (a 10 10)
    (assert ((a push 11) is a).
    (assert 12 (a length).
    (assert 4 (a count).
    (assert 10 (a 10).
    (assert 11 (a 11).

    (let  a (@ 1 2).
    (a 100 100)
    (assert ((a push 101) is a).
    (assert 102 (a length).
    (assert 4 (a count).
  ).
).

(define "(an-array pop ...)" (= ()
  (should "(an-array pop) returns the last element, and removes it from the array." (= ()
    (var a (@).
    (assert null (a pop).
    (assert 0 (a length).

    (let a (@ 1).
    (assert 1 (a pop).
    (assert 0 (a length).

    (let a (@ 1 2).
    (assert 2 (a pop).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let  a (@ 1 2).
    (a 10 10)
    (a 11 11)
    (assert 12 (a length).
    (assert 4 (a count).
    (assert 11 (a pop).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 10 (a pop).
    (assert 10 (a length).
    (assert 2 (a count).
    (assert null (a pop).
    (assert 9 (a length).
    (assert 2 (a count).

    (let  a (@ 1 2).
    (a 100 100)
    (a 101 101)
    (assert 102 (a length).
    (assert 4 (a count).
    (assert 101 (a pop).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 100 (a pop).
    (assert 100 (a length).
    (assert 2 (a count).
    (assert null (a pop).
    (assert 99 (a length).
    (assert 2 (a count).
  ).
  (should "(an-array pop count) returns the last <count> element(s) and removes them from the array." (= ()
    (var a (@).
    (var b (a pop 0).
    (assert (b is-an array).
    (assert 0 (b length).

    (let b (a pop 1).
    (assert (b is-an array).
    (assert 0 (b length).

    (let b (a pop 2).
    (assert (b is-an array).
    (assert 0 (b length).

    (let a (@ 1).
    (let b (a pop 0).
    (assert 0 (a length).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 1 (b 0).

    (let a (@ 1).
    (let b (a pop 1).
    (assert 0 (a length).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 1 (b 0).

    (let a (@ 1).
    (let b (a pop 2).
    (assert 0 (a length).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 1 (b 0).

    (let a (@ 1 2).
    (let b (a pop -1).
    (assert 1 (a length).
    (assert 1 (a 0).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).

    (let a (@ 1 2).
    (let b (a pop 0).
    (assert 1 (a length).
    (assert 1 (a 0).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).

    (let a (@ 1 2).
    (let b (a pop 1).
    (assert 1 (a length).
    (assert 1 (a 0).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 2 (b 0).

    (let a (@ 1 2).
    (let b (a pop 2).
    (assert 0 (a length).
    (assert (b is-an array).
    (assert 2 (b length).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let  a (@ 1 2).
    (a 10 10)
    (a 11 11)
    (assert 12 (a length).
    (assert 4 (a count).
    (let b (a pop 1).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert (b is-an array).
    (assert 1 (b length).
    (assert 1 (b count).
    (assert 11 (b 0).

    (let  a (@ 1 2).
    (a 100 100)
    (a 101 101)
    (assert 102 (a length).
    (assert 4 (a count).
    (let b (a pop 3).
    (assert 99 (a length).
    (assert 2 (a count).
    (assert (b is-an array).
    (assert 3 (b length).
    (assert 2 (b count).
    (assert null (b 0).
    (assert 100 (b 1).
    (assert 101 (b 2).
  ).
).

(define "(an-array enqueue ...)" (= ()
  (should "(an-array enqueue) returns the unmodified original array." (= ()
    (var a (@).
    (assert ((a enqueue) is a).
    (assert 0 (a length).

    (let  a (@ 1).
    (assert ((a enqueue) is a).
    (assert 1 (a length).

    (let  a (@ 1 2).
    (assert ((a enqueue) is a).
    (assert 2 (a length).

    (let  a (@ 1 2).
    (a 10 10)
    (assert ((a enqueue) is a).
    (assert 11 (a length).
    (assert 3 (a count).

    (let  a (@ 1 2).
    (a 100 100)
    (assert ((a enqueue) is a).
    (assert 101 (a length).
    (assert 3 (a count).
  ).
  (should "(an-array enqueue value ...) insert value(s) into the beginning of the array." (= ()
    (var a (@).
    (assert ((a enqueue 100) is a).
    (assert 1 (a length).
    (assert 100 (a 0).

    (assert ((a enqueue null) is a).
    (assert 2 (a length).
    (assert null (a 0).
    (assert 100 (a 1).

    (let  a (@ 1).
    (assert ((a enqueue 100) is a).
    (assert 2 (a length).
    (assert 100 (a 0).
    (assert 1 (a 1).

    (let  a (@ 1 2).
    (assert ((a enqueue 100 200) is a).
    (assert 4 (a length).
    (assert 100 (a 0).
    (assert 200 (a 1).
    (assert 1 (a 2).
    (assert 2 (a 3).

    (let  a (@ 1 2).
    (a 10 10)
    (assert ((a enqueue 0) is a).
    (assert 12 (a length).
    (assert 4 (a count).
    (assert 0 (a 0).
    (assert 1 (a 1).

    (let  a (@ 1 2).
    (a 100 100)
    (assert ((a enqueue 0 -1 -2) is a).
    (assert 104 (a length).
    (assert 6 (a count).
    (assert 0 (a 0).
    (assert -1 (a 1).
    (assert -2 (a 2).
    (assert 1 (a 3).
  ).
).

(define "(an-array dequeue ...)" (= ()
  (should "(an-array \"dequeue\") is only an alias of (an-array \"pop\")." (= ()
    (var a (@).
    (assert ($(a "dequeue") is (a "pop")).
  ).
).

(define "(an-array reverse)" (= ()
  (should "(an-array reverse) returns the unmodified original array if it is empty or has only one element." (= ()
    (var a (@).
    (assert ((a reverse) is a).
    (assert 0 (a length).

    (var a (@ 1).
    (assert ((a reverse) is a).
    (assert 1 (a length).
    (assert 1 (a 0).
  ).
  (should "(an-array reverse) returns original array and reverses the order of all elements." (= ()
    (var a (@ 1 2).
    (assert ((a reverse) is a).
    (assert 2 (a length).
    (assert 2 (a 0).
    (assert 1 (a 1).

    (let a (@ 1 2 3).
    (assert ((a reverse) is a).
    (assert 3 (a length).
    (assert 3 (a 0).
    (assert 2 (a 1).
    (assert 1 (a 2).

    (let a (@ 1).
    (a 2 2)
    (assert ((a reverse) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 2 (a 0).
    (assert false (a has 1).
    (assert null (a 1).
    (assert 1 (a 2).

    (let a (@ 1).
    (a 100 100)
    (assert ((a reverse) is a).
    (assert 101 (a length).
    (assert 2 (a count).
    (assert 100 (a 0).
    (assert false (a has 1).
    (assert null (a 1).
    (assert false (a has 99).
    (assert null (a 99).
    (assert 1 (a 100).
  ).
).

(define "(an-array sort)" (= ()
  (should "(an-array sort) returns the original array by re-arranging its elements of ascending order." (= ()
    (var a (@).
    (assert ((a sort) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a sort) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1 2).
    (assert ((a sort) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 2 1).
    (assert ((a sort) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 2 3 1).
    (assert ((a sort) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (let a (@ 2).
    (a 2 1)
    (assert ((a sort) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).
    (assert false (a has 2).

    (let a (@ 2).
    (a 100 1)
    (assert ((a sort) is a).
    (assert 101 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).
    (assert false (a has 2).
    (assert null (a 100).
    (assert false (a has 100).
  ).
  (should "(an-array sort ascending) returns the original array by re-arranging its elements of ascending order." (= ()
    (var a (@).
    (assert ((a sort ascending) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a sort ascending) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1 2).
    (assert ((a sort ascending) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 2 1).
    (assert ((a sort ascending) is a).
    (assert 2 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).

    (let a (@ 2 3 1).
    (assert ((a sort ascending) is a).
    (assert 3 (a length).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert 3 (a 2).

    (let a (@ 2).
    (a 2 1)
    (assert ((a sort ascending) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).
    (assert false (a has 2).

    (let a (@ 2).
    (a 100 1)
    (assert ((a sort ascending) is a).
    (assert 101 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).
    (assert false (a has 2).
    (assert null (a 100).
    (assert false (a has 100).
  ).
  (should "(an-array sort descending) returns the original array by re-arranging its elements of descending order." (= ()
    (var a (@).
    (assert ((a sort descending) is a).
    (assert 0 (a length).

    (let a (@ 1).
    (assert ((a sort descending) is a).
    (assert 1 (a length).
    (assert 1 (a 0).

    (let a (@ 1 2).
    (assert ((a sort descending) is a).
    (assert 2 (a length).
    (assert 2 (a 0).
    (assert 1 (a 1).

    (let a (@ 2 1).
    (assert ((a sort descending) is a).
    (assert 2 (a length).
    (assert 2 (a 0).
    (assert 1 (a 1).

    (let a (@ 2 3 1).
    (assert ((a sort descending) is a).
    (assert 3 (a length).
    (assert 3 (a 0).
    (assert 2 (a 1).
    (assert 1 (a 2).

    (let a (@ 2).
    (a 2 1)
    (assert ((a sort descending) is a).
    (assert 3 (a length).
    (assert 2 (a count).
    (assert 2 (a 0).
    (assert 1 (a 1).
    (assert null (a 2).
    (assert false (a has 2).

    (let a (@ 2).
    (a 100 1)
    (assert ((a sort descending) is a).
    (assert 101 (a length).
    (assert 2 (a count).
    (assert 2 (a 0).
    (assert 1 (a 1).
    (assert null (a 2).
    (assert false (a has 2).
    (assert null (a 100).
    (assert false (a has 100).
  ).
  (should "(an-array sort comparer) returns the original array by re-arranging its elements by comparer of ascending order." (= ()
    (var cmp (= (a b) ((a % 10) - (b % 10).
    (var a (@ 12 3 101).
    (assert ((a sort cmp) is a).
    (assert 3 (a length).
    (assert 101 (a 0).
    (assert 12 (a 1).
    (assert 3 (a 2).

    (let cmp (= (a b) ((a % 20) - (b % 20).
    (let a (@ 12 3 101).
    (assert ((a sort cmp) is a).
    (assert 3 (a length).
    (assert 101 (a 0).
    (assert 3 (a 1).
    (assert 12 (a 2).

    (let a (@ 12 3).
    (a 10 101)
    (assert ((a sort cmp) is a).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 101 (a 0).
    (assert 3 (a 1).
    (assert 12 (a 2).
    (assert null (a 3).
    (assert false (a has 3).

    (let a (@ 12 3).
    (a 100 101)
    (assert ((a sort cmp) is a).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 101 (a 0).
    (assert 3 (a 1).
    (assert 12 (a 2).
    (assert null (a 3).
    (assert false (a has 3).
  ).
  (should "(an-array sort ascending comparer) returns the original array by re-arranging its elements by comparer of ascending order." (= ()
    (var cmp (= (a b) ((a % 10) - (b % 10).
    (var a (@ 12 3 101).
    (assert ((a sort ascending cmp) is a).
    (assert 3 (a length).
    (assert 101 (a 0).
    (assert 12 (a 1).
    (assert 3 (a 2).

    (let cmp (= (a b) ((a % 20) - (b % 20).
    (let a (@ 12 3 101).
    (assert ((a sort ascending cmp) is a).
    (assert 3 (a length).
    (assert 101 (a 0).
    (assert 3 (a 1).
    (assert 12 (a 2).

    (let a (@ 12 3).
    (a 10 101)
    (assert ((a sort ascending cmp) is a).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 101 (a 0).
    (assert 3 (a 1).
    (assert 12 (a 2).
    (assert null (a 3).
    (assert false (a has 3).

    (let a (@ 12 3).
    (a 100 101)
    (assert ((a sort ascending cmp) is a).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 101 (a 0).
    (assert 3 (a 1).
    (assert 12 (a 2).
    (assert null (a 3).
    (assert false (a has 3).
  ).
  (should "(an-array sort descending comparer) returns the original array by re-arranging its elements by comparer of descending order." (= ()
    (var cmp (= (a b) ((a % 10) - (b % 10).
    (var a (@ 12 3 101).
    (assert ((a sort descending cmp) is a).
    (assert 3 (a length).
    (assert 3 (a 0).
    (assert 12 (a 1).
    (assert 101 (a 2).

    (let cmp (= (a b) ((a % 20) - (b % 20).
    (let a (@ 12 3 101).
    (assert ((a sort descending cmp) is a).
    (assert 3 (a length).
    (assert 12 (a 0).
    (assert 3 (a 1).
    (assert 101 (a 2).

    (let a (@ 12 3).
    (a 10 101)
    (assert ((a sort descending cmp) is a).
    (assert 11 (a length).
    (assert 3 (a count).
    (assert 12 (a 0).
    (assert 3 (a 1).
    (assert 101 (a 2).
    (assert null (a 3).
    (assert false (a has 3).

    (let a (@ 12 3).
    (a 100 101)
    (assert ((a sort descending cmp) is a).
    (assert 101 (a length).
    (assert 3 (a count).
    (assert 12 (a 0).
    (assert 3 (a 1).
    (assert 101 (a 2).
    (assert null (a 3).
    (assert false (a has 3).
  ).
).

(define "(an-array find ...)" (= ()
  (should "(an-array find) returns indices of all existing elements." (= ()
    (var a (@).
    (var b (a find).
    (assert (b is-an array).
    (assert 0 (b length).

    (let a (@ 1 2).
    (let b (a find).
    (assert (b is-an array).
    (assert 2 (b length).
    (assert 2 (b count).
    (assert 0 (b 0).
    (assert 1 (b 1).

    (let a (@ 1 2).
    (a 10 10)
    (let b (a find).
    (assert (b is-an array).
    (assert 3 (b length).
    (assert 3 (b count).
    (assert 0 (b 0).
    (assert 1 (b 1).
    (assert 10 (b 2).

    (let a (@ 1 2).
    (a 100 100)
    (let b (a find).
    (assert (b is-an array).
    (assert 3 (b length).
    (assert 3 (b count).
    (assert 0 (b 0).
    (assert 1 (b 1).
    (assert 100 (b 2).
  ).
  (should "(an-array find filter) returns indices of all matched elements." (= ()
    (var matched (= x (x >= 3).
    (var a (@).
    (var b (a find).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 0 (b length).

    (let a (@ 4 2 3 1).
    (let b (a find matched).
    (assert (b is-an array).
    (assert 2 (b length).
    (assert 2 (b count).
    (assert 0 (b 0).
    (assert 2 (b 1).

    (let a (@ 4 2 3 1).
    (a 10 10)
    (let b (a find matched).
    (assert (b is-an array).
    (assert 3 (b length).
    (assert 3 (b count).
    (assert 0 (b 0).
    (assert 2 (b 1).
    (assert 10 (b 2).

    (let a (@ 4 2 3 1).
    (a 100 100)
    (let b (a find matched).
    (assert (b is-an array).
    (assert 3 (b length).
    (assert 3 (b count).
    (assert 0 (b 0).
    (assert 2 (b 1).
    (assert 100 (b 2).
  ).
).

(define "(an-array select ...)" (= ()
  (should "(an-array select) returns indices of all existing elements." (= ()
    (var a (@).
    (var b (a select).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 0 (b length).

    (let a (@ 1 2).
    (let b (a select).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 2 (b count).
    (assert 1 (b 0).
    (assert 2 (b 1).

    (let a (@ 1 2).
    (a 10 10)
    (let b (a select).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 3 (b length).
    (assert 3 (b count).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 10 (b 2).

    (let a (@ 1 2).
    (a 100 100)
    (let b (a select).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 3 (b length).
    (assert 3 (b count).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 100 (b 2).
  ).
  (should "(an-array select filter) returns indices of all matched elements." (= ()
    (var matched (= x (x >= 3).
    (var a (@).
    (var b (a select matched).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 0 (b length).

    (let a (@ 4 2 3 1).
    (let b (a select matched).
    (assert (b is-an array).
    (assert 2 (b length).
    (assert 2 (b count).
    (assert 4 (b 0).
    (assert 3 (b 1).

    (let a (@ 4 2 3 1).
    (a 10 10)
    (let b (a select matched).
    (assert (b is-an array).
    (assert 3 (b length).
    (assert 3 (b count).
    (assert 4 (b 0).
    (assert 3 (b 1).
    (assert 10 (b 2).

    (let a (@ 4 2 3 1).
    (a 100 100)
    (let b (a select matched).
    (assert (b is-an array).
    (assert 3 (b length).
    (assert 3 (b count).
    (assert 4 (b 0).
    (assert 3 (b 1).
    (assert 100 (b 2).
  ).
).

(define "(an-array map ...)" (= ()
  (should "(an-array map) returns returns a shallow copy of the original array." (= ()
    (var a (@).
    (var b (a map).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 0 (b length).

    (let a (@ 1 2).
    (let b (a map).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 2 (b length).
    (assert 2 (b count).

    (let a (@ 1 2).
    (a 10 10)
    (let b (a map).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 11 (b length).
    (assert 3 (b count).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 10 (b 10).

    (let a (@ 1 2).
    (a 100 100)
    (let b (a map).
    (assert (b is-an array).
    (assert (b is-not a).
    (assert 101 (b length).
    (assert 3 (b count).
    (assert 1 (b 0).
    (assert 2 (b 1).
    (assert 100 (b 100).
  ).
).

(define "(an-array reduce ...)" (= ()
  (should "(an-array reduce) returns null." (= ()
    (var a (@).
    (assert null (a reduce).

    (a 0 1)
    (a 1 2)
    (assert null (a reduce).

    (a 10 10)
    (assert null (a reduce).

    (a 100 100)
    (assert null (a reduce).
  ).
  (should "(an-array reduce value) returns value." (= ()
    (var a (@).
    (assert null (a reduce null).

    (a 0 1)
    (a 1 2)
    (assert 100 (a reduce 100).

    (a 10 10)
    (assert true (a reduce true).

    (a 100 100)
    (assert "xyz" (a reduce "xyz").
  ).
  (should "(an-array reduce reducer) returns the last value returned by reducer with a null a the initial value." (= ()
    (let summing (= (s v i) ((s ?? 100) + v i).
    (var a (@).
    (assert null (a reduce summing).

    (let a (@ 1 2).
    (assert 104 (a reduce summing).

    (a 10 10)
    (assert 124 (a reduce summing).

    (a 100 100)
    (assert 324 (a reduce summing).
  ).
  (should "(an-array reduce value reducer) returns the last value returned by reducer with the initial value." (= ()
    (var called 0).
    (var summing (=> (s v i) (called ++) (s + v i).
    (var a (@).
    (assert 100 (a reduce 100 summing).
    (assert 0 called)

    (let a (@ 1 2).
    (let called 0).
    (assert 109 (a reduce 105 summing).
    (assert 2 called)

    (a 10 10)
    (let called 0).
    (assert 134 (a reduce 110 summing).
    (assert 3 called)

    (a 100 100)
    (let called 0).
    (assert 344 (a reduce 120 summing).
    (assert 4 called)
  ).
).

(define "(an-array join ...)" (= ()
  (should "(an-array join) returns a string of whitespace-separated all stringified (string of ..) element values." (= ()
    (var a (@).
    (assert "" (a join).

    (let a (@ 1).
    (assert "1" (a join).

    (let a (@ 1 "2").
    (assert "1 2" (a join).

    (a 3 3)
    (assert "1 2 * 3" (a join).

    (a 6 6)
    (assert "1 2 * 3 * * 6" (a join).

    (a 6 6)
    (assert "1 2 * 3 * * 6" (a join).

    (a 10 10)
    (assert "1 2 * 3 * * 6 * * * 10" (a join).

    (a 15 15)
    (assert "1 2 * 3 * * 6 * * * 10 ... 15" (a join).

    (a 100 100)
    (let called 0).
    (assert "1 2 * 3 * * 6 * * * 10 ... 15 ... 100" (a join).
  ).
  (should "(an-array join separator) returns a string of all stringified (string of ..) element values." (= ()
    (var a (@).
    (assert "" (a join ", ").

    (let a (@ 1).
    (assert "1" (a join ", ").

    (let a (@ 1 "2").
    (assert "1, 2" (a join ", ").

    (a 3 3)
    (assert "1, 2, *, 3" (a join ", ").

    (a 6 6)
    (assert "1, 2, *, 3, *, *, 6" (a join ", ").

    (a 10 10)
    (assert "1, 2, *, 3, *, *, 6, *, *, *, 10" (a join ", ").

    (a 15 15)
    (assert "1, 2, *, 3, *, *, 6, *, *, *, 10, ..., 15" (a join ", ").

    (a 100 100)
    (let called 0).
    (assert "1, 2, *, 3, *, *, 6, *, *, *, 10, ..., 15, ..., 100" (a join ", ").
  ).
).

(define "(an-array to-code ...)" (= ()
  (should "(an-array to-code) returns the code of an array." (= ()
    (var code ((@ 1  2  3) to-code).
    (assert (code is-a tuple).
    (assert 4 (code length).
    (assert "(@ 1 2 3)" (code to-string).
  ).
  (should "(an-array to-code) returns the code of an discrete array if it's discrete." (= ()
    (var code ((@ 10:10 2 100:100) to-code).
    (assert (code is-a tuple).
    (assert 8 (code length).
    (assert "(@ 10: 10 2 100: 100)" (code to-string).

    (var arr (@ 1 2).
    (arr 10 10)
    (var code (arr to-code).
    (assert (code is-a tuple).
    (assert 6 (code length).
    (assert "(@ 1 2 10: 10)" (code to-string).

    (let arr (code).
    (assert (arr is-an array).
    (assert 11 (arr length).
    (assert 3 (arr count).
    (assert 1 (arr 0).
    (assert 2 (arr 1).
    (assert 10 (arr 10).
  ).
  (should "(an-array to-code) returns the code of an discrete array if it's sparse." (= ()
    (var arr (@ 1 2).
    (arr 100 100)
    (var code (arr to-code).
    (assert (code is-a tuple).
    (assert 6 (code length).
    (assert "(@ 1 2 100: 100)" (code to-string).

    (let arr (code).
    (assert (arr is-an array).
    (assert 101 (arr length).
    (assert 3 (arr count).
    (assert 1 (arr 0).
    (assert 2 (arr 1).
    (assert 100 (arr 100).
  ).
  (should "(an-array to-code) returns the code of a lambda if it contains itself." (= ()
    (var arr (@ 1 2).
    (arr push(arr).
    (var code (arr to-code).
    (var str (+
      "(=>: ()\n"
      "  (local _ (@ (@)))\n"
      "  ((_ 0) append (@ 1 2 (_ 0)))\n"
      ")"
    ).
    (assert (code is-a tuple).
    (assert 4 (code length).
    (assert 2 ((code 3) length).
    (assert str (code to-string).

    (let arr (code).
    (assert 1 (arr 0).
    (assert 2 (arr 1).
    (assert arr (arr 2).
  ).
  (should "(an-array to-code) returns the code of a lambda if it contains multiple copies of another array." (= ()
    (var item (@ 1 2).
    (let arr (@ item item).
    (var code (arr to-code).
    (var str (+
      "(=>: ()\n"
      "  (local _ (@ (@)))\n"
      "  ((_ 0) append (@ 1 2))\n"
      "  (@ (_ 0) (_ 0))\n"
      ")"
    ).
    (assert (code is-a tuple).
    (assert 4 (code length).
    (assert 3 ((code 3) length).
    (assert str (code to-string).

    (let arr (code).
    (let item (arr 0).
    (assert item (arr 0).
    (assert item (arr 1).
  ).
  (should "(an-array to-code) returns the code of a lambda if it's a composite array." (= ()
    (var arr (@).
    (var item (@ 1 arr 2).
    (arr push 1 item (@ 2 item).
    (var code (arr to-code).
    (var str (+
      "(=>: ()\n"
      "  (local _ (@ (@) (@)))\n"
      "  ((_ 1) append (@ 1 (_ 0) 2))\n"
      "  ((_ 0) append (@ 1 (_ 1) (@ 2 (_ 1))))\n"
      ")"
    ).
    (assert (code is-a tuple).
    (assert 4 (code length).
    (assert 3 ((code 3) length).
    (assert str (code to-string).

    (let arr (code).
    (let item (arr 1).
    (assert 1 (item 0).
    (assert arr (item 1).
    (assert 2 (item 2).
    (assert 1 (arr 0).
    (assert 2 ((arr 2) 0).
    (assert item ((arr 2) 1).
  ).
).

(define "(an-array: ...)" (= ()
  (should "(an-array: field value) returns the offset of the first occurrence of value which is not number, string or symbol." (= ()
    (var r (1 10).
    (var t (`(1 2).
    (var l (= x x).
    (var f (=> x x).
    (var opr (=? X (X).
    (var arr (@ 1 2).
    (var obj (@ x:1).
    (var src (@ true r t l f opr arr obj).
    (assert 0 (src: true).
    (assert 1 (src: r).
    (assert 2 (src: t).
    (assert 3 (src: l).
    (assert 4 (src: f).
    (assert 5 (src: opr).
    (assert 6 (src: arr).
    (assert 7 (src: obj).
  ).
).
