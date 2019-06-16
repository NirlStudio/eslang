(define "(suglify )" (= ()
  (should "(suglify ) returns null." (= ()
    assert null (suglify);
  ).
).

(define "(suglify a-string)" (= ()
  (should "(suglify \"\") returns \"\"." (= ()
    assert "" (suglify "");
  ).
  (should "(suglify \"\") replaces all upper-cased characters to locale-based lower-cased ones." (= ()
    assert "a" (suglify "a");
    assert "ab" (suglify "ab");
    assert "abc" (suglify "abc");

    assert "a" (suglify "A");
    assert "ab" (suglify "AB");
    assert "abc" (suglify "ABC");
  ).
  (should "(suglify \"\") replaces a pascal or camel-cased string to a hyphen-separated string." (= ()
    assert "a" (suglify "a");
    assert "a-b" (suglify "aB");
    assert "a-bc" (suglify "aBc");
    assert "a-bcd" (suglify "aBcd");
    assert "a-bcd-e" (suglify "aBcdE");
    assert "a-bcd-ef" (suglify "aBcdEf");

    assert "a" (suglify "A");
    assert "aa-b" (suglify "AaB");
    assert "aa-bc" (suglify "AaBc");
    assert "aa-bcd" (suglify "AaBcd");
    assert "aa-bcd-e" (suglify "AaBcdE");
    assert "aaa-bcd-ef" (suglify "AaaBcdEf");
  ).
  (should "(suglify \"\") recognizes an all-capital abbreviation as a single word." (= ()
    assert "io" (suglify "IO");
    assert "iot" (suglify "IOT");
    assert "io-read" (suglify "IORead");

    assert "file-io" (suglify "FileIO");
    assert "file-io-read" (suglify "FileIORead");
  ).
  (should "(suglify a-string) replaces a breaking (one or more underscore, hyphen
           and/or spaces) to a single hyphen."
    (= ()
      assert "-" (suglify "_");
      assert "-" (suglify "__");

      assert "-a" (suglify "__a");
      assert "-a-" (suglify "__a__");

      assert "-" (suglify "-");
      assert "-" (suglify "--");

      assert "-a" (suglify "-a");
      assert "-a-" (suglify "--a--");

      assert "-" (suglify " ");
      assert "-" (suglify "  ");
      assert "-" (suglify " \t\n");

      assert "-a" (suglify " a");
      assert "-a-" (suglify "  a  ");

      assert "-" (suglify "-_ ");
      assert "-" (suglify "- _");
      assert "-" (suglify " _-");
      assert "-" (suglify " -_");
      assert "-" (suglify "_- ");
      assert "-" (suglify "_ -");

      assert "-a" (suglify "-_ a");
      assert "-a" (suglify "- _a");
      assert "-a" (suglify " _-a");
      assert "-a" (suglify " -_a");
      assert "-a" (suglify "_- a");
      assert "-a" (suglify "_ -a");

      assert "a-" (suglify "a-_ ");
      assert "a-" (suglify "a- _");
      assert "a-" (suglify "a _-");
      assert "a-" (suglify "a -_");
      assert "a-" (suglify "a_- ");
      assert "a-" (suglify "a_ -");

      assert "aa-bc-def-g" (suglify "aa_BC-Def G");
      assert "aa-bc-def-g" (suglify "Aa_bc-def g");
    ).
).

(define "(suglify a-func)" (= ()
  (should "(suglify a-lambda) returns null." (= ()
    assert null (suglify (lambda empty);
  ).
  (should "(suglify a-function) returns null." (= ()
    assert null (suglify (function empty);
  ).
  (should "(suglify a-generic-func) returns an object." (= ()
    var printer (suglify print);
    assert (printer is-an object);

    assert (printer "call":: is-a function);
    assert (printer "new":: is-a function);
  ).
  (should "(suglify a-generic-func) provide a set- function." (= ()
    var printer (suglify print);
    assert (printer "set-":: is-a function);
  ).
  (should "(suglify a-generic-func) provide setters for fields." (= ()
    var printer (suglify print);
    assert (printer native-field);
    assert (printer "native-field":: is-a bool);
    assert (printer "set-native-field":: is-a function);
  ).
).

(define "(suglify an-object)" (= ()
  (should "(suglify an-object) always returns a new object." (= ()
    (var obj (@
      x: 1,
      -x: 1,
      y: 2,
      y-: 2,
      z-z: 3
    ).
    assert (suglify obj:: is-not obj);

    let obj (object empty);
    assert (suglify obj:: is-not obj);
  ).
  (should "(suglify an-object) returns a new object if any member name is not sugly." (= ()
    var obj (@ X: 1);
    var sobj (suglify obj);
    assert (sobj is-not obj);
    assert 1 (sobj x);

    let obj (@ Xx: 1);
    let sobj (suglify obj);
    assert (sobj is-not obj);
    assert 1 (sobj xx);

    let obj (@ --x: 1);
    let sobj (suglify obj);
    assert (sobj is-not obj);
    assert 1 (sobj -x);

    let obj (@ x--: 1);
    let sobj (suglify obj);
    assert (sobj is-not obj);
    assert 1 (sobj x-);
  ).
  (should "(suglify an-object) provide a set- function." (= ()
    var obj (suglify (@ x: 1);
    assert (obj "set-":: is-a function);
  ).
  (should "(suglify an-object) provide setters for fields." (= ()
    var obj (suglify (@ x: 1, y: 2);
    assert 1 (obj x);
    assert (obj "x":: is-a number);
    assert (obj "set-x":: is-a function);
    assert 2 (obj y);
    assert (obj "y":: is-a number);
    assert (obj "set-y":: is-a function);
  ).
  (should "suglify accepts a class instance too." (= ()
    var inst (class empty:: empty);
    inst "x" 1;
    var sinst (suglify inst);
    assert (sinst is-an object);
    assert (sinst is-not inst);
    assert 1 (sinst x);
    assert (sinst "x":: is-a number);
    assert (sinst "set-x":: is-a function);

    let inst (class empty:: empty);
    inst "X" 1;
    let sinst (suglify inst);
    assert (sinst is-an object);
    assert (sinst is-not inst);
    assert 1 (sinst x);
    assert (sinst "x":: is-a number);
    assert (sinst "set-x":: is-a function);
  ).
).

(define "(suglify other-value)" (= ()
  (should "(suglify null) returns null." (= ()
    assert null (suglify null);
  ).
  (should "(suglify value) returns null." (= ()
    assert null (suglify type);

    assert null (suglify number);
    assert null (suglify 0);
    assert null (suglify 1);

    assert null (suglify bool);
    assert null (suglify true);
    assert null (suglify false);

    assert null (suglify string);

    assert null (suglify date);
    assert null (suglify (date empty);

    assert null (suglify range);
    assert null (suglify (range empty);

    assert null (suglify symbol);
    assert null (suglify (symbol empty);

    assert null (suglify tuple);
    assert null (suglify (tuple empty);

    assert null (suglify lambda);
    assert null (suglify function);

    assert null (suglify operator);
    assert null (suglify (operator empty);

    assert null (suglify iterator);
    assert null (suglify (iterator empty);

    assert null (suglify promise);
    assert null (suglify (promise empty);

    assert null (suglify array);
    assert null (suglify (array empty);

    assert null (suglify class);
    assert null (suglify (class empty);
  ).
).
