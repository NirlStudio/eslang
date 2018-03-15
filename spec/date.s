(var the-type date)
(var the-value (date now),
(include "type_")

(define "Common Behaviours" (= ()
  (define "Identity" (=> ()
    (should "a date is identified by its timestamp value" (= ()
      (assert ((date of 0) is (date of 0),
      (assert false ((date of 0) is-not (date of 0),

      (assert ((date of 1) is (date of 1),
      (assert false ((date of 1) is-not (date of 1),

      (assert ((date of -1) is (date of -1),
      (assert false ((date of -1) is-not (date of -1),

      (assert ((date of 1) is-not (date of -1),
      (assert false ((date of 1) is (date of -1),

      (assert ((date of (number invalid)) is (date of (number invalid)),
      (assert false ((date of (number invalid)) is-not (date of (number invalid)),
    ),
  ),

  (define "Equivalence" (=> ()
    (should "two date are equivalent if they have the same timestamp value" (=> ()
      (assert ((date of 0) equals (date of 0),
      (assert false ((date of 0) not-equals (date of 0),

      (assert ((date of 1) equals (date of 1),
      (assert false ((date of 1) not-equals (date of 1),

      (assert ((date of -1) equals (date of -1),
      (assert false ((date of -1) not-equals (date of -1),

      (assert ((date of 1) not-equals (date of -1),
      (assert false ((date of 1) equals (date of -1),

      (assert ((date of (number invalid)) equals (date of (number invalid)),
      (assert false ((date of (number invalid)) not-equals (date of (number invalid)),
    ),
  ),

  (define "Equivalence (operators)" (=> ()
    (should "true is equivalent with true" (=> ()
      (assert ((date of 0) == (date of 0),
      (assert false ((date of 0) != (date of 0),

      (assert ((date of 1) == (date of 1),
      (assert false ((date of 1) != (date of 1),

      (assert ((date of -1) == (date of -1),
      (assert false ((date of -1) != (date of -1),

      (assert ((date of 1) != (date of -1),
      (assert false ((date of 1) == (date of -1),

      (assert ((date of (number invalid)) == (date of (number invalid)),
      (assert false ((date of (number invalid)) != (date of (number invalid)),
    ),
  ),

  (define "Ordering" (=> ()
    (should "a date can be compared with another date by their timestamp values" (=> ()
      (assert 0 ((date of 0) compare (date of 0),
      (assert -1 ((date of 0) compare (date of 1),
      (assert 1 ((date of 0) compare (date of -1),

      (assert 1 ((date of 1) compare (date of 0),
      (assert 0 ((date of 1) compare (date of 1),
      (assert 1 ((date of 1) compare (date of -1),

      (assert -1 ((date of -1) compare (date of 0),
      (assert -1 ((date of -1) compare (date of 1),
      (assert 0 ((date of -1) compare (date of -1),
    ),
    (should "an invalid date is not comparable with other valid dates." (=> ()
      (assert 0 ((date of (number invalid)) compare (date of (number invalid))),
      (assert null ((date of (number invalid)) compare (date of 0)),
      (assert null ((date of (number invalid)) compare (date of 1)),
      (assert null ((date of (number invalid)) compare (date of -1)),
    ),
  ),

  (define "Emptiness" (=> ()
    (should "a date with a 0 timestamp is defined as empty." (=> ()
      (assert ((date empty) is (date of 0),
      (assert ((date of 0) is-empty),
      (assert false ((date of 0) not-empty),
      (assert false ((date of 1) is-empty),
      (assert ((date of 1)  not-empty),
    (should "an invalid date is defined as empty." (=> ()
      (assert ((date of (number invalid)) is-empty),
      (assert false ((date of (number invalid)) not-empty),
  ),

  (define "Encoding" (=> ()
    (should "a valid date is encoded to itself." (=> ()
      (assert (date of 0) ((date of 0) to-code),
      (assert (date of -1) ((date of -1) to-code),
      (assert (date of 1) ((date of 1) to-code),
      (assert (date of (number invalid)) ((date of (number invalid)) to-code),
    ),
  ),

  (define "Representation" (=> ()
    (should "A date is represented as an expression." (=> ()
      (assert "(date of 0)" ((date of 0) to-string),
      (assert "(date of 1)" ((date of 1) to-string),
      (assert "(date of -1)" ((date of -1) to-string),
      (assert "(date of (number invalid))" ((date of (number invalid)) to-string),
    ),
  ),
).

(define "Value Conversion" (= ()
  (should "(date parse str) returns an invalid date." (= ()
    (assert (date of (number invalid)) (date parse),
    (assert (date of (number invalid)) (date parse ""),
    (assert (date of (number invalid)) (date parse "XXX"),
    (assert ((date parse "2017-3-3") is-valid),
    (assert ((date parse "2017/3/3") is-valid),
    (assert ((date parse "2017-3-3 5:10:10") is-valid),
    (assert ((date parse "2017/3/3 5:10:10") is-valid),
  ),
  (should "(date of) returns (date now)" (= ()
    (assert ((date of) <= (date now)),
  ),
  (should "(date of str) returns the parsed result" (= ()
    (assert (date of (number invalid)) (date of ""),
    (assert (date of (number invalid)) (date of "XXX"),
    (assert ((date of "2017-3-3") is-valid),
    (assert ((date of "2017/3/3 5:10:10") is-valid),
  ),
  (should "(date of timestamp) returns the date of the timestamp." (= ()
    (assert 0 ((date of 0) timestamp),
    (assert 1 ((date of 1) timestamp),
    (assert -1 ((date of -1) timestamp),
    (assert (number invalid) ((date of (number invalid)) timestamp),
  ),
  (should "(date of year month ...) returns a date by fields." (= ()
    (assert 1900 (((date of 1900 1 2 3 4 5 6) the-date) 0),
    (assert 1 (((date of 1900 1 2 3 4 5 6) the-date) 1),
    (assert 2 (((date of 1900 1 2 3 4 5 6) the-date) 2),
    (assert 3 (((date of 1900 1 2 3 4 5 6) the-time) 0),
    (assert 4 (((date of 1900 1 2 3 4 5 6) the-time) 1),
    (assert 5 (((date of 1900 1 2 3 4 5 6) the-time) 2),
    (assert 6 (((date of 1900 1 2 3 4 5 6) the-time) 3),
  ),
  (should "(date of-utc year month ...) returns a date by fields with utc values." (= ()
    (assert (((date of-utc 1900 1) is-valid),
    (assert (((date of-utc 1900 1 2) is-valid),
    (assert (((date of-utc 1900 1 2 3) is-valid),
    (assert (((date of-utc 1900 1 2 3 4) is-valid),
    (assert (((date of-utc 1900 1 2 3 4 5) is-valid),
    (assert (((date of-utc 1900 1 2 3 4 5 6) is-valid),

    (assert 1900 (((date of-utc 1900 1 2 3 4 5 6) the-date "utc") 0),
    (assert 1 (((date of-utc 1900 1 2 3 4 5 6) the-date "utc") 1),
    (assert 2 (((date of-utc 1900 1 2 3 4 5 6) the-date "utc") 2),
    (assert 3 (((date of-utc 1900 1 2 3 4 5 6) the-time "utc") 0),
    (assert 4 (((date of-utc 1900 1 2 3 4 5 6) the-time "utc") 1),
    (assert 5 (((date of-utc 1900 1 2 3 4 5 6) the-time "utc") 2),
    (assert 6 (((date of-utc 1900 1 2 3 4 5 6) the-time "utc") 3),
  ),
  (should "(date now) returns current time." (= ()
    (assert ((date now) is-valid),
    (assert ((date now) <= (date now)),
    (assert ((date now) > (date of 2017 1 1)),
  ),
  (should "(date timestamp) returns current timestamp." (= ()
    (assert ((date timestamp) is-a number),
    (assert ((date timestamp) <= ((date now) timestamp),
    (assert ((date timestamp) > ((date of 2017 1 1) timestamp),
  ),
).

(define "Validating Operations" (= ()
  (define "is-valid" (= ()
    (should "check if the date object has a valid value." (= ()
      (assert ((date of 0) is-valid),
      (assert false ((date of 0) is-not-valid),

      (assert ((date of -1) is-valid),
      (assert false ((date of -1) is-not-valid),

      (assert ((date of 1) is-valid),
      (assert false ((date of 1) is-not-valid),

      (assert false ((date of (number invalid)) is-valid),
      (assert true ((date of (number invalid)) is-not-valid),
    ),
  ),
).

(define "Retrieve Date fields" (= ()
  (define "date fields" (= ()
    (should "(a-date the-date) returns year, month, day in month and day in week." (= ()
      (assert 2017 (((date of 2017 6 29 1 1 1) the-date) 0),
      (assert 6 (((date of 2017 6 29 1 1 1) the-date) 1),
      (assert 29 (((date of 2017 6 29 1 1 1) the-date) 2),
      (assert 4 (((date of 2017 6 29 1 1 1) the-date) 3),
    ),
    (should "(a-date date as-utc) returns year, month, day in month and day in week in UTC." (= ()
      (assert 2017 (((date of-utc 2017 6 29 1 1 1) the-date "utc") 0),
      (assert 6 (((date of-utc 2017 6 29 1 1 1) the-date "utc") 1),
      (assert 29 (((date of-utc 2017 6 29 1 1 1) the-date "utc") 2),
      (assert 4 (((date of-utc 2017 6 29 1 1 1) the-date "utc") 3),
    ),
  ),
  (define "time fields" (= ()
    (should "(a-date the-time) returns hours, minutes, seconds and milliseconds at the date." (= ()
      (assert 1 (((date of 2017 6 29 1 2 3 4) the-time) 0),
      (assert 2 (((date of 2017 6 29 1 2 3 4) the-time) 1),
      (assert 3 (((date of 2017 6 29 1 2 3 4) the-time) 2),
      (assert 4 (((date of 2017 6 29 1 2 3 4) the-time) 3),
    ),
    (should "(a-date time as-utc) returns hours, minutes, seconds and milliseconds at the date in UTC." (= ()
      (assert 1 (((date of-utc 2017 6 29 1 2 3 4) the-time "utc") 0),
      (assert 2 (((date of-utc 2017 6 29 1 2 3 4) the-time "utc") 1),
      (assert 3 (((date of-utc 2017 6 29 1 2 3 4) the-time "utc") 2),
      (assert 4 (((date of-utc 2017 6 29 1 2 3 4) the-time "utc") 3),
    ),
  ),
  (define "date & time" (= ()
    (should "(a-date all-fields) returns hours, minutes, seconds and milliseconds at the date." (= ()
      (let (d t) ((date of 2017 6 29 1 2 3 4) all-fields),
      (assert 2017 (d 0),
      (assert 6 (d 1),
      (assert 29 (d 2),
      (assert 4 (d 3),
      (assert 1 (t 0),
      (assert 2 (t 1),
      (assert 3 (t 2),
      (assert 4 (t 3),
    ),
    (should "(a-date all-fields as-utc) returns hours, minutes, seconds and milliseconds at the date in UTC." (= ()
      (let (d t) ((date of-utc 2017 6 29 1 2 3 4) all-fields "utc"),
      (assert 2017 (d 0),
      (assert 6 (d 1),
      (assert 29 (d 2),
      (assert 4 (d 3),
      (assert 1 (t 0),
      (assert 2 (t 1),
      (assert 3 (t 2),
      (assert 4 (t 3),
    ),
  ),
  (define "timestamp value" (= ()
    (should "(a-date timestamp) returns the timestamp value" (= ()
      (assert 0 ((date of 0) timestamp),
      (assert -1 ((date of -1) timestamp),
      (assert 1 ((date of 1) timestamp),
    ),
    (should "(a-date timestamp) returns (number invalid) for an invalid date." (= ()
      (assert (number invalid) ((date of (number invalid)) timestamp),
      (assert (number invalid) ((date of "") timestamp),
      (assert (number invalid) ((date of "AAA") timestamp),
    ),
  ),
  (define "timezone info" (= ()
    (should "(date timezone) returns the timezone info as an object" (= ()
      # (assert (((date timezone) name) is-a string),
      (assert (((date timezone) offset) is-a number)
    ),
    (should "(a-date timestamp) returns (number invalid) for an invalid date." (= ()
      (assert (number invalid) ((date of (number invalid)) timestamp),
      (assert (number invalid) ((date of "") timestamp),
      (assert (number invalid) ((date of "AAA") timestamp),
    ),
  ),
).

(define "Date Operations" (= ()
  (define "+: add a time span" (= ()
    (should "(a-date + x-milliseconds) returns a new date after x-milliseconds." (= ()
      (assert (date of 0) ((date of 0) + 0),
      (assert (date of 1) ((date of 0) + 1),
      (assert (date of -1) ((date of 0) + -1),

      (assert (date of (number invalid)) ((date of (number invalid)) + 0),
      (assert (date of (number invalid)) ((date of (number invalid)) + 1),
      (assert (date of (number invalid)) ((date of (number invalid)) + -1),

      (assert (date of 0) ((date of 0) + true),
      (assert (date of 0) ((date of 0) + ""),
      (assert (date of 0) ((date of 0) + (@)),
    ),
  ),
  (define "-: substract a time span" (= ()
    (should "(a-date - x-milliseconds) returns a new date before x-milliseconds." (= ()
      (assert (date of 0) ((date of 0) - 0),
      (assert (date of -1) ((date of 0) - 1),
      (assert (date of 1) ((date of 0) - -1),

      (assert (date of (number invalid)) ((date of (number invalid)) - 0),
      (assert (date of (number invalid)) ((date of (number invalid)) - 1),
      (assert (date of (number invalid)) ((date of (number invalid)) - -1),

      (assert (date of 0) ((date of 0) - true),
      (assert (date of 0) ((date of 0) - ""),
      (assert (date of 0) ((date of 0) - (@)),
    ),
  ),
  (define "-: substract another date" (= ()
    (should "(a-date - b-date) returns the timestamp difference between two dates." (= ()
      (assert 0 ((date of 0) - (date of 0),
      (assert -1 ((date of 0) - (date of 1),
      (assert 1 ((date of 0) - (date of -1),

      (assert (number invalid) ((date of (number invalid)) - (date of 0),
      (assert (number invalid) ((date of (number invalid)) - (date of 1),
      (assert (number invalid) ((date of (number invalid)) - (date of -1),

      (assert (date of 0) ((date of 0) - true),
      (assert (date of 0) ((date of 0) - ""),
      (assert (date of 0) ((date of 0) - (@)),
    ),
  ),
).

(define "comparison Operators" (= ()
  (define "Later Than: >" (= ()
    (should "(a-date > b-date) test if a-date is later than b-date." (= ()
      (assert false ((date of 0) > (date of 0),
      (assert false ((date of 0) > (date of 1),
      (assert ((date of 0) > (date of -1),

      (assert null ((date of (number invalid)) > (date of 0),
      (assert null ((date of (number invalid)) > (date of 1),
      (assert null ((date of (number invalid)) > (date of -1),

      (assert null ((date of 0) > (date of (number invalid)),
      (assert null ((date of 1) > (date of (number invalid)),
      (assert null ((date of 0) > (date of (number invalid)),

      (assert null ((date of 0) > true),
      (assert null ((date of 1) > ""),
      (assert null ((date of 0) > (@)),
  ),
  (define "Later or Equal: >=" (= ()
    (should "(a-date >= b-date) test if a-date is later than or equal with b-date." (= ()
      (assert ((date of 0) >= (date of 0),
      (assert false ((date of 0) >= (date of 1),
      (assert ((date of 0) >= (date of -1),

      (assert null ((date of (number invalid)) >= (date of 0),
      (assert null ((date of (number invalid)) >= (date of 1),
      (assert null ((date of (number invalid)) >= (date of -1),

      (assert null ((date of 0) >= (date of (number invalid)),
      (assert null ((date of 1) >= (date of (number invalid)),
      (assert null ((date of 0) >= (date of (number invalid)),

      (assert null ((date of 0) >= true),
      (assert null ((date of 1) >= ""),
      (assert null ((date of 0) >= (@)),
  ),
  (define "Earlier Than: <" (= ()
    (should "(a-date < b-date) test if a-date is earlier than b-date." (= ()
      (assert false ((date of 0) < (date of 0),
      (assert ((date of 0) < (date of 1),
      (assert false ((date of 0) < (date of -1),

      (assert null ((date of (number invalid)) < (date of 0),
      (assert null ((date of (number invalid)) < (date of 1),
      (assert null ((date of (number invalid)) < (date of -1),

      (assert null ((date of 0) < (date of (number invalid)),
      (assert null ((date of 1) < (date of (number invalid)),
      (assert null ((date of 0) < (date of (number invalid)),

      (assert null ((date of 0) < true),
      (assert null ((date of 1) < ""),
      (assert null ((date of 0) < (@)),
  ),
  (define "Earlier or Equal: <=" (= ()
    (should "(a-date <= b-date) test if a-date is earlier than or equal with b-date." (= ()
      (assert ((date of 0) <= (date of 0),
      (assert ((date of 0) <= (date of 1),
      (assert false ((date of 0) <= (date of -1),

      (assert null ((date of (number invalid)) <= (date of 0),
      (assert null ((date of (number invalid)) <= (date of 1),
      (assert null ((date of (number invalid)) <= (date of -1),

      (assert null ((date of 0) <= (date of (number invalid)),
      (assert null ((date of 1) <= (date of (number invalid)),
      (assert null ((date of 0) <= (date of (number invalid)),

      (assert null ((date of 0) <= true),
      (assert null ((date of 1) <= ""),
      (assert null ((date of 0) <= (@)),
  ),
).
