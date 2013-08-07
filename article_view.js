"use strict";

var _ = require("underscore");
var util = require("substance-util");
var html = util.html;
var Surface = require("substance-surface");
var View = require("substance-application").View;


// Lens.Article.View
// ==========================================================================
//
// The Substance Article Editor / Viewer

var ArticleView = function(controller) {
  View.call(this);

  this.$el.addClass('article');
  
  this.controller = controller;

  // Writer
  // --------

  this.writer = controller.writer;
  
  this.listenTo(this.writer.selection, 'selection:changed', this.toggleAnnotationToggles);

  // Surfaces
  // --------

  // A Substance.Document.Writer instance is provided by the controller
  this.surface = new Surface(this.controller.writer, {
    editable: false
  });

  // A Surface for the figures view
  // Uses the figures writer, provided by the controller
  this.figures = new Surface(this.controller.figures, {
    editable: false
  });

  // A Surface for the figures view
  // Uses the figures writer, provided by the controller
  this.citations = new Surface(this.controller.citations, {
    editable: false
  });

  this.$el.delegate('.image-files', 'change', _.bind(this.handleFileSelect, this));
};

ArticleView.Prototype = function() {

  this.handleFileSelect = function(evt) {

    var that = this;
    evt.stopPropagation();
    evt.preventDefault();

    // from an input element
    var filesToUpload = evt.target.files;
    var file = filesToUpload[0];

    // TODO: display error message
    if (!file.type.match('image.*')) return console.log('Not an image. Skipping...');

    var img = document.createElement("img");
    var reader = new FileReader();

    reader.onload = function(e) {
      img.src = e.target.result;
      var largeImage = img.src;

      _.delay(function() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 800;
        var MAX_HEIGHT = 1000;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        var mediumImage = canvas.toDataURL("image/png");

        that.insertImage('image', {
          medium: mediumImage
        });

      }, 800);
    };

    reader.readAsDataURL(file);

  };

  this.toggleAnnotationToggles = function() {
    var sel = this.writer.selection;
    if (sel.getNodes().length === 1 && !sel.isCollapsed()) {
      this.$('.annotation-toggles').show();
    } else {
      this.$('.annotation-toggles').hide();
    }
  };

  // Clear selection
  // --------
  //

  this.clear = function() {

  };

  // Annotate current selection
  // --------
  //

  this.annotate = function(type) {
    this.writer.annotate(type);
    return false;
  };

  // Rendering
  // --------
  //

  this.render = function() {
    this.$el.html(html.tpl('article', this.controller));

    this.$('.document').html(this.surface.render().el);

    // Figures
    this.$('.resources').append(this.figures.render().el);
    this.$('.resources').append(this.citations.render().el);

    // Wait a second
    _.delay(function() {
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

      // Show doc when typesetting math is done
      // MathJax.Hub.Queue(displayDoc);
    }, 20);

    return this;
  };

  this.dispose = function() {
    this.surface.dispose();
    this.stopListening();
  };
};

ArticleView.Prototype.prototype = View.prototype;
ArticleView.prototype = new ArticleView.Prototype();

module.exports = ArticleView;
