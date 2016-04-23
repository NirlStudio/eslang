# this is a piece of comment
(console code "# ")
(console log (+ "Hello" " world!").
(console log (+ 100 10 1).
(console log (- 100 10 1))
(console log (* 100 10 1))
(console log (/ 100 10 1))

($"log100" (` Math log 100).
(console log (log100).

(console log (+ ""
  (log100) " is a great number"
).


($"obj" ($object ))
(obj "code" 43)

($"msg" "message")
(console log (obj:msg "Hello world!").
(console log (obj "message"))

(console code "# obj.code: " (obj "code").
(console log msg)
(console log (obj "message").
(console log (obj:msg).
(console (` log) "obj.message: " (obj:msg).

(console log "---------" function)
($"add" (= (x y) (+ x y 10).
(console log ($add 3 2).

($"add" ($function (`(x y)) (`( (+ x y 10)).
(console log ($add 3 2).

($"add" (= (x y)
  (+ x y 100).
(console log ($add 1 2).

($"sumWithBase" ($function (`base) (`(
  ($"ctx" ($object),
  (ctx "base" base),
  ($lambda ctx (`(x y)) (`( (+ base x y).

($"sum" ($sumWithBase 100).
(console log ($sum 10 1).

($"sumWithBase" (=> base > (x y)
  (+ base x y).

(console log sumWithBase)
($"sum" ($sumWithBase 100).

(console log sum)
(console log ($sum 10 2).


($"sumWithBase" (= base
  (= base > (x y)
    (+ base x y).
($"sum" ($sumWithBase 1000).
(console log ($sum 10 1).


($"sumWithBase" (= base
  (= ((base (* base 2))) > (x y)
    (+ base x y).
($"sum" ($sumWithBase 10000).
(console log ($sum 10 1).


(let sumWithBase (= base
  (= (@ base: (* base 2)) > (x y)
    (+ base x y).
($"sum" ($sumWithBase 10000).
(console log ($sum 10 1).


(console log (if "" 1 2))

($"counter" 10)
(while (-- counter)
  (if (== counter 8) (continue ),
  (console code "# counter is" counter)
  (if (== counter 4) (break ), # this is inline comment.
).

($"sum" (= (*)
  ($"i" -1)
  ($"result" 0)
  (while (!= (++ i) argc)
    (++ result (argv:i).

(console code "# sum" ($sum 1 2 3 9 100 1 "fhfgh").

(let sum (= (*)
  (let i 0)
  (let result 0)
  (for (!= i argc) (++ i)
    (++ result (argv:i).

(console code "#sum" ($sum 100 100 100).

(console log (let (a 12) (b 18).

(let obj (@ "a": 12 b: 13).
(console log (obj"b").
 #" 12312312

(console log (typeof ($require "chai" "js").

(let f (= (*) (@ s: ($ ":") argc: argc argv: argv),
(let s (object))
(let args (@ 1 2))
(let r ($call f s args),
(console log (-> r "argv" (:1)),

(exit -1 2)
(return 0)
(return 1)
# This is another piece of comment
