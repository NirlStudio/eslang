#!(module test)#

# const values
const indent-step "  ";
var indent indent-step;

# import rendering
const symbols (import "$symbols");
const (gray, green, red, yellow, underlined) (import "styledout");

const sign-passed (=> () (green indent, (symbols passed);
const sign-failed (=> () (red indent, (symbols failed);
const sign-pending (=> () (yellow indent, (symbols pending);

# to store all test cases.
var cases (@);
var current null; # the stack top

# define a new feature or a feature group
(export define (=> (feature, describe-it)
   var top current; # save current context
   let current (var spec (@ feature); # create the spec object as an array.
   (top ?? cases) push spec; # save the spec into stack top.
   describe-it; # extract the description of this feature
   let current top; # recover the original context.
   return spec;
).

# testing status
var path (@);
var pending-actions (@);

# counters
var passing 0;
var failing 0;

# test result data and helpers
var summary (@);
(var summary-append (=> (behavior, passed)
  (summary push (var record (@
    path: (path copy).
    behavior,
    passed
  ).
  return record;
).

var failures (@);
(var failures-append (=> (behavior, assertion, saved-path)
  (failures push (@
    no.: failing,
    path: (saved-path ?? (path copy).
    behavior,
    assertion
  ).
).

(var pass (=> behavior
  ++ passing;
  sign-passed; gray behavior, "\n";
  summary-append behavior, true;
).

(var fail (=> (behavior, assertion)
  ++ failing;
  sign-failed; red "(", failing, ") ", behavior, "\n";
  summary-append behavior, false;
  failures-append behavior, assertion;
).

# async behavior helpers
(var wait (=> behavior
  sign-pending; gray behavior, "\n";
  summary-append behavior;
).

(var finalize (=> (record, assertion)
  (if (assertion is-empty)
    ++ passing;
    record "passed" true;
  else
    ++ failing;
    record "passed" false;
    failures-append (record behavior) , assertion, (record path);
  ).
).

(var validate (= (action)
  ($action is-a lambda:: || ($action is-a function):: ?
    null # a valid action, else
    (=> () # the original action is invalid.
      (assert true false # a virtual assertion to generate a fault.
        'expecting a lambda or function instead of $(type of action) for $action'
      ).
).

(var wrap (=> (action, behavior) (=> ()
  const using-async ($action parameters:: first:: is (`async);
  # only supply async on request.
  const result (using-async ? (action async) (action);
  (if (type of result:: is-not promise)
    result # an async feature may fail immediately too.
  else
    var record (wait behavior);
    (promise of (=> async # a wrapper promise which always resolves to null.
      (result finally (=> waiting
        const excuse (waiting "excuse");
        finalize record (? (type of excuse:: is fault) excuse);
        async resolve;
      ).
  ).
).

(export should (=> (behavior, action)
  (current push (var desc (@
    behavior: behavior,
    action: (validate action:: ?? (wrap action behavior).
  ).
  return desc;
).

# assertion counter
var assertions 0;
var ++assertions (=>() (++ assertions);

# the type of assertion fault.
(var fault (@:class
  constructor: (=(step, expected, real, expr, note)
    this "step" step;
    this "expected" expected;
    this "real" real;
    this "expr" expr;
    this "note" note;
  ).
).

# (expr) or (expected expr) or (expected expr note)
(export assert (=? (&expected, &expr, &note)
  (if (operation length:: - operand:: < 2)
    local "&expr" &expected;
    local "&expected" true;
  ).
  (? ++assertions); # increment global counter
  ++ &asserting-step; # counter in container scope.
  # evaluate operands
  locon "expected" (&expected);
  locon "value" (&expr);
  # by default, use equivalence to verify result.
  (if ($value != expected) # break current case.
    (return (? fault:: of
      &asserting-step, expected, value, &expr, (&note)
).

# the async testing context with helper functions to assert promise results.
(var async (object seal (@
  resolve: (=> (value, note) (? (arguments not-empty)
    (=> waiting # (async resolve value ) or (async resolve value note)
      assert (waiting "excuse":: is null);
      assert value (waiting "result") note;
    ).
    (=> waiting # (async resolve) - resolved to any value.
      assert (waiting "excuse":: is null);
    ).
  ).
  reject: (=> (value, note) (? (arguments not-empty)
    (=> waiting  # (async reject value ) or (async reject value note)
      assert value (waiting "excuse") note;
    ).
    (=> waiting # (async rejected) - rejected to any value except a fault.
      const excuse (waiting "excuse");
      ($excuse is-a fault:: ? excuse # failed already, returns the original fault.
        assert (waiting "excuse":: is-not null);
      ).
).

# test a simple case or a suite of cases.
(var test-a (=> (case)
  # print headline (feature name)
  print indent, (case first);
  path push (case first);
  indent += indent-step;
  (for i in (1 (case length))
    var task (case:i);
    (if (task is-a array)
      do task; # a test suite
    else
      var result (task action); # a test case
      (if (type of result:: is fault) # an exactly fault instance.
        fail (task behavior) result;
      else
        ($result is-not-a promise:: ?
          pass (task behavior);
          pending-actions push result; # to be waited.
        ).
  ).
  # recover status
  path pop;
  indent -= (indent-step length);
).

(var print-a (=> failure
  print '  $(failure no.)) [ $((failure path) join " / ") ] $(failure behavior)';
  const assertion (failure assertion);
  red '     step-$(assertion step) is expecting';
  underlined "green", " ", (assertion "expected");
  red " instead of"; underlined "red", " ", (assertion "real"), "\n";
  gray "     when asserting"; underlined "gray", " ", (assertion "expr");
  gray (assertion note:: is-empty:: ? "", (" , for " + (assertion note))), "\n";
).

(var clear (=> ()
  # targets
  let cases (@);
  let current null;
  # progress
  let path (@);
  let indent indent-step;
  let pending-actions (@);
  # result
  let summary (@);
  let failures (@);
  # counters
  let passing 0;
  let failing 0;
  let assertions 0;
).

(var print-report (=> (ts)
  green '\n  passing: $passing';
  (gray " ("
    ts > 1000:: ? (ts / 1000) ts;
    ts > 1000:: ? "s, " "ms, ";
    pending-actions ?* '$(pending-actions length) async cases, ', "";
    assertions " assertions)\n"
  ).
  (if failing
    red '  failing: $failing\n\n';
    for failure in failures (print-a failure);
  ).
  print;
  (var report (@
    summary: summary,
    failures: failures
  ).
  clear;
  return report;
).

(export test (=> ()
  for suite in arguments (load suite);
  if (cases is-empty) (return);

  print "  Start to run sugly test suites ...\n";
  var t1 (date now);
  for case in cases (test-a case);
  (if (pending-actions is-empty)
    print-report ((date now) - t1);
  else
    (promise all pending-actions:: finally (=> ()
      (@ (print-report ((date now) - t1).
    ).
  ).
).
