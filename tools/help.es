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

export -library (object assign (@:) (this -library);

(export add (=> (subject content)
  (if (subject is-a string:: && (content is-a string:: or (content is-an object).
    -library: subject content;
).

(export get (=> (subject topic)
  var content (-library: (subject ?* "help");
  (content is-a string:: ? content
    (topic is-not-a string:: ? (content ".")
        (content: topic:: ?* (content: ".").
).

# provide help content for shell object and functions.
(for subject in
  add '.$subject', (load './help/shell/$subject');
).

# provide help content for profile operators and functions.
(for subject in
  (@ "describe", "help", "selftest", "version")
  add subject, (load './help/profile/$subject');
).
