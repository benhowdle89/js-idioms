---
layout: post
title:  "Backbone series: Handling asynchronous data"
date:   2014-10-17 18:25:31
---

This is going to be the first in a series of [Backbone.js](http://backbonejs.org) posts. There won't be any particular order, ie. beginner -> advanced, but more a collection of some of the patterns I've encountered and concepts we can learn from. It would help if you're at least slightly familiar with Backbone.js, but you'll hopefully still be able to pick the odd thing up even if you're not.

## Async data

Most of JavaScript is synchronous, which has it's major plus points; one being that you can handle everything in a very procedural manner.

*This happens.*

*Then this thing happens.*

*Then this one.*

The real joy comes when one of your *things* is asynchronous (ie. an AJAX request, or a `setTimeout`). How do you make sure you have all you need for when the *next thing happens*?

In real terms, the *next thing* that needs to happen could be outputting a list of users to the DOM. How are we getting our list of users? From the server. Ok, so we need our AJAX request to happen and *then*, we can output our list of users.

Ok, onto Backbone.js...

## Backbone.js

Given this extract from a sample Backbone router subclass:

{% highlight javascript %}
// would be called if the user has navigated to /users in their browser
showUsers: function(){
  var users = new userCollection();
  users.fetch();
  $('#content').html(new usersView({
    collection: users
  }).render().el);
}
{% endhighlight %}

So this code is all fine 'n dandy, apart from one thing:

By the time that the AJAX request has completed (this happens when you call `fetch` in Backbone), we would have already rendered our HTML into the `#content` DIV. No no no, this simply won't do!

We have two options:

Fetch the data and *then* render the HTML into the DOM.

*or*

Render a skeletal HTML structure to the DOM, fetch the data, and *then* render each user into the DOM structure that already exists.

## Pre-fetching

The simplest way we can do this is to call `fetch` on our users Collection and then render the View once it's complete. We can do this like so:

{% highlight javascript %}
// would be called if the user has navigated to /users in their browser
showUsers: function(){
  var users = new userCollection();
  users.fetch({
    success: function(){
      $('#content').html(new usersView({
        collection: users
      }).render().el);
    }
  });
}
{% endhighlight %}

**Pros of doing it this way:**

• Data is fetched outside of the View, which complies more with the MVC pattern (depends on how you interpret MVC in Backbone.js)

• The View is just handed data and told to render, which is more in line with what a View should do

**Cons of this way:**

• The URL will have changed over to `/users`, but they'll be staring at a, potentially, empty screen until the AJAX request has finished

## Partial render, then lazy-load/lazy-render our users into the DOM

{% highlight javascript %}
// would be called if the user has navigated to /users in their browser
showUsers: function(){
  var users = new userCollection();
  $('#content').html(new usersView({
    collection: users
  }).render().el);
}
{% endhighlight %}

As you can see, we don't call `fetch` at all in our Router, but we just instantiate and pass it into our new View.

Switching over to the implementation of what our `usersView` might look like:

{% highlight javascript %}
var usersView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, "add", this.renderUser, this);
  },

  renderUser: function(user){
    this.$("#ourUsersContainer").append(new userView({
      model: user
    }).render().el);
  }

  render: function(){
    this.$el.html( /* this would be a template with the surrounding HTML for our users View */);
    return this;
  }

});

var userView = Backbone.View.extend({
  render: function(){
    var template = _.template("<p><%= name %></p>");
    this.$el.html(template(this.model.toJSON()));
    return this;
  }
});
{% endhighlight %}

We've now rendered out skeletal HTML straight to the DOM. This might be something as simple as:

{% highlight html %}
<h2>Our users</h2>
<div id="ourUsersContainer"></div>
{% endhighlight %}

Just enough for the user to realise what's going on and exactly what they'll be looking at.

We then listen out for an "add" event on our users collection. This event is triggered by Backbone.js everytime a new Model is added to the relevant collection (which will happen multiple times as our AJAX request completes). When this event occurs we can then run our `renderUser` function which accepts a User Model. This function will append the contents of a new `userView` each time it's called. This is a common pattern in Backbone.js, even though it might feel like a lot for something so simple, we're now building up a nice set of re-usable components for our UI. 

**Pros of doing it this way:**

• The user navigates to /users and is given immediate visual feedback that something has happened

**Cons of this way:**

• We may want to include a loading animation to appear between showing the skeletal HTML and the first user being rendered. The "con" in this approach is a "pro" in the other approach, where all the data was fetched before the user saw anything.

## In closing

Hopefully, seeing these approaches have alleviated frustrations you may have been facing with handling asynchronous operations in JavaScript, and potentially Backbone.js.

Stay tuned in the coming weeks for more Backbone.js tips and patterns.