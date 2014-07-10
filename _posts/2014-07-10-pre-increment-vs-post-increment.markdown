---
layout: post
title:  "Pre-increment (++i) vs. post-increment (i++)"
date:   2014-07-10 18:25:31
---

A relatively short post here, but covering a concept which, I wouldn't say has caught me out before, but has certainly took me a little while to fully grasp.

The concept in question is pre-increment (++i) vs. post-increment (i++). It certain circumstances, they can yield entirely the same result, like here:

{% highlight javascript %}
var i = 0;
var j = ++i;
console.log(j == 1); // true

var i = 0;
var j = i++;
console.log(j == 1); // true
{% endhighlight %}

So they both will increment a value, but they key difference is at what point that increment applied.

With `++i`, the value is incremented, then evaluated. So if `i` was 1, it would be evaluated as 2. With `i++`, if `i` was 1, it would be evaluated as 1, but then stored as 2. These statements both seem to mean the same thing, well, they do, if the expressions are used in a standalone fashion as above. However, it's when they're used as part of a larger statement, do the differences shine through. Enough words, show me the code.

{% highlight javascript %}
var i = 0;
var array = [1, 3, 5];
var val = array[i++]; // val is 1, ie. the first element of the array

var i = 0;
var array = [1, 3, 5];
var val = array[++i]; // val is 3, ie. the second element of the array
{% endhighlight %}

So, in our first example, the expression `i++` was evaluated as 0, so the final expression was `array[0]`. In the second example, the expression was evaluated as 1, so the final expression was `array[1]`.

Hopefully this has helped clear up the, often subtle, difference.