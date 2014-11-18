---
layout: post
title:  "Using recursion and closures to generate unique IDs"
date:   2014-11-05 18:25:31
---

Recursion: doing something over and over until a certain condition is satisfied.

Cool in theory, but it'll become a lot more interesting (and useful) when you see it in action.

A good use-case for recursion is to generate unique values. We use recursion so that if we generate a new value that already exists, we want to keep generating it until it becomes unique.

So we need to cover a couple of concepts here: Recursion & closures.

Closures, so we can track which IDs have already been generated. And recursion, so we can keep trying to generate a unique value.

We'll start with a basic function declaration:

{% highlight javascript %}
function getUniqueID(){
  
}
{% endhighlight %}

Which we'll call like so:

`var uniquify = getUniqueID();`

This gives us a function we can keep calling to retrieve our unique ID. How will it do that you might ask. Like so:

{% highlight javascript %}
function getUniqueID(){
  return function(cb){

  }
}
{% endhighlight %}

In JavaScript you can return functions from functions. AKA: closures. An inner function can access variables from the outer function, even after it's been executed. As we build up our unique ID generator, you'll start to see the closures take effect.

I often find, that when approaching a problem, or designing a function interface, it really helps to mock out how you'd like it to work, then build backwards from there.

So we want to initialise our unique generator and then invoke a function each time we want an ID generated, ie.

{% highlight javascript %}
var uniquify = getUniqueID();

uniquify(function (id) {
  console.log("UNIQUE ID: ", id);
});
{% endhighlight %}

Ok, so now that we have our desired use, we can carry on building out the implementation.

{% highlight javascript %}
function getUniqueID() {
    var ids = []; // this will only be created once, but will be accessible to our inner function `uniquify` whenever it needs it
    return function (cb) {
        // here we implement our actual generator function (returns a number between 0 and 999)
        var generateID = function () {
            return Math.floor((Math.random() * 1000));
        };
    }
}
{% endhighlight %}

So now we have our ID generator and we have a means of persisting already generated IDs.

We can now move on to dealing with conflicts found.

{% highlight javascript %}
function getUniqueID() {
    var ids = []; // this will only be created once, but will be accessible to our inner function `uniquify` whenever it needs it
    return function (cb) {
        // here we implement our actual generator function (returns a number between 0 and 999)
        var generateID = function () {
            return Math.floor((Math.random() * 1000));
        };
        (function findID(callback) {
            var id = generateID(), // get our new ID
                returnID = function (id) {
                    // add it to our persistent array
                    ids.push(id);
                    // invoke our callback function, passing in the unique ID
                    callback(id);
                },
                conflictFound = function () {
                    // ruh-roh, that ID already existed. We can just re-invoke our `findID` function
                    return findID(callback);
                }
            // does the ID already exist? If so, invoke `conflictFound`, if not, YAY, invoke `returnID` with our unique ID
            return (ids.indexOf(id) > -1) ? conflictFound() : returnID(id);
        })(cb); // we need to pass our callback function into `findID`
    }
}
{% endhighlight %}

The above is our complete implementation. It may look tricky to follow the flow of execution, but lets break it down.

You may be wondering why we wrap `findID` in all those parenthesis, and why we don't just define it like so:

{% highlight javascript %}
function findID(callback){
  
}
{% endhighlight %}

Well, that's fine and dandy, but we've only defined it here, not invoked it. Well we can use the short-hand way to invoke it by wrapping it in parenthesis and then placing two more parenthesis after it. This is commonly known as an [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/). With everything ripped out of it, you can see that it's simply this:

`(function(){ /* code */ })()`

You'll notice we actually pass in `cb` at the bottom, and then accept `callback` at the top. This might seem a little ass-backwards, but it's better illustrated like so:

{% highlight javascript %}
function findID(callback){
  
}

findID(cb);
{% endhighlight %}

We've just shortened it right up:

{% highlight javascript %}
(function findID(callback){
  
})(cb);
{% endhighlight %}

The complete copy-and-paste Unique generator is here:

{% highlight javascript %}
function getUniqueID() {
    var ids = []; // this will only be created once, but will be accessible to our inner function `uniquify` whenever it needs it
    return function (cb) {
        // here we implement our actual generator function (returns a number between 0 and 999)
        var generateID = function () {
            return Math.floor((Math.random() * 1000));
        };
        (function findID(callback) {
            var id = generateID(), // get our new ID
                returnID = function (id) {
                    // add it to our persistent array
                    ids.push(id);
                    // invoke our callback function, passing in the unique ID
                    callback(id);
                },
                conflictFound = function () {
                    // ruh-roh, that ID already existed. We can just re-invoke our `findID` function
                    return findID(callback);
                }
            // does the ID already exist? If so, invoke `conflictFound`, if not, YAY, invoke `returnID` with our unique ID
            return (ids.indexOf(id) > -1) ? conflictFound() : returnID(id);
        })(cb); // we need to pass our callback function into `findID`
    }
}

var uniquify = getUniqueID();

// you can keep calling the below function, each time receiving a unique ID between 0 and 999
uniquify(function (id) {
  console.log("UNIQUE ID: ", id);
});

{% endhighlight %}

Also, just to clarify, you may wonder where `cb` comes from inside our function (it becomes `callback` inside our `findID` function). Well, `cb` is just this:

{% highlight javascript %}
function (id) {
  console.log("UNIQUE ID: ", id);
};
{% endhighlight %}

In JavaScript, you can pass functions around as arguments, which becomes **very** useful when you want to invoke them at a later time. 