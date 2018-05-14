/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function (b, c) { var $ = b.jQuery || b.Cowboy || (b.Cowboy = {}), a; $.throttle = a = function (e, f, j, i) { var h, d = 0; if (typeof f !== "boolean") { i = j; j = f; f = c } function g() { var o = this, m = +new Date() - d, n = arguments; function l() { d = +new Date(); j.apply(o, n) } function k() { h = c } if (i && !h) { l() } h && clearTimeout(h); if (i === c && m > e) { l() } else { if (f !== true) { h = setTimeout(i ? k : l, i === c ? e - m : e) } } } if ($.guid) { g.guid = j.guid = j.guid || $.guid++ } return g }; $.debounce = function (d, e, f) { return f === c ? a(d, e, false) : a(d, f, e !== false) } })(this);
/**
 * KeepScrolling - v4.0.0
 * https://github.com/tfirdaus/web-api-history-infinite-scroll
 * Made By Thoriq Firdaus
 *
 * jQuey Boilerplate
 * http://jqueryboilerplate.com
 * Made by Zeno Rocha
 *
 * Under MIT License
 */

// The semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

	"use strict";

	// Undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// Window and document are passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "keepScrolling";
	var articleDataKey = "article-data";

	var defaults = {
		scrollThreshold: 400,
		articleSelector: undefined,
		navigationSelector: undefined,
		nextUrlSelector: undefined,
		placeholderHtml: '<div class="spinner"></div>',
		beforeArticleAppend: $.noop,
		afterArticleAppend: $.noop,
		onHistoryChange: $.noop,
		pluginClassName: 'keepscrolling',
		placeholderClassName: 'placeholder',
		fetchingClassName: 'fetching'
	};

	var articleFetching = false;
	var articleEnding = false;

	// The actual plugin constructor
	function Plugin(element, options) {

		// JQuery has an extend mesthod which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;
		this._nextUrl = undefined;

		this.element = element;
		this.element.classList.add(this.settings.pluginClassName);

		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {

		/**
		 * Initialize.
		 * @return {Void}
		 */
		init: function () {
			this.extractArticleData($(window.document), location.href);

			this.addPlaceholder();

			this.fetchIfNeeded();
			this.startObserveScroll();
		},

		/**
		 * Find and returns a list of articles on the page.
		 * @return {jQueryObject} List of selected articles.
		 */
		getArticles: function () {
			return $(this.element).find(this.settings.articleSelector);
		},

		/**
		 * Append the addPlaceholder.
		 * Placeholder is used to indicate a new post is being loaded.
		 * @return {Void}
		 */
		addPlaceholder: function () {
			var placeholder = $(this.settings.placeholderHtml);
			placeholder.addClass(this.settings.placeholderClassName);
			$(this.element).append(placeholder);
		},

		/**
		 * Detect whether the last post is finishing shown / near finished.
		 * @return {Boolean} `true` if it is near bottom, and `false` if not.
		 */
		isNearBottom: function () {
			var lastArticle = this.getArticles().last();
			if (lastArticle.length < 1) {
				return true;
			}
			var lastPostBottom = lastArticle[0].getBoundingClientRect().bottom;
			return lastPostBottom <= this.settings.scrollThreshold;
		},

		/**
		 * Whether to proceed ( or not to ) fetching a new article.
		 * @return {Boolean} `true` if needs proceed, and `false` if not.
		 */
		shouldFetch: function () {
			if (articleFetching || articleEnding || !this.isNearBottom()) {
				return false;
			}

			if (!this._nextUrl) {
				articleEnding = true;
				return false;
			}

			return true;
		},

		/**
		 * Function to extract data from the DOM.
		 * @param {jQueryObject} $dom DOM object to find articles in it.
		 * @return {jQueryObject} List of articles in DOM.
		 */
		extractArticleData: function($dom, url) {
			this._nextUrl = $dom.find(this.settings.nextUrlSelector).attr('href');

			var articles = $dom.find(this.settings.articleSelector);

			var navigation = $dom.find(this.settings.navigationSelector);
			navigation.remove();

			articles.data(articleDataKey, {
				title: $dom.find('title').text(),
				url: url
			});

			return articles;
		},

		/**
		 * Function to fetch and append a new article.
		 * @return {Void}
		 */
		fetchIfNeeded: function () {
			if (!this.shouldFetch()) {
				return;
			}

			var main = this.element;
			var $articleLast = this.getArticles().last();
			var fetchingClass = this.settings.fetchingClassName;

			var processingUrl = this._nextUrl;
			var self = this;

			$.ajax({
				url: this._nextUrl,
				type: "GET",
				dataType: "html",
				beforeSend: function () {
					articleFetching = true;
					$(main).addClass(fetchingClass);
				}
			})
			.done(function (res) {
				self._nextUrl = null;

				if (!res) {
					return;
				}

				var $dom = $('<div></div>').html(res);
				window.$dom = $dom;
				var articles = self.extractArticleData($dom, processingUrl);

				self.settings.beforeArticleAppend($dom, articles, res);
				$articleLast.after(articles);
				self.settings.afterArticleAppend($dom, articles, res);

				self.fetchIfNeeded();
			})
			.always(function () {
				articleFetching = false;
				$(main).removeClass(fetchingClass);
			});
		},

		/**
		 * Change the browser history.
		 * @return {Void}
		 */
		history: function () {
			if (!window.history) {
				return;
			}

			var onHistoryChange = this.settings.onHistoryChange;
			var scrollTop = $(window).scrollTop();
			var roofLine = Math.ceil((window.innerHeight || document.documentElement.clientHeight) * 0.4);
			var _gaq = window._gaq || [];

			this.getArticles()
				.each(function (index, article) {
					var articleOffset = Math.floor(article.offsetTop - scrollTop);

					if (articleOffset > roofLine) {
						return;
					}

					var floorLine = (article.clientHeight - (roofLine * 1.4));
					floorLine = Math.floor(floorLine * -1);

					if (articleOffset < floorLine) {
						return;
					}

					var articleData = $(article).data(articleDataKey);

					if (window.location.href !== articleData.url) {
						window.history.replaceState(articleData, articleData.title, articleData.url);
						document.title = articleData.title;
						_gaq.push(['_trackPageview']);
						onHistoryChange();
					}

					return false;

				}.bind(this));
		},

		/**
		 * Functions to run during the scroll.
		 * @return {Void}
		 */
		startObserveScroll: function () {
			window.addEventListener("scroll", $.throttle(300, function () {
				this.fetchIfNeeded();
			}).bind(this), false);

			window.addEventListener("scroll", function () {
				this.history();
			}.bind(this), false);
		}
	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);