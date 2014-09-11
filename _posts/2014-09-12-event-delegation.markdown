---
layout: post
title:  "Event Delegation"
date:   2014-09-12 18:25:31
---

I think it's wise to start with the "What", then the "Why" and then finish off with the "How".

## What is it?

Event delegation is the concept of applying an event listener to the parent element of the element(s) that you're really interested in. When you click a `<div />` on a web page, the click event is registered with the `DIV`, then the event bubbles up through the DOM tree to the `document`. You would normally attach an event listener like so:

{% highlight javascript %}
document.querySelector('#tweetBtn').addEventListener('click', function(){
	console.log('Consider me clicked');
});
{% endhighlight %}

So we've intercepted that bubbling up of the event and said, "no worries, I'll handle it". We catch the click event at it's inception, as we've applied an event listener directly to the element itself.

This would also work, if we clicked the `#tweetBtn` element:

{% highlight javascript %}
document.addEventListener('click', function(){
	console.log('Consider me also clicked');
});
{% endhighlight %}

This works because we've attached an event listener to the top most point of the DOM tree.

## Benefits

Imagine we have this HTML:

{% highlight html %}
<ul class="anchormen">
    <li>Ron</li>
    <li>Champ</li>
    <li>Brick</li>
    <li>Brian</li>
</ul>
{% endhighlight %}

And we want to attach an event listener to each of the `<li />` elements inside our `<ul/>`. We could grab the `UL` and loop over the `LI`s inside, adding an event listener as we go. Or we could be smart and only attach one listener; to the parent. We could add an event listener to the `UL` and tell it to only respond if the original event came up from a child `LI`, if it bubbled up. How would this look? Like so:

{% highlight javascript %}
document.querySelector('.anchormen').addEventListener('click', function(e){
    if(e.target.nodeName.toLowerCase() == "li"){
        console.log("I'm not even mad, I'm impressed!");
    }
});
{% endhighlight %}

You can see that we've selected the `UL` from the DOM using `querySelector`, then we've checked the `target` of the event and seen if it's `nodeName` value was equal to the string "li". If it was, we're in business. If it wasn't, nothing happens. With this sample HTML, you can see we actually only have one active listener bound in our document, even though we're looking out for 4 click events. As you might imagine, employing this way of attaching listeners can become very advantageous when you have a number of the same events, all under one common parent. Attach the listener to the parent, and you're away.

If you've ever used jQuery's `$.ajax()` or even `XMLHTTPRequest` to populate dynamic HTML into the DOM, then you'll know that you have to re-apply event listeners to the new HTML, every time it's inserted into the document. If you've never done that, just know that it's tedious and annoying. Using event delegation means we eradicate the need of doing this. Instead of re-applying direct event listeners to dynamically inserted HTML, we attach one to the permanent parent element and tell it what element to look out for when the event bubbles up.

Carrying on from this, might it be wise to just bind every event we might ever want to the `document` itself? No. Don't do that. Ever. And by "don't do that", I mean binding **all** the events. It actually makes sense in certain situations to do this. For instance, imagine you're developing a large web application with predominantly dynamically inserted HTML, and in the HTML, you have a lot of `<input />` elements that need validating. Instead of attaching an event listener to each `INPUT` that needs validation, we could put a `data-validation="email"`, for example, attribute onto the element in HTML, then apply this listener on the document (using jQuery):

{% highlight javascript %}
$(document).on('keypress', '[data-validation="email"]', function(e){
    console.log('Keypress detected inside the element');
});
{% endhighlight %}

There we go, so now we can handle all the validation needed for email input in one place, with one event listener, and all we need to do is use this attribute each time:

{% highlight html %}
<input type="text" data-validation="email" />
{% endhighlight %}

Problem solved.

Jumping back a little, in the above situation it works nicely. However, I strongly recommend against binding every event listener to the `document`, it can lead to awful performance experiences. Instead, follow the general rule of thumb of **apply the event listener to the parent element that is immediately above your dynamic elements**.

## How?

You'll notice above that to implement a generic solution for event delegation, we actually resorted to using jQuery. If you noticed in our Anchormen example, you'll see we had to check the `nodeName` property to see if it was the element we were interested in. However, this solution wasn't very re-usable, and would be tedious to have to use this `IF` check each time. Unlike our jQuery example, which was reasonably elegant. Native, elegant and re-usable event delegation in JavaScript is usually fairly tricky to implement, which is why, unless you only need it for a couple of event listeners, I'd recommend you use jQuery's built-in support for event delegation, or hand off the responsibility to a dedicated event delegation library.

My usual rule of thumb is that if I'm needing to support IE8 (or even IE9), I'll more than likely use jQuery, as it smoothes over a lot of the quirks you hit in legacy browsers. However, if I wasn't needing to support those browsers, and I didn't want to use jQuery, I may be tempted to use [Gator.js](http://craig.is/riding/gators). Which provides a simple interface for event delegation, like so:

{% highlight javascript %}
var anchormen = document.querySelector('.anchormen');
Gator(anchormen).on('click', 'li', function(){
	console.log('Whammy!');
});
{% endhighlight %}

Gator.js is powered by the slightly experimental method `matches` on the `Element` prototype. You can read more on `Element.matches` on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element.matches). The basic principle is that you could see if a selector string would also match the element you're calling `matches` on. Like so:

{% highlight html %}
<h1 class="lookAtMe">Look at me!</h1>
{% endhighlight %}

{% highlight javascript %}
var h1 = document.querySelector('h1');
console.log(h1.matches('.lookAtMe')); // true
{% endhighlight %}

You can imagine how being able to know if one element is matched by a selector might allow Gator.js to function properly, it will check whether the original element in the event matches the selector string you pass it as the second parameter to Gator's `on` method.

Hopefully that's served as a good primer on event delegation, and some of it's practical use-cases. And hey, if you're feeling brave enough, maybe give writing your own mini event delegation library a go!