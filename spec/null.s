(define "universal functions for values and objects" (= ()
  (should "implement is/is-not" (= ()
    (assert (` (null is null),
    (assert (` (null is-not 0),
    (assert (` (null is-not false),
    (assert (` (null is-not ""),
  ),
  (should "implement equals/not-equals" (= ()
    (assert (` (null equals null),
    (assert (` (null not-equals 0),
    (assert (` (null not-equals false),
    (assert (` (null not-equals ""),
  ),
  (should "implement equals/not-equals operators" (= ()
    (assert (` (null == null),
    (assert (` (null != 0),
    (assert (` (null != false),
    (assert (` (null != ""),
  ),
  (should "implement is-a/is-not-a" (= ()
    (assert (` (null is-a null),
    (assert (` (null is-not-a 0),
    (assert (` (null is-not-a false),
    (assert (` (null is-not-a ""),
    (assert (` (null is-not-a Type),
    (assert (` (null is-not-a String),
  ),
  (should "implement type" (= ()
    (assert (` ((null type) is null),
    (assert (` ((null type) is-not Type),
    (assert (` ((null "type") is null),
    (assert (` ((null "type") is-not Type),
  ),
  (should "implement super" (= ()
    (assert (` ((null super) is null),
  ),
  (should "implement is-empty/not-empty" (= ()
    (assert (` (null is-empty),
    (assert false (` (null not-empty),
  ),
  (should "implement to-code/to-string" (= ()
    (assert (` ((null to-code) == "null"),
    (assert (` ((null to-string) == "null"),
  ),
  (should "implement common indexer (:)" (= ()
    (assert (` (:(null ":") is-a Function),
  ),
  (should "implement bool test" (= ()
    (assert false (` (null ?),
    (assert 1 (` (null ? 1 ),
    (assert 2 (` (null ? 1 2),
  ),
  (should "implement null fallback" (= ()
    (assert null (` (null ??),
    (assert 1 (` (null ?? 1 ),
    (assert "str" (` (null ?? "str"),
  ),
).
