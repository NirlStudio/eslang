($define "operator: >" (= ()
  ($should "return false for comparison of values in different types" (= ()
    (assert false (` (0 > ""),
    (assert false (` ("" > 0),
    (assert false (` ((date 1000) > (` sym),
  ),

  ($should "return true if the first number argument is great than the second one" (= ()
    (assert false (` (1 >),
    (assert (` (1 > 0),
    (assert false (` (1 > 2),
  ),

  ($should "return true if the first string argument is great than the second one" (= ()
    (assert false (` ("" > ),
    (assert (` ("a" > "A"),
    (assert false (` ("A" > "a"),
  ),

  ($should "return true if the first date argument is later than the second one" (= ()
    (assert false (` ((date 100) >),
    (assert (` ((date 200) > (date 100),
    (assert false (` ((date 100) > (date 200),
  ),
).

($define "operator: >=" (= ()
  ($should "return false for comparison of values in different types" (= ()
    (assert false (` (0 >= ""),
    (assert false (` ("" >= 0),
    (assert false (` ((date 1000) >= (` sym),
  ),

  ($should "return true if the first number argument is great than or equals the \
            second one" (= ()
    (assert false (` (1 >= ),
    (assert (` (1 >= 0),
    (assert (` (1 >= 1),
    (assert false (` (1 >= 2),
  ),

  ($should "return true if the first string argument is great than or equal the \
            second one" (= ()
    (assert false (` ("" >= ),
    (assert (` ("a" >= "A"),
    (assert (` ("a" >= "a"),
    (assert false (` ("A" >= "a"),
  ),

  ($should "return true if the first date argument is later than or equals the \
            second one" (= ()
    (assert false (` ((date 100) >= ),
    (assert (` ((date 200) >= (date 100),
    (assert (` ((date 200) >= (date 200),
    (assert false (` ((date 100) >= (date 200),
  ),
).

($define "operator: <" (= ()
  ($should "return false for comparison of values in different types" (= ()
    (assert false (` (0 < ""),
    (assert false (` ("" < 0),
    (assert false (` ((date 1000) < (` sym),
    (assert null (` ((@) < (object),
    (assert null (` ((object) < (@),
  ),

  ($should "return true if the first number argument is less than the second one" (= ()
    (assert false (` (1 < ),
    (assert (` (0 < 1),
    (assert false (` (2 < 1),
  ),

  ($should "return true if the first string argument is less than the second one" (= ()
    (assert false (` ("" < ),
    (assert false (` ("a" < "A"),
    (assert (` ("A" < "a"),
  ),

  ($should "return true if the first date argument is earlier than the second one" (= ()
    (assert false (` ((date 100) < ),
    (assert (` ((date 100) < (date 200),
    (assert false (` ((date 200) < (date 100),
  ),
).

($define "operator: <=" (= ()
  ($should "return false for comparison of values in different types" (= ()
    (assert false (` (0 <= ""),
    (assert false (` ("" <= 0),
    (assert false (` ((date 1000) <= (` sym),
    (assert null (` ((@) <= (object),
    (assert null (` ((object) <= (@),
  ),

  ($should "return true if the first number argument is less than or equals the \
            second one" (= ()
    (assert false (` (1 <= ),
    (assert (` (0 <= 1),
    (assert (` (1 <= 1),
    (assert false (` (2 <= 1),
  ),

  ($should "return true if the first string argument is less than or equals the \
            second one" (= ()
    (assert false (` ("" <= ),
    (assert false (` ("a" <= "A"),
    (assert (` ("a" <= "a"),
    (assert (` ("A" <= "a"),
  ),

  ($should "return true if the first date argument is earlier than or equals the \
            second one" (= ()
    (assert false (` ((date 100) <= ),
    (assert (` ((date 100) <= (date 200),
    (assert (` ((date 200) <= (date 200),
    (assert false (` ((date 200) <= (date 100),
  ),
).
