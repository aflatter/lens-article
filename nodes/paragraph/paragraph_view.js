"use strict";

var _ = require('underscore');
var util = require('substance-util');
var html = util.html;

var TextView = require('../text').View;

// Substance.Paragraph.View
// ==========================================================================

var ParagraphView = function(node) {
  TextView.call(this, node);

  this.$el.addClass('content-node paragraph');
};

ParagraphView.Prototype = function() {

};

ParagraphView.Prototype.prototype = TextView.prototype;
ParagraphView.prototype = new ParagraphView.Prototype();

module.exports = ParagraphView;
