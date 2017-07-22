var getFactory = require('./index');
// ------------- test ---------------//

function fn(x,y){
	this.x = x;
	this.y = y
}

var methods1 = {
	log:function(){
		console.log(this)
	}
}

var methods2 = {
	get:function(key){
		return this[key];
	}
}

// 每次getFactory的调用，都会生成一个独立的对象生成器
var factory1 = getFactory(fn, methods1)
var factory2 = getFactory(fn, methods2)
var fa = factory1.create(2,3);
var fa2 = factory2.create(1,2)
console.log(fa,fa2)

// 获取所有属性的值
var factory = getFactory(fn, methods1)
var obj = factory.create(1,2)
console.log(obj.getAll())

// 获取某个值，设置某个值
var factory = getFactory(fn,methods2)
var obj = factory.create(1,2)
//obj.set('x',111111)
console.log(obj.get('x'))
