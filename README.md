expences
========

Rails app for manage expences.

**Mission:** Record everything you spend wherever you are. Simple as that.
Then analyze how you spend your money.

Entities
-----

* User: pair of email password. Has many expences and categories.
* Expence: single expences, with date and ammount. Has many category and belongs to a user.
* Category: identify a single category. Belogns to a user and has many expences.

Interfaces
------

* Raw Data: the REST API
* Web Desktop / Tablet
* Web Mobile

TODO
----
Everything. But the current job is on create the REST API and write the DOCS.





