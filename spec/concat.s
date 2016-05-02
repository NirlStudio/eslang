($define "keyword: concat" (= ()
  ($should "return the concatenation of the values of arguments" (= ()
    (assert "" (` (concat),
    (assert "0" (` (concat 0),
    (assert "012" (` (concat 0 1 2),
    (assert "strstr2" (` (concat "str" "str" 2),
).

($define "operator: +" (= ()
  ($should "return the concatenation of the values of arguments" (= ()
    (assert "" (` (+ ""),
    (assert "0" (` (+ "" 0),
    (assert "012" (` (+ "" 0 1 2),
    (assert "strstr2" (` (+ "str" "str" 2),
).

($define "operator: +=" (= ()
  ($should "return the concatenation of the values of arguments" (= ()
    (let str "str")
    (assert "str1" (` (+= str 1),
    (assert "str1" (` str),
).
