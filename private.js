// 保持所有私有数据的map
var map = new WeakMap();
// 默认的数据存取函数
var defaultFn = {
		has: function(key) {
			return !!this[key];
		},
		get: function(key) {
			return this[key];
		},
		getAll: function() {
			var keys = Object.keys(this);
			var ret = {};
			for (var i = 0; i < keys.length; i++) {
				ret[keys[i]] = this[keys[i]];
			}
			return ret;
		},
		set: function(key, val) {
			this[key] = val;
			return this;
		},
		delete: function() {
			map.delete(this);
			return this;
		}
	}
/*
	封装函数，主要实现this的传递，因为用户执行get/set等函数时，
	this的值是Factory类型的对象，这时候我们需要根据当前this去map中取到真正的this，
	然后传递到最后执行的函数中。用户在函数中只需要直接访问this即可。
	@param {Object} {get: function() {}}
*/
function wrap(protoFns) {
	var ret = {};
	for (key in protoFns) {
		if (protoFns.hasOwnProperty(key)) {
			ret[key] = (function(fn) {
				return function() {return fn.call(map[this],...arguments)};
			})(protoFns[key]);
		}
	}
	return ret;
}
function getFactory(fn, protoFns) {
	function Factory() {}
	// 对象生成器
	Factory.create = function() {
		if (this !== Factory) {
			return Factory.create(...arguments);
		}
		var target = new Factory();
		// 禁止操作Factory类型的对象
		Object.freeze(target);
		map[target] = new fn(...arguments);
		return target;
	}
	// 挂载函数到原型
	Object.assign(Factory.prototype, wrap(Object.assign(defaultFn, protoFns)));
	return  Factory;
};
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
	module.exports = getFactory;
}

