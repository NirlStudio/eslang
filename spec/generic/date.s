(var * (load "share/type" (@ the-type: date).

(define "Date Common Behaviours" (=> ()
  (define "Identity" (=> ()
    (should "(date of 0) is (date of -0)" (= ()
      (assert ((date of 0) is (date of -0).
      (assert false ((date of 0) is-not (date of -0).

      (assert ((date of -0) is (date of 0).
      (assert false ((date of -0) is-not (date of 0).
    ).
  ).

  (define "Equivalence" (=> ()
    (should "(date of 0) equals (date of -0)" (= ()
      (assert ((date of 0) equals (date of -0).
      (assert false ((date of 0) not-equals (date of -0).

      (assert ((date of -0) equals (date of 0).
      (assert false ((date of -0) not-equals (date of 0).
    ).
    (should "The max, min and infinite timestamp values equal the invalid value." (= ()
      (assert ((date invalid) equals (date of (number min).
      (assert false ((date invalid) not-equals (date of (number min).

      (assert ((date invalid) equals (date of (number max).
      (assert false ((date invalid) not-equals (date of (number max).

      (assert ((date invalid) equals (date of (number infinite).
      (assert false ((date invalid) not-equals (date of (number infinite).

      (assert ((date invalid) equals (date of (number -infinite).
      (assert false ((date invalid) not-equals (date of (number -infinite).
    ).
  ).

  (define "Ordering" (=> ()
    (should "a date can be compared with another date by their timestamp values" (=> ()
      (for pair
          in (@
            (@ 1 0)
            (@ 0 -1)
            (@ 100 1)
            (@ -1 -100)
            (@ (number max-bits) 100)
            (@ -100 (number min-bits).
          ).
        (assert 1 ((date of (pair 0)) compare (date of (pair 1).
        (assert -1 ((date of (pair 1)) compare (date of (pair 0).
      ).
    ).
    (should "an invalid date is not comparable with other valid dates." (=> ()
      (for value
          in (@
            0 1 -1 100 -100
            (number max-bits)
            (number min-bits).
          ).
        (assert null ((date invalid) compare (date of value).
        (assert null ((date of value) compare (date of (number invalid).
      ).
  ).

  (define "Emptiness" (=> ()
    (should "a date with a 0 timestamp is defined as empty." (=> ()
      (assert ((date empty) is (date of 0).
      (assert ((date of 0) is (date empty).

      (assert ((date empty) is (date of -0).
      (assert ((date of -0) is (date empty).

      (assert ((date of 0) is-empty).
      (assert false ((date of 0) not-empty).

      (assert ((date of -0) is-empty).
      (assert false ((date of -0) not-empty).
    ).
    (should "an invalid date is defined as empty." (=> ()
      (assert ((date invalid) is-empty).
      (assert false ((date invalid) not-empty).
    ).
  ).

  (define "Encoding" (=> ()
    (should "a valid date is encoded to itself." (=> ()
      (for value
          in (the-values concat (date empty).
        (assert value (value to-code).
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "a valid empty date is represented as (date empty)." (=> ()
      (assert "(date empty)" ((date of 0) to-string).
      (assert "(date empty)" ((date of -0) to-string).
    ).
    (should "a common date value is represented as (date of timestamp)." (=> ()
      (assert "(date of 1)" ((date of 1) to-string).
      (assert "(date of -1)" ((date of -1) to-string).
      (assert "(date of 100)" ((date of 100) to-string).
      (assert "(date of -100)" ((date of -100) to-string).
    ).
    (should "a invalid date value is represented as (date invalid)." (=> ()
      (assert "(date invalid)" ((date invalid) to-string).
    ).
  ).
).

(define "Constant and Special Values" (= ()
  (define "(date empty)" (= ()
    (should "it may be generated from timestamp value of either 0 or -0." (= ()
      (assert (date empty) (date of 0).
      (assert (date empty) (date of -0).
    ).
  ).
  (define "(date invalid)" (= ()
    (should "its timestamp value is (number invalid)." (= ()
      (assert (number invalid) ((date invalid) timestamp)，
    ).
    (should "The max, min, invalid and infinite number values are invalid timestamp values." (= ()
      (assert (date invalid) (date of (number min).
      (assert (date invalid) (date of (number max).
      (assert (date invalid) (date of (number invalid).
      (assert (date invalid) (date of (number infinite).
      (assert (date invalid) (date of (number -infinite).
    ).
  ).
).

(var blank-strings (@
  ""
  " "
  "  "
  "\t"
  "\r"
  "\n"
).
(var rfc2822-strings (@
  "Mon, 25 Dec 1995 13:30:00 GMT"
  "Mon, 25 Dec 1995 13:30:00 +0430"
).
(var iso8601-strings (@
  "1997"
  "1997-07"
  "1997-07-16"
  "1997-07-16T19:20Z"
  "1997-07-16T19:20:30Z"
  "1997-07-16T19:20:30.45Z"
  "1997-07-16T19:20+01:00"
  "1997-07-16T19:20:30+01:00"
  "1997-07-16T19:20:30.45+01:00"
).

(define "(date parse ...)" (=> ()
  (should "(date parse) returns (date invalid)." (= ()
    (assert (date invalid) (date parse).
  ).
  (should "(date parse a-blank-string) returns (date invalid)." (=> ()
    (for str in blank-strings
      (assert (date invalid) (date parse str).
    ).
  ).
  (should "valid date(time) strings may follow RFC-2822." (=> ()
    (for str in rfc2822-strings
      (assert ((date parse str) is-valid).
    ).
  ).
  (should "valid date(time) strings may follow a simplified ISO 8601." (=> ()
    (for str in iso8601-strings
      (assert ((date parse str) is-valid).
    ).
  ).
  (should "(date parse non-string-value) returns (date invalid)." (= ()
    (var values (@
      null type
      bool false true
      string
      number 0 -1 1
      date (date empty)
      range (range empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (operator empty)
      lambda (lambda empty)
      function (function empty)
      array (array empty)
      object (object empty)
      class (class empty)
    ).
    (for value in values
      (assert (date invalid) (date parse value).
    ).
  ).
).

(var fields-set (@
  (@ 2016 1)
  (@ 2016 1 2)
  (@ 2016 1 2 3)
  (@ 2016 1 2 3 4)
  (@ 2016 1 2 3 4 5)
  (@ 2016 1 2 3 4 5 6)
).

(define "(date of ...)" (=> ()
  (should "(date of) returns (date empty)." (= ()
    (assert (date empty) (date of).
  ).
  (should "(date of a-date) return a-date." (=> ()
    (for value
      in ((the-values concat (date empty) (date invalid).
      (assert value (date of value).
  ).
  (should "(date of str) works like (date parse str)." (=> ()
    (for str in (blank-strings + rfc2822-strings iso8601-strings)
      (assert (date parse str) (date of str).
    )
  ).
  (should "(date of number-value) uses the number-value as a unix timestamp." (= ()
    (assert 0 ((date of 0) timestamp).
    (assert 1 ((date of 1) timestamp).
    (assert -1 ((date of -1) timestamp).
    (assert (number invalid) ((date of (number invalid)) timestamp).
  ).
  (should "(date of year month ...) returns a date by fields." (=> ()
    (for args in fields-set
      (var fields (($(date "of") apply date args) all-fields).
      (for (v i) in fields
        (assert ((args : i) ?? ((i == 2) ? 1 0)) v).
      ).
    ).
  ).
).

(define "(date of-utc ...)" (=> ()
  (should "(date of-utc) returns (date empty)" (= ()
    (assert (date empty) (date of-utc).
  ).
  (should "(date of-utc year) works like (date of-utc year 1)" (=> ()
    (assert (date of-utc 1900 1) (date of-utc 1900).
    (assert (date of-utc 2016 1) (date of-utc 2016).
  ).
  (should "(date of-utc year month ...) returns a date by fields with utc values." (=> ()
    (for args in fields-set
      (var fields (($(date "of-utc") apply date args) all-fields "utc").
      (for (v i) in fields
        (assert ((args : i) ?? ((i == 2) ? 1 0)) v).
      ).
    ).
  ).
).

(define "(date now)" (= ()
  (should "(date now) returns a date object representing current time." (= ()
    (assert ((date now) is-a date).
    (assert ((date now) is-valid).
    (assert ((date now) <= (date now)).
    (assert ((date now) > (date of 2018 8 16)).
  ).
).

(define "(date timestamp)" (= ()
  (should "(date timestamp) returns current time's timestamp." (= ()
    (assert ((date timestamp) is-a number).
    (assert ((date timestamp) is-valid).
    (assert ((date timestamp) not-empty).
    (assert ((date timestamp) <= ((date now) timestamp).
    (assert ((date timestamp) > ((date of 2018 8 16) timestamp).
  ).
).

(define "(date timezone)" (= ()
  (var (name offset) (date timezone).
  (should ("((date timezone) name) is " + (name ?? "unknown")) (=> ()
    (assert (name is-a string).
    (assert (name not-empty).
  ).
  (should ("((date timezone) offset) is " + offset) (=> ()
    (assert (offset is-a number).
    (assert (offset is-valid).
  ).
).

(define "(a-date is-valid)" (=> ()
  (should "((date invalid) is-valid) return false." (= ()
    (assert false ((date invalid) is-valid).
  ).
  (should "(any-other-value is-valid) return true." (=> ()
    (for value
      in ((the-values remove (date invalid)) append (date empty).
      (assert (value is-valid).
  ).
).

(define "(a-date is-invalid)" (=> ()
  (should "((date invalid) is-invalid) return true." (= ()
    (assert ((date invalid) is-invalid).
  ).
  (should "(any-other-value is-invalid) return false." (=> ()
    (for value
      in ((the-values remove (date invalid)) append (date empty).
      (assert false (value is-invalid).
  ).
).

(define "(a-date date-fields ...)" (= ()
  (should "((date invalid) date-fields) returns null." (= ()
    (assert null ((date invalid) date-fields).
    (assert null ((date invalid) date-fields "utc").
  ).
  (should "(a-date date-fields) returns year, month and day in month." (= ()
    (var fields ((date of 2017 6 29 1 1 1) date-fields).

    (assert (fields is-a array).
    (assert 3 (fields length).

    (assert 2017 (fields 0).
    (assert 6 (fields 1).
    (assert 29 (fields 2).
  ).
  (should "(a-date date-fields as-utc) returns year, month and day in month in UTC." (= ()
    (var fields ((date of-utc 2017 6 29 1 1 1) date-fields "utc").

    (assert (fields is-a array).
    (assert 3 (fields length).

    (assert 2017 (fields 0).
    (assert 6 (fields 1).
    (assert 29 (fields 2).
  ).
).

(define "(a-date time-fields ...)" (= ()
  (should "((date invalid) time-fields) returns null." (= ()
    (assert null ((date invalid) time-fields).
    (assert null ((date invalid) time-fields "utc").
  ).
  (should "(a-date time-fields) returns hours, minutes, seconds and milliseconds at the date." (= ()
    (var fields ((date of 2017 6 29 1 2 3 4) time-fields).

    (assert (fields is-a array).
    (assert 4 (fields length).

    (assert 1 (fields 0).
    (assert 2 (fields 1).
    (assert 3 (fields 2).
    (assert 4 (fields 3).
  ).
  (should "(a-date time-fields as-utc) returns hours, minutes, seconds and milliseconds at the date in UTC." (= ()
    (var fields ((date of-utc 2017 6 29 1 2 3 4) time-fields "utc").

    (assert (fields is-a array).
    (assert 4 (fields length).

    (assert 1 (fields 0).
    (assert 2 (fields 1).
    (assert 3 (fields 2).
    (assert 4 (fields 3).
  ).
).

(define "(a-date all-fields ...)" (= ()
  (should "((date invalid) all-fields) returns null." (= ()
    (assert null ((date invalid) all-fields).
    (assert null ((date invalid) all-fields "utc").
  ).
  (should "(a-date all-fields) returns hours, minutes, seconds and milliseconds at the date." (= ()
    (var fields ((date of 2017 6 29 1 2 3 4) all-fields).

    (assert (fields is-a array).
    (assert 7 (fields length).

    (assert 2017 (fields 0).
    (assert 6 (fields 1).
    (assert 29 (fields 2).
    (assert 1 (fields 3).
    (assert 2 (fields 4).
    (assert 3 (fields 5).
    (assert 4 (fields 6).
  ).
  (should "(a-date all-fields as-utc) returns hours, minutes, seconds and milliseconds at the date in UTC." (= ()
    (var fields ((date of-utc 2017 6 29 1 2 3 4) all-fields "utc").

    (assert (fields is-a array).
    (assert 7 (fields length).

    (assert 2017 (fields 0).
    (assert 6 (fields 1).
    (assert 29 (fields 2).
    (assert 1 (fields 3).
    (assert 2 (fields 4).
    (assert 3 (fields 5).
    (assert 4 (fields 6).
  ).
).

(define "(a-date week-day ...)" (= ()
  (should "((date invalid) week-day) returns null." (= ()
    (assert null ((date invalid) week-day).
    (assert null ((date invalid) week-day "utc").
  ).
  (should "(a-date week-day) returns the day in week for a date." (= ()
    (assert 4 ((date of 2017 6 29 1 1 1) week-day).
  ).
  (should "(a-date week-day as-utc) returns the day in week in UTC for a date." (= ()
    (assert 4 ((date of-utc 2017 6 29 1 1 1) week-day "utc").
  ).
).

(define "(a-date timestamp)" (= ()
  (should "(a-date timestamp) returns the timestamp value" (= ()
    (assert 0 ((date of 0) timestamp).
    (assert -1 ((date of -1) timestamp).
    (assert 1 ((date of 1) timestamp).
    (assert (number max-bits) ((date of (number max-bits)) timestamp).
    (assert (number min-bits) ((date of (number min-bits)) timestamp).
  ).
  (should "((date invalid) timestamp) returns (number invalid)." (= ()
    (assert (number invalid) ((date invalid) timestamp).
  ).
).

(define "(a-date + ...)" (= ()
  (should "(a-date + x-milliseconds) returns a new date after x milliseconds." (= ()
    (assert (date of 0) ((date of 0) + 0).
    (assert (date of -1) ((date of -1) + 0).
    (assert (date of 1) ((date of 1) + 0).

    (assert (date of 1) ((date of 0) + 1).
    (assert (date of 0) ((date of -1) + 1).
    (assert (date of 2) ((date of 1) + 1).

    (assert (date of -1) ((date of 0) + -1).
    (assert (date of -2) ((date of -1) + -1).
    (assert (date of 0) ((date of 1) + -1).
  ).
  (should "((date invalid) + x-milliseconds) returns (date invalid)." (= ()
    (assert (date invalid) ((date invalid) + 0).
    (assert (date invalid) ((date invalid) + 1).
    (assert (date invalid) ((date invalid) + -1).
  ).
  (should "(a-date + not-a-number) returns the original date." (= ()
    (var non-num-values (@
      null type
      bool true false
      string "" "A"
      date (date empty)
      range (range empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (operator empty)
      lambda (lambda empty)
      function (function empty)
      array (@)
      object (@:)
      class (class empty)
    ).
    (for nan in non-num-values
      (assert (date of 0) ((date of 0) + nan).
      (assert (date of 1) ((date of 1) + nan).
      (assert (date of -1) ((date of -1) + nan).
    ).
  ).
).

(define "(a-date - ...)" (= ()
  (should "(a-date - x-milliseconds) returns a new date before x-milliseconds." (= ()
    (assert (date of 0) ((date of 0) - 0).
    (assert (date of -1) ((date of 0) - 1).
    (assert (date of 1) ((date of 0) - -1).

    (assert (date of 1) ((date of 1) - 0).
    (assert (date of 0) ((date of 1) - 1).
    (assert (date of 2) ((date of 1) - -1).

    (assert (date of -1) ((date of -1) - 0).
    (assert (date of -2) ((date of -1) - 1).
    (assert (date of 0) ((date of -1) - -1).
  ).
  (should "(a-date - b-date) returns the timestamp difference between two dates." (= ()
    (assert 0 ((date of 0) - (date of 0).
    (assert -1 ((date of 0) - (date of 1).
    (assert 1 ((date of 0) - (date of -1).

    (assert 1 ((date of 1) - (date of 0).
    (assert 0 ((date of 1) - (date of 1).
    (assert 2 ((date of 1) - (date of -1).

    (assert -1 ((date of -1) - (date of 0).
    (assert -2 ((date of -1) - (date of 1).
    (assert 0 ((date of -1) - (date of -1).
  ).
  (should "((date invalid) - x-milliseconds) returns (date invalid)." (= ()
    (assert (date invalid) ((date invalid) - 0).
    (assert (date invalid) ((date invalid) - 1).
    (assert (date invalid) ((date invalid) - -1).
  ).
  (should "(a-date - not-a-number-or-date) returns the original date." (= ()
    (var non-num-values (@
      null type
      bool true false
      string "" "A"
      date
      range (range empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (operator empty)
      lambda (lambda empty)
      function (function empty)
      array (@)
      object (@:)
      class (class empty)
    ).
    (for nan in non-num-values
      (assert (date of 0) ((date of 0) - nan).
      (assert (date of 1) ((date of 1) - nan).
      (assert (date of -1) ((date of -1) - nan).
    ).
  ).
).

(var non-date-values (@
  null type
  bool false true
  string (string empty)
  number 0 -1 1
  range (range empty)
  symbol (symbol empty)
  tuple (tuple empty)
  operator (operator empty)
  lambda (lambda empty)
  function (function empty)
  array (array empty)
  object (object empty)
  class (class empty)
).

(define "(a-date compare b-date)" (=> ()
  (should "(a-date compare b-date) returns 1 if a-date is later than b-date." (= ()
    (assert 1 ((date of 1) compare (date of 0).
    (assert 1 ((date of 0) compare (date of -1).
    (assert 1 ((date of 1) compare (date of -1).
  ).
  (should "(a-date compare b-date) returns 0 if a-date is identical with b-date." (= ()
    (assert 0 ((date of 0) compare (date of 0).
    (assert 0 ((date of -0) compare (date of 0).
    (assert 0 ((date of 0) compare (date of -0).
    (assert 0 ((date of -0) compare (date of -0).

    (assert 0 ((date of 1) compare (date of 1).
    (assert 0 ((date of -1) compare (date of -1).
  ).
  (should "((date invalid) compare (date invalid)) returns 0." (= ()
    (assert 0 ((date invalid) compare (date invalid).
  ).
  (should "(a-date compare b-date) returns -1 if a-date is earlier than b-date." (= ()
    (assert -1 ((date of 0) compare (date of 1).
    (assert -1 ((date of -1) compare (date of 0).
    (assert -1 ((date of -1) compare (date of 1).
  ).
  (should "(a-date compare b-date) returns null if a-date is invalid and b-date is valid." (= ()
    (assert null ((date invalid) compare (date of 1).
    (assert null ((date invalid) compare (date of 0).
    (assert null ((date invalid) compare (date of -1).
  ).
  (should "(a-date compare b-date) returns null if a-date is valid and b-date is invalid." (= ()
    (assert null ((date of 0) compare (date invalid).
    (assert null ((date of 1) compare (date invalid).
    (assert null ((date of -1) compare (date invalid).
  ).
  (should "(a-date compare b-date) returns null if b-date is not a date value." (=> ()
    (for value in non-date-values
      (assert null ((date of 0) compare value)
      (assert null ((date invalid) compare value)
    ).
  ).
).

(define "(a-date > b-date)" (= ()
  (should "(a-date > b-date) returns true if a-date is later than b-date." (= ()
    (assert ((date of 1) > (date of 0).
    (assert ((date of 0) > (date of -1).
    (assert ((date of 1) > (date of -1).
  ).
  (should "(a-date > b-date) returns false if a-date is identical with b-date." (= ()
    (assert false ((date of 0) > (date of 0).
    (assert false ((date of -0) > (date of 0).
    (assert false ((date of 0) > (date of -0).
    (assert false ((date of -0) > (date of -0).

    (assert false ((date of 1) > (date of 1).
    (assert false ((date of -1) > (date of -1).
  ).
  (should "((date invalid) > (date invalid)) returns false." (= ()
    (assert false ((date invalid) > (date invalid).
  ).
  (should "(a-date > b-date) returns false if a-date is earlier than b-date." (= ()
    (assert false ((date of 0) > (date of 1).
    (assert false ((date of -1) > (date of 0).
    (assert false ((date of -1) > (date of 1).
  ).
  (should "(a-date > b-date) returns null if a-date is invalid and b-date is valid." (= ()
    (assert null ((date invalid) > (date of 1).
    (assert null ((date invalid) > (date of 0).
    (assert null ((date invalid) > (date of -1).
  ).
  (should "(a-date > b-date) returns null if a-date is valid and b-date is invalid." (= ()
    (assert null ((date of 0) > (date invalid).
    (assert null ((date of 1) > (date invalid).
    (assert null ((date of -1) > (date invalid).
  ).
  (should "(a-date > b-date) returns null if b-date is not a date value." (=> ()
    (for value in non-date-values
      (assert null ((date of 0) > value)
      (assert null ((date invalid) > value)
    ).
  ).
).

(define "(a-date >= b-date)" (= ()
  (should "(a-date >= b-date) returns true if a-date is later than b-date." (= ()
    (assert ((date of 1) >= (date of 0).
    (assert ((date of 0) >= (date of -1).
    (assert ((date of 1) >= (date of -1).
  ).
  (should "(a-date >= b-date) returns true if a-date is identical with b-date." (= ()
    (assert ((date of 0) >= (date of 0).
    (assert ((date of -0) >= (date of 0).
    (assert ((date of 0) >= (date of -0).
    (assert ((date of -0) >= (date of -0).

    (assert ((date of 1) >= (date of 1).
    (assert ((date of -1) >= (date of -1).
  ).
  (should "((date invalid) >= (date invalid)) returns true." (= ()
    (assert ((date invalid) >= (date invalid).
  ).
  (should "(a-date >= b-date) returns false if a-date is earlier than b-date." (= ()
    (assert false ((date of 0) >= (date of 1).
    (assert false ((date of -1) >= (date of 0).
    (assert false ((date of -1) >= (date of 1).
  ).
  (should "(a-date >= b-date) returns null if a-date is invalid and b-date is valid." (= ()
    (assert null ((date invalid) >= (date of 1).
    (assert null ((date invalid) >= (date of 0).
    (assert null ((date invalid) >= (date of -1).
  ).
  (should "(a-date >= b-date) returns null if a-date is valid and b-date is invalid." (= ()
    (assert null ((date of 0) >= (date invalid).
    (assert null ((date of 1) >= (date invalid).
    (assert null ((date of -1) >= (date invalid).
  ).
  (should "(a-date >= b-date) returns null if b-date is not a date value." (=> ()
    (for value in non-date-values
      (assert null ((date of 0) >= value)
      (assert null ((date invalid) >= value)
    ).
  ).
).

(define "(a-date < b-date)" (= ()
  (should "(a-date < b-date) returns false if a-date is later than b-date." (= ()
    (assert false ((date of 1) < (date of 0).
    (assert false ((date of 0) < (date of -1).
    (assert false ((date of 1) < (date of -1).
  ).
  (should "(a-date <= b-date) returns false if a-date is identical with b-date." (= ()
    (assert false ((date of 0) < (date of 0).
    (assert false ((date of -0) < (date of 0).
    (assert false ((date of 0) < (date of -0).
    (assert false ((date of -0) < (date of -0).

    (assert false ((date of 1) < (date of 1).
    (assert false ((date of -1) < (date of -1).
  ).
  (should "((date invalid) < (date invalid)) returns false." (= ()
    (assert false ((date invalid) < (date invalid).
  ).
  (should "(a-date < b-date) returns true if a-date is earlier than b-date." (= ()
    (assert ((date of 0) < (date of 1).
    (assert ((date of -1) < (date of 0).
    (assert ((date of -1) < (date of 1).
  ).
  (should "(a-date < b-date) returns null if a-date is invalid and b-date is valid." (= ()
    (assert null ((date invalid) < (date of 1).
    (assert null ((date invalid) < (date of 0).
    (assert null ((date invalid) < (date of -1).
  ).
  (should "(a-date < b-date) returns null if a-date is valid and b-date is invalid." (= ()
    (assert null ((date of 0) < (date invalid).
    (assert null ((date of 1) < (date invalid).
    (assert null ((date of -1) < (date invalid).
  ).
  (should "(a-date < b-date) returns null if b-date is not a date value." (=> ()
    (for value in non-date-values
      (assert null ((date of 0) < value)
      (assert null ((date invalid) < value)
    ).
  ).
).

(define "(a-date <= b-date)" (= ()
  (should "(a-date <= b-date) returns false if a-date is later than b-date." (= ()
    (assert false ((date of 1) <= (date of 0).
    (assert false ((date of 0) <= (date of -1).
    (assert false ((date of 1) <= (date of -1).
  ).
  (should "(a-date <= b-date) returns true if a-date is identical with b-date." (= ()
    (assert ((date of 0) <= (date of 0).
    (assert ((date of -0) <= (date of 0).
    (assert ((date of 0) <= (date of -0).
    (assert ((date of -0) <= (date of -0).

    (assert ((date of 1) <= (date of 1).
    (assert ((date of -1) <= (date of -1).
  ).
  (should "((date invalid) <= (date invalid)) returns true." (= ()
    (assert ((date invalid) <= (date invalid).
  ).
  (should "(a-date <= b-date) returns true if a-date is earlier than b-date." (= ()
    (assert ((date of 0) <= (date of 1).
    (assert ((date of -1) <= (date of 0).
    (assert ((date of -1) <= (date of 1).
  ).
  (should "(a-date <= b-date) returns null if a-date is invalid and b-date is valid." (= ()
    (assert null ((date invalid) > (date of 1).
    (assert null ((date invalid) > (date of 0).
    (assert null ((date invalid) > (date of -1).
  ).
  (should "(a-date <= b-date) returns null if a-date is valid and b-date is invalid." (= ()
    (assert null ((date of 0) <= (date invalid).
    (assert null ((date of 1) <= (date invalid).
    (assert null ((date of -1) <= (date invalid).
  ).
  (should "(a-date <= b-date) returns null if b-date is not a date value." (=> ()
    (for value in non-date-values
      (assert null ((date of 0) <= value)
      (assert null ((date invalid) <= value)
    ).
  ).
).

(define "(a-date to-string format)" (= ()
  (should "(a-date to-string \"utc\") returns a readable string repesenting the date's UTC date+time." (= ()
    (assert (((date of 0) to-string "utc") is-a string).
  ).
  (should "(a-date to-string \"date\") returns a readable string representing the date in current time zone." (= ()
    (assert (((date of 0) to-string "date") is-a string).
  ).
  (should "(a-date to-string \"time\") returns a readable string repesenting the time in current time zone." (= ()
    (assert (((date of 0) to-string "time") is-a string).
  ).
  (should "(a-date to-string any-other-value) returns a representing a readable date+time string." (= ()
    (assert (((date of 0) to-string "all") is-a string).
  ).
).
