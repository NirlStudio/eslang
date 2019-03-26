(export version (= ()
  run "tools/version";
).

(export describe (=> it
  (if ($it is-a object)
    (object fields-of it:: sort:: for-each (=> p
      print '$p # $(type of ($it:p))';
    ).
  else
    ($it is-a array:: ? it, (@ it):: for-each (=> (v i)
      print '#($(i), $(type of v))# $v';
).

(export selftest (= spec
  (if (spec is-empty)
    test-bootstrap;
    run "test/test";
  else
    (spec is "bootstrap":: ?
      test-bootstrap;
      run "test/test" arguments;
).

print "# functions version, describe and selftest are exported.";
