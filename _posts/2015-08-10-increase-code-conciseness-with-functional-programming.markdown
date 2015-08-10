---
layout: post
title:  "Increase code conciseness with functional programming"
date:   2015-08-10 16:25:31
---

Functional programming has gotten a surge in popularity recently in JavaScript. This post won't teach you what it is, but hopefully you'll be able to use it's features to benefit areas of your code.

Simply put (rudimentary if anything), the functional programming style is to build up your program with functions, instead of objects and procedures.

Let's take a example of very procedural code...

First, we'll make some test data:

{% highlight javascript %}
var users = [{
    name: 'lucille'
}, {
    name: 'gob'
}, {
    name: 'buster'
}, ];

var otherUsers = [{
    name: 'lucille'
}, {
    name: 'gob'
}, {
    name: 'buster'
}, {
    name: 'michael'
}];

var makeUser = function (obj) {
    console.log(obj.name);
};
{% endhighlight %}

We have two arrays, both containing user objects. The aim is to find the difference between the arrays, ie. find the new user, and then make the new user(s) into real users (just `console.log` their name).

### Procedural

A very procedural approach may look something like this:

{% highlight javascript %}
var seen = [],
    newUsers = [];

// create a more versatile data structure
for(var o = 0; o < otherUsers.length; o++){
  for (var u = 0; u < users.length; u++) {
    if (users[u].name === otherUsers[o].name) {
      seen.push(users[u].name);
    }
  }
}

// work out the difference
for(var o = 0; o < otherUsers.length; o++){
  if(seen.indexOf(otherUsers[o].name) == -1){
    newUsers.push(otherUsers[o]);
  }
}

// call `makeUser` for each new user
for(var i = 0; i < newUsers.length; i++){
  makeUser(newUsers[i]);
}
{% endhighlight %}

As you can see, we need to declare two arrays, outside of our logic, and manipulate them from within the loops.

### Functional

Let's have another stab...

{% highlight javascript %}
otherUsers.filter(function (o) {
    return !(users.filter(function (u) {
        return u.name === o.name;
    }).length);
}).map(makeUser);
{% endhighlight %}

Taking a more functional approach, we've eliminated the need for any "state" arrays, as we're holding all the logic inside our functions. The building blocks of our (albeit small) program are functions, not `for` loops and variable declarations. We pipe the output of one "block" (`filter`) as the input to our next "block" (`map`). We don't need to concern ourselves with whether there *are* any 'new users', as `.map` won't execute if there's no output from the `filter` operation.

### 23 lines of code down to 5

The obvious benefit from the above approach is conciseness; a drastic reduction in lines of code (not always the best metric to gauge code on, but applicable in this situation).

### Notes

Hopefully you've seen that 1. functional programming isn't all that daunting and 2. that you can gain a lot (or reduce a lot of code) from sprinkling some functional techniques into your programs.

For further reading on functional programming, I can't recommend Marijn Haverbeke's [Eloquent JavaScript](http://eloquentjavascript.net/1st_edition/chapter6.html) enough.