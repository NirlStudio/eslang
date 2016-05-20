(define "function form" (=()
  (should "(date )" "return current time" (= ()
    (assert (` ((date ) <= (date),
    (assert (` ((date ) <= (Date now),
    (assert (` ((Date now) <= (date ),
  ),
  (should "(date milliseconds)" "return the date by the the Unix Epoch" (= ()
    (let epoch (date 0),
    (assert 1970 (` (epoch get-utc-year),
    (assert 0 (` (epoch get-utc-month),
    (assert 1 (` (epoch get-utc-day),
    (assert 0 (` (epoch get-utc-hours),
    (assert 0 (` (epoch get-utc-minutes),
    (assert 0 (` (epoch get-utc-seconds),
  ),
  (should "(Date parse dateString)" "return the date by parsing the string" (= ()
    (let epoch (Date parse "1 January, 1970, 00:00:00 UTC"),
    (assert 1970 (` (epoch get-utc-year),
    (assert 0 (` (epoch get-utc-month),
    (assert 1 (` (epoch get-utc-day),
    (assert 0 (` (epoch get-utc-hours),
    (assert 0 (` (epoch get-utc-minutes),
    (assert 0 (` (epoch get-utc-seconds),
  ),
  (should "(Date of year month ...)" "return the date basing on fields" (= ()
    (let epoch (Date of 1972 0 1 1 2 3),
    (assert 1972 (epoch get-year),
    (assert 0 (` (epoch get-month),
    (assert 1 (` (epoch get-day),
    (assert 1 (` (epoch get-hours),
    (assert 2 (` (epoch get-minutes),
    (assert 3 (` (epoch get-seconds),
  ),
).

(define "operator form" (=()
  (should "(date )" "return current time" (= ()
    (assert (` ((date ) <= (date),
    (assert (` ((date ) <= (Date now),
    (assert (` ((Date now) <= (date ),
  ),
  (should "(date milliseconds)" "return the date by the the Unix Epoch" (= ()
    (let epoch (date 0),
    (assert 1970 (` (epoch get-utc-year),
    (assert 0 (` (epoch get-utc-month),
    (assert 1 (` (epoch get-utc-day),
    (assert 0 (` (epoch get-utc-hours),
    (assert 0 (` (epoch get-utc-minutes),
    (assert 0 (` (epoch get-utc-seconds),
  ),
  (should "(Date parse dateString)" "return the date by parsing the string" (= ()
    (let epoch (Date parse "1 January, 1970, 00:00:00 UTC"),
    (assert 1970 (` (epoch get-utc-year),
    (assert 0 (` (epoch get-utc-month),
    (assert 1 (` (epoch get-utc-day),
    (assert 0 (` (epoch get-utc-hours),
    (assert 0 (` (epoch get-utc-minutes),
    (assert 0 (` (epoch get-utc-seconds),
  ),
  (should "(Date of year month ...)" "return the date basing on fields" (= ()
    (let epoch (Date of 1972 0 1 1 2 3),
    (assert 1972 (` (epoch get-year),
    (assert 0 (` (epoch get-month),
    (assert 1 (` (epoch get-day),
    (assert 1 (` (epoch get-hours),
    (assert 2 (` (epoch get-minutes),
    (assert 3 (` (epoch get-seconds),
  ),
).

(define "Date object" (=()
  (should "(Date now)" "return current time" (= ()
    (assert (` ((Date now) <= (Date now),
  ),
  (should "(Date time)" "return the timestamp of current time" (= ()
    (assert (` ((Date time) <= ((Date now) time),
    (assert (` (((Date now) time) <= (Date time),
  ),
  (should "(Date parse )"  "return the date by parsing the string" (= ()
    (let epoch (Date parse "1 January, 1970, 00:00:00 UTC"),
    (assert 1970 (` (epoch get-utc-year),
    (assert 0 (` (epoch get-utc-month),
    (assert 1 (` (epoch get-utc-day),
    (assert 0 (` (epoch get-utc-hours),
    (assert 0 (` (epoch get-utc-minutes),
    (assert 0 (` (epoch get-utc-seconds),
  ),
  (should "(Date utc year month ...)" "return the date basing on fields with UTC values" (= ()
    (let epoch (Date utc 1972 0 1 1 2 3),
    (assert 1972 (` (epoch get-utc-year),
    (assert 0 (` (epoch get-utc-month),
    (assert 1 (` (epoch get-utc-day),
    (assert 1 (` (epoch get-utc-hours),
    (assert 2 (` (epoch get-utc-minutes),
    (assert 3 (` (epoch get-utc-seconds),
  ),
).
