(let code ($load "examples/example.s").
(print code "#---- code loaded ----\n" code)

(let program ($compile code).
(print code "\n#---- code compiled ----")
($print program).

(let code ($encode program).
(print code "\n#---- program decompiled ----" code)

(let program ($compile code).
(print code "\n#---- code compiled again ----")
($print program).

($beval program) # run it!
