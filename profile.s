const (get-help, set-help) (import (get set) from "tools/help");

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

gray " operators";
blue " help"; gray ",";
(export help (=? (subject, topic)
  local "content" ((? get-help) (subject key) (topic key);
  (if (content is-empty)
    "not available."; false
  else
    print content; true
).

blue " selftest";
(export selftest (=? spec
  (if (spec is-empty)
    (? test-bootstrap);
    run "test/test";
  else
    (spec key:: is "bootstrap":: ?
      (? test-bootstrap);
      run "test/test" (operation slice operand:: to-array:: map (= p (p key);
).
gray " are imported.\n";