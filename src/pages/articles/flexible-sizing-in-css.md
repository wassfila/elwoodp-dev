---
date: 15 Jan 2022
title: CSS fluid properties using Sass
description: Within that broad spectrum the wavelengths visible to humans occupy a very narrow band.
tags:
- CSS
layout: '@layouts/ArticleLayout.astro'
---

Responsive web design has for a long time heavily relied on using breakpoints, specifically chosen points at which we decide our design should adjusts to better suit the available space. A [frequently used method ](https://getbootstrap.com/docs/5.0/layout/breakpoints/) is to choose commonly used device widths as a basis for choosing  breakpoints in a design. This method presents problems though:

1. These breakpoints are increasingly arbitrary in a world with ever more devices of different specs.
2. It’s time consuming to design and implement all these fiddly changes at multiple breakpoints.

## Fluid type size and spacing

The alternative is a fluid approach. Instead of defining multiple values, we can choose just two: a minimum value for a small screen and a maximum value for a large screen. Then get the browser to interpolate between the two of all other screen sizes.

A method of doing this with CSS has been around for a while, using viewport units and media queries. The following example sets up fluid text sizing which ranges from 16px to 32px from screen widths of 420px to 768px.

``` css
.fluid-text {
  font-size: 16px;
}

@media screen and (min-width: 420px) {
  .fluid-text {
    font-size: calc(16px + (32 - 16) * ((100vw - 420px) / (768 - 420)));
  }
}

@media screen and (min-width: 768px) {
  .fluid-text {
    font-size: 32px;
  }
}
```

Yikes 😬, whilst it works beautifully the code isn’t pretty. Imagine this lot littering your CSS every time you need to set a font size. 

When [clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) was introduced to CSS things got a little simpler, making it possible to define minimum and maximum boundaries without using media queries.

```css
.fluid-text {
  --target-font-size: calc(16px + (32 - 16) * ((100vw - 420px) / (768 - 420)));
  font-size: clamp(16px, var(--target-font-size), 32px);
}
```

Better, but still verbose and complicated to customise. Let use Sass to make things a bit simpler.

## Fluid properties Sass mixin

```scss
@use './variables' as *;
@use './functions' as *;

@mixin fluid-property($property, $min-size, $max-size) {
  $unit: unit($min-size);
  $min-vw: $min-vw;
  $max-vw: $max-vw;

  @if $unit == rem  {
    $min-vw: toRem($min-vw);
    $max-vw: toRem($max-vw);
  }
  
  $target-size: calc($min-size + (strip-unit($max-size) - strip-unit($min-size)) * ((100vw - $min-vw) / (strip-unit($max-vw) - strip-unit($min-vw))));
  #{$property}: clamp($min-size, $target-size, $max-size);
}
```

```scss
// variables.scss

$min-vw: 400px;
$max-vw: 1400px;
```

```scss
// functions.scss

@use 'sass:math';

@function strip-unit($number) {
  @if type-of($number) == 'number' and not unitless($number) {
    @return math.div($number, ($number * 0 + 1));
  }
  @return $number;
}

@function toRem($value) {
  $remValue: (math.div(strip-unit($value), 16)) * 1rem;
  @return $remValue;
}
```

With this mixin it’s possible to easily setup a fluid property in one line.

```scss
// Basic usage

p {
	@include fluid-property(font-size, 16px, 32px);
}
```

With the help of [Sass interpolation](https://sass-lang.com/documentation/interpolation) it’s possible to use the mixin with any property.

```scss
// Usage with any property

p {
	@include fluid-property(margin-bottom, 16px, 32px);
}
```

And with the help of some custom Sass functions any unit can be used.

```scss
// Usage with rem units

p {
	@include fluid-property(font-size, 1rem, 2rem);
}
```

## Conclusion

There are of course other tools out there to support using fluid properties in CSS. I’m big fan of [Utopia](https://utopia.fyi) which allows you to generate a comprehensive system of fluid properties based on a predefined scale. This solution is lighter and easier to customise however. It can easily be imported into any Sass project to start using straight away on individual properties without having to define a scale and generate a whole system of utilities.

<aside class="aside--info">
	View project on <a href="#">Github</a>
</aside>

