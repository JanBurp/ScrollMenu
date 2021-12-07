# A simple scrollable menu in plain JavaScript

On touchscreens drag the menu. With mouse devices, the menu scrolls according to mouse position.

# Demo

https://janburp.github.io/ScrollMenu/

# Quick Start

ScrollMenu needs a container `div` and a normal `ul` markup:

```html
<div class="nav">
  <ul>
    <li><a href="item_1/">Homepage</a></li>
    <li><a href="item_2/">News</a></li>
    <li><a href="item_3/">Blog</a></li>
    <li class="current-menu-item"><a href="item_4/">Info</a></li>
    <li><a href="item_5/">Help</a></li>
    <li><a href="item_6/">About Us</a></li>
    <li><a href="item_7/">Contact</a></li>
    <li><a href="item_8/">Preferences</a></li>
    <li><a href="item_8/">Login</a></li>
  </ul>
</div>
```

Start ScrollMenu with this line of JavaScript:

```javascript
new ScrollMenu( document.querySelector('.nav') );
```

# Options

It is possible to give ScrollMenu some options. In this call you can see all options with there defaults:

```javascript
new ScrollMenu( document.querySelector('.nav'), {
  speed         : 10,                                       // Speedfactor of scrolling
  wait          : 3000,                                     // Time to wait (milliseconds) before scrolling back to current item
  currentClass  : 'current-menu-item',                      // Class that determines which item is the current selected menu item
  activeClass   : 'active-menu-item',                       // Class for the item that is the current item in focus
} );
```

# Changelog


- v1.3.0 - options added
- v1.2.0 - first commit for github

