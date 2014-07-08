---
layout: post
title:  "var that = this"
date:   2014-07-08 16:25:31
---

Before we start, a quick primer on the `this` keyword in JavaScript. `this` is a chameleon, it's dynamic. It's a reference to the owner of the current function that's being executed. Or the `object` that the current function is a property of. Wait, what? Example time.

{% highlight javascript %}
function foo(num){
	this.style.width = num;
}
{% endhighlight %}

We haven't defined `this`, we can just...use...it? Yep. However, in this case, the owner of the function is the `window` object in the browser, the top dog of variables. You may remember `window` from it's previous work, such as `window.location` or `window.setTimeout`. 

If we just ran `foo(10)`, we would get:

`TypeError: cannot set property "width" of undefined`.

Makes sense, `window.style` doesn't exist, so therefore, we can't expect it to try and manipulate the width of it.

However, if we make ourself an Object Literal, like so:

{% highlight javascript %}
var myObject = {
	monies: 1000,
	apps: ['Yo', 'Twitter', 'Instagram'],
	invest: function(amount){
		this.monies += amount;
	}
};
{% endhighlight %}

We call the function `invest` like this: `myObject.invest(2000);` and it will know that `this` is a reference to `myObject`, and will therefore know to increment the value of the correct property `monies`. 

A simple way to think about it is, `this` refers to the thing that's to the left of the function name, when you invoke it.

`foo(10); // what's to the left? Nothing. So "this" inside "foo" will be the "window" object`

`myObject.invest(2000); // what's to the left? "myObject", so "this" inside "invest" will be "myObject"`

Make sense?

Cool. On we go&hellip;

On numerous occasions, I used to come across code that looked something like this:

`var that = this;`

or

`var _this = this;`

or

`var context = this;`

Not really understanding why someone would be doing this, I was left bemused. However, once I started working with jQuery's AJAX (I used jQuery for a long time before I was comfortable using native JS), I experienced this problem all too often:

{% highlight javascript %}
$('.clicker').click(function(){
	$(this).html('Loading...');
	$.ajax({
		url: "/myBackend.nodejs",
		success: function(){
			$(this).html('Loaded!'); // ruh roh
		}
	});
});
{% endhighlight %}

Once I was inside that `success` function there, I couldn't get a reference back to my button that was clicked. I had lost the value of `this` within the callback function I had provided to `$.ajax` as the `success` property. What to do next? Well, here's where our `var that = this;` comes into play. We can save the value of `this` for a rainy day, or when we need to reference it again, and it's been lost.

Re-written, our AJAX code now looks something like:

{% highlight javascript %}
$('.clicker').click(function(){
	var that = this;
	$(this).html('Loading...');
	$.ajax({
		url: "/myBackend.nodejs",
		success: function(){
			$(that).html('Loaded!'); // yay for jQuery!
		}
	});
});
{% endhighlight %}

Now, when we try and run `$(that).html();`, JavaScript can look at `that`, see that it still has a reference to the above `this` and can act upon our button as we wanted.

That's all gravy 'n all, but there is now a built in way to do this in JavaScript, without having to save the `this` value manually. It's called the `bind` function, and it lives on all functions. What does that mean? Well, it means that every function that you create or define, has a `bind` property on it, which is a function. It allows us to manually set the `this` value in the function we're about to call. Neat huh? This illustrates it quite nicely:

{% highlight javascript %}
$('.clicker').click(function(){
	$(this).html('Loading...');
	$.ajax({
		url: "/myBackend.nodejs",
		success: function(){
			$(this).html('Loaded!'); // we're not in a bind anymore...
		}.bind(this)
	});
});
{% endhighlight %}

If you see, we supplied our function like usual, but this time, we called the `bind` function on it and passed in `this`. So inside our success function, we can use `this` quite merrily and know that its pointing back to our button!

`bind` isn't compatible with IE8, so if you need support for that, maybe it's not for you. It's mildly less performant than doing `var that = this;`, because `bind` actually creates a new function at runtime, which is another job for the JavaScript engine. A lot of people also say that it's quite confusing, because if you read that code from top to bottom above, you don't realise that the `this` inside the success function is the button until you've got to the bottom and saw the `bind` function being used. I would say it's totally personal preference. If you work on a team, just make sure you're all using the same name for saving your `this` to. It doesn't really matter what it is, just as long as its consistent.