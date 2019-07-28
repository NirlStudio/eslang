(var driver (@:class type: emitter,
  constructor: (=()
    (this as emitter "constructor") "ready", "data", "closed";
  ).
  activator: (=()
    (this as emitter "activator");
    (for event in (@ "ready", "data", "closed")
      if (listeners: event:: is null) (listeners: event (@));
    ).
  ).
).

(define "(emitter default)" (=> ()
  (should "(emitter default) constructs a default emitter instance." (=> ()
    var device (emitter default);
    assert (device is-a emitter);
    assert (device is-an object);
    assert (device listeners:: is-an object);

    var events (object fields-of (device listeners);
    assert 0 (events length);
  ).
).

(define "(emitter of ...)" (=> ()
  (should "(emitter of) constructs a new default emitter instance." (=> ()
    var device (emitter of);
    assert (device is-a driver);
    assert (device is-a emitter);
    assert (device is-an object);
    assert (device listeners:: is-an object);

    var events (object fields-of (device listeners);
    assert 0 (events length);

    let device (driver of);
    assert (device is-a driver);
    assert (device is-a emitter);
    assert (device is-an object);
    assert (device listeners:: is-an object);
    assert 3 (object fields-of (device listeners):: length);
  ).
  (should "(emitter of events ...) constructs a new emitter instance which allows given events." (=> ()
    var device (emitter of "a" "b" "c");
    assert (device is-a driver);
    assert (device is-a emitter);
    assert (device is-an object);
    assert (device listeners:: is-an object);

    var events (object fields-of (device listeners);
    assert 3 (events length);
    assert (events first-of "a" :: >= 0);
    assert (events first-of "b" :: >= 0);
    assert (events first-of "c" :: >= 0);
  ).
).

(define "(@:emitter ...)" (=> ()
  (should "(@:emitter ...) activates a new emitter instance and cleans up empty event listeners." (=> ()
    (var device (@:driver listeners: (@
      ready: (@).
      data: (@ (=).
      closed: (@
        (=() (print "device is closed.").
      ).
    ).
    assert (device is-a driver);
    assert (device is-a emitter);
    assert (device is-an object);
    assert (device listeners:: is-an object);
    assert 3 (object fields-of (device listeners):: length);
    assert 0 (device listeners:: ready:: length);
    assert 0 (device listeners:: data:: length);
    assert 1 (device listeners:: closed:: length);
  ).
  (should "(@:emitter ...) tries to fix a corrupted instance." (=> ()
    var device (@:driver);
    assert (device is-a driver);
    assert (device is-a emitter);
    assert (device is-an object);
    assert (device listeners:: is-an object);
    assert 3 (object fields-of (device listeners):: length);
    assert 0 (device listeners:: ready:: length);
    assert 0 (device listeners:: data:: length);
    assert 0 (device listeners:: closed:: length);
  ).
).

(define "(an-emitter on ...)." (=> ()
  (should "(an-emitter on) returns event list." (=> ()
    var device (driver default);
    var events (device on);
    assert (events is-an array);
    assert 3 (events length);
    assert "ready" (events 0);
    assert "data" (events 1);
    assert "closed" (events 2);
  ).
  (should "(an-emitter on event) returns registered listeners for this event." (=> ()
    var device (driver default);
    var listeners (device on "ready");
    assert (listeners is-an array);
    assert 0 (listeners length);

    device listeners:: ready:: push (=);
    let listeners (device on "ready");
    assert (listeners is-an array);
    assert 1 (listeners length);
  ).
  (should "(an-emitter on event listener) registers a listener for this event." (=> ()
    var device (driver default);
    let listeners (device on "ready" (=);
    assert (listeners is-an array);
    assert 1 (listeners length);

    let listeners (device on "ready" (->);
    assert (listeners is-an array);
    assert 2 (listeners length);

    let listeners (device on "ready" (=>);
    assert (listeners is-an array);
    assert 3 (listeners length);

    let listeners (device on "ready" (=?);
    assert (listeners is-an array);
    assert 3 (listeners length);

    let listeners (device on "ready" true);
    assert (listeners is-an array);
    assert 3 (listeners length);
  ).
).

(define "(an-emitter off ...)" (=> ()
  (should "(an-emitter off) removes all listeners." (=> ()
    var device (driver default);
    assert 1 (device on "ready" (=):: length);
    assert 1 (device on "data" (->):: length);
    assert 1 (device on "closed" (=>):: length);

    var events (device off);
    assert (events is-an array);
    assert "ready" (events 0);
    assert "data" (events 1);
    assert "closed" (events 2);

    assert 0 (device on "ready":: length);
    assert 0 (device on "data":: length);
    assert 0 (device on "closed":: length);
  ).
  (should "(an-emitter off event) removes all listeners for the event." (=> ()
    var device (driver default);
    assert 1 (device on "ready" (=):: length);
    assert 1 (device on "data" (->):: length);
    assert 1 (device on "closed" (=>):: length);

    var listeners (device off "ready");
    assert (listeners is-an array);
    assert (listeners is-empty);
  ).
  (should "(an-emitter off event listener) removes a listener for the event." (=> ()
    var device (driver default);
    var listener (=() (print arguments);
    assert 1 (device on "ready" listener:: length);
    assert 1 (device on "data" listener:: length);
    assert 1 (device on "closed" listener:: length);

    var listeners (device off "ready" (=));
    assert (listeners is-an array);
    assert 1 (listeners length);

    var listeners (device off "ready" listener);
    assert (listeners is-an array);
    assert 0 (listeners length);
  ).
).

(define "(an-emitter emit ...)" (=> ()
  (should "(an-emitter emit) returns null." (=> ()
    var device (driver default);
    assert null (device emit);
  ).
  (should "(an-emitter emit event) returns null if event is not a string." (=> ()
    var device (driver default);
    assert null (device emit true);
    assert null (device emit 0);
    assert null (device emit (`ready);
  ).
  (should "(an-emitter emit event) returns a boolean value indicating if the event is ever handled by any listener." (=> ()
    var device (driver default);
    assert false (device emit "ready");
    device on "ready" (=);
    assert true (device emit "ready");

    var length 0;
    device on "data" (=>() (length ++);
    device on "data" (=>() (length += 2);
    assert true (device emit "data");
    assert 3 length;
  ).
  (should "(an-emitter emit event) stops when a listener returns literal value true." (=> ()
    var device (driver default);
    var length 0;
    device on "data" (=>() (length += 100) true;
    device on "data" (=>() (length += 200);
    assert true (device emit "data");
    assert 100 length;
  ).
  (should "(an-emitter emit event args) passes args to listeners." (=> ()
    var device (driver default);
    var args (@);
    var received-args;
    (device on "ready" (=> args
      let received-args args;
    ).
    assert true (device emit "ready" args);
    assert (received-args is args);
  ).
  (should "(an-emitter emit event args) passes the event source to listeners." (=> ()
    var device (driver default);
    var event-source;
    (device on "ready" (=> (args, source)
      let event-source source;
    ).
    assert true (device emit "ready");
    assert (event-source is device);
  ).
).
