(let C (import "../lib/colors" "js").

(let cases (@). # to store all test cases.
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
      expr: expr
      note: note
      real: value
  ),
).

(let summary (@).
(let failures (@).

(let path (@).
(let indent "  ")

(let passing 0)
(let succeeded (=> behaviour
  (++ passing)
  (print indent (C passed) (C gray behaviour),
  (summary push (@ (path copy) true behaviour),
).

(let failing 0)
(let failed (=> (behaviour failure)
  (++ failing)
  (print indent (C failed) (C red (+ "(" failing ") " behaviour),
  (summary push (@ (path copy) false behaviour),
  (failures push (@ failing (path copy) behaviour failure ),
).

(let test-a (=> (case)
  (print indent (case first),
  (path push (case first),
  (indent += "  ")

  (for i in (1:(case length))
    (var task (case:i),
    (if (task is-a array)
      (do task)
    else
      (var testing (task action),
      (if (testing failed)
        (failed (task behaviour) result)
      else
        (succeeded (task behaviour)
  ),

  (path pop)
  (-= indent 2),
).

(let print- (=> f
  (print (+ "  " (f 0) ") [" ((f 1) to-string " / ") "] " (f 2),
  (let r (f 3),
  (print (+
    (C red (+ "     step-" (r step) " is expecting "),
    (C green (C underline ((r expected) to-string),
    (C red (+ " instead of " (C underline ((r real) to-string),
  ),
  (print (C gray (+ "     when asserting "
    (C underline ((r expr) to-string),
    (((r note) is-empty) ? "" (", for " + (r note),
    "\n"
).

(export test (=> ()
  (clear-context )
  (for module in arguments
    (let loader (run module),
    (if (loader is-a Function) (loader ),
  ),

  (if (cases is-empty) (exit),

  (print "  Start to run sugly test suite ...\n")
  (let t1 (date now),
  (for case in cases (test-a case),
  (let t2 (date now),

  (print (+
    (C green (+ "\n  passing: " passing),
    (C gray (+ " (" (t2 - t1) "ms)"),
  ),
  (if (failing > 0)
    (print (C red (+ "  failing: " failing "\n"),
    (for failure in failures
      (print- failure)
    ),
  ),
  (if (C is null)
    (print "\n  P.S. To prettify output, please run 'npm install'.\n")
  ),
  (return (@ summary: summary failures: failures)
).
