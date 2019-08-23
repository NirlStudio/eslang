var * (load "share/type" (@ the-type: promise);

(define "Promise Common Behaviors" (=> ()
  (define "Identity" (= ()
    (should "all empty promises are the same instance." (= ()
      assert ((promise empty) is (promise empty);
      assert false ((promise empty) is-not (promise empty);

      assert ((promise of) is (promise of);
      assert false ((promise of) is-not (promise of);

      assert ((promise of-all) is (promise of-all);
      assert false ((promise of-all) is-not (promise of-all);

      assert ((promise all) is (promise all);
      assert false ((promise all) is-not (promise all);

      assert ((promise of-any) is (promise of-any);
      assert false ((promise of-any) is-not (promise of-any);

      assert ((promise any) is (promise any);
      assert false ((promise any) is-not (promise any);

      assert ((promise of-resolved) is (promise of-resolved);
      assert false ((promise of-resolved) is-not (promise of-resolved);

      assert ((promise of-rejected) is (promise of-rejected);
      assert false ((promise of-rejected) is-not (promise of-rejected);
    ).
    (should "all nothing promises are the same instance." (= ()
      assert ((promise nothing) is (promise nothing);
      assert false ((promise nothing) is-not (promise nothing);
    ).
  ).

  (define "Equivalence" (= ()
    (should "iterators' equivalence is defined by their identity." (= ()
      var p (promise of 1);
      assert (p "equals":: is (p "is");
      assert (p "not-equals":: is (p "is-not");
    ).
  ).

  (define "Ordering" (=> ()
    var values (the-values concat (promise empty) (promise nothing);
    (should "comparison of a promise with itself returns 0." (=> ()
      (for p in values
        assert 0 (p compare p);
      ).
    ).
    (should "comparison of two different promises return null." (=> ()
      (for a in values
        (for b in values
          (if (a is-not b)
            assert null (a compare b);
      ).
    ).
  ).

  (define "Emptiness" (= ()
    (should "(promise empty) is defined as empty." (= ()
      assert ((promise empty) is-empty);
      assert false ((promise empty) not-empty);
    ).
    (should "(promise nothing) is defined as empty." (= ()
      assert ((promise nothing) is-empty);
      assert false ((promise nothing) not-empty);
    ).
  ).

  (define "Encoding" (=> ()
    (should "(promise empty) is encoded to tuple (iterator empty)." (= ()
      var code ((promise empty) to-code);
      assert (code is-a tuple);
      assert 2 (code length);
      assert (`promise) (code 0);
      assert (`empty) (code 1);
    ).
    (should "(promise nothing) is encoded to tuple (iterator nothing)." (= ()
      var code ((promise nothing) to-code);
      assert (code is-a tuple);
      assert 2 (code length);
      assert (`promise) (code 0);
      assert (`nothing) (code 1);
    ).
    (should "a non-empty promise is encoded to tuple (promise of ...)." (=> ()
      (for value in the-values
        var code (value to-code);
        assert (code is-a tuple);
        assert 3 (code length);
        assert (`promise) (code 0);
        assert (`of) (code 1);
        assert (symbol etc) (code 2);
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "(promise empty) is described as '(promise empty)'." (= ()
      assert "(promise empty)" ((promise empty) to-string);
    ).
    (should "(promise nothing) is described as '(promise nothing)'." (= ()
      assert "(promise nothing)" ((promise nothing) to-string);
    ).
    (should "a non-empty promise is described as '(promise of ...)'." (=> ()
      (for value in the-values
        assert "(promise of ...)" (value to-string);
    ).
  ).
).

(define "(promise empty)" (= ()
  (should "(promise empty) is a promise resolved to null." (= async
    var p (promise empty);
    assert (p is-a promise);

    p then (async resolve null);
  ).
).

(define "(promise nothing)" (= ()
  (should "(promise nothing) is a promise rejected to true, which is the default safe excuse value)." (= async
    var p (promise nothing);
    assert (p is-a promise);

    p then (async reject true);
  ).
).

(define "(promise of ...)" (= ()
  (should "(promise of) returns (promise nothing)." (= ()
    var p (promise of);
    assert (p is (promise nothing);
  ).
  (define "(promise of promising)" (= ()
    (should "(promise of null) returns (promise nothing)." (= ()
      var p (promise of null);
      assert (p is (promise nothing);
    ).
    (should "(promise of a-promise) returns the original promise." (= ()
      var p (promise of (=> ();
      assert (p is (promise of p);
    ).
    (should "(promise of (@)) returns (promise empty)." (= ()
      var p (promise of (@);
      assert (p is (promise empty);
    ).
    (should "(promise of (@ null)) returns (promise empty)." (= ()
      var p (promise of (@ null);
      assert (p is (promise empty);
    ).
    (should "(promise of (@ value)) returns a promise resolved to value." (= async
      var p (promise of (@ 100);
      p then (async resolve 100);
    ).
    (should "(promise of (@ value null)) returns a promise resolved to value." (= async
      var p (promise of (@ 100 null);
      p then (async resolve 100);
    ).
    (should "(promise of (@ * value)) returns a promise rejected to value." (= async
      var p (promise of (@ 100 999);
      p then (async reject 999);
    ).
    (should "(promise of async-func) returns a promise to invoke async-func." (= async
      (var p (promise of (= async
        (timer timeout (=> ms
          async resolve (ms + 99);
        ).
      ).
      p then (async resolve 99);
    ).
    (should "(promise of other-value) returns a promise rejected to the value." (= async
      var p (promise of 99.9);
      p then (async reject 99.9);
    ).
  ).
  (define "(promise of promising next)" (= ()
    (should "pass promising result to the next step as a waiting object." (= async
      (var p (promise of
        (= async
          (timer timeout (=> ms
            async resolve (ms + 99);
          ).
        ).
        (= waiting
          @ (waiting result:: + 2);
        ).
      ).
      p then (async resolve 101);
    ).
    (define "when next is an array," (= ()
      (should "(promise of promising (@ value)) resolves to value finally." (= async
        (var p (promise of (@ 100)
          @ 101;
        ).
        p then (async resolve 101);
      ).
      (should "(promise of promising (@ value null)) finally resolves to value." (= async
        (var p (promise of (@ 100)
          @ 102 null;
        ).
        p then (async resolve 102);
      ).
      (should "(promise of promising (@ * value)) finally rejects to value." (= async
        (var p (promise of (@ 100)
          @ null 103;
        ).
        p then (async reject 103);
      ).
      (should "stop and skip any value in next if the promising rejected." (= async
        (var p (promise of (@ null 100)
          @ null 101;
        ).
        p then (async reject 100);
      ).
    ).
    (define "when next is a function," (= ()
      (should "finally resolve to value if the function returns (@ value)." (= async
        (var p (promise of (@ 100)
          (= waiting
            @ (waiting result:: + 1);
          ).
        ).
        p then (async resolve 101);
      ).
      (should "finally resolve to value if the function returns (@ value null)." (= async
        (var p (promise of (@ 100)
          (= waiting
            @ (waiting result:: + 1) null;
          ).
        ).
        p then (async resolve 101);
      ).
      (should "finally reject by value if the function returns (@ * value)." (= async
        (var p (promise of (@ 100)
          (= waiting
            @ 100 (waiting result:: + 1);
          ).
        ).
        p then (async reject 101);
      ).
      (should "intercept it as an async function if the function returns a function." (= async
        (var p (promise of (@ 100)
          (= waiting (=> async
            (timer timeout (=> ()
              async resolve (waiting result);
            ).
            @ 100 102;
          ).
        ).
        p then (async resolve 100);
      ).
      (should "finally reject by value if the function returns another type of value." (= async
        (var p (promise of (@ 100)
          (= waiting (waiting result:: + 1).
        ).
        p then (async reject 101);
      ).
    ).
    (define "when next is other type of value," (= ()
      (should "finally reject by value if next is another type of value." (= async
        (var p (promise of (@ 100)
          101,
        ).
        p then (async reject 101);
      ).
      (should "stop and skip the value of next if the promising rejected." (= async
        (var p (promise of (@ null 100)
          101,
        ).
        p then (async reject 100);
      ).
    ).
  ).
  (define "(promise of promising next last)" (= ()
    (should "literally pass the raw array result of next as arguments to the last step." (= async
      (var p (promise of
        (= async
          (timer timeout (=> ms
            async resolve (ms + 99);
          ).
        ).
        (= waiting
          @ 100 (waiting result:: + 2) 102;
        ).
        (= (x y z)
          @ (+ x y z);
        ).
      ).
      p then (async resolve 303);
    ).
    (should "a non-array result of next indicates to stop immediately." (= async
      (var p (promise of
        (= async
          (timer timeout (=> ms
            async resolve (ms + 99);
          ).
        ).
        (= waiting (waiting result:: + 2).
        (= x (@ (x += 2).
      ).
      p then (async reject 101);
    ).
    (define "when last is an array," (= ()
      (should "(promise of promising * (@ value)) resolves to value finally." (= async
        (var p (promise of (@ 100) (@ 101)
          @ 101.1;
        ).
        p then (async resolve 101.1);
      ).
      (should "(promise of promising * (@ value null)) finally resolves to value." (= async
        (var p (promise of (@ 100) (@ 101)
          @ 102 null;
        ).
        p then (async resolve 102);
      ).
      (should "(promise of promising * (@ * value)) finally rejects to value." (= async
        (var p (promise of (@ 100) (@ 101)
          @ null 103;
        ).
        p then (async reject 103);
      ).
      (should "stop and skip any value in last if the next is taken as a rejection." (= async
        (var p (promise of (@ 100) (@ null 101)
          @ null 104;
        ).
        p then (async reject 104);
      ).
    ).
    (define "when last is a function," (= ()
      (should "finally resolve to value if the function returns (@ value)." (= async
        (var p (promise of (@ 100)
          (@ 101)
          (= x
            @ (x + 1);
          ).
        ).
        p then (async resolve 102);
      ).
      (should "finally resolve to value if the function returns (@ value null)." (= async
        (var p (promise of (@ 100)
          (@ 101)
          (= x
            @ (x + 1) null;
          ).
        ).
        p then (async resolve 102);
      ).
      (should "finally reject by value if the function returns (@ * value)." (= async
        (var p (promise of (@ 100)
          (@ 101)
          (= x
            @ 100 (x + 1);
          ).
        ).
        p then (async reject 102);
      ).
      (should "intercept it as an async function if the function returns a function." (= async
        (var p (promise of (@ 100)
          (@ 101).
          (= x (=> async
            (timer timeout (=> ()
              async resolve (x + 0.1);
            ).
            @ 102 103;
          ).
        ).
        p then (async resolve 101.1);
      ).
      (should "finally reject by value if the function returns another type of value." (= async
        (var p (promise of (@ 100)
          (@ null 101).
          (= (a x) (x + 1).
        ).
        p then (async reject 102);
      ).
    ).
    (define "when last is other type of value," (= ()
      (should "finally reject by value if last is another type of value." (= async
        (var p (promise of (@ 100)
          (@ 101).
          102,
        ).
        p then (async reject 102);
      ).
      (should "stop and skip the value of last if the promising rejected." (= async
        (var p (promise of (@ null 100)
          (@ 101).
          102,
        ).
        p then (async reject 102);
      ).
    ).
  ).
).

(define "(commit ...)" (=> ()
  (should "'commit' is an alias of (promise 'of')." (=> ()
    assert ($commit is (promise "of");
    assert ($(promise "of") is commit);
  ).
).

(define "(promise of-resolved ...)" (=> ()
  (should "(promise of-resolved) returns (promise empty)." (= ()
    var p (promise of-resolved);
    assert (p is (promise empty);
  ).
  (should "(promise of-resolved null) returns (promise empty)." (= ()
    var p (promise of-resolved null);
    assert (p is (promise empty);
  ).
  (define "(promise of-resolved value) returns a promise resolving to value, for examples" (= ()
    (should "the value is false." (=> async
      var p (promise of-resolved false);
      p then (async resolve false);
    ).
    (should "the value is true." (=> async
      var p (promise of-resolved true);
      p then (async resolve true);
    ).
    (should "the value is 0." (=> async
      var p (promise of-resolved 0);
      p then (async resolve 0);
    ).
    (should "the value is a type." (=> async
      var p (promise of-resolved bool);
      p then (async resolve bool);
    ).
    (should "the value is a symbol." (=> async
      var sym (`x);
      var p (promise of-resolved sym);
      p then (async resolve sym);
    ).
    (should "the value is a lambda." (=> async
      var l (= x x);
      var p (promise of-resolved l);
      p then (async resolve l);
    ).
    (should "the value is a function." (=> async
      var f (=> x x);
      var p (promise of-resolved f);
      p then (async resolve f);
    ).
    (should "the value is an object." (=> async
      var obj (@ x: 1);
      var p (promise of-resolved obj);
      p then (async resolve obj);
    ).
  ).
).

(define "(promise of-rejected ...)" (=> ()
  (should "(promise of-rejected) returns (promise nothing)." (= ()
    var p (promise of-rejected);
    assert (p is (promise nothing);
  ).
  (should "(promise of-rejected null) returns (promise nothing)." (= ()
    var p (promise of-rejected null);
    assert (p is (promise nothing);
  ).
  (should "(promise of-rejected true) returns (promise nothing)." (= ()
    var p (promise of-rejected true);
    assert (p is (promise nothing);
  ).
  (define "(promise of-rejected value) returns a promise rejecting by value, for examples:" (= ()
    (should "the value is false." (=> async
      var p (promise of-rejected false);
      p then (async reject false);
    ).
    (should "the value is 0." (=> async
      var p (promise of-rejected 0);
      p then (async reject 0);
    ).
    (should "the value is a type." (=> async
      var p (promise of-rejected bool);
      p then (async reject bool);
    ).
    (should "the value is a symbol." (=> async
      var sym (`x);
      var p (promise of-rejected sym);
      p then (async reject sym);
    ).
    (should "the value is a lambda." (=> async
      var l (= x x);
      var p (promise of-rejected l);
      p then (async reject l);
    ).
    (should "the value is a function." (=> async
      var f (=> x x);
      var p (promise of-rejected f);
      p then (async reject f);
    ).
    (should "the value is an object." (=> async
      var obj (@ x: 1);
      var p (promise of-rejected obj);
      p then (async reject obj);
    ).
  ).
).

(define "(promise of-all ...)" (=> ()
  (should "(promise of-all) returns (promise empty)." (= ()
    var p (promise of-all);
    assert (p is (promise empty);
  ).
  (define "(promise of-all promising)" (= ()
    (should "(promise of-all null) returns a promise rejected by true." (= async
      var p (promise of-all null);
      p then (async reject true);
    ).
    (should "(promise of-all (@)) returns a promise resolved to (@ null)." (= ()
      var p (promise of-all (@);
      (p then (=> waiting
        assert (waiting result:: is-an array);
        assert 1 (waiting result:: length);
        assert null (waiting result:: 0);
      ).
    ).
    (should "(promise of-all (@ null)) returns a promise resolved to (@ null)." (= ()
      var p (promise of-all (@ null);
      (p then (=> waiting
        assert (waiting result:: is-an array);
        assert 1 (waiting result:: length);
        assert null (waiting result:: 0);
      ).
    ).
    (should "(promise of-all (@ value)) returns a promise resolved to (@ value)." (= ()
      var p (promise of-all (@ 100);
      (p then (=> waiting
        assert (waiting result:: is-an array);
        assert 1 (waiting result:: length);
        assert 100 (waiting result:: 0);
      ).
    ).
    (should "(promise of-all (@ value null)) returns a promise resolved to (@ value)." (= ()
      var p (promise of-all (@ 100 null);
      (p then (=> waiting
        assert (waiting result:: is-an array);
        assert 1 (waiting result:: length);
        assert 100 (waiting result:: 0);
      ).
    ).
    (should "(promise of-all (@ * value)) returns a promise rejected by value." (= async
      var p (promise of-all (@ 100 999);
      p then (async reject 999);
    ).
    (should "(promise of-all async-func) returns a promise to invoke async-func." (= ()
      (var p (promise of-all (= async
        (timer timeout (=> ms
          async resolve (ms + 99);
        ).
      ).
      (p then (=> waiting
        assert (waiting result:: is-an array);
        assert 1 (waiting result:: length);
        assert 99 (waiting result:: 0);
      ).
    ).
    (should "(promise of-all other-value) returns a promise rejected to the value." (= async
      var p (promise of-all 99.9);
      p then (async reject 99.9);
    ).
  ).
  (define "(promise of-all promising-a promising-b ...)" (= ()
    (should "resolve to a list of all resolved values." (= ()
      var p (promise of-all (@ 100) (@ 101);
      (p then (= waiting
        assert 2 (waiting result:: length);
        assert 100 (waiting result:: first);
        assert 101 (waiting result:: last);
      ).
    ).
    (should "reject by the excuse of the first rejection." (= async
      var p (promise of-all (@ 100) (@ null 101) (@ null 102);
      (p then (async reject 101).
    ).
  ).
).

(define "(commit* ...)" (=> ()
  (should "'commit*' is an alias of (promise 'of-all')." (=> ()
    assert ($commit* is (promise "of-all");
    assert ($(promise "of-all") is commit*);
  ).
).

(define "(promise all ...)" (=> ()
  (should "(promise all) returns (promise empty)." (= ()
    var p (promise all);
    assert (p is (promise empty);
  ).
  (define "(promise all a-promising-array)" (= ()
    (define "when there is no promising," (= ()
      (should "return (promise empty)." (= ()
        var p (promise all (@);
        assert (p is (promise empty);
      ).
    ).
    (define "when there are one promising," (= ()
      (should "resolve to the result of the promising." (= ()
        var p (promise all (@ (@ 100);
        (p then (=> waiting
          assert (waiting result:: is-an array);
          assert 1 (waiting result:: length);
          assert 100 (waiting result:: 0);
        ).
      ).
    ).
    (define "when there are multiple promising," (= ()
      (should "resolve to a list of all resolved values." (= ()
        var p (promise all (@ (@ 100) (@ 101);
        (p then (= waiting
          assert 2 (waiting result:: length);
          assert 100 (waiting result:: first);
          assert 101 (waiting result:: last);
        ).
      ).
      (should "reject by the excuse of the first rejection." (= async
        var p (promise all (@ (@ 100) (@ null 101) (@ null 102);
        (p then (async reject 101).
      ).
    ).
  ).
  (define "(promise all non-array-value) returns (promise empty), for examples:" (= ()
    (should "the value is false." (=> ()
      var p (promise all false);
      assert (p is (promise empty);
    ).
    (should "the value is true." (=> ()
      var p (promise all true);
      assert (p is (promise empty);
    ).
    (should "the value is 0." (=> ()
      var p (promise all 0);
      assert (p is (promise empty);
    ).
    (should "the value is a type." (=> ()
      var p (promise all bool);
      assert (p is (promise empty);
    ).
    (should "the value is a symbol." (=> ()
      var p (promise all (`x);
      assert (p is (promise empty);
    ).
    (should "the value is a lambda." (=> ()
      var p (promise all (= x x);
      assert (p is (promise empty);
    ).
    (should "the value is a function." (=> ()
      var p (promise all (=> x x);
      assert (p is (promise empty);
    ).
    (should "the value is an object." (=> ()
      var p (promise all (@ x: 1);
      assert (p is (promise empty);
    ).
  ).
).

(define "(promise of-any ...)" (=> ()
  (should "(promise of-any) returns (promise nothing)." (= ()
    var p (promise of-any);
    assert (p is (promise nothing);
  ).
  (define "(promise of-any promising)" (= ()
    (should "(promise of-any null) returns (promise nothing)." (= ()
      var p (promise of-any null);
      assert (p is (promise nothing);
    ).
    (should "(promise of-any a-promise) returns the original promise." (= ()
      var p (promise of (=> ();
      assert (p is (promise of-any p);
    ).
    (should "(promise of-any (@)) returns (promise empty)." (= ()
      var p (promise of-any (@);
      assert (p is (promise empty);
    ).
    (should "(promise of-any (@ null)) returns (promise empty)." (= ()
      var p (promise of-any (@ null);
      assert (p is (promise empty);
    ).
    (should "(promise of-any (@ value)) returns a promise resolved to value." (= async
      var p (promise of-any (@ 100);
      p then (async resolve 100);
    ).
    (should "(promise of-any (@ value null)) returns a promise resolved to value." (= async
      var p (promise of-any (@ 100 null);
      p then (async resolve 100);
    ).
    (should "(promise of-any (@ * value)) returns a promise rejected to value." (= async
      var p (promise of-any (@ 100 999);
      p then (async reject 999);
    ).
    (should "(promise of-any async-func) returns a promise to invoke async-func." (= async
      (var p (promise of-any (= async
        (timer timeout (=> ms
          async resolve (ms + 99);
        ).
      ).
      p then (async resolve 99);
    ).
    (should "(promise of-any other-value) returns a promise rejected to the value." (= async
      var p (promise of-any 99.9);
      p then (async reject 99.9);
    ).
  ).
  (define "(promise of-any promising-a promising-b ...)" (= ()
    (should "resolve to the first resolved value." (= async
      var p (promise of-any (@ 100) (@ null 101);
      p then (async resolve 100);
    ).
    (should "reject by the excuse of the first rejection." (= async
      var p (promise of-any (@ null 100) (@ 101);
      p then (async reject 100);
    ).
  ).
).

(define "(commit? ...)" (=> ()
  (should "'commit?' is an alias of (promise 'of-any')." (=> ()
    assert ($commit? is (promise "of-any");
    assert ($(promise "of-any") is commit?);
  ).
).

(define "(promise any ...)" (=> ()
  (should "(promise any) returns (promise nothing)." (= ()
    var p (promise any);
    assert (p is (promise nothing);
  ).
  (define "(promise any a-promising-array)" (= ()
    (define "when there is no promising," (= ()
      (should "return (promise nothing)." (= ()
        var p (promise any (@);
        assert (p is (promise nothing);
      ).
    ).
    (define "when there are one promising," (= ()
      (should "resolve to the result of the promising." (= async
        var p (promise any (@ (@ 100);
        (p then (async resolve 100).
      ).
    ).
    (define "when there are multiple promising," (= ()
      (should "resolve to the first resolved value." (= async
        var p (promise any (@ (@ 100) (@ 101);
        p then (async resolve 100);
      ).
      (should "reject by the excuse of the first rejection." (= async
        var p (promise any (@ (@ null 100) (@ 101) (@ null 102);
        p then (async reject 100);
      ).
    ).
  ).
  (define "(promise any non-array-value) returns (promise nothing), for examples:" (= ()
    (should "the value is false." (=> ()
      var p (promise any false);
      assert (p is (promise nothing);
    ).
    (should "the value is true." (=> ()
      var p (promise any true);
      assert (p is (promise nothing);
    ).
    (should "the value is 0." (=> ()
      var p (promise any 0);
      assert (p is (promise nothing);
    ).
    (should "the value is a type." (=> ()
      var p (promise any bool);
      assert (p is (promise nothing);
    ).
    (should "the value is a symbol." (=> ()
      var p (promise any (`x);
      assert (p is (promise nothing);
    ).
    (should "the value is a lambda." (=> ()
      var p (promise any (= x x);
      assert (p is (promise nothing);
    ).
    (should "the value is a function." (=> ()
      var p (promise any (=> x x);
      assert (p is (promise nothing);
    ).
    (should "the value is an object." (=> ()
      var p (promise any (@ x: 1);
      assert (p is (promise nothing);
    ).
  ).
).

(define "(a-promise is-cancellable)" (=> ()
  (should "((promise empty) is-cancellable) returns false." (=> ()
    assert false ((promise empty) is-cancellable);
    assert null ((promise empty) cancel);
  ).
  (should "((promise nothing) is-cancellable) returns false." (=> ()
    assert false ((promise nothing) is-cancellable);
    assert null ((promise nothing) cancel);
  ).
  (should "(a-promise is-cancellable) returns true if its async function returned a cancel function." (=> async
    (var p (promise of (= async
      (timer timeout 99 (=> ms
        async resolve ms;
      ).
      (=> ()
        async reject 99.9;
        true
      ).
    ).
    assert (p is-cancellable);
    assert true (p cancel);
    p then (async reject 99.9);
  ).
).

(define "(a-promise cancel)" (=> ()
  (should "(a-promise cancel) returns null if the promise is not cancellable." (=> async
    assert null ((promise empty) cancel);
    assert null ((promise nothing) cancel);

    var p (promise of (= ();
    assert null (p cancel);
  ).
  (should "(a-promise cancel) relays the result provided by cancel function." (=> async
    (var p (promise of (= async
      (timer timeout 99 (=> ms
        async resolve ms;
      ).
      (=> ()
        async reject 99.9;
        true;
      ).
    ).
    assert (p is-cancellable);
    assert true (p cancel);
    p then (async reject 99.9);
  ).
  (should "(a-promise cancel) may be called multiple times." (=> async
    (var p (promise of (= async
      (timer timeout 99 (=> ms
        async resolve ms;
      ).
      var counter 0;
      (=> ()
        async reject 99.9;
        ++ counter;
      ).
    ).
    assert (p is-cancellable);
    assert 1 (p cancel);
    assert 2 (p cancel);
    assert 3 (p cancel);
    p then (async reject 99.9);
  ).
  (should "(a-promise cancel args ...) passes all arguments to cancel function." (=> async
    (var p (promise of (= async
      (timer timeout 99 (=> ms
        async resolve ms;
      ).
      (=> (x y z)
        async reject (+ x y z);
      ).
    ).
    assert (p is-cancellable);
    (p cancel 1 10 100);
    p then (async reject 111);
  ).
).

(define "(a-promise then ...)" (=> ()
  (should "(a-promise then) returns the original promise." (=> async
    var p (promise of (=();
    assert p (p then);
  ).
  (define "(a-promise then next)" (= ()
    (should "pass the promise result to the next step as a waiting object." (= async
      (var p0 (promise of (= async
        (timer timeout 99 (=> ms
          async resolve ms;
        ).
      ).
      (var p1 (p0 then (= waiting
        @ (waiting result:: + 2);
      ).

      assert (p1 is-not p0);
      p1 then (async resolve 101);
    ).
    (define "when next is an array," (= ()
      (should "(a-promise then (@ value)) resolves to value finally." (= async
        var p (promise of (@ 100);
        let p (p then (@ 101);
        p then (async resolve 101);
      ).
      (should "(a-promise then (@ value null)) finally resolves to value." (= async
        var p (promise of (@ 100);
        let p (p then (@ 102 null);
        p then (async resolve 102);
      ).
      (should "(a-promise then (@ * value)) finally rejects to value." (= async
        var p (promise of (@ 100);
        let p (p then (@ null 103);
        p then (async reject 103);
      ).
      (should "stop and skip any value in next if the promising rejected." (= async
        var p (promise of (@ null 100);
        let p (p then (@ null 101);
        p then (async reject 100);
      ).
    ).
    (define "when next is a function," (= ()
      (should "finally resolve to value if the function returns (@ value)." (= async
        var p (promise of (@ 100);
        (let p (p then (= waiting
          @ (waiting result:: + 1);
        ).
        p then (async resolve 101);
      ).
      (should "finally resolve to value if the function returns (@ value null)." (= async
        var p (promise of (@ 100);
        (let p (p then (= waiting
          @ (waiting result:: + 1) null;
        ).
        p then (async resolve 101);
      ).
      (should "finally reject by value if the function returns (@ * value)." (= async
        var p (promise of (@ 100);
        (let p (p then (= waiting
          @ 100 (waiting result:: + 1);
        ).
        p then (async reject 101);
      ).
      (should "intercept it as an async function if the waiting function returns a function." (= async
        var p (promise of (@ 100);
        (let p (p then (= waiting (=> async
          (timer timeout (=> ()
            async resolve (waiting result:: + 1);
          ).
          @ 102 103;
        ).
        p then (async resolve 101);
      ).
      (should "finally reject by value if the function returns another type of value." (= async
        var p (promise of (@ 100);
        (let p (p then (= waiting (waiting result:: + 1).
        p then (async reject 101);
      ).
    ).
    (define "when next is other type of value," (= ()
      (should "finally reject by value if next is another type of value." (= async
        var p (promise of (@ 100);
        let p (p then 101);
        p then (async reject 101);
      ).
      (should "stop and skip the value of next if the promising rejected." (= async
        var p (promise of (@ null 100);
        let p (p then 101);
        p then (async reject 100);
      ).
    ).
  ).
).

(define "(a-promise finally ...)" (=> ()
  (should "(a-promise finally) returns the original promise." (= ()
    assert (promise empty) ((promise empty) finally);
    assert (promise nothing) ((promise nothing) finally);

    var p (promise of-resolved 1);
    assert p (p finally);

    let (promise of-rejected 2);
    assert p (p finally);
  ).
  (define "(a-promise finally next)" (= ()
    (should "return the original promise." (= ()
      var p (promise of-resolved 1);
      assert p (p finally (= ();

      let (promise of-rejected 2);
      assert p (p finally (= ();
    ).
    (should "call next with the resolved result." (= async
      var p0 (promise of-resolved 1);
      (var p1 (promise of (=> async
        (p0 finally (=> waiting
          async reject (waiting result);
        ).
      ).
      p1 then (async reject 1);
    ).
    (should "call next with the rejected excuse." (= async
      var p0 (promise of-rejected 2);
      (var p1 (promise of (=> async
        (p0 finally (=> waiting
          async resolve (waiting excuse);
        ).
      ).
      p1 then (async resolve 2);
    ).
  ).
).
