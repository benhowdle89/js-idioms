---
layout: post
title:  "Conversational sign-up form UI with React and Redux"
date:   2015-09-08 16:25:31
---

With conversational UIs becoming more widely used on the web, I thought it might be interesting to emulate [Ashley Baxter's](https://twitter.com/iamashley) new insurance product's [quoting](https://withjack.co.uk/quote) experience and build it using React and Redux.

<img style='margin: 24px 0;' src="/img/Conversational.png" alt="">

### Demo

To give us an idea of what we're building, check out the [working demo](http://benhowdle.im/React-Redux-Conversational/)

Or if you just want to go through the full source code for this tutorial, please check out the [GitHub repo](https://github.com/benhowdle89/React-Redux-Conversational) for the demo.

### Knowledge Prerequisites

I'm not going to go into much, if any, detail on what React or Redux are, but will assume you have a basic knowledge of both.

I'm going to avoid going over any styling, and I've removed any CSS classes from the code snippets to keep them as concise as possible. I'm also avoiding going line-by-line, explaining what each line of code does, but more give you a high-level overview of how to architect this kind of UI.

The full source code is on GitHub, so I would recommend delving into it on there!

### Data

We want to eventually send off the values that the user enters to the server, but we don't necessarily have to store this data in a serialised fashion. We can store it in a way that's easiest to filter, manipulate and parse.

Something like this:

{% highlight javascript %}
{
    saving: false,
    answered: 0,
    fields: [{
        question: 'Hey, what is your name?',
        field: 'NAME',
        prefix: 'My name is',
        response: ''
    }, {
        question: 'And what might your job be?',
        field: 'JOB',
        prefix: 'My job is',
        response: ''
    }, {
        question: 'What\'s your email address?',
        field: 'EMAIL',
        prefix: 'My email is',
        response: '',
    }]
}
{% endhighlight %}

ie. have they saved the form yet, how many fields have they completed and the fields themselves.

### Skeleton Reducer

This data structure becomes the initial data structure for our `Conversation` reducer:

{% highlight javascript %}
const initialState = {
    saving: false,
    answered: 0,
    fields: [{
        question: 'Hey, what is your name?',
        field: 'NAME',
        prefix: 'My name is',
        response: ''
    }, {
        question: 'And what might your job be?',
        field: 'JOB',
        prefix: 'My job is',
        response: ''
    }, {
        question: 'What\'s your email address?',
        field: 'EMAIL',
        prefix: 'My email is',
        response: '',
    }]
}

export default function conversationState(state = initialState, action) {
    switch (action.type) {
        default:
            return state
    }
}
{% endhighlight %}

We then create our boilerplate Redux reducer like so.

### Actions

We have our data, now we need some actions to manipulate it. For that, we need to think about what we want to do to it. We're going to want to save the user's input, progress the user's journey through the conversation, to maybe let them start over and then finally to let the user save their progress/complete the conversation.

{% highlight javascript %}
export const EDIT_FIELD = 'EDIT_FIELD'
export const NEXT_FIELD = 'NEXT_FIELD'
export const CLEAR_ALL = 'CLEAR_ALL'
export const SAVING = 'SAVING'
{% endhighlight %}

Now we have our action types, we can define the simpler ones in an action file:

{% highlight javascript %}
export function editField(field, response) {
    return {
        type: types.EDIT_FIELD,
        field,
        response
    }
}

export function nextField() {
    return {
        type: types.NEXT_FIELD
    }
}

export function saving() {
    return {
        type: types.SAVING
    }
}

export function startOver() {
    return {
        type: types.CLEAR_ALL
    }
}
{% endhighlight %}

The last action is sending the fields off to a remote server, and for this we need [Thunk middleware for Redux](https://github.com/gaearon/redux-thunk). From the readme:

> Redux Thunk middleware allows you to write action creators that return a function instead of an action

This is perfect for us, because we can now implement an asynchronous AJAX request in our action method, to send the values to a server. Which looks something like this:

{% highlight javascript %}
export function saveResponses() {
    return (dispatch, getState) => {
        const fields = getState().conversationState.fields.reduce((accum, current) => {
                return {
                    ...accum,
                    [current.field]: current.response
                }
            }, {})
        dispatch(saving())
        return fetch('/fields/', {
            body: {
                fields
            }
        })
    }
}
{% endhighlight %}

### Serializing

Because we've used `reduce` on the `fields` structure above, we can now send a very concise, trimmed-down version of our Conversation Reducer data to the server, which will be send like so:

{% highlight javascript %}
{
  "NAME": "Ben",
  "JOB": "Developer",
  "EMAIL": "hello@benhowdle.im"
}
{% endhighlight %}

### Reducer

We now can go back in fill in our boilerplate Reducer function:

{% highlight javascript %}
const updateFields = (fields, action) => {
    return fields.map(response => {
        if (response.field !== action.field) {
            return response
        }
        return {
            ...response,
            response: action.response
        }
    })
}

export default function conversationState(state = initialState, action) {
    switch (action.type) {
        case NEXT_FIELD:
            return {
                ...state,
                answered: (state.fields.length == state.answered) ? state.answered : ++state.answered
            }
        case EDIT_FIELD:
            return {
                ...state,
                fields: [
                    ...updateFields(state.fields, action)
                ]
            }
        case SAVING:
            return {
                ...state,
                saving: true
            }
        case CLEAR_ALL:
            return {
                ...initialState,
                answered: 0,
                saving: false
            }
        default:
            return state
    }
}
{% endhighlight %}

### Wiring up Redux to the React Component

Now we have our Reducers and Actions in place, we can look at wiring them up to the React Component.

In our main component's Render method, we can output the fields:

{% highlight javascript %}

getFields = (fieldsToShow) => {
    return this.props.conversationState.fields
        .slice(0, fieldsToShow)
}

// inside Render method

let { answered, fields, saving } = this.props.conversationState,
    fieldsToShow = answered + 1

this.getFields(fieldsToShow)
    .map((field, index) => {
        return <Field
            key={field.question}
            field={field}
            editField={this.props.conversationActions.editField}
            nextField={() => {
                if(answered == fields.length){
                    return this.props.conversationActions.saveResponses()
                }
                return this.props.conversationActions.nextField()
            }}
            last={index == fieldsToShow - 1}
        />
    })
{% endhighlight %}

Inside our Field Component, we can deal with the event listeners and output of the conversation UI specifics:

{% highlight javascript %}
const Field = ({ field, editField, nextField, last }) => {
    return <div>
        <div>
            <span>😀</span>
            <p>{field.question}</p>
        </div>
        <div>
            <span>{field.prefix}</span>
            <input value={field.response} onChange={event => editField(field.field, event.target.value)} autoFocus={last} onKeyUp={event => {
                    if(event.which == 13 && event.target.value){
                        nextField()
                    }
                }} />
        </div>
    </div>
}
{% endhighlight %}

### Fin

If anyone's got any comments, or queries, please leave a comment below and I'll endeavour to resolve it as soon as I can. Hope you enjoyed reading!
