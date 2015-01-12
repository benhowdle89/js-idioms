---
layout: post
title:  "Backbone series: Reacting to Events from Shared Collections"
date:   2015-01-12 18:25:31
---

Continuing our Backbone.js series, we're going to be looking at how we can react to events in one View, which have been triggered by another. Both Views will share the same Collection instance, which gives us our logical link.

In practice, what we actually want to do is render a bunch of users (from a Users Collection) on the page, and let the user delete them.

First, lets define out Models and Collections and create our Collection instance (fairly standard stuff):

{% highlight javascript %}
var UserModel = Backbone.Model.extend();
var UsersCollection = Backbone.Collection.extend({
  model: UserModel
});

var users = [{
  name: "Trinity"
}, {
  name: "Morpheus"
}, {
  name: "Neo"
}];

var usersCollection = new UsersCollection(users);
{% endhighlight %}

Next we want to create our Users View, which will act as the container view for all the users on the page:

{% highlight javascript %}
var usersView = Backbone.View.extend({
  // create our container template
  template: _.template("<div data-region='users'></div>"),
  initialize: function(){
    // whenever the collection issues a "remove" event, we call `this.render()`
    this.listenTo(this.collection, "remove", this.render);
  },
  renderUsers: function(){
    // for each User model in the collection, create a new User View and append it to this View's $el
    this.collection.each(function(model){
      this.$('[data-region="users"]').append(new userView({
        model: model
      }).render().el);
    }, this);
  },
  render: function(){
    this.$el.html(this.template());
    this.renderUsers();
    return this;
  }
});
{% endhighlight %}

We can then create our User View, which will render out each User model and then attach the click handlers for deleting users:

{% highlight javascript %}
var userView = Backbone.View.extend({
  template: _.template("<p><%= name %>&nbsp;<span>&#x2717;</span></p>"),
  events: {
    "click span": "deleteUser"
  },
  deleteUser: function(){
    // destroy the clicked Model that was passed in by the Users View
    this.model.destroy();
  },
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});
{% endhighlight %}

Kick everything off by appending a new Users View to the DOM:

{% highlight javascript %}
document.body.appendChild(new usersView({
  collection: usersCollection
}).render().el);
{% endhighlight %}

As you can see, we pass the Collection instance to the Users view. Then we pass each Model to a new User view, which means that when we destroy a certain model from a User View, the `usersCollection` knows about it and triggers a "remove" event.

If you'd like to play around with the code referenced above and see it all in action, check out the JSBin embed below (press the "Run with JS" button to reset the list after deletion).

<a class="jsbin-embed" href="http://jsbin.com/xosofi/3/embed?js,output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>