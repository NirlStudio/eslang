var reserved-chars ";,/?:@&=+$#";
var unreserved-marks "-_.!~*'()";
var alphanumeric-chars-and-space "ABC abc 123";

(define "(uri encode ...)" (=> ()
  (should "(uri encode) returns null." (= ()
    assert null (uri encode);
  ).
  (should "(uri encode non-str) returns null." (= ()
    assert null (uri encode null);
    assert null (uri encode 1);
    assert null (uri encode false);
  ).
  (should "(uri encode str) returns encoded string." (=> ()
    assert ";,/?:@&=+$#" (uri encode reserved-chars);
    assert "-_.!~*'()" (uri encode unreserved-marks);
    assert "ABC%20abc%20123" (uri encode alphanumeric-chars-and-space);
  ).
).

(define "(uri decode ...)" (=> ()
  (should "(uri decode) returns null." (= ()
    assert null (uri decode);
  ).
  (should "(uri decode non-str) returns null." (= ()
    assert null (uri decode null);
    assert null (uri decode 1);
    assert null (uri decode false);
    assert null (uri decode "%2%20");
  ).
  (should "(uri decode str) returns decoded string." (=> ()
    assert reserved-chars (uri decode ";,/?:@&=+$#");
    assert unreserved-marks (uri decode "-_.!~*'()");
    assert alphanumeric-chars-and-space (uri decode "ABC%20abc%20123");
  ).
  (should "(uri decode invalid-str default-value) returns default-value." (= ()
    var err (@ failed: true);
    assert err (uri decode null err);
    assert err (uri decode 1 err);
    assert err (uri decode false err);
    assert err (uri decode "%2%20" err);
  ).
).

(define "(uri escape ...)" (=> ()
  (should "(uri escape) returns null." (= ()
    assert null (uri escape);
  ).
  (should "(uri escape non-str) returns null." (= ()
    assert null (uri escape null);
    assert null (uri escape 1);
    assert null (uri escape false);
  ).
  (should "(uri escape str) returns escaped string." (=> ()
    assert "%3B%2C%2F%3F%3A%40%26%3D%2B%24%23" (uri escape reserved-chars);
    assert "-_.!~*'()" (uri escape unreserved-marks);
    assert "ABC%20abc%20123" (uri escape alphanumeric-chars-and-space);
  ).
).

(define "(uri unescape ...)" (=> ()
  (should "(uri unescape) returns null." (= ()
    assert null (uri unescape);
  ).
  (should "(uri unescape non-str) returns null." (= ()
    assert null (uri unescape null);
    assert null (uri unescape 1);
    assert null (uri unescape false);
    assert null (uri unescape "%2%20");
  ).
  (should "(uri unescape str) returns unescaped string." (=> ()
    assert reserved-chars (uri unescape ";,/?:@&=+$#");
    assert reserved-chars (uri unescape "%3B%2C%2F%3F%3A%40%26%3D%2B%24%23");
    assert unreserved-marks (uri unescape "-_.!~*'()");
    assert alphanumeric-chars-and-space (uri unescape "ABC%20abc%20123");
  ).
  (should "(uri unescape invalid-str default-value) returns default-value." (= ()
    var err (@ failed: true);
    assert err (uri unescape null err);
    assert err (uri unescape 1 err);
    assert err (uri unescape false err);
    assert err (uri unescape "%2%20" err);
  ).
).
