(define "global" (= ()
  (should "global entities cannot be overwritten" (= ()
    var eval_ (=);
    let eval eval_;
    assert ($eval is eval);
    assert ($eval is-not eval_);

    var m (@:);
    let math p;
    assert (math is math);
    assert (math is-not m);
  ).
).

(define "app" (= ()
  (should "in an app space, -app equals -module." (= ()
    (var result (run "_app", null, -module-dir).
    (assert ((result 3) is-a string).
    (assert ((result 6) is-a string).
    (assert (result 3) (result 6).
  ).
  (should "in an app space, -app-dir equals -module-dir." (= ()
    (var result (run "_app", *, -module-dir).
    (assert ((result 4) is-a string).
    (assert ((result 7) is-a string).
    (assert (result 4) (result 7).
  ).
  (should "-app-home can be the same of -app-dir." (= ()
    (var result (run "_app", *, -module-dir).
    (assert ((result 4) is-a string).
    (assert ((result 5) is-a string).
    (assert -module-dir (result 5).
    (assert (result 4) (result 5).
  ).
  (should "-app-home can be different with -app-dir." (= ()
    (var result (run "spec/runtime/_app", *, (env "runtime-home").
    (assert ((result 4) is-a string).
    (assert ((result 5) is-a string).
    (assert (env "runtime-home") (result 5).
    (assert (result 5:: is-not (result 4).
  ).
).

(define "module" (=> ()
  (should "in a module space, -app comes from the importing app." (=> ()
    (var (app) (import "./_app").
    (assert -app app).
  ).
  (should "in a module space, -app-dir comes from the importing app." (=> ()
    (var (app-dir) (import "./_app").
    (assert -app-dir app-dir).
  ).
  (should "in a module space, -app-home comes from the importing app." (=> ()
    (var (app-home) (import "./_app").
    (assert -app-home app-home).
  ).
  (should "in a module space, -module does not equal -app." (=> ()
    (var (mod) (import "./_app").
    (assert (mod not-equals -app).
  ).
  (should "in a module space, -module-dir does not equal -app-dir." (=> ()
    (var (mod-dir) (import "./_app").
    (assert (mod-dir not-equals -app-dir).
  ).
).

(define "operator" (= ()
  (should "in an operator space, value assignment operators work like functions." (=> ()
    (var x 1)
    (var assign (=? (x v) (let x v).
    (assert 100 (assign y 100).

    (assert 1 x).
    (assert 100 y).

    (let assign (=? v (let "x" v).
    (assert 10 (assign 10).
    (assert 10 x).

    (let assign (=? v (let (`x) v).
    (assert 10 (assign 10).
    (assert 10 x).
  ).
).

(define "lambda" (=> ()
  (should "a lambda space directly derives from the app space." (=> ()
    (var app (=:() -app).
    (assert -app app).

    (let app (eval "(=:() -app)").
    (assert null app).
  ).
  (should "but, a lambda space still reserves its original -module value." (=> ()
    (var mod (=:() -module).
    (assert -module mod).

    (let mod (eval "(=:() -module)").
    (assert null mod).
  ).
).

(define "function" (= ()
  (should "a function space directly derives from the calling space." (=> ()
    (var (x y z) (@ 1 2 3).
    (var update (=>:()
      (var y)
      (var z 10000)
      (=>:()
        (var z)
        (=> (a b c)
          (var old (@ x y z).
          (let (x y z) (@ a b c).
          (@ old (@ x y z).
    ).
    (var (old new) (update 10 20 30).
    (assert 1 (old 0).
    (assert null (old 1).
    (assert null (old 2).
    (assert 10 (new 0).
    (assert 20 (new 1).
    (assert 30 (new 2).

    (assert 10 x).
    (assert 2 y).
    (assert 3 z).

    (let (old new) (update 100 200 300).
    (assert 10 (old 0).
    (assert 20 (old 1).
    (assert 30 (old 2).
    (assert 100 (new 0).
    (assert 200 (new 1).
    (assert 300 (new 2).

    (assert 100 x).
    (assert 2 y).
    (assert 3 z).
  ).
).
