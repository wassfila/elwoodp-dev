---
layout: ../../layouts/ArticleLayout.astro
title: Tidying Tailwind
description: I like many things about Tailwind, and the utility-first CSS approach but one of the obvious criticisms is how unwieldy it looks in your HTML.
date: 02 Jan 2022
tags:
  - css
---

I like many things about Tailwind, and the utility-first CSS approach but one of the obvious criticisms is how unwieldy it looks in your HTML. The mental overhead of processing something like this can be a lot of work:

```html
<div class="flex items-center justify-between mx-2 font-medium text-white relative bg-black border border-indigo">
```

There are some existing solutions out there. Tailwind itself has a [Prettier plugin](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier) for sorting classes according to the order it writes them in the final CSS. There is also [Headwind](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier), a plugin for VSCode that also automatically sorts classes.

It's a start, but these plugins both still produce one long list of classes. I’m not a fan of the ordering chosen by the plugins either. Tailwind’s own ordering in particular makes no logical sense to me. My solution to add readability is to also add groupings to the classes.

So the the first job is to define a logical order for ordering css properties by group. Here’s my preference:

- Container class
- Position & z-index
- Display effecting self (e.g grid-column-start)
- Display effecting children (e.g display: grid)
- Box Model & Size (margins, padding, border, width & height)
- Decoration (background, border-color, box-shadow, border-radius, shadows etc…)
- Typography
- Anything else (e.g. cursor: pointer)

Now to group the properties I use a divider character (browsers just ignore these superfluous characters). I’ve experimented using a pipe and forward slash but settled on square brackets inspired by the formatting used by [Cube CSS](https://cube.fyi/). So the example above becomes:

```html
<div class="[ relative ][ flex items-center justify-between ][ mx-2 border-2 ][ border-indigo bg-black ][ font-medium text-white ]">
```

Media queries and pseudo classes just slot in where they belong in the order defined above.

```html
<div class="[ relative ][ flex items-center justify-between ][ mx-2 md:mx-3 lg:mx-4 border-2 ][ border-indigo bg-black hover:bg-indigo ][ font-medium text-white ]">
```

No doubt this still won’t please the many Tailwind haters out there but I find it a distinct improvement and much more pleasant to work with.