($define "function form" (=()
  ($should "($date )" "return current time" (= ()
    (assert (` (<= ($date ) ($date),
    (assert (` (<= ($date ) (Date now),
    (assert (` (<= (Date now) ($date ),
  ),
  ($should "($date milliseconds)" "return the date by the the Unix Epoch" (= ()
    (let epoch ($date 0),
    (assert 1970 (` (epoch getUTCFullYear),
    (assert 0 (` (epoch getUTCMonth),
    (assert 1 (` (epoch getUTCDate),
    (assert 0 (` (epoch getUTCHours),
    (assert 0 (` (epoch getUTCMinutes),
    (assert 0 (` (epoch getUTCSeconds),
  ),
  ($should "($date dateString)" "return the date by parsing the string" (= ()
    (let epoch ($date "1 January, 1970, 00:00:00 UTC"),
    (assert 1970 (` (epoch getUTCFullYear),
    (assert 0 (` (epoch getUTCMonth),
    (assert 1 (` (epoch getUTCDate),
    (assert 0 (` (epoch getUTCHours),
    (assert 0 (` (epoch getUTCMinutes),
    (assert 0 (` (epoch getUTCSeconds),
  ),
  ($should "($date year month ...)" "return the date basing on fields" (= ()
    (let epoch ($date 1972 0 1 1 2 3),
    (assert 1972 (epoch getFullYear),
    (assert 0 (` (epoch getMonth),
    (assert 1 (` (epoch getDate),
    (assert 1 (` (epoch getHours),
    (assert 2 (` (epoch getMinutes),
    (assert 3 (` (epoch getSeconds),
  ),
).

($define "operator form" (=()
  ($should "(date )" "return current time" (= ()
    (assert (` (<= (date ) (date),
    (assert (` (<= (date ) (Date now),
    (assert (` (<= (Date now) (date ),
  ),
  ($should "(date milliseconds)" "return the date by the the Unix Epoch" (= ()
    (let epoch (date 0),
    (assert 1970 (` (epoch getUTCFullYear),
    (assert 0 (` (epoch getUTCMonth),
    (assert 1 (` (epoch getUTCDate),
    (assert 0 (` (epoch getUTCHours),
    (assert 0 (` (epoch getUTCMinutes),
    (assert 0 (` (epoch getUTCSeconds),
  ),
  ($should "(date dateString)" "return the date by parsing the string" (= ()
    (let epoch (date "1 January, 1970, 00:00:00 UTC"),
    (assert 1970 (` (epoch getUTCFullYear),
    (assert 0 (` (epoch getUTCMonth),
    (assert 1 (` (epoch getUTCDate),
    (assert 0 (` (epoch getUTCHours),
    (assert 0 (` (epoch getUTCMinutes),
    (assert 0 (` (epoch getUTCSeconds),
  ),
  ($should "(date year month ...)" "return the date basing on fields" (= ()
    (let epoch (date 1972 0 1 1 2 3),
    (assert 1972 (` (epoch getFullYear),
    (assert 0 (` (epoch getMonth),
    (assert 1 (` (epoch getDate),
    (assert 1 (` (epoch getHours),
    (assert 2 (` (epoch getMinutes),
    (assert 3 (` (epoch getSeconds),
  ),
).

($define "Date object" (=()
  ($should "(Date now)" "return current time" (= ()
    (assert (` (<= (Date now) (Date now),
  ),
  ($should "(Date getTime)" "return the timestamp of current time" (= ()
    (assert (` (<= (Date getTime) ((Date now) getTime),
    (assert (` (<= ((Date now) getTime) (Date getTime),
  ),
  ($should "(Date parse )"  "return the date by parsing the string" (= ()
    (let epoch (Date parse "1 January, 1970, 00:00:00 UTC"),
    (assert 1970 (` (epoch getUTCFullYear),
    (assert 0 (` (epoch getUTCMonth),
    (assert 1 (` (epoch getUTCDate),
    (assert 0 (` (epoch getUTCHours),
    (assert 0 (` (epoch getUTCMinutes),
    (assert 0 (` (epoch getUTCSeconds),
  ),
  ($should "(Date utc year month ...)" "return the date basing on fields with UTC values" (= ()
    (let epoch (Date utc 1972 0 1 1 2 3),
    (assert 1972 (` (epoch getUTCFullYear),
    (assert 0 (` (epoch getUTCMonth),
    (assert 1 (` (epoch getUTCDate),
    (assert 1 (` (epoch getUTCHours),
    (assert 2 (` (epoch getUTCMinutes),
    (assert 3 (` (epoch getUTCSeconds),
  ),
).
