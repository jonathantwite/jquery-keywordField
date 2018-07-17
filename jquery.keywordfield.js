/*
 * Version 1.0.0
 * Turns an input element into an element that displays entered words as keywords.
 * Once entered, a keyword is presented in a highlighted box with a delete button.  Keywords are entered by loss of focus, or either the , or ; keys being pressed.
 * JT - 2017-11-07
 * Usage:
 *      $('#input').keywordField();
 *      //Get entered keywords as array
 *      $('#input').keywords();
*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    /* --- Start plugin --- */
	var allKeywords = [];
	var $self;

	//Delete a keyword
	function deleteWord(element) {
	    var $input = $(element).parents('.jq-keyword-input-area').children('input');
		var index = allKeywords.indexOf($(element).parent('.jq-keyword-keyword').text());
		if (index !== -1) {
			allKeywords.splice(index, 1);
		}
		$(element).parent('.jq-keyword-keyword').remove();
		$input.parent().nextAll('.jq-keyword-input-hidden').val(formatKeywordsToString());
		$input.trigger('change');
	}

	//Add a keyword
	function addWord(word) {
		if (word === undefined || word === '') {
			return;
		}

		allKeywords.push(word);

		var $element = $('<p class="jq-keyword-keyword">' + word + '<a class="jq-keyword-delete"><i class="fa fa-times" aria-hidden="true"></i></a></p>');
		$element.children('a').click(function () {
		    deleteWord(this);
		});

		$self.before($element);
		$self.val('');

		var newWidth = $self.width() - ($element.width() + 10);
		if (newWidth >= 200) {
		    $self.width(newWidth);
		}
		else {
		    $self.width("");
		}

		$self.parent().nextAll('.jq-keyword-input-hidden').val(formatKeywordsToString());

		$self.trigger('change');
		$self.focus();
	}

	//On focus out, add word
	function addWordFromTextBox() {
		var val = $self.val();
		if (val !== undefined && val !== '') {
			addWord(val);
		}
	}

	//On key press, check for , or ;
	function checkLetter() {
		var val = $self.val()
		if (val.length > 0) {
			var letter = val.slice(-1);
			if (letter === ',' || letter === ';') {
				var word = val.slice(0, -1);
				if (word.length > 0) {
					addWord(word);
				}
			}
		}
	}

	function formatKeywordsToString() {
	    var string = "";
	    allKeywords.forEach(function (keyword, index) {
	        string += (keyword + ', ');
	    });
	    if (string.length >= 2) {
	        string = string.slice(0, -2);
	    }
	    return string;
	}


    //Exported functions

	$.fn.keywordField = function () {
	    $self = this;
        
		//build correct structure
	    this.wrap('<div class="jq-keyword-input-area"></div>');
	    this.parent().after('<p class="jq-keyword-info">Separate keywords using a comma.</p><input type="hidden" class="jq-keyword-input-hidden" id="' + this.attr('id') + '-value" name="' + this.attr('id') + '-value" />');
		var classes = this.attr("class");
		this.removeClass(classes);
		this.parent('.jq-keyword-input-area').addClass(classes);
		this.blur(addWordFromTextBox);
		this.keyup(checkLetter);
		this.parent('.jq-keyword-input-area').click(function () {
			$('#txtInput').focus();
		});

		$self.addClass('keyword-field');

		return this;
	};

	$.fn.keywords = function () {
		return allKeywords;
	}
}));