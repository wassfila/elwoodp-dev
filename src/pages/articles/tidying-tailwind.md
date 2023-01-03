---
date: 02 Jan 2022
title: Tidying Tailwind
description: I like many things about Tailwind, and the utility-first CSS approach but one of the obvious criticisms is how unwieldy it looks in your HTML.
tags:
- CSS
layout: '@layouts/ArticleLayout.astro'
---

I like many things about Tailwind, and the utility-first CSS approach, but one of the obvious criticisms is how unwieldy it looks in the markup. The mental overhead of processing something like this can be a lot of work:

```html
<div class="flex items-center justify-between mx-2 font-medium text-white relative bg-black border border-indigo">
```

There are some existing solutions out there. Tailwind itself has a [Prettier plugin](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier) for sorting classes, matching the order it writes them in the final CSS. There is also [Headwind](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier), a plugin for VSCode that also automatically sort the classes.

It's a start, but these plugins both still produce one long list of classes. I’m also not a fan of the ordering chosen by the plugins. Tailwind’s own ordering in particular makes no logical sense to me. My solution to add readability is to add both ordering and grouping to the classes.

## Ordering & Grouping

The first job is to define a logical order for ordering CSS properties by group. Here’s my preference:

- Container class
- Position & z-index
- Display effecting self (e.g. grid-column-start)
- Display effecting children (e.g. display: grid)
- Box Model & Size (margins, padding, border, width & height)
- Decoration (background, border-color, box-shadow, border-radius, shadows etc…)
- Typography
- Anything else (e.g. cursor: pointer)

To group the properties I use a divider character (browsers ignore any arbitrary characters). I’m using a forward slash here, although I've also experimented using square brackets inspired by the formatting used by [Cube CSS](https://cube.fyi/). So the example above becomes:

```html
<div class="relative / flex items-center justify-between / mx-2 border-2 / border-indigo bg-black / font-medium text-white">
```

## Media Queries

Media queries and pseudo classes just slot in with their selector counterparts where they belong in the order defined above.

```html
<div class="relative / flex items-center justify-between / mx-2 md:mx-3 lg:mx-4 border-2 / border-indigo bg-black hover:bg-indigo / font-medium text-white">
```


No doubt this won’t convert you if you’ve made up your mind that you don’t like Tailwind (there are some [strong opinions](https://www.aleksandrhovhannisyan.com/blog/why-i-dont-like-tailwind-css/) out there!). But I find this way of writing a big improvement and goes a long way to alleviating one of Tailwind’s biggest problems.