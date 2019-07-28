(let test true)
(print "(? c t f)" test (? test "is true" "is false").
(let test false)
(print "(? c t f)" test (? test "is true" "is false").

(let test true)
(print "(c ? t f)" test (test ? "is true" "is false").
(let test false)
(print "(c ? t f)" test (test ? "is true" "is false").

(let test true)
(print "(if c ...)" test (if test "false" "true") "is true").
(let test false)
(print "(if c ...)" test (if test "is true" "is false") "is null").

(let test true)
(print "if-else" test (if test "is true" else "DEF" "is false").
(let test false)
(print "if-else" test (if test "ABC"  "is true" else "is false").
