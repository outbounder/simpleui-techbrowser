// taken from http://levycarneiro.com/projects/tag-it/example.html
// author: Levy Carneiro Jr (http://levycarneiro.com)
// modifications: outbounder

(function($) {

	$.fn.tagit = function(options) {

		var el = this;

		const BACKSPACE		= 8;
		const ENTER			= 13;
		const SPACE			= 32;
		const COMMA			= 44;

		// add the tagit CSS class.
		el.addClass("tagit");

		// create the input field.
		var html_input_field = "<li class=\"tagit-new\"><input class=\"tagit-input\" type=\"text\" autocomplete='off'/></li>\n";
		el.html (html_input_field);

		var tag_input = el.children(".tagit-new").children(".tagit-input");

		$(this).click(function(e){
			if (e.target.tagName == 'A') {
				// Removes a tag when the little 'x' is clicked.
				// Event is binded to the UL, otherwise a new tag (LI > A) wouldn't have this event attached to it.
				$(e.target).parent().remove();
			}
			else {
				// Sets the focus() to the input field, if the user clicks anywhere inside the UL.
				// This is needed because the input field needs to be of a small size.
				tag_input.focus();
			}
		});
		
		tag_input.keyup(function(event){
			if (event.which == BACKSPACE) {
				if (tag_input.val() == "") {
					// When backspace is pressed, the last tag is deleted.
					$(el).children(".tagit-choice:last").remove();
					el.trigger("onchanged");
				}
			}
			// Comma/Space/Enter are all valid delimiters for new tags.
			else if (event.which == COMMA || event.which == SPACE || event.which == ENTER) {
				event.preventDefault();

				var typed = tag_input.val();
				typed = typed.replace(/,+$/,"");
				typed = typed.trim();

				if (typed != "") {
					if (is_new (typed)) {
						create_choice (typed);
						
						// Cleaning the input.
						tag_input.val("");
						
						el.trigger("onchanged");
						tag_input.autocomplete("close");
					}
				}
			}
		});
		
		tag_input.autocomplete({
			source: function(request,response) {
				var url = options.source+"?"+options.param+"="+request.term+"&callback=?";
				$.getJSON(url, function(data) {
					response(data);
				});
			},
			focus: function(event,ui) {
				tag_input.val(ui.item.value);
			},
			select: function(event,ui){
				if (is_new (ui.item.value)) {
					create_choice (ui.item.value);
				}
				
				// Cleaning the input.
				tag_input.val("");
				el.trigger("onchanged");

				// Preventing the tag input to be update with the chosen value.
				return false;
			}
		});

		function is_new (value){
			var is_new = true;
			tag_input.parents("ul").children(".tagit-choice").each(function(i){
				n = $(this).children("input").val();
				if (value == n) {
					is_new = false;
				}
			})
			return is_new;
		}
		
		function create_choice (value){
			var el = "";
			el  = "<li class=\"tagit-choice\">\n";
			el += "<div class=\"tagit-choice-value\">"+value + "</div>\n";
			el += "<a class=\"close\">x</a>\n";
			// el += "<input type=\"hidden\" style=\"display:none;\" value=\""+value+"\" name=\"item[tags][]\">\n"; (>(
			el += "</li>\n";
			var li_search_tags = tag_input.parent();
			$(el).insertBefore (li_search_tags);
			tag_input.val("");
		}
		
		function clear() {
			tag_input.empty();
			tag_input.parents("ul").children(".tagit-choice").remove();
		}
		
		function getValue() {
			var value = "";
			var choices = tag_input.parents("ul").children(".tagit-choice");
			choices.each(function(i){
				value += " "+$(choices[i]).children(".tagit-choice-value").text();
			})
			value += tag_input.val();
			return value.trim();
		}
		
		function setValue(value) {
			clear();
			var parts = value.split(" "); // comma too?
			for(var p in parts)
				create_choice(parts[p]);
		}
		
		// give it outside (== exports/commonjs)
		el.get(0).getValue = getValue;
		el.get(0).setValue = setValue;
		el.get(0).clear = clear;
	};

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");
	};

})(jQuery);
