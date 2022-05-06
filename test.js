var test = {
    "song": 1,
    "str": "232",
    "str1": "",
}

//2. 若对象存在，是基础类型
var JR_IS_STRING = /\"[^"]*\"/;
var JR_IS_NUMBER = /[0-9]*/;
regexp = JR_IS_NUMBER;
regexp = JR_IS_STRING;

//3. 若对象存在，不是基础类型，我们不支持key和value同时为正则表达式
regexp = {
    "song": JR_IS_NUMBER,
    "str": JR_IS_STRING,
    "str1": JR_IS_STRING
};

//目前支持字符串，数字，对象三种
var superStringify = function (obj) {
    var ret = "";
    if(obj instanceof RegExp) {
        var regExpRaw = obj.toString();
        ret += ":("+regExpRaw.slice(1, regExpRaw.length-1)+"),";
    }
    else if(obj instanceof String) {
        ret += ":\""+ JSON.stringify(obj)+"\",";
    }
    else if(obj instanceof Number) {
        ret += ":"+ JSON.stringify(obj)+",";
    }
    else if(obj instanceof Object)  {
        ret += ":{";
        for (var attr in obj) {
            var attrName = attr;
            var attrValue = obj[attr];
            ret += "\""+attrName+"\"" + superStringify(attrValue);
        }
        ret = ret.slice(0,ret.length-1);
        ret += "},";
    }
    return ret;
}
var a = superStringify(regexp);
a = a.slice(1,a.length-1);


console.log(a);
console.log(JSON.stringify(test));

console.log(JSON.stringify(test).match(a));
