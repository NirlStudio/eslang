(let C ($require "./lib/colors" "js").

(let cases (@).
(let current null).

($export "define" (= (feature define-it)
   (let pre current)
   (let current (let spec (@ feature),
   ((|| pre cases) push spec),
   ($ define-it)
   (let current pre)
   (return spec)
).

($export "should" (= (subject do action)
  (if action is-missing
    (let action do)
    (let do subject)
    (let subject "")
  ),
  (if (!($isEmpty subject))
    (+= subject " ")
  ),
  (current push (@
    behaviour: (+ subject "should " do)
    action: action
).

(operator export assert # (expr) or (expected expr) or (expected expr note)
  (if (< %C 2)
    (let (%1 %0) (%0 true),
  ),
  (++ %assert-step)
  (let %9 ($eval %1),
  (if (!= %0 %9)
    (exit (@
      typeId: "assert-failure"
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
  (print code indent (C passed) (C gray behaviour),
  (summary push (@ (path slice 0) true behaviour),
).

(let failing 0)
(let failed (= (behaviour failure)
  (++ failing)
  (print code indent (C failed) (C red (+ "(" failing ") " behaviour),
  (summary push (@ (path slice 0) false behaviour),
  (failures push (@ failing (path slice 0) behaviour failure ),
).

(let execute (= (case)
  (print code indent (case:0),
  (path push (case:0),
  (+= indent "  ")

  (for i
    in ($range 1 (case length),
    (let item (case:i),
    (if (typeof item "array")
      ($execute item)
    else
      (let result ($exec (item "action"),
      (if (typeof result "assert-failure")
        ($failed (item "behaviour") result)
      else
        ($succeeded (item "behaviour")
  ),

  (path pop)
  (let indent (indent substring 0 (- (indent "length") 2),
).

(let print-f (= f
  (print code (+ "  " (f:0) ") [" ((f:1) join " / ") "] " (f:2),
  (let r (f:3),
  (print code (+
    (C red (+ "     step-" (r step) " is expecting "),
    (C green (C underline (encode value (r "expected"),
    (C red (+ " instead of " (C underline (encode value (r "real"),
  ),
  (print code (C gray (+ "     when asserting "
    (C underline (encode clause (r "expr"),
    (if ($isEmpty (r note)) "" (+ ", " (r note),
    "\n"
).

(= (*)
  (for module in argv
    (let load ($run module),
    (if (typeof load "function") ($load),
  ),

  (if (< (cases length) 1) (exit),

  (print code "  Start to run sugly test suite ...\n")
  (let t1 ((date) getTime),
  (for case in cases ($execute case),
  (let t2 ((date) getTime),

  (print code (+
    (C green (+ "\n  passing: " passing),
    (C gray (+ " (" (- t2 t1) "ms)"),
  ),
  (if (> failing 0)
    (print code (C red (+ "  failing: " failing "\n"),
    (for failure in failures
      ($print-f failure)
    ), else do-nothing
  ),
  (if (C is-missing)
    (print code "\n  P.S. To prettify output, please run 'npm install'.\n")
  ),
  (@ summary: summary failures: failures)
).
