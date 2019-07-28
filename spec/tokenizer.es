(define "(tokenizer ...)" (= ()
  (should "(tokenizer) returns the global function tokenize." (= ()
    (var tokenizing (tokenizer ).
    (assert ($tokenizing is-a function).
    (assert ($tokenizing is tokenize).
  ).
  (should "(tokenizer a-lambda) returns a function to feed all tokens to the parser lambda." (= ()
    (var tokens (@).
    (var parser (=() (this push arguments).
    (var tokenizing (tokenizer ($parser bind tokens).
    (assert ($tokenizing is-a function).

    (tokenizing "(x)").
    (assert 3 (tokens length).
  ).
  (should "(tokenizer a-func) returns a function to feed all tokens to the parser function." (= ()
    (var tokens (@).
    (var parser (=>() (tokens push arguments).
    (var tokenizing (tokenizer parser).
    (assert ($tokenizing is-a function).

    (tokenizing "(x)").
    (assert 3 (tokens length).
  ).
  (should "(tokenizing ) and (tokenizing non-string) resets its inner states to begin a new tokenizing session." (= ()
    (var tokens (@).
    (var parser (=>() (tokens push arguments).
    (var tokenizing (tokenizer parser).
    (assert ($tokenizing is-a function).

    (tokenizing "\"xyz").
    (assert 0 (tokens length).

    (tokenizing)
    (assert 1 (tokens length).

    (tokens clear)
    (tokenizing "(y)").
    (assert 3 (tokens length).

    (var non-str-values (@
      null type
      bool true false
      number -1 -0 0 1 1.1
      string
      date (date empty)
      range (range empty)
      date (date empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (=?)
      lambda (=)
      lambda (=>)
      iterator (iterator empty)
      array (array empty)
      object (object empty)
      class (class empty) ((class empty) default)
    ).
    (for non-str in non-str-values
      (tokens clear)
      (tokenizing "\"xyz").
      (assert 0 (tokens length).

      (tokenizing non-str)
      (assert 1 (tokens length).

      (tokens clear)
      (tokenizing "(y)").
      (assert 3 (tokens length).
    ).
  ).
  (should "(tokenizer non-applicable) returns the global function tokenize." (= ()
    (var non-applicables (@
      null type
      bool true false
      number -1 -0 0 1 1.1
      string "" " " "x"
      date (date empty)
      range (range empty)
      date (date empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (=?)
      iterator (iterator empty)
      array (array empty)
      object (object empty)
      class (class empty) ((class empty) default)
    ).
    (for nona in non-applicables
      (var tokenizing (tokenizer nona).
      (assert ($tokenizing is-a function).
      (assert ($tokenizing is tokenize).
    ).
  ).
).

(define "(tokenize ...)" (= ()
  (should "(tokenize) returns an empty array." (= ()
    (var tokens (tokenize).
    (assert (tokens is-an array).
    (assert 0 (tokens length).
  ).
  (var assert-punc (=? (C T)
    (assert "punctuation" ((T) 0).
    (assert (C) ((T) 1).
  ).
  (should "(tokenize punctuation-characters) produces each punctuation character literally." (=> ()
    (var tokens (tokenize "(()())").
    (assert (tokens is-an array).
    (assert 6 (tokens length).
    (assert-punc "(" (tokens 0).
    (assert-punc "(" (tokens 1).
    (assert-punc ")" (tokens 2).
    (assert-punc "(" (tokens 3).
    (assert-punc ")" (tokens 4).
    (assert-punc ")" (tokens 5).
  ).
  (var assert-sym (=? (S T)
    (assert "symbol" ((T) 0).
    (assert (symbol of (S)) ((T) 1).
  ).
  (var assert-space (=? (S T)
    (assert "space" ((T) 0).
    (assert (S) ((T) 1).
  ).
  (define "symbols" (=> ()
    (should "(tokenize special-symbols) produces each special symbol character literally." (=> ()
      (var tokens (tokenize "``@@::$$[[]]{{}},,;;").
      (assert (tokens is-an array).
      (assert 20 (tokens length).
      (assert-sym "`" (tokens 0).
      (assert-sym "@" (tokens 2).
      (assert-sym ":" (tokens 4).
      (assert-sym "$" (tokens 6).
      (assert-sym "[" (tokens 8).
      (assert-sym "]" (tokens 10).
      (assert-sym "{" (tokens 12).
      (assert-sym "}" (tokens 14).
      (assert-sym "," (tokens 16).
      (assert-sym ";" (tokens 18).
    ).
    (should "(tokenize symbols) allows any characters in a symbol as long as it's neither a punctuation nor a space." (=> ()
      (var tokens (tokenize "~!%^&*_abc ABC -+=|<>.?/123").
      (assert (tokens is-an array).
      (assert 5 (tokens length).
      (assert-sym "~!%^&*_abc" (tokens 0).
      （assert-space " " (tokens 1).
      (assert-sym "ABC" (tokens 2).
      （assert-space " " (tokens 3).
      (assert-sym "-+=|<>.?/123" (tokens 4).
    ).
    (should "a punctuation may be included in a symbol by escaping." (=> ()
      (var tokens (tokenize "\\( \\) \\(\\) \\)\\( \\(a\\\\b\\)").
      (assert (tokens is-an array).
      (assert 9 (tokens length).
      (assert-sym "(" (tokens 0).
      (assert-space " " (tokens 1).
      (assert-sym ")" (tokens 2).
      (assert-space " " (tokens 3).
      (assert-sym "()" (tokens 4).
      (assert-space " " (tokens 5).
      (assert-sym ")(" (tokens 6).
      (assert-space " " (tokens 7).
      (assert-sym "(a\\b)" (tokens 8).
    ).
    (should "a space may be included in a symbol by escaping." (=> ()
      (var tokens (tokenize "\\ \t\\\t \\ \\\t \\\t\\  \\ a\\\tb\\  \\").
      (assert (tokens is-an array).
      (assert 11 (tokens length).
      (assert-sym " " (tokens 0).
      (assert-space "\t" (tokens 1).
      (assert-sym "\t" (tokens 2).
      (assert-space " " (tokens 3).
      (assert-sym " \t" (tokens 4).
      (assert-space " " (tokens 5).
      (assert-sym "\t " (tokens 6).
      (assert-space " " (tokens 7).
      (assert-sym " a\tb " (tokens 8).
      (assert-space " " (tokens 9).
      (assert-sym "" (tokens 10).
    ).
    (should "a special symbol may be included in a symbol by escaping." (=> ()
      (var tokens (tokenize "\\` \\@ \\: \\$ \\[ \\] \\{ \\} \\, \\; \\\\").
      (assert (tokens is-an array).
      (assert 21 (tokens length).
      (assert-sym "`" (tokens 0).
      (assert-sym "@" (tokens 2).
      (assert-sym ":" (tokens 4).
      (assert-sym "$" (tokens 6).
      (assert-sym "[" (tokens 8).
      (assert-sym "]" (tokens 10).
      (assert-sym "{" (tokens 12).
      (assert-sym "}" (tokens 14).
      (assert-sym "," (tokens 16).
      (assert-sym ";" (tokens 18).
      (assert-sym "\\" (tokens 20).

      (assert (symbol quote) (` \`).
      (assert (symbol escape) (` \\).
      (assert (symbol begin) (` \().
      (assert (symbol end) (` \)).
    ).
  ).
  (define "indention" (=> ()
    (should "(tokenize code) ignores the indenting spaces for each line." (=> ()
      (var tokens (tokenize " \t|\r\n\t |\n \t\t |").
      (assert (tokens is-an array).
      (assert 6 (tokens length).
      (assert-sym "|" (tokens 0).
      (assert-space "\r" (tokens 1).
      (assert-space "\n" (tokens 2).
      (assert-sym "|" (tokens 3).
      (assert-space "\n" (tokens 4).
      (assert-sym "|" (tokens 5).
    ).
    (should "(tokenize code) produces the first space only for a space character sequence." (=> ()
      (var tokens (tokenize "( \t\r|\t \r|\r  \t|\n )").
      (assert (tokens is-an array).
      (assert 9 (tokens length).
      (assert-punc "(" (tokens 0).
      (assert-space " " (tokens 1).
      (assert-sym "|" (tokens 2).
      (assert-space "\t" (tokens 3).
      (assert-sym "|" (tokens 4).
      (assert-space "\r" (tokens 5).
      (assert-sym "|" (tokens 6).
      (assert-space "\n" (tokens 7).
      (assert-punc ")" (tokens 8).
    ).
    (should "(tokenize code) ignores the indenting spaces for each line." (=> ()
      (var tokens (tokenize " \t|\r\n\t |\n \t\t |").
      (assert (tokens is-an array).
      (assert 6 (tokens length).
      (assert-sym "|" (tokens 0).
      (assert-space "\r" (tokens 1).
      (assert-space "\n" (tokens 2).
      (assert-sym "|" (tokens 3).
      (assert-space "\n" (tokens 4).
      (assert-sym "|" (tokens 5).
    ).
    (should "(tokenize code) raises a warning for a tab-space in indention." (=> ()
      (var old-warning (warn).
      (var tokens (tokenize " \t|").
      (var warning (warn).

      (assert 1 (tokens length).
      (assert-sym "|" (tokens 0).

      (assert (warning is-not old-warning).
      (assert (warning is-an array).
      (assert "tokenizer" (warning 0).
    ).
  ).
  (var assert-value (=? (V T)
    (assert "value" ((T) 0).
    (assert (V) ((T) 1).
  ).
  (define "constant values" (=> ()
    (should "(tokenize code) feeds all constant values directly to parser." (=> ()
      (var tokens (tokenize "null true false").
      (assert (tokens is-an array).
      (assert 5 (tokens length).
      (assert-value null (tokens 0).
      (assert-value true (tokens 2).
      (assert-value false (tokens 4).
    ).
  ).
  (define "number values" (=> ()
    (should "(tokenize code) takes all symbols leading by a number as a number." (=> ()
      (var tokens (tokenize "0 1 1.1 1.1e2 1.1e-2 0x0 0xff 0xFF 00 011 0b0 0b1111").
      (assert (tokens is-an array).
      (assert 23 (tokens length).
      (assert-value 0 (tokens 0).
      (assert-value 1 (tokens 2).
      (assert-value 1.1 (tokens 4).
      (assert-value 110 (tokens 6).
      (assert-value 0.011 (tokens 8).
      (assert-value 0 (tokens 10).
      (assert-value 255 (tokens 12).
      (assert-value 255 (tokens 14).
      (assert-value 0 (tokens 16).
      (assert-value 9 (tokens 18).
      (assert-value 0 (tokens 20).
      (assert-value 15 (tokens 22).
    ).
    (should "(tokenize code) allows a lead negative sign for float and decimal integer number." (=> ()
      (var tokens (tokenize "-0 -1 -1.1 -1.1e2 -1.1e-2").
      (assert (tokens is-an array).
      (assert 9 (tokens length).
      (assert-value -0 (tokens 0).
      (assert (((tokens 0) 1) is -0).
      (assert (((tokens 0) 1) is-not 0).
      (assert-value -1 (tokens 2).
      (assert-value -1.1 (tokens 4).
      (assert-value -110 (tokens 6).
      (assert-value -0.011 (tokens 8).
    ).
  ).
  (define "string values" (=> ()
    (should "(tokenize code) feeds a string value to parser function." (=> ()
      (var tokens (tokenize "\"abc\"").
      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-value "abc" (tokens 0).
    ).
    (should "(tokenize code) allows a string value has multiple lines." (=> ()
      (var tokens (tokenize "\"abc\ncde\n\"").
      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-value "abccde" (tokens 0).
    ).
    (should "(tokenize code) only keeps the first space character in new line." (=> ()
      (var tokens (tokenize "\"abc\n cde\n\t efg\n \t \\nghi\"").
      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-value "abc cde efg \nghi" (tokens 0).
    ).
    (should "(tokenize code) keeps the new-line after a trailing escaping char '\\'." (=> ()
      (var tokens (tokenize "\"abc ccc\\\ncde\\teee\\\n efg\\\n\t  ghi\"").
      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-value "abc ccc\ncde\teee\nefg\nghi" (tokens 0).
    ).
    (should "(tokenize code) automatically closes current string when reaching the end of code." (=> ()
      (var old-warning (warn).
      (var tokens (tokenize "\"abc").
      (var warning (warn).

      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-value "abc" (tokens 0).

      (assert (warning is-not old-warning).
      (assert (warning is-an array).
      (assert "tokenizer" (warning 0).
    ).
    (should "(tokenize code) keeps the literal string value if the un-escaping failed." (=> ()
      (var old-warning (warn).
      (var tokens (tokenize "\"abc\\").
      (var warning (warn).

      (var assert-str (=? STR
        (assert (tokens is-an array).
        (assert 1 (tokens length).
        (assert-value (STR) (tokens 0).
      ).
      (assert-str "abc\\")

      (var assert-warning (=? C
        (assert (warning is-not old-warning).
        (assert (warning is-an array).
        (assert ((C) ?? "string:unescape") (warning 0).
      ).
      (assert-warning)

      (let old-warning warning)
      (let tokens (tokenize "\"abc\\\"").
      (let warning (warn).
      (assert-str "abc\"")
      (assert-warning "tokenizer")

      (let old-warning warning)
      (let tokens (tokenize "\"abc\t \"").
      (let warning (warn).
      (assert-str "abc\t ")
      (assert-warning)

      (let old-warning warning)
      (let tokens (tokenize "\"abc\\1 \"").
      (let warning (warn).
      (assert-str "abc\1 ")
      (assert-warning)

      (let old-warning warning)
      (let tokens (tokenize "\"abc\\u12 \"").
      (let warning (warn).
      (assert-str "abc\u12 ")
      (assert-warning)
    ).
  ).
  (var assert-format (=? (F T)
    (assert "format" ((T) 0).
    (assert (F) ((T) 1).
  ).
  (define "format values" (=> ()
    (should "(tokenize code) feeds a single-quoted format value to parser function." (=> ()
      (var tokens (tokenize "'abc\"cde'").
      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-format "abc\"cde" (tokens 0).
    ).
  ).
  (var assert-comment (=? (C T)
    (assert "comment" ((T) 0).
    (assert (C) ((T) 1).
  ).
  (define "comments" (=> ()
    (should "(tokenize code) supports line comment leading by '#'." (=> ()
      (var tokens (tokenize "# abc").
      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-comment " abc" (tokens 0).

      (let tokens (tokenize "# abc \n cde").
      (assert (tokens is-an array).
      (assert 3 (tokens length).
      (assert-comment " abc " (tokens 0).
      (assert-space "\n" (tokens 1).
      (assert-sym "cde" (tokens 2).
    ).
    (should "(tokenize code) supports inline-comment enclosed in #(...)#." (=> ()
      (var tokens (tokenize "#( abc)# \tcde").
      (assert (tokens is-an array).
      (assert 3 (tokens length).
      (assert-comment "( abc)" (tokens 0).
      (assert-space " " (tokens 1).
      (assert-sym "cde" (tokens 2).
    ).
    (should "(tokenize code) supports multiline-comment enclosed in #(...\\n...)#." (=> ()
      (var tokens (tokenize "#( abc \n \n\t cde\nefg)#ghi ijk").
      (assert (tokens is-an array).
      (assert 4 (tokens length).
      (assert-comment "( abc \n \n\t cde\nefg)" (tokens 0).
      (assert-sym "ghi" (tokens 1).
      (assert-space " " (tokens 2).
      (assert-sym "ijk" (tokens 3).
    ).
    (should "(tokenize code) automatically closes an open comment block when reaching the end of code." (=> ()
      (var old-warning (warn).
      (var tokens (tokenize "#( abc").
      (var warning (warn).

      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-comment "( abc)" (tokens 0).

      (assert (warning is-not old-warning).
      (assert "tokenizer" (warning 0).

      (let old-warning warning).
      (var tokens (tokenize "#( abc\n\t  cde").
      (let warning (warn).

      (assert (tokens is-an array).
      (assert 1 (tokens length).
      (assert-comment "( abc\n\t  cde)" (tokens 0).

      (assert (warning is-not old-warning).
      (assert "tokenizer" (warning 0).
    ).
  ).
).
