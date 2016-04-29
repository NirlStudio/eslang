($define "keyword: concat" (= ()
  ($should "return the concatenation of the values of arguments" (= ()
    (assert equal "" (concat),
    (assert equal "0" (concat 0),
    (assert equal "012" (concat 0 1 2),
    (assert equal "strstr2" (concat "str" "str" 2),
).

($define "operator: +" (= ()
  ($should "return the concatenation of the values of arguments" (= ()
    (assert equal "" (+ ""),
    (assert equal "0" (+ "" 0),
    (assert equal "012" (+ "" 0 1 2),
    (assert equal "strstr2" (+ "str" "str" 2),
).

($define "operator: +=" (= ()
  ($should "return the concatenation of the values of arguments" (= ()
    (let str "str")
    (assert equal "str1" (+= str 1),
    (assert equal "str1" str),
).
