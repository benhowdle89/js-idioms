---
layout: post
title:  "Digging into a bind polyfill"
date:   2015-04-22 18:25:31
---

This post won't be covering what bind is and how to use is, we've covered that in a [previous post]({% post_url 2014-07-08-var-that-this %}). We'll be digging a little deeper into how one would polyfill this functionality for older browsers, but mostly it's a nice excuse to look at some more "advanced" JavaScript techniques and how they're used.

### Sample polyfill

Our actual polyfill code will be taken from John Resig's ["Learning Advanced JavaScript"](http://ejohn.org/apps/learn/#2) series:

{% highlight javascript %}
Function.prototype.bind = function () {
    var fn = this,
        args = Array.prototype.slice.call(arguments),
        object = args.shift();
    return function () {
        return fn.apply(object,
        args.concat(Array.prototype.slice.call(arguments)));
    };
};
{% endhighlight %}

And it's intended use:

{% highlight javascript %}
var myObject = {
	x: "my value"
};

var foo = function(){
	console.log(this.x);
}.bind(myObject);

foo();
{% endhighlight %}

### The breakdown

We'll take the polyfill, line by line, and go through each concept and how it forms part of the bigger picture (the polyfill itself).

The very first thing we see is `Function.prototype.bind`. By doing this, we can ensure that every single function we write will have a "bind" method available to it, as we've placed our method on the Function prototype. So every new function that's created inherits from this Function prototype.

Next up is the `this` value, what's it going to be? Well, it'll always be the function that we called `bind` on. So in our quick example above, the variable `fn` (within the polyfill) will equals the `foo` function. We save this to a variable for use later within the created closure (as it's retained after execution).

We then have to convert the `arguments` object into a real array for easier manipulation. Allowing us to use the `shift` array method to grab the context the developer wishes to use for the function invocation (`shift` grabs the first item of an array). In our example's case, `object` will be the passed-in parameter "myObject".

Returning a function from a function can be a little bemusing to get you're head around at first glance, but hopefully it makes sense in this context. We want to be able to execute `foo` as a function, so we run `bind` on it, grab some values, and then return a new function to be executed. So the `foo` variable now holds a new function (returned from `bind`). When this is then executed, it's invoked with the context we passed into `bind`. Within the polyfill, we're using `.apply` to do this, as opposed to `.call`, so that we can `concat` all the arguments together into one array.

### Finish

Hopefully this post has opened your eyes to the possibilities surrounding returning new functions from other functions, and manipulating the `arguments` object. Incidentally, `Function.prototype.bind` has good support in IE9 and above, so this polyfill is becoming more and more redundant, but I think it's very valuable (for learning sake) to go back through and see how native functionality can be emulated.