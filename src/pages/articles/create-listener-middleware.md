---
date: 21 Dec 2022
title: Using Local Storage with Redux Toolkit
description: Using local storage with redux toolkit – createListenerMiddleware
tags:
- React
layout: '@layouts/ArticleLayout.astro'
---

I’ve recently been working on an [eCommerce frontend](/link-to-rowanreact) using React. Naturally I want the cart state to persist between page refreshes and I know using local storage is a good way to do this. I’ve successfully stored state in local storage before in previous projects but not with Redux which turns out to present an interesting challenge.

## Starting Code

Here we have a simple cart setup using Redux Toolkit with reducers to add items, update item quantities, and remove items:

```js
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cart-slice';

const store = configureStore({
  reducer: { cart: cartSlice.reducer }
});

export default store;
```

```js
// store/cart-slice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		items: [],
	},
	reducers: {
		addItem: (state, action) => {
			// Logic to add a new item
			return { items: updatedCartItems };
		},
		udateItemQty: (state, action) => {
			// Logic to update an Item's quantity
			return { items: updatedCartItems };
		},
		removeItem: (state, action) => {
			// Logic to remove an Item
			return { items: updatedCartItems };
		},
	},
});

export const { addItem, updateItemQty, removeItem } = cartSlice.actions;
export default cartSlice;
```

## First Try
My instinctive reaction was to simply write the items array to local storage inside the reducer before returning and of course load the initialState from local storage if it existed – Easy!

```js
// store/cart-slice.js
// Warning - This is bad practice!
import { createSlice } from '@reduxjs/toolkit';
const LOCAL_STORAGE_KEY = 'rowanReact.cartItems';

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		items: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? [],
	},
	reducers: {
		addItem: (state, action) => {
			// Logic to add a new item
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCartItems));
			return { items: updatedCartItems };
		},
		// Etc...
	},
});
```

Great that worked, job done 💪. But wait, I think I remember something about Redux reducers should be pure functions and side-effect free. Oh no, my OCD won’t let this go we had better check this out.

## Reducers Must Not Have Side Effects
From the [Redux docs](https://redux.js.org/style-guide/#reducers-must-not-have-side-effects):
<aside class="aside--error">
	Reducer functions should only depend on their state and action arguments, and should only calculate and return a new state value based on those arguments. They must not execute any kind of asynchronous logic (AJAX calls, timeouts, promises), generate random values (Date.now(), Math.random()), modify variables outside the reducer, or run other code that affects things outside the scope of the reducer function.
</aside>

Also from the [Redux Docs](https://redux.js.org/understanding/history-and-design/prior-art#flux) to add some context:
<aside class="aside--info">
	While it is technically possible to write impure reducers that mutate the data for performance corner cases, we actively discourage you from doing this. Development features like time travel, record/replay, or hot reloading will break. Moreover it doesn't seem like immutability poses performance problems in most real apps, because, as Om demonstrates, even if you lose out on object allocation, you still win by avoiding expensive re-renders and re-calculations, as you know exactly what changed thanks to reducer purity.
</aside>

OK, well that seems pretty categorical. In this case the code does in fact work but I’d rather stick with best practices and learn how to do this properly which will serve us better in the future.

## Let’s Have Another Go
A little more research through up a number of potential solutions including and but the most promising and simple seemed to be a new Toolkit feature [createListenerMiddleware](https://redux-toolkit.js.org/api/createListenerMiddleware).
<aside class="aside--info">
	A Redux middleware that lets you define "listener" entries that contain an "effect" callback with additional logic, and a way to specify when that callback should run based on dispatched actions or state changes.
</aside>

Sounds perfect for our use case, looks simple to use and nothing to install. Lets give it a go!


```js
// store/index.js

import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import cartSlice, { addItem, updateItemQty, removeItem, LOCAL_STORAGE_KEY } from './cart-slice';

const localStorageMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  matcher: isAnyOf(addItem, updateItemQty, removeItem),
  effect: (action, listenerApi) => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listenerApi.getState().cart.items)),
});

const store = configureStore({
  reducer: { cart: cartSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(localStorageMiddleware.middleware),
});

export default store;
```
