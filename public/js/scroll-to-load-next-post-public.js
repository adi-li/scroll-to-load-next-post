(function( $ ) {
	'use strict';

	$(function() {
		$('#content').keepScrolling({
			articleSelector: '.post',
			navigationSelector: '.post-navigation',
			nextUrlSelector: '.nav-previous a:first'
		});
	});

})( jQuery );
