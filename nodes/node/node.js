"use strict";

var util = require("substance-util");

// Substance.Node
// -----------------

var Node = function(node) {
  this.properties = node;
};

// Type definition
// --------
// 

Node.type = {
  "parent": "content",
  "properties": {
    "content": ["array", "object"]
  }
};

// Define node behavior
// --------

Node.properties = {
  abstract: true,
  immutable: true,
  mergeableWith: [],
  preventEmpty: true,
  allowedAnnotations: []
};

Node.Prototype = function() {

};

Node.prototype = new Node.Prototype();
Node.prototype.constructor = Node;


Object.defineProperties(Node.prototype, {
  id: {
    get: function () {
      return this.properties.id;
    }
  },
  type: {
    get: function () {
      return this.properties.type;
    }
  }
});


module.exports = Node;