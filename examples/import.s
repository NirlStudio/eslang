# simple importing
(let colors (import "$colors").
(print "(colors green) is-a function?" ($(colors "green") is-a function).

# populate fields from an object into current context.
(let (green gray) colors).
(print "green is-a function?" ($green is-a function).
(print "gray is-a function?" ($gray is-a function).
(print (gray "- gray is gray").
(print (green "- green is green").

# import fields from an object into an array.
(let list (import (gray green) from colors).
(print "list is-a array?" (list is-a array).
(print "list length?" (list length) ((list length) == 2).

# populate values from an array
(let (gray green) list).
(print (gray "- gray is gray").
(print (green "- green is green").

# directly populate module exporting into current space.
(let (gray green) (import "$colors").
(print (gray "- gray is gray").
(print (green "- green is green").

# import and rename selected exporting.
(let (not-gray not-green)
  (import (green gray) from "$colors")
).
(print (not-gray "- green is not gray").
(print (not-green "- gray is not green").
