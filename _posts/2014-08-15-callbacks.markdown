---
layout: post
title:  "Callbacks"
date:   2014-08-15 18:25:31
---

Callbacks are usually used in managing asynchronous operations (mostly AJAX/network requests). Let's begin with a simple example, and build up from there.

The example below doesn't have any AJAX, it's just used for simple control flow (controlling the direction of execution):

{% highlight javascript %}
function foo(callback){
	callback();
}

foo(function(){
	// and now we're here
});
{% endhighlight %}

In this mostly pointless piece of code, we can now see how we can pass whole functions around as arguments to other functions, which can subsequently be invoked. This invocation moves the execution to the inner callback function and we can move on with the rest of our code/application.

Now, a more realistic situation is dealing with an asynchronous operation, like an AJAX request. Let's say we have a form, which needs validating. Now we have a specific validation message that we know is on our server in a CMS or a database. What we want to do, is know whether we've already fetched this message or whether we need to make an AJAX request. And oh yeah, we also need to handle this in a clean way. Let's see where we get to:

{% highlight javascript %}
var validation = {
	message: null
};
	
function getValidationMessage(){
	if(validation.message){
		return validation.message;
	} else {
		// jQuery for brevity
		$.ajax({
			url: "/validation",
			success: function(message){
				validation.message = message;
				return validation.message;
			}
		});
	}
}

var message = getValidationMessage();
$('#formError').html(message);

{% endhighlight %}

Ok, so we're checking whether we've already fetched the message, and if we have, we return it. If we haven't, we make a trip to our server and set the message. However, there are two issues here: 1. the `success` function's `return` statement won't return to our `getValidationMessage`, it will return to the anonymous function we assigned to our `success` property. That's no good. And 2. when we use the `.html()` to the `message` value, at that point, the network request is still taking place. The browser carried on executing whilst our AJAX request took place. Also no good. So we need a way to know when we're ok to continue.

We can do this like so:

{% highlight javascript %}
function getValidationMessage(callback){
	if(validation.message){
		callback(validation.message);
	} else {
		// jQuery for brevity
		$.ajax({
			url: "/validation",
			success: function(message){
				validation.message = message;
				callback(validation.message);
			}
		});
	}
}

getValidationMessage(function(message){
	$('#formError').html(message);
});

{% endhighlight %}

We've made a few subtle changes here. Firstly, we've wrapped our `.html()` line within an anonymous function. So this means it will not be called until that function is invoked. And that function is only invoked when one of two things happen. Either, we already have a validation message fetched, or when the AJAX function has finished. So we remove our `return` statements, and replace them with function invocations, which we pass the `validation.message` back in this function as an argument.

You can, however, imagine that once we start nesting a few of these asynchronous calls, we might experience what some affectionately call [callback hell](http://callbackhell.com/). There are certain methods we can employ to alleviate this, some of which are outlined on that site. Callbacks are just one way to manage asynchronous operations, there are a couple of others which we may explore in a future post.