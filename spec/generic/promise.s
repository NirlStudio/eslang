var * (load "share/type" (@ the-type: promise);

(define "Promise Common Behaviours" (=> ()
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
    ),
    (should "all nothing promises are the same instance." (= ()
      assert ((promise nothing) is (promise nothing);
      assert false ((promise nothing) is-not (promise nothing);
    ),
  ),

  (define "Equivalence" (= ()
    (should "iterators' equivalence is defined by their identity." (= ()
      var p (promise of 1);
      assert (p "equals":: is (p "is");
      assert (p "not-equals":: is (p "is-not");
    ),
  ),

  (define "Ordering" (=> ()
    var values (the-values concat (promise empty) (promise nothing);
    (should "comparison of a promise with itself returns 0." (=> ()
      (for p in values
        assert 0 (p compare p);
      ),
    ),
    (should "comparison of two different promises return null." (=> ()
      (for a in values
        (for b in values
          (if (a is-not b)
            assert null (a compare b);
      ),
    ),
  ),

  (define "Emptiness" (= ()
    (should "both (promise empty) and (promise nothing) are defined as empty." (= ()
      assert ((promise empty) is-empty);
      assert false ((promise empty) not-empty);

      assert ((promise nothing) is-empty);
      assert false ((promise nothing) not-empty);
    ),
  ),

  (define "Encoding" (=> ()
    (should "(promise empty) is encoded to tuple (iterator empty)." (= ()
      var code ((promise empty) to-code);
      assert (code is-a tuple);
      assert 2 (code length);
      assert (`promise) (code 0);
      assert (`empty) (code 1);
    ),
    (should "(promise nothing) is encoded to tuple (iterator nothing)." (= ()
      var code ((promise nothing) to-code);
      assert (code is-a tuple);
      assert 2 (code length);
      assert (`promise) (code 0);
      assert (`nothing) (code 1);
    ),
    (should "a non-empty promise is encoded to tuple (promise of ...)." (=> ()
      (for value in the-values
        var code (value to-code);
        assert (code is-a tuple);
        assert 3 (code length);
        assert (`promise) (code 0);
        assert (`of) (code 1);
        assert (symbol etc) (code 2);
      ),
    ),
  ),

  (define "Representation" (=> ()
    (should "(promise empty) is described as '(promise empty)'." (= ()
      assert "(promise empty)" ((promise empty) to-string);
    ),
    (should "(promise nothing) is described as '(promise nothing)'." (= ()
      assert "(promise nothing)" ((promise nothing) to-string);
    ),
    (should "a non-empty promise is described as '(promise of ...)'." (=> ()
      (for value in the-values
        assert "(promise of ...)" (value to-string);
    ),
  ),
),

(define "(promise empty)" (=> ()
  (should "(promise empty) is a promise resolved to null." (=> async
    var p (promise empty);
    assert (p is-a promise);

    p then (async resolve null);
  ),
),
