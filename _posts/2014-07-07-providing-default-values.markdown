---
layout: post
title:  "Providing default values"
date:   2014-07-07 16:25:31
---

A very common occurrence in JavaScript is to want to provide default values. Whether this be from user input, or functions you, yourself, have defined and invoked.

A very contrived example may look something like this:

{% highlight javascript %}
document.querySelector('#submit').addEventListener("click", function(e){
	var name = document.querySelector('#username').value;
	// send name to the backend server for saving to a database, for example
});
{% endhighlight %}

Now, for simplicity sake, say we don't mind if they don't input their name, we just want to send *something* to the backend. Even if it's "guest". How may we provide this default, or fallback value? Maybe like so:

{% highlight javascript %}
var name = document.querySelector('#username').value;
if(name == ""){
	name = "guest";
}
{% endhighlight %}

This would get the job done, however, we can go one better:

{% highlight javascript %}
var name = document.querySelector('#username').value || "guest";
{% endhighlight %}

One-liner FTW. We've used the double pipe character in the code to denote the logical "OR" operator. What this means is that JavaScript will evaluate the left-hand side of the double pipe, and if the value is deemed to be a JavaScript "truthy" (basically, does it have a value, ie. not null, undefined, 0, false or an empty string), then the engine stops there and sets our variable `name` to be the value of the input. However, if our mysterious user didn't feel it necessary to enter their name into the input, then JavaScript will look to the right of the double pipe and set that new value to the variable. As an aside, if the next value to the right of the double pipe is a "falsey", then it will keep going right until it hits a "truthy".

Another very common use case is for function arguments, like so:

{% highlight javascript %}
function makeTheOne(name, hackerName){
	if(typeof name == 'undefined'){
		name = "Thomas Anderson";
	}
	if(typeof hackerName == 'undefined'){
		hackerName = "Neo";
	}
	// make the One, beat Agent Smith, play Rage Against The Machine, scene.
}
{% endhighlight %}

Yes, it works, but we can make it so much more concise, and still keep it readable:

{% highlight javascript %}
function makeTheOne(name, hackerName){
	name = name || "Thomas Anderson";
	hackerName = hackerName || "Neo";
	// make the One, beat Agent Smith, play Rage Against The Machine, scene.
}
{% endhighlight %}

High five! As you can see, the double pipe is a sweet bit of JavaScript you can use for providing default values, without using cumbersome methods of checking empty values.