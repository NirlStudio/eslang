(define "(espress )" (= ()
  (should "(espress ) returns null." (= ()
    assert null (espress );
  ).
).

(define "(espress a-string)" (= ()
  (should "(espress \"\") returns \"\"." (= ()
    assert "" (espress "");
  ).
  (should "(espress \"\") replaces all upper-cased characters to locale-based lower-cased ones." (= ()
    assert "a" (espress "a");
    assert "ab" (espress "ab");
    assert "abc" (espress "abc");

    assert "a" (espress "A");
    assert "ab" (espress "AB");
    assert "abc" (espress "ABC");
  ).
  (should "(espress \"\") replaces a pascal or camel-cased string to a hyphen-separated string." (= ()
    assert "a" (espress "a");
    assert "a-b" (espress "aB");
    assert "a-bc" (espress "aBc");
    assert "a-bcd" (espress "aBcd");
    assert "a-bcd-e" (espress "aBcdE");
    assert "a-bcd-ef" (espress "aBcdEf");

    assert "a" (espress "A");
    assert "aa-b" (espress "AaB");
    assert "aa-bc" (espress "AaBc");
    assert "aa-bcd" (espress "AaBcd");
    assert "aa-bcd-e" (espress "AaBcdE");
    assert "aaa-bcd-ef" (espress "AaaBcdEf");
  ).
  (should "(espress \"\") recognizes an all-capital abbreviation as a single word." (= ()
    assert "io" (espress "IO");
    assert "iot" (espress "IOT");
    assert "io-read" (espress "IORead");

    assert "file-io" (espress "FileIO");
    assert "file-io-read" (espress "FileIORead");
  ).
  (should "(espress a-string) replaces a breaking (one or more underscore, hyphen
           and/or spaces) to a single hyphen."
    (= ()
      assert "-" (espress "_");
      assert "-" (espress "__");

      assert "-a" (espress "__a");
      assert "-a-" (espress "__a__");

      assert "-" (espress "-");
      assert "-" (espress "--");

      assert "-a" (espress "-a");
      assert "-a-" (espress "--a--");

      assert "-" (espress " ");
      assert "-" (espress "  ");
      assert "-" (espress " \t\n");

      assert "-a" (espress " a");
      assert "-a-" (espress "  a  ");

      assert "-" (espress "-_ ");
      assert "-" (espress "- _");
      assert "-" (espress " _-");
      assert "-" (espress " -_");
      assert "-" (espress "_- ");
      assert "-" (espress "_ -");

      assert "-a" (espress "-_ a");
      assert "-a" (espress "- _a");
      assert "-a" (espress " _-a");
      assert "-a" (espress " -_a");
      assert "-a" (espress "_- a");
      assert "-a" (espress "_ -a");

      assert "a-" (espress "a-_ ");
      assert "a-" (espress "a- _");
      assert "a-" (espress "a _-");
      assert "a-" (espress "a -_");
      assert "a-" (espress "a_- ");
      assert "a-" (espress "a_ -");

      assert "aa-bc-def-g" (espress "aa_BC-Def G");
      assert "aa-bc-def-g" (espress "Aa_bc-def g");
    ).
).

(define "(espress a-func)" (= ()
  (should "(espress a-lambda) returns null." (= ()
    assert null (espress (lambda empty);
  ).
  (should "(espress a-function) returns null." (= ()
    assert null (espress (function empty);
  ).
  (should "(espress a-generic-func) returns an object." (= ()
    var printer (espress print);
    assert (printer is-an object);

    assert (printer "call":: is-a function);
    assert (printer "new":: is-a function);
  ).
  (should "(espress a-generic-func) provide a set- function." (= ()
    var printer (espress print);
    assert (printer "set-":: is-a function);
  ).
  (should "(espress a-generic-func) provide setters for fields." (= ()
    var printer (espress print);
    assert (printer native-field);
    assert (printer "native-field":: is-a bool);
    assert (printer "set-native-field":: is-a function);
  ).
).

(define "(espress an-object)" (= ()
  (should "(espress an-object) always returns a new object." (= ()
    (var obj (@
      x: 1,
      -x: 1,
      y: 2,
      y-: 2,
      z-z: 3
    ).
    assert (espress obj:: is-not obj);

    let obj (object empty);
    assert (espress obj:: is-not obj);
  ).
  (should "(espress an-object) returns a new object if any member name is not Espresso style." (= ()
    var obj (@ X: 1);
    var sobj (espress obj);
    assert (sobj is-not obj);
    assert 1 (sobj x);

    let obj (@ Xx: 1);
    let sobj (espress obj);
    assert (sobj is-not obj);
    assert 1 (sobj xx);

    let obj (@ --x: 1);
    let sobj (espress obj);
    assert (sobj is-not obj);
    assert 1 (sobj -x);

    let obj (@ x--: 1);
    let sobj (espress obj);
    assert (sobj is-not obj);
    assert 1 (sobj x-);
  ).
  (should "(espress an-object) provide a set- function." (= ()
    var obj (espress (@ x: 1);
    assert (obj "set-":: is-a function);
  ).
  (should "(espress an-object) provide setters for fields." (= ()
    var obj (espress (@ x: 1, y: 2);
    assert 1 (obj x);
    assert (obj "x":: is-a number);
    assert (obj "set-x":: is-a function);
    assert 2 (obj y);
    assert (obj "y":: is-a number);
    assert (obj "set-y":: is-a function);
  ).
  (should "espress accepts a class instance too." (= ()
    var inst (class empty:: empty);
    inst "x" 1;
    var sinst (espress inst);
    assert (sinst is-an object);
    assert (sinst is-not inst);
    assert 1 (sinst x);
    assert (sinst "x":: is-a number);
    assert (sinst "set-x":: is-a function);

    let inst (class empty:: empty);
    inst "X" 1;
    let sinst (espress inst);
    assert (sinst is-an object);
    assert (sinst is-not inst);
    assert 1 (sinst x);
    assert (sinst "x":: is-a number);
    assert (sinst "set-x":: is-a function);
  ).
).

(define "(espress other-value)" (= ()
  (should "(espress null) returns null." (= ()
    assert null (espress null);
  ).
  (should "(espress value) returns null." (= ()
    assert null (espress type);

    assert null (espress number);
    assert null (espress 0);
    assert null (espress 1);

    assert null (espress bool);
    assert null (espress true);
    assert null (espress false);

    assert null (espress string);

    assert null (espress date);
    assert null (espress (date empty);

    assert null (espress range);
    assert null (espress (range empty);

    assert null (espress symbol);
    assert null (espress (symbol empty);

    assert null (espress tuple);
    assert null (espress (tuple empty);

    assert null (espress lambda);
    assert null (espress function);

    assert null (espress operator);
    assert null (espress (operator empty);

    assert null (espress iterator);
    assert null (espress (iterator empty);

    assert null (espress promise);
    assert null (espress (promise empty);

    assert null (espress array);
    assert null (espress (array empty);

    assert null (espress class);
    assert null (espress (class empty);
  ).
).
