(define "(timer timeout ...)" (= ()
  (should "(timer timeout milliseconds listener) returns a canceling function." (= ()
    var cancel (timer timeout);
    assert ($cancel is-a function);

    let cancel (timer timeout 10);
    assert ($cancel is-a function);

    let cancel (timer timeout 10 (=);
    assert ($cancel is-a function);
  ),
  (should "milliseconds will be replaced to 0 if it's not a positive number." (= ()
    var timespan;
    (var cancel (timer timeout true (=>(ts)
      let timespan ts;
    ),
    assert ($cancel is-a function);

    cancel;
    assert 0 timespan;
  ),
  (should "the canceling function can be called to cancel the timeout request." (= ()
    var timespan;
    var source;
    var event;
    (var cancel (timer timeout 10 (=>()
      let (timespan source event) arguments;
    ),
    assert ($cancel is-a function);

    cancel;
    assert 10 timespan;
    assert (source is-a emitter)
    assert "cancelled" event;
  ),
),

(define "(timer default)" (=> ()
  (should "(timer of) constructs a new timer with a default interval value of 1000." (=> ()
    var t (timer of);
    assert (t is-a timer);
    assert (t is-a emitter);
    assert (t is-a object);
    assert 1000 (t interval);
  ),
),

(define "(timer of ...)" (=> ()
  (should "(timer of) constructs a new timer with the interval value 1000." (=> ()
    var t (timer of);
    assert (t is-a timer);
    assert (t is-a emitter);
    assert (t is-a object);
    assert 1000 (t interval);
  ),
  (should "(timer of interval) constructs a new timer of the interval." (=> ()
    var t (timer of 10);
    assert (t is-a timer);
    assert (t is-a emitter);
    assert (t is-a object);
    assert 10 (t interval);
  ),
  (should "(timer of interval on-elapsed) registers the listener for event elapsed." (=> ()
    var on-elapsed (=);
    var t (timer of 10 on-elapsed);
    assert (t is-a timer)
    assert (t is-a emitter)
    assert (t is-a object)

    assert 1 (t listeners:: elapsed:: length)
    assert on-elapsed (t listeners:: elapsed:: 0)
  ),
  (should "a timer instance has events of 'started', 'elapsed' and 'stopped'." (=> ()
    var t (timer of);
    var events (object fields-of (t listeners);
    assert (events is-a array);
    assert 3 (events length);
    assert (events first-of "started":: >= 0);
    assert (events first-of "elapsed":: >= 0);
    assert (events first-of "stopped":: >= 0);
  ),
),

(define "(@:timer ...)" (=> ()
  (should "(@:timer ...) activates a new timer instance and cleans up empty event listeners." (=> ()
    (var t (@:timer
      interval: 100,
      listeners: (@
        started: (@),
        elapsed: (@ (=),
        stopped: (@
          (=() (print "timer is stopped."),
        ),
      ),
    ),
    assert (t is-a timer);
    assert (t is-a emitter);
    assert (t is-a object);
    assert 100 (t interval);

    assert (t listeners:: is-a object);
    assert 3 (object fields-of (t listeners):: length);
    assert 0 (t listeners:: started:: length);
    assert 0 (t listeners:: elapsed:: length);
    assert 1 (t listeners:: stopped:: length);
  ),
),

(define "(a-timer start ...)" (=> ()
  (should "(a-timer start) enables the timer to run and triggers a 'started' event." (=> ()
    var (args, source, event);
    var t (timer of 100);
    (t on "started" (=> ()
      let (args, source, event) arguments;
    ),

    t start; t stop;
    assert "started" args;
    assert t source;
    assert "started" event;
  ),
  (should "(a-timer start args) enables the timer with a customized event args." (=> ()
    var (args, source, event);
    var t (timer of 100);
    (t on "started" (=> ()
      let (args, source, event) arguments;
    ),

    var args- (@ x: 128);
    t start args-; t stop;
    assert args- args;
    assert t source;
    assert "started" event;
  ),
  (should "(a-timer start) does nothing for an active timer." (=> ()
    var (args, source, event);
    var t (timer of 100);
    (t on "started" (=> ()
      let (args, source, event) arguments;
    ),

    var args- (@ x: 128);
    t start args-; t stop;
    assert args- args;
    assert t source;
    assert "started" event;

    let (args, source, event) null;
    t start args-;
    assert null args;
    assert null source;
    assert null event;
  ),
),

(define "(a-timer is-elapsing)" (=> ()
  (should "(a-timer is-elapsing) returns false if the timer is not active yet." (=> ()
    var t (timer default);
    assert false (t is-elapsing);
  ),
  (should "(a-timer is-elapsing) returns false if the timer is not active yet." (=> ()
    var t (timer default);
    t start;
    assert true (t is-elapsing);
    t stop;
  ),
),

(define "(a-timer stop)" (=> ()
  (should "(a-timer stop) disables the timer and triggers a 'stopped' event." (=> ()
    var (args, source, event);
    var t (timer of 100);
    (t on "stopped" (=> ()
      let (args, source, event) arguments;
    ),

    t start; t stop;
    assert "stopped" args;
    assert t source;
    assert "stopped" event;
  ),
  (should "(a-timer stop) does nothing for an inactive timer." (=> ()
    var (args, source, event);
    var t (timer of 100);
    (t on "stopped" (=> ()
      let (args, source, event) arguments;
    ),

    t stop;
    assert null args;
    assert null source;
    assert null event;
  ),
),
