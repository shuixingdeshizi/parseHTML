(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.parse = factory());
}(this, function () { 'use strict';

  var ncname = '[a‐zA‐Z_][\\w\\‐\\.]*';
  var singleAttrIdentifier = /([^\s"'<>/=]+)/;
  var singleAttrAssign = /(?:=)/;
  var singleAttrValues = [/"([^"]*)"+/.source, /'([^']*)'+/.source, /([^\s"'=<>`]+)/.source];
  var attribute = new RegExp('^\\s*' + singleAttrIdentifier.source + '(?:\\s*(' + singleAttrAssign.source + ')' + '\\s*(?:' + singleAttrValues.join('|') + '))?');
  var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
  var startTagOpen = new RegExp('^<' + qnameCapture);
  startTagOpen = /^<(div)/;
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
  endTag = /^<\/(div)>/;
  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
  var stack = [];
  var currentParent, root;
  var html = '';
  var text = '';
  var index = 0;

  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function parseHTML(template) {
    html = template;

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1]);
          continue;
        }

        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          var element = {
            type: 1,
            tag: startTagMatch.tagName,
            lowerCasedTag: startTagMatch.tagName.toLowerCase(),
            attrsList: startTagMatch.attrs,
            attrsMap: makeAttrsMap(startTagMatch.attrs),
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
      } else {
        debugger;
        text = html.substring(0, textEnd);
        console.log(text);
        advance(textEnd);
        var expression = void 0;

        if (expression = parseText(text)) {
          currentParent.children.push({
            type: 2,
            text: text,
            expression: expression
          });
        } else {
          currentParent.children.push({
            type: 3,
            text: text
          });
        }

        continue;
      }
    }

    return root;
  }

  function parseStartTag() {
    var start = html.match(startTagOpen);

    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;

      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3]
        });
      }

      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function makeAttrsMap(attrs) {
    var map = {};

    for (var i = 0, l = attrs.length; i < l; i++) {
      map[attrs[i].name] = attrs[i].value;
    }

    return map;
  }

  function parseEndTag(tagName) {
    var pos;

    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
        break;
      }
    }

    if (pos >= 0) {
      stack.length = pos;
      currentParent = stack[pos];
    }
  }

  function parseText(text) {
    debugger;
    if (!defaultTagRE.test(text)) return;
    var tokens = [];
    var lastIndex = defaultTagRE.lastIndex = 0;
    var match, index;

    while (match = defaultTagRE.exec(text)) {
      index = match.index;

      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }

      var exp = match[1].trim();
      tokens.push("_s(".concat(exp, ")"));
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return tokens.join('+');
  }

  return parseHTML;

}));
