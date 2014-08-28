---
layout: post
title:  "Call & Apply"
date:   2014-08-29 18:25:31
---

Another go-to interview question, as it's quite tricky to concisely summarise if you don't fully understand call and apply.

Simply put, the methods `call` & `apply` are methods on the Function prototype. This means that they're functions that you can call on...well, functions. 

The conventional way to call a function, and one which you may be more familiar with, is:

{% highlight javascript %}
var slideUp = function(){
	
}

function slideDown(){
	
}

slideUp();
slideDown();

{% endhighlight %}

For the most part, this way of calling functions is going to suit our needs fine. It only really gets interesting when we have the `this` keyword inside our called function.

Let me illustrate:

{% highlight javascript %}

var user = {
	fullName: "Morpheus"
}

function reverseName(){
	return this.fullName.split('').reverse().join('');
}

{% endhighlight %}

So, we want to keep our `reverseName` function fairly generic, and not have to tie it to any particular object. So how can we call it and make the `this` value point to our `user` object literal?

If we did this:

`reverseName()`

then we'd receive an error saying `Uncaught TypeError: Cannot read property 'split' of undefined`. And that's because the property `fullName` doesn't exist on the `Window` object. Why are we suddenly involving the `Window` object? Because when you call a function, the object to the left of the function name becomes the `this` value inside the called function. And because we called `reverseName()` without anything to the left of it, the context of `this` inside the function becomes the `Window` object by default.

Enter call & apply.

These are two alternative ways to call functions, *very* similar to [bind]({% post_url 2014-07-08-var-that-this %}), but slightly different, which we're about to see. All three functions (call, apply & bind) allow you to manipulate or set the value of `this` inside the function you're acting on. However, unlike `bind`, `call` & `apply` will invoke the function immediately. Like so:

{% highlight javascript %}

var user = {
	fullName: "Morpheus"
}

function reverseName(){
	return this.fullName.split('').reverse().join('');
}

console.log(reverseName.call(user)); // suehproM

{% endhighlight %}

We can see that it worked successfully, and reversed the string "Morpheus" from the user object. The first parameter to both call and apply is the value you want `this` to be inside the invoked function. So as we pass in `user`, inside `reverseName` the value `this` points at our `user` object. 

Now, as for the subtle difference between the two. Call and apply both, conceptually, achieve the same result. The only difference between them is how they handle parameters. The code below should show this nicely:

{% highlight javascript %}
var user = {
	fullName: "Morpheus"
}

function reverseName(more, stuff){
    console.log(more, stuff);
	return this.fullName.split('').reverse().join('');
}

console.log(reverseName.call(user, "trinity", "cypher"));
console.log(reverseName.apply(user, ["trinity", "cypher"]));
{% endhighlight %}

As you can see, `call` takes separate parameters, one after the other, but `apply` takes an array. Both `console.log` functions inside `reverseName` log out the same things: "trinity cypher". So it's all about how you pass the parameters in. 

Hope this clears up a potentially tricky topic and you can concisely explain it to the next person who tries to catch you out.