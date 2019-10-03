# Espresso Versioning 1.0.5
No only a versioning convention, but also a re-think of the best practice of
software packing & distribution methodology.

## Summary
The software life cycle is divided into three phases: **Development**,
**Prerelease**, **Release**.

In release phase, given a version number **DECADE**.**YEAR**.**BUILD**, increment the:
- **DECADE** every time when YEAR reaches 10,
- **YEAR** every year and keep the reminder of 10,
- **BUILD** every time,
when publishing a package update.

## Introduction
In the world of software management there exists a dreaded place called
Dependency Hell. The bigger your system grows and the more packages you
integrate into your software, the more likely you are to find yourself, one day,
in this pit of despair.

In systems with many dependencies, releasing new package versions can quickly
become a nightmare. Nevertheless how you design your versioning system, you will
be in this Dependency Hell ultimately.

For the future, software systems will become much more complicate than how much
they are today. So more and more developers will quickly find they're trapped
in the hell, even though they're not actually working on a so-called complex
system by their contemporary standards.

As a solution to this problem, I propose a different direction to think about:
- Don't expect any magic versioning system which possibly saves you forever.
- Put your attention back to software to maintain its backward compatibility.
- Whenever you break the compatibility, you're creating a new software in effect.

## Espresso Versioning Specification (EsVer)
The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", "MAY" in this document
are to be interpreted as described in [RFC 2119](http://tools.ietf.org/html/rfc2119).

1. **Package** indicates **Software** from distribution's perspective.
   - In design of Espresso, software is regarded as data, vice versa.
2. A package MAY be an application, a library, a data set or a mix.
   - An Espresso package SHOULD follow Espresso Versioning.
   - Other package systems MAY recommend Espresso Versioning.
3. An Espresso Version MUST take the form X.Y.Z.
   - X, Y and Z MUST be non-negative integers.
   - X, Y and Z MUST NOT contain leading zeroes.
   - Z SHOULD be reset to 0 when either X or Y changes.
4. In **development** phase, **0.0.1** is the minimal version and SHOULD be the first one.
   - X MUST remain 0.
   - Y MAY be incremented yearly and MAY be great than 9.
   - Z MAY be incremented when a change is made.
5. In **prerelease** phase, **1.0.0** SHOULD be the first version.
   - X MUST remain 1.
   - Y MUST remain 0.
   - Z SHOULD be incremented when a change is published.
6. In **release** phase, **1.1.0** SHOULD be the first version.
   - X MUST be incremented each time when Y reaches 10 and goes back to 0.
   - Y MUST be incremented for each calendar year.
   - Z MUST be incremented when a change is published.

## Espresso Package Life Cycle
- In development, a package's backward compatibility is not guaranteed.
   - A package in development MAY be published.
- In prerelease, a package's backward compatibility MAY be guaranteed.
   - A prerelease package SHOULD be published.
- In release, a package's backward compatibility SHOULD be guaranteed.
   - A release package MUST be published.
   - Interestingly, it's not a violation if they don't because none knows it.

## FAQ
### **How should we regard the Backward Compatibility?**
- In Espresso Versioning, it is more regarded as a user experience concern
  instead of a technical concern.
- It's about the confidence of users, including both dependent developers and
  end (app) users, when they want to upgrade THEIR systems.
  - Exciting and expecting instead of upset or hesitate.
- A breakage is a bug which MAY be fixed with By-Design **and the loss of reputation**.

### **Does this Backward Compatibility imply a-perfect-design-in-advance?**
Not at all.
- You can keep adding new features.
- You can revise a bad interface design by supplementing a better alternative
  and recommend it to your users.
- You can refactor the whole package and release it with the same name as long
  as you allocate a new package uri.
  - This assumes you're using Espresso Lang because its package system is designed
    as fully distributed, not even a central catalog.
- In an enterprise system, you can safely retire some deprecated designs with
  the help of a code analysis tool, your CI/CD process or both. In such a case,
  the compatibility is still literally maintained, because it's not breaking if
  there's not a breakage.

### What's the benefit of EsVer for developers, if there is any?
Definitely.
- No more struggling on choosing a version number when you change your code.
- Most developers are firstly and more package consumers than producers.

### **Can developers use their own conventions on Z?**
Yes. There's no conflict except to violate a MUST.

### **Can developers use their own conventions on Y in development phase?**
Yes. The same of above.

### **Cannot I publish a testing/preview version in release phase?**
Yes. you can put it in either a development branch or a separate repo (url).

### **Why is the compatibility guarantee of a release package not a "MUST"?**
Developers MUST have the authority and freedom to make a best decision for
their own work. If they decide the benefit is worthy of the reputation loss and,
mostly their users', technical cost, they're free to do it.

### **What's the next version of a package unchanged more than 1 year or a decade?**
All the elapsed year(s) MUST be counted when a change comes at any time.
For example, a package released as 1.1.0 at 2021 SHOULD be incremented to 2.3.0
in its first update at 2033.

*By "SHOULD", it means the new version MAY be 2.3.1 or any other value in Z.*

### **Why is there not a phase like Deprecated/Dead in Espresso Package Life Cycle?**
- Developers cannot literally deprecate their work; they can only abandon it.
- An abandoned package may be forked and maintained by other developers.
- A package without active maintainer may still have users.
- A package without active user may still need to be discussed or referenced.
- A package totally forgotten needs neither a name nor a dedicated phase. Or it has to, R.I.P.

### **Is Espresso Versioning designed to replace other versioning systems?**
Not entirely. It's definitely [not a silver bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet).

It's designed as part of of Espresso Language and resonates one of its
fundamental design principles, **Mandatory Stability**, on the aspect of packing
& distribution system.

But whatever programming language you're using, you can still apply EsVer to
make your users more confident.

## License
[Creative Commons - CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)

Document layout and some phrases are taken from [SemVer](https://semver.org/).
