(export version (= ()
  run "tools/version";
).
print "# version is exported.";

(export selftest (= spec
  (if (spec is-empty)
    test-bootstrap;
    run "test/test";
  else
    (spec is "bootstrap":: ?
      test-bootstrap;
      run "test/test" arguments;
).
print "# selftest is exported.";
