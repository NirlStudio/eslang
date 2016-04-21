($define "operator: >" (= ()
  ($should "return false for comparison of values in different types" (= ()
    (assert equal false (> 0 ""),
    (assert equal false (> "" 0),
    (assert equal false (> (` sym) (date 1000),
    (assert equal false (> (date 1000) (` sym),
    (assert equal false (> (@) (object),
    (assert equal false (> (object) (@),
  ),

  ($should "return true if the first number argument is great than the second one" (= ()
    (assert equal false (>),
    (assert equal false (> 1 ),
    (assert equal true (> 1 0),
    (assert equal false (> 1 2),
  ),

  ($should "return true if the first string argument is great than the second one" (= ()
    (assert equal false (> "" ),
    (assert equal true (> "a" "A"),
    (assert equal false (> "A" "a"),
  ),

  ($should "return true if the first date argument is later than the second one" (= ()
    (assert equal false (> (date 100) ),
    (assert equal true (> (date 200) (date 100),
    (assert equal false (> (date 100) (date 200),
  ),
).

($define "operator: >=" (= ()
  ($should "return false for comparison of values in different types" (= ()
    (assert equal false (>= 0 ""),
    (assert equal false (>= "" 0),
    (assert equal false (>= (` sym) (date 1000),
    (assert equal false (>= (date 1000) (` sym),
    (assert equal false (>= (@) (object),
    (assert equal false (>= (object) (@),
  ),

  ($should "return true if the first number argument is great than or equals the \
            second one" (= ()
    (assert equal false (>=),
    (assert equal false (>= 1 ),
    (assert equal true (>= 1 0),
    (assert equal true (>= 1 1),
    (assert equal false (>= 1 2),
  ),

  ($should "return true if the first string argument is great than or equal the \
            second one" (= ()
    (assert equal false (>= "" ),
    (assert equal true (>= "a" "A"),
    (assert equal true (>= "a" "a"),
    (assert equal false (>= "A" "a"),
  ),

  ($should "return true if the first date argument is later than or equals the \
            second one" (= ()
    (assert equal false (>= (date 100) ),
    (assert equal true (>= (date 200) (date 100),
    (assert equal true (>= (date 200) (date 200),
    (assert equal false (>= (date 100) (date 200),
  ),
).

($define "operator: <" (= ()
  ($should "return false for comparison of values in different types" (= ()
    (assert equal false (< 0 ""),
    (assert equal false (< "" 0),
    (assert equal false (< (` sym) (date 1000),
    (assert equal false (< (date 1000) (` sym),
    (assert equal false (< (@) (object),
    (assert equal false (< (object) (@),
  ),

  ($should "return true if the first number argument is less than the second one" (= ()
    (assert equal false (<),
    (assert equal false (< 1 ),
    (assert equal true (< 0 1),
    (assert equal false (< 2 1),
  ),

  ($should "return true if the first string argument is less than the second one" (= ()
    (assert equal false (< "" ),
    (assert equal false (< "a" "A"),
    (assert equal true (< "A" "a"),
  ),

  ($should "return true if the first date argument is earlier than the second one" (= ()
    (assert equal false (< (date 100) ),
    (assert equal true (< (date 100) (date 200),
    (assert equal false (< (date 200) (date 100),
  ),
).

($define "operator: <=" (= ()
  ($should "return false for comparison of values in different types" (= ()
    (assert equal false (<= 0 "") "here"),
    (assert equal false (<= "" 0),
    (assert equal false (<= (` sym) (date 1000),
    (assert equal false (<= (date 1000) (` sym),
    (assert equal false (<= (@) (object),
    (assert equal false (<= (object) (@),
  ),

  ($should "return true if the first number argument is less than or equals the \
            second one" (= ()
    (assert equal false (<=),
    (assert equal false (<= 1 ),
    (assert equal true (<= 0 1),
    (assert equal true (<= 1 1),
    (assert equal false (<= 2 1),
  ),

  ($should "return true if the first string argument is less than or equals the \
            second one" (= ()
    (assert equal false (<= "" ),
    (assert equal false (<= "a" "A"),
    (assert equal true (<= "a" "a"),
    (assert equal true (<= "A" "a"),
  ),

  ($should "return true if the first date argument is earlier than or equals the \
            second one" (= ()
    (assert equal false (<= (date 100) ),
    (assert equal true (<= (date 100) (date 200),
    (assert equal true (<= (date 200) (date 200),
    (assert equal false (<= (date 200) (date 100),
  ),
).
