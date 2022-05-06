var test = {
    "song": 1,
    "str": "232",
}

//对某个对象的正则可能情况
// 对任意对象进行正则，都是获取其Json的序列化字符串和某个 正则表达式 进行匹配
// 但是由于我们想让正则表达式更具灵魂，所以允许定义一个对象来等价这个正则表达式，这个项目就是用于实现这个对象的
// 要么是正则表达式，要么是对象形式，对象形式如何定义呢？
//1. 若对象不存在，
var JR_IS_UNDEFINED = /^undefined$/;
var regexp = JR_IS_UNDEFINED;

//2. 若对象存在，是基础类型
var JR_IS_STRING = /^\"[^"]*\"$/;
var JR_IS_NUMBER = /^[0-9]*$/;
regexp = JR_IS_NUMBER;
regexp = JR_IS_STRING;

//3. 若对象存在，不是基础类型，我们不支持key和value同时为正则表达式
regexp = new Map([
    ["song", JR_IS_NUMBER],
    ["str", JR_IS_STRING],
]);

//4. 再复杂一些的正则逻辑
regexp = new Map([
    ["person", [
        ["name", JR_IS_STRING],
        ["addr", JR_IS_STRING],
        ["phone", JR_IS_NUMBER],
    ]],
    ["desc", [
        ["habit", JR_IS_STRING],
        ["say", JR_IS_STRING],
        ["do", JR_IS_STRING],
    ]],
])

//对象正则检测

var jr_match = function (obj, jr_exp) {
    //简单undefind
    var allExp = jr_exp;
    if(JSON.stringify(obj).match(allExp)) {
        return true;
    }
};
