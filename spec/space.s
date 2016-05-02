($define "space levels" (= ()
  ($should "a module" "have same spaceIdentifier and moduleSpaceIdentifier" (= ()
      (let r ($exec "(@ sid: spaceIdentifier mid: moduleSpaceIdentifier)"),
      (assert ('(== (r"sid") (r"mid"),
  ),

  ($should "a function" "have different spaceIdentifier and moduleSpaceIdentifier" (= ()
      (let r ($exec "($ (=() (@ sid: spaceIdentifier mid: moduleSpaceIdentifier)"),
      (assert ('(!= (r "sid") (r "mid"),
  ),

  ($should "a closure" "have different spaceIdentifier and moduleSpaceIdentifier" (= ()
      (let c (= a > () (@ sid: spaceIdentifier mid: moduleSpaceIdentifier),
      (let r ($ c),
      (assert (`(!= (r "sid") (r "mid"),
  ),

  ($should "a lambda" "have different spaceIdentifier and moduleSpaceIdentifier" (= ()
      (let l (=> (x) > (y) (@ sid: spaceIdentifier mid: moduleSpaceIdentifier),
      (let r ($ ($l),
      (assert (`(!= (r "sid") (r "mid"),
  ),

  ($should "$export" "export an object to global space" (= ()
      ($exec "($export \"_obj\" (@ name: \"obj\")."),
      (assert "object" (`(typeof _obj),
      (assert "obj" (`(_obj "name")
  ),

  ($should "$export" "not export an object in sealed space" (= ()
      (let space ($createModuleSpace null true),
      ($exec "($export \"_sealed\" (@ name: \"obj\")." "" space),
      (assert null (` _sealed),
).
