(define "(export ...) has assignment side effects like (var ...)" (= ()
  (should "(export) returns null." (= ()
    (var exported (export).
    (assert null exported).
  ).
  (should "(export sym) returns null and declares a variable sym with value of null." (= ()
    (var x)
    (var exported (export y).
    (assert null exported).
    (assert null y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(export sym) returns null and updates the value of sym to null." (= ()
    (var x)
    (var y 100)
    (var exported (export y).
    (assert null exported).
    (assert null y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(export sym value) returns value and declares a variable sym with value." (= ()
    (var x)
    (var exported (export y 100).
    (assert 100 exported).
    (assert 100 y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(export sym value) returns value and updates the value of sym to value." (= ()
    (var (x y).
    (var exported (export y 100).
    (assert 100 exported).
    (assert 100 y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(export *) returns null and has not other side effects." (= ()
    (var exported (export *).
    (assert null exported).
    (assert null *).

    (=>:() (let * 1).
    (assert null *).
  ).
  (should "(export * obj) returns obj and exporst all fields and their values in obj." (= ()
    (var obj (@ x: null y: 1 z: (=).
    (var exported (export * obj).
    (assert obj exported).
    (assert null *).
    (assert null x).
    (assert 1 y).
    (assert (obj "z") z).

    (=>:() (let x 100).
    (assert 100 x).
  ).
  (should "(export (fields ...) obj) returns obj and exports given fields and their values in obj." (= ()
    (var x)
    (var obj (@ x: null y: 1 z: (=) a: 100 b: 200).
    (var exported (export (x y z) obj).
    (assert obj exported).
    (assert null x)
    (assert 1 y).
    (assert (obj "z") z).

    (assert 100 (obj a).
    (assert 200 (obj b).
    (assert null a).
    (assert null b).

    (=>:() (let x 100).
    (assert 100 x).
  ).
  (should "(export (names ...) value) returns value and exports the same value to all names." (= ()
    (var x)
    (var exported (export (x y z a) 10).
    (assert 10 exported).
    (assert 10 x)
    (assert 10 y)
    (assert 10 z)
    (assert 10 a)

    (=>:() (let x 100) (let a 200).
    (assert 100 x).
    (assert 200 a).
  ).
  (should "(export (names ...) values) returns values and exports each value by its corresponding name." (= ()
    (var x)
    (var a 100)
    (var values (@ null 1 (=)).
    (var exported (export (x y z a) values).
    (assert values exported).
    (assert null x)
    (assert 1 y).
    (assert (values 2) z).
    (assert null a)

    (=>:() (let x 100) (let a 200).
    (assert 100 x).
    (assert 200 a).
  ).
).

(define "(var ...)" (= ()
  (should "(var) returns null." (= ()
    (var value_ (var).
    (assert null value_).
  ).
  (should "(var sym) returns null and declares a variable sym with value of null." (= ()
    (var x)
    (var value_ (var y).
    (assert null value_).
    (assert null y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(var sym) returns null and updates the value of sym to null." (= ()
    (var x)
    (var y 100)
    (var value_ (var y).
    (assert null value_).
    (assert null y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(var sym value) returns value and declares a variable sym with value." (= ()
    (var x)
    (var value_ (var y 100).
    (assert 100 value_).
    (assert 100 y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(var sym value) returns value and updates the value of sym to value." (= ()
    (var (x y).
    (var value_ (var y 100).
    (assert 100 value_).
    (assert 100 y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(var *) returns null and has not other side effects." (= ()
    (var value_ (var *).
    (assert null value_).
    (assert null *).

    (=>:() (let * 1).
    (assert null *).
  ).
  (should "(var * obj) returns obj and declares all fields and their values in obj as variables." (= ()
    (var obj (@ x: null y: 1 z: (=).
    (var value_ (var * obj).
    (assert obj value_).
    (assert null *).
    (assert null x).
    (assert 1 y).
    (assert (obj "z") z).

    (=>:() (let x 100).
    (assert 100 x).
  ).
  (should "(var (fields ...) obj) returns obj and declares given fields and their values in obj as variables." (= ()
    (var x)
    (var obj (@ x: null y: 1 z: (=) a: 100 b: 200).
    (var value_ (var (x y z) obj).
    (assert obj value_).
    (assert null x)
    (assert 1 y).
    (assert (obj "z") z).

    (assert 100 (obj a).
    (assert 200 (obj b).
    (assert null a).
    (assert null b).

    (=>:() (let x 100).
    (assert 100 x).
  ).
  (should "(var (names ...) value) returns value and declares all variables with the same value." (= ()
    (var x)
    (var value (var (x y z a) 10).
    (assert 10 value).
    (assert 10 x)
    (assert 10 y)
    (assert 10 z)
    (assert 10 a)

    (=>:() (let x 100) (let a 200).
    (assert 100 x).
    (assert 200 a).
  ).
  (should "(var (names ...) values) returns values and declares each value by its corresponding name as variable." (= ()
    (var x)
    (var a 100)
    (var values (@ null 1 (=)).
    (var value_ (var (x y z a) values).
    (assert values value_).
    (assert null x)
    (assert 1 y).
    (assert (values 2) z).
    (assert null a)

    (=>:() (let x 100) (let a 200).
    (assert 100 x).
    (assert 200 a).
  ).
).

(define "(const ...)" (= ()
  (should "(const) returns null." (= ()
    (var value_ (const).
    (assert null value_).
  ).
  (should "(const sym) returns null and declares a const sym with value of null." (= ()
    (var value_ (const x).
    (assert null value_).
    (assert null x).

    (const x 1).
    (assert null x).

    (var x 1).
    (assert null x).

    (let x 1).
    (assert null x).

    (=>:() (const x 1).
    (assert null x).

    (=>:() (var x 1).
    (assert null x).

    (=>:() (let x 1).
    (assert null x).
  ).
  (should "(const sym value) returns value and declares a const sym with value of value." (= ()
    (var value_ (const x 100).
    (assert 100 value_).
    (assert 100 x).

    (const x 1).
    (assert 100 x).

    (var x 1).
    (assert 100 x).

    (let x 1).
    (assert 100 x).

    (=>:() (const x 1).
    (assert 100 x).

    (=>:() (var x 1).
    (assert 100 x).

    (=>:() (let x 1).
    (assert 100 x).
  ).
).

(define "(let ...)" (= ()
  (should "(let) returns null." (= ()
    (var value_ (let).
    (assert null value_).
  ).
  (should "(let sym) returns null and declares a variable sym with value of null." (= ()
    (var x)
    (var value_ (let y).
    (assert null value_).
    (assert null y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(let sym) returns null and updates the value of sym to null." (= ()
    (var x)
    (var y 100)
    (var value_ (let y).
    (assert null value_).
    (assert null y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).

    (=>:() (=>:() (let y 20).
    (assert 20 y).

    (=>:() (=>:() (=>:() (let y 200).
    (assert 200 y).

    (=>:() (=>:() (=>:() (=>:() (let y 2000).
    (assert 2000 y).
  ).
  (should "(let sym value) returns value and declares a variable sym with value." (= ()
    (var x)
    (var value_ (let y 100).
    (assert 100 value_).
    (assert 100 y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).
  ).
  (should "(let sym value) returns value and updates the value of sym to value." (= ()
    (var (x y).
    (var value_ (let y -2).
    (assert -2 value_).
    (assert -2 y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 2 y).
    (assert null z).

    (=>:() (=>:() (let y 20).
    (assert 20 y).

    (=>:() (=>:() (=>:() (let y 200).
    (assert 200 y).

    (=>:() (=>:() (=>:() (=>:() (let y 2000).
    (assert 2000 y).
  ).
  (should "(let *) returns null and has not other side effects." (= ()
    (var value_ (let *).
    (assert null value_).
    (assert null *).

    (=>:() (let * 1).
    (assert null *).
  ).
  (should "(let * obj) returns obj and declares all fields and their values in obj as variables." (= ()
    (var obj (@ x: null y: 1 z: (=).
    (var value_ (let * obj).
    (assert obj value_).
    (assert null *).
    (assert null x).
    (assert 1 y).
    (assert (obj "z") z).

    (=>:() (let x 100).
    (assert 100 x).
  ).
  (should "(let (fields ...) obj) returns obj and declares given fields and their values in obj as variables." (= ()
    (var x)
    (var obj (@ x: null y: 1 z: (=) a: 100 b: 200).
    (var value_ (let (x y z) obj).
    (assert obj value_).
    (assert null x)
    (assert 1 y).
    (assert (obj "z") z).

    (assert 100 (obj a).
    (assert 200 (obj b).
    (assert null a).
    (assert null b).

    (=>:() (let x 100).
    (assert 100 x).
  ).
  (should "(let (names ...) value) returns value and declares all variables with the same value." (= ()
    (var x)
    (var value (let (x y z a) 10).
    (assert 10 value).
    (assert 10 x)
    (assert 10 y)
    (assert 10 z)
    (assert 10 a)

    (=>:() (let x 100) (let a 200).
    (assert 100 x).
    (assert 200 a).
  ).
  (should "(let (names ...) values) returns values and declares each value by its corresponding name as variable." (= ()
    (var x)
    (var a 100)
    (var values (@ null 1 (=)).
    (var value_ (let (x y z a) values).
    (assert values value_).
    (assert null x)
    (assert 1 y).
    (assert (values 2) z).
    (assert null a)

    (=>:() (let x 100) (let a 200).
    (assert 100 x).
    (assert 200 a).
  ).
).

(define "(local ...)" (= ()
  (should "(local) returns null." (= ()
    (var value_ (local).
    (assert null value_).
  ).
  (should "(local sym) returns null and declares a variable sym in current scope with value of null." (= ()
    (var x)
    (var value_ (local y).
    (assert null value_).
    (assert null y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert null y).
    (assert null z).
  ).
  (should "(local sym) returns null and updates the value of sym in current scope to null." (= ()
    (var x)
    (local y 100)
    (assert 100 y).

    (var value_ (local y).
    (assert null value_).
    (assert null y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert null y).
    (assert null z).

    (=>:() (=>:() (let y 20).
    (assert null y).

    (=>:() (=>:() (=>:() (let y 200).
    (assert null y).

    (=>:() (=>:() (=>:() (=>:() (let y 2000).
    (assert null y).
  ).
  (should "(local sym value) returns value and declares a variable sym in current scope with value." (= ()
    (var x)
    (var value_ (local y 100).
    (assert 100 value_).
    (assert 100 y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert 100 y).
    (assert null z).
  ).
  (should "(local sym value) returns value and updates the value of sym in current scope to value." (= ()
    (var x)
    (local y).
    (var value_ (local y -2).
    (assert -2 value_).
    (assert -2 y).

    (=>:() (let x 1) (let y 2) (let z 3).
    (assert 1 x).
    (assert -2 y).
    (assert null z).

    (=>:() (=>:() (let y 20).
    (assert -2 y).

    (=>:() (=>:() (=>:() (let y 200).
    (assert -2 y).

    (=>:() (=>:() (=>:() (=>:() (let y 2000).
    (assert -2 y).
  ).
  (should "(local *) returns null and has not other side effects." (= ()
    (var value_ (local *).
    (assert null value_).
    (assert null *).

    (=>:() (let * 1).
    (assert null *).
  ).
  (should "(local * obj) returns obj and declares all fields and their values in obj as variables in current scope." (= ()
    (local obj (@ x: null y: 1 z: (=).
    (var value_ (local * obj).
    (assert obj value_).
    (assert null *).
    (assert null x).
    (assert 1 y).
    (assert (obj "z") z).

    (=>:() (let x 100).
    (assert null x).
  ).
  (should "(local (fields ...) obj) returns obj and declares given fields and their values in obj as variables in current scope." (= ()
    (local x)
    (var obj (@ x: null y: 1 z: (=) a: 100 b: 200).
    (var value_ (local (x y z) obj).
    (assert obj value_).
    (assert null x)
    (assert 1 y).
    (assert (obj "z") z).

    (assert 100 (obj a).
    (assert 200 (obj b).
    (assert null a).
    (assert null b).

    (=>:() (let x 100).
    (assert null x).
  ).
  (should "(local (names ...) value) returns value and declares all variables with the same value." (= ()
    (var x)
    (var value (local (x y z a) 10).
    (assert 10 value).
    (assert 10 x)
    (assert 10 y)
    (assert 10 z)
    (assert 10 a)

    (=>:() (let x 100) (let a 200).
    (assert 10 x).
    (assert 10 a).
  ).
  (should "(local (names ...) values) returns values and declares each value by its corresponding name as variable in current scope." (= ()
    (local x)
    (local a 100)
    (var values (@ null 1 (=)).
    (var value_ (local (x y z a) values).
    (assert values value_).
    (assert null x)
    (assert 1 y).
    (assert (values 2) z).
    (assert null a)

    (=>:() (let x 100) (let a 200).
    (assert null x).
    (assert null a).
  ).
  (should "(export ...), (var ...) and (let ...) cannot overwrite a local variable." (= ()
    (local x 100)
    (export x 1)
    (assert 100 x)

    (var x 1)
    (assert 100 x)

    (let x 1)
    (assert 100 x)

    (assert 1 (=>:() x).
    (assert 16 (=>:() (let x 16) x).
    (assert 100 x)

    (assert 16 (=>:() x).
  ).
  (should "(local ...) can be used to overwrite this, arguments and do in functions and lambdas." (= ()
    (var ret-this (=() (local this 100) this).
    (assert 100 (ret-this).

    (let ret-this (=>() (local this 100) this).
    (assert 100 (ret-this).

    (var ret-args (=() (local arguments 100) arguments).
    (assert 100 (ret-args).

    (let ret-args (=>() (local arguments 100) arguments).
    (assert 100 (ret-args).

    (var ret-do (=() (local do 100) do).
    (assert 100 (ret-do).

    (let ret-do (=>() (local do 100) do).
    (assert 100 (ret-do).
  ).
  (should "(local ...) can be used to overwrite operation, operand and that in operators." (= ()
    (var ret-that (=?() (local "that" 100) that).
    (assert 100 (ret-that).

    (var ret-operation (=?() (local "operation" 100) operation).
    (assert 100 (ret-operation).

    (var ret-operand (=?() (local "operand" 100) operand).
    (assert 100 (ret-operand).
  ).
  (should "a variable declared by (local ...) is not accessible for in high-order functions declared in the scope." (= ()
    (local x 100)
    (let ret-x (=>() x).
    (assert null (ret-x).

    (let ret-x (=>() (local x 1) x).
    (assert 1 (ret-x).
    (assert 100 x)
  ).
  (should "a variable declared by (local ...) in an operator is only valid in the the scope of operator." (= ()
    (var x 100)
    (let ret-x (=?() (local "x" 1) x).
    (assert 1 (ret-x).
    (assert 100 x).
  ).
).

(define "(locon ...)" (= ()
  (should "(locon) returns null." (= ()
    (var value_ (locon).
    (assert null value_).
  ).
  (should "(locon sym) returns null and declares a const sym in current scope with value of null." (= ()
    (var value_ (locon x).
    (assert null value_).
    (assert null x).

    (locon x 1)
    (assert null x).

    (local x 10)
    (assert null x).
  ).
  (should "(locon sym value) returns value and declares a const sym in current scope with value of value." (= ()
    (var value_ (locon x 100).
    (assert 100 value_).
    (assert 100 x).

    (locon x 1)
    (assert 100 x).

    (local x 1)
    (assert 100 x).
  ).
).
