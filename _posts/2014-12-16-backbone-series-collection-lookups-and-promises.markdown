---
layout: post
title:  "Backbone series: Collection Lookups and Promises"
date:   2014-12-16 18:25:31
---

Continuing our Backbone.js series, we're going to be looking at a Backbone pattern outlined by Jeremy Ashkenas in his [Backboneconf keynote](https://www.youtube.com/watch?v=P0YIdsJqKV4#t=1742), in which he showed an implementation of lazy-loading from the server and caching locally in your collections. We'll dig in below.

When a user hits your site at, for example, http://mywebapp.com/products/123, you'd ideally want to show them the product with an ID of "123". Ok, so how do you go about retrieving the product to show them, grab it locally from the collection? What if you've not yet fetched your collection? Ok, the server then. Well that's going to be slow if you make a request to the server each time they hit that URL. Let's look at a crude example of coping with both approaches.

{% highlight javascript %}
// router.js

routes: {
  "products/:id": "showProduct"
},

showProduct: function(id){
  var model = productsCollection.get(id);
  if(model){
    // render your product View and pass it the model
  } else {
    var newModel = new productModel({id: id});
    newModel.fetch({
      success: function(){
        productsCollection.add(newModel);
        // render your product View and pass it the model
      }
    });
  }
}
{% endhighlight %}

Ok, so that works, it's just not very elegant. Let's look at adding a collection method to tidy things up.

{% highlight javascript %}

// products-collection.js

var Products = Backbone.Collection.extend({
  lookup: function(id){
    var model;
    if(model = this.get(id)){
      return $.Deferred().resolveWith(this, model);
    } else {
      model = new ProductModel({
        id: id
      });
      return model.fetch();
    }
  }
});

{% endhighlight %}

Quite a few new concepts here. Firstly, we're using jQuery's $.Deferred object, which allows us to create a new Promise and resolve it immediately with the model from our collection. You can read more about the [`.resolveWith()`](http://api.jquery.com/deferred.resolveWith/) function on the jQuery site. If we don't have the model locally, we return a `.fetch()` function which itself returns a promise. Let's look at the usage of this `lookup` method and all shall become clear.

Our refactored router now looks something like this:

{% highlight javascript %}
// router.js

routes: {
  "products/:id": "showProduct"
},

showProduct: function(id){
  productsCollection.lookup(id).then(function(model){
    productsCollection.add(model);
    // render your product View and pass it the model
  });
}
{% endhighlight %}

As you can now see, we have a sane, consistent API for both synchronous and asynchronous operations.