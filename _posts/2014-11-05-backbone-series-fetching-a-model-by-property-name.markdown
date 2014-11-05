---
layout: post
title:  "Backbone series: Fetching a model by property name"
date:   2014-11-05 18:25:31
---

Following on from [part 1]({% post_url 2014-10-17-backbone-series-handling-asynchronous-data %}) of our Backbone.js series, we're going to look at fetching a single model from our server, but by one of it's property names.

The usual flow for fetching a model in Backbone goes something like this:

{% highlight javascript %}

var UserModel = Backbone.Model.extend({
  urlRoot: "/api/users"
});

var userModel = new UserModel({
  id: someIDFromTheServer // ie. a real id from our database
});

userModel.fetch();
{% endhighlight %}

The above `fetch` operation would send a `GET` request to `/api/users/[someIDFromTheServer]`. Which is all fine and dandy for most cases, but what about if, in our application, we'd like to fetch resources by a different identifier; maybe a short ID from the URL, Instagram style:

[http://instagram.com/p/tsbwdDwqje](http://instagram.com/p/tsbwdDwqje)

Although I'm not an expert on Instagram's internal infrastructure, I'd take an educated guess that "tsbwdDwqje" is not the actual database ID of that resource, it's more likely to be a friendly, easy-shareable ID which they store against that image.

So if we continue with our Instagram example, the user will hit the above URL (http://instagram.com/p/tsbwdDwqje) and expect to be shown the image which is linked to that short ID.

A hypothetical Backbone router for this scenario would look something like this:

{% highlight javascript %}

routes: {
  "/p/:short_id": "showImage"
}

showImage: function(short_id){
  // short_id is "tsbwdDwqje" from the above hyperlink
  var imageModel = new ImageModel({
    short_id: short_id
  });
  imageModel.fetch();
}

{% endhighlight %}

So one would hope that Backbone might realise that the model only has one property, and attempt to append our "short_id" property to the end of the requested URL, making it: `/api/images/tsbwdDwqje`. However, this mildly violates RESTful URL design, so no dice. As this isn't the case, a GET request would be simply sent to `/api/images`; not ideal.

## Model methods

We can introduce a model method onto our Images Model. The desired behaviour is that we want to tell our model, when it does fetch, to append on a supplied property name from our model. In this case, we want to append on the "short_id" property value.

Our model method would look something like this:

{% highlight javascript %}

var ImagesModel = Backbone.Model.extend({
  urlRoot: "/api/images",
  getByProperty: function(prop){
    // "this" is now our Model instance declared from the router
    this.url = this.urlRoot + "/" + this.get(prop);
  }
});

{% endhighlight %}

And our Instagram Backbone router would now look like this:

{% highlight javascript %}

routes: {
  "/p/:short_id": "showImage"
}

showImage: function(short_id){
  // short_id is "tsbwdDwqje" from the above hyperlink
  var imageModel = new ImageModel({
    short_id: short_id
  });
  imageModel.getByProperty("short_id");
  imageModel.fetch();
}

{% endhighlight %}

The requested URL is now: `/api/images/tsbwdDwqje`, which does go against the `/resource/id` REST principles, but sometimes you need to bend best practices to fit your own application needs, I won't judge.

By introducing this model method, we've now given ourself a lot of flexibility on how we fetch resources from the server, either by the default `id` or with our new `getByProperty` method.