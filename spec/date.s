($define "function form" (=()
  ($should "($date )" "return current time" (= ()
    (assert equal true (<= ($date ) ($date),
    (assert equal true (<= ($date ) (Date now),
    (assert equal true (<= (Date now) ($date ),
  ),
  ($should "($date milliseconds)" "return the date by the the Unix Epoch" (= ()
    (let epoch ($date 0),
    (assert equal 1970 (epoch getUTCFullYear),
    (assert equal 0 (epoch getUTCMonth),
    (assert equal 1 (epoch getUTCDate),
    (assert equal 0 (epoch getUTCHours),
    (assert equal 0 (epoch getUTCMinutes),
    (assert equal 0 (epoch getUTCSeconds),
  ),
  ($should "($date dateString)" "return the date by parsing the string" (= ()
    (let epoch ($date "1 January, 1970, 00:00:00 UTC"),
    (assert equal 1970 (epoch getUTCFullYear),
    (assert equal 0 (epoch getUTCMonth),
    (assert equal 1 (epoch getUTCDate),
    (assert equal 0 (epoch getUTCHours),
    (assert equal 0 (epoch getUTCMinutes),
    (assert equal 0 (epoch getUTCSeconds),
  ),
  ($should "($date year month ...)" "return the date basing on fields" (= ()
    (let epoch ($date 1972 0 1 1 2 3),
    (assert equal 1972 (epoch getFullYear),
    (assert equal 0 (epoch getMonth),
    (assert equal 1 (epoch getDate),
    (assert equal 1 (epoch getHours),
    (assert equal 2 (epoch getMinutes),
    (assert equal 3 (epoch getSeconds),
  ),
).

($define "operator form" (=()
  ($should "(date )" "return current time" (= ()
    (assert equal true (<= (date ) (date),
    (assert equal true (<= (date ) (Date now),
    (assert equal true (<= (Date now) (date ),
  ),
  ($should "(date milliseconds)" "return the date by the the Unix Epoch" (= ()
    (let epoch (date 0),
    (assert equal 1970 (epoch getUTCFullYear),
    (assert equal 0 (epoch getUTCMonth),
    (assert equal 1 (epoch getUTCDate),
    (assert equal 0 (epoch getUTCHours),
    (assert equal 0 (epoch getUTCMinutes),
    (assert equal 0 (epoch getUTCSeconds),
  ),
  ($should "(date dateString)" "return the date by parsing the string" (= ()
    (let epoch (date "1 January, 1970, 00:00:00 UTC"),
    (assert equal 1970 (epoch getUTCFullYear),
    (assert equal 0 (epoch getUTCMonth),
    (assert equal 1 (epoch getUTCDate),
    (assert equal 0 (epoch getUTCHours),
    (assert equal 0 (epoch getUTCMinutes),
    (assert equal 0 (epoch getUTCSeconds),
  ),
  ($should "(date year month ...)" "return the date basing on fields" (= ()
    (let epoch (date 1972 0 1 1 2 3),
    (assert equal 1972 (epoch getFullYear),
    (assert equal 0 (epoch getMonth),
    (assert equal 1 (epoch getDate),
    (assert equal 1 (epoch getHours),
    (assert equal 2 (epoch getMinutes),
    (assert equal 3 (epoch getSeconds),
  ),
).

($define "Date object" (=()
  ($should "(Date now)" "return current time" (= ()
    (assert equal true (<= (Date now) (Date now),
  ),
  ($should "(Date getTime)" "return the timestamp of current time" (= ()
    (assert equal true (<= (Date getTime) ((Date now) getTime),
    (assert equal true (<= ((Date now) getTime) (Date getTime),
  ),
  ($should "(Date parse )"  "return the date by parsing the string" (= ()
    (let epoch (Date parse "1 January, 1970, 00:00:00 UTC"),
    (assert equal 1970 (epoch getUTCFullYear),
    (assert equal 0 (epoch getUTCMonth),
    (assert equal 1 (epoch getUTCDate),
    (assert equal 0 (epoch getUTCHours),
    (assert equal 0 (epoch getUTCMinutes),
    (assert equal 0 (epoch getUTCSeconds),
  ),
  ($should "(Date utc year month ...)" "return the date basing on fields with UTC values" (= ()
    (let epoch (Date utc 1972 0 1 1 2 3),
    (assert equal 1972 (epoch getUTCFullYear),
    (assert equal 0 (epoch getUTCMonth),
    (assert equal 1 (epoch getUTCDate),
    (assert equal 1 (epoch getUTCHours),
    (assert equal 2 (epoch getUTCMinutes),
    (assert equal 3 (epoch getUTCSeconds),
  ),
).
