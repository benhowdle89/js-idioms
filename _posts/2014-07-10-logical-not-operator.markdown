---
layout: post
title:  "Logical not operator(!)"
date:   2014-07-10 19:25:31
---

You may have seen code that looks something like this:

{% highlight javascript %}
completed = !completed;
{% endhighlight %}

No, the developer wasn't just *really* excited to be writing JavaScript, though I wouldn't blame them. That exclamation mark is called the "logical not operator" in JavaScript.

There are a couple of different uses for it. We can see in the above example that the developer wanted to simply toggle the value of `completed`. The expression above would have been evaluated, `completed` would have been read as a "truthy" or a "falsy", then the `!` would have inversed the Boolean value of `completed`. So if it started off true, it would have been flipped to false, and vice-versa. The logical not operator forces the variable it's in front of to be read as a boolean. An excellent read on ["truthy" and "falsy"](http://james.padolsey.com/javascript/truthy-falsey/) in JavaScript. 

Let's look at a different example. Say we want to read the value of an input when the user submits a form, and display an alert if they didn't fill it in:

{% highlight javascript %}
document.querySelector('#myForm').addEventListener('click', function(){
	var name = document.querySelector('#name').value;
	if(!name){
		return alert('Whoa there.');
	}
	// do something delightful with this user's name
});
{% endhighlight %}

If `name` holds a value, such as the string "Jack Bauer", then the `if` check would not pass and we can carry on with the rest of our code. However, if the `name` was evaluated to be a "falsy", then we stop execution with our `return` statement and alert to the user that there was a problem. So, the flow goes: read value of name, it's an empty string, which means it's a "falsy", the presence of the `!` means that we inverse the false to a true, and our code inside the `if` gets executed.

Sometimes, you may across someone really excited, and they've used two logical not operators. Something like:

{% highlight javascript %}
var foo = function(){
	return "bar";
}
if(!!foo){
	console.log("Houston, we have a foo");
}
{% endhighlight %}

This is nothing too fancy, the presence of the extra `!` simply means that it's another logical not operator and it flips the inversed boolean back to it's first value. Without the double logical not operator, the `if` would have still evaluated the expression to be true, because `foo` is a value, but it wouldn't be a real boolean.

Simply put, it's a shorthand way of casting a value to a Boolean. Shorter than writing:

{% highlight javascript %}
if(Boolean(foo)){
	console.log("Houston, we have a foo");
}
{% endhighlight %}

A simple way to remember it is, "bang bang, you're boolean". 