(let colors ($require "colors/safe" "js").

(let cases (@).
(let current null).

($export "define" (= (feature define)
   (let pre current)
   (let current (let spec (@ feature),
   ((|| pre cases) push spec),
   ($ define)
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

(operator assert # (expr) or (expected expr)
  (if %1
    (let (expected %0) (expr %1),
  else
    (let (expected true) (expr %0),
  ),
  (++ assertStep)
  (let real ($eval expr),
  (if (!= expected real)
    (exit (@
      typeIdentifier: "assert-failure"
      step: assertStep
      expected: expected
      real: real
      expr: expr),
  ),
).

(let summary (@))
(let failures (@))

(let path (@))
(let indent "  ")

(let passing 0)
(let succeeded (= behaviour
  (++ passing)
  (print code indent (colors green "\u2713 ") (colors gray behaviour),
  (summary push (@ (path slice 0) true behaviour),
).

(let failing 0)
(let failed (= (behaviour failure)
  (++ failing)
  (print code indent (colors red (+ "(" failing ") " behaviour),
  (summary push (@ (path slice 0) false behaviour),
  (failures push (@ failing (path slice 0) behaviour failure ),
).

(let execute (= (case)
  (print code indent (case:0),
  (path push (case:0))
  (+= indent "  ")

  (for i in ($range 1 (case length))
    (let item (case:i))
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
  (print code (+ "  " (f:0) ") " ((f:1) join "/") " " (f:2),
  (let r (f:3),
  (print code (+
    (colors red (+ "     step-" (r step) " is expecting "),
    (colors green (colors underline (r "expected"),
    (colors red (+ " instead of " (colors underline (r "real"),
  ),
  (print code (colors gray (+ "     when asserting "
    (colors underline (encode clause (r "expr"), "\n"
).

(= (*)
  (for module in argv ($run (+ module ".s"),
  (for case in cases ($execute case),

  (print code (colors green (+ "\n  passing: " passing),
  (if (> failing 0)
    (print code (colors red (+ "  failing: " failing "\n"),
    (for failure in failures
      ($print-f failure)
    ), else do-nothing
  ),
  (@ summary: summary failures: failures)
).
