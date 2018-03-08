(let color-of (import "colors" "js").

(let display-as (= color
  (:color ?? (let color (= () (arguments join ""),
  (=> (feature)
    (print (color ("[" + ((:do name) to-upper) "] ") feature),
).

(let new (display-as (color-of "green").
(let modified (display-as (color-of "gray").
(let removed (display-as (color-of "red").
(let todo (display-as *).

(let version (= ver (print "\n----" ver "----").

(version "0.1.0")
(new "The very ugly first release.")

(version "0.3.1")
(removed "As a release, it had been cancelled.")
(modified "But some of its code is refactored into 0.3.2.")

(version "0.3.2 (latest)")
(new "re-designed type system.")
(new "re-designed space/scope.")
(new "re-designed operator.\n")

(modified "to-code/to-string logic.")
(modified "syntax of let, var and export.")
(modified "iterator & iteration logic.")
(modified "more minior features.\n")

(removed "operator global - replaced by new app-export mechanisim.")
(removed "(* get-type) for duplicating type property.")
(removed "more functions and operators.\n")

(todo "callstack optimisation.")
(todo "stack tracing.")
(todo "string formatting.")
(todo "block comment like #( )#")
(todo "run in browser.")
(todo "basic Web UI elements.")
(todo "debugging tool.")

(print "\n  Enjoy the sugliness.\n")
