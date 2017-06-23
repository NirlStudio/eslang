(let color-of (import "colors" "js").

(let display-as (=> (color)
  (=> (feature comment)
    (let color (:color ?? (= (text) text),
    (print (color (+ "[" ((:do name) to-upper) "] ") feature (comment ? (" - " + comment) ""),
).

(let featured (display-as (color-of "green").
(let new (display-as (color-of "green").
(let modified (display-as (color-of "gray").
(let removed (display-as (color-of "red").
(let todo (display-as ).

(print "---- Feb 6, 2017 ----")
(featured "New Object/Class/Interface logics")
(featured "New to-code/to-string logic" "a nested object can be serialized now.")

(new "extendable type Enum" "to manage a named value set")
(new "extendable type Flags" "to manage a set of combinable integer values by bits.")
(new "object:looks" "to test the similarity of two objects or if the object complys with an interface")

(modified "operator let" "assign to existing module/local variable or create a new local variable")
(modified "operator var" "assign value to or create a new local variable")
(modified "Object/Class/Interface - Interface is static type and create only a descriptor object.")

(removed "operator $" "replaced by ':', but it's still reseved for future usage temporarily.")
(removed "operator global" "deprecated for new let/var pattern")
(removed "get-type" "deprecated for duplication with type property")

(todo "new code formatter")
(todo "basic Data Structures" "Set and Map")
(todo "new expandable type" "Device")
(todo "debugging" "display a warning for a partial success evaluation")
(todo "debugging" "stacktrace & break points")
