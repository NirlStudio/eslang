#!/usr/bin/env es

(if (-app is -module)
  (print "Usage:\tes\t\t\t\tuse Espresso interactively.\
    \tes app[.es] [options ...]\texecute an Espresso file.\
    \tes test [[test-file] ...]\trun one or more test suites.\
    \tes selftest [[spec] ...]\trun all or given spec cases.\
    \tes version\t\t\tdisplay Espresso version.\
    \tes help\t\t\tdisplay this help information."
  ).
  return;
).

export _library (object assign (@:) (this _library);

(export set (=> (subject content)
  (if (subject is-a string:: && (content is-a string:: or (content is-an object).
    _library: subject content;
).

(export get (=> (subject topic)
  var content (_library: (subject ?* "help");
  (content is-a string:: ? content
    (topic is-not-a string:: ? (content ".")
        (content: topic:: ?* (content: ".").
).

# provide help content for shell object and functions.
(for subject in
  (@ "debug", "echo", "loader", "logging")
  set '.$subject', (load 'help/shell/$subject');
).

# provide help content for profile operators and functions.
(for subject in
  (@ "describe", "help", "selftest", "version")
  set subject, (load 'help/profile/$subject');
).
