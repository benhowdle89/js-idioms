---
layout: post
title:  "Backbone series: View Management with Regions"
date:   2015-02-16 18:25:31
---

### Screencast

<iframe class="hide-on-mobile" width="900" height="505.8" src="https://www.youtube.com/embed/JN-qnL0qqZk" frameborder="0" allowfullscreen></iframe>

<p class="muted"><a href="https://www.youtube.com/watch?v=JN-qnL0qqZk">Watch on YouTube</a></p>

<hr class="fancy">

If you've used Backbone.js for any length of time, your first likely port of call for View rendering is going to be:

{% highlight javascript %}
var myViewInstance = new MyView();
$("#myContainer").html(myViewInstance.render().el);
{% endhighlight %}

Or something to that effect...

This is not scalable for anything beyond a Todo app. And by "scalable", I mean for you as a developer managing your application.

### Regions

Enter regions. Regions are the result of you visually splitting up your UI into logical components.

Let's take a blog to illustrate what we mean by regions.

![](/img/blog_layout.png)

We can now visually represent our application in regions. 

So what *exactly* are regions?

Well, in my applications, I create a Regions object, which holds the individual region objects themselves.

A region object is a reference to a DOM node.

*As an aside, the examples below all follow the CommonJS module format, and get processed for the browser with Browserify. I highly recommend checking it out.*

{% highlight javascript %}
// regions.js
module.exports = {};
{% endhighlight %}

And here is how I use this Regions module:

{% highlight javascript %}
var regions = require('./regions.js');

regions.header = $('[data-js-region="header"]');
regions.footer = $('[data-js-region="footer"]');
regions.sidebar = $('[data-js-region="sidebar"]');
regions.content = $('[data-js-region="content"]');
{% endhighlight %}

Now in our Regions object, we have four properties, each contains a reference to a DOM node. You can think of it as us mapping an actual JavaScript object (and it's key/value pairs) to our visual representation above.

So far, we've done nothing of real value. All we've done is built up an object containing references. So let's move on to putting the HTML output from a View instance into our regions.

### Swap

The idea for the "swap" concept came from, as far as I know, [Dan Harper's excellent View Manager](https://github.com/danharper/backbone.viewmanager). I've used this in many-a-project, and over the years have adapted/modified it to suit my needs. I'm going to show you how you use it, then we can delve deeper into how it's implemented under the hood.

{% highlight javascript %}
var swap = require('./swap.js');

// these are static Regions. I display these on page load, and they don't really change all that much
swap(regions.header, new headerView());
swap(regions.footer, new footerView());
swap(regions.sidebar, new sidebarView({
  menuLinks: ['about', 'contact', 'services']
}));

// this is a dynamic Region. Think of these swaps as someone going to a new page
swap(regions.content, new aboutView());
swap(regions.content, new servicesView());
swap(regions.content, new contactView());
{% endhighlight %}

As you can see, we pass the `swap` function a reference to a region, and a View instance, and it does all the rest for us. By "all the rest", I mean that the result is the HTML from the View instance is populated into the Region DOM element on the page.

Let's delve into the `swap` function...

{% highlight javascript %}
module.exports = function(region, newView) {

  // if there's an old View in the region, grab a reference to it
  var oldView = region.view;
  if (oldView) {

    // unbind the event listeners
    oldView.off();
    if (oldView.model) {
      oldView.model.off('change', oldView.render, oldView);
    }

    // remove the old View HTML from the page
    oldView.remove();
  
    // remove references to the el DOM nodes
    delete oldView.$el;
    delete oldView.el;
  }
  
  // save a reference to the new View on the Region itself
  region.view = newView;

  // put the HTML output from the new View into the Region (and therefore the page)
  region.html(newView.render().el);

};
{% endhighlight %}

If you'd like a play with this, and see it in action, check out the embed below, or click through to JSBin to edit the code:

<a class="jsbin-embed" href="http://jsbin.com/nibubilifi/2/embed?html,js,output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

If the swap function finds a reference to an old View already assigned to a Region (ie. going from "services" to "about"), it does some housekeeping and removes the event listeners. However, if you use `listenTo`, introduced in Backbone.js 0.9.9 I believe, then Backbone will remove the events when the View is destroyed anyway. The housekeeping above is mostly aimed at developers using `.on()` for event listeners, as these aren't removed automatically.

### Notes

I tend to abuse the Router a fair bit in Backbone.js projects, and use it as not only a Router, but a high-level app controller. This is a snippet from one of my projects, so you can see the `swap` function and the Regions object working together:

{% highlight javascript %}
initialize: function() {
  this.renderLayout();
},

routes: {
  "": "home",
  "search/:term": "searches",
  "*path": "home"
},

renderLayout: function() {
  regions.header = $('[data-js-region="header"]');
  regions.footer = $('[data-js-region="footer"]');
  regions.content = $('[data-js-region="content"]');
  this.renderHeader();
  this.renderFooter();
},

renderHeader: function() {
  swap(regions.header, new headerView({
    user: auth.user,
    router: this
  }));
},

renderFooter: function() {
  swap(regions.footer, new footerView());
},

home: function() {
  swap(regions.content, new homeView({
    router: this
  }));
},

searches: function(term) {
  var _showsCollection = new showsCollection();
  swap(regions.content, new searchesView({
    collection: _showsCollection,
    router: this,
    term: term
  }));
}
{% endhighlight %}

If this happens to solve some View management headaches you were having with Backbone.js, then great! Also, if you have a questions, as always, just drop a comment below and I'll be sure to reply as soon as I can...