---
date: 02 Feb 2022
title: How to Hide API Keys on Netlify
description: Insert description here
tags:
- Netlify
- Javascript
layout: '@layouts/ArticleLayout.astro'
---

I was learning about javascript’s fetch API recently and made a [small project](/projects/fun-with-fetch) to practice what I’d learned. It fetched data from [The One API](https://the-one-api.dev/) (a fun API that provides data from “The Lord of the Rings” books, characters etc…). Authentication uses a private key.

I was happily working on the project, having made a couple of commits to a public GitHub repo when I received an email from GitGuardian.

![GitGuardian Email](https://kimba-imagecdn.imgix.net/elwoodp-dev/gitguardian-email.png)

A few things occurred to me after reading the email:

1. I was an idiot to publish a private key to a public repo.
2. It’s cool that GitGuardian warns you when you’ve been an idiot and exposed a private key.
3. Even if I hadn’t published the project to a public repo, I would have still exposed the key through the  frontend javascript.

## The Solution

So it’s clear that the API key needs to be hidden from both the repo and the frontend javascript. The solution is to get a backend to fetch the data using the key which we keep hidden. Luckily we don’t have to setup a complicated backend to achieve this and we can use [Netlify’s Serverless Functions](https://www.netlify.com/products/functions/).

The solution below assumes that a project has been setup on Netlify and [Netlify CLI](https://www.netlify.com/products/cli/#install) is installed locally.

### Setting up Environmental Variables

The API key can be saved as an environmental variable using Netlify’s UI. Go to **Site settings** \> **Build & deploy** \> **Environment** and add a new variable.

![GitGuardian Email](https://kimba-imagecdn.imgix.net/elwoodp-dev/netlify-env-setup.png)

### Creating a Serverless Function

Usefully, Netlify provides a template for this exact purpose. It can be installed along with its dependencies, using Netlify CLI with the command below and choosing “**token hider**” when prompted.

```bash
netlify functions:create
```

The template can now be adapted for your needs. Below is my customisation which includes passing a parameter to the function using a query string.

```js
const process = require('process');
const axios = require('axios');
const qs = require('qs');

const handler = async function (event) {
  const characterNumber = qs.stringify(event.queryStringParameters)
  const { API_TOKEN } = process.env;
  const URL = `https://the-one-api.dev/v2/character?offset=${characterNumber}`;

  try {
    const { data } = await axios.get(URL, {
      headers: {
        Authorization: API_TOKEN,
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    const { data, headers, status, statusText } = error.response;
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ status, statusText, headers, data }),
    };
  }
};

module.exports = { handler };

```

### Using the Serverless Function

Now simply make an HTTP request to the serverless function to  get the data. Here is an example I used in my project using Fetch.

```js
async function getRandomCharacter(error) {
  const characterNumber = Math.floor(Math.random() * 932);
  try {
    const response = await fetch(`/.netlify/functions/token-hider?${characterNumber}`);
    if (response.ok) {
      const newCharacterArray = await response.json();
	  // Do something with data here
    } else {
      renderFetchError(`${response.status}: ${response.statusText}`);
    }
  }
  catch (error) {
    console.log(error);
  }
}
```