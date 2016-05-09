# this is a piece of comment
(print code "# ")
(print value (+ "Hello" " world!").
(print value (+ 100 10 1).
(print value (- 100 10 1))
(print value (* 100 10 1))
(print value (/ 100 10 1))

($"log100" (` Math log 100).
(print value (log100).

(print value (+ ""
  (log100) " is a great number"
).


($"obj" ($object ))
(obj "code" 43)

($"msg" "message")
(print value (obj:msg "Hello world!").
(print value (obj "message"))

(print code "# obj.code: " (obj "code").
(print value msg)
(print value (obj "message").
(print value (obj:msg).
(print (` log) "obj.message: " (obj:msg).

(print value "---------" function)
($"add" (= (x y) (+ x y 10).
(print value ($add 3 2).

($"add" ($function (`(x y)) (`( (+ x y 10)).
(print value ($add 3 2).

($"add" (= (x y)
  (+ x y 100).
(print value ($add 1 2).

($"sumWithBase" ($function (`base) (`(
  ($"ctx" ($object),
  (ctx "base" base),
  ($lambda ctx (`(x y)) (`( (+ base x y).

($"sum" ($sumWithBase 100).
(print value ($sum 10 1).

($"sumWithBase" (=> base > (x y)
  (+ base x y).

(print value sumWithBase)
($"sum" ($sumWithBase 100).

(print value sum)
(print value ($sum 10 2).


($"sumWithBase" (= base
  (= base > (x y)
    (+ base x y).
($"sum" ($sumWithBase 1000).
(print value ($sum 10 1).


($"sumWithBase" (= base
  (= (base) > (x y)
    (+ base x y).
($"sum" ($sumWithBase 10000).
(print value ($sum 10 1).


(let sumWithBase (= base
  (= (@ base: (* base 2)) > (x y)
    (+ base x y).
($"sum" ($sumWithBase 10000).
(print value ($sum 10 1).


(print value (if "" 1 2))

($"counter" 10)
(while (-- counter)
  (if (== counter 8) (continue ),
  (print code "# counter is" counter)
  (if (== counter 4) (break ), # this is inline comment.
).

($"sum" (= (*)
  ($"i" -1)
  ($"result" 0)
  (while (!= (++ i) argc)
    (++ result (argv:i).

(print code "# sum" ($sum 1 2 3 9 100 1 "fhfgh").

(let sum (= (*)
  (let i 0)
  (let result 0)
  (for (!= i argc) (++ i)
    (++ result (argv:i).

(print code "#sum" ($sum 100 100 100).

(print value (let (a 12) (b 18).

(let obj (@ "a": 12 b: 13).
(print value (obj"b").
 #" 12312312

(print value (typeof ($import "colors" "js").

(let f (= (*) (@ s: ($ ":") argc: argc argv: argv),
(let s (object))
(let args (@ 1 2))
(let r (f apply s args),
(print value (-> r "argv" (:1)),

(let r (f call s 3 4),
(print value (-> r "argv" (:1)),

(exit -1 2)
(return 0)
(return 1)
# This is another piece of comment
