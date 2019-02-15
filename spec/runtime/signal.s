(define "(break ...)" (= ()
  (should "only break the most recent level of for-loop." (= ()
    (var counter 0)
    (for i in (0 10)
      (for j in (1 10)
        (if (j > 5) (break).
        (counter ++)
    ).
    (assert 50 counter)

    (let i 0)
    (let counter 0)
    (while ((i ++) < 10)
      (for j in (1 10)
        (if (j > 5) (break).
        (counter ++)
    ).
    (assert 50 counter)
  ).
  (should "only break the most recent level of while-loop." (= ()
    (var counter 0)
    (for i in (0 10)
      (var j 0)
      (while ((++ j) < 10)
        (if (j > 5) (break).
        (counter ++)
    ).
    (assert 50 counter)

    (let i 0)
    (let counter 0)
    (while ((i ++) < 10)
      (var j 0)
      (while ((++ j) < 10)
        (if (j > 5) (break).
        (counter ++)
    ).
    (assert 50 counter)
  ).
).

(define "(continue ...)" (= ()
  (should "only cancel the most recent level of for-loop." (= ()
    (var counter 0)
    (for i in (0 10)
      (for j in (1 10)
        (if (j > 5) (continue ).
        (counter ++)
    ).
    (assert 50 counter)

    (let i 0)
    (let counter 0)
    (while ((i ++) < 10)
      (for j in (1 10)
        (if (j > 5) (continue).
        (counter ++)
    ).
    (assert 50 counter)
  ).
  (should "only cancel the most recent level of while-loop." (= ()
    (var counter 0)
    (for i in (0 10)
      (var j 0)
      (while ((++ j) < 10)
        (if (j > 5) (continue).
        (counter ++)
    ).
    (assert 50 counter)

    (let i 0)
    (let counter 0)
    (while ((i ++) < 10)
      (var j 0)
      (while ((++ j) < 10)
        (if (j > 5) (continue).
        (counter ++)
    ).
    (assert 50 counter)
  ).
).

(define "(redo ...)" (= ()
  (should "allow unlimited fake-recursive calls of a lambda." (= ()
    (var build (= n
      ((n > 10000 ) ? n (redo (1 + n).
    ).
    (assert 10001 (build).
  ).
  (should "allow unlimited fake-recursive calls of a function." (= ()
    (var build (=> n
      ((n > 10000 ) ? n (redo (1 + n).
    ).
    (assert 10001 (build).
  ).
).

(define "(return ...)" (= ()
  (should "be allowed in (eval ...)." (= ()
    (assert 10 (eval "(return 10) 1").
    (assert 100 (eval "(return 100) 1").
  ).
).

(define "(exit ...)" (= ()
  (should "be allowed in (eval ...)." (= ()
    (assert 10 (eval "(=:() (exit 10) (return 1). 11").
    (assert 100 (eval "(=>:() (exit 100) (return 2). 12").
  ).
).
