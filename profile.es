const path (import "$eslang/path");
const (get-help, add-help) (import (get add) from "./tools/help");

const gray (= text (printf text, "gray");
const blue (= text (printf text, "blue");
const yellow (= text (printf text, "yellow");

# secret aliases of exit.
(if (env "runtime-host":: is "native")
  export (bye quit) (->() (exit );
else
  export reload (->() (exit );
).

# display runtime version
(export version (=> ()
  run (path resolve (env "runtime-home"), "tools/version");
).

version;

# display shell object information.
gray "# object "; yellow ".loader"; gray ", and functions ";
blue ".echo"; gray ", "; blue ".debug"; gray " and "; blue ".logging";
gray " are imported.\n";

gray "# functions "; blue "version"; gray ", ";
blue "desc/describe";
(export (desc, describe) (=> it
  (if ($it is-an object)
    (object fields-of it:: sort:: for-each (=> p
      print '$p # $(type of ($it:p))';
    ).
  else
    ($it is-an array:: ? it, (@ it):: for-each (=> (v i)
      print '#($(i), $(type of v))# $v';
).

gray " and operators "; blue "help";
(export help (=? (subject, topic)
  "try '(help)' or 'help;' to ask for help."
  local "content" ((. get-help) (subject key) (topic key);
  (if (content is-empty)
    "not available."; false
  else
    print content; true
).

gray ", "; blue "selftest";
(export selftest (=? spec
  "try '(selftest)' or 'selftest;' to run all specifications."
  (if (spec is-empty)
    test-bootstrap;
    run "test/test", null, (env "runtime-home");
  else
    (spec key:: is "bootstrap":: ? (test-bootstrap ),
      (run "test/test",
        (operation slice operand:: to-array:: map (= p (p key).
        (env "runtime-home")
      ).
).
gray " are imported.\n";
