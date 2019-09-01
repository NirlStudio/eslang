const (samples) (import "../generic/samples/types");

const nobody (@);
(const flat-samples (samples reduce (@ null, type), (=> (values, sample)
  values push (sample the-type), (sample "empty");
  values merge (sample values);
).

(define "universal operations", (=> ()
  (define "is", (=> ()
    (should "((is) one) works like (one is).", (=> ()
      var *is (is);
      assert ($*is is-a function);

      (for sample in samples
        assert (sample the-type:: is) (*is (sample the-type);
        assert (sample "empty":: is) (*is (sample "empty");
        (for value in (sample values)
          assert ($value is) (*is value);
        ).
    ).
    (should "((is another) one) works like (one is another).", (=> ()
      var is-nobody (is nobody);
      assert ($is-nobody is-a function);

      (for sample in samples
        assert ((is (sample the-type)) (sample the-type);
        assert false (is-nobody (sample the-type);

        assert ((is (sample "empty")) (sample "empty");
        assert false (is-nobody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert ((is value) value);
          assert false ((is value) last);
          assert false (is-nobody value);
          let last value;
        ).
    ).
    (should "'is' is resolved to a function.", (=> ()
      assert ($is is-a function);
      var is_ is;
      assert ($is_ is-a function);
      assert ($is_ is is);
    ).
    (should "(:is one another) works like (one is another).", (=> ()
      (for sample in samples
        assert (:is (sample the-type) (sample the-type);
        assert false (:is (sample the-type) nobody);

        assert (:is (sample "empty") (sample "empty");
        assert false(:is (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert (:is value value);
          assert false (:is value last);
          assert false (:is value nobody);
          let last value;
        ).
  ).
  (define "===", (=> ()
    (should "'===' is an alias of 'is'.", (=> ()
      assert ($is is ===);
      assert ($=== is is);
    ).
  ).

  (define "is-not", (=> ()
    (should "((is-not) one) works like (one is-not).", (=> ()
      var *is-not (is-not);
      assert ($*is-not is-a function);

      (for sample in samples
        assert (sample the-type:: is-not) (*is-not (sample the-type);
        assert (sample "empty":: is-not) (*is-not (sample "empty");
        (for value in (sample values)
          assert ($value is-not) (*is-not value);
        ).
    ).
    (should "((is-not another) one) works like (one is-not another).", (=> ()
      var is-somebody (is-not nobody);
      assert ($is-somebody is-a function);

      (for sample in samples
        assert false ((is-not (sample the-type)) (sample the-type);
        assert (is-somebody (sample the-type);

        assert false ((is-not (sample "empty")) (sample "empty");
        assert (is-somebody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert false ((is-not value) value);
          assert ((is-not value) last);
          assert (is-somebody value);
          let last value;
        ).
    ).
    (should "'is-not' is resolved to a function.", (=> ()
      assert ($is-not is-a function);
      var is-not_ is-not;
      assert ($is-not_ is-a function);
      assert ($is-not_ is is-not);
    ).
    (should "(:is-not one another) works like (one is-not another).", (=> ()
      (for sample in samples
        assert false (:is-not (sample the-type) (sample the-type);
        assert (:is-not (sample the-type) nobody);

        assert false (:is-not (sample "empty") (sample "empty");
        assert (:is-not (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert false (:is-not value value);
          assert (:is-not value last);
          assert (:is-not value nobody);
          let last value;
        ).
  ).
  (define "!==", (=> ()
    (should "'!==' is an alias of 'is-not'.", (=> ()
      assert ($is-not is !==);
      assert ($!== is is-not);
    ).
  ).

  (define "equals", (=> ()
    (should "((equals) one) works like (one equals).", (=> ()
      var *equals (equals);
      assert ($*equals is-a function);

      (for sample in samples
        assert (sample the-type:: equals) (*equals (sample the-type);
        assert (sample "empty":: equals) (*equals (sample "empty");
        (for value in (sample values)
          assert ($value equals) (*equals value);
        ).
    ).
    (should "((equals another) one) works like (one equals another).", (=> ()
      var equals-nobody (equals nobody);
      assert ($equals-nobody is-a function);

      (for sample in samples
        assert ((equals (sample the-type)) (sample the-type);
        assert false (equals-nobody (sample the-type);

        assert ((equals (sample "empty")) (sample "empty");
        assert false (equals-nobody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert ((equals value) value);
          assert ((equals last) value) ((equals value) last);
          assert false (equals-nobody value);
          let last value;
        ).
    ).
    (should "'equals' is resolved to a function.", (=> ()
      assert ($equals is-a function);
      var equals_ equals;
      assert ($equals_ is-a function);
      assert ($equals_ is equals);
    ).
    (should "(:equals one another) works like (one equals another).", (=> ()
      (for sample in samples
        assert (:equals (sample the-type) (sample the-type);
        assert false (:equals (sample the-type) nobody);

        assert (:equals (sample "empty") (sample "empty");
        assert false(:equals (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert (:equals value value);
          assert (:equals last value) (:equals value last);
          assert false (:equals value nobody);
          let last value;
        ).
  ).
  (define "==", (=> ()
    (should "'==' is an alias of 'equals'.", (=> ()
      assert ($equals is ==);
      assert ($== is equals);
    ).
  ).

  (define "not-equals", (=> ()
    (should "((not-equals) one) works like (one not-equals).", (=> ()
      var *not-equals (not-equals);
      assert ($*not-equals is-a function);

      (for sample in samples
        assert (sample the-type:: not-equals) (*not-equals (sample the-type);
        assert (sample "empty":: not-equals) (*not-equals (sample "empty");
        (for value in (sample values)
          assert ($value not-equals) (*not-equals value);
        ).
    ).
    (should "((not-equals another) one) works like (one not-equals another).", (=> ()
      var equals-somebody (not-equals nobody);
      assert ($equals-somebody is-a function);

      (for sample in samples
        assert false ((not-equals (sample the-type)) (sample the-type);
        assert (equals-somebody (sample the-type);

        assert false ((not-equals (sample "empty")) (sample "empty");
        assert (equals-somebody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert false ((not-equals value) value);
          assert ((not-equals last) value) ((not-equals value) last);
          assert (equals-somebody value);
          let last value;
        ).
    ).
    (should "'not-equals' is resolved to a function.", (=> ()
      assert ($not-equals is-a function);
      var not-equals_ not-equals;
      assert ($not-equals_ is-a function);
      assert ($not-equals_ is not-equals);
    ).
    (should "(:not-equals one another) works like (one not-equals another).", (=> ()
      (for sample in samples
        assert false (:not-equals (sample the-type) (sample the-type);
        assert (:not-equals (sample the-type) nobody);

        assert false (:not-equals (sample "empty") (sample "empty");
        assert (:not-equals (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert false (:not-equals value value);
          assert (:not-equals last value) (:not-equals value last);
          assert (:not-equals value nobody);
          let last value;
        ).
  ).
  (define "!=", (=> ()
    (should "'!=' is an alias of 'not-equals'.", (=> ()
      assert ($not-equals is !=);
      assert ($!= is not-equals);
    ).
  ).

  (define "compare", (=> ()
    (should "((compare) one) works like (one compare).", (=> ()
      var *compare (compare);
      assert ($*compare is-a function);

      (for sample in samples
        assert (sample the-type:: compare) (*compare (sample the-type);
        assert (sample "empty":: compare) (*compare (sample "empty");
        (for value in (sample values)
          assert ($value compare) (*compare value);
        ).
    ).
    (should "((compare another) one) works like (one compare another).", (=> ()
      var compare-nobody (compare nobody);
      assert ($compare-nobody is-a function);

      (for sample in samples
        assert 0 ((compare (sample the-type)) (sample the-type);
        assert null (compare-nobody (sample the-type);

        assert 0 ((compare (sample "empty")) (sample "empty");
        assert null (compare-nobody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert 0 ((compare value) value);
          (if ((compare value) last:: is-a number)
            assert ((compare last) value) (- ((compare value) last);
          ).
          assert null (compare-nobody value);
          let last value;
        ).
    ).
    (should "'compare' is resolved to a function.", (=> ()
      assert ($compare is-a function);
      var compare_ compare;
      assert ($compare_ is-a function);
      assert ($compare_ is compare);
    ).
    (should "(:compare one another) works like (one compare another).", (=> ()
      (for sample in samples
        assert 0 (:compare (sample the-type) (sample the-type);
        assert null (:compare (sample the-type) nobody);

        assert 0 (:compare (sample "empty") (sample "empty");
        assert null(:compare (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert 0 (:compare value value);
          (if (:compare value last:: is-a number)
            assert (:compare last value) (- (:compare value last);
          ).
          assert null (:compare value nobody);
          let last value;
        ).
  ).

  (define "is-empty", (=> ()
    (should "((is-empty) one) works like (one is-empty).", (=> ()
      var *is-empty (is-empty);
      assert ($*is-empty is-a function);

      (for sample in samples
        assert false (*is-empty (sample the-type);
        assert true (*is-empty (sample "empty");
        (for value in (sample values)
          assert ($value is-empty) (*is-empty value);
        ).
    ).
    (should "'is-empty' is resolved to a function.", (=> ()
      assert ($is-empty is-a function);
      var is-empty_ is-empty;
      assert ($is-empty_ is-a function);
      assert ($is-empty_ is is-empty);
    ).
    (should "(:is-empty one) works like (one is-empty).", (=> ()
      (for sample in samples
        assert false (:is-empty (sample the-type);
        assert true (:is-empty (sample "empty");
        (for value in (sample values)
          assert ($value is-empty) (:is-empty value);
        ).
  ).
  (define "not-empty", (=> ()
    (should "((not-empty) one) works like (one not-empty).", (=> ()
      var *not-empty (not-empty);
      assert ($*not-empty is-a function);

      (for sample in samples
        assert true (*not-empty (sample the-type);
        assert false (*not-empty (sample "empty");
        (for value in (sample values)
          assert ($value not-empty) (*not-empty value);
        ).
    ).
    (should "'not-empty' is resolved to a function.", (=> ()
      assert ($not-empty is-a function);
      var not-empty_ not-empty;
      assert ($not-empty_ is-a function);
      assert ($not-empty_ is not-empty);
    ).
    (should "(:not-empty one) works like (one not-empty).", (=> ()
      (for sample in samples
        assert true (:not-empty (sample the-type);
        assert false (:not-empty (sample "empty");
        (for value in (sample values)
          assert ($value not-empty) (:not-empty value);
        ).
  ).

  (define "is-a", (=> ()
    (should "((is-a) one) works like (one is-a).", (=> ()
      var *is-a (is-a);
      assert ($*is-a is-a function);

      (for sample in samples
        assert false (*is-a (sample the-type);
        assert false (*is-a (sample "empty");
        (for value in (sample values)
          assert false (*is-a value);
        ).
    ).
    (should "((is-a a-type) one) works like (one is-a a-type).", (=> ()
      var is-a-cat (is-a (@:class type: (@ name: "cat");
      assert ($is-a-cat is-a function);

      var is-a-type (is-a type);
      assert ($is-a-type is-a function);

      (for sample in samples
        assert (is-a-type (sample the-type);
        assert false (is-a-cat (sample the-type);

        var is-a-sample (is-a (sample the-type);
        assert ($is-a-sample is-a function);

        assert (is-a-sample (sample "empty");
        assert false (is-a-cat (sample "empty");

        (for value in (sample values)
          assert (is-a-sample value);
          assert false (is-a-cat value);
        ).
    ).
    (should "'is-a' is resolved to a function.", (=> ()
      assert ($is-a is-a function);
      var is-a_ is-a;
      assert ($is-a_ is-a function);
      assert ($is-a_ is is-a);
    ).
    (should "(:is-a one a-type) works like (one is-a a-type).", (=> ()
      (for sample in samples
        assert (:is-a (sample the-type) type);
        assert false (:is-a (sample the-type) nobody);

        assert (:is-a (sample "empty") (sample the-type);
        assert false (:is-a (sample "empty") nobody);

        (for value in (sample values)
          assert (:is-a value (sample the-type);
          assert false (:is-a value nobody);
        ).
  ).
  (define "is-an", (=> ()
    (should "'is-an' is an alias of 'is-a'.", (=> ()
      assert ($is-a is is-an);
      assert ($is-an is is-a);
    ).
  ).
  (define "is-not-a", (=> ()
    (should "((is-not-a) one) works like (one is-not-a).", (=> ()
      var *is-not-a (is-not-a);
      assert ($*is-not-a is-a function);

      (for sample in samples
        assert (*is-not-a (sample the-type);
        assert (*is-not-a (sample "empty");
        (for value in (sample values)
          assert (*is-not-a value);
        ).
    ).
    (should "((is-not-a a-type) one) works like (one is-not-a a-type).", (=> ()
      var is-not-a-cat (is-not-a (@:class type: (@ name: "cat");
      assert ($is-not-a-cat is-a function);

      var is-not-a-type (is-not-a type);
      assert ($is-not-a-type is-a function);

      (for sample in samples
        assert false (is-not-a-type (sample the-type);
        assert (is-not-a-cat (sample the-type);

        var is-not-a-sample (is-not-a (sample the-type);
        assert ($is-not-a-sample is-a function);

        assert false (is-not-a-sample (sample "empty");
        assert (is-not-a-cat (sample "empty");

        (for value in (sample values)
          assert false (is-not-a-sample value);
          assert (is-not-a-cat value);
        ).
    ).
    (should "'is-not-a' is resolved to a function.", (=> ()
      assert ($is-not-a is-a function);
      var is-not-a_ is-not-a;
      assert ($is-not-a_ is-a function);
      assert ($is-not-a_ is is-not-a);
    ).
    (should "(:is-not-a one a-type) works like (one is-not-a a-type).", (=> ()
      (for sample in samples
        assert false (:is-not-a (sample the-type) type);
        assert (:is-not-a (sample the-type) nobody);

        assert false (:is-not-a (sample "empty") (sample the-type);
        assert (:is-not-a (sample "empty") nobody);

        (for value in (sample values)
          assert false (:is-not-a value (sample the-type);
          assert (:is-not-a value nobody);
        ).
  ).
  (define "is-not-an", (=> ()
    (should "'is-not-an' is an alias of 'is-not-a'.", (=> ()
      assert ($is-not-a is is-not-an);
      assert ($is-not-an is is-not-a);
    ).
  ).

  (define "to-code", (=> ()
    (should "((to-code) one) works like (one to-code).", (=> ()
      var *to-code (to-code);
      assert ($*to-code is-a function);

      (for sample in samples
        assert (sample the-type:: to-code) (*to-code (sample the-type);
        assert (sample "empty":: to-code) (*to-code (sample "empty");
        (for value in (sample values)
          assert ($value to-code) (*to-code value);
        ).
    ).
    (should "'to-code' is resolved to a function.", (=> ()
      assert ($to-code is-a function);
      var to-code_ to-code;
      assert ($to-code_ is-a function);
      assert ($to-code_ is to-code);
    ).
    (should "(:to-code one) works like (one to-code).", (=> ()
      (for sample in samples
        assert (sample the-type:: to-code) (:to-code (sample the-type);
        assert (sample "empty":: to-code) (:to-code (sample "empty");
        (for value in (sample values)
          assert ($value to-code) (:to-code value);
        ).
  ).

  (define "to-string", (=> ()
    (should "((to-string) one) works like (one to-string).", (=> ()
      var *to-string (to-string);
      assert ($*to-string is-a function);

      (for sample in samples
        assert (sample the-type:: name) (*to-string (sample the-type);
        assert (sample "empty":: to-string) (*to-string (sample "empty");
        (for value in (sample values)
          assert ($value to-string) (*to-string value);
        ).
    ).
    (should "'to-string' is resolved to a function.", (=> ()
      assert ($to-string is-a function);
      var to-string_ to-string;
      assert ($to-string_ is-a function);
      assert ($to-string_ is to-string);
    ).
    (should "(:to-string one) works like (one to-string).", (=> ()
      (for sample in samples
        assert (sample the-type:: name) (:to-string (sample the-type);
        assert (sample "empty":: to-string) (:to-string (sample "empty");
        (for value in (sample values)
          assert ($value to-string) (:to-string value);
        ).
  ).
).

(define "comparison operations", (=> ()
  (define "comparer: >", (=> ()
    (should "((>) one) works like (one >).", (=> ()
      var *> (>);
      assert ($*> is-a function);

      (for sample in samples
        assert (sample the-type:: >) (*> (sample the-type);
        assert (sample "empty":: >) (*> (sample "empty");
        (for value in (sample values)
          assert ($value >) (*> value);
        ).
    ).
    (should "((> another) one) works like (one > another).", (=> ()
      var >nobody (> nobody);
      assert ($>nobody is-a function);

      (for sample in samples
        assert ((sample the-type) > (sample the-type)) ((> (sample the-type)) (sample the-type);
        assert null (>nobody (sample the-type);

        assert ((sample "empty") > (sample "empty")) ((> (sample "empty")) (sample "empty");
        assert null (>nobody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert ($value > value) ((> value) value);
          assert ($last > value) ((> value) last);
          assert ($value > last) ((> last) value);
          assert null (>nobody value);
          let last value;
        ).
    ).
    (should "'>' is resolved to a function.", (=> ()
      assert ($> is-a function);
      var >_ >;
      assert ($>_ is-a function);
      assert ($>_ is >);
    ).
    (should "(:> one another) works like (one > another).", (=> ()
      (for sample in samples
        assert ((sample the-type) > (sample the-type)) (:> (sample the-type) (sample the-type);
        assert null (:> (sample the-type) nobody);

        assert ((sample "empty") > (sample "empty")) (:> (sample "empty") (sample "empty");
        assert null(:> (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert ($value > value) (:> value value);
          assert ($value > last) (:> value last);
          assert ($last > value) (:> last value);
          assert null (:> value nobody);
          let last value;
        ).
  ).
  (define "comparer: >=", (=> ()
    (should "((>=) one) works like (one >=).", (=> ()
      var *>= (>=);
      assert ($*>= is-a function);

      (for sample in samples
        assert (sample the-type:: >=) (*>= (sample the-type);
        assert (sample "empty":: >=) (*>= (sample "empty");
        (for value in (sample values)
          assert ($value >=) (*>= value);
        ).
    ).
    (should "((>= another) one) works like (one >= another).", (=> ()
      var >=nobody (>= nobody);
      assert ($>=nobody is-a function);

      (for sample in samples
        assert ((sample the-type) >= (sample the-type)) ((>= (sample the-type)) (sample the-type);
        assert null (>=nobody (sample the-type);

        assert ((sample "empty") >= (sample "empty")) ((>= (sample "empty")) (sample "empty");
        assert null (>=nobody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert ($value >= value) ((>= value) value);
          assert ($last >= value) ((>= value) last);
          assert ($value >= last) ((>= last) value);
          assert null (>=nobody value);
          let last value;
        ).
    ).
    (should "'>=' is resolved to a function.", (=> ()
      assert ($>= is-a function);
      var >=_ >=;
      assert ($>=_ is-a function);
      assert ($>=_ is >=);
    ).
    (should "(:>= one another) works like (one >= another).", (=> ()
      (for sample in samples
        assert ((sample the-type) >= (sample the-type)) (:>= (sample the-type) (sample the-type);
        assert null (:>= (sample the-type) nobody);

        assert ((sample "empty") >= (sample "empty")) (:>= (sample "empty") (sample "empty");
        assert null(:>= (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert ($value >= value) (:>= value value);
          assert ($value >= last) (:>= value last);
          assert ($last >= value) (:>= last value);
          assert null (:>= value nobody);
          let last value;
        ).
  ).
  (define "comparer: <", (=> ()
    (should "((<) one) works like (one <).", (=> ()
      var *< (<);
      assert ($*< is-a function);

      (for sample in samples
        assert (sample the-type:: <) (*> (sample the-type);
        assert (sample "empty":: <) (*> (sample "empty");
        (for value in (sample values)
          assert ($value <) (*> value);
        ).
    ).
    (should "((< another) one) works like (one < another).", (=> ()
      var <nobody (< nobody);
      assert ($<nobody is-a function);

      (for sample in samples
        assert ((sample the-type) < (sample the-type)) ((< (sample the-type)) (sample the-type);
        assert null (<nobody (sample the-type);

        assert ((sample "empty") < (sample "empty")) ((< (sample "empty")) (sample "empty");
        assert null (<nobody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert ($value < value) ((< value) value);
          assert ($last < value) ((< value) last);
          assert ($value < last) ((< last) value);
          assert null (<nobody value);
          let last value;
        ).
    ).
    (should "'<' is resolved to a function.", (=> ()
      assert ($< is-a function);
      var <_ <;
      assert ($<_ is-a function);
      assert ($<_ is <);
    ).
    (should "(:< one another) works like (one < another).", (=> ()
      (for sample in samples
        assert ((sample the-type) < (sample the-type)) (:< (sample the-type) (sample the-type);
        assert null (:< (sample the-type) nobody);

        assert ((sample "empty") < (sample "empty")) (:< (sample "empty") (sample "empty");
        assert null(:< (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert ($value < value) (:< value value);
          assert ($value < last) (:< value last);
          assert ($last < value) (:< last value);
          assert null (:< value nobody);
          let last value;
        ).
  ).
  (define "comparer: <=", (=> ()
    (should "((<=) one) works like (one <=).", (=> ()
      var *<= (<=);
      assert ($*<= is-a function);

      (for sample in samples
        assert (sample the-type:: <=) (*<= (sample the-type);
        assert (sample "empty":: <=) (*<= (sample "empty");
        (for value in (sample values)
          assert ($value <=) (*>= value);
        ).
    ).
    (should "((<= another) one) works like (one <= another).", (=> ()
      var <=nobody (<= nobody);
      assert ($<=nobody is-a function);

      (for sample in samples
        assert ((sample the-type) <= (sample the-type)) ((<= (sample the-type)) (sample the-type);
        assert null (<=nobody (sample the-type);

        assert ((sample "empty") <= (sample "empty")) ((<= (sample "empty")) (sample "empty");
        assert null (<=nobody (sample "empty");

        var last (sample "empty");
        (for value in (sample values)
          assert ($value <= value) ((<= value) value);
          assert ($last <= value) ((<= value) last);
          assert ($value <= last) ((<= last) value);
          assert null (<=nobody value);
          let last value;
        ).
    ).
    (should "'<=' is resolved to a function.", (=> ()
      assert ($<= is-a function);
      var <=_ <=;
      assert ($<=_ is-a function);
      assert ($<=_ is <=);
    ).
    (should "(:<= one another) works like (one <= another).", (=> ()
      (for sample in samples
        assert ((sample the-type) <= (sample the-type)) (:<= (sample the-type) (sample the-type);
        assert null (:<= (sample the-type) nobody);

        assert ((sample "empty") <= (sample "empty")) (:<= (sample "empty") (sample "empty");
        assert null(:<= (sample "empty") nobody);

        var last (sample "empty");
        (for value in (sample values)
          assert ($value <= value) (:<= value value);
          assert ($value <= last) (:<= value last);
          assert ($last <= value) (:<= last value);
          assert null (:<= value nobody);
          let last value;
        ).
  ).
).

(define "arithmetic operations", (=> ()
  (define "global: -", (=> ()
    (should "'-' is resolved to a function.", (=> ()
      assert ($- is-a function);
      var -_ -;
      assert ($-_ is-a function);
      assert ($-_ is -);
    ).
    (should "(:-) returns -0.", (=> ()
      assert (:-:: is -0);
    ).
    (should "(:- num) returns the opposite value of num.", (=> ()
      assert (:- 0:: is -0);
      assert (:- -0:: is 0);

      assert (:- 1:: is -1);
      assert (:- -1:: is 1);

      assert (:- 1.5:: is -1.5);
      assert (:- -1.5:: is 1.5);

      assert (:- (number infinite):: is (number -infinite);
      assert (:- (number -infinite):: is (number infinite));
    ).
    (should "(:- not-a-num) returns -0.", (=> ()
      assert (:- null:: is -0);
      assert (:- type:: is -0);
      (for sample in samples
        assert (:- (sample the-type):: is -0);
        (if (sample the-type:: is-not number)
          assert (:- (sample "empty"):: is -0);
          (for value in (sample values)
            assert (:- value:: is -0);
          ).
      ).
    ).
  ).
  (define "global: ++", (=> ()
    (should "'++' is resolved to a function.", (=> ()
      assert ($++ is-a function);
      var ++_ ++;
      assert ($++_ is-a function);
      assert ($++_ is ++);
    ).
    (should "(:++) returns 1.", (=> ()
      assert 1 (:++);
    ).
    (should "(:++ num) returns (num + 1).", (=> ()
      assert 1 (:++ 0);
      assert -1 (:++ -2);
      assert 0 (:++ -1);
      assert 2 (:++ 1);

      assert 2.5 (:++ 1.5);
      assert -0.5 (:++ -1.5);

      assert (number infinite) (:++ (number infinite);
      assert (number -infinite) (:++ (number -infinite);
    ).
    (should "(:++ not-a-num) returns 1.", (=> ()
      assert 1 (:++ null);
      assert 1 (:++ type);
      (for sample in samples
        assert 1 (:++ (sample the-type);
        (if (sample the-type:: is-not number)
          assert 1 (:++ (sample "empty");
          (for value in (sample values)
            assert 1 (:++ value);
          ).
      ).
    ).
  ).
  (define "global: --", (=> ()
    (should "'--' is resolved to a function.", (=> ()
      assert ($-- is-a function);
      var --_ --;
      assert ($--_ is-a function);
      assert ($--_ is --);
    ).
    (should "(:--) returns -1.", (=> ()
      assert -1 (:--);
    ).
    (should "(:-- num) returns (num - 1).", (=> ()
      assert -1 (:-- 0);
      assert -2 (:-- -1);
      assert 0 (:-- 1);
      assert 1 (:-- 2);

      assert 0.5 (:-- 1.5);
      assert -2.5 (:-- -1.5);

      assert (number infinite) (:-- (number infinite);
      assert (number -infinite) (:-- (number -infinite);
    ).
    (should "(:-- not-a-num) returns -1.", (=> ()
      assert -1 (:-- null);
      assert -1 (:-- type);
      (for sample in samples
        assert -1 (:-- (sample the-type);
        (if (sample the-type:: is-not number)
          assert -1 (:-- (sample "empty");
          (for value in (sample values)
            assert -1 (:-- value);
          ).
  ).
  (define "global: +=", (=> ()
    (should "'+=' is resolved to a function.", (=> ()
      assert ($+= is-a function);
      var +=_ +=;
      assert ($+=_ is-a function);
      assert ($+=_ is +=);
    ).
    (should "((+=) value) works like (value +).", (=> ()
      var *+= (+=);
      assert ($*+= is-a function);

      assert (null +) (*+= null);
      assert (type +) (*+= type);
      (for sample in samples
        assert ((sample the-type) +) (*+= (sample the-type);
        (if (sample the-type:: is array)
          assert ((sample "empty") +:: length) (*+= (sample "empty":: length);
          (for value in (sample values)
            assert (value +:: length) (*+= value:: length);
          ).
        else
          assert ($(sample "empty") +) (*+= (sample "empty");
          (for value in (sample values)
            assert ($value +) (*+= value);
          ).
    ).
    (var is-safe (all
      (is-not-a lambda), (is-not-a function) and (is-not-a iterator)
    ).
    (should "((+= another) one) works like (one + another).", (=> ()
      (for another in flat-samples
        var +another (+= another);
        assert ($+another is-a function);

        (for one in flat-samples
          (if ($one is-a array)
            (if (is-safe another)
              assert (one + another:: length) (+another one:: length);
            ).
          else
            assert ($one + another) (+another one);
          ).
    ).
    (should "(:+= one another extra) works like (one + another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          (if ($one is-a array)
            (if (is-safe another)
              assert ($one +:: length) (:+= one:: length);
              assert (one + another:: length) (:+= one another:: length);
              assert (one + another:: length) (:+= one another another:: length);
            ).
          else
            assert ($one +) (:+= one);
            assert ($one + another) (:+= one another);
            assert ($one + another) (:+= one another another);
          ).
  ).
  (define "global: -=", (=> ()
    (should "'-=' is resolved to a function.", (=> ()
      assert ($-= is-a function);
      var -=_ -=;
      assert ($-=_ is-a function);
      assert ($-=_ is -=);
    ).
    (should "((-=) value) works like (value -).", (=> ()
      var *-= (-=);
      assert ($*-= is-a function);

      assert (null -) (*-= null);
      assert (type -) (*-= type);
      (for sample in samples
        assert ((sample the-type) -) (*-= (sample the-type);
        assert ((sample "empty") -) (*-= (sample "empty");
        (for value in (sample values)
          assert ($value -) (*-= value);
        ).
    ).
    (should "((-= another) one) works like (one - another)).", (=> ()
      (for another in flat-samples
        var -another (-= another);
        assert ($-another is-a function);
        (for one in flat-samples
          assert ($one - another) (-another one);
        ).
      ).
    ).
    (should "(:-= one another extra) works like (one - another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert ($one -) (:-= one);
          assert ($one - another) (:-= one another);
          assert ($one - another) (:-= one another another);
        ).
  ).
  (define "global: *=", (=> ()
    (should "'*=' is resolved to a function.", (=> ()
      assert ($*= is-a function);
      var *=_ *=;
      assert ($*=_ is-a function);
      assert ($*=_ is *=);
    ).
    (should "((*=) value) works like (value *).", (=> ()
      var **= (*=);
      assert ($**= is-a function);

      assert (null *) (**= null);
      assert (type *) (**= type);
      (for sample in samples
        assert ((sample the-type) *) (**= (sample the-type);
        assert ((sample "empty") *) (**= (sample "empty");
        (for value in (sample values)
          assert ($value *) (:**= value);
        ).
    ).
    (should "((*= another) one) works like (one * another)).", (=> ()
      (for another in flat-samples
        var *another (*= another);
        assert ($*another is-a function);
        (for one in flat-samples
          assert ($one * another) (*another one);
        ).
      ).
    ).
    (should "(:*= one another extra) works like (one * another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert ($one *) (:*= one);
          assert ($one * another) (:*= one another);
          assert ($one * another) (:*= one another another);
        ).
  ).
  (define "global: /=", (=> ()
    (should "'/=' is resolved to a function.", (=> ()
      assert ($/= is-a function);
      var /=_ /=;
      assert ($/=_ is-a function);
      assert ($/=_ is /=);
    ).
    (should "((/=) value) works like (value /).", (=> ()
      var */= (/=);
      assert ($*/= is-a function);

      assert (null /) (*/= null);
      assert (type /) (*/= type);
      (for sample in samples
        assert ((sample the-type) /) (*/= (sample the-type);
        assert ((sample "empty") /) (*/= (sample "empty");
        (for value in (sample values)
          assert ($value /) (:*/= value);
        ).
    ).
    (should "((/= another) one) works like (one / another)).", (=> ()
      (for another in flat-samples
        var /another (/= another);
        assert ($/another is-a function);
        (for one in flat-samples
          assert ($one / another) (/another one);
        ).
      ).
    ).
    (should "(:/= one another extra) works like (one / another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert ($one /) (:/= one);
          assert ($one / another) (:/= one another);
          assert ($one / another) (:/= one another another);
        ).
  ).
  (define "global: %=", (=> ()
    (should "'%=' is resolved to a function.", (=> ()
      assert ($%= is-a function);
      var %=_ %=;
      assert ($%=_ is-a function);
      assert ($%=_ is %=);
    ).
    (should "((%=) value) works like (value %).", (=> ()
      var *%= (%=);
      assert ($*%= is-a function);

      assert (null %) (*%= null);
      assert (type %) (*%= type);
      (for sample in samples
        assert ((sample the-type) %) (*%= (sample the-type);
        assert ((sample "empty") %) (*%= (sample "empty");
        (for value in (sample values)
          assert ($value %) (:*%= value);
        ).
    ).
    (should "((%= another) one) works like (one % another)).", (=> ()
      (for another in flat-samples
        var %another (%= another);
        assert ($%another is-a function);
        (for one in flat-samples
          assert ($one % another) (%another one);
        ).
      ).
    ).
    (should "(:%= one another extra) works like (one % another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert ($one %) (:/= one);
          assert ($one % another) (:%= one another);
          assert ($one % another) (:%= one another another);
        ).
).

(define "bitwise operations", (=> ()
  (define "global: ~", (=> ()
    (should "'~' is resolved to a function.", (=> ()
      assert ($~ is-a function);
      var ~_ ~;
      assert ($~_ is-a function);
      assert ($~_ is ~);
    ).
    (should "(:~) returns -1.", (=> ()
      assert -1 (:~);
    ).
    (should "(:~ num) works like (~ num).", (=> ()
      assert (~ 0) (:~ 0);
      assert (~ -0) (:~ -0);

      assert (~ 1) (:~ 1);
      assert (~ -1) (:~ -1);

      assert (~ (number min)) (:~ (number min);
      assert (~ (number max)) (:~ (number max);
      assert (~ (number smallest)) (:~ (number smallest);

      assert (~ (number min-bits)) (:~ (number min-bits);
      assert (~ (number max-bits)) (:~ (number max-bits);

      assert (~ (number min-int)) (:~ (number min-int);
      assert (~ (number max-int)) (:~ (number max-int);

      assert (~ (number infinite)) (:~ (number infinite);
      assert (~ (number -infinite)) (:~ (number -infinite);
    ).
    (should "(:~ not-a-num) returns -1.", (=> ()
      assert -1 (:~ null);
      assert -1 (:~ type);
      (for sample in samples
        assert -1 (:~ (sample the-type);
        (if (sample the-type:: is-not number)
          assert -1 (:~ (sample "empty");
          (for value in (sample values)
            assert -1 (:~ value);
          ).
  ).
  (define "global: &=", (=> ()
    (should "'&=' is resolved to a function.", (=> ()
      assert ($&= is-a function);
      var &=_ &=;
      assert ($&=_ is-a function);
      assert ($&=_ is &=);
    ).
    (should "((&=) value) works like (number of value:: &).", (=> ()
      var *&= (&=);
      assert ($*&= is-a function);

      assert (number of null:: &) (*&= null);
      assert (number of type:: &) (*&= type);
      (for sample in samples
        assert (number of (sample the-type):: &) (*&= (sample the-type);
        assert (number of (sample "empty"):: &) (*&= (sample "empty");
        (for value in (sample values)
          assert (number of value:: &) (:*&= value);
        ).
    ).
    (should "((&= another extra) one) works like (number of one:: & another)).", (=> ()
      (for another in flat-samples
        var &another1 (&= another);
        assert ($&another1 is-a function);

        var &another2 (&= another another);
        assert ($&another2 is-a function);

        (for one in flat-samples
          assert (number of one:: & another) (&another1 one);
          assert (number of one:: & another) (&another2 one);
        ).
      ).
    ).
    (should "(:&= one another extra) works like (number of one:: & another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert (number of one:: &) (:&= one);
          assert (number of one:: & another) (:&= one another);
          assert (number of one:: & another) (:&= one another another);
        ).
  ).
  (define "global: |=", (=> ()
    (should "'|=' is resolved to a function.", (=> ()
      assert ($|= is-a function);
      var |=_ |=;
      assert ($|=_ is-a function);
      assert ($|=_ is |=);
    ).
    (should "((|=) value) works like (number of value:: |).", (=> ()
      var *|= (|=);
      assert ($*|= is-a function);

      assert (number of null:: |) (*|= null);
      assert (number of type:: |) (*|= type);
      (for sample in samples
        assert (number of (sample the-type):: |) (*|= (sample the-type);
        assert (number of (sample "empty"):: |) (*|= (sample "empty");
        (for value in (sample values)
          assert (number of value:: |) (:*|= value);
        ).
    ).
    (should "((|= another extra) one) works like (number of one:: | another)).", (=> ()
      (for another in flat-samples
        var |another1 (|= another);
        assert ($|another1 is-a function);

        var |another2 (|= another another);
        assert ($|another2 is-a function);

        (for one in flat-samples
          assert (number of one:: | another) (|another1 one);
          assert (number of one:: | another) (|another2 one);
        ).
      ).
    ).
    (should "(:|= one another extra) works like (number of one:: | another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert (number of one:: |) (:|= one);
          assert (number of one:: | another) (:|= one another);
          assert (number of one:: | another) (:|= one another another);
        ).
  ).
  (define "global: ^=", (=> ()
    (should "'^=' is resolved to a function.", (=> ()
      assert ($^= is-a function);
      var ^=_ ^=;
      assert ($^=_ is-a function);
      assert ($^=_ is ^=);
    ).
    (should "((^=) value) works like (number of value:: ^).", (=> ()
      var *^= (^=);
      assert ($*^= is-a function);

      assert (number of null:: ^) (*^= null);
      assert (number of type:: ^) (*^= type);
      (for sample in samples
        assert (number of (sample the-type):: ^) (*^= (sample the-type);
        assert (number of (sample "empty"):: ^) (*^= (sample "empty");
        (for value in (sample values)
          assert (number of value:: ^) (:*^= value);
        ).
    ).
    (should "((^= another extra) one) works like (number of one:: ^ another)).", (=> ()
      (for another in flat-samples
        var ^another1 (^= another);
        assert ($^another1 is-a function);

        var ^another2 (^= another another);
        assert ($^another2 is-a function);

        (for one in flat-samples
          assert (number of one:: ^ another) (^another1 one);
          assert (number of one:: ^ another) (^another2 one);
        ).
      ).
    ).
    (should "(:^= one another extra) works like (number of one:: ^ another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert (number of one:: ^) (:^= one);
          assert (number of one:: ^ another) (:^= one another);
          assert (number of one:: ^ another) (:^= one another another);
        ).
  ).
  (define "global: <<=", (=> ()
    (should "'<<=' is resolved to a function.", (=> ()
      assert ($<<= is-a function);
      var <<=_ <<=;
      assert ($<<=_ is-a function);
      assert ($<<=_ is <<=);
    ).
    (should "((<<=) value) works like (number of value:: <<).", (=> ()
      var *<<= (<<=);
      assert ($*<<= is-a function);

      assert (number of null:: <<) (*<<= null);
      assert (number of type:: <<) (*<<= type);
      (for sample in samples
        assert (number of (sample the-type):: <<) (*<<= (sample the-type);
        assert (number of (sample "empty"):: <<) (*<<= (sample "empty");
        (for value in (sample values)
          assert (number of value:: <<) (:*<<= value);
        ).
    ).
    (should "((<<= another extra) one) works like (number of one:: << another)).", (=> ()
      (for another in flat-samples
        var <<another1 (<<= another);
        assert ($<<another1 is-a function);

        var <<another2 (<<= another another);
        assert ($<<another2 is-a function);

        (for one in flat-samples
          assert (number of one:: << another) (<<another1 one);
          assert (number of one:: << another) (<<another2 one);
        ).
      ).
    ).
    (should "(:<<= one another extra) works like (number of one:: << another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert (number of one:: <<) (:<<= one);
          assert (number of one:: << another) (:<<= one another);
          assert (number of one:: << another) (:<<= one another another);
        ).
  ).
  (define "global: >>=", (=> ()
    (should "'>>=' is resolved to a function.", (=> ()
      assert ($>>= is-a function);
      var >>=_ >>=;
      assert ($>>=_ is-a function);
      assert ($>>=_ is >>=);
    ).
    (should "((>>=) value) works like (number of value:: >>).", (=> ()
      var *>>= (>>=);
      assert ($*>>= is-a function);

      assert (number of null:: >>) (*>>= null);
      assert (number of type:: >>) (*>>= type);
      (for sample in samples
        assert (number of (sample the-type):: >>) (*>>= (sample the-type);
        assert (number of (sample "empty"):: >>) (*>>= (sample "empty");
        (for value in (sample values)
          assert (number of value:: >>) (:*>>= value);
        ).
    ).
    (should "((>>= another extra) one) works like (number of one:: >> another)).", (=> ()
      (for another in flat-samples
        var >>another1 (>>= another);
        assert ($>>another1 is-a function);

        var >>another2 (>>= another another);
        assert ($>>another2 is-a function);

        (for one in flat-samples
          assert (number of one:: >> another) (>>another1 one);
          assert (number of one:: >> another) (>>another2 one);
        ).
      ).
    ).
    (should "(:>>= one another extra) works like (number of one:: >> another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert (number of one:: >>) (:>>= one);
          assert (number of one:: >> another) (:>>= one another);
          assert (number of one:: >> another) (:>>= one another another);
        ).
  ).
  (define "global: >>>=", (=> ()
    (should "'>>>=' is resolved to a function.", (=> ()
      assert ($>>>= is-a function);
      var >>>=_ >>>=;
      assert ($>>>=_ is-a function);
      assert ($>>>=_ is >>>=);
    ).
    (should "((>>>=) value) works like (number of value:: >>>).", (=> ()
      var *>>>= (>>>=);
      assert ($*>>>= is-a function);

      assert (number of null:: >>>) (*>>>= null);
      assert (number of type:: >>>) (*>>>= type);
      (for sample in samples
        assert (number of (sample the-type):: >>>) (*>>>= (sample the-type);
        assert (number of (sample "empty"):: >>>) (*>>>= (sample "empty");
        (for value in (sample values)
          assert (number of value:: >>>) (:*>>>= value);
        ).
    ).
    (should "((>>>= another extra) one) works like (number of one:: >>> another)).", (=> ()
      (for another in flat-samples
        var >>>another1 (>>>= another);
        assert ($>>>another1 is-a function);

        var >>>another2 (>>>= another another);
        assert ($>>>another2 is-a function);

        (for one in flat-samples
          assert (number of one:: >>> another) (>>>another1 one);
          assert (number of one:: >>> another) (>>>another2 one);
        ).
      ).
    ).
    (should "(:>>>= one another extra) works like (number of one:: >>> another).", (=> ()
      (for another in flat-samples
        (for one in flat-samples
          assert (number of one:: >>>) (:>>>= one);
          assert (number of one:: >>> another) (:>>>= one another);
          assert (number of one:: >>> another) (:>>>= one another another);
        ).
  ).
).
