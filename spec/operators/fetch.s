(define "(fetch ...)" (=> ()
  (var path-of (= file
    (env "os":: starts-with "win32"::? "spec\\operators\\", "spec/operators/") + file;
  ).
  (should "(fetch) returns null." (= ()
    assert null (fetch);
  ).
  (should "(fetch module) returns a promise resolved to (@ module)." (=> ()
    (fetch "_data":: then (=> waiting
      assert (waiting result:: is-a array);
      assert 1 (waiting result:: length);
      assert (waiting result:: 0:: ends-with (path-of "_data.s");
    ).
  ).
  (should "(fetch module1 module2) returns a promise resolved to (@ module1 module2)." (=> ()
    (fetch "_data" "_module":: then (=> waiting
      assert (waiting result:: is-a array);
      assert 2 (waiting result:: length);
      assert (waiting result:: 0:: ends-with (path-of "_data.s");
      assert (waiting result:: 1:: ends-with (path-of "_module.s");
    ).
  ).
  (should "(fetch module1 module2 ...) returns a promise resolved to (@ module1 module2 ...)." (=> ()
    (fetch "_data" "_module":: then (=> waiting
      assert (waiting result:: is-a array);
      assert 2 (waiting result:: length);
      assert (waiting result:: 0:: ends-with (path-of "_data.s");
      assert (waiting result:: 1:: ends-with (path-of "_module.s");
    ).
  ).
  (should "(fetch remote-module) returns a promise resolved to (@ remote-module)." (=> ()
    (const remote-mod (env "runtime-host":: == "browser":: ?
      "http://localhost:6501/test/test"
      "https://github.com/NirlStudio/sugly-lang/tree/master/modules/test"
    ).
    (fetch remote-mod:: then (=> waiting
      assert (waiting result:: is-a array);
      assert 1 (waiting result:: length);
      assert '$(remote-mod).s' (waiting result:: 0);
    ).
  ).
  (should "(fetch remote-module) returns a rejected promise if the module does not exist." (=> ()
    (const remote-mod (env "runtime-host":: == "browser":: ?
      "http://localhost:6501/non-existed.s"
      "https://example.com/index.s"
    ).
    (fetch remote-mod:: then (=> waiting
      assert null (waiting result);
      assert (waiting excuse:: is-a array);
      assert 404 (waiting excuse:: 0);
    ).
  ).
).
