---
layout: post
title:  "Remove an object by key from an array"
date:   2015-07-08 18:25:31
---

It's often the case that our data structures aren't always simple structures. Even having an array of objects can add a sprinkle of complexity to, seemingly, straightforward operations.

One of which is removing an object from an array, given a key/value query, ie. remove the object from this array where the `id` field is set to `43`.

### Looping

The easiest way to grab the object from the array, is to loop through the array. However, the issue appears when we've found our object, removed it and want to stop looping (to avoid unnecessary cycles). We could use a `for`/`while` loop and the `break` statement (which will terminate the current loop). However, it would be nicer to explore the ES5 methods and utilise one of those...

### Some

The one we're going to use is `Array.prototype.some`, which you can use on an array. The some method will test items in the array to see if some of them pass the test provided by your function. What does this look like in practice? 

{% highlight javascript %}

var users = [{
	name: 'walt',
	age: 45
}, {
	name: 'jesse',
	age: '25'
}];

var result = users.some(function(user){
	return user.age > 30;
});

console.log(result); // true

{% endhighlight %}

The variable `result` is set to `true` because the user "walt" has his age set to greater than 30. So "some" of the array elements pass the test.

The key thing about `some` for our use, is that it will stop looping as soon as it encounters a `true` returned from the test function.

When designing desired function implementations, I sometimes like to start with the usage and work backwards.

{% highlight javascript %}
removeByKey(items, {
	key: 'id',
	value: 43
});
{% endhighlight %}

So we'd like our function to take an array to work on, and an object containing a `key` property and a `value` property. This object will form our query to find our object to remove.

The skeleton of our `removeByKey` function will look like this:

{% highlight javascript %}
function removeByKey(array, params){
	array.some(function(item, index) {

	});
	return array;
}
{% endhighlight %}

So all we need to do now is inside our anonymous function we pass to `some`, work out if the query object we pass in matches the current item being looped in the array:

{% highlight javascript %}
function removeByKey(array, params){
	array.some(function(item, index) {
		if(array[index][params.key] === params.value){
			// found it!
		}
	});
	return array;
}
{% endhighlight %}

Next up, we need to use the `splice` method to remove the current item from the array:

{% highlight javascript %}
function removeByKey(array, params){
	array.some(function(item, index) {
		if(array[index][params.key] === params.value){
			// found it!
			array.splice(index, 1);
		}
	});
	return array;
}
{% endhighlight %}

This will remove the item from the array, but we now need to sort our `return` statements out:

{% highlight javascript %}
function removeByKey(array, params){
	array.some(function(item, index) {
		if(array[index][params.key] === params.value){
			// found it!
			array.splice(index, 1);
			return true; // stops the loop
		}
		return false;
	});
	return array;
}
{% endhighlight %}

There we have it.

I've embedded a JSBin link in the post, so you can have a play and see it in action. I've also refactored our function slightly so we're now using a ternary operator, and also casting the result of the `splice` to a boolean, which makes the `return true` completely redundant.

<a class="jsbin-embed" href="http://jsbin.com/wimuqawedu/embed?js,console">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.31.0"></script>