(let C (import "../lib/colors" "js").

(let cases (@).
(let current null).

(export "define" (= (feature define-it)
   (let pre current)
   (let current (let spec (@ feature),
   ((|| pre cases) push spec),
   (define-it)
   (let current pre)
   (return spec)
).

(export "should" (= (subject predicate action)
  (if action is-missing
    (let action predicate)
    (let predicate subject)
    (let subject "")
  ),
  (if (subject not-empty)
    (+= subject " ")
  ),
  (current push (@
    behaviour: (+ subject "should " predicate)
    action: action
).

(operator export assert # (expr) or (expected expr) or (expected expr note)
  (if (%C < 2)
    (let (%1 %0) (%0 true),
  ),
  (++ %assert-step)
  (let %9 (eval %1),
  (if (%0 != %9)
    (exit (@
      is-failure: true
      step: %assert-step
      expected: %0
      expr: %1
      note: %2
      real: %9),
  ),
).

(let summary (@).
(let failures (@).

(let path (@).
(let indent "  ")

(let passing 0)
(let succeeded (= behaviour
  (++ passing)
  (print indent (C passed) (C gray behaviour),
  (summary push (@ (path copy) true behaviour),
).

(let failing 0)
(let failed (= (behaviour failure)
  (++ failing)
  (print indent (C failed) (C red (+ "(" failing ") " behaviour),
  (summary push (@ (path copy) false behaviour),
  (failures push (@ failing (path copy) behaviour failure ),
).

(let test (= (case)
  (print indent (case first),
  (path push (case first),
  (+= indent "  ")

  (for i in (1:(case length))
    (let task (case:i),
    (if (task is-a Array)
      (do task)
    else
      (let result (execute (task "action"),
      (if (result is-failure)
        (failed (task "behaviour") result)
      else
        (succeeded (task "behaviour")
  ),

  (path pop)
  (-= indent 2),
).

(let print- (= f
  (print (+ "  " (f 0) ") [" ((f 1) to-string " / ") "] " (f 2),
  (let r (f 3),
  (print (+
    (C red (+ "     step-" (r step) " is expecting "),
    (C green (C underline ((r "expected") to-code),
    (C red (+ " instead of " (C underline ((r "real") to-code),
  ),
  (print (C gray (+ "     when asserting "
    (C underline (encode clause (r "expr"),
    (((r note) is-empty) ? "" (", for " + (r note),
    "\n"
).

(= (*)
  (for module in argv
    (let loader (run module),
    (if (loader is-a Function) (loader ),
  ),

  (if (cases is-empty) (exit),

  (print "  Start to run sugly test suite ...\n")
  (let t1 (date ),
  (for case in cases (test case),
  (let t2 (date ),

  (print (+
    (C green (+ "\n  passing: " passing),
    (C gray (+ " (" (t2 - t1) "ms)"),
  ),
  (if (failing > 0)
    (print (C red (+ "  failing: " failing "\n"),
    (for failure in failures
      (print- failure)
    ), else do-nothing
  ),
  (if (C is-missing)
    (print "\n  P.S. To prettify output, please run 'npm install'.\n")
  ),
  (return (@ summary: summary failures: failures)
).
