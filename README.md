# Sugly-Lang
### A simple &amp; ugly script language, which is mostly inspired by Lisp, Python and JavaScript.
```python
print "Hello, world!";

# or, without sweetener
(print "Hello, world!")
```

# Try it online
### [Sugly.DEV](https://sugly.dev)
```python
help; # for help.

# to verify your browser's compatibility.
selftest;

# to run a quick-sort example
run "examples/qsort1";
# to print its code
print (.loader read "examples/qsort1");

# try to list all examples
.loader list "examples/";

# use print to show a full list.
print (.loader list "examples/");

# break items into lines
.loader list "examples/":: for-each print;

# display source url only
.loader list "examples/":: for-each (= item (print (item 0);

# display item no. for counting
.loader list "examples/":: for-each (= (item, no.) (print '#$(no.), $(item 0)');

 # display path only
.loader list "examples/":: for-each (= (item, no.) (print '#$(no.),', (var url (item 0):: slice (url first-of "examples/");

# Q: What's happening?
var print-examples (=>:() (var examples (.loader list "examples/")) (=> pattern (examples for-each (=> (item, no.) (print (string format (pattern ?* "{0}, {1}, {2}"), no., (item 0), (item 1);

# As a hint, here's a (more) friendly version.
(var print-examples (=>:()
  var examples (.loader list "examples/");
  (=> pattern
    (examples for-each (=> (item, no.)
      print (string format (pattern ?* "{0}, {1}, {2}"), no., (item 0), (item 1);
).

# You may also want to check
print print-examples;

# Finally, the Y-combinator in Sugly
print (.loader read "yc");
```

# Install it
```shell
npm i -g sugly

sugly selftest # optional
```

### run an example, or your own code:
```shell
sugly examples/qsort1
```

### REPL in terminal:
```shell
sugly
```
### You can do [almost the same things](#try-it-online) after calling
```python
fetch "https://sugly.dev/@";

# or try
fetch "https://sugly.dev/@":: finally (=>() (.loader list:: for-each print);
```

# Use it in your JS project
### add it
```shell
npm i --save sugly
```

### use it
```javascript
var $void = require('sugly')
$void.$run('path-to-your-app.s')
```

### use it in web page
```javascript
var $void = require('sugly/web')
$void.$run('path-to-your-app.s')
```

# Check the source code
```shell
git clone https://github.com/NirlStudio/sugly-lang.git
cd sugly-lang

npm install
npm test

bin/sugly

# or, start the local web shell
npm run build-dev & npm run start
```

# IDE Support
### VS Code Extension
In Extensions sidebar, search for **Sugly**

### Atom Plugin
[*language-sugly*](https://github.com/NirlStudio/language-sugly)
```shell
apm install language-sugly
```

# You can help to
### - Test it in various OSes and browsers.
### - Use it in your projects.
### - Recommend it to your friends.
### - Create documentation & tools.
### - Report bugs and help to fix.
### - Request for features.
### - Create interpreters in other native languages
  - Java, Go, Rust, Python, C#, C, etc
### - ...

**Enjoy the sugliness.**
