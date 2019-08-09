(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Store = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var Store =
  /*#__PURE__*/
  function () {
    function Store(options) {
      _classCallCheck(this, Store);

      this._state = options.state || {};
      this._actions = options.actions || {};
      this._mutations = options.mutations || {};
      var store = this;
      var dispatch = this.dispatch,
          commit = this.commit;

      this.dispatch = function bundDispatch(type, payload) {
        return dispatch.call(store, type, payload);
      };

      this.commit = function boundCommit(type, payload, options) {
        return commit.call(store, type, payload);
      };
    }

    _createClass(Store, [{
      key: "dispatch",
      value: function dispatch(_type, _payload) {
        var entry = this._actions[_type];
        if (!entry) return;
        entry.call(store, {
          commit: this.commit
        });
      }
    }, {
      key: "commit",
      value: function commit(_type, _payload) {
        var entry = this._mutations[_type];
        entry.call(store, this._state);
      }
    }]);

    return Store;
  }();

  return Store;

}));
