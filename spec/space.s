($define "space levels" (= ()
  ($should "a module" "have same spaceIdentifier and moduleSpaceIdentifier" (= ()
      (let r ($exec "(@ sid: spaceIdentifier mid: moduleSpaceIdentifier)"),
      (assert ('((r"sid") == (r"mid"),
  ),

  ($should "a function" "have different spaceIdentifier and moduleSpaceIdentifier" (= ()
      (let r ($exec "($ (=() (@ sid: spaceIdentifier mid: moduleSpaceIdentifier)"),
      (assert ('((r "sid") != (r "mid"),
  ),

  ($should "a closure" "have different spaceIdentifier and moduleSpaceIdentifier" (= ()
      (let c (= a > () (@ sid: spaceIdentifier mid: moduleSpaceIdentifier),
      (let r ($ c),
      (assert (`((r "sid") != (r "mid"),
  ),

  ($should "a lambda" "have different spaceIdentifier and moduleSpaceIdentifier" (= ()
      (let l (=> (x) > (y) (@ sid: spaceIdentifier mid: moduleSpaceIdentifier),
      (let r ($ ($l),
      (assert (`((r "sid") != (r "mid"),
  ),

  ($should "$export" "export an object to global space" (= ()
      ($require "space-mod"),
      (assert "object" (`(typeof _exported),
      (assert "obj" (`(_exported "name")
  ),

  ($should "$export" "not export an object in sealed space" (= ()
      ($exec "($export \"_sealed\" (@ name: \"obj\")."),
      (assert null (` _sealed),
).
