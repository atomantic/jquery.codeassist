#License#
@author Adam Eivy (antic | atomantic)  
@link [http://adameivy.com](http://adameivy.com) [http://intellectualpirates.net](http://intellectualpirates.net)  

@license Copyright (c) 2010 Adam Eivy (antic | atomantic) Dual licensed under the MIT and GPL licenses:  
 * [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)  
 * [http://www.gnu.org/licenses/gpl.html](http://www.gnu.org/licenses/gpl.html)

#Version#
1.0 - working release (tested in IE, Chrome and Firefox)

#What it does:#
This jQuery plugin was built for the purpose of allowing users to enter dynamically replaceable code bits into textareas and input fields. A use case example would be if you are allowing users to create a page template or message template that will need to be filtered for the audience or some other situation involving different values for different pieces of data at a time. A user can enter in the code bits, which you can replace behind the scenes in the template.

Additionally, this code base can be used to create code suggestions as an inline autocomplete--say, for example, if you had a webpage that allows users to write PHP code, you could create a list of variables as they are defined and setup the code page to suggest existing variables when the user enters $.

#Usage:#
	$('textarea').codeassist({
		key:'[',
		closeKey:']'
		list:[
			'UserID',
			'Nickname',
			'Avatar'
		]
	});