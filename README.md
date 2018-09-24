# jquery-keywordField
Turns an input element into an element that displays entered words as keywords.
Once entered, a keyword is presented in a highlighted box with a delete button.  Keywords are entered by loss of focus, or either the `,` or `;` keys being pressed.

[![BCH compliance](https://bettercodehub.com/edge/badge/jonathantwite/jquery-keywordField?branch=master)](https://bettercodehub.com/)

# Usage
Setup:
```javascript
$('#input').keywordField();
```

Retrieve entered keywords as array:
```javascript
$('#input').keywords();
```

# Dependencies
jQuery
