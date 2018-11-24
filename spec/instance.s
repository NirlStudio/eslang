(var mammal (@:class
  type: (@ eyes: 2 legs: 4)
  age: 0
  height: 0
  weight: 0
  roar: (=() (print "..."),
  hop: (=() (print "hopping"),
),
(var the-type (var cat (@:class type: mammal
  name: "kitty"
  revived: false
  constructor: (= (a h w n)
    (if (a > 0) (let age a),
    (if (h > 0) (let height h),
    (if (w > 0) (let weight w),
    (if (n not-empty) (let name n),
  ),
  activator: (=()
    (let revived true)
  ),
  roar: (=() (mew),
  mew: (print "Mew!")
),
(var the-values (@
  (var kitty (@:cat),
  (var harry (@:cat name: "Harry"),
  (var thomas (@:cat age: 10 name: "Old Thomas"),
  (var kitty1 (cat of),
  (var kitty2 (cat of 2),
  (var kitty3 (cat of 3 20),
  (var kitty4 (cat of 4 10 1),
  (var tom (cat of 5 10 1 "Big Tom"),
),
(include "share/type")


(define "Class Instance Default Behaviours" (=> ()
  (define "Identity" (=> ()
    (should "an empty instance is also identitied by itself." (=> ()
      (assert ((@:cat) is-not (@:cat),
      (assert false ((@:cat) is (@:cat),

      (assert ((cat empty) is-not (cat empty),
      (assert false ((cat empty) is (cat empty),

      (assert ((cat of) is-not (cat of),
      (assert false ((cat of) is (cat of),
    ),
  ),

  (define "Equivalence" (= ()
    (should "an instance's equivalence is defined as the same of its identity." (=> ()
      (assert (:(tom "is") is (tom "equals"),
      (assert (:(tom "is-not") is (tom "not-equals"),
    ),
  ),

  (define "Ordering" (=> ()
    (should "comparison of an instance with itself returns 0." (=> ()
      (for a in (the-values concat (@:cat) (@:cat))
        (assert 0 (a compare a),
      ),
    ),
    (should "comparison of two different instances return null." (=> ()
      (var values (the-values concat (@:cat) (@:cat),
      (for a in values
        (for b in values
          (if (a is-not b)
            (assert null (a compare b),
      ),
    ),
  ),

  (define "Emptiness" (= ()
    (should "an instance is defined as empty if it has not field." (=> ()
      (assert ((@:cat) is-empty),
      (assert false ((@:cat) not-empty),

      (assert ((cat empty) is-empty),
      (assert false ((cat empty) not-empty),

      (assert ((cat of) is-empty),
      (assert false ((cat of) not-empty),
    ),
  ),

  (define "Encoding" (=> ()
    (should "an instance is encoded to a tuple." (=> ()
      (for value in (the-values concat (@:cat))
        (assert ((value to-code) is-a tuple),
      ),
    ),
  ),

  (define "Representation" (=> ()
    (should "an empty instance is represented as (@:name)." (=> ()
      (assert "(@:cat)" ((cat empty) to-string),
      (assert "(@:cat)" ((cat empty) to-string " "),
      (assert "(@:cat)" ((cat empty) to-string "  "),
      (assert "(@:cat)" ((cat empty) to-string "   "),
      (assert "(@:cat)" ((cat empty) to-string " " " "),
      (assert "(@:cat)" ((cat empty) to-string " " "  "),
      (assert "(@:cat)" ((cat empty) to-string " " "   "),
    ),
  ),
),
