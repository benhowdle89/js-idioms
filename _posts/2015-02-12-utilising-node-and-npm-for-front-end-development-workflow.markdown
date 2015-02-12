---
layout: post
title:  "Utilising Node.js and npm for front-end development workflow"
date:   2015-02-12 18:25:31
---

**Preface**: This post assumes you're fairly comfortable using the command line, or at least open to new things.

Node.js is a strange one. With so many applicable uses, it can often be misconstrued and pigeon-holed. What I hope to show you in this post, is how we can utilise Node.js in our front-end projects and *not* label them as "Node.js projects".

Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. What does this mean in layman's terms? Well, it means that we can write JavaScript-esque (I have to say "esque" because there's a few pieces of syntax which you'd never see in the browser-ran JavaScript code you're probably used to) code that runs in a server environment, ie. it can do all the stuff you can do with PHP, Ruby, Python, etc...

_However..._

As it can run on a server, it can also run on our development machines, just like the rest of the languages mentioned above. Again, what does this mean for us? Well, we can create &amp; use tools that run on Node.js to aid our front-end workflow. Ace.

### Screencast

I thought these concepts would be better visualised by a screencast, but don't worry, if you're not a fan of screencasts, the same content continues below the video embed.

<iframe src="//player.vimeo.com/video/119454456" width="900" height="505.8" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="http://vimeo.com/119454456">Front-end development workflow with Node.js and npm</a> from <a href="http://vimeo.com/user37350058">Ben Howdle</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

### Node.js & npm

npm is Node.js's package manager. Once you've downloaded Node.js from their [website](http://nodejs.org/), you'll automatically be able to use npm. Don't believe me? Open up your command line (On Mac, this is Terminal.app) and type `npm -v` and it should tell you what version of npm you're running. For a more in-depth look at what a package manager is and does, check out this [previous post]({% post_url 2014-08-01-package-management-and-dependency-management %}).

So now we're all installed, what do we want to achieve? Well, we want to have a project, containing a few HTML, CSS &amp; JavaScript files and use Node.js to run some development tools &amp; tasks. These tools are most likely ones you've already heard of (and potentially use), ie. Sass, Uglify, Autoprefixer, Browserify, etc...the list goes on. 

If you've not already got a project on-the-go (by the way, you can 100% retrofit this workflow to an existing project), create a folder anywhere on your system, ie. `portfolio` (you can do this in Finder, or with `mkdir portfolio`).

Jump into that folder with `cd portfolio`.

Next up, we're going to generate a file in our project that's read by Node.js (npm) when we tell it to run. If you type `npm init` in the root of your project, we can begin generating the file. The prompt will present you with a series of questions, most of which are pre-filled with an educated guess at what the answer might be, so feel free to just keep hitting the `Enter` key. It will finish off by asking if you're happy with what it's going to generate, just type `yes`.

You'll now notice a `package.json` file has been created in your project and contains metadata about your project.

Lets create some dummy files and data to work with. Lets create an `index.html` file which contains this content:

{% highlight html %}
<html>
	<head>
		<link rel="stylesheet" href="/css/app.css">
	</head>
	<body>
		
	</body>
</html>
{% endhighlight %}

Now create two folders: `sass` &amp; `css`. Leave the `css` folder empty, but place an `app.scss` file into the `sass` folder with this content:

{% highlight css %}
$colour: red;

body {
	background: $colour;
}
{% endhighlight %}

### Development workflow

Ok, so we now have our first real requirement to compile this Sass into valid CSS to run in the browser.

If you've not got Sass installed, you can do this via instructions on the Sass [website](http://sass-lang.com/install).

If you're quite familiar with Sass, and you use the command line, at this point you'd probably just use this command:

`sass --watch sass/app.scss:css/app.css`

Which is 100% valid and gets the job done. However, we're hoping to use npm as the glue which manages lots of different commands and tools running sequentially and when we need them to.

If we open up the "package.json" file up in an editor, you'll notice the `scripts` key in the config object. If you remove the existing line inside that object, take the Sass command from above and make it look like this:

{% highlight javascript %}
"scripts": {
	"watch-sass": "sass --watch sass/app.scss:css/app.css"
}
{% endhighlight %}

We've now declared our first npm command; "watch-sass". Which, if you type `npm run watch-sass` on the command line, you should see output from the Sass compiler and it telling you that it's written to `css/app.css`.

If you open up the file `css/app.css`, it should now contain:

{% highlight css %}
body {
  background: red; }
{% endhighlight %}

That's our Sass development workflow sorted. Now let's talk JavaScript.

If you're using a dependency manager, like Browserify, then this next bit is for you. If not, and you're just looking to minify your JavaScript for production, feel free to skip ahead.

Following on from the concepts we employed above with the Sass, if you create another line in the `scripts` object called "watch-js", and put this:

{% highlight javascript %}
"scripts": {
	"watch-sass": "sass --watch sass/app.scss:css/app.css",
	"watch-js": "watchify src/js/app.js -o dist/js/app.js -dv"
}
{% endhighlight %}

You can now see that when we do `npm run watch-js`, its going to kick off [Watchify](https://github.com/substack/watchify) (sister package to Browserify used for watching files with intelligent caching). Ace.

We can now create ourselves a command for our development workflow:

{% highlight javascript %}
"scripts": {
	"watch-sass": "sass --watch sass/app.scss:css/app.css",
	"watch-js": "watchify src/js/app.js -o dist/js/app.js -dv",
	"watch": "npm run watch-sass & npm run watch-js"
}
{% endhighlight %}

Excellent. You'll now see the output from both Sass &amp; Watchify and also see it writing the new files when you change the source Sass or JS files.

### Production workflow

To minify our JavaScript for production gains, we can use the excellent Uglify package from npm, via the command line: `npm install uglify-js -g` (you may need to prefix this command with `sudo` if it complains about folder permissions). This will make the package available on the command line, system-wide, so it's project-agnostic.

If you create another line in our `scripts` object like so:

{% highlight javascript %}
"scripts": {
	"watch-sass": "sass --watch sass/app.scss:css/app.css",
	"watch-js": "watchify src/js/main.js -o dist/js/app.js -dv",
	"watch": "npm run watch-sass & npm run watch-js",
	"build-js": "browserify src/js/main.js | uglifyjs -mc > dist/js/app.js"
}
{% endhighlight %}

When we run `npm run build-js` it'll run both Browserify & Uglify sequentially to output a lean JavaScript file ready for deploying to production servers.

If we now create a build CSS command, we're almost done with our production workflow:

{% highlight javascript %}
"scripts": {
	"watch-sass": "sass --watch sass/app.scss:css/app.css",
	"watch-js": "watchify src/js/main.js -o dist/js/app.js -dv",
	"watch": "npm run watch-sass & npm run watch-js",
	"build-js": "browserify src/js/main.js | uglifyjs -mc > dist/js/app.js",
	"build-sass": "sass sass/app.scss:css/app.css --style compressed"
}
{% endhighlight %}

And then tying it all together with one command:

{% highlight javascript %}
"scripts": {
	"watch-sass": "sass --watch sass/app.scss:css/app.css",
	"watch-js": "watchify src/js/main.js -o dist/js/app.js -dv",
	"watch": "npm run watch-sass & npm run watch-js",
	"build-js": "browserify src/js/main.js | uglifyjs -mc > dist/js/app.js",
	"build-sass": "sass sass/app.scss:css/app.css --style compressed",
	"build": "npm run build-sass & npm run build-js"
}
{% endhighlight %}

### Closing

So now, we can type `npm run watch` when we're developing, and `npm run build` when we need to deploy our project. How lovely.

### Points (mindump of thoughts on this topic)

 * Grunt &amp; Gulp. Yes, this workflow is one that doesn't need a JavaScript task runner to function. We're just invoking the pure packages themselves and using npm to run them, which to me, feels a lot cleaner and minimal.
 * This does not, repeat **does not** make your project reliant on a Node.js production server. We're using Node.js for development workflow only, and readying our files for deployment, ie. the tasks only ever output HTML, CSS &amp; JavaScript.