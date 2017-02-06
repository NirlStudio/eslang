(let code (load "example.s").
(print "#---- code loaded ----\n" code)

(let p (compile code).
(print "\n#---- code compiled ----")
(print (encode program p).

(let code (p to-program).
(print "\n#---- program decompiled ----" code)

(let program (compile code).
(print "\n#---- code compiled again ----")
(print (encode program p).

(exec p) # run it!
