(let code (load "example.s").
(print code "#---- code loaded ----\n" code)

(let p (compile code).
(print code "\n#---- code compiled ----")
(print program p).

(let code (encode program p).
(print code "\n#---- program decompiled ----" code)

(let program (compile code).
(print code "\n#---- code compiled again ----")
(print program p).

(exec p) # run it!
