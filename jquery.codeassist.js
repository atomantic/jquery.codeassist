/**
 * jquery.codeassist adds a code assist menu to configured textarea and input boxes
 * This allows you to suggest code based on a user triggering the helper with a keycode (e.g. %, $, or [)
 * 
 * @version 1.0
 * @requires jquery 1.4.2 or >
 * @usage: 
 * @author Copyright (c) 2010 Adam Eivy (antic | atomantic)
 * @license Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($){
	    $.codeassist = function(el, opt){
	        // To avoid scope issues, use 'base' instead of 'this'
	        // to reference this class from internal events and functions.
	        var base = this;

	        // Access to jQuery and DOM versions of element
	        base.$el = $(el);
	        base.el = el;

	        // Add a reverse reference to the DOM object
	        base.$el.data("codeassist", base);
	/*
			base.delim = {
				'%':{
					k:53, // unicode character
					s:true // shift is true (otherwise, we are detecting 5)
				},
				'$':{
					k:52,
					s:true
				},
				'[':{
					k:219
				},
				']':{
					k:221
				}
			};
		*/
			
			base.search = []; // cache for built list with open & close keys (for search)

	        base.init = function(){
	            base.opt = $.extend({},$.codeassist.defaultOptions, opt);
				
				var list='',i;	
				for(i=0;i<base.opt.list.length;i++){
					if(!base.search[i]){
						base.search[i] = base.opt.key+base.opt.list[i]+(base.opt.closeKey?base.opt.closeKey:'');
					}
					list+='<div class="ca_'+i+'">'+this.htmlEncode(base.search[i])+'</div>';
				}
				// create and cache
				base.$ca = base.$el.keydown(base.keydown).keyup(base.keyup).wrap('<div class="codeassistWrap">')
					.after('<div class="codeassist">'+list+'</div>')
					.next()
						.find('div')
							.click(base.helperClk).end();
				return base.$el;
	        };
	
	
			base.helperClk = function(){
				var t = $(this), 					// selected value
					$el = t.parent().hide().prev(), // jquery input element
					el = $el.get(0), 				// input dom element 
					v = t.text().replace(t.find('span').text(),''), // value to add to input
					cv = $el.val(); 				// current value of input
				// handle insert at position (in case they are adding text in the middle)
				if (el.setSelectionRange){
					$el.val(cv.substring(0,el.selectionStart) + v + cv.substring(el.selectionStart,el.selectionEnd) + cv.substring(el.selectionEnd,cv.length));
				}else if (document.selection && document.selection.createRange) {
					$el.focus();
				    var range = document.selection.createRange();
				    range.text = v + range.text;
				}

				// trigger update events
				// this is only necessary if you have listeners on blur 
				// to update other fields (such as a preview pane)
				$el.blur().focus();
			};
			/**
			 * highlight text from suggestion list
			 * 
			 * @param string q The query to search and hilight
			 * @return bool Whether we found any match (can hide helper if not)
			 */
			base.hilight = function(q){
				var i,s = base.search,
					m = false;
				for(i=0;i<s.length;i++){
					var el = base.$ca.find('.ca_'+i),
						index = s[i].indexOf(q);
					if(index===-1){
						el.html(s[i]);
						continue;
					}
					el.html('<span>'+this.htmlEncode(s[i].substring(0,q.length))+'</span>'+this.htmlEncode(s[i].substring(q.length,s[i].length)));
					m = true;
				}
				return m;
			};
			base.htmlEncode = function(v){ 
			  return $('<div/>').text(v).html(); 
			};
			base.htmlDecode = function(v){ 
			  return $('<div/>').html(v).text(); 
			};
			base.keydown = function(e){
				if(e.which!==13 || base.$ca.css('display') === 'none'){ // not enter or helper not shown
					return;
				}
				var hi = base.$ca.find('span');
				if(hi.length){
					$(hi.get(0)).parent().click(); // act like you clicked the first match
					e.preventDefault();	
				}
			};
	        base.keyup = function(e){
				var t = $(this),	// input el
					el = t.get(0),	// input dom element
					p = t.parent(), // wrapper
					//r = base.delim[base.opt.key], // rules
					v = t.val(), 	// current input value
					o = t.offset(), // position of input el
					before = '';
				// get position of entry
				if (el.selectionStart!==undefined){
					before = v.substring(0,el.selectionStart);
				}else{
					t.focus();
					var range = document.selection.createRange();
					range.moveStart ('character', -v.length);
					before = v.substring(0,range.text.length);
				}
				// last character before cursor
				var l = before.length,
					last = before.substring(l-1,l),
					found = base.hilight(before.substring(before.lastIndexOf(base.opt.key),l));
				
				//if((r.s && !e.shiftKey) || e.which !== r.k){ // no shift when required or not our value anyway
				if(last!==base.opt.key){ // not a match for trigger
					if(!found){ // nothing matched in search
						base.$ca.hide(); // in case the helper is active
					}
				}else{
					// position at mouse and show
					// TODO: make mouse position a config option (alt use input right or bottom, later use cursor pixel position--pain)
					base.$ca.css('left',codeassist.pageX-o.left).css('top',codeassist.pageY-o.top).show();
				}
	        };

	        // Run
	        base.init();
	    };

	    $.codeassist.defaultOptions = {
			key:'%', // the trigger for showing our helper menu
			closeKey:false, // closing symbol (optional)
			list:['First Name','Last Name'] // valid suggestions
	    };

	    $.fn.codeassist = function(opt){
	        return this.each(function(){
	            (new $.codeassist(this, opt));
	        });
	    };
		codeassist = {}; // global scope cache
		// this is stupid but I can't find a better way to get the current mouse position
		// since the key events don't contain the pageX and pageY 
		// so following it arround and caching the position :(
		$(document).mousemove(function(e){
			codeassist.pageX = e.pageX;
			codeassist.pageY = e.pageY;
	   }); 
	 
})(jQuery);