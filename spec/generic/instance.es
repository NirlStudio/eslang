(var mammal (@:class
  type: (@ eyes: 2 legs: 4)
  age: 0
  height: 0
  weight: 0
  roar: (=() ("..." + age).
  hop: (=>() ("hopping" + age).
).
(var * (load "share/type" (@
  the-type: (var cat (@:class type: mammal
    name: "kitty"
    revived: false
    constructor: (= (a h w n)
      (if (a > 0) (let age a).
      (if (h > 0) (let height h).
      (if (w > 0) (let weight w).
      (if (n not-empty) (let name n).
    ).
    activator: (=()
      (let revived true)
    ).
    roar: (=() (mew).
    mew: (=() "Mew!").
  ).
  the-values: (@
    (var kitty (@:cat).
    (var harry (@:cat name: "Harry").
    (var thomas (@:cat age: 10 name: "Old Thomas").
    (var kitty1 (cat of).
    (var kitty2 (cat of 2).
    (var kitty3 (cat of 3 20).
    (var kitty4 (cat of 4 10 1).
    (var tom (cat of 5 10 1 "Big Tom").
  ).
).

(define "Class Instance Default Behaviors" (=> ()
  (define "Identity" (=> ()
    (should "an empty instance is also identified by itself." (=> ()
      (assert ((@:cat) is-not (@:cat).
      (assert false ((@:cat) is (@:cat).

      (assert ((cat empty) is-not (cat empty).
      (assert false ((cat empty) is (cat empty).

      (assert ((cat of) is-not (cat of).
      (assert false ((cat of) is (cat of).
    ).
  ).

  (define "Equivalence" (=> ()
    (should "an instance's equivalence is defined as the same of its identity." (=> ()
      (var values (the-values concat (@:cat) (@:cat).
      (for a in values
        (for b in values
          (assert (a is b) (a equals b).
          (assert (a is b) (b equals a).
          (assert (a is-not b) (a not-equals b).
          (assert (a is-not b) (b not-equals a).
        ).
      ).
    ).
  ).

  (define "Ordering" (=> ()
    (should "comparison of an instance with itself returns 0." (=> ()
      (for a in (the-values concat (@:cat) (@:cat))
        (assert 0 (a compare a).
      ).
    ).
    (should "comparison of two different instances return null." (=> ()
      (var values (the-values concat (@:cat) (@:cat).
      (for a in values
        (for b in values
          (if (a is-not b)
            (assert null (a compare b).
      ).
    ).
  ).

  (define "Emptiness" (= ()
    (should "an instance is defined as empty if it has not field." (=> ()
      (assert ((@:cat) is-empty).
      (assert false ((@:cat) not-empty).

      (assert ((cat empty) is-empty).
      (assert false ((cat empty) not-empty).

      (assert ((cat of) is-empty).
      (assert false ((cat of) not-empty).
    ).
  ).

  (define "Encoding" (=> ()
    (should "an instance is encoded to a tuple." (=> ()
      (for value in (the-values concat (@:cat))
        (assert ((value to-code) is-a tuple).
      ).
    ).
    (should "a complex instance is represented as a lambda tuple." (=> ()
      (var obj (@ x: 1).
      (obj "self" obj).
      (var kitty1 (cat of 1 10 1.5).
      (var kitty2 (cat of 2 20 2.5).
      (kitty2 "self" (@ obj kitty2).
      (kitty1 "friend" kitty2).
      (kitty2 "friend" kitty1).

      (var code (kitty1 to-code).
      (var k1 (code).
      (var k2 (k1 friend).
      (assert (k1 is-a cat).
      (assert (k2 is-a cat).
      (assert k1 (k2 friend).

      (let k1 (cat from k1).
      (let k2 (cat from k2).

      (assert 1 (k1 age).
      (assert 10 (k1 height).
      (assert 1.5 (k1 weight).

      (assert 2 (k2 age).
      (assert 20 (k2 height).
      (assert 2.5 (k2 weight).

      (var k1 (eval code).
      (var k2 (k1 friend).
      (assert false (k1 is-a cat).
      (assert false (k2 is-a cat).
      (assert k1 (k2 friend).

      (let k1 (cat from k1).
      (let k2 (cat from k2).

      (assert 1 (k1 age).
      (assert 10 (k1 height).
      (assert 1.5 (k1 weight).

      (assert 2 (k2 age).
      (assert 20 (k2 height).
      (assert 2.5 (k2 weight).
    ).
  ).

  (define "Representation" (=> ()
    (should "an empty instance is represented as (@:name)." (=> ()
      (assert "(@:cat)" ((cat empty) to-string).
      (assert "(@:cat)" ((cat empty) to-string " ").
      (assert "(@:cat)" ((cat empty) to-string "  ").
      (assert "(@:cat)" ((cat empty) to-string "   ").
      (assert "(@:cat)" ((cat empty) to-string " " " ").
      (assert "(@:cat)" ((cat empty) to-string " " "  ").
      (assert "(@:cat)" ((cat empty) to-string " " "   ").
    ).
    (should "an instance is represented as an object with type." (=> ()
      (assert "(@:cat age: 1)" ((cat of 1) to-string).
      (assert "(@:cat)" (kitty1 to-string).
      (assert "(@:cat age: 2)" (kitty2 to-string).
      (assert "(@:cat age: 3 height: 20)" (kitty3 to-string).
      (assert "(@:cat age: 4 height: 10 weight: 1)" (kitty4 to-string).
    ).
    (should "a complex instance is represented as a immediate evaluation lambda." (=> ()
      (var kitty1 (cat of 1 10 1).
      (var kitty2 (cat of 2 20 2).
      (kitty1 "friend" kitty2)
      (kitty2 "firend" kitty1)
      (assert (kitty1 to-string) ((kitty1 to-code) to-string).
    ).
  ).
).

(define "Customize Object Behaviors" (=> ()
  (define "Identity" (= ()
    (var cls (@:class
      is: (=(another) (name == (another name).
      equals: (=() false).
    ).
    (var inst1 (@:cls name: "tom").
    (var inst2 (@:cls name: "tom").
    (var inst3 (@:cls name: "thomas").
    (should "The same instance are always identical." (=> ()
      (assert (inst1 is inst1).
      (assert false (inst1 is-not inst1).

      (assert (inst2 is inst2).
      (assert false (inst2 is-not inst2).

      (assert (inst3 is inst3).
      (assert false (inst3 is-not inst3).
    ).
    (should "Different instances can be defined as identical." (=> ()
      (assert (inst1 is inst2).
      (assert (inst2 is inst1).
      (assert false (inst1 is-not inst2).
      (assert false (inst2 is-not inst1).

      (assert (inst1 is-not inst3).
      (assert false (inst1 is inst3).
      (assert (inst2 is-not inst3).
      (assert false (inst2 is inst3).
    ).
    (should "Identical instances are always equivalent." (=> ()
      (assert (inst1 equals inst2).
      (assert (inst2 equals inst1).
      (assert false (inst1 not-equals inst2).
      (assert false (inst2 not-equals inst1).

      (assert (inst1 not-equals inst3).
      (assert false (inst1 equals inst3).
      (assert (inst2 not-equals inst3).
      (assert false (inst2 equals inst3).
    ).
  ).

  (define "Equivalence" (= ()
    (var cls (@:class
      equals: (=(another) (name == (another name).
    ).
    (var inst1 (@:cls name: "tom").
    (var inst2 (@:cls name: "tom").
    (var inst3 (@:cls name: "thomas").
    (should "The same instance are always equivalent." (=> ()
      (assert (inst1 equals inst1).
      (assert false (inst1 not-equals inst1).

      (assert (inst2 equals inst2).
      (assert false (inst2 not-equals inst2).

      (assert (inst3 equals inst3).
      (assert false (inst3 not-equals inst3).
    ).
    (should "Different instances may be defined as equivalent." (=> ()
      (assert (inst1 equals inst2).
      (assert (inst2 equals inst1).
      (assert false (inst1 not-equals inst2).
      (assert false (inst2 not-equals inst1).
    ).
    (should "Different instances may be defined as nonequivalent." (=> ()
      (assert (inst1 is-not inst3).
      (assert (inst3 is-not inst1).
      (assert false (inst1 is inst3).
      (assert false (inst2 is inst1).

      (assert (inst2 is-not inst3).
      (assert (inst3 is-not inst2).
      (assert false (inst2 is inst3).
      (assert false (inst3 is inst2).
    ).
  ).

  (define "Ordering" (= ()
    (var cls (@:class
      equals: (=(another) (value == (another value).
      compare: (=(another) (value - (another value) -1).
    ).
    (var inst1 (@:cls value: 8).
    (var inst2 (@:cls value: 8).
    (var inst3 (@:cls value: 7).
    (should "comparison of an instance with itself always returns 0." (=> ()
      (assert 0 (inst1 compare inst1).
      (assert 0 (inst2 compare inst2).
      (assert 0 (inst3 compare inst3).
    ).
    (should "comparison two equivalent instances always returns 0." (=> ()
      (assert (inst1 equals inst2).
      (assert 0 (inst1 compare inst2).

      (assert (inst2 equals inst1).
      (assert 0 (inst2 compare inst1).
    ).
    (should "a positive value will be converted to 1." (=> ()
      (assert (inst1 not-equals inst3).
      (assert false (inst1 equals inst3).
      (assert 1 (inst1 compare inst3).
    ).
    (should "a zero value will be kept." (=> ()
      (assert 0 (inst3 compare inst1).
    ).
    (should "a negative value will be converted to -1." (=> ()
      (var inst4 (@:cls value: 6).
      (assert -1 (inst4 compare inst1).
    ).
    (should "a not-a-number value will be converted to null." (=> ()
      (var inst4 (@:cls value: (number invalid).
      (assert null (inst4 compare inst1).
      (assert null (inst1 compare inst4).

      (let inst4 (@:cls value: true).
      (assert null (inst4 compare inst1).
      (assert 1 (inst1 compare inst4).

      (let inst4 (@:cls value: (@).
      (assert null (inst4 compare inst1).
      (assert null (inst1 compare inst4).
    ).
  ).

  (define "Emptiness" (= ()
    (var cls (@:class
      is-empty: (=() (value is-empty).
    ).
    (var inst1 (@:cls value: false).
    (var inst2 (@:cls value: 0).
    (var inst3 (@:cls value: (@).
    (var inst4 (@:cls value: true).
    (var inst5 (@:cls value: 1).
    (var inst6 (@:cls value: (@ 1).
    (should "an instance may be defined as empty by it meaning." (=> ()
      (assert (inst1 is-empty).
      (assert false (inst1 not-empty).

      (assert (inst2 is-empty).
      (assert false (inst2 not-empty).

      (assert (inst3 is-empty).
      (assert false (inst3 not-empty).
    ).
    (should "an instance may be defined as not-empty by it meaning." (=> ()
      (assert (inst4 not-empty).
      (assert false (inst4 is-empty).

      (assert (inst5 not-empty).
      (assert false (inst5 is-empty).

      (assert (inst6 not-empty).
      (assert false (inst6 is-empty).
    ).
  ).

  (define "Encoding" (= ()
    (var cat (@:class
      to-code: (=() (@ name: name).
    ).
    (var dog (@:class
      constructor: (= name (this "name" name).
      to-code: (=() (tuple of (`dog) (`of) name).
    ).
    (var kitty (@:cat name: "Tom").
    (var puppy (@:dog name: "Sammy").
    (should "an instance can encode itself to a common object." (=> ()
      (var code (kitty to-code).
      (assert (code is-a tuple).
      (assert 6 (code length).
      (assert (symbol literal) (code 0).
      (assert (symbol pairing) (code 1).
      (assert (` cat) (code 2).
      (assert (` name) (code 3).
      (assert (symbol pairing) (code 4).
      (assert "Tom" (code 5).
    ).
    (should "an instance can encode itself to a non-plain tuple." (=> ()
      (var code (puppy to-code).
      (assert (code is-a tuple).
      (assert 3 (code length).
      (assert (` dog) (code 0).
      (assert (` of) (code 1).
      (assert "Sammy" (code 2).
    ).
    (should "a plain tuple and value of any other type will be ignored." (=> ()
      (var lion (@:class
        constructor: (= name (this "name" name).
        to-code: (=() (tuple of-plain (`lion) (`of) name).
      ).
      (var cub (lion of "Sinba").
      (var code (cub to-code).
      (assert (code is-a tuple).
      (assert 6 (code length).
      (assert (symbol literal) (code 0).
      (assert (symbol pairing) (code 1).
      (assert (` lion) (code 2).
      (assert (` name) (code 3).
      (assert (symbol pairing) (code 4).
      (assert "Sinba" (code 5).
    ).
    (should "an instance can replace its type before encoding." (=> ()
      (var kitty (@:cat name: "Tom").
      (object set kitty "type" dog).
      (var code (kitty to-code).
      (assert (code is-a tuple).
      (assert 6 (code length).
      (assert (symbol literal) (code 0).
      (assert (symbol pairing) (code 1).
      (assert (` dog) (code 2).
      (assert (` name) (code 3).
      (assert (symbol pairing) (code 4).
      (assert "Tom" (code 5).
    ).
  ).

  (define "Representation" (= ()
    (var cat (@:class
      to-string: (=() ("cat is " + name ", " (arguments join).
    ).
    (var kitty (@:cat name: "Tom").
    (should "a class can cusomtized its to-string logic." (=> ()
      (assert "cat is Tom, " (kitty to-string).
    ).
    (should "cusomtized to-string can receive extra argument(s) to help formatting." (=> ()
      (assert "cat is Tom, Mew!" (kitty to-string "Mew!").
      (assert "cat is Tom, Mew! ..." (kitty to-string "Mew!" "...").
    ).
  ).

  (define "Indexer" (= ()
    (var cat (@:class x: 100 y: 200 type: (@
      indexer: (= i ((i == 1) ? x y).
    ).
    (var kitty1 (cat default).
    (var kitty2 (@:cat x: 1000 y: 2000).
    (should "a class cannot customize its indexer logic for symbol index." (=> ()
      (assert 100 (kitty1 x).
      (assert null (kitty1 xx).
      (assert 1000 (kitty2 x).
      (assert null (kitty2 xx).
    ).
    (should "a class cannot customize its indexer logic for string index." (=> ()
      (assert 100 (kitty1 "x").
      (assert null (kitty1 "xx").
      (assert 1000 (kitty2 "x").
      (assert null (kitty2 "xx").
    ).
    (should "a class can customized its indexer logic for other index values." (=> ()
      (assert 200 (kitty1 0).
      (assert 100 (kitty1 1).
      (assert 200 (kitty1 2).
      (assert 200 (kitty1 3).
      (assert 200 (kitty1 (number invalid).

      (assert 2000 (kitty2 true).
      (assert 1000 (kitty2 (`x).
      (assert 1000 (kitty2 ("x").
      (assert 2000 (kitty2 (@).
      (assert 2000 (kitty2 (@:).

      (assert null (kitty2 (=).
      (assert null (kitty2 (=>).
      (assert null (kitty2 (=?).

      (assert 2000 (kitty2: (=).
      (assert 2000 (kitty2: (=>).
      (assert 2000 (kitty2: (=?).
    ).
  ).
).

(define "Class Design Patterns" (=> ()
  (define "Class Name" (=> ()
    (should "a new anonymous class returned by (@:class ...) gets its name from its first name." (=> ()
      (var cls1 (@:class x: 1).
      (assert "cls1" (cls1 name).

      (var cls11 cls1).
      (assert "cls1" (cls11 name).

      (let cls2 (@:class type: cls1 y: 2).
      (assert "cls2" (cls2 name).
      (let cls22 cls2)
      (assert "cls2" (cls22 name).

      (local cls3 (@:class type: cls2 z: 3).
      (assert "cls3" (cls3 name).
      (local cls33 cls3)
      (assert "cls3" (cls33 name).

      (assert 1 ((cls33 empty) x).
      (assert 2 ((cls33 default) y).
      (assert 3 ((cls33 of) z).
      (assert 3 ((cls33 from) z).
    ).
    (should "(@:class type: (@ name: ...)) sets the new class' name explicitly." (=> ()
      (var cls1 (@:class type: (@ name: "Cat")).
      (assert "Cat" (cls1 name).

      (var cls11 cls1).
      (assert "Cat" (cls11 name).

      (let cls22 cls1)
      (assert "Cat" (cls22 name).

      (local cls33 cls1)
      (assert "Cat" (cls33 name).
    ).
    (should "(class of (@ type: (@ name: ...))) sets the new class' name explicitly." (=> ()
      (var cls1 (class of (@ type: (@ name: "Cat")).
      (assert "Cat" (cls1 name).

      (var cls11 cls1).
      (assert "Cat" (cls11 name).

      (let cls22 cls1)
      (assert "Cat" (cls22 name).

      (local cls33 cls1)
      (assert "Cat" (cls33 name).
    ).
  ).
  (define "Static Type Members" (=> ()
    (should "All type members are read-only, so they should be initialized in definition." (=> ()
      (var cls (@:class type: (@
        x: 1
        y: 2
        add: (= z (+ x y z).
      ).

      (assert 1 (cls x).
      (assert 1 (cls "x" 2).

      (assert 2 (cls y).
      (assert 2 (cls "y" 4).

      (assert 3 (cls add).
      (assert 6 (cls add 3).
    ).
    (should "A read-only static member are still be mutable if it's type is a mutable type." (=> ()
      (var cls (@:class type: (@
        x: (@)
        y: (@:)
      ).

      (assert 0 ((cls x) length).
      ((cls x) push 1 2 3).
      (assert 3 ((cls x) length).

      (assert null ((cls y) length).
      ((cls y) "length" 100).
      (assert 100 ((cls y) length).
    ).
  ).
  (define "Default Member Values" (=> ()
    (should "an instance member can have a atom value as the share default value." (=> ()
      (var cls (@:class x: 1 y: 2).
      (var inst1 (@:cls x: 11).
      (assert 11 (inst1 x).
      (assert 2 (inst1 y).
      (assert 12 (inst1 "y" 12).
      (assert 12 (inst1 y).

      (var inst2 (@:cls y: 22).
      (assert 1 (inst2 x).
      (assert 101 (inst2 "x" 101).
      (assert 101 (inst2 x).
      (assert 22 (inst2 y).

      (assert 11 (inst1 x).
      (assert 12 (inst1 y).
    ).
    (should "an instance member is always set on the instance." (=> ()
      (var cls (@:class x: 1 y: 2).
      (var inst (@:cls).
      (assert 1 (inst x).
      (assert 2 (inst y).
      (assert 0 ((object fields-of inst) length).

      (let inst (cls empty).
      (assert 1 (inst x).
      (assert 2 (inst y).
      (assert 0 ((object fields-of inst) length).

      (let inst (cls default).
      (assert 1 (inst x).
      (assert 2 (inst y).
      (assert 0 ((object fields-of inst) length).

      (let inst (cls of).
      (assert 1 (inst x).
      (assert 2 (inst y).
      (assert 0 ((object fields-of inst) length).

      (let inst (cls from).
      (assert 1 (inst x).
      (assert 2 (inst y).
      (assert 0 ((object fields-of inst) length).

      (assert 11 (inst "x" 11).
      (assert 22 (inst "y" 22).
      (assert 2 ((object fields-of inst) length).
      (assert 11 (inst x).
      (assert 22 (inst y).
    ).
    (should "the default value of an instance member can only be an atomic value or operation." (=> ()
      (var cls (@:class x: 1 a: (@) o: (@:) c: (@:cat).
      (var inst (@:cls).
      (assert 1 (inst x).
      (assert null (inst o).
      (assert null (inst a).
      (assert null (inst c).
  ).
  (define "Inheritance" (=> ()
    (should "a class gains its parent type's static member." (=> ()
      (assert 2 (cat eyes).
      (assert 4 (cat legs).
    ).
    (should "a instance gains its parent type's instance member." (=> ()
      (assert "hopping0" (kitty1 hop).
      (assert "hopping2" (kitty2 hop).
      (assert "hopping3" (kitty3 hop).
      (assert "hopping4" (kitty4 hop).
    ).
  ).
  (define "Restricted Multi-Inheritance" (=> ()
    (should "a class can be extended, but not be modified." (=> ()
      (var dog (@:class type: mammal
        bark: (=() "Woof!").
      ).
      (dog as cat (@
        bark: (=() "Bark!").
        woof: (=() "Bark!").
      ).
      (var puppy (dog of 3).
      (assert "Woof!" (puppy bark).
      (assert "Mew!" (puppy mew).
      (assert "...3" (puppy roar).
      (assert "Bark!" (puppy woof).
    ).
  ).
  (define "Virtual Overriding" (=> ()
    (should "an instance's equivalence is defined as the same of its identity." (=> ()
      (assert "Mew!" (kitty roar).
    ).
  ).
  (define "Instance Overriding" (=> ()
    (should "an instance member may override type's instance member." (=> ()
      (var kitty (@:cat
        mew: (=() "Woof!").
        roar: (=() "Bark!").
      ).
      (assert "Woof!" (kitty mew).
      (assert "Bark!" (kitty roar).
    ).
  ).
  (define "Acess Overridden Members" (=> ()
    (var kitty (@:cat
      age: 2
      mew: (=() "Woof!").
      roar: (=() "Bark!").
    ).
    (should "an instance of a type can personate another type." (=> ()
      (assert "Bark!" (kitty roar).
      (var m (kitty as mammal).

      (assert (m is-an object).
      (assert 0 (m age).
      (assert 0 (m height).
      (assert 0 (m weight).

      (assert ($(m "roar") is-a lambda).
      (assert ($(m "roar") is-bound).
      (assert kitty ($(m "roar") this).

      (assert ($(m "hop") is-a function).
      (assert ($(m "hop") is-bound).
      (assert kitty ($(m "hop") this).

      (assert "...2" (m roar).
      (assert "hopping2" (m hop).
    ).
    (should "an instance can call another type's method on itself." (=> ()
      (var roar (kitty as mammal "roar").
      (assert ($roar is-a lambda).
      (assert ($roar is-bound).
      (assert kitty ($roar this).

      (kitty "age" 10)
      (assert "...10" (roar ).
    ).
  ).
  (define "Abstract/Empty Members" (=> ()
    (should "an abstract member can be indicated by null or an empty lambda or function." (=> ()
      (var base (@:class walk: null run: (lambda empty) fly: (function empty).
      (var cls (@:class type: bsae
        walk: (=() "walking").
      ).
      (var inst (cls default).
      (assert "walking" (inst walk).
      (assert null (inst run).
      (assert null (inst fly).
    ).
  ).
).
