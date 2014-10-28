---
layout: post
title:  "Pagination with Lo-Dash"
date:   2014-10-28 18:25:31
---

I recently released a project called [ReqRes](http://reqr.es), which allows you to test your front-end interfaces and AJAX requests against a hosted JSON REST-API.

You can check out the full source of the application on [GitHub](https://github.com/benhowdle89/reqres) if you'd like.

All the data that the API sent to the user was stored in a JSON file, not a database, so querying and sorting the data meant that I couldn't use standard database operations, but standard (with Lo-Dash's help) array methods to achieve what I needed; pagination.

If you've not met [Lo-Dash](https://lodash.com) before, it's "A utility library delivering consistency, customization, performance, & extras". It's marketed as a more performant [Underscore.js](http://underscorejs.org), so if you're used to using that, maybe give Lo-Dash a try.

So I had an array which I needed to paginate, like so:

{% highlight javascript %}
[
    {
        "id":1,
        "first_name":"george",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
    },
    {
        "id":2,
        "first_name":"lucille",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
    },
    {
        "id":3,
        "first_name":"oscar",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"
    },
    {
        "id":4,
        "first_name":"eve",
        "last_name":"holt",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
    },
    {
        "id":5,
        "first_name":"gob",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
    },
    {
        "id":6,
        "first_name":"tracey",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
    },
    {
        "id":7,
        "first_name":"michael",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/follettkyle/128.jpg"
    },
    {
        "id":8,
        "first_name":"lindsay",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/araa3185/128.jpg"
    },
    {
        "id":9,
        "first_name":"tobias",
        "last_name":"funke",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/vivekprvr/128.jpg"
    },
    {
        "id":10,
        "first_name":"byron",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/russoedu/128.jpg"
    },
    {
        "id":11,
        "first_name":"george michael",
        "last_name":"bluth",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/mrmoiree/128.jpg"
    },
    {
        "id":12,
        "first_name":"maeby",
        "last_name":"funke",
        "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/hebertialmeida/128.jpg"
    }
]
{% endhighlight %}

I then needed to accept a `page` parameter (ie. the range of data the developer wanted). So my final function ended up looking something like this (which I'll break down):

{% highlight javascript %}
function getPaginatedItems(items, page) {
	var page = page || 1,
		per_page = 3,
		offset = (page - 1) * per_page,
		paginatedItems = _.rest(items, offset).slice(0, per_page);
	return {
		page: page,
		per_page: per_page,
		total: items.length,
		total_pages: Math.ceil(items.length / per_page),
		data: paginatedItems
	};
}
{% endhighlight %} 

So now, all we need to do is to pass in our array of data and a page number, and we'll receive in return a fully populate pagination object.

Lo-Dash played a key part in this as it provided the `_.rest()` method, which allows you to provide an array and an offset. Which basically means it will chop off or skip the `offset` number of items from the array and only return the rest of the items. We can then use the standard JavaScript `slice()` array method to limit the results returned to our pre-configured number of items to return.

## Notes

Not something that you'll use too often, but it's always good to practice and be proficient at working with data structures in JavaScript. So give Lo-Dash a go and see what other, traditionally, server-side operations you can re-create in JavaScript, just like our pagination function above.
