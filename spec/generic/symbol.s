(var * (load "share/type" (@ the-type: symbol),

(define "Symbol Common Behaviours" (=> ()
  (define "Identity" (= ()
    (should "a symbol is indentified by its string value." (= ()
      (assert ((symbol of "x") is (` x),
      (assert ((` x) is (symbol of "x"),

      (assert ((symbol of "x1") is (` x1),
      (assert ((` x1) is (symbol of "x1"),

      (assert ((symbol of "x-") is (` x-),
      (assert ((` x-) is (symbol of "x-"),

      (assert ((symbol of "-x") is (` -x),
      (assert ((` -x) is (symbol of "-x"),
    ),
  ),

  (define "Equivalence" (= ()
    (should "a symbol's equivalence is defined as the same of its identity." (= ()
      (var s (symbol of "xyz"),
      (assert ($(s "is") is (s "equals"),
      (assert ($(s "is-not") is (s "not-equals"),
    ),
  ),

  (define "Ordering" (= ()
    (should "an empty symbol is less than any non-empty symbol." (= ()
      (assert -1 ((symbol empty) compare (` a),
      (assert -1 ((symbol empty) compare (` A),
      (assert -1 ((symbol empty) compare (` z),
      (assert -1 ((symbol empty) compare (` z),
      (assert -1 ((symbol empty) compare (` -),
      (assert -1 ((symbol empty) compare (` _),
    ),
    (should "non-empty symbols are compared by their string values." (= ()
      (var key-pairs (@
        (@ "a" "a") (@ "A" "A") (@ "a" "A")
        (@ "a" "b")
        (@ "a" "aa")
        (@ "aa" "ab")
        (@ "aaa" "aab")
        (@ "aa" "bb")
        (@ "aaa" "bbb")
      ),
      (for pair in key-pairs
        (assert
          ((pair 0) compare (pair 1),
          ((symbol of (pair 0)) compare (symbol of (pair 1),
        ),
        (assert
          ((pair 1) compare (pair 0),
          ((symbol of (pair 1)) compare (symbol of (pair 0),
        ),
      ),
    ),
  ),

  (define "Emptiness" (= ()
    (should "a symbol is defined as empty when its string value is (string empty)." (= ()
      (assert (string empty) ((symbol empty) to-string),

      (assert ((symbol of (string empty)) is-empty),
      (assert false ((symbol of (string empty)) not-empty),
    )
    (should "（symbol invalid) is defined as empty." (= ()
      (assert ((symbol invalid) is-empty),
      (assert false ((symbol invalid) not-empty),
    )
  ),

  (define "Encoding" (=> ()
    (should "a symbol is encoded to itself." (=> ()
      (for value
          in (the-values concat (symbol empty),
        (assert value (value to-code),
      ),
    ),
  ),

  (define "Representation" (= ()
    (should "a symbol is represented as its string value." (= ()
      (var keys (@ "" "x" "x1" "-x" "x-" "x-y" "x-1" "_x" "x_" "x_y" "x_1"),
      (for key in keys
        (assert key ((symbol of key) to-string),
      ),
    ),
    (should "（symbol invalid) is represented as \"\\t\"." (= ()
      (assert "\t" ((symbol invalid) to-string),
    )
  ),
),

(define "Constant and Special Values" (= ()
  (define "(symbol empty)" (= ()
    (should "its key value is (string empty)." (= ()
      (assert (string empty) ((symbol empty) key),
    ),
    (should "it is evaluated to null." (= ()
      (assert null ((symbol empty)),
    ),
    (should "it is taken as a valid symbol." (= ()
      (assert ((symbol empty) is-valid),
      (assert false ((symbol empty) is-invalid),
    ),
    (should "it may be generated with a key value of (string empty)." (= ()
      (assert (symbol empty) (symbol of (string empty),
    ),
    (should "it may be generated with a key value of pure whitespace characters." (= ()
      (assert (symbol empty) (symbol of " "),
      (assert (symbol empty) (symbol of "  "),
      (assert (symbol empty) (symbol of "\t"),
      (assert (symbol empty) (symbol of "\t "),
      (assert (symbol empty) (symbol of " \t"),
      (assert (symbol empty) (symbol of " \t "),
      (assert (symbol empty) (symbol of "\r"),
      (assert (symbol empty) (symbol of "\n"),
    ),
  ),
  (define "(symbol invalid)" (= ()
    (should "its key value is \"\\t\"." (= ()
      (assert "\t" ((symbol invalid) key),
      (assert "\t" ((symbol invalid) to-string),
    ),
    (should "it is evaluated to null." (= ()
      (assert null ((symbol invalid)),
    ),
    (should "it is taken as an invalid symbol." (= ()
      (assert false ((symbol invalid) is-valid),
      (assert ((symbol invalid) is-invalid),
    ),
    (should "it may be generated with a key value of any combination of whitespace & non-whitespace characters." (= ()
      (assert (symbol invalid) (symbol of " a"),
      (assert (symbol invalid) (symbol of "a "),
      (assert (symbol invalid) (symbol of "a a"),
      (assert (symbol invalid) (symbol of "\ta"),
      (assert (symbol invalid) (symbol of "a\t"),
      (assert (symbol invalid) (symbol of "a\ta"),
      (assert (symbol invalid) (symbol of "a\r"),
      (assert (symbol invalid) (symbol of "a\n"),
    ),
  ),
  (define "(symbol etc)" (= ()
    (should "its key value is \"...\"." (= ()
      (assert "..." ((symbol etc) key),
      (assert "..." ((symbol etc) to-string),
      (assert ((symbol of "...") is (symbol etc),
    ),
    (should "it is evaluated to null." (= ()
      (assert null ((symbol etc)),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol etc) is-valid),
      (assert false ((symbol etc) is-invalid),
    ),
  ),
  (define "(symbol all)" (= ()
    (should "its key value is \"*\"." (= ()
      (assert "*" ((symbol all) key),
      (assert "*" ((symbol all) to-string),
      (assert ((symbol of "*") is (symbol all),
    ),
    (should "it is evaluated to null." (= ()
      (assert null ((symbol all)),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol all) is-valid),
      (assert false ((symbol all) is-invalid),
    ),
  ),
  (define "(symbol any)" (= ()
    (should "(symbol any) is (symbol all); They are identical." (= ()
      (assert ((symbol any) is (symbol all),
      (assert ((symbol all) is (symbol any),
    ),
  ),
  (define "(symbol quote)" (= ()
    (should "its key value is \"`\"." (= ()
      (assert "`" ((symbol quote) key),
      (assert "`" ((symbol quote) to-string),
      (assert ((symbol of "`") is (symbol quote),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol quote)) is (symbol quote),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol quote) is-valid),
      (assert false ((symbol quote) is-invalid),
    ),
  ),
  (define "(symbol lambda)" (= ()
    (should "its key value is \"=\"." (= ()
      (assert "=" ((symbol lambda) key),
      (assert "=" ((symbol lambda) to-string),
      (assert ((symbol of "=") is (symbol lambda),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol lambda)) is (symbol lambda),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol lambda) is-valid),
      (assert false ((symbol lambda) is-invalid),
    ),
  ),
  (define "(symbol function)" (= ()
    (should "its key value is \"=>\"." (= ()
      (assert "=>" ((symbol function) key),
      (assert "=>" ((symbol function) to-string),
      (assert ((symbol of "=>") is (symbol function),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol function)) is (symbol function),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol function) is-valid),
      (assert false ((symbol function) is-invalid),
    ),
  ),
  (define "(symbol operator)" (= ()
    (should "its key value is \"=?\"." (= ()
      (assert "=?" ((symbol operator) key),
      (assert "=?" ((symbol operator) to-string),
      (assert ((symbol of "=?") is (symbol operator),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol operator)) is (symbol operator),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol operator) is-valid),
      (assert false ((symbol operator) is-invalid),
    ),
  ),
  (define "(symbol let)" (= ()
    (should "its key value is \"let\"." (= ()
      (assert "let" ((symbol let) key),
      (assert "let" ((symbol let) to-string),
      (assert ((symbol of "let") is (symbol let),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol let)) is (symbol let),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol let) is-valid),
      (assert false ((symbol let) is-invalid),
    ),
  ),
  (define "(symbol var)" (= ()
    (should "its key value is \"var\"." (= ()
      (assert "var" ((symbol var) key),
      (assert "var" ((symbol var) to-string),
      (assert ((symbol of "var") is (symbol var),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol var)) is (symbol var),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol var) is-valid),
      (assert false ((symbol var) is-invalid),
    ),
  ),
  (define "(symbol local)" (= ()
    (should "its key value is \"local\"." (= ()
      (assert "local" ((symbol local) key),
      (assert "local" ((symbol local) to-string),
      (assert ((symbol of "local") is (symbol local),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol local)) is (symbol local),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol local) is-valid),
      (assert false ((symbol local) is-invalid),
    ),
  ),
  (define "(symbol begin)" (= ()
    (should "its key value is \"(\"." (= ()
      (assert "(" ((symbol begin) key),
      (assert "(" ((symbol begin) to-string),
      (assert ((symbol of "(") is (symbol begin),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol begin)) is (symbol begin),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol begin) is-valid),
      (assert false ((symbol begin) is-invalid),
    ),
  ),
  (define "(symbol end)" (= ()
    (should "its key value is \")\"." (= ()
      (assert ")" ((symbol end) key),
      (assert ")" ((symbol end) to-string),
      (assert ((symbol of ")") is (symbol end),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol end)) is (symbol end),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol end) is-valid),
      (assert false ((symbol end) is-invalid),
    ),
  ),
  (define "(symbol comma)" (= ()
    (should "its key value is \",\"." (= ()
      (assert "," ((symbol comma) key),
      (assert "," ((symbol comma) to-string),
      (assert ((symbol of ",") is (symbol comma),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol comma)) is (symbol comma),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol comma) is-valid),
      (assert false ((symbol comma) is-invalid),
    ),
  ),
  (define "(symbol semicolon)" (= ()
    (should "its key value is \";\"." (= ()
      (assert ";" ((symbol semicolon) key),
      (assert ";" ((symbol semicolon) to-string),
      (assert ((symbol of ";") is (symbol semicolon),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol semicolon)) is (symbol semicolon),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol semicolon) is-valid),
      (assert false ((symbol semicolon) is-invalid),
    ),
  ),
  (define "(symbol period)" (= ()
    (should "its key value is \".\"." (= ()
      (assert "." ((symbol period) key),
      (assert "." ((symbol period) to-string),
      (assert ((symbol of ".") is (symbol period),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol period)) is (symbol period),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol period) is-valid),
      (assert false ((symbol period) is-invalid),
    ),
  ),
  (define "(symbol literal)" (= ()
    (should "its key value is \"@\"." (= ()
      (assert "@" ((symbol literal) key),
      (assert "@" ((symbol literal) to-string),
      (assert ((symbol of "@") is (symbol literal),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol literal)) is (symbol literal),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol literal) is-valid),
      (assert false ((symbol literal) is-invalid),
    ),
  ),
  (define "(symbol pairing)" (= ()
    (should "its key value is \":\"." (= ()
      (assert ":" ((symbol pairing) key),
      (assert ":" ((symbol pairing) to-string),
      (assert ((symbol of ":") is (symbol pairing),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol pairing)) is (symbol pairing),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol pairing) is-valid),
      (assert false ((symbol pairing) is-invalid),
    ),
  ),
  (define "(symbol subject)" (= ()
    (should "its key value is \"$\"." (= ()
      (assert "$" ((symbol subject) key),
      (assert "$" ((symbol subject) to-string),
      (assert ((symbol of "$") is (symbol subject),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol subject)) is (symbol subject),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol subject) is-valid),
      (assert false ((symbol subject) is-invalid),
    ),
  ),
  (define "(symbol comment)" (= ()
    (should "its key value is \"#\"." (= ()
      (assert "#" ((symbol comment) key),
      (assert "#" ((symbol comment) to-string),
      (assert ((symbol of "#") is (symbol comment),
    ),
    (should "it is evaluated to itself." (= ()
      (assert (((symbol comment)) is (symbol comment),
    ),
    (should "it is taken as an valid symbol." (= ()
      (assert ((symbol comment) is-valid),
      (assert false ((symbol comment) is-invalid),
    ),
  ),
),

(define "(symbol of ...)" (= ()
  (should "(symbol of) and (symbol of null) return (symbol empty)." (= ()
    (assert (symbol empty) (symbol of),
    (assert (symbol empty) (symbol of null),
    (assert (symbol empty) (symbol of null null),
    (assert (symbol empty) (symbol of null null null),
  ),
  (should "(symbol of key-str) returns a symbol with a key value of key-str)." (= ()
    (var keys (@
      "a" "-" "." "aa" ".." "--" "a." ".a" "-." ".-" "a-" "-a"
    ),
    (for key in keys
      (var sym (symbol of key),
      (assert (sym is-a symbol),
      (assert key (sym key),
      (assert key (sym to-string),
    ),
    (assert (symbol empty) (symbol of null null),
    (assert (symbol empty) (symbol of null null null),
  ),
  (should "(symbol of sym) returns sym." (= ()
    (var sym (` x),
    (assert sym (symbol of sym),
  ),
),

(define "(symbol of-shared ...)" (= ()
  (should "(symbol of-shared key-str) declares and returns a shared symbol with the key value of key-str." (= ()
    (assert (`a) (symbol of-shared "a"),
    (assert (`.) (symbol of-shared "."),
    (assert (`-) (symbol of-shared "-"),
  ),
  (should "(symbol of-shared) returns (symbol invalid)." (= ()
    (assert (symbol invalid) (symbol of-shared),
  ),
  (should "(symbol of-shared other-value) returns (symbol invalid)." (= ()
    (var invalid-keys (@
      null type
      bool true false
      string "" " " " a" "a "
      number -1 0 1
      date (date empty) (date now)
      range (range empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (operator empty)
      lambda (lambda empty)
      function (function empty)
      array (array empty)
      object (object empty)
      class (class empty) ((class empty) empty)
    ),
    (for key in invalid-keys
      (assert (symbol invalid) (symbol of-shared key),
    ),
  ),
),

(define "(symbol to-string symbol)" (= ()
  (should "(symbol to-string symbol) returns a string of an symbol expression." (= ()
    (assert "(`)" ((symbol empty) to-string symbol),
    (assert "(`a)" ((symbol of "a") to-string symbol),
    (assert "(`.)" ((symbol of ".") to-string symbol),
    (assert "(`-)" ((symbol of "-") to-string symbol),
    (assert "(symbol invalid)" ((symbol invalid) to-string symbol),
  ),
),
