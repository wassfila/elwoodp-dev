---
date: 15 Dec 2022
title: Vote for Your Favourite CSS Nesting Syntax
description: How to avoid bad programming advice using my experience with React Keys as an example.
tags:
- CSS
layout: '@layouts/ArticleLayout.astro'
---

Recently, CSS is brimming with [new and exciting features](https://www.smashingmagazine.com/2022/03/new-css-features-2022/). Nesting is a feature that many have requested for years, and now it seems finally to be on the horizon. The CSS Working Group already had open discussions about the possible future Syntax earlier in 2022 and now, with much learnt, 3 new options are on the table.

![](https://kimba-imagecdn.imgix.net/elwoodp-dev/css-nesting-syntax3.png)

Jen Simmons of Webkit and member of CSS Working Group has published a breakdown of the options and a poll. This is a great opportunity to join the discussion and [have your say](https://webkit.org/blog/13607/help-choose-from-options-for-css-nesting-syntax/). 

It’s an interesting topic, most of us are used to using Sass nesting, but unfortunately, it isn’t possible to have the same syntax due to the nature of realtime browser parsing of CSS. Option 3 is the most similar, but has to implement a hacky workaround using `:is()` for parent selectors. The other two options are less popular, but could it be this is because they are just less familiar to us?

Join the discussion on Mastodon where Jen has a post [asking for feedback](https://front-end.social/@jensimmons/109519943983773398).