(var step (=> (i)
  var value (i * 100);
  print 'step-$i $value @$(date timestamp)';
  value
).

(var print-p (=> (expected)
  (p finally (=> waiting
    print "waiting finished:", expected;
    (waiting "excuse":: ?
      print "excuse:", (waiting "excuse");
      print "result:", (waiting "result");
    ).
).

(var p (commit
  (=> async
    (timer timeout 100 (=>()
      async resolve (step 1);
  ).
  (@ 110).
  (=> waiting
    print "from step-1.1", waiting;
    (=> async
      (timer timeout 100 (=>()
        async resolve (step 1.2);
    ).
  ).
  (@ 130).
  (=> waiting
    print "from step-1.3", waiting;
    (promise of (=> async
      (timer timeout 100 (=>()
        async resolve (step 1.4);
    ).
  ).
).
print-p 140;

(let p (commit
  (=> async
    (timer timeout 100 (=>()
      async resolve (step 2);
  ).
  (=> waiting
    print "from step-2", waiting;
    (promise of (=> async
      (timer timeout 100 (=>()
        async resolve (step 2.1);
    ).
  ).
).
print-p 210;

(let p (commit
  (=> async
    (timer timeout 100 (=>()
      async resolve (step 3);
  ).
  (@ 310).
  (=> value
    print "from step-3.1", value;
    (promise of (=> async
      (timer timeout 100 (=>()
        async resolve (step 3.2);
    ).
  ).
  (@ null 330).
).
print-p 330;

(let p (commit
  (=> async
    (timer timeout 100 (=>()
      async resolve (step 4);
  ).
  (=> waiting
    print "from step-4", waiting;
    (promise of (=> async
      (timer timeout 100 (=>()
        async resolve (step 4.1);
    ).
  ).
  (= waiting
    @ (waiting result:: + 10);
  ).
  (= value
    @ (value + 10);
  ).
  (=> value
    print "from step-4.3", value;
    (=> async
      (timer timeout 100 (=>()
        async resolve (step 4.4);
    ).
  ).
  (@ null 450).
).
print-p 450;

(let p (commit
  (=> async
    (timer timeout 100 (=>()
      async reject (step 5);
  ).
  (=> waiting
    print "from step-5", waiting;
    (promise of (=> async
      (timer timeout 100 (=>()
        async reject (step 5.1);
    ).
  ).
  (= waiting
    print "from step-5.1", waiting;
    @ (waiting excuse:: + 10). 10, 1;
  ).
  (=> (base, increment, extra)
    print "from step-5.2", base, arguments;
    @ (base + increment extra);
  ).
  (=> value
    print "from step-5.31", value;
    (=> async
      (timer timeout 100 (=>()
        async resolve (step 5.4);
    ).
  ).
  (@ null 550).
).
print-p 550;

(let p (commit*
  (=> async
    (timer timeout 110 (=>()
      async resolve (step 6.1);
  ).
  (=> async
    (timer timeout 120 (=>()
      async resolve (step 6.2);
  ).
).
print-p (@ 610, 620);

(let p (commit?
  (=> async
    (timer timeout 110 (=>()
      async resolve (step 7.1);
  ).
  (=> async
    (timer timeout 120 (=>()
      async resolve (step 7.2);
  ).
).
print-p 710;

(var p1 (promise of (= async
  (timer timeout 100 (=> ms
    async resolve ms;
  ).
).
var p2 (timer countdown 200);
var pall (promise all (@ p1 p2);
(pall finally (= waiting
  print "finalized1" waiting;
).
(pall finally (= waiting
  print "finalized2" waiting;
).

var timeout;
(var wait (promise of (=> async
  (let timeout (timer timeout 1000 (=> ms
    print "timeouted" ms;
    async resolve ms;
  ).
).

(var pw (wait then (= waiting
  print "waiting" waiting;
  @ (waiting result);
).

(var px (promise of (=> async
  (pw finally (=> waiting
    print "waiting completed" waiting;
    async resolve null;
  ).
).

(promise all (@ pw px):: finally (= waiting
  print "all completed" waiting;
).

(` running...)
