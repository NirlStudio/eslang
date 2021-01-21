(let mod (import "./module_").
(print "mod is an object" (mod is-an object).
(print "(mod x) is a number 100" ((mod x) is-a number) ((mod x) == 100).
(print "(mod y) is a number 200" ((mod y) is-a number) ((mod y) == 200).
(print "(mod z) is null" ((mod z) is null).
(print "(mod z) is a null" ((mod z) is-a null).
(print "(mod l0) is a lambda" ($(mod "l0") is-a lambda).
(print "(mod f600) is a function" ($(mod "f600") is-a function).

(print "(mod l0 100) is" (mod l0 100) ((mod l0 100) == 100).
(print "(mod f600 200) is" (mod f600 200) ((mod f600 200) == 800).
