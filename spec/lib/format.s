(define "format pattern string" (=> ()
  (should "'$(x + y)' evaluates pattern in current context." (= ()
    let x 1;
    let y 2;
    assert "$(x + y)3" '$(x + y)';
  ),
),

(define "(string format pattern ...)" (=> ()
  (should "(string format) return null." (= ()
    assert null (string format);
  ),
),
