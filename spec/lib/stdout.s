(define "(print ...)" (= ()
  (should "(print ) returns (string empty)." (= ()
    assert "" (print);
  ).
  (should "(print value) returns (string of value)." (= ()
    assert "xyz" (print "xyz");
    assert "0" (print 0);
    assert "-0" (print -0);
    assert "1" (print 1);
    assert "-1" (print -1);
    assert "true" (print true);
    assert "null" (print null);
    assert "(1 10 1)" (print (1 10);
  ).
  (should "(print value ...) concatenates (string of value) by a single whitespace." (= ()
    assert "0 -1" (print 0 -1);
    assert "0 -1 true" (print 0 -1 true);
    assert "0 -1 null (1 10 1)" (print 0 -1 null (1 10);
  ).
).

(define "(printf ...)" (= ()
  (should "(printf ) returns (string empty)." (= ()
    assert "" (printf); print;
  ).
  (should "(printf value) returns (string of value)." (= ()
    assert "xyz" (printf "xyz");
    assert "0" (printf 0);
    assert "-0" (printf -0);
    assert "1" (printf 1);
    assert "-1" (printf -1);
    assert "true" (printf true);
    assert "null" (printf null);
    assert "(1 10 1)" (printf (1 10);
    print;
  ).
  (should "(printf value format) returns (string of value)." (= ()
    assert "xyz" (printf "xyz" "red");
    assert "0" (printf 0 "green");
    assert "-0" (printf -0 "blue");
    assert "1" (printf 1 "yellow");
    assert "-1" (printf -1 "gray");
    assert "true" (printf true "grey");
    assert "null" (printf null "underline");
    assert "(1 10 1)" (printf (1 10) "overline line-through");
    print;
  ).
).

(define "(warn ...)" (= ()
  (should "(warn ) returns the last warning." (= ()
    warn "c" 1 2 3;
    var warning (warn);
    assert "c" (warning 0);
    assert (warning 1:: is-a array);
    assert 1 (warning 2);
    assert 2 (warning 3);
    assert 3 (warning 4);
  ).
  (should "(warn category ...) returns the new warning." (= ()
    var warning (warn "c" 1 2 3);
    assert "c" (warning 0);
    assert (warning 1:: is-a array);
    assert 1 (warning 2);
    assert 2 (warning 3);
    assert 3 (warning 4);
  ).
  (should "(warn category ...) requires that the category be a string." (= ()
    var warning (warn 100 200 300);
    assert "stdout:warn" (warning 0);
    assert (warning 1:: is-a array);
    assert "category should be a string:" (warning 2);
    assert 100 (warning 3);
  ).
).

(define "(debug ...)" (= ()
  (should "(debug) returns null." (= ()
    assert null (debug);
  ).
  (should "(debug value) returns value." (= ()
    assert null (debug null);
    assert true (debug true);
    assert 100 (debug 100);
  ).
  (should "(debug value ...) returns the last value." (= ()
    assert null (debug 1 null);
    assert true (debug 1 -1 true);
    assert 100 (debug 1 -1 0 100);
  ).
).

(define "(log level ...)" (= ()
  (should "(log) returns false." (= ()
    assert false (log);
  ).
  (define "(log verbose ...)" (= ()
    (should "(log verbose ...) returns true if logging-level >= 4." (= ()
      assert (env "logging-level":: >= 4) (log verbose 1 2 3);
    ).
    (should "(log v ...) works like (log verbose ...)." (= ()
      assert (env "logging-level":: >= 4) (log v 1 2 3);
    ).
  ).
  (define "(log info ...)" (= ()
    (should "(log info ...) returns true if logging-level >= 3." (= ()
      assert (env "logging-level":: >= 3) (log info 1 2 3);
    ).
    (should "(log i ...) works like (log info ...)." (= ()
      assert (env "logging-level":: >= 3) (log i 1 2 3);
    ).
  ).
  (define "(log warning ...)" (= ()
    (should "(log warning ...) returns true if logging-level >= 2." (= ()
      assert (env "logging-level":: >= 2) (log warning 1 2 3);
    ).
    (should "(log warn ...) works like (log warning ...)." (= ()
      assert (env "logging-level":: >= 2) (log warn 1 2 3);
    ).
    (should "(log w ...) works like (log warning ...)." (= ()
      assert (env "logging-level":: >= 2) (log w 1 2 3);
    ).
  ).
  (define "(log error ...)" (= ()
    (should "(log error ...) returns true if logging-level >= 1." (= ()
      assert (env "logging-level":: >= 1) (log error 1 2 3);
    ).
    (should "(log err ...) works like (log error ...)." (= ()
      assert (env "logging-level":: >= 1) (log err 1 2 3);
    ).
    (should "(log e ...) works like (log error ...)." (= ()
      assert (env "logging-level":: >= 1) (log e 1 2 3);
    ).
  ).
  (define "(log debug ...)" (= ()
    (should "(log debug ...) returns true if is-debugging is true." (= ()
      assert (env "is-debugging":: is true) (log debug 1 2 3);
    ).
    (should "(log d ...) works like (log debug ...)." (= ()
      assert (env "is-debugging":: is true) (log d 1 2 3);
    ).
  ).
  (define "(log x ...)" (= ()
    (should "(log x ...) will cause a warning if x is not a valid logging level." (= ()
      warn *;
      assert false (log x 1 2 3);
      var warning (warn);
      assert "stdout:log" (warning 0);
    ).
  ).
).
