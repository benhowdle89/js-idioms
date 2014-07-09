---
layout: post
title:  "Array prototype trickery"
date:   2014-07-09 16:25:31
---

A few different concepts are going to be discussed here. Lets start with DOM selection. You can use `querySelectorAll`, `getElementsByTagName` &amp; `getElementsByClassName` to return multiple matching elements from the DOM using JavaScript. All these methods return an array-like `NodeList`. I say "array-like", because it has a `length` property and you can loop through it using a native `for` loop (or while, etc...), but what you can't use, is the fancy schmancy ES5 array methods (they're just not methods on a NodeList). For a primer on those, I'd highly recommend the excellent [ECMAScript 5 Array Methods](http://javascriptplayground.com/blog/2013/01/ecmascript-5-array-methods/).

We're only going to be concentrating on `forEach` today. And how we can trick it into working on a `NodeList` as if it were a normal array. 

As a quick example, here's how you'd normally use the `forEach` method:

{% highlight javascript %}
var array = [1, 3, 5];
array.forEach(function(num){
	console.log(num); // 1, then 3, then 5
});
{% endhighlight %}

So, "do this for each of the elements in the given array".

It would be so sweet if we could add event listeners onto a NodeList and it add one for each element, but alas, we can't. This isn't jQuery unfortunately! The next best thing is to loop over the NodeList and add one to each. We could use a native for loop, like so:

{% highlight javascript %}
var elements = document.querySelectorAll('.buttons');
for(var i = 0; i < elements.length; i++){
	elements[i].addEventListener('click', function(){
		console.log(this.innerHTML);
	});
}
{% endhighlight %}

That's cool 'n all. But we are developers who use ES5, so we want to use the delightful array methods, in particular; `forEach`. How? Well, one way is to hijack the `forEach` from it's home on the Array prototype.

Prototypes. Well, this could be a separate post all together. However, for the purpose of the rest of this post, and until I've written one, just know that every object in JavaScript has a built in secondary object. Almost like when you buy some trousers, they come with pockets, you don't buy the pockets separately. Weird analogies aside, back to the Array object in JavaScript, if you head over to your favourite browser's console and start typing `Array.prototype.` you should see it autocomplete and show you all the methods available to use when you've got an array to play with. Something like this:

![](http://cl.ly/WV8C/Screen%20Shot%202014-07-09%20at%2015.58.44.png)

Aha, a wild `forEach` appears. Now how do we use it on something that isn't an array? Well we have to use something called `call`. Which is a function on all functions. `bind` is another function on all functions - which you can [brush up](http://jsforallof.us/2014/07/08/var-that-this/) on at your own leisure. `call` is a lot like `bind`, apart from `bind` gives you a new function to run *at some point*, `call` invokes the function immediately.

A simple example of `call`:

{% highlight javascript %}
var myObject = {
	x: "blue"
}

function foo(){
	this.x = "red"; // "this" will be a reference to myObject
}

foo.call(myObject); // we're manually setting the value of "this" inside "foo"
{% endhighlight %}

As you can see, very similar to `bind`, whereas you can manipulate the value of `this` inside the called function. So how can we take our newfound `call` knowledge and our newfound prototype knowledge and apply it to using `forEach` on a `NodeList` which won't have a `forEach` method?

Like this:

{% highlight javascript %}
var elements = document.querySelectorAll('.buttons');
Array.prototype.forEach.call(elements, function(element){
	element.addEventListener('click', function(){
		console.log(this.innerHTML);
	});
});
{% endhighlight %}

So we've found the `forEach` on the Array's built-in prototype object, and we've called it, using `call`. But we said, "when you do run, and you reference 'this', please use this NodeList as your array". A simplified version of the `forEach` function might look something like this:

{% highlight javascript %}
Array.prototype.forEach = function(f) {
    for (var i = 0; i < this.length; i++) {
        f(this[i]);
    };
};
{% endhighlight %}

As you can see, the `this` value inside the for loop would normally be an array. But we've told it to use our NodeList, however the reason it works fine, is that you can still access elements inside a `NodeList` using square brackets, ie. `elements[1]`, will give you second `.button` from the `NodeList`.

We can tidy this up slightly by creating a variable, something like:

{% highlight javascript %}
var _each = Array.prototype.forEach;
var elements = document.querySelectorAll('.buttons');
_each.call(elements, function(element){
	element.addEventListener('click', function(){
		console.log(this.innerHTML);
	});
});
{% endhighlight %}

We've simply declared `_each` as a variable and set it's value to be the `forEach` method on the Array prototype. It just means that whenever we use it, it's slightly more concise than before.

If you want to avoid using the Array prototype, you can actually create a temporary array to use. Like so:

{% highlight javascript %}
var _each = [].forEach;
var elements = document.querySelectorAll('.buttons');
_each.call(elements, function(element){
	element.addEventListener('click', function(){
		console.log(this.innerHTML);
	});
});
{% endhighlight %}

The difference in the above example, is that we've created a new instance of an array, so we no longer have to look under the hood at the prototype object and find the `forEach` method, we can just use it straight away. We can then continue as usual and use `call` to manipulate the `this` value. This method of doing it (without the prototype) is mildly less performant, because an actual array is allocated in memory, but to be honest, the difference it makes is negligible, so go with whatever looks more readable to you.

Hopefully one day, you'll be able to select a bunch of elements from the DOM and call `addEventListener` on each one without having to loop over your `NodeList` first, because it ends up being quite a verbose process.