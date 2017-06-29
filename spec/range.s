(let the-type range)
(let the-value (0 0 1),
(include "type_")

(define "Common Behaviours" (= ()
  (define "Identity" (=> ()
    (should "a range is identified by its fields: begin, end, step" (= ()
      (assert ((range of 1) is (range of 1),
      (assert false ((range of 1) is-not (range of 1),
      (assert ((range of 1) is-not (range of 2),

      (assert ((range of 1 2) is (range of 1 2),
      (assert false ((range of 1 2) is-not (range of 1 2),
      (assert ((range of 1 2) is-not (range of 2 1),

      (assert ((range of 1 2 3) is (range of 1 2 3),
      (assert false ((range of 1 2 3) is-not (range of 1 2 3),
      (assert ((range of 1 2 3) is-not (range of 3 2 1),
    ),
  ),

  (define "Equivalence" (=> ()
    (should "true is equivalent with other ranges with the same fields." (=> ()
      (assert ((range of 1) equals (range of 1),
      (assert false ((range of 1) not-equals (range of 1),
      (assert ((range of 1) not-equals (range of 2),

      (assert ((range of 1 2) equals (range of 1 2),
      (assert false ((range of 1 2) not-equals (range of 1 2),
      (assert ((range of 1 2) not-equals (range of 2 1),

      (assert ((range of 1 2 3) equals (range of 1 2 3),
      (assert false ((range of 1 2 3) not-equals (range of 1 2 3),
      (assert ((range of 1 2 3) not-equals (range of 3 2 1),
  ),

  (define "Equivalence (operators)" (=> ()
    (should "true is equivalent with other ranges with the same fields." (=> ()
      (assert ((range of 1) == (range of 1),
      (assert false ((range of 1) != (range of 1),
      (assert ((range of 1) != (range of 2),

      (assert ((range of 1 2) == (range of 1 2),
      (assert false ((range of 1 2) != (range of 1 2),
      (assert ((range of 1 2) != (range of 2 1),

      (assert ((range of 1 2 3) == (range of 1 2 3),
      (assert false ((range of 1 2 3) != (range of 1 2 3),
      (assert ((range of 1 2 3) != (range of 3 2 1),
  ),

  (define "Ordering" (=> ()
    (should "a range is only comparable with equivalent ranges." (=> ()
      (assert 0 ((range of 1) compare (range of 1),
      (assert 0 ((range of 1 2) compare (range of 1 2),
      (assert 0 ((range of 1 2 3) compare (range of 1 2 3),

      (assert null ((range of 1) compare (range of 2),
      (assert null ((range of 1 2) compare (range of 2 1),
      (assert null ((range of 1 2 3) compare (range of 3 2 1),
    ),
  ),

  (define "Emptiness" (=> ()
    (should "A range is defined as empty if it cannot produce any value when iterating." (=> ()
      (assert ((range empty) is-empty),
      (assert null (((range empty) iterate ),

      (assert ((range of 0 0 1) is-empty),
      (assert false ((range of 0 0 1) not-empty),

      (assert false ((range of 0 1 1) is-empty),
      (assert ((range of 0 1 1) not-empty),
  ),

  (define "Encoding" (=> ()
    (should "a range is encoded to itself." (=> ()
      (assert (range of 0 0 1) ((range of 0 0 1) to-code),
      (assert (range of 0 1 1) ((range of 0 1 1) to-code),
      (assert (range of 0 5 2) ((range of 0 5 2) to-code),
    ),
  ),

  (define "Representation" (=> ()
    (should "a range is represented as (begin end step)." (=> ()
      (assert "(0 0 1)" ((range of 0 0 1) to-string),
      (assert "(0 1 1)" ((range of 0 1 1) to-string),
      (assert "(0 5 2)" ((range of 0 5 2) to-string),
    ),
  ),
).

(define "Value Conversion" (= ()
  (should "(range of value) returns a range like (0 value +/-1)" (= ()
    (assert (0 10 1) (range of 10),
    (assert (0 -10 -1) (range of -10),
    (assert (0 0 1) (range of 0),
  ),
  (should "(range of begin end) return a range like (begin end +/-1)." (= ()
    (assert (1 10 1) (range of 1 10),
    (assert (10 1 -1) (range of 10 1),
    (assert (1 1 1) (range of 1 1),

    (assert ((0 10) is-a range),
    (assert (1 10 1) (1 10),
    (assert (10 1 -1) (10 1),
    (assert (1 1 1) (1 1),
  ),
  (should "(range of begin end step) return a range like (begin end step)." (= ()
    (assert (1 10 1) (range of 1 10 1),
    (assert (1 10 2) (range of 1 10 2),
    (assert (10 1 -1) (range of 10 1 -1),
    (assert (10 1 2) (range of 10 1 2),
    (assert (1 1 5) (range of 1 1 5),
  ),
  (should "a zero-step value will be replaced to 1 or -1." (= ()
    (assert (1 10 1) (range of 1 10 0),
    (assert (10 1 -1) (range of 10 1 0),
    (assert (1 1 1) (range of 1 1 0),
  ),
).

(define "Object Fields" (= ()
  (define "the fields of range is readable." (= ()
    (should "(a-range begin) returns the begin field." (= ()
      (assert 2 ((2 3 4) begin),
    ),
    (should "(a-range end) returns the end field." (= ()
      (assert 3 ((2 3 4) end),
    ),
    (should "(a-range step) returns the step field." (= ()
      (assert 4 ((2 3 4) step),
    ),
  ),
  (define "the fields of range is read-only." (= ()
    (should "(a-range begin) returns the begin field." (= ()
      (assert 2 ((2 3 4) begin 20),
    ),
    (should "(a-range end) returns the end field." (= ()
      (assert 3 ((2 3 4) end 30),
    ),
    (should "(a-range step) returns the step field." (= ()
      (assert 4 ((2 3 4) step 40),
    ),
  ),
).

(define "Value Iteration" (= ()
  (define "iterate" (= ()
    (should "(a-range iterate) returns an iterator function." (= ()
      (assert (:((0 10) iterate) is-a function),
      (assert (:((0 0) iterate) is-a function),
    ),
    (should "each call to iterator function returns the next value." (= ()
      (let next ((0 3) iterate),
      (assert 0 (next ),
      (assert 1 (next ),
      (assert 2 (next ),
      (assert null (next ),
    ),
    (should "an in-situ call to iterator function returns the current value." (= ()
      (let next ((0 0) iterate),
      (assert null (next),
      (assert null (next true),

      (let next ((0 0) iterate),
      # the insitu value will be ignored for the first call.
      (assert null (next true),
      (assert null (next true),

      (let next ((1 2) iterate),
      (assert 1 (next),
      (assert 1 (next true),
      (assert null (next),

      (let next ((1 2) iterate),
      # the insitu value will be ignored for the first call.
      (assert 1 (next true),
      (assert 1 (next true),
      (assert null (next),

      (let next ((0 3) iterate),
      (assert 0 (next),
      (assert 0 (next true),
      (assert 0 (next true),
      (assert 1 (next ),
      (assert 1 (next true),
      (assert 1 (next true),
      (assert 2 (next ),
      (assert 2 (next true),
      (assert 2 (next true),
      (assert null (next ),
    ),
    (should "a null will be returned by the iterator to indicate of ending." (= ()
      (let next ((0 0) iterate),
      (assert null (next ),

      (let next ((100 200 1000) iterate),
      (assert 100 (next ),
      (assert null (next ),
    ),
  ),
).
