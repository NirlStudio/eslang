(define "space levels" (= ()
  (should "a module" "have same spaceIdentifier and moduleIdentifier" (= ()
      (let r (exec "(@ sid: spaceIdentifier mid: moduleIdentifier)"),
      (assert (` ((r "sid") == (r"mid"),
  ),

  (should "a function" "have different spaceIdentifier and moduleIdentifier" (= ()
      (let r (exec "((=() (@ sid: spaceIdentifier mid: moduleIdentifier)"),
      (assert (` ((r "sid") != (r "mid"),
  ),

  (should "a closure" "have different spaceIdentifier and moduleIdentifier" (= ()
      (let c (= a > () (@ sid: spaceIdentifier mid: moduleIdentifier),
      (let r c),
      (assert (`((r "sid") != (r "mid"),
  ),

  (should "a lambda" "have different spaceIdentifier and moduleIdentifier" (= ()
      (let l (=> (x) > (y) (@ sid: spaceIdentifier mid: moduleIdentifier),
      (let r ((l),
      (assert (`((r "sid") != (r "mid"),
  ),

  (should "export" "export an object to global space" (= ()
      (require "space-mod"),
      (assert (`(_exported is-a Object),
      (assert "obj" (`(_exported "name")
  ),

  (should "export" "not export an object in sealed space" (= ()
      (exec "(export \"_sealed\" (@ name: \"obj\")."),
      (assert null (` _sealed),
).
