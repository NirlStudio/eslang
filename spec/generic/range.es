(var * (load "./share/type" (@ the-type: range).

(define "Range Common Behaviors" (=> ()
  (define "Identity" (= ()
    (should "a range is identified by its number values of fields: begin, end, step" (= ()
      (assert ((range of 0) is (range of -0).
      (assert false ((range of 0) is-not (range of -0).

      (assert ((range of 10 0) is (range of 10 -0).
      (assert false ((range of 10 0) is-not (range of 10 -0).
    ).
  ).

  (define "Equivalence" (= ()
    (should "a range's equivalence is defined as the same of its identity." (= ()
      (var r (range of 1 10).
      (assert ($(r "is") is (r "equals").
      (assert ($(r "is-not") is (r "not-equals").
    ).
  ).

  (define "Ordering" (= ()
    (should "a range cannot be compared with another range which is not a subset, or vice versa." (= ()
      (assert null ((range of 1 10) compares-to).
      (assert null ((range of 1 10) compares-to null).

      (assert null ((range of 1 10) compares-to (range of 10 1).
      (assert null ((range of -10 -1) compares-to (range of -1 -10).
      (assert null ((range of -10 10) compares-to (range of 10 -10).

      (assert null ((range of 1 10) compares-to (range of 2 11).
      (assert null ((range of -10 -1) compares-to (range of -11 -2).
      (assert null ((range of -10 10) compares-to (range of -9 11).
    ).
    (should "a range cannot be compared with another range having different step value." (= ()
      (assert null ((range of 1 10 1) compares-to (range of 1 10 2).
      (assert null ((range of -10 -1 1) compares-to (range of -10 -1 2).
      (assert null ((range of -10 10 1) compares-to (range of -10 10 2).

      (assert null ((range of 10 1 -1) compares-to (range of 10 1 -2).
      (assert null ((range of -1 -10 -1) compares-to (range of -1 -10 -2).
      (assert null ((range of 10 -10 -1) compares-to (range of 10 -10 -2).
    ).
  ).

  (define "Emptiness" (= ()
    (should "a range is defined as empty if its end equals its begin." (= ()
      (assert ((range of 0 0) is-empty).
      (assert false ((range of 0 0) not-empty).

      (assert ((range of 1 1) is-empty).
      (assert false ((range of 1 1) not-empty).

      (assert ((range of -1 -1) is-empty).
      (assert false ((range of -1 -1) not-empty).
    ).
    (should "a range is defined as empty if its end is less than its begin, when its step > 0." (= ()
      (assert ((range of 0 -10 1) is-empty).
      (assert false ((range of 0 -10 1) not-empty).

      (assert ((range of 10 0 1) is-empty).
      (assert false ((range of 10 0 1) not-empty).

      (assert ((range of 10 -10 1) is-empty).
      (assert false ((range of 10 -10 1) not-empty).
    ).
    (should "a range is defined as empty if its end is greater than its begin, when its step < 0." (= ()
      (assert ((range of 0 10 -1) is-empty).
      (assert false ((range of 0 10 -1) not-empty).

      (assert ((range of -10 0 -1) is-empty).
      (assert false ((range of -10 0 -1) not-empty).

      (assert ((range of -10 10 -1) is-empty).
      (assert false ((range of -10 10 -1) not-empty).
    ).
  ).

  (define "Encoding" (=> ()
    (should "a range is encoded to itself." (=> ()
      (for value
          in (the-values concat (range empty).
        (assert value (value to-code).
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "a range is represented as (begin end step)." (=> ()
      (assert "(0 10 1)" ((range of 0 10 1) to-string).
      (assert "(0 10 1)" ((range of -0 10 1) to-string).
      (assert "(0 10 -1)" ((range of 0 10 -1) to-string).

      (assert "(-10 0 1)" ((range of -10 0 1) to-string).
      (assert "(-10 0 1)" ((range of -10 -0 1) to-string).
      (assert "(-10 0 -1)" ((range of -10 0 -1) to-string).

      (assert "(-10 10 1)" ((range of -10 10 1) to-string).
      (assert "(-10 10 -1)" ((range of -10 10 -1) to-string).
    ).
  ).
).

(define "(range empty)" (= ()
  (should "(range empty) is a range of (0 0 1)." (=
    (assert 0 ((range empty) begin).
    (assert 0 ((range empty) end).
    (assert 1 ((range empty) step).

    (assert (0 0 1) (range empty).
    (assert (range of 0 0 1) (range empty).
  ).
).

(define "(range of ...)" (= ()
  (should "(range of) and (range of null) return (range empty)." (= ()
    (assert (range empty) (range of).
    (assert (range empty) (range of null).
    (assert (range empty) (range of null null).
    (assert (range empty) (range of null null null).
  ).
  (should "(range of end-value) assumes the begin value is 0 and try to use a step of 1 or -1." (= ()
    (assert (0 0 1) (range of 0).
    (assert (0 10 1) (range of 10).
    (assert (0 -10 -1) (range of -10).
  ).
  (should "(range of begin end) use 1 as the step value if end >= begin." (= ()
    (assert (0 0 1) (range of 0 0).

    (assert (0 1 1) (range of 0 1).
    (assert (0 10 1) (range of 0 10).

    (assert (-1 0 1) (range of -1 0).
    (assert (-10 0 1) (range of -10 0).

    (assert (-10 10 1) (range of -10 10).
    (assert (-10 10 1) (range of -10 10).
  ).
  (should "(range of begin end) use -1 as the step value if end < begin." (= ()
    (assert (1 0 -1) (range of 1 0).
    (assert (10 0 -1) (range of 10 0).

    (assert (0 -1 -1) (range of 0 -1).
    (assert (0 -10 -1) (range of 0 -10).

    (assert (10 -10 -1) (range of 10 -10).
    (assert (10 -10 -1) (range of 10 -10).
  ).
  (should "(range of begin end step) return a range like (begin end step)." (= ()
    (assert (1 10 1) (range of 1 10 1).
    (assert (1 10 -1) (range of 1 10 -1).
    (assert (1 10 2) (range of 1 10 2).
    (assert (1 10 -2) (range of 1 10 -2).

    (assert (-1 -10 1) (range of -1 -10 1).
    (assert (-1 -10 -1) (range of -1 -10 -1).
    (assert (-1 -10 2) (range of -1 -10 2).
    (assert (-1 -10 -2) (range of -1 -10 -2).
  ).
  (should "(range of begin end 0) use 1 as the step if end >= begin." (= ()
    (assert (0 0 1) (range of 0 0 0).

    (assert (0 1 1) (range of 0 1 0).
    (assert (0 10 1) (range of 0 10 0).

    (assert (-1 0 1) (range of -1 0 0).
    (assert (-10 0 1) (range of -10 0 0).

    (assert (-10 10 1) (range of -10 10 0).
    (assert (-10 10 1) (range of -10 10 0).
  ).
  (should "(range of begin end 0) use -1 as the step value if end < begin." (= ()
    (assert (1 0 -1) (range of 1 0 0).
    (assert (10 0 -1) (range of 10 0 0).

    (assert (0 -1 -1) (range of 0 -1 0).
    (assert (0 -10 -1) (range of 0 -10 0).

    (assert (10 -10 -1) (range of 10 -10 0).
    (assert (10 -10 -1) (range of 10 -10 0).
  ).
  (should "an invalid or infinite begin, end or step value will be treated as 0." (= ()
    (assert (0 10 1) (range of (number invalid) 10).
    (assert (0 10 1) (range of (number infinite) 10).
    (assert (0 10 1) (range of (number -infinite) 10).

    (assert (10 0 -1) (range of 10 (number invalid).
    (assert (10 0 -1) (range of 10 (number infinite).
    (assert (10 0 -1) (range of 10 (number -infinite).

    (assert (0 10 1) (range of 0 10 (number invalid).
    (assert (0 10 1) (range of 0 10 (number infinite).
    (assert (0 10 1) (range of 0 10 (number -infinite).
  ).
).

(define "range's fields" (= ()
  (should "(a-range begin) returns the begin (including) value of this range." (= ()
    (assert 1 ((range of 1 2 3) begin).
  ).
  (should "(a-range end) returns the end (excluding) value of this range." (= ()
    (assert 2 ((range of 1 2 3) end).
  ).
  (should "(a-range step) returns the step value of this range." (= ()
    (assert 3 ((range of 1 2 3) step).
  ).
  (should "range's fields are immutable." (= ()
    (var r (range of 1 2 3).
    (assert 1 (r begin 10).
    (assert 1 (r begin).

    (assert 2 (r end 20).
    (assert 2 (r end).

    (assert 3 (r step 20).
    (assert 3 (r step).
  ).
).

(define "(a-range count)" (= ()
  (should "(a-range count) returns 0 for an empty range." (= ()
    (assert 0 ((range empty) count).

    (assert 0 ((range of 0 0) count).
    (assert 0 ((range of 1 1) count).
    (assert 0 ((range of -1 -1) count).

    (assert 0 ((range of 10 0 1) count).
    (assert 0 ((range of 0 -10 1) count).
  ).
  (should "(a-range count) returns the count of values for an non-empty range." (= ()
    (assert 10 ((range of 0 10 1) count).
    (assert 5 ((range of 0 10 2) count).
    (assert 4 ((range of 0 10 3) count).
    (assert 9 ((range of 1 10 1) count).
    (assert 5 ((range of 1 10 2) count).
    (assert 3 ((range of 1 10 3) count).

    (assert 10 ((range of 10 0 -1) count).
    (assert 5 ((range of 10 0 -2) count).
    (assert 4 ((range of 10 0 -3) count).
    (assert 9 ((range of 10 1 -1) count).
    (assert 5 ((range of 10 1 -2) count).
    (assert 3 ((range of 10 1 -3) count).

    (assert 10 ((range of -10 0 1) count).
    (assert 5 ((range of -10 0 2) count).
    (assert 4 ((range of -10 0 3) count).
    (assert 9 ((range of -10 -1 1) count).
    (assert 5 ((range of -10 -1 2) count).
    (assert 3 ((range of -10 -1 3) count).

    (assert 10 ((range of 0 -10 -1) count).
    (assert 5 ((range of 0 -10 -2) count).
    (assert 4 ((range of 0 -10 -3) count).
    (assert 9 ((range of -1 -10 -1) count).
    (assert 5 ((range of -1 -10 -2) count).
    (assert 3 ((range of -1 -10 -3) count).
  ).
).

(define "(a-range iterate)" (= ()
  (should "(a-range iterate) always returns an iterator function for a range." (= ()
    (assert ($((range empty) iterate) is-a function).

    (assert ($((range of 0 0) iterate) is-a function).
    (assert ($((range of 1 1) iterate) is-a function).
    (assert ($((range of -1 -1) iterate) is-a function).

    (assert ($((range of 10 0 1) iterate) is-a function).
    (assert ($((range of 0 -10 1) iterate) is-a function).

    (assert ($((range of 0 10) iterate) is-a function).
    (assert ($((range of 10 0 -1) iterate) is-a function).

    (assert ($((range of -10 0 1) iterate) is-a function).
    (assert ($((range of 0 -10 -1) iterate) is-a function).
  ).
  (should "(an-empty-iterator) always returns null." (= ()
    (assert null (((range empty) iterate).

    (assert null (((range of 0 0) iterate).
    (assert null (((range of 1 1) iterate).
    (assert null (((range of -1 -1) iterate).

    (assert null (((range of 10 0 1) iterate).
    (assert null (((range of 0 -10 1) iterate).
  ).
  (should "(a-non-empty-iterator) returns all values in its original range sequentially, then returns null after the last value." (= ()
    (var iter ((range of 0 3) iterate).
    (assert 0 (iter).
    (assert 1 (iter).
    (assert 2 (iter).
    (assert null (iter).
    (assert null (iter).

    (let iter ((range of -3 0) iterate).
    (assert -3 (iter).
    (assert -2 (iter).
    (assert -1 (iter).
    (assert null (iter).
    (assert null (iter).

    (let iter ((range of 3 0 -1) iterate).
    (assert 3 (iter).
    (assert 2 (iter).
    (assert 1 (iter).
    (assert null (iter).
    (assert null (iter).

    (let iter ((range of 0 -3 -1) iterate).
    (assert 0 (iter).
    (assert -1 (iter).
    (assert -2 (iter).
    (assert null (iter).
    (assert null (iter).
  ).
  (should "(a-non-empty-iterator true) still returns the first value if iter is being called for the first time." (= ()
    (assert 0 (((range of 0 3) iterate) true).
    (assert 1 (((range of 1 3) iterate) true).
    (assert -1 (((range of -1 3) iterate) true).
  ).
  (should "(a-non-empty-iterator true) returns last value if iter is being called other than the first time." (= ()
    (var iter ((range of 0 3) iterate).
    (assert 0 (iter).
    (assert 0 (iter true).
    (assert 1 (iter).
    (assert 1 (iter true).
    (assert 2 (iter).
    (assert 2 (iter true).
    (assert null (iter).
    (assert 2 (iter true).
    (assert null (iter).
    (assert 2 (iter true).
  ).
).

(define "(a-range compares-to b-range)" (=> ()
  (should "(a-range compares-to b-range) returns 0 if a-range and b-range are identical." (= ()
    (assert 0 ((range of 1) compares-to (range of 1).
    (assert 0 ((range of 1 2) compares-to (range of 1 2).
    (assert 0 ((range of 1 2 3) compares-to (range of 1 2 3).
  ).
  (should "(a-range compares-to b-range) returns 1 if values in b-range is a subset of values in a-range." (= ()
    (assert 1 ((range of 1 10) compares-to (range of 1 9).
    (assert 1 ((range of 1 10) compares-to (range of 2 10).
    (assert 1 ((range of 1 10) compares-to (range of 2 9).

    (assert 1 ((range of -1 -10) compares-to (range of -1 -9).
    (assert 1 ((range of -1 -10) compares-to (range of -2 -10).
    (assert 1 ((range of -1 -10) compares-to (range of -2 -9).
  ).
  (should "(a-range compares-to b-range) returns -1 if values in a-range is a subset of values in b-range." (= ()
    (assert -1 ((range of 1 9) compares-to (range of 1 10).
    (assert -1 ((range of 2 10) compares-to (range of 1 10).
    (assert -1 ((range of 2 9) compares-to (range of 1 10).

    (assert -1 ((range of -1 -9) compares-to (range of -1 -10).
    (assert -1 ((range of -2 -10) compares-to (range of -1 -10).
    (assert -1 ((range of -2 -9) compares-to (range of -1 -10).
  ).
  (should "(a-range compares-to b-range) returns null if either of them is not the other's subset." (= ()
    (assert null ((range of 1 4) compares-to (range of 5 9).
    (assert null ((range of 5 9) compares-to (range of 1 4).

    (assert null ((range of 1 5) compares-to (range of 4 9).
    (assert null ((range of 4 9) compares-to (range of 1 5).

    (assert null ((range of -1 -4) compares-to (range of -5 -9).
    (assert null ((range of -5 -9) compares-to (range of -1 -4).

    (assert null ((range of -1 -5) compares-to (range of -4 -9).
    (assert null ((range of -4 -9) compares-to (range of -1 -5).
  ).
).
