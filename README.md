# PostCSS Split CSS

Split the specified css rules into another file.

## Installation

```
npm install postcss-split-css --save-dev
```

## Usage

```js
splitCss = require("postcss-split-css");

postcss([
  splitCss({
    filter: [".lte_ie9", ".ie9", ".ie8"],
    output: {
      from: __dirname + "/src",
      dist: __dirname + "/dist",
      subfix: ".ie",
      append: "#__generated__{content:'" + new Date().toISOString() + "'}"
    }
  })
]);
```

Before:

```CSS
/* style.css */
body{
	color: #000;
}
.lte_ie9 div{
	color: #f0f
}
.ie8 div{
	color: #f00
}
div {
    color: #ff0;
}
```

After:

```CSS
/* style.css */
body{
	color: #000;
}
div {
    color: #ff0;
}
```

```CSS
/* style.ie.css */
.lte_ie9 div{
	color: #f0f
}
.ie8 div{
	color: #f00
}
```

Inspired by PostCSS Filter Rules
