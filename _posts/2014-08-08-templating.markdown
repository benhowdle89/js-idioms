---
layout: post
title:  "Templating"
date:   2014-08-08 18:25:31
---

JavaScript templating is one of those concepts, where before you use it, you may not see a need for it, but once you have; there's no going back. It makes sense. It keeps things clean. But what exactly is templating?

Well, a template in generic terms means a document which can be built upon or from to produce other documents. This meaning does carry across fairly well to web. We're going to be looking at JavaScript templating and how it can aid us in writing our websites and web applications. 

## Using templates

Imagine we have an autocomplete input on our website, which, when the user types something in, we take that value, send it off to our backend server and then display the results from the server on the page. 

Which might look something like this:

{% highlight javascript %}

$('#searchInput').on('keyup', function(e){
	var value = $(this).val();
	$.ajax({
		url: "/autocomplete/" + value,
		success: function(results){
			var resultsEl = $('#results');
			resultsEl.empty();
			for(var i = 0; i < results.length; i++){
				resultsEl.append('<li class="search-result">' + results[i].item + '</li>');
			}
		}
	});
});

{% endhighlight %}

A fairly simple piece of functionality. We receive an array from our server in the `success` function and we then use a `for` loop on the array and build up a string of HTML inside the `append` function which puts it into the DOM, with the value concatenated into the middle. Now this example, although small and rudimentary, can hopefully illustrate that if we develop more complex features, this might turn into spaghetti code. 

So before we move on to how templating might aid us here, it might be worth looking at what, potentially, might trip us up or slow us down in the future.

Firstly, the mixing of markup and JavaScript in the same file is generally advised against. If you want to change the HTML for the autocomplete feature, wouldn't it be nice to *actually go to a HTML file* and not open up your JavaScript? If you have designers on your team who can do HTML and CSS, they're certainly not going to want to trawl through your JavaScript files to change a CSS class name. So, we want to put our HTML into HTML files and we want to write HTML, not some mangled string of concatenated mess, which lives inside a JavaScript function. Right. On we go to templating.

For today's post, I'm going to be using the [Handlebars](http://handlebarsjs.com/) templating engine in all the examples, to keep it simple. Handlebars happens to be one of the most widely used and praised choices out there for templating, so we're in good hands.

Lets start by illustrating how Handlebars works (which is similar to the rest), then we'll build up to a more realistic development workflow using Handlebars.

{% highlight javascript %}
<script id="results-template" type="text/x-handlebars-template">
{% raw %}{{#each results}}
	<li class="search-result">{{item}}</li>
{{/each}}{% endraw %}
</script>
{% endhighlight %}

So, as you can see, a template is simply a fragment of HTML. It may be a whole UI component, or just one tag, like the one above. The main motivation is the pull the actual HTML *out* of your JavaScript code. There may be a couple of things that may strike you as odd in the above template. Firstly, it's inside a script tag. One method of using Handlebars, is store your fragments of HTML in script tags, but to change the `type` attribute to something other than `text/javascript`, which means that it won't be processed by the browser as *actual* JavaScript code. So next you might be thinking, what's up with the curly braces. These are special "tags" for Handlebars itself. It tells Handlebars that it needs to convert these and their contents into real HTML. The logic here hopefully looks quite self-explanatory, we're looping over the `results` array from our server, and then outputting an `<li>` for each, and then saying we want the `item` property from each object in the `results` array populated into our HTML. Once I show you how we integrate this into our JavaScript code from the beginning, it should hopefully be a lot simpler to understand.

The code for this is as follows:

{% highlight javascript %}

$('#searchInput').on('keyup', function(e){
	var value = $(this).val();
	$.ajax({
		url: "/autocomplete/" + value,
		success: function(results){
			var resultsEl = $('#results');
			var source = $("#results-template").html(); // this is the contents of our script tag
			var template = Handlebars.compile(source); // here we pass the template to Handlebars
			var html = template(results); // Handlebars gives us a function which returns HTML. Results is from the server
			resultsEl.html(html); // We can then use that HTML to populate into the DOM
		}
	});
});

{% endhighlight %}

So, we kept our HTML out of our JavaScript code and we gave Handlebars the template and some data and it returned us some processed HTML, which we can pop into the DOM for the user to see.

That should serve as a basic intro to templating, however, if you'd like to see more of what you can do with Handlebars, including registering your own functions (like the `#each` you saw above), then head on over to the [docs](http://handlebarsjs.com/) and have a go with some more of the advanced uses and features of Handlebars.

## Hold on to your butts

So I said at the start, that it would be excellent if we could house our HTML in separate files, and work on them without having to put them in script tags. But how? Well, we're going to use our knowledge of [dependency management]({% post_url 2014-08-01-package-management-and-dependency-management %}) and Handlebars pre-compilation.

Handlebars pre-compilation means that you don't have to compile the template in the browser, it's actually sent to the browser already compiled and ready to go, which improves the performance, which is always nice.

To use Browserify (dependency manager) and Handlebars pre-compilation, we're also going to briefly introduce another piece to our puzzle; Gulp. Now this post isn't an intro to Gulp, so I'm only going to explain the relevant parts of Gulp (enough to complete our templating functionality), and then follow up with another post specifically on JavaScript task runners (like Gulp and Grunt, for example). So if you create a new folder somewhere, and open up terminal. Hopefully you've got Node.js installed on your machine, if you haven't, head on over to [the site](http://nodejs.org) and download it - should only take a minute or two.

In terminal, within your new project directory, create an `index.html`, a `main.js` and a `gulpfile.js`. Into the gulpfile, paste the below:

{% highlight javascript %}
var gulp = require('gulp');
var browserify = require('gulp-browserify');

var hbsfy = require("hbsfy").configure({
	extensions: ["html"]
});

gulp.task('scripts', function() {
	gulp.src('main.js')
		.pipe(browserify({
			transform: [hbsfy]
		}))
		.pipe(gulp.dest('./built/'));
});

// default gulp task
gulp.task('default', ['scripts']);
{% endhighlight %}

Once you've done that, type into terminal `npm install gulp -g`, when that's finished, type in `npm install gulp handlebars hbsfy jquery`. This will tell npm (Node.js' own package manager) to install gulp on your system and the rest into your project directory. We'll come back to that gulp file in a second. 

Next I'd like you to create a sub-directory called `templates` and create a file inside called `sample.html`. Fill it with this content:

`<p>I'm from the template!</p>`

and into the `index.html` file, place the content below:

{% highlight html %}
	
<html>
<body>
	<div id="page">

	</div>
	<script type="text/javascript" src="built/main.js"></script>
</body>
</html>

{% endhighlight %}

Now, in your `main.js` place this content:

{% highlight javascript %}

var template = require('./templates/sample.html');
var $ = require('jquery');

$('#page').html(template());

{% endhighlight %}

and then open up terminal and type in `gulp`. Now all being well, you should be able to visit the `index.html` page in a web browser and see the contents of your `sample.html` file on the page.

Now, to run through everything we've just done. First off, we used [Gulp](http://gulpjs.com/), which as I mentioned, we won't delve too much into now, but it's a build system. You tell it tasks to perform, and it performs them. We defined a `scripts` task in our `gulpfile.js` above and told Gulp to run that task, whenever we run `gulp` from the command line. It's the default task. We tell Browserify where to find our "main" JavaScript file, which happens to also be called `main.js` and then we tell it to "transform" our file as it's being processed. In our case, as we're using Handlebars, what this will do is scan our `main.js` and find the `require` function which points to a `.html` file (our template!) and says, "when you find one of these, please pre-compile it with Handlebars". Then Browserify continues as normal and outputs a new file: `built.js`. This new file will contain all the HTML content from our `.html` template, ready for when we run this line: `$('#page').html(template());`. 

So by now, you're armed with a basic understanding of how templating works, and it's advantages. You know how to use Handlebars, and you can now develop using separate `.html` files, and build your templates into your JavaScript file using Browserify and Gulp. Not bad.
