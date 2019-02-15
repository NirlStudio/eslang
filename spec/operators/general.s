(define "(+ ...)" (= ()
  (should "(+) returns 0." (=> ()
    (assert 0 (+).
  ).
  (should "(+ num) returns num." (=> ()
    (assert 1.1 (+ 1.1).
  ).
  (should "(+ num values ...) returns the sum of all numbers." (=> ()
    (assert 6.6 (+ 1.1 2.2 3.3).
    (assert 7.6 (+ 1.1 2.2 3.3 true).
    (assert 7.6 (+ 1.1 2.2 3.3 true null).
    (assert 17.6 (+ 1.1 2.2 3.3 true null "10").
  ).
  (should "(+ str) returns str." (=> ()
    (assert "1.1" (+ "1.1").
  ).
  (should "(+ str values ...) returns the concatenation of all strings." (=> ()
    (assert "xyy" (+ "x" "yy").
    (assert "xyytrue" (+ "x" "yy" true).
    (assert "xyytrue100" (+ "x" "yy" true 100).
    (assert "xyytrue100null" (+ "x" "yy" true 100 null).
  ).
).

(define "(a-string +=)" (= ()
  (should "(string +=) returns the original string." (=> ()
    (assert "" ("" +=).
    (assert " " (" " +=).
    (assert "xyz" ("xyz" +=).

    (var str "abc")
    (assert "abc" (str +=).

    (let str "abc")
    (assert "abccde" ((str + "cde") +=).
    (assert "abc" str)
  ).
  (should "(str += values ...) concatenates the original string and values; then returns the new value." (=> ()
    (assert "10" ("" += 10).
    (assert "11010" ("1" += 10 "10").
    (assert "-11010true" ("-1" += 10 "10" true).

    (var str "x")
    (assert "xyz" (str += "yz").

    (let str "x")
    (assert "x1010" ((str + 10) += 10).
    (assert "x" str)
  ).
  (should "(str += values ...) sets the new value back to str if str is a symbol." (=> ()
    (var str "x")
    (assert "x10" (str += 10).
    (assert "x10" str)

    (let str "")
    (assert "10true" (str += 10 true).
    (assert "10true" str)
  ).
).

(define "(a-string -=)" (= ()
  (should "(str -=) returns the original string." (=> ()
    (assert "" ("" -=).
    (assert " " (" " -=).
    (assert "xyz" ("xyz" -=).

    (var str "abc")
    (assert "abc" (str -=).

    (let str "abc")
    (assert "abccde" ((str + "cde") -=).
    (assert "abc" str)
  ).
  (should "(str -= num ...) removes a number of characters from the tail of string." (=> ()
    (assert "1" ("10" -= 1).
    (assert "xyz1" ("xyz1010" -= 3).
    (assert "-1101" ("-11010true" -= 5).
  ).
  (should "(str -= other-values ...) removes the strings of values from left to right if they appear on tail." (=> ()
    (assert "" ("10" -= "10").
    (assert "xyz" ("xyz1010" -= "10" "10").
    (assert "-110" ("-11010true" -= true "11" "10").
  ).
  (should "(str -= values ...) sets the new value back to str if str is a symbol." (=> ()
    (var str "x10")
    (assert "x" (str -= "10").
    (assert "x" str)

    (let str "12345true223")
    (assert "1234" (str -= "2" 2 1 true "3" "5").
    (assert "1234" str)
  ).
).
