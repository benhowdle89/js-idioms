---
layout: post
title:  "Strict equality checking"
date:   2014-08-22 18:25:31
---

One of those go-to interview questions, "Can you explain the difference between == and ===?". Well, if you can't, then I'm sure by the time you've finished this post; you'll be able to.

{% highlight javascript %}
var i = 1;
var j = "1";

console.log(i == j); // true
console.log(i === j); // false

{% endhighlight %}

So, simply put: `===` will *also* check for type (ie. integer, string) equality as well as value.

Quite a short post, but one which I hope clears up some muddiness surrounding `===` vs. `==`.
