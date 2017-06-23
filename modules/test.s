# import rendering
(let C (import "colors" "js").
(let
  (sign-passed (C passed),
  (sign-failed (C failed),
  (gray (C "gray"),
  (green (C "green"),
  (red (C "red"),
  (underline (C "underline"),
).

# to store all test cases.
(let cases (@).
(let current null). # the stack top

(export define (=> (feature describe-it)
   (var top current) # save current context
   (let current (var spec (@ feature), # create the spec object as an array.
   ((top ?? cases) push spec), # save the spec into stack top.
   (describe-it) # extract the description
   (let current top) # recover the stack top.
   (return spec)
).

(export should (=> (subject predicate action)
  (if (action is null) # as (predicate action)
    (let action predicate)
    (let predicate subject)
    (let subject "")
  else
    (if (subject is-not-a string)
      (let subject (subject to-string),
  ),
  (if (subject not-empty)
    (subject += " ")
  ),
  (current push (@
    behaviour: (subject + "should " predicate)
    action: action
).

(export assert (=? (expected expr note) # (expr) or (expected expr) or (expected expr note)
  (if (!expr)
    (let "expr" expected)
    (let "expected" true)
  ),
  (++ assert-step)
  (var "value" (expr),
  (if (value != expected)
    (return (@
      failed: true
      step: assert-step
      expected: expected
      real: value
      expr: expr
      note: note
  ),
).

# test results
(let summary (@).
(let failures (@).

# testing status
(let path (@).
(let indent "  ")

(let passing 0)
(let pass (=> behaviour
  (++ passing)
  (print indent sign-passed (gray behaviour),
  (summary push (@
    path: (path copy)
    behaviour: behaviour
    passed: true
  ),
).

(let failing 0)
(let fail (=> (behaviour assertion)
  (++ failing)
  (print indent sign-failed (red "(" failing ") " behaviour),
  (summary push (@
    path: (path copy)
    behaviour: behaviour
    passed: false
  ),
  (failures push (@
    no.: failing
    path: (path copy)
    behaviour: behaviour
    assertion: assertion
  ),
).

(let test-a (=> (case)
  # print headline
  (print indent (case first),
  (path push (case first),
  (indent += "  ")
  # run test case or run into child cases.
  (for i in (1 (case length))
    (var task (case:i),
    (if (task is-a array)
      (do task)
    else
      (var assertion (task action),
      (if (assertion failed)
        (fail (task behaviour) assertion)
      else
        (pass (task behaviour)
  ),
  # recover status
  (path pop)
  (indent -= 2),
).

(let print-a (=> failure
  (print (+ "  " (failure no.) ") "
    "[" ((failure path) to-string " / ") "]" (failure behaviour),
  ),
  (let assertion (failure assertion),
  (print (+
    (red "     step-" (assertion step) " is expecting "),
    (green (underline ((assertion expected) to-string),
    (red " instead of " (underline ((assertion real) to-string),
  ),
  (print (gray "     when asserting "
    (underline ((assertion expr) to-string),
    (((assertion note) is-empty) ? "" (", for " + (assertion note),
    "\n"
).

(let clear (=>
  # targets
  (let cases (@)
  (let current null)
  # result
  (let summary (@).
  (let failures (@).
  # progress
  (let path (@).
  (let indent "  ")
  # counters
  (let passing 0)
  (let failing 0)
).

(export test (=> ()
  (for suite in arguments (load suite),
  (if (cases is-empty)
    (return ),
  ),
  (print "  Start to run sugly test suites ...\n")
  (let t1 (date now),
  (for case in cases (test-a case),
  (let t2 (date now),

  (print
    (green "\n  passing: " passing),
    (gray " (" (t2 - t1) "ms)"),
  ),
  (if failing
    (print (red "  failing: " failing "\n"),
    (for failure in failures
      (print-a failure)
    ),
  ),
  (if (C is-missing)
    (print "\n  P.S. To prettify output, please run 'npm install'.\n")
  ),
  (var report (@
    summary: summary
    failures: failures),
  (clear )
  (return report)
).
