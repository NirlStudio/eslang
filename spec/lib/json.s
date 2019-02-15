(define "(json of ...)" (= ()
  (should "(json of) returns 'null'." (= ()
    assert "null" (json of);
  ).
  (should "(json of value) returns the JSON string of the value" (= ()
    assert "[1,2,3]" (json of (@1 2 3);
    (assert '{"x":1,"y":2}' (json of (@ x: 1, y: 2).
  ).
  (should "(json of value) returns null if the value is not valid for JSON." (= ()
    var obj (@ x: 1);
    obj "self" obj;
    assert null (json of obj);
  ).
  (should "(json of value default-json) returns default-json if the value is not valid." (= ()
    var obj (@ x: 1);
    obj "self" obj;
    assert "{}" (json of obj "{}");
  ).
).

(define "(json parse ...)" (= ()
  (should "(json parse) returns null." (= ()
    assert null (json parse);
  ).
  (should "(json parse str) returns a value from the json string." (= ()
    var list (json parse "[1,2,3]");
    assert (list is-a array);
    assert 1 (list 0);
    assert 2 (list 1);
    assert 3 (list 2);

    (var obj (json parse '{"x":1,"y":2}').
    assert (obj is-a object);
    assert 1 (obj x);
    assert 2 (obj y);
  ).
  (should "(json parse str) returns null if the str is not valid for JSON." (= ()
    assert null (json parse true);
    assert null (json parse 1);
    assert null (json parse "{");
  ).
  (should "(json parse str default-value) returns default-value if the str is not valid." (= ()
    var value (@: x: 1);
    assert value (json parse true value);
    assert value (json parse 1 value);
    assert value (json parse "{" value);
  ).
).
