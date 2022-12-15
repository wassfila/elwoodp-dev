---
date: 13 Dec 2022
title: How to Avoid Bad Advice & React Keys
description: How to avoid bad programming advice using my experience with React Keys as an example.
tags:
- React
layout: '@layouts/ArticleLayout.astro'
---

> Each child in an array should have a unique "key" prop.
> Check the render method of SomeComponent.

Everyone learning React will be familiar with this error. The success of rendering a list of items marred by a confusing error left in the console. So you Google the error, find an [overwhelmingly upvoted answer](https://stackoverflow.com/a/28329550/1954838) from Stack Overflow and use it to fix your code. Something like this:

```js
// Warning - Don't do this!

myList.map((item, index) => (
	<li key={index}>
		{item.someProperty}
	</li>
)
```

The error goes away and you celebrate 🎉. Unfortunately, this method of assigning the key the array index value, turns out to have potential [serious drawbacks](https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/). Perhaps even more importantly copying the solution hasn’t furthered our understanding of the issue - how and why does React use keys when rendering an arrays of items?

## Understanding Keys in React

From the [React Docs](https://reactjs.org/docs/lists-and-keys.html#keys): 

> Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside the array to give the elements a stable identity.

From this we can see that keys need to be **unique** and **consistent** for React to keep track of an item in the DOM. 

The example above satisfies the first requirement but not the second. If we delete an item from our list the items following it will now be given a new index on re-render. This can lead to React becoming confused and result in the wrong properties being mapped to their corresponding items.

## Good Understanding Leads to a Good Solution

Now we understand how things work we can either work out a solution for ourselves or help us identify which are the good solutions published online. In the case of React Keys the best solution is to use a Unique ID from the data itself.

```js
const myList = [
	{ someProperty: 'foo', uniqueID: 1 },
	{ someProperty: 'bar', uniqueID: 2 },
	{ someProperty: 'baz', uniqueID: 3 },
];

myList.map((item) => (
	<li key={item.unqiqueID}>
		{item.someProperty}
	</li>
)
```

In this example we can see that the keys assigned to our items are now both **unique** and **consistent**. Even if we delete item ‘bar’, item ‘baz’ will still be given the same key on re-render allowing React to keep track of it.
