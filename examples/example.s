# this is a piece of comment
(print code "# ")
($print (+ "Hello" " world!").
($print (+ 100 10 1).
($print (- 100 10 1))
($print (* 100 10 1))
($print (/ 100 10 1))

($"log100" (` Math log 100).
($print (log100).

($print (+ ""
  (log100) " is a great number"
).


($"obj" ($object ))
(obj "code" 43)

($"msg" "message")
($print (obj:msg "Hello world!").
($print (obj "message"))

(print code "# obj.code: " (obj "code").
($print msg)
($print (obj "message").
($print (obj:msg).
(print (` log) "obj.message: " (obj:msg).

($print "---------" function)
($"add" (= (x y) (+ x y 10).
($print ($add 3 2).

($"add" ($function (`(x y)) (`( (+ x y 10)).
($print ($add 3 2).

($"add" (= (x y)
  (+ x y 100).
($print ($add 1 2).

($"sumWithBase" ($function (`base) (`(
  ($"ctx" ($object),
  (ctx "base" base),
  ($lambda ctx (`(x y)) (`( (+ base x y).

($"sum" ($sumWithBase 100).
($print ($sum 10 1).

($"sumWithBase" (=> base > (x y)
  (+ base x y).

($print sumWithBase)
($"sum" ($sumWithBase 100).

($print sum)
($print ($sum 10 2).


($"sumWithBase" (= base
  (= base > (x y)
    (+ base x y).
($"sum" ($sumWithBase 1000).
($print ($sum 10 1).


($"sumWithBase" (= base
  (= (base) > (x y)
    (+ base x y).
($"sum" ($sumWithBase 10000).
($print ($sum 10 1).


(let sumWithBase (= base
  (= (@ base: (* base 2)) > (x y)
    (+ base x y).
($"sum" ($sumWithBase 10000).
($print ($sum 10 1).


($print (if "" 1 2))

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

($print (let (a 12) (b 18).

(let obj (@ "a": 12 b: 13).
($print (obj"b").
 #" 12312312

($print (typeof ($require "chai" "js").

(let f (= (*) (@ s: ($ ":") argc: argc argv: argv),
(let s (object))
(let args (@ 1 2))
(let r ($call f s args),
($print (-> r "argv" (:1)),

(exit -1 2)
(return 0)
(return 1)
# This is another piece of comment
