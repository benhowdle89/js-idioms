---
layout: post
title:  "Arguments"
date:   2014-07-29 18:25:31
---

A relatively simple concept, but one that I feel benefits from a clear explanation. `arguments` is an array-like object that lives inside all function bodies. It contains all the parameters that the function was sent when it was called. Let me illustrate:

{% highlight javascript %}
function foo(bar){
	console.log(arguments);
}

foo('ben'); // ["ben"]

{% endhighlight %}

So, as you can see, we can retrieve an array of the passed in parameters (even if more were passed in than were required). When I say "array", it's important to know that the `arguments` that you can access is an array-like object, ie. it looks like an array, it has a `length` property, and you could `for` or `while` loops with it, but that's about it. 

If we wanted to make it into a *real* array, we can use our handy little trick of accessing the `slice` method from the Array prototype and hi-jacking it for use on our `arguments` object, like so:

{% highlight javascript %}
function foo(bar){
	console.log(arguments);
	var aRealArray = [].slice.call(arguments);
}

{% endhighlight %}

So now we can go ahead and use `forEach`, `map` or any other Array method we desire.

Now, use-cases. What could we do with this little oddity? Well, we can create a function that can accept any number of parameters, without having to explicitly declare them as named parameters. Like so:

{% highlight javascript %}

function mashup(start){
	
	var full = start;

	var args = [].slice.call(arguments, 1); // we don't need the very first parameter, as it's our start string

	args.forEach(function(arg){
		full += " " + arg;
	});

	return full;
}

mashup("What's", "the", "frequency", "Kenneth?"); // Returns: What's the frequency Kenneth?

{% endhighlight %}

Apart from re-creating REM lyrics, there is a huge potential for use-cases for the `arguments` object, mostly revolving around creating functions that can accept a variable number of parameters.