(let x 123)
(print "let x" x).

(var y 123)
(print "var y" y).

(export z 123)
(print "export z" z).

(let (x y z) (@1 2 3).
(print x y z).

(var (x y z) (@ 10 20 30).
(print x y z).

(let (x y z) (@ x:100 y:200 z:300 a:400).
(print x y z).

(var (x y z) (@ x:1000 y:2000 z:3000 a:4000).
(print x y z).

(let (x y z) 0).
(print x y z).
