(let x 123)
(print "let x:" (x == 123).

(var y 124)
(print "var y" (y == 124).

(export z 125)
(print "export z:" (z === 125).

(let (x y z) (@1 2 3).
(print "(let (x y z) (@...):" (x == 1) (y == 2) (z == 3).

(var (x y z) (@ 10 20 30).
(print "(var (x y z) (@...):" (x == 10) (y == 20) (z == 30).

(let (x y z) (@ a:400 x:100 y:200 z:300).
(print "(let (x y z) (@ a: 400 ...):" (x == 100) (y == 200) (z == 300).

(var (x y z) (@ a:4000 x:1000 y:2000 z:3000).
(print "(var (x y z) (@ a: 400 ...):" (x == 1000) (y == 2000) (z == 3000).

(let (x y z) 0).
(print "(let (x y z) 0):" (x == 0) (y == 0) (z == 0).

(=: () (let x 1).
(print "(= () (let x 1):" (x == 0).

(=: () (var y 2).
(print "(= () (var y 2):" (y == 0).

(=>: () (let x 3) (print (x == 3).
(print "(=> () (let x 3):" (x == 3).

(=>: () (var y 4) (print (y == 4).
(print "(=> () (var y 4):" (y == 0).

((=? () (let "x" 5) (print (x == 5).
(print "(=>? () (let \"x\" 5):" (x == 5).

((=? () (var "y" 6) (print (y == 6).
(print "(=>? () (var \"y\" 6):" (y == 0).
