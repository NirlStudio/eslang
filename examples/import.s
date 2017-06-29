# simple importing
(let colors (import "colors" "js").
(print "(colors green) is-a function?" (:(colors "green") is-a function).

# populate fields from an object into current context.
(let (green gray) colors)
(print "green is-a function?"(:green is-a function).
(print "gray is-a function?" (:gray is-a function).
(print (gray "- gray").
(print (green "- green").

# import fields from an object into an array.
(let list (import (gray green) from colors).
(print "list is-a array?" (list is-a array).
(print "list length?" (list length).

# populate values from an array
(let (gray green) list)
(print (gray "- gray").
(print (green "- green").

# directly populate module exprting into current space.
(let (gray green) (import "colors" "js").
(print (gray "- gray").
(print (green "- green").

# import and rename selected exporting.
(let (not-gray not-green)
  (import (green gray) from "colors" "js").
(print (not-gray "- green").
(print (not-green "- gray").
