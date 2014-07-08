---
layout: post
title:  "e.preventDefault() & e.stopPropagation()"
date:   2014-07-08 18:25:31
---

If you've used jQuery before, I'm guessing that you've come across `e.preventDefault()` before when trying to prevent the browser jumping to the top of the page when the user clicks an `a` link? Something like:

{% highlight javascript %}
$('a#myLink').on('click', function(e){
	e.preventDefault();
	// do some jQuizzle magic
});
{% endhighlight %}

That magic one line that seems to solve all your problems. You certainly may well know what the result is, but I'm also guessing you're a little bemused as to *how* it reaches that result.

To answer this, we need to go a little further down the rabbit hole. 

To clarify, and to point out at this stage, this isn't jQuery specific, see:

{% highlight javascript %}
document.querySelector('a#myLink').addEventListener('click', function(e){
	e.preventDefault();
	// do some JS magic
});
{% endhighlight %}

So, `e.preventDefault()` isn't a jQuery thing. It's a DOM Event Model thing. From this point forward, I'll be leaving jQuery on the bench, as it handles events slightly differently internally, so it'd just cause confusion and incorrect information if we kept referring to the two interchangeably.

The DOM Event Model lets you write functions like `addEventListener` and provide callback functions for these events (ie. a user clicking an `a` link).

Now, the argument `e` doesn't have to be called `e`, it's just convention as it's short for `event`. We could write `mrBlobby.preventDefault()` and it still be perfectly valid (as long as we pass `mrBlobby` into our function as the first argument). This object that is passed in by the DOM Event Model, is commonly known as the `Event Object` and is an object full of data pertaining to what was clicked, or selected, or double clicked. This event object also contains a function called `preventDefault`. If you called this, you're telling the event that was passed to cancel it's default action. If it doesn't have one, then the function has no effect. So, in the case of our HTML:

`<a href="#">Foo</a>`

When the user clicks this, the browser will navigate to the value of the `href` attribute. This is the `a` link's default action/behaviour. However, we don't want this, we want something else to happen when the user clicks the link, we want to override the action, we call `preventDefault` on the event object, and it's immediately cancelled. Voilà.

There's one caveat with this, and it leads nicely onto the explanation of `e.stopPropagation()`. The event is immediately cancelled, but the event still propagates up the DOM. 

Hold on...

Lets go further down the rabbit hole. When you set an event listener on an element, the event that happened doesn't just happen on the element, it "propagates" upwards through the outer elements. This is known as "Event Bubbling", the event bubbles up through the DOM.

So our function, `stopPropagation()`, does as you might guess, stops that bubbling up and halts the propagation of that event up through the DOM. Why by the beard of Zeus may you want to do this?

Well, a commonly used UI component and use-case for stopping the event propagation is modals.

Some sample HTML:

`<div id="modal">Some modal content</div>`

And some sample JS (we want to close the modal when the user presses anywhere outside the modal div):

{% highlight javascript %}
document.body.addEventListener('click', function(e){
	// close the modal
});
{% endhighlight %}

Yes! It works. However, when the user clicks anywhere inside the modal div, it also closes the modal. Those are bad UX vibes. What we can do is tell the DOM Event Model to let the user click inside the modal div but to halt the event travelling up any further, ie. to the body element, where it closes the modal.

We can do this, like so:

{% highlight javascript %}
document.querySelector('#modal').addEventListener('click', function(e){
	e.stopPropagation();
	// carry on, nothing to see here
});
{% endhighlight %}

We don't actually need any more functionality inside our `click` callback, just the ability to stop the event in it's tracks. Which we've done so.

Have a play with the event object, and see what other gems are inside there.

Hint: `e.currentTarget` is the element that the user interacted with. It could be a `<select></select>` element if it was a `change` event.