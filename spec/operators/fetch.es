(define "(fetch ...)" (=> ()
  (var path-of (= file
    (env "os":: starts-with "win32"::? "spec\\operators\\", "spec/operators/") + file;
  ).
  (should "(fetch) returns null." (= ()
    assert null (fetch);
  ).
  (if (env "runtime-host":: is "browser") (should "(fetch module) returns a promise resolved to (@ module)." (=> ()
    (fetch "_data":: then (=> waiting
      assert (waiting result:: is-an array);
      assert 1 (waiting result:: length);
      assert (waiting result:: 0:: ends-with (path-of "_data.es");
    ).
  ).
  (if (env "runtime-host":: is "browser")
    (should "(fetch module1 module2) returns a promise resolved to (@ module1 module2)." (=> ()
      (fetch "_data" "_module":: then (=> waiting
        assert (waiting result:: is-an array);
        assert 2 (waiting result:: length);
        assert (waiting result:: 0:: ends-with (path-of "_data.es");
        assert (waiting result:: 1:: ends-with (path-of "_module.es");
    ).
  ).
  (if (env "runtime-host":: is "browser")
    (should "(fetch module1 module2 ...) returns a promise resolved to (@ module1 module2 ...)." (=> ()
      (fetch "_data" "_module":: then (=> waiting
        assert (waiting result:: is-an array);
        assert 2 (waiting result:: length);
        assert (waiting result:: 0:: ends-with (path-of "_data.es");
        assert (waiting result:: 1:: ends-with (path-of "_module.es");
    ).
  ).
  (should "(fetch remote-module) returns a promise resolved to (@ remote-module)." (=> ()
    (const remote-mod (env "runtime-host":: == "browser":: ?
      (env "runtime-home":: + "/test/test")
      "https://github.com/NirlStudio/eslang/tree/master/modules/test"
    ).
    (fetch remote-mod:: then (=> waiting
      assert (waiting result:: is-an array);
      assert 1 (waiting result:: length);
      assert '$(remote-mod).es' (waiting result:: 0);
    ).
  ).
  (should "(fetch remote-module) returns a rejected promise if the module does not exist." (=> ()
    (const remote-mod (env "runtime-host":: == "browser":: ?
      (env "runtime-home":: + "/non-existed.es")
      "https://example.com/index.es"
    ).
    (fetch remote-mod:: then (=> waiting
      assert null (waiting result);
      assert (waiting excuse:: is-an array);
      assert 404 (waiting excuse:: 0);
    ).
  ).
).
