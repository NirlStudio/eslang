($define "Logical AND: &&" (= ()
  ($should "return the first FALSE value (0, false or null) or the last value in arguments." (= ()
    (assert null (` (&&),
    (assert 0 (` (&& true 0),
    (assert 1 (` (&& true (@) 1),
    (assert false (` (&& true (@) false 1),
).

($define "Logical OR: ||" (= ()
  ($should "return the first TRUE value (not a 0, false or null) or the last value in arguments." (= ()
    (assert null (` (||),
    (assert true (` (|| 0 true 1),
    (assert "object" (` (typeof (|| false 0 (object),
    (assert false (` (|| null 0 false),
).

($define "Logical NOT: !" (= ()
  ($should "return true for 0, false and null, false for any other values." (= ()
    (assert true (` (!),
    (assert true (` (! 0),
    (assert true (` (! false),
    (assert true (` (! null),
    (assert false (` (! 1),
    (assert false (` (! true),
    (assert false (` (! (@)),
    (assert false (` (! "false"),
).
