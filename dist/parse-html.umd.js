(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.parseHTML = factory());
}(this, function () { 'use strict';

  var ncname = '[a-zA-Z_][\\w]*';
  var qnamcCapture = '(' + ncname + ')';
  var startTagOpen = new RegExp('^<' + qnamcCapture);
  var startTagClose = new RegExp('^\s*(\/?)>');
  var endTag = new RegExp('^<\/' + qnamcCapture + '>');
  var index;
  var stack = [];
  var html;
  var currentParent;
  var root;

  function parseHTML(template) {
    html = template;

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 匹配开始标签
        if (html.match(startTagOpen)) {
          var startTagMatch = parseStartTag();

          if (startTagMatch) {
            var element = {
              type: 1,
              tag: startTagMatch.tagName,
              lowerCasedtag: startTagMatch.tagName.toLowerCase(),
              parent: currentParent,
              children: []
            };

            if (!root) {
              root = element;
            }

            if (currentParent) {
              currentParent.children.push(element);
            }

            stack.push(element);
            currentParent = element;
            continue;
          }
        } // 匹配结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch);
          continue;
        }
      }
    }

    return root;
  }

  function advance(n) {
    index += n;
    html = html.substring(n);
  }
  /**
   * 匹配开始标签
   * @param {*} html 
   */


  function parseStartTag() {
    var start = html.match(startTagOpen);

    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index,
        end: ''
      };
      advance(start[0].length);
      var end = html.match(startTagClose);

      if (end) {
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function parseEndTag(tagName) {
    var pos;

    for (pos = stack.length - 1; pos >= 0; pos--) {
      debugger;

      if (stack[pos].lowerCasedtag === tagName[1].toLowerCase()) {
        break;
      }
    }

    if (pos >= 0) {
      stack.length = pos;
      currentParent = stack[pos];
    }
  }

  return parseHTML;

}));
