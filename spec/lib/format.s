(define "format pattern string" (=> ()
  (should "use '$' as the control and escaping character." (= ()
    assert "" "";
    assert "" '';
    assert "abc" 'abc';
    assert "$" '$';
    assert "$ " '$ ';
    assert "$" '$$';
    assert "$ " '$$ ';
    assert "$ $ ( $)" '$$ $ ( $)';
    assert "a$" 'a$$';
    assert "$b" '$$b';
    assert "a$b" 'a$$b';
    assert "a $ b" 'a $$ b';
  ).
  (should "support a single symbol as the value." (= ()
    var x 1;
    var -y 2;
    assert "11 1null 1 2" '$x$x $x$y $x $-y';
  ).
  (should "support a statement as the value." (= ()
    var x 1;
    var -y 2;
    assert "11 null 22" '$x$x $y $-y$-y';
    assert "11 null 22" '$(x)$(x) $(y) $(-y)$(-y)';
    assert "22 null 33" '$(x + x)$(x + x) $(y + x) $(-y + x)$(-y + x)';
    assert "13 1 33 null" '$(x ++)$(++ x) $(++ y) $(++ -y)$(-y ++) $(z ++)';

    let x 1;
    let -y 2;
    assert "1(x)1(-y)1 3 (3 2 -1)" '$x(x)$(x)(-y)$(x ++) $(++ x) $(x: -y)';
  ).
).

(define "(string format pattern ...)" (=> ()
  (should "(string format) returns null." (= ()
    assert null (string format);
  ).
  (should "(string format pattern args ...) use '{}' as control characters." (= ()
    assert "" (string format "{}");
    assert "null" (string format "{}" null);
    assert "null 1 " (string format "{} {} {}" null 1);
    assert " ..." (string format "{} {0}");
    assert "a" (string format "a{}");
    assert "a..." (string format "a{0}");
    assert "b" (string format "{}b");
    assert "...b" (string format "{2}b");
    assert "ab" (string format "a{}b");
    assert "a...b" (string format "a{0}b");
    assert "a  b" (string format "a {} b");
    assert "a ... b" (string format "a {0} b");
  ).
  (should "(string format pattern args ...) use '{' as escaping character for itself." (= ()
    assert "" (string format "{");
    assert "" (string format "{}");
    assert "{" (string format "{{");
    assert "{}" (string format "{{}");
    assert "a{}" (string format "a{{}");
    assert "{}b" (string format "{{}b");
    assert "a{}b" (string format "a{{}b");
    assert "a {} b" (string format "a {{} b");
  ).
  (should "(string format pattern args ...) replaces {n} to (string of (args n))." (= ()
    assert "a0 b0a1b1a...b1a0b... a0" (string format "a{0} b{0}a{1}b{1}a{2}b{-1}a{-2}b{-3} a{0{1" 0 1);
  ).
  (should "(string format pattern args ...) replaces {n:fmt} to (args n:: to-string fmt)." (= ()
    let x 7; let y 16;
    assert "a7" (string format "a{0:" x y);
    assert "a7" (string format "a{0: " x y);
    assert "a7 " (string format "a{0:} " x y);
    assert "a7 " (string format "a{0:} " x y);
    assert "a0b111 b0x10" (string format "a{0:b} b{1:h" x y);
    assert "a0b111 b16" (string format "a{0:bin} b{1:hex " x y);
    assert "a111 b10" (string format "a{0:B} b{1:H}" x y);
    assert "a111 b10 " (string format "a{0:BIN} b{1:HEX} " x y);

    assert "a7 b16" (string format "a{0:b} b{1:h" "7" "16");
    assert "a7 b16" (string format "a{0:bin} b{1:hex " "7" "16");
    assert "a7 b16" (string format "a{0:B} b{1:H}" "7" "16");
    assert "a7 b16 " (string format "a{0:BIN} b{1:HEX} " "7" "16");
  ).
  (should "(string format pattern args ...) replaces {n} to '...' if n is beyond argument number." (= ()
    assert "..." (string format "{0}");
    assert "1 null  ..." (string format "{0} {1} {} {3}" 1 null);
    assert "... 0 1 0 1 ... ..." (string format "{-3} {-2} {-1} {0} {1} {2} {3}" 0 1);
  ).
).
