---
layout: post
title:  "The anatomy of a simple templating engine"
date:   2014-12-01 18:25:31
---

If you've never used JavaScript templating before, I'd first check out this blog's [post on templating]({% post_url 2014-08-08-templating %}) for a high-level overview and use-cases for using them. If you have used them or at least had exposure to them, you might have used one or more of these:

* [Handlebarsjs](http://handlebarsjs.com)
* [Mustache](http://mustache.github.io)
* [Underscore.js templates](http://underscorejs.org/#template)

<br>

As a note, this post **does not** demonstrate the complexities and thought that goes into making a production-ready library like the three mentioned above, it simply serves as a rudimentary breakdown of the anatomy of what a templating engine does and how it does it.

As a quick recap, the (simplistic) idea of templating is to have a fragment of HTML (sometimes called a partial) like this: 

{% highlight html %}
{% raw %}
<div class="entry">
  <h1>{{ title }}</h1>
  <div class="body">
    {{ body }}
  </div>
</div>
{% endraw %}
{% endhighlight %}

And to be able to dynamically generate HTML from this template, but with the `{% raw %}{{}}{% endraw %}` placeholders replaced by real values.

## Usage

When creating functionality in development, I always like to start with the desired usage and work backwards. That way, you know exactly what you're trying to achieve as you're writing your implementation code.

We want to be to do the following:

{% highlight javascript %}
{% raw %}
var template = templater("<p>hey there {{ name }}</p>");
var div = document.createElement("div");
div.innerHTML = template({
  name: "Neo"
});
document.body.appendChild(div);
{% endraw %}
{% endhighlight %}

and for it to produce the following string: "hey there Neo"

As you can see, somewhere, we'll have a function defined called `templater` and this will accept a string of HTML and return you a function to use. This returned function will accept an object of keys and values. All you do is pass in the relevant keys and the desired values and you'll receive a string of HTML back with all the placeholders replaced appropriately.

## Implementation

Let's start of with defining our `templater` function:

{% highlight javascript %}
{% raw %}
var templater = function(html){
  
};
{% endraw %}
{% endhighlight %}

There we go. Step 1 complete.

Now we need it to return us a function that accepts an object but also that can still access our `html` argument from the `templater` function.

We can achieve this by creating a closure and returning it, like so:

{% highlight javascript %}
{% raw %}
var templater = function(html){
  return function(data){
    return html;
  };
};
{% endraw %}
{% endhighlight %}

To keep context, if we left our implementation of `templater` in the state it's in above, we would pass it the string:

{% highlight html %}{% raw %}<p>hey there {{ name }}</p>{% endraw %}{% endhighlight %}

and it would return it in the exact same state you passed it in. That's no good.

We need to now use the object the user passed in and start replacing some placeholders.

{% highlight javascript %}
{% raw %}
var templater = function(html){
  return function(data){
    for(var x in data){
      var re = /* a regex string */;
      html = html.replace(new RegExp(re, "ig"), data[x]);
    }
    return html;
  };
};
{% endraw %}
{% endhighlight %}

All we're doing in the above code, is using a [for in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) loop to access the values within our `data` object. Within each iteration of the loop, `x` will be equal to the current key and `data[x]` will give us the value for that key. 

## Regex

At this point, it's worth taking a deeper dive into the meat of a templating engine; Regex. A [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) is a pattern string which is used to match expressions within other strings. This topic most certainly deserves a standalone post, but for the purposes of making our mini-templating engine, we can just use a sprinkling of Regex to achieve it.

Inside the loop, `html` starts out as the initial string, but with each iteration, it (hopefully!) has it's placeholders replaced by the values from the object.

Now that we know, in theory, what we're trying to achieve with our Regex, let's move onto actually implementing it.

## Returning HTML

All that's left to do is to fill in our regex and we are done.

Our regex will look like this:

{% highlight javascript %}{% raw %}var re = "{{\\s?" + x + "\\s?}}";{% endraw %}{% endhighlight %}

First up, we're going to match the `{% raw %}{{}}{% endraw %}`. We then want to account for the user writing their placeholders like this:

`{% raw %}{{name}}{% endraw %}`

or like this:

`{% raw %}{{ name }}{% endraw %}`

So we need to say "if there's a space between the curly brace and the key name, fine, but it's not mandatory". We can do this by using `\s` (match the space) and by placing a `?` right after it, which means "match zero or one of the preceding element". Just to make things more interesting, because we're using the `RegExp` constructor (read more on the MDN link from above), we have to pass it a string, which means that elements like `\s` need to be double escaped, hence: `\\s`.

We can then use normal JavaScript string concatenation to insert the `x` value into our Regex string. This means that first our first (and only iteration) in our example, the final Regex will be output as: `{% raw %}{{\s?name\s?}}{% endraw %}`.

The final piece of the puzzle is to supply our RegExp constructor with a second argument, the Regex flags. These are special identifiers that inform the Regex engine how to apply the regex to our string. In our case, we've given it `i` and `g`. 

* `i` - Case-insensitive. It'll match `NAME`, `nAmE` & `name` in our example
* `g` - Global. If we placed two placeholders in our template HTML and we wanted them both replaced, we need to make sure the global flag is supplied so our replacement will be applied to all occurrences in the string.

And there we go. You can see the complete `templater` function below:

{% highlight javascript %}
{% raw %}
var templater = function(html){
  return function(data){
    for(var x in data){
      var re = "{{\\s?" + x + "\\s?}}";
      html = html.replace(new RegExp(re, "ig"), data[x]);
    }
    return html;
  };
};
{% endraw %}
{% endhighlight %}

## Notes

Like I mentioned above, this is a ridiculous simplification of the work that goes into making a fully-fledged templating engine, but what I do hope you take away from this run-through is a better understanding of closures, and hopefully Regex seems a little more approachable to you.
