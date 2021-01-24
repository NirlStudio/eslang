(var * (load "./share/type" (@ the-type: symbol).

(define "Symbol Common Behaviors" (=> ()
  (define "Identity" (= ()
    (should "a symbol is identified by its string value." (= ()
      (assert ((symbol of "x") is (` x).
      (assert ((` x) is (symbol of "x").

      (assert ((symbol of "x1") is (` x1).
      (assert ((` x1) is (symbol of "x1").

      (assert ((symbol of "x-") is (` x-).
      (assert ((` x-) is (symbol of "x-").

      (assert ((symbol of "-x") is (` -x).
      (assert ((` -x) is (symbol of "-x").
    ).
  ).

  (define "Equivalence" (= ()
    (should "a symbol's equivalence is defined as the same of its identity." (= ()
      (var s (symbol of "xyz").
      (assert ($(s "is") is (s "equals").
      (assert ($(s "is-not") is (s "not-equals").
    ).
  ).

  (define "Ordering" (= ()
    (should "an empty symbol is less than any non-empty symbol." (= ()
      (assert -1 ((symbol empty) compares-to (` a).
      (assert -1 ((symbol empty) compares-to (` A).
      (assert -1 ((symbol empty) compares-to (` z).
      (assert -1 ((symbol empty) compares-to (` z).
      (assert -1 ((symbol empty) compares-to (` -).
      (assert -1 ((symbol empty) compares-to (` _).
    ).
    (should "non-empty symbols are compared by their string values." (= ()
      (var key-pairs (@
        (@ "a" "a") (@ "A" "A") (@ "a" "A")
        (@ "a" "b")
        (@ "a" "aa")
        (@ "aa" "ab")
        (@ "aaa" "aab")
        (@ "aa" "bb")
        (@ "aaa" "bbb")
      ).
      (for pair in key-pairs
        (assert
          ((pair 0) compares-to (pair 1).
          ((symbol of (pair 0)) compares-to (symbol of (pair 1).
        ).
        (assert
          ((pair 1) compares-to (pair 0).
          ((symbol of (pair 1)) compares-to (symbol of (pair 0).
        ).
      ).
    ).
  ).

  (define "Emptiness" (= ()
    (should "a symbol is defined as empty when its string value is (string empty)." (= ()
      (assert (string empty) ((symbol empty) to-string).

      (assert ((symbol of (string empty)) is-empty).
      (assert false ((symbol of (string empty)) not-empty).
    )
    (should "（symbol unsafe) is defined as empty." (= ()
      (assert ((symbol unsafe) is-empty).
      (assert false ((symbol unsafe) not-empty).
    )
  ).

  (define "Encoding" (=> ()
    (should "a symbol is encoded to itself." (=> ()
      (for value
          in (the-values concat (symbol empty).
        (assert value (value to-code).
      ).
    ).
  ).

  (define "Representation" (= ()
    (should "a symbol is represented as its string value." (= ()
      (var keys (@ "" "x" "x1" "-x" "x-" "x-y" "x-1" "_x" "x_" "x_y" "x_1").
      (for key in keys
        (assert key ((symbol of key) to-string).
      ).
    ).
  ).
).

(define "Constant and Special Values" (= ()
  (define "(symbol empty)" (= ()
    (should "its key value is (string empty)." (= ()
      (assert (string empty) ((symbol empty) key).
    ).
    (should "it is evaluated to null." (= ()
      (assert null ((symbol empty)).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol empty) is-unsafe).
      (assert false ((symbol empty) is-safe).
    ).
    (should "it is also taken as an unsafe symbol." (= ()
      (assert ((symbol empty) is-unsafe symbol).
      (assert false ((symbol empty) is-safe symbol).
    ).
    (should "it may be generated with a key value of (string empty)." (= ()
      (assert (symbol empty) (symbol of (string empty).
    ).
    (should "it may be generated with a key value of non-string." (= ()
      (assert (symbol empty) (symbol of).
      (assert (symbol empty) (symbol of null).
      (assert (symbol empty) (symbol of type).
      (assert (symbol empty) (symbol of true).
      (assert (symbol empty) (symbol of false).
      (assert (symbol empty) (symbol of 0).
      (assert (symbol empty) (symbol of 1).
      (assert (symbol empty) (symbol of -1).
      (assert (symbol empty) (symbol of (=).
      (assert (symbol empty) (symbol of (->).
      (assert (symbol empty) (symbol of (=>).
      (assert (symbol empty) (symbol of (=?).
      (assert (symbol empty) (symbol of (@).
      (assert (symbol empty) (symbol of (@:).
    ).
  ).
  (define "(symbol etc)" (= ()
    (should "its key value is \"...\"." (= ()
      (assert "..." ((symbol etc) key).
      (assert "..." ((symbol etc) to-string).
      (assert ((symbol of "...") is (symbol etc).
    ).
    (should "it is evaluated to null." (= ()
      (assert null ((symbol etc)).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol etc) is-safe).
      (assert false ((symbol etc) is-unsafe).
    ).
    (should "it is also taken as a safe symbol." (= ()
      (assert ((symbol etc) is-safe symbol).
      (assert false ((symbol etc) is-unsafe symbol).
    ).
  ).
  (define "(symbol all)" (= ()
    (should "its key value is \"*\"." (= ()
      (assert "*" ((symbol all) key).
      (assert "*" ((symbol all) to-string).
      (assert ((symbol of "*") is (symbol all).
    ).
    (should "it is evaluated to null." (= ()
      (assert null ((symbol all)).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol all) is-safe).
      (assert false ((symbol all) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol all) is-safe symbol).
      (assert false ((symbol all) is-unsafe symbol).
    ).
  ).
  (define "(symbol any)" (= ()
    (should "its key value is \"?\"." (= ()
      (assert "?" ((symbol any) key).
      (assert "?" ((symbol any) to-string).
      (assert ((symbol of "?") is (symbol any).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol any) is-safe).
      (assert false ((symbol any) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol any) is-safe symbol).
      (assert false ((symbol any) is-unsafe symbol).
    ).
  ).
  (define "(symbol quote)" (= ()
    (should "its key value is \"`\"." (= ()
      (assert "`" ((symbol quote) key).
      (assert "`" ((symbol quote) to-string).
      (assert ((symbol of "`") is (symbol quote).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol quote)) is (symbol quote).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol quote) is-unsafe).
      (assert false ((symbol quote) is-safe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol quote) is-safe symbol).
      (assert false ((symbol quote) is-unsafe symbol).
    ).
  ).
  (define "(symbol lambda)" (= ()
    (should "its key value is \"=\"." (= ()
      (assert "=" ((symbol lambda) key).
      (assert "=" ((symbol lambda) to-string).
      (assert ((symbol of "=") is (symbol lambda).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol lambda)) is (symbol lambda).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol lambda) is-safe).
      (assert false ((symbol lambda) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol lambda) is-safe symbol).
      (assert false ((symbol lambda) is-unsafe symbol).
    ).
  ).
  (define "(symbol stambda)" (= ()
    (should "its key value is \"->\"." (= ()
      (assert "->" ((symbol stambda) key).
      (assert "->" ((symbol stambda) to-string).
      (assert ((symbol of "->") is (symbol stambda).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol stambda)) is (symbol stambda).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol stambda) is-safe).
      (assert false ((symbol stambda) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol stambda) is-safe symbol).
      (assert false ((symbol stambda) is-unsafe symbol).
    ).
  ).
  (define "(symbol function)" (= ()
    (should "its key value is \"=>\"." (= ()
      (assert "=>" ((symbol function) key).
      (assert "=>" ((symbol function) to-string).
      (assert ((symbol of "=>") is (symbol function).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol function)) is (symbol function).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol function) is-safe).
      (assert false ((symbol function) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol function) is-safe symbol).
      (assert false ((symbol function) is-unsafe symbol).
    ).
  ).
  (define "(symbol operator)" (= ()
    (should "its key value is \"=?\"." (= ()
      (assert "=?" ((symbol operator) key).
      (assert "=?" ((symbol operator) to-string).
      (assert ((symbol of "=?") is (symbol operator).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol operator)) is (symbol operator).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol operator) is-safe).
      (assert false ((symbol operator) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol operator) is-safe symbol).
      (assert false ((symbol operator) is-unsafe symbol).
    ).
  ).
  (define "(symbol let)" (= ()
    (should "its key value is \"let\"." (= ()
      (assert "let" ((symbol let) key).
      (assert "let" ((symbol let) to-string).
      (assert ((symbol of "let") is (symbol let).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol let)) is (symbol let).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol let) is-safe).
      (assert false ((symbol let) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol let) is-safe symbol).
      (assert false ((symbol let) is-unsafe symbol).
    ).
  ).
  (define "(symbol var)" (= ()
    (should "its key value is \"var\"." (= ()
      (assert "var" ((symbol var) key).
      (assert "var" ((symbol var) to-string).
      (assert ((symbol of "var") is (symbol var).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol var)) is (symbol var).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol var) is-safe).
      (assert false ((symbol var) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol var) is-safe symbol).
      (assert false ((symbol var) is-unsafe symbol).
    ).
  ).
  (define "(symbol const)" (= ()
    (should "its key value is \"const\"." (= ()
      (assert "const" ((symbol const) key).
      (assert "const" ((symbol const) to-string).
      (assert ((symbol of "const") is (symbol const).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol const)) is (symbol const).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol const) is-safe).
      (assert false ((symbol const) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol const) is-safe symbol).
      (assert false ((symbol const) is-unsafe symbol).
    ).
  ).
  (define "(symbol local)" (= ()
    (should "its key value is \"local\"." (= ()
      (assert "local" ((symbol local) key).
      (assert "local" ((symbol local) to-string).
      (assert ((symbol of "local") is (symbol local).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol local)) is (symbol local).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol local) is-safe).
      (assert false ((symbol local) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol local) is-safe symbol).
      (assert false ((symbol local) is-unsafe symbol).
    ).
  ).
  (define "(symbol locon)" (= ()
    (should "its key value is \"locon\"." (= ()
      (assert "locon" ((symbol locon) key).
      (assert "locon" ((symbol locon) to-string).
      (assert ((symbol of "locon") is (symbol locon).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol locon)) is (symbol locon).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol locon) is-safe).
      (assert false ((symbol locon) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol locon) is-safe symbol).
      (assert false ((symbol locon) is-unsafe symbol).
    ).
  ).
  (define "(symbol escape)" (= ()
    (should "its key value is \"\\\"." (= ()
      (assert "\\" ((symbol escape) key).
      (assert "\\" ((symbol escape) to-string).
      (assert ((symbol of "\\") is (symbol escape).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol escape)) is (symbol escape).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol escape) is-unsafe).
      (assert false ((symbol escape) is-safe).
    ).
    (should "it is taken as an unsafe symbol." (= ()
      (assert ((symbol escape) is-unsafe symbol).
      (assert false ((symbol escape) is-safe symbol).
    ).
  ).
  (define "(symbol begin)" (= ()
    (should "its key value is \"(\"." (= ()
      (assert "(" ((symbol begin) key).
      (assert "(" ((symbol begin) to-string).
      (assert ((symbol of "(") is (symbol begin).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol begin)) is (symbol begin).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol begin) is-unsafe).
      (assert false ((symbol begin) is-safe).
    ).
    (should "it is taken as an unsafe symbol." (= ()
      (assert ((symbol begin) is-unsafe symbol).
      (assert false ((symbol begin) is-safe symbol).
    ).
  ).
  (define "(symbol end)" (= ()
    (should "its key value is \")\"." (= ()
      (assert ")" ((symbol end) key).
      (assert ")" ((symbol end) to-string).
      (assert ((symbol of ")") is (symbol end).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol end)) is (symbol end).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol end) is-unsafe).
      (assert false ((symbol end) is-safe).
    ).
    (should "it is taken as an unsafe symbol." (= ()
      (assert ((symbol end) is-unsafe symbol).
      (assert false ((symbol end) is-safe symbol).
    ).
  ).
  (define "(symbol comma)" (= ()
    (should "its key value is \",\"." (= ()
      (assert "," ((symbol comma) key).
      (assert "," ((symbol comma) to-string).
      (assert ((symbol of ",") is (symbol comma).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol comma)) is (symbol comma).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol comma) is-unsafe).
      (assert false ((symbol comma) is-safe).
    ).
    (should "it is taken as an unsafe symbol." (= ()
      (assert ((symbol comma) is-unsafe symbol).
      (assert false ((symbol comma) is-safe symbol).
    ).
  ).
  (define "(symbol period)" (= ()
    (should "its key value is \".\"." (= ()
      (assert "." ((symbol period) key).
      (assert "." ((symbol period) to-string).
      (assert ((symbol of ".") is (symbol period).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol period)) is (symbol period).
    ).
    (should "it is taken as safe." (= ()
      (assert ((symbol period) is-safe).
      (assert false ((symbol period) is-unsafe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol period) is-safe symbol).
      (assert false ((symbol period) is-unsafe symbol).
    ).
  ).
  (define "(symbol semicolon)" (= ()
    (should "its key value is \";\"." (= ()
      (assert ";" ((symbol semicolon) key).
      (assert ";" ((symbol semicolon) to-string).
      (assert ((symbol of ";") is (symbol semicolon).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol semicolon)) is (symbol semicolon).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol semicolon) is-unsafe).
      (assert false ((symbol semicolon) is-safe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol semicolon) is-safe symbol).
      (assert false ((symbol semicolon) is-unsafe symbol).
    ).
    (should "but a symbol including it is taken as unsafe." (= ()
      (assert ((symbol of ";;") is-unsafe).
      (assert ((symbol of ";a") is-unsafe).
      (assert ((symbol of "a;") is-unsafe).
    ).
  ).
  (define "(symbol literal)" (= ()
    (should "its key value is \"@\"." (= ()
      (assert "@" ((symbol literal) key).
      (assert "@" ((symbol literal) to-string).
      (assert ((symbol of "@") is (symbol literal).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol literal)) is (symbol literal).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol literal) is-unsafe).
      (assert false ((symbol literal) is-safe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol literal) is-safe symbol).
      (assert false ((symbol literal) is-unsafe symbol).
    ).
    (should "but a symbol including it is taken as unsafe." (= ()
      (assert ((symbol of "@@") is-unsafe).
      (assert ((symbol of "@a") is-unsafe).
      (assert ((symbol of "a@") is-unsafe).
    ).
  ).
  (define "(symbol pairing)" (= ()
    (should "its key value is \":\"." (= ()
      (assert ":" ((symbol pairing) key).
      (assert ":" ((symbol pairing) to-string).
      (assert ((symbol of ":") is (symbol pairing).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol pairing)) is (symbol pairing).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol pairing) is-unsafe).
      (assert false ((symbol pairing) is-safe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol pairing) is-safe symbol).
      (assert false ((symbol pairing) is-unsafe symbol).
    ).
    (should "but a symbol including it is taken as unsafe." (= ()
      (assert ((symbol of "::") is-unsafe).
      (assert ((symbol of ":a") is-unsafe).
      (assert ((symbol of "a:") is-unsafe).
    ).
  ).
  (define "(symbol subject)" (= ()
    (should "its key value is \"$\"." (= ()
      (assert "$" ((symbol subject) key).
      (assert "$" ((symbol subject) to-string).
      (assert ((symbol of "$") is (symbol subject).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol subject)) is (symbol subject).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol subject) is-unsafe).
      (assert false ((symbol subject) is-safe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol subject) is-safe symbol).
      (assert false ((symbol subject) is-unsafe symbol).
    ).
    (should "but a symbol including it is taken as an unsafe symbol." (= ()
      (assert ((symbol of "$$") is-unsafe).
      (assert ((symbol of "$a") is-unsafe).
      (assert ((symbol of "a$") is-unsafe).
    ).
  ).
  (define "(symbol comment)" (= ()
    (should "its key value is \"#\"." (= ()
      (assert "#" ((symbol comment) key).
      (assert "#" ((symbol comment) to-string).
      (assert ((symbol of "#") is (symbol comment).
    ).
    (should "it is evaluated to itself." (= ()
      (assert (((symbol comment)) is (symbol comment).
    ).
    (should "it is taken as unsafe." (= ()
      (assert ((symbol comment) is-unsafe).
      (assert false ((symbol comment) is-safe).
    ).
    (should "it is taken as a safe symbol." (= ()
      (assert ((symbol comment) is-safe symbol).
      (assert false ((symbol comment) is-unsafe symbol).
    ).
    (should "but a symbol including it is taken as an unsafe symbol." (= ()
      (assert ((symbol of "##") is-unsafe).
      (assert ((symbol of "#a") is-unsafe).
      (assert ((symbol of "a#") is-unsafe).
    ).
  ).
).

(define "(symbol of ...)" (= ()
  (should "(symbol of) and (symbol of null) return (symbol empty)." (= ()
    (assert (symbol empty) (symbol of).
    (assert (symbol empty) (symbol of null).
    (assert (symbol empty) (symbol of null null).
    (assert (symbol empty) (symbol of null null null).
  ).
  (should "(symbol of key-str) returns a symbol with a key value of key-str)." (= ()
    (var keys (@
      "a" "-" "." "aa" ".." "--" "a." ".a" "-." ".-" "a-" "-a"
    ).
    (for key in keys
      (var sym (symbol of key).
      (assert (sym is-a symbol).
      (assert key (sym key).
      (assert key (sym to-string).
    ).
    (assert (symbol empty) (symbol of null null).
    (assert (symbol empty) (symbol of null null null).
  ).
  (should "(symbol of sym) returns sym." (= ()
    (var sym (` x).
    (assert sym (symbol of sym).
  ).
).

(define "(symbol of-shared ...)" (= ()
  (should "(symbol of-shared key-str) declares and returns a shared symbol with the key value of key-str." (= ()
    (assert (`a) (symbol of-shared "a").
    (assert (`.) (symbol of-shared ".").
    (assert (`-) (symbol of-shared "-").
  ).
  (should "(symbol of-shared) returns (symbol empty)." (= ()
    (assert (symbol empty) (symbol of-shared).
  ).
  (should "(symbol of-shared other-value) returns (symbol empty)." (= ()
    (var unsafe-keys (@
      null type
      bool true false
      string ""
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
    ).
    (for key in unsafe-keys
      (assert (symbol empty) (symbol of-shared key).
    ).
  ).
).

(define "(symbol is-safe ...)" (= ()
  (define "(symbol is-safe key)" (= ()
    (should "return true if the key is safe for a name." (= ()
      (assert (symbol is-safe "a").
      (assert (symbol is-safe ".").
      (assert (symbol is-safe "-").
    ).
    (should "return false if the key is unsafe for a name." (= ()
      (assert false (symbol is-safe "\\").
      (assert false (symbol is-safe "(").
      (assert false (symbol is-safe ")").
      (assert false (symbol is-safe "`").
      (assert false (symbol is-safe "@").
    ).
  ).
  (define "(symbol is-safe key symbol)" (= ()
    (should "return true if the key is a safe symbol." (= ()
      (assert (symbol is-safe "a" symbol).
      (assert (symbol is-safe "." symbol).
      (assert (symbol is-safe "-" symbol).
      (assert (symbol is-safe "`" symbol).
      (assert (symbol is-safe "@" symbol).
    ).
    (should "return false if the key is an unsafe symbol." (= ()
      (assert false (symbol is-safe "\\" symbol).
      (assert false (symbol is-safe "(" symbol).
      (assert false (symbol is-safe ")" symbol).
      (assert false (symbol is-safe "`a" symbol).
      (assert false (symbol is-safe "@a" symbol).
    ).
  ).
).

(define "(a-symbol key)" (= ()
  (should "return the string key value of this symbol." (= ()
    (assert "a" (symbol of "a":: key).
    (assert "." (symbol of ".":: key).
    (assert "-" (symbol of "-":: key).

    (assert "\\" (symbol of "\\":: key).
    (assert "(" (symbol of "(":: key).
    (assert ")" (symbol of ")":: key).
    (assert "," (symbol of ",":: key).

    (assert "`" (symbol of "`":: key).
    (assert "@" (symbol of "@":: key).
    (assert "$" (symbol of "$":: key).
  ).
).

(define "(a-symbol is-safe ...)" (= ()
  (define "(a-symbol is-safe)" (= ()
    (should "return true if this symbol's key is safe for a name." (= ()
      (assert (symbol of "a":: is-safe).
      (assert (symbol of ".":: is-safe).
      (assert (symbol of "-":: is-safe).
    ).
    (should "return false if the key is unsafe for a name." (= ()
      (assert false (symbol of "\\":: is-safe).
      (assert false (symbol of "(":: is-safe).
      (assert false (symbol of ")":: is-safe).
      (assert false (symbol of ",":: is-safe).

      (assert false (symbol of "`":: is-safe).
      (assert false (symbol of "@":: is-safe).
      (assert false (symbol of "$":: is-safe).
    ).
  ).
  (define "(a-symbol is-safe symbol)" (= ()
    (should "return true if the key is a safe symbol." (= ()
      (assert (symbol of "a":: is-safe symbol).
      (assert (symbol of ".":: is-safe symbol).
      (assert (symbol of "-":: is-safe symbol).
      (assert (symbol of "`":: is-safe symbol).
      (assert (symbol of "@":: is-safe symbol).
      (assert (symbol of "$":: is-safe symbol).
    ).
    (should "return false if the key is an unsafe symbol." (= ()
    (assert false (symbol of "\\":: is-safe symbol).
    (assert false (symbol of "(":: is-safe symbol).
    (assert false (symbol of ")":: is-safe symbol).
    (assert false (symbol of ",":: is-safe symbol).
    ).
  ).
).

(define "(a-symbol is-unsafe ...)" (= ()
  (define "(a-symbol is-unsafe)" (= ()
    (should "return false if this symbol's key is safe for a name." (= ()
      (assert false (symbol of "a":: is-unsafe).
      (assert false (symbol of ".":: is-unsafe).
      (assert false (symbol of "-":: is-unsafe).
    ).
    (should "return true if the key is unsafe for a name." (= ()
      (assert (symbol of "\\":: is-unsafe).
      (assert (symbol of "(":: is-unsafe).
      (assert (symbol of ")":: is-unsafe).
      (assert (symbol of ",":: is-unsafe).

      (assert (symbol of "`":: is-unsafe).
      (assert (symbol of "@":: is-unsafe).
      (assert (symbol of "$":: is-unsafe).
    ).
  ).
  (define "(a-symbol is-unsafe symbol)" (= ()
    (should "return false if the key is a safe symbol." (= ()
      (assert false (symbol of "a":: is-unsafe symbol).
      (assert false (symbol of ".":: is-unsafe symbol).
      (assert false (symbol of "-":: is-unsafe symbol).
      (assert false (symbol of "`":: is-unsafe symbol).
      (assert false (symbol of "@":: is-unsafe symbol).
      (assert false (symbol of "$":: is-unsafe symbol).
    ).
    (should "return true if the key is an unsafe symbol." (= ()
    (assert (symbol of "\\":: is-unsafe symbol).
    (assert (symbol of "(":: is-unsafe symbol).
    (assert (symbol of ")":: is-unsafe symbol).
    (assert (symbol of ",":: is-unsafe symbol).
    ).
  ).
).

(define "(a-symbol to-string ...)" (= ()
  (define "(a-symbol to-string)" (= ()
    (should "return the literal key as a string if this is a safe symbol." (= ()
      (assert "" ((symbol empty) to-string).
      (assert "a" ((symbol of "a") to-string).
      (assert "." ((symbol of ".") to-string).
      (assert "-" ((symbol of "-") to-string).
    ).
    (should "return the literal key as a string if this is an unsafe symbol." (= ()
      (assert "\\()" ((symbol of "\\()") to-string).
      (assert "null" ((symbol of "null") to-string).
      (assert "true" ((symbol of "true") to-string).
      (assert "false" ((symbol of "false") to-string).
      (assert "123" ((symbol of "123") to-string).
    ).
  ).
  (define "(a-symbol to-string symbol)" (= ()
    (should "return the literal key as a string if this is a safe symbol." (= ()
      (assert "a" ((symbol of "a") to-string symbol).
      (assert "." ((symbol of ".") to-string symbol).
      (assert "-" ((symbol of "-") to-string symbol).
    ).
    (should "return the escaped key as a string if this is an unsafe symbol." (= ()
      (assert "" ((symbol empty) to-string symbol).
      (assert "\\\\\\(\\)" ((symbol of "\\()") to-string symbol).
      (assert "null" ((symbol of "null") to-string symbol).
      (assert "true" ((symbol of "true") to-string symbol).
      (assert "false" ((symbol of "false") to-string symbol).
      (assert "123" ((symbol of "123") to-string symbol).
    ).
  ).
  (define "(a-symbol to-string string)" (= ()
    (should "return the literal key as a string if this is a safe symbol." (= ()
      (assert "a" ((symbol of "a") to-string string).
      (assert "." ((symbol of ".") to-string string).
      (assert "-" ((symbol of "-") to-string string).
    ).
    (should "return a literal string in code if this is an unsafe symbol." (= ()
      (assert '""' ((symbol empty) to-string string).
      (assert '"\\\\()"' ((symbol of "\\()") to-string string).
      (assert '"null"' ((symbol of "null") to-string string).
      (assert '"true"' ((symbol of "true") to-string string).
      (assert '"false"' ((symbol of "false") to-string string).
      (assert '"123"' ((symbol of "123") to-string string).
    ).
  ).
  (define "(a-symbol to-string tuple)" (= ()
    (should "return '(`)' if this is (symbol empty)." (= ()
      (assert "(`)" ((symbol empty) to-string tuple).
    ).
    (should "return the literal key as a string if this is a safe symbol." (= ()
      (assert "(`a)" ((symbol of "a") to-string tuple).
      (assert "(`.)" ((symbol of ".") to-string tuple).
      (assert "(`-)" ((symbol of "-") to-string tuple).
    ).
    (should "return a literal string in code if this is an unsafe symbol." (= ()
      (assert '(symbol of "\\\\()")' ((symbol of "\\()") to-string tuple).
      (assert '(symbol of "null")' ((symbol of "null") to-string tuple).
      (assert '(symbol of "true")' ((symbol of "true") to-string tuple).
      (assert '(symbol of "false")' ((symbol of "false") to-string tuple).
      (assert '(symbol of "123")' ((symbol of "123") to-string tuple).
    ).
  ).
).
