---
layout: post
title:  "Module pattern"
date:   2014-07-18 18:25:31
---

Hold onto your hats, we're delving into some design patterns now. By "design patterns", I don't mean tartan or stripy, but ways to structure code that solved a common issue in software development. This code won't achieve much on its own, but serves as a template, or a boilerplate for building upon. If you want to read further on design patterns, it wouldn't be much of a post on JavaScript design patterns if I didn't mention Addy Osmani's stellar [resource](http://addyosmani.com/resources/essentialjsdesignpatterns/book/).

Now, the module pattern. What does it look like? Its the one with all the parenthesis at the top and bottom, like so:

{% highlight javascript %}
(function(helpers, Chat){
	// hi i'm in a module
})(helpers, Chat);
{% endhighlight %}

If we break down the anatomy of what we've just typed, we have a normal function:

{% highlight javascript %}
function(helpers, Chat){
	// hi i'm in a module
}
{% endhighlight %}

Bit more familiar, right? So we have a function that takes two arguments, `helpers` and `Chat`. How could we call this function? Well we could call it like we normally would (but we'd give it a name):

{% highlight javascript %}
function myModule(helpers, Chat){
	// hi i'm in a module
}

myModule(helpers, Chat);
{% endhighlight %}

But what if we want it to run straight away, ie. when the page loads? Well, the above would do it, but we can wrap it in, what's commonly known as, an [Immediately Invoked Function Expression](http://benalman.com/news/2010/11/immediately-invoked-function-expression/), which means that we wrap our anonymous function in two parenthesis `()` and then invoke it, with two more `()`.

So we end up with a function that is immediately ran (executed):

{% highlight javascript %}
(function(helpers, Chat){
	// hi i'm in a module
})(helpers, Chat);
{% endhighlight %}

So what are the bits at the bottom? Well, they're the arguments we pass into the function. Just like this example:

`myModule(helpers, Chat);`

Except we're wrapping this around the function we're invoking.

Why might we do this? Well, because we're good little JavaScript citizens. And we don't pollute the global scope. Quick reminder, if I just do this, `var foo = "bar";`, then `foo` has been placed into the global scope. That means if your colleague that hates you and really wants to pee you off, can set `foo` to "snafu", and we have a *major* problem. Conflict.

So what do we do? We create our own scope, our own little safe-haven from the world. We do this by wrapping our code in a function and calling it immediately:

{% highlight javascript %}
(function(){
	var foo = "bar"; // no colleague is going to ruin my day
})();
{% endhighlight %}

This bit is going to sound a little like a programming sales pitch, but do stick with me. Creating modules is good (some would say, just better) for many many reasons. It creates encapsulation. You've created your own sandbox here, where you're safe to create variables called *whatever-the-hell-you-like* without burdening the rest of your code. You're managing dependencies. If we created a normal function, we might be referencing anything from our code, a little `foo` from here, a little `bar` from there. To look at that function, you wouldn't really understand what that function needs (externally) to run correctly. However, with a module, you can be very declarative, and say, "I'm using jQuery. I'll pass it in at the bottom, and use it in my module", like so:

{% highlight javascript %}
(function($){
	// ball me Resig
})(jQuery);
{% endhighlight %}

Once you have the idea of modules down, you may feel natural progression to start splitting your code out into separate files. Which by many standards, makes it a "true" module. Once we're at this point, you can ditch all the `<script />` tags from your `index.html` and start to look at things like [Browserify](http://browserify.org/) or the future savvy among you may know that ES6 is peeking it's head around the corner, where modules will becomes native to JavaScript (ie. you won't need to process your JavaScript source code before it runs in the browser, like you have to process .sass files to make them into .css files). For a look at what's to come, check out [http://jsmodules.io/](http://jsmodules.io/).

