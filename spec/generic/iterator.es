(var * (load "./share/type" (@ the-type: iterator).

(define "Iterator Common Behaviors" (=> ()
  (define "Identity" (= ()
    (should "all empty iterators are the same instance." (= ()
      (assert ((iterator empty) is (iterator empty).
      (assert false ((iterator empty) is-not (iterator empty).

      (assert ((iterator of) is (iterator of).
      (assert false ((iterator of) is-not (iterator of).

      (assert ((iterator of-unsafe) is (iterator of-unsafe).
      (assert false ((iterator of-unsafe) is-not (iterator of-unsafe).
    ).
  ).

  (define "Equivalence" (= ()
    (should "iterators' equivalence is defined by their identity." (= ()
      (var iter (iterator of (@1 2 10: 10 100: 100).
      (assert ($(iter "equals") is (iter "is").
      (assert ($(iter "not-equals") is (iter "is-not").
    ).
  ).

  (define "Ordering" (=> ()
    (should "comparison of an iterator with itself returns 0." (=> ()
      (for a in (the-values concat (@) (@))
        (assert 0 (a compares-to a).
      ).
    ).
    (should "comparison of two different iterators return null." (=> ()
      (var values (the-values concat (@) (@).
      (for a in values
        (for b in values
          (if (a is-not b)
            (assert null (a compares-to b).
      ).
    ).
  ).

  (define "Emptiness" (= ()
    (should "an iterator is defined as empty if its iterate function is null." (= ()
      (assert ((iterator empty) is-empty).
      (assert false ((iterator empty) not-empty).

      (assert ((iterator of) is-empty).
      (assert false ((iterator of) not-empty).

      (assert ((iterator of null) is-empty).
      (assert false ((iterator of null) not-empty).

      (assert ((iterator of-unsafe) is-empty).
      (assert false ((iterator of-unsafe) not-empty).

      (assert ((iterator of-unsafe null) is-empty).
      (assert false ((iterator of-unsafe null) not-empty).
    ).
  ).

  (define "Encoding" (=> ()
    (should "an empty iterator is encoded to tuple (iterator empty)." (= ()
      (var code ((iterator empty) to-code).
      (assert (code is-a tuple).
      (assert 2 (code length).
      (assert (`iterator) (code 0).
      (assert (`empty) (code 1).
    ).
    (should "a non-empty iterator is encoded to tuple (iterator of ...)." (=> ()
      (for value in the-values
        (var code (value to-code).
        (assert (code is-a tuple).
        (assert 3 (code length).
        (assert (`iterator) (code 0).
        (assert (`of) (code 1).
        (assert ((code 2) is-a tuple).
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "an empty iterator is described as '(iterator empty)'." (= ()
      (assert "(iterator empty)" ((iterator empty) to-string).
    ).
    (should "a non-empty iterator is described as '(iterator of (@ ...))'." (=> ()
      (for value in the-values
        (assert ((value to-string) starts-with "(iterator of (",
    ).
  ).
).

(define "(iterator empty)" (= ()
  (should "((iterator empty) iterate) returns null." (= ()
    (assert null ((iterator empty) iterate).
  ).
).

(define "(iterator of ...)" (= ()
  (should "(iterator of) returns (iterator empty)." (= ()
    (assert (iterator empty) (iterator of).
  ).
  (should "(iterator of iterable) returns non-empty iterator." (= ()
    (var iter (iterator of (@).
    (assert (iter is-an iterator).
    (assert (iter is-not (iterator empty).
    (assert ($(iter iterate) is-a function).
    (assert null ((iter iterate)).

    (let iter (iterator of (@ 100).
    (assert (iter is-an iterator).
    (assert (iter is-not (iterator empty).
    (assert ($(iter iterate) is-a function).
    (assert 100 (((iter iterate)) 0).
    (assert null ((iter iterate)).
  ).
).

(define "(iterator of-unsafe ...)" (= ()
  (should "(iterator of-unsafe) returns (iterator empty)." (= ()
    (assert (iterator empty) (iterator of-unsafe).
  ).
  (should "(iterator of-unsafe iterable) returns non-empty iterator." (= ()
    (var iter (iterator of-unsafe (@).
    (assert (iter is-an iterator).
    (assert (iter is-not (iterator empty).
    (assert ($(iter iterate) is-a function).
    (assert null ((iter iterate)).

    (let iter (iterator of-unsafe (@ 100).
    (assert (iter is-an iterator).
    (assert (iter is-not (iterator empty).
    (assert ($(iter iterate) is-a function).
    (assert 100 (((iter iterate)) 0).
    (assert null ((iter iterate)).
  ).
  (should "(iterator of-unsafe iterable) can stop when a repeated element detected." (= ()
    (var v 3)
    (var iter (iterator of-unsafe (=>() ((v > 0) ? (v --) v).
    (assert (iter is-an iterator).
    (assert (iter is-not (iterator empty).
    (assert ($(iter iterate) is-a function).
    (assert 3 ((iter iterate)).
    (assert 2 ((iter iterate)).
    (assert 1 ((iter iterate)).
    (assert 0 ((iter iterate)).
    (assert null ((iter iterate)).
  ).
).

(define "(an-iterator iterate)" (= ()
  (should "(empty-iter iterate) returns null." (= ()
    (assert null ((iterator empty) iterate).
  ).
  (should "(iter iterate) returns the inner next function of this iterator." (= ()
    (var next (= () null).
    (var iter (iterator of next).
    (assert next (iter iterate).
  ).
).

(define "(an-iterator skip ...)" (= ()
  (should "(empty-iter skip) returns the same empty iterator." (= ()
    (assert (iterator empty) ((iterator empty) skip).
    (assert null ((iterator empty) iterate).
  ).
  (should "(empty-iter skip count) always returns the same empty iterator." (= ()
    (assert (iterator empty) ((iterator empty) skip -1).
    (assert (iterator empty) ((iterator empty) skip 0).
    (assert (iterator empty) ((iterator empty) skip 1).
    (assert null ((iterator empty) iterate).
  ).
  (should "(iter skip) returns this iterator without modification." (= ()
    (var next (= () null).
    (var iter (iterator of next).
    (assert iter (iter skip).
    (assert next (iter iterate).
  ).
  (should "(iter skip count) returns this iterator without modification if count <= 0." (= ()
    (var next (= () null).
    (var iter (iterator of next).
    (assert iter (iter skip -1).
    (assert next (iter iterate).

    (assert iter (iter skip 0).
    (assert next (iter iterate).

    (assert iter (iter skip null).
    (assert next (iter iterate).
  ).
  (should "(iter skip count) returns this iterator and skips the first count elements if count > 0." (= ()
    (var next (= () 1).
    (var iter (iterator of next).
    (assert next (iter iterate).
    (assert iter (iter skip 1).
    (assert ($(iter iterate) is-not next).
    (assert 1 ((iter iterate).

    (let iter (iterator of (@ 1 2 3).
    (assert iter (iter skip 1).
    (assert 2 (((iter iterate)) 0).
    (assert 3 (((iter iterate)) 0).
    (assert null (((iter iterate)) 0).

    (let iter (iterator of (@ 1 2 3 10: 10).
    (assert iter (iter skip 2).
    (assert 3 (((iter iterate)) 0).
    (assert 10 (((iter iterate)) 0).
    (assert null (((iter iterate)) 0).

    (let iter (iterator of (@ 1 2 3 10: 10 100: 100).
    (assert iter (iter skip 4).
    (assert 100 (((iter iterate)) 0).
    (assert null (((iter iterate)) 0).
  ).
).

(define "(an-iterator keep ...)" (= ()
  (should "(empty-iter keep) returns the same empty iterator." (= ()
    (assert (iterator empty) ((iterator empty) keep).
    (assert null ((iterator empty) iterate).
  ).
  (should "(empty-iter keep count) always returns the same empty iterator." (= ()
    (assert (iterator empty) ((iterator empty) keep -1).
    (assert (iterator empty) ((iterator empty) keep 0).
    (assert (iterator empty) ((iterator empty) keep 1).
    (assert null ((iterator empty) iterate).
  ).
  (should "(iter keep) returns this iterator but modify it to empty." (= ()
    (var next (= () null).
    (var iter (iterator of next).
    (assert iter (iter keep).
    (assert null (iter iterate).
  ).
  (should "(iter keep count) returns this iterator but modify it to empty if count <= 0." (= ()
    (var next (= () null).
    (var iter (iterator of next).
    (assert iter (iter keep -1).
    (assert null (iter iterate).

    (let iter (iterator of next).
    (assert iter (iter keep 0).
    (assert null (iter iterate).

    (let iter (iterator of next).
    (assert iter (iter keep null).
    (assert null (iter iterate).
  ).
  (should "(iter keep count) returns this iterator and only keeps the first count of elements if count > 0." (= ()
    (var next (= () 1).
    (var iter (iterator of next).
    (assert next (iter iterate).
    (assert iter (iter keep 1).
    (assert ($(iter iterate) is-not next).
    (assert 1 ((iter iterate).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 2 3).
    (assert iter (iter keep 2).
    (assert 1 (((iter iterate)) 0).
    (assert 2 (((iter iterate)) 0).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 2 10: 10 11 12).
    (assert iter (iter keep 4).
    (assert 1 (((iter iterate)) 0).
    (assert 2 (((iter iterate)) 0).
    (assert 10 (((iter iterate)) 0).
    (assert 11 (((iter iterate)) 0).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 2 10:10 11 12 100:100 101 102).
    (assert iter (iter keep 7).
    (assert 1 (((iter iterate)) 0).
    (assert 2 (((iter iterate)) 0).
    (assert 10 (((iter iterate)) 0).
    (assert 11 (((iter iterate)) 0).
    (assert 12 (((iter iterate)) 0).
    (assert 100 (((iter iterate)) 0).
    (assert 101 (((iter iterate)) 0).
    (assert null ((iter iterate).
  ).
).

(define "(an-iterator select ...)" (= ()
  (should "(empty-iter select) returns the same empty iterator." (= ()
    (assert (iterator empty) ((iterator empty) select).
    (assert null ((iterator empty) iterate).
  ).
  (should "(empty-iter select filter) always returns the same empty iterator." (= ()
    (assert (iterator empty) ((iterator empty) select false).
    (assert (iterator empty) ((iterator empty) select true).
    (assert (iterator empty) ((iterator empty) select (=() true).
    (assert null ((iterator empty) iterate).
  ).
  (should "(iter select false) returns this iterator but modify it to empty." (= ()
    (var next (= () null).
    (var iter (iterator of next).
    (assert iter (iter select).
    (assert null (iter iterate).

    (let iter (iterator of next).
    (assert iter (iter select null).
    (assert null (iter iterate).

    (let iter (iterator of next).
    (assert iter (iter select false).
    (assert null (iter iterate).

    (let iter (iterator of next).
    (assert iter (iter select 0).
    (assert null (iter iterate).
  ).
  (should "(iter select true) returns this iterator without modification." (= ()
    (var next (= () null).
    (var iter (iterator of next).
    (assert iter (iter select true).
    (assert next (iter iterate).

    (assert iter (iter select 1).
    (assert next (iter iterate).

    (assert iter (iter select "x").
    (assert next (iter iterate).

    (assert iter (iter select (=?).
    (assert next (iter iterate).
  ).
  (should "(iter select filter) returns this iterator and applies the filter function." (= ()
    (var next (= () 1).
    (var iter (iterator of next).
    (assert next (iter iterate).
    (assert iter (iter select (= () true).
    (assert ($(iter iterate) is-not next).
    (assert 1 ((iter iterate).
    (assert 1 ((iter iterate).

    (let iter (iterator of (@ 1 2 3).
    (assert iter (iter select (= x (x < 3).
    (assert 1 (((iter iterate)) 0).
    (assert 2 (((iter iterate)) 0).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 2 10: 10 11 12).
    (assert iter (iter select (= x (x < 12).
    (assert 1 (((iter iterate)) 0).
    (assert 2 (((iter iterate)) 0).
    (assert 10 (((iter iterate)) 0).
    (assert 11 (((iter iterate)) 0).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 2 10:10 11 12 100:100 101 102).
    (assert iter (iter select (= x (x < 102).
    (assert 1 (((iter iterate)) 0).
    (assert 2 (((iter iterate)) 0).
    (assert 10 (((iter iterate)) 0).
    (assert 11 (((iter iterate)) 0).
    (assert 12 (((iter iterate)) 0).
    (assert 100 (((iter iterate)) 0).
    (assert 101 (((iter iterate)) 0).
    (assert null ((iter iterate).
  ).
).

(define "(an-iterator map ...)" (= ()
  (should "(empty-iter map) returns the same empty iterator." (= ()
    (assert (iterator empty) ((iterator empty) map).
    (assert null ((iterator empty) iterate).
  ).
  (should "(empty-iter map any) always returns the same empty iterator." (= ()
    (assert (iterator empty) ((iterator empty) select 0).
    (assert (iterator empty) ((iterator empty) select 1).
    (assert (iterator empty) ((iterator empty) select (=() 2).
    (assert null ((iterator empty) iterate).
  ).
  (should "(iter map value) returns this iterator but map its elements to value." (= ()
    (var iter (iterator of (@).
    (assert iter (iter map -1).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1).
    (assert iter (iter map -1).
    (assert -1 (((iter iterate)) 0).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 10:10 11).
    (assert iter (iter map 0).
    (assert 0 (((iter iterate)) 0).
    (assert 0 (((iter iterate)) 0).
    (assert 0 (((iter iterate)) 0).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 10:10 11 100:100 101).
    (assert iter (iter map true).
    (assert true (((iter iterate)) 0).
    (assert true (((iter iterate)) 0).
    (assert true (((iter iterate)) 0).
    (assert true (((iter iterate)) 0).
    (assert true (((iter iterate)) 0).
    (assert null ((iter iterate).
  ).
  (should "(iter map converter) returns this iterator and applies the converter function." (= ()
    (var next (= () 1).
    (var iter (iterator of next).
    (assert next (iter iterate).
    (assert iter (iter map (= () true).
    (assert ($(iter iterate) is-not next).
    (assert true (((iter iterate)) first).
    (assert true (((iter iterate)) first).

    (let iter (iterator of-unsafe next).
    (assert ($(iter iterate) is-not next).
    (assert iter (iter map (= () true).
    (assert ($(iter iterate) is-not next).
    (assert true (((iter iterate)) first).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 2 3).
    (assert iter (iter map (= x (x + 10).
    (assert 11 (((iter iterate)) 0).
    (assert 12 (((iter iterate)) 0).
    (assert 13 (((iter iterate)) 0).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 2 10: 10 11 12).
    (assert iter (iter map (= x (x * 2).
    (assert 2 (((iter iterate)) 0).
    (assert 4 (((iter iterate)) 0).
    (assert 20 (((iter iterate)) 0).
    (assert 22 (((iter iterate)) 0).
    (assert 24 (((iter iterate)) 0).
    (assert null ((iter iterate).

    (let iter (iterator of (@ 1 2 10:10 11 12 100:100 101 102).
    (assert iter (iter map (= x (x + 100).
    (assert 101 (((iter iterate)) 0).
    (assert 102 (((iter iterate)) 0).
    (assert 110 (((iter iterate)) 0).
    (assert 111 (((iter iterate)) 0).
    (assert 112 (((iter iterate)) 0).
    (assert 200 (((iter iterate)) 0).
    (assert 201 (((iter iterate)) 0).
    (assert 202 (((iter iterate)) 0).
    (assert null ((iter iterate).
  ).
).

(define "(an-iterator reduce ...)" (= ()
  (should "(iter reduce) returns the count of iterations." (= ()
    (assert 0 ((iterator empty) reduce).
    (assert 1 ((iterator of (@ 1)) reduce).
    (assert 2 ((iterator of (@ 1 10:10)) reduce).
    (assert 3 ((iterator of (@ 1 10:10 100:100)) reduce).
  ).
  (should "(iter reduce reducer) reduces the values of all iterations to a final value." (= ()
    (var sum (= (s v i) ((s ?? 0) + v i).
    (var fac (=> (s v i) ((s ?? 1) * v (++ i).

    (assert null ((iterator empty) reduce sum).
    (assert null ((iterator empty) reduce fac).

    (assert 1 ((iterator of (@ 1)) reduce sum).
    (assert 1 ((iterator of (@ 1)) reduce fac).

    (assert 4 ((iterator of (@ 1 2)) reduce sum).
    (assert 4 ((iterator of (@ 1 2)) reduce fac).

    (assert 24 ((iterator of (@ 1 2 10:10)) reduce sum).
    (assert 440 ((iterator of (@ 1 2 10:10)) reduce fac).

    (assert 224 ((iterator of (@ 1 2 10:10 100:100)) reduce sum).
    (assert 4444000 ((iterator of (@ 1 2 10:10 100:100)) reduce fac).
  ).
  (should "(iter reduce value) traverses all iterations and returns the last or initial value." (= ()
    (assert null ((iterator empty) reduce null).
    (assert true ((iterator empty) reduce true).
    (assert false ((iterator empty) reduce false).
    (assert (`x) ((iterator empty) reduce (`x).

    (assert 1 ((iterator of (@ 1)) reduce true).
    (assert 10 ((iterator of (@ 1 10:10)) reduce (=?).
    (assert 100 ((iterator of (@ 1 10:10 100:100)) reduce null).
    (assert "200.0" ((iterator of (@ 1 10:10 100:100 "200.0")) reduce null).
    (assert "xx" ((iterator of (@ 1 10:10 100:100 "xx")) reduce null).
  ).
  (should "(iter reduce value reducer) reduces the values of all iterations to a final value." (= ()
    (var sum (= (s v) (s + v).
    (assert 10 ((iterator empty) reduce 10 sum).
    (assert 1 ((iterator of (@ 1)) reduce 0 sum).
    (assert 11 ((iterator of (@ 1 2)) reduce 8 sum).
    (assert "1210" ((iterator of (@ 1 2 10:10)) reduce "" sum).
    (assert "_1210100" ((iterator of (@ 1 2 10:10 100:100)) reduce "_" sum).
  ).
).

(define "(an-iterator count ...)" (= ()
  (should "(empty-iter count) returns 0." (= ()
    (assert 0 ((iterator empty) count).
  ).
  (should "(iter count) returns the number of all iterations." (= ()
    (assert 1 ((iterator of (@ 1)) count).
    (assert 2 ((iterator of (@ 1 2)) count).
    (assert 3 ((iterator of (@ 1 2 10:10)) count).
    (assert 4 ((iterator of (@ 1 2 10:10 100:100)) count).
    (assert 5 ((iterator of (@ 1 2 10:10 100:100 "200.0")) count).
  ).
  (should "(iter count filter) returns the number of all iterations." (= ()
    (var some  (= x (x < 100).
    (assert 1 ((iterator of (@ 1)) count some).
    (assert 2 ((iterator of (@ 1 2)) count some).
    (assert 3 ((iterator of (@ 1 2 10:10)) count some).
    (assert 3 ((iterator of (@ 1 2 10:10 100:100)) count some).
    (assert 3 ((iterator of (@ 1 2 10:10 100:100 "200.0")) count some).
  ).
).

(define "(an-iterator for-each ...)" (= ()
  (should "(an-iterator for-each ...) is an alias of (an-iterator count ...)." (= ()
    (var iter (iterator of (@ 1 2 3).
    (assert (iter "count":: is (iter "for-each").
    (assert (iter "for-each":: is (iter "count").
).

(define "(an-iterator sum ...)" (= ()
  (should "(empty-iter sum) returns 0." (= ()
    (assert 0 ((iterator empty) sum).
  ).
  (should "(empty-iter sum base) returns the number value of base." (= ()
    (assert 0 ((iterator empty) sum 0).
    (assert 1 ((iterator empty) sum 1).
    (assert 1 ((iterator empty) sum true).
    (assert 0 ((iterator empty) sum false).
    (assert 128 ((iterator empty) sum "128").
    (assert 1024 ((iterator empty) sum (date of 1024).
  ).
  (should "(iter sum) sums the number values of all iterations." (= ()
    (assert 1 ((iterator of (@ 1)) sum).
    (assert 3 ((iterator of (@ 1 2)) sum).
    (assert 13 ((iterator of (@ 1 2 10:10)) sum).
    (assert 113 ((iterator of (@ 1 2 10:10 100:100)) sum).
    (assert 313 ((iterator of (@ 1 2 10:10 100:100 "200.0")) sum).
  ).
  (should "(iter sum base) sums the number values of all iterations on the base value." (= ()
    (assert 1001 ((iterator of (@ 1)) sum 1000).
    (assert 1003 ((iterator of (@ 1 2)) sum 1000).
    (assert 1013 ((iterator of (@ 1 2 10:10)) sum 1000).
    (assert 1113 ((iterator of (@ 1 2 10:10 100:100)) sum 1000).
    (assert 1313 ((iterator of (@ 1 2 10:10 100:100 "200.0")) sum 1000).
  ).
).

(define "(an-iterator average ...)" (= ()
  (should "(empty-iter average) returns 0." (= ()
    (assert 0 ((iterator empty) average).
  ).
  (should "(empty-iter average default-value) returns the default value." (= ()
    (assert 1 ((iterator empty) average 1).
    (assert 10 ((iterator empty) average 10).
    (assert 100 ((iterator empty) average 100).

    (assert 0 ((iterator empty) average true).
    (assert 0 ((iterator empty) average "true").
  ).
  (should "(iter average) returns the average number value of all iterations." (= ()
    (assert 1 ((iterator of (@ 1)) average).
    (assert 2 ((iterator of (@ 1 3)) average).
    (assert 5 ((iterator of (@ 1 4 10:10)) average).
    (assert 28 ((iterator of (@ 1 1 10:10 100:100)) average).
  ).
  (should "(iter average) returns 0 if the average value is not a valid number." (= ()
    (assert 0 ((iterator of (@ 1 2 10:10 100:100 "xxx")) average).
  ).
  (should "(iter average default-value) returns the default value if the average value is not a valid number." (= ()
    (assert 10 ((iterator of (@ 1 2 10:10 100:100 "xxx")) average 10).
  ).
).

(define "(an-iterator max ...)" (= ()
  (should "(empty-iter max) returns null." (= ()
    (assert null ((iterator empty) max).
  ).
  (should "(an-iter max) returns the maximum value." (= ()
    (assert 1 ((iterator of (@ 1)) max).
    (assert 1 ((iterator of (@ 1 null)) max).
    (assert 1 ((iterator of (@ null 1)) max).

    (assert 2 ((iterator of (@ 1 2)) max).
    (assert 2 ((iterator of (@ 1 null 2)) max).
    (assert 2 ((iterator of (@ null 1 2)) max).
    (assert 2 ((iterator of (@ 1 2 null)) max).

    (assert 3 ((iterator of (@ -1 0 1 2 3)) max).
    (assert 3 ((iterator of (@ null -1 0 1 2 3)) max).
    (assert 3 ((iterator of (@ -1 0 1 null 2 3)) max).
    (assert 3 ((iterator of (@ -1 0 1 2 3 null)) max).
  ).
  (should "(an-iter max filter) returns the maximum value which matched by filter." (= ()
    (assert -1 ((iterator of (@ -1 0 1 2 3)) max (->(x) (x < 0).
    (assert 0 ((iterator of (@ null -1 0 1 2 3)) max (->(x) (x < 1).
    (assert 1 ((iterator of (@ -1 0 1 null 2 3)) max (->(x) (x < 2).
    (assert 2 ((iterator of (@ -1 0 1 2 3 null)) max (->(x) (x < 3).
  ).
).

(define "(an-iterator min ...)" (= ()
  (should "(empty-iter min) returns null." (= ()
    (assert null ((iterator empty) min).
  ).
  (should "(an-iter min) returns the minimum value." (= ()
    (assert 1 ((iterator of (@ 1)) min).
    (assert 1 ((iterator of (@ 1 null)) min).
    (assert 1 ((iterator of (@ null 1)) min).

    (assert 1 ((iterator of (@ 1 2)) min).
    (assert 1 ((iterator of (@ 1 null 2)) min).
    (assert 1 ((iterator of (@ null 1 2)) min).
    (assert 1 ((iterator of (@ 1 2 null)) min).

    (assert -1 ((iterator of (@ -1 0 1 2 3)) min).
    (assert -1 ((iterator of (@ null -1 0 1 2 3)) min).
    (assert -1 ((iterator of (@ -1 0 1 null 2 3)) min).
    (assert -1 ((iterator of (@ -1 0 1 2 3 null)) min).
  ).
  (should "(an-iter min filter) returns the minimum value which matched by filter." (= ()
    (assert 0 ((iterator of (@ -1 0 1 2 3)) min (->(x) (x > -1).
    (assert 1 ((iterator of (@ null -1 0 1 2 3)) min (->(x) (x > 0).
    (assert 2 ((iterator of (@ -1 0 1 null 2 3)) min (->(x) (x > 1).
    (assert 3 ((iterator of (@ -1 0 1 2 3 null)) min (->(x) (x > 2).
  ).
).

(define "(an-iterator join ...)" (= ()
  (should "(empty-iter join) returns \"\"." (= ()
    (assert "" ((iterator empty) join).
  ).
  (should "(empty-iter join separator) returns \"\"." (= ()
    (assert "" ((iterator empty) join null).
    (assert "" ((iterator empty) join " ").
    (assert "" ((iterator empty) join "_").
  ).
  (should "(iter join) concatenates the string values of all iterations with whitespace." (= ()
    (assert "1" ((iterator of (@ 1)) join).
    (assert "1 10" ((iterator of (@ 1 10:10)) join).
    (assert "1 10 100" ((iterator of (@ 1 10:10 100:100)) join).
    (assert "1 10 100 200.0" ((iterator of (@ 1 10:10 100:100 "200.0")) join).
    (assert "1 10 100 xx" ((iterator of (@ 1 10:10 100:100 "xx")) join).
  ).
  (should "(iter join separator) concatenates the string values of all iterations with the separator." (= ()
    (assert "1" ((iterator of (@ 1)) join "").
    (assert "1 10" ((iterator of (@ 1 10:10)) join " ").
    (assert "1__10__100" ((iterator of (@ 1 10:10 100:100)) join "__").
    (assert "110100200.0" ((iterator of (@ 1 10:10 100:100 "200.0")) join "").
    (assert "1  10  100  xx" ((iterator of (@ 1 10:10 100:100 "xx")) join "  ").
  ).
).

(define "(an-iterator collect ...)" (= ()
  (should "(empty-iter collect) returns an empty array." (= ()
    (var a ((iterator empty) collect).
    (assert (a is-an array).
    (assert (a is-empty).
  ).
  (should "(empty-iter collect list) returns the original list if it's an array." (= ()
    (var a (@ 1 2).
    (var b ((iterator empty) collect a).
    (assert (b is-an array).
    (assert (b is a).
  ).
  (should "(iter collect) returns an array with the values of all iterations." (= ()
    (var c ((iterator empty) collect).
    (assert (c is-an array).
    (assert 0 (c length).

    (let c ((iterator of (@ 1)) collect).
    (assert (c is-an array).
    (assert 1 (c length).
    (assert 1 (c 0).

    (let c ((iterator of (@ 1 10:"10")) collect).
    (assert (c is-an array).
    (assert 2 (c length).
    (assert 1 (c 0).
    (assert "10" (c 1).

    (let c ((iterator of (@ 1 10:"10" 100:"xxx")) collect).
    (assert (c is-an array).
    (assert 3 (c length).
    (assert 1 (c 0).
    (assert "10" (c 1).
    (assert "xxx" (c 2).
  ).
  (should "(iter collect list) appends the values of all iterations to list if it's an array." (= ()
    (var a (@ 1 2).
    (var c ((iterator empty) collect a).
    (assert (c is-an array).
    (assert 2 (c length).

    (let a (@ 1 2).
    (let c ((iterator of (@ 1)) collect a).
    (assert (c is-an array).
    (assert 3 (c length).
    (assert 1 (c 2).

    (let a (@ 1 2).
    (let c ((iterator of (@ 1 10:"10")) collect a).
    (assert (c is-an array).
    (assert 4 (c length).
    (assert 1 (c 2).
    (assert "10" (c 3).

    (let a (@ 1 2).
    (let c ((iterator of (@ 1 10:"10" 100:"xxx")) collect a).
    (assert (c is-an array).
    (assert 5 (c length).
    (assert 1 (c 2).
    (assert "10" (c 3).
    (assert "xxx" (c 4).
  ).
).

(define "(an-iterator finish ...)" (= ()
  (should "(empty-iter finish) returns null." (= ()
    (assert null ((iterator empty) finish).
  ).
  (should "(empty-iter finish nil) returns the nil value." (= ()
    (assert true ((iterator empty) finish true).
    (assert 12 ((iterator empty) finish 12).
  ).
  (should "(iter finish) returns the last value of iterations." (= ()
    (assert 1 ((iterator of (@ 1)) finish).
    (assert 2 ((iterator of (@ 1 2)) finish).
    (assert 10 ((iterator of (@ 1 2 10:10)) finish).
    (assert 100 ((iterator of (@ 1 2 10:10 100:100)) finish).
    (assert "200.0" ((iterator of (@ 1 2 10:10 100:100 "200.0")) finish).
  ).
  (should "(iter finish nil) returns the last value of iterations." (= ()
    (assert 1 ((iterator of (@ 1)) finish true).
    (assert 2 ((iterator of (@ 1 2)) finish 1).
    (assert 10 ((iterator of (@ 1 2 10:10)) finish null).
    (assert 100 ((iterator of (@ 1 2 10:10 100:100)) finish (=().
    (assert "200.0" ((iterator of (@ 1 2 10:10 100:100 "200.0")) finish "x").
  ).
).
