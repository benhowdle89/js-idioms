---
layout: post
title:  "Isomorphic Web Apps and React.js"
date:   2015-02-23 18:25:31
---

### Preamble

This post is going to be in a _slightly_ different format to the other, more step-by-step, ones. I think the title "How to build isomorphic web apps" would be misleading, in that I'd be advocating my own dogmatic opinion. This post will simply aim to illustrate different tactics and approaches I considered and explored whilst trying to achieve a certain style of web app architecture.

### Isomorphic

What is it? Well, the dictionary definition of it is:

> Isomorphic; being of identical or similar form, shape, or structure

In terms of software, and more specifically JavaScript, we define it as code that can run on the client and the server. So, regardless of environment.

This has always been great in terms of transferable skills for developers, as they could take their knowledge of JavaScript, and with a few tweaks and un-learning certain practices, write server-side code. 

### Our goal

In real, tangible terms, we want one codebase. One set of view logic. One set of routes. And have all the actual "app code" we write to be environment-agnostic, ie. the logic doesn't need to be concerned with where it's being ran, it can be executed on the server and on the client. Great.

### Benefits

The speed of server-side rendered HTML, sent with the initial request, and then the slick speed and experience of PushState and AJAX data-loading. This means our web app can be SEO-ified, it's accessible, forms still submit, links still function (without JavaScript I mean).

### The stack

This is my personal preference for building web apps. Grown and adapted from personal experience and experimentation. The only new player on the roster is React.js. React.js is the View layer of your web app stack. It takes JavaScript data structures and produces HTML to populate into the DOM (in very black and white terms). This isn't an "intro to React.js", but more of an exposure to seeing it "in the wild". The other players are:

* Backbone.js - We'll use this to structure our data logic. And to also handle URL changes and routes.
* Node.js - This will create our webserver and manage incoming requests. 
* Browserify - This magical tool allows us to share logic between server & client, by packaging up modules for the browser and Node.js alike.

You may ask, "why React.js?", as we're using Backbone.js (which has a View layer itself). Won't they conflict? Well, maybe, but the real reason we're using React.js, is that it can be ran in a Node.js environment and give us the rendered HTML to send along with the initial request.

### Walkthrough

Like I said, this post will be more of a brief overview of what isomorphic JavaScript *might* look like.

The source: [https://github.com/benhowdle89/isomorphic-js-app](https://github.com/benhowdle89/isomorphic-js-app). Feel free to skip ahead and look through the codebase at your own pace.

I should also point out that I'll try and walkthrough the application as chronologically sound as I can, ie. user hitting the site, through to displaying data, etc...but I'll more than likely skip a few bits to avoid making this post too dense.

### Initial request

We only really have one single route handler in the Node.js, and it's only used to pass off responsibility to our main app controller:

{% highlight javascript %}
app.use(controller.init.bind(controller));
{% endhighlight %}

This instructs Express to accept any request that hasn't already been handled, and call the `init` function of our app controller.

Our `init` function looks like this:

{% highlight javascript %}
init: function(req, res, next) {
  
  // create a new instance of our Backbone.js router
  this.mainRouter = new MainRouter();
  
  // attach a listener for every "route" event
  this.mainRouter.on('route', function(route) {

    // grab all the data needed for that route, ie. /users would go grab all Users from a database, for example
    this.bootstrap(route, function(data) {
      
      // execute the route handler in the router itself
      var markup = this.mainRouter[route]();
      this.respond(res, markup, data);

    }.bind(this));
  }.bind(this));
  
  // as there's no address bar, we have to manually call the first route
  Backbone.history.loadUrl(req.url);
}
{% endhighlight %}

And then the `respond` method is where we actually send the `index.html` file along with the initial markup/data:

{% highlight javascript %}
respond: function(res, markup, data) {
  res.render('index', {
    initialMarkup: markup,
    data: data
  });
}
{% endhighlight %}

Our `index.html` file being very minimal in nature:

{% highlight html %}
{% raw %}
<html>
  <body>
    <script>
      var BOOTSTRAP = {{#json data}}{{/json}};
    </script>
    <main>
      {{{initialMarkup}}}
    </main>
    <script type="text/javascript" src="/app.js"></script>
  </body>
</html>
{% endraw %}
{% endhighlight %}


### Routing

If we turn to our Backbone.js router now, and look at what would happen if the user hit the site on `/users`. This `showUsers` function is the handler for that route:

{% highlight javascript %}
showUsers: function() {
  return this.renderApp(UsersComponent, {
    users: UsersCollection
  });
}
{% endhighlight %}

So we're telling the `renderApp` function to take in a `UsersComponent` (this is our first involvement from React.js) and populate it into our main AppComponent. We can also pass in an optional Backbone Collection which will supply our route-specific data. This means we can avoid page-load AJAX requests.

{% highlight javascript %}
renderApp: function(component, collections, models) {

  // we create a factory from our AppComponent - I'm new to React, it works, but I'm not sure this is the best way
  var appComponentFactory = React.createFactory(AppComponent);
  var appComponent = appComponentFactory({
    component: component,
    collection: collections || {},
    model: models || {}
  });

  // this is one the few environment checks we do throughout the app
  // it's not great to litter your code with `if` statements like this, so I find its best to keep them as high-level as possible
  if (typeof window === 'undefined') {
    // we're now in the Node.js environment, ie. the user hasn't even seen the page yet
    return React.renderToString(appComponent);
  }
  // the page has loaded, render the app component into the <main /> HTML node
  // you may think its odd that this happens twice, however, React is clever enough to not re-render the HTML
  // it'll only apply the necessary event listeners to the existing HTML
  return React.render(appComponent, document.querySelector('main'));
}
{% endhighlight %}

In terms of getting the markup rendered, the routes handled and the components formed, the above covers a large part of the "glue logic" we had to write to enable the isomorphic nature of this web app.

### App Component (React)

To illustrate a Route changing, ie. going from `/users` to `/products`, this is our main App (React) component:

{% highlight javascript %}
processCollections: function(){
  var collection = {};

  // instantiate all the collections at this point, ready to pass into the child components 
  for(var col in this.props.collection){
    collection[col] = new this.props.collection[col];
  }

  return collection;
},

render: function(){
  return (
    <div>
      <HeaderComponent />

      // We then include our passed-in child component, ie. UsersComponent, or ProductsComponent
      {(this.props.component) && <this.props.component collection={this.processCollections()}/>}
      
      <FooterComponent />
    </div>
  );
}
{% endhighlight %}

### Bootstrapping our app with data

One last thing I wanted to go through, was avoiding the page-load AJAX requests you see in most client-side web apps.

We pass our React components a Backbone collection. If that component is the first one to be rendered, ie. the user has hit `/users` and we send the relevant HTML along with the initial response, we could also take that opportunity to bootstrap our collections with data, and not have to AJAX the data in on page load.

In our child components (users, products, etc) we use React's `componentWillMount` to pre-fill our Backbone collection (server-side). If the user clicks a link to go to `/users`, then this piece of code will trigger an AJAX request.

{% highlight javascript %}
componentWillMount: function(){
  // this.getCollection() is part of https://github.com/magalhas/backbone-react-component
  this.getCollection().users.on('reset remove', function(){

    // we can now use React's `setState` method to trigger a render to the UI
    this.setState({
      users: this.getCollection().users
    });
  }.bind(this));

  // this `boostrap` method is a Collection method we've written, which I'll show you below
  this.getCollection().users.bootstrap();
}
{% endhighlight %}

We create ourselves a base Backbone Collection. This is the Collection that all other Collections extend and inherit from. So when we do `users.bootstrap()`, we're actually calling the `bootstrap` method below on the base Collection.

{% highlight javascript %}
var Backbone = require('backbone');
var Bootstrap = require('./../bootstrap'); // this is just an object literal, ie. {}

module.exports = Backbone.Collection.extend({
  bootstrap: function() {

    // this is on the server, before we send the initial response
    if (typeof window === 'undefined') {

      // we "reset" the Backbone Collection with the data from the Bootstrap object, triggering the "reset" listener in the React component above
      this.reset(this.fetchData(this.name));

    } else {
      
      if (typeof BOOTSTRAP !== 'undefined' && BOOTSTRAP && BOOTSTRAP[this.name]) {
        // if we've previously fetched the data by AJAX, load it from cache. This is app-specific and your own choice
        return this.reset(BOOTSTRAP[this.name]);
      }
      
      // we set another listener and save the results from the AJAX request to an object on the client (basically a browser-side version of our Bootstrap module above)
      this.on('reset', function() {
        BOOTSTRAP = BOOTSTRAP || {};
        BOOTSTRAP[this.name] = this.toJSON();
      }.bind(this));

      // we return a Promise, which in turn will send an AJAX request and trigger the "reset" event
      return this.fetch({
        reset: true
      });

    }
  },
  fetchData: function(collection) {
    return Bootstrap[collection];
  }
});
{% endhighlight %}


### In closing

This was my first experiment with React.js, so I was very much learning by doing, but it was certainly eye-opening to see how, with a small bit of glue logic, we could set ourselves up with a framework that allows us to write environment-agnostic code.

Myself, along with others I'm sure, find certain tutorials and blog posts fairly contrived in the examples they showcase. [TodoMVC](http://todomvc.com/) is a delightful resource, and taking nothing away from work that's gone into it, it does exactly what it set out to do; giving you a sampling of each framework and library by building one, very simple application. By including the Users and Products resources (you can further check out the [Node.js setup](https://github.com/benhowdle89/isomorphic-js-app/blob/master/api/index.js) I usually employ when dealing with API-side data), I hope I've given you a glimpse at how I'd approach a real application. I can say with confidence that other applications I've built will, and have, scaled well, however, as this was a new and experimental architecture for me, I can't promise the sample application I built takes into account all scenarios and situations.

### Resources

A couple of resources that you may want to check out on isomorphic JavaScript applications:

* Airbnb's [Rendr](http://nerds.airbnb.com/weve-open-sourced-rendr-run-your-backbonejs-a/)
* Nodejitsu on [Scaling Isomorphic Javascript Code](http://blog.nodejitsu.com/scaling-isomorphic-javascript-code/)
