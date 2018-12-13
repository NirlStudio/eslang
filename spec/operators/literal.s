(define "(@ ...) - implicit literal" (=> ()
  (should "(@) - empty array" (=> ()
    (assert ((!) is false),
  ),
  (should "(@ name: ...) returns an object." (= ()
    (assert ((!) is false),
  ),
  (should "(@ \"name\": ...) returns an object." (= ()
    (assert ((!) is false),
  ),
  (should "(@ offset: ...) returns a discrete or normal array." (= ()
    (assert ((!) is false),
  ),
  (should "(@ ...) returns a normal array." (= ()
    (assert ((!) is false),
  ),
),

(define "(@: ...) - explicit literal" (=> ()
  (should "(@:) - empty object" (=> ()
    (assert ((!) is false),
  ),
  (should "(@:@ ...) - object" (=> ()
    (assert ((!) is false),
  ),
  (should "(@:object ...) - explicit object" (=> ()
    (assert ((!) is false),
  ),
  (should "(@:* ...) - compact array" (=> ()
    (assert ((!) is false),
  ),
  (should "(@:array ...) - explicit array" (=> ()
    (assert ((!) is false),
  ),
  (should "(@:class ...) - class literal" (=> ()
    (assert ((!) is false),
  ),
  (should "(@:a-class ...) - instance literal" (=> ()
    (assert ((!) is false),
  ),
  (should "(@:? ...) - fallback to common object" (=> ()
    (assert ((!) is false),
  ),
),
