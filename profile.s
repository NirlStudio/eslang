const gray (= text (printf text, "gray");
const blue (= text (printf text, "blue");

# secret aliases of exit.
(if (env "runtime-host":: is "native")
  export (bye quit) (->() (exit );
else
  export reload (->() (exit );
).

gray "# profile functions";
blue " version"; gray ",";
(export version (= ()
  run "tools/version";
).

blue " describe"; gray " and";
(export describe (=> it
  (if ($it is-a object)
    (object fields-of it:: sort:: for-each (=> p
      print '$p # $(type of ($it:p))';
    ).
  else
    ($it is-a array:: ? it, (@ it):: for-each (=> (v i)
      print '#($(i), $(type of v))# $v';
).

blue " selftest";
(export selftest (= spec
  (if (spec is-empty)
    test-bootstrap;
    run "test/test";
  else
    (spec is "bootstrap":: ?
      test-bootstrap;
      run "test/test" arguments;
).

gray " are imported.\n";
