(let code ($load "examples/example.s").
(console code "#---- code loaded ----\n" code)

(let program ($compile code).
(console code "\n#---- code compiled ----")
(console program program).

(let code ($encode program).
(console code "\n#---- program decompiled ----" code)

(let program ($compile code).
(console code "\n#---- code compiled again ----")
(console program program).

($beval program) # run it!
