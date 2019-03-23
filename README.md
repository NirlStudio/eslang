sugly-lang
==========
A simple &amp; ugly programming language

```sugly
"Hello, world!"

```

Run from npm
------------
- Install the package:
```
npm install -g sugly
```
- Run test suite:
```
sugly selftest
```
- Run sugly code:
```
sugly some-sugly-file[.s]
```
- Run sugly interactively:
```
sugly
```
- Use in Javascript code:
```javascript
var $void = require('sugly')
$void.$run('your-app')
```

Run from source code
--------------------
- Clone the project & Enter the directory.  
- Update/recover dependencies.
```
npm install
```
- Execute test suite.
```
npm test
```
- Run a piece of sugly program.  
```
bin/sugly some-sugly-file[.s]
```
or
```
node . some-sugly-file[.s]
```

Create code by Atom
--------------------
Install package [*language-sugly*](https://github.com/NirlStudio/language-sugly) from Atom or execute from command line:
```
apm install language-sugly
```

**Enjoy the sugliness.**
