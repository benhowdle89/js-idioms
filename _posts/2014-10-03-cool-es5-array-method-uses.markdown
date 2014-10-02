---
layout: post
title:  "Cool uses of ES5 array methods"
date:   2014-10-03 18:25:31
---

JavaScript developers are widely known as being cool, so it goes without saying that we have some pretty neat uses for the ES5 Array methods.

## Filtering

First up, we can remove all the "falsey" values from an array like so:

{% highlight javascript %}
var arr = ["", 1, "foo", 0, "bar"];

console.log(arr.filter(Boolean)); // [1, "foo", "bar"]
{% endhighlight %}

Let me explain what the frick just happened here. You run `filter` on your array and pass it a function. This function is given each element of your array in turn. If the function returns true, then the element is passed to the new array you're creating (it never modifies the original array). It passed! If your function returns false, then it's not let through, it's been filtered out. It's entirely up to you what your function does with the passed in element. In the case above, `Boolean` is a constructor function which will return true/false depending if it was passed a "truthy" or a "falsey". So in our use, we give it each element of the array, and it only returns the ones that aren't "falseys". 

A more tangible example of `filter`, is to maybe find out which of your users have a reputation of over 100.

We can achieve this like so:

{% highlight javascript %}
var users = [
  {
    name: "neo",
    rep: 277
  },
  {
    name: "morpheus",
    rep: 98
  },
  {
    name: "trinity",
    rep: 102
  }
];

var coolPeeps = users.filter(function(user){
  return user.rep > 100;
});

console.log(coolPeeps); // Only Neo & Trinity survived the cull
{% endhighlight %}

## Formatting return values

A ridiculously small amount of code needed, but one that I use a lot. 

If we take our Matrix array from the previous example, we may want to do a roll call on our Matrix cast, in which we'll need to know all there names. We could be lame and use a `for` loop and push each `name` key into a new array. OR. We could use `map`, and while we're at it, create a highly reusable function for extracting values by key from an array of objects.

Like so:

{% highlight javascript %}
function getValuesByKey(array, key){
  return array.map(function(item){
    return item[key] || null;
  });
}

var names = getValuesByKey(users, "name");

console.log(names); // ["neo", "morpheus", "trinity"]
{% endhighlight %}

## Closing

These are just a couple of the less obvious ways that we can use ES5 array methods. I'm sure there are more, and will more than likely do a "part 2" follow up in the near future.