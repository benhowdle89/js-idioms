---
layout: post
title:  "The JavaScript Learning Ladder"
date:   2015-01-28 18:25:31
---

Learning JavaScript is kind of a mess.

Love it, but y'know...mess.

Arguably the most accessible language to use, it also has the lowest barrier to entry (_maybe_ bar PHP). It sometimes helps to see a birds-eye view of the linear progression involved in learning front-end JavaScript development. That's what I hope to provide in this post.

Below is a ladder structure formed from multiple sources; my own experience, talking with other developers, observing Stack Overflow, seeing questions asked on Twitter, running JavaScript workshops, etc...

Interpret the intention of the list however you wish. I softly advocate you follow it, I think it's a good, thorough, natural progression of steps to follow, however, and most importantly; I think you should identify yourself on this list, look what you've achieved and then look what's coming next, if only to gain some perspective.

Without further ado, the list:

<hr class="fancy">

### Copypaste everything

Everyone who's used a computer* can copypaste. Sites like [Dynamic Drive](http://www.dynamicdrive.com/) were made for this stage. Absolute minimal thought needed, just a goal. The code almost looks foreign to you, but you're more interested in the result, and less about the implementation.

_* not actually proven_

<a href="https://twitter.com/intent/tweet?text=I'm at the 'copypaste' stage of my JavaScript learning and proud&url={{site.url}}{{page.url}}">**Share your position on the ladder**</a>

<hr class="fancy">

### Copypaste hack hack

You're still copypasting, and you're still seeing the immediate gratification of the code, but your developer curiosity kicks in and you start to change a few values in this algebraic expression. Things change. Things break. Some things work. The code is starting to feel less alien to you and you're not only tied to other people's code, but you're Googling and peeking at Stack Overflow and seeing how you might create your own scenarios and results by bending this piece of code to your will.

<a href="https://twitter.com/intent/tweet?text=I'm at the 'copypaste hack hack' stage of my JavaScript learning and proud&url={{site.url}}{{page.url}}">**Share your position on the ladder**</a>

<hr class="fancy">

### jQuery ft. jQuery plugins

jQuery. The best and worst gift a JavaScript developer can receive. A lot of developers actually stop at this stage. Most HTML &amp; CSS sites can be enhanced a whole bunch by sprinkling some well placed jQuery on top. Galleries, sliders, animation, scrolly stuff. All made infinitely easier by just doing `$('.myButtons').magic();`. This is a very comforting stage to be at. With the popularity of jQuery and it's plugin ecosystem, you can _get by_ by learning how to Google "thing I want to achieve" and appending "jquery" to your search.

<a href="https://twitter.com/intent/tweet?text=I'm at the 'jQuery plugins' stage of my JavaScript learning and proud&url={{site.url}}{{page.url}}">**Share your position on the ladder**</a>

<hr class="fancy">

### Hi, I <3 $(document).ready()

Click handlers, `.animate()` calls, maybe even form validation. All these terms are becoming second nature to you. You're confident performing most tasks thrown at you, but your code is very unstructured and all shoved in one `$(document).ready()` call.

Maybe even two calls*

_* I have done this._

You're very used to scrolling down a very long `script.js` file in search of that one form submit handler you added...somewhere...sometimes...oh who knows...

<a href="https://twitter.com/intent/tweet?text=I'm at the 'jQuery document.ready()' stage of my JavaScript learning and proud&url={{site.url}}{{page.url}}">**Share your position on the ladder**</a>

<hr class="fancy">

### Making your own jQuery plugins

Again, this stage is only made possible by jQuery and it's flexible nature and extensibility. And I would also say that this stage is the first stage where you're taking a little more control over your code and how it functions. However, you are still in #plugin4lyfe mode and wrapping (fairly) messy code in `$('#stuff').lookIDidAPlugin();` calls.

<a href="https://twitter.com/intent/tweet?text=I'm at the 'making my own jQuery plugins' stage of my JavaScript learning and proud&url={{site.url}}{{page.url}}">**Share your position on the ladder**</a>

<hr class="fancy">

### Object literals...literally.

This is your first **real** delve into JavaScript data structures. You're now starting to step away from the "whole bunch of spaghetti jQuery shoved in a doc ready call" mentality. You're now more interested in separating your code into logical components. Maybe you're creating `validate` objects with a few methods and maybe even some state! DRY is etched into your mind when you close your eyes and you're starting to create abstractions in your code and refactor more intelligently. The idea of using a jQuery plugin makes you feel a little queasy.

<a href="https://twitter.com/intent/tweet?text=I'm at the 'organising code with Object Literals' stage of my JavaScript learning and proud&url={{site.url}}{{page.url}}">**Share your position on the ladder**</a>

<hr class="fancy">

### OOP

Code organisation, again, being top of your list to nail. You're also thinking more about state, how different events and interactions from the user and your code may be affecting other parts of your code. This is where you're biggest challenge is managing the relationship and intercommunication between the different components &amp; modules of your code. Terms you're familiar with: asynchronous operations, callbacks, modules, splitting code into different files, race conditions, Promises, event delegation, etc...

<a href="https://twitter.com/intent/tweet?text=I'm at the 'OOP' stage of my JavaScript learning and proud&url={{site.url}}{{page.url}}">**Share your position on the ladder**</a>

<hr class="fancy">

### MV*

The last step in your journey. If you've got this far, and you've gone through every stage thus far, in my opinion this is the peak. This is not to say that MV* is the best approach to JavaScript development, but that if you're thinking in terms of models, views, routers, controllers, etc, you're needs are only going to be solved by approaches on the same level as MV-whatever. I feel like once you reach this step in your natural progression, you're well versed (and opinionated) enough to make well informed decisions about approach and architecture. I'm not advocating MV* is the most complex and advanced approach you can achieve in JavaScript, but to me, it represents a way of thinking that is very far away from jQuery-plugin-storing-state-in-data-*-attributes and more in-line with how a programmer would tackle traditional architectural and organisational challenges. Terms you now breathe: functional programming, reactive programming, functional reactive programming, data-binding, isomorphic, etc...Your applications will now have an "entry point" (for something like CommonJS), and not just a `script.js` file with a `$(document).ready()` inside.

<a href="https://twitter.com/intent/tweet?text=I'm at the 'MV-whatever' stage of my JavaScript learning and proud&url={{site.url}}{{page.url}}">**Share your position on the ladder**</a>

<hr class="fancy">

### Notes

This is very much a subjective interpretation of the linear progression a person goes through when learning front-end JavaScript development. And as the saying goes:

> "If you're incompetent, you can't know you're incompetent. […] the skills you need to produce a right answer are exactly the skills you need to recognize what a right answer is." - David Dunning.

The more you climb up this ladder, the more you realise how much more there is to learn, different approaches to consider, more risk. However, you will only climb this ladder if you have a genuine need to.

Anyway, I hope this has helped somewhat and provided a small amount of insight into where you might feature on the ladder and what lies ahead...