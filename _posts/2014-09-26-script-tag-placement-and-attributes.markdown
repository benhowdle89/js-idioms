---
layout: post
title:  "Script tag placement & attributes"
date:   2014-09-26 18:25:31
---

Everyone knows that you don't put script tags in the `<head />` else you'll get arrested and disbarred from the web development community...but why is this? Why can't we put them in the head of the document?

## Placement

Pretty much one answer: `document.write()`.

Not that anyone cool uses it anymore, but this is the real reason why we shouldn't place our script tags above the `<body />` in the DOM tree. But why? Why does it have this negative impact? The answer is that, by nature and without any extra attributes, script tags are blocking and synchronous. 

This means that whenever the browser encounters a script tag, it'll stop all parsing and rendering of your HTML and *block the main UI thread* whilst it fetches and parses the JavaScript defined in your script tag.

And it does this because of `document.write()`. If you include this method in your JavaScript, it will write the contents that you pass in to it, to the DOM. This means that the browser cannot continue parsing and rendering your HTML *and* fetch and process the script, because the off-chance that you may have included a `document.write()` in your JavaScript which would then affect the DOM structure. 

So, this means that as long as your place your script tag(s) just before the closing `</body>`, then the whole document (your HTML) would have been parsed and shown on screen (minus some images that are still potentially loading).

The added benefit of placing your script tags this south, is that you don't need any sort of document "ready" listener, ie.

{% highlight javascript %}
$(document).ready(function(){});
{% endhighlight %}

or 

{% highlight javascript %}
document.addEventListener('DOMContentLoaded', function(){});
{% endhighlight %}

Kick those to the curb, because you won't need 'em! By the time that the browser encounters your script tag (at the bottom, right?), all the HTML will be present in the DOM and ready to accept your event listeners and DOM manipulation code.

## CDN fallbacks with document.write()

As a quick aside, there are a couple of legit use-cases for `document.write()`. The main one being CDN fallbacks, ie.

{% highlight html %}
<script src="//ajax.googleapis.com/ajax/libs/jquery/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/vendor/jquery.min.js"><\/script>')</script>
{% endhighlight %}

This will go in your HTML file, at the bottom like we discussed, and attempt to include jQuery in from Google's CDN. If, god-forbid, this CDN fails to load our jQuery file, we can check for the existence of `window.jQuery` OR write into the document another script tag, which points to a local copy of jQuery's source.

## Attributes

Moving on to the attributes we can place on script tags.

### Async

If you place the async attribute on your script tag, like so:

{% highlight html %}
<script async src="foo.js"></script>
{% endhighlight %}

The browser will attempt to execute the script whilst its parsing and processing the rest of the document.

### Defer

If you place the defer attribute on your script tag, like so:

{% highlight html %}
<script defer src="foo.js"></script>
{% endhighlight %}

The browser will not execute the script until the rest of the document has been parsed.

### Browser compatibility

Both async & defer works in all major browser, but will only work in IE10 & above (sorry IE9-ers). Defer is probably the one you want to be most careful about, because if you assumed the browser supports defer, and you place your script tag in the `<head />`, for example, it won't be "deferred", but executed immediately and halt the parsing of the HTML document. So be wary of using this blindly.

### HTML5

The HTML5 way of defining script tags allows you to omit the `type` attribute, so you can keep your script tags as lean as:

{% highlight html %}
<script src="foo.js"></script>
{% endhighlight %}