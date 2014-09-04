---
layout: post
title:  "Deconstructing the uilang source"
date:   2014-09-05 18:25:31
---

It really is true what they say, you can learn a heck of a lot by looking at how someone else has done something, or in our case, coded something. Theory is really great, is lays good foundations in your learning, but seeing something put to practice can do wonders for your understanding.

We're going to be looking at [Benjamin De Cock's](http://deaxon.com/) new programming language [uilang](http://uilang.com). The basic principle is that you can write JavaScript interactions in very human speakable sentences, and uilang will convert that into actual JavaScript events.

Without intending to sound detrimental, the library itself isn't actually as complex as you might imagine. It's relatively simple once you go through it and see how it's put together. I'm not going to go through it line-by-line, but I just want to pull out certain things which might look unfamiliar to you or interesting approaches he's taken.

If you want to look over the whole source, to keep some context as we go through, head over to [GitHub](https://github.com/bendc/uilang/blob/master/development/uilang-1.0.1.js).

## DOMContentLoaded

The first thing to note is actually the first line:

`document.addEventListener("DOMContentLoaded", function() {`

Some of you more familiar with jQuery might be used to this line:

`$(document).ready(function(){  // put your code })`

The purpose of both of these lines is to ascertain when the document itself has been loaded and parsed. This doesn't mean images and stylesheets have necessarily finished loading (you can listen for a `load` event to see when the page has fully loaded).

This means that the document is ready for you to start manipulating it with JavaScript or adding click events for example. If you load in your JavaScript from a `<script />` right before the closing `</body>` tag, you won't actually need to look our for the `DOMContentLoaded` event, as the document is guaranteed to be loaded by the time it reaches your JavaScript code.

However, as this is a library, which other people are going to be putting on their website, it's a good approach to include this listener, which means people can include it anywhere on the page.

## use strict

It may seem like we're going through this line-by-line, I promise we're not. But if you note the second line:

`"use strict"`

This statement tells the browser to execute your JavaScript slightly differently. In cut-down terms, it forces you to write your JavaScript in much stricter fashion, it turns mistakes into errors. So silly typos no longer go unnoticed, and loose coding isn't allowed. We could spend the rest of the post going through what exactly it looks for, but as long as you know what it's roughly doing, you won't be caught out by it being there. If you'd like to read more about the changes it brings about, do check out [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) for reference.

## the `return` statement

Next up, `if (!codeBlock) return`. If you place the keyword `return` anywhere in a function, the JavaScript engine will stop executing the function at that point. It doesn't stop running your JavaScript code altogether, it just halts the execution of the current function it's running. This can be useful if a certain condition isn't met and you really don't want any more of the code to execute. In uilang, the `return` statement is placed in the main callback function to the `DOMContentLoaded` listener, so in this case, it will in fact halt the whole library from running.

## Removing elements from the page

Those of you from the jQuery world have a handy method of removing an element from the page:

`$('#menu').remove();`

Done.

However, in native JavaScript, the DOM API isn't quite so forthcoming. We have to actually grab the parent element of the element we want to remove and then pass in our element as the child element to remove.

*phew*

A bit of a mouthful, but hopefully this line from uilang will clear it up:

`codeBlock.parentNode.removeChild(codeBlock)`

We want to remove `codeBlock`, so we have to traverse the DOM upwards to get it's parent, and then call `removeChild` on the parent, passing in the child element `codeBlock` which removes it from the page.

## Decrementing `while` loop & accessing `NodeList` items

If we take these few lines:

{% highlight javascript %}
var clicked = document.querySelectorAll(self.clickSelector)
var i = clicked.length
while (i--) {
	clicked.item(i).addEventListener("click", clickCallback)
}
{% endhighlight %}

Firstly, the amount of `clicked` elements on the page is stored in the variable `i`. Then the decrementing `while` loop is used to iterate them. The decrementing while loop is often considered to be the fastest way to iterate over a collection, if order doesn't matter. So where possible, it's often quicker to use this.

Secondly, we've now got our `NodeList` (a node list is the result of a `querySelectorAll` call, essentially, it's a collection of DOM nodes). We then loop over them and call `.item()` on the `NodeList`, passing in an index each time. `clicked.item(i)` is exactly the same as doing `clicked[i]`, ie. it returns you the `Node` at the passed in index, except for one small difference. If the `Node` doesn't exist at that index value, then `.item()` will return `null`, whereas using square brackets will return `undefined`. Arguably, it's probably cleaner to use `.item()`, but honestly, it really doesn't matter a whole heap of much.

## In closing

That about wraps up this light deconstruction of uilang. The only other thing to note is the use of `prototype` and the `new` keyword, but they're such big topics, we should really break them out into a future post to cover them properly.