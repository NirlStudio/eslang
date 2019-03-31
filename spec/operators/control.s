(define "(? ...) - bool switch)" (= ()
  (should "(?) returns null." (=> ()
    (assert null (?).
  ).
  (should "(? cond) returns null." (=> ()
    (assert null (? null).
    (assert null (? 0).
    (assert null (? 1).
    (assert null (? true).
    (assert null (? false).
  ).
  (should "(? cond x) returns x if condition is evaluated to true." (=> ()
    (assert 10 (? true 10).
    (assert 10 (? (1 === 1) 10).
    (assert 10 (? 1 10).
    (assert 10 (? (1 + 1) 10).
    (assert 10 (? "" 10).
    (assert 10 (? ("x" + "y") 10).
  ).
  (should "(? cond x) returns null if condition is evaluated to false." (=> ()
    (assert null (? null 10).
    (assert null (? false 10).
    (assert null (? (1 == 0) 10).
    (assert null (? 0 10).
    (assert null (? (1 - 1) 10).
  ).
  (should "(? cond x y) returns y if condition is evaluated to false." (=> ()
    (assert 100 (? null 10 100).
    (assert 100 (? false 10 100).
    (assert 100 (? (1 == 0) 10 100).
    (assert 100 (? 0 10 100).
    (assert 100 (? (1 - 1) 10 100).
  ).
).

(define "(if ...)" (= ()
  (should "(if) returns null." (=> ()
    (assert null (if).
  ).
  (should "(if cond) returns null." (=> ()
    (assert null (if null).
    (assert null (if 0).
    (assert null (if 1).
    (assert null (if true).
    (assert null (if false).
  ).
  (should "(if cond x) returns x if condition is evaluated to true." (=> ()
    (assert 10 (if true 10).
    (assert 10 (if (1 === 1) 100 10).

    (assert 10 (if 1 10).
    (assert 10 (if (1 + 1) 100 10).

    (assert 10 (if "" 10).
    (assert 10 (if ("x" + "y") 100 10).
  ).
  (should "(if cond x) returns null if condition is evaluated to false." (=> ()
    (assert null (if null 10).
    (assert null (if null 100 10).

    (assert null (if false 10).
    (assert null (if (1 == 0) 100 10).

    (assert null (if 0 10).
    (assert null (if (1 - 1) 100 10).
  ).
  (should "(if cond x else y) returns y if condition is evaluated to false." (=> ()
    (assert 10 (if null else 10).
    (assert 10 (if null else 100 10).

    (assert 10 (if false 100 else 10).
    (assert 10 (if (1 == 0) 101 11 else 100 10).

    (assert 20 (if 0 (1 + 1) else (10 + 10).
    (assert 20 (if (1 - 1) (1 + 1) else (100 + 100) (10 + 10).
  ).
).

(define "(while ...)" (= ()
  (should "(while) returns null." (=> ()
    (assert null (while).
  ).
  (should "(while cond) returns if condition is evaluated to false." (=> ()
    (assert null (while null).
    (assert null (while xxx).

    (assert null (while 0).
    (assert null (while (1 - 1).

    (assert null (while false).
    (assert null (while (1 == 0).
  ).
  (should "(while cond statements ...) repeatedly evaluates statements until condition is evaluated to false." (=> ()
    (var i 0)
    (assert 10 (while (i < 10) (++ i).

    (let i 0)
    (var count 0)
    (assert 10 (while (i < 10) (count ++) (i += 2).
    (assert 5 count)
  ).
  (should "(continue ) skips all statements after." (=> ()
    (var i 0)
    (assert null (while (i < 10) (++ i) (continue) (i ++).
    (assert 10 i)
  ).
  (should "(continue value) applies value as the result of while loop." (=> ()
    (var i 0)
    (assert 100 (while (i < 10) (++ i) (continue 100) (i ++).
    (assert 10 i)
  ).
  (should "(continue values ...) applies the array of values as the result of while loop." (=> ()
    (var i 0)
    (var result (while (i < 10) (++ i) (continue 10 100) (i ++).
    (assert 10 i)

    (assert (result is-an array).
    (assert 10 (result 0).
    (assert 100 (result 1).
  ).
  (should "(break value) applies value as the result of while loop." (=> ()
    (var i 0)
    (assert 10 (while (i < 10) (++ i) (? (i > 5) (break 10).
    (assert 6 i)
  ).
  (should "(break values ...) applies the array of values as the result of while loop." (=> ()
    (var i 0)
    (var result (while (i < 10) (++ i) (? (i > 5) (break 10 100).
    (assert 6 i)
    (assert (result is-an array).
    (assert 10 (result 0).
    (assert 100 (result 1).
  ).
).

(define "(for ... in ...)" (= ()
  (should "(for) returns null." (=> ()
    (assert null (for).
  ).
  (should "(for value) returns null." (=> ()
    (assert null (for x).
    (assert null (for (x y).
    (assert null (for (x y z).
  ).
  (should "(for value in) returns null." (=> ()
    (assert null (for x in).
    (assert null (for (x y) in).
    (assert null (for (x y z) in).
  ).
  (should "(for value in a-range) returns null." (=> ()
    (assert null (for x in (1 10).
    (assert null (for (x y) in (1 10).
    (assert null (for (x y z) in (1 10).
  ).
  (should "(for value in an-array statements ...) traverses all values in the array and returns final result." (=> ()
    (var a 0)
    (assert 25 (for x in (@ 1 3 5 7 9) (a += x).
    (assert 25 a)
  ).
  (should "(for (value offset) in an-array statements ...) traverses all values and their offsets in the array and returns final result." (=> ()
    (var a 0)
    (assert 40 (for (x i) in (@ 1 3 5 7 9) (a += x i 1).
    (assert 40 a)
  ).
  (should "(for field in an-object statements ...) traverses all field names of the object and returns final result." (=> ()
    (var a "")
    (assert "xyz" (for name in (@ x: 1 y: 2 z: 3) (a += name).
    (assert "xyz" a)
  ).
  (should "(for (field value) in an-object statements ...) traverses all fields and their values in the object and returns final result." (=> ()
    (var a "")
    (assert "x:1 y:2 z:3 " (for (name value) in (@ x: 1 y: 2 z: 3) (a += name ":" value " ").
    (assert "x:1 y:2 z:3 " a)
  ).
  (should "(for value in iterable statements ...) traverses all values returned by the iterable entity and returns the final result." (=> ()
    (var iter (=:()
      (var pairs (@ (@ "x" 1) (@ "y" 2) (@ "z" 3).
      (var offset 0)
      (=>() (? (offset < 3) (pairs (offset ++).
    ).
    (var a "")
    (assert "xyz" (for name in iter (a += name).
    (assert "xyz" a)
  ).
  (should "(for (values ...) in iterable statements ...) traverses all values and tries to populate them and returns the final result." (=> ()
    (var iter (=:()
      (var pairs (@ (@) (@ "x") (@ "y" 2) (@ "z" 3 4).
      (var offset 0)
      (=>() (? (offset < 4) (pairs (offset ++).
    ).
    (var a (@).
    (assert 12 (for (x y z) in iter (a push x y z) (a length).
    (assert null (a 0).
    (assert null (a 1).
    (assert null (a 2).

    (assert "x" (a 3).
    (assert null (a 4).
    (assert null (a 5).

    (assert "y" (a 6).
    (assert 2 (a 7).
    (assert null (a 8).

    (assert "z" (a 9).
    (assert 3 (a 10).
    (assert 4 (a 11).
  ).
  (should "(break value) applies value as the result of for loop." (=> ()
    (var i 0)
    (assert 10 (for i in (1 10) (++ i) (? (i > 5) (break 10).
    (assert 6 i)
  ).
  (should "(break values ...) applies the array of values as the result of for loop." (=> ()
    (var i 0)
    (var result (for i in (1 10) (++ i) (? (i > 5) (break 10 100).
    (assert 6 i)
    (assert (result is-an array).
    (assert 10 (result 0).
    (assert 100 (result 1).
  ).
).
