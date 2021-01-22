# simple importing
(let symbols (import "$eslang/symbols").
(print "(symbols passed)" (symbols passed).

# populate fields from an object into current context.
(let (passed failed) symbols).
(print "(symbols passed)" passed).
(print "(symbols failed)" failed).

# import fields from an object into an array.
(let list (import (passed failed) from symbols).
(print "list is-an array?" (list is-an array).
(print "list length?" (list length) (list length:: == 2).

# populate values from an array
(let (failed passed) list).
(print failed "- failed is passed").
(print passed "- passed is failed").

# directly populate module exporting into current space.
(let (passed failed) (import "$eslang/symbols").
(print passed "- passed is passed").
(print failed "- failed is failed").

# import and rename selected exporting.
(let (not-failed not-passed)
  (import (passed failed) from "$eslang/symbols")
).
(print not-failed "- not-failed is passed").
(print not-passed "- not-passed is failed").

# import all from exporting.
(let * (import "$eslang/symbols").
(print passed "- passed is passed").
(print failed "- failed is failed").
(print pending "- pending is pending").
