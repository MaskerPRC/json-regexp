var test = {
    "song": 1,
    "str": "232",
    "str1": {
        "song":"1",
        "num":12,
    },
}

//2. 若对象存在，是基础类型
var JR_IS_STRING = /\"[^"]*\"/;
var JR_IS_NUMBER = /[0-9]+/;
var JR_TYPE_MAYBE_SPACE = "__JR_CONST_IS_INVALID_UUID_6334923ED01011EC9D640242AC120002";
var JR_CALC_OR = function () {
    //非法检测
    var args = [];
    Array.from(arguments).forEach((arg, index)=>{
        if(arg instanceof RegExp) {
            args.push(arg);
        }
        else {
            args.push(new RegExp(arg));
        }
    });

    //构建or逻辑
    var allDesc = "";
    Array.from(args).forEach((e, index)=>{
        if(e instanceof RegExp) {
            if(index === 0) {
                allDesc += "";
            }
            else {
                allDesc += "|";
            }
            allDesc += e.toString().slice(1,e.toString().length-1);
            allDesc += "";
        }
    });
    allDesc += "";
    return new RegExp(allDesc);
}

//3. 若对象存在，不是基础类型，我们不支持key和value同时为正则表达式
var regexp = {
    "song": JR_IS_NUMBER,
    "str": JR_IS_STRING,
    "str1": {
        "song": JR_IS_STRING,
        "num": JR_CALC_OR(12, JR_TYPE_MAYBE_SPACE),
    }
};


//目前支持字符串，数字，对象三种
var superStringify = function (obj) {
    var ret = "";
    if(obj instanceof RegExp) {
        var regExpRaw = obj.toString();
        ret += ":("+regExpRaw.slice(1, regExpRaw.length-1)+")";
    }
    else if(obj instanceof String) {
        ret += ":\""+ JSON.stringify(obj)+"\"";
    }
    else if(obj instanceof Number) {
        ret += ":"+ JSON.stringify(obj);
    }
    else if(obj instanceof Object)  {
        ret += ":{";
        var index = 0;
        for (var attr in obj) {
            var attrName = attr;
            var attrValue = obj[attr];
            var maybeSpace = false;
            if(JR_TYPE_MAYBE_SPACE.match(attrValue)) {
                maybeSpace = true;
                ret += "(";
            }
            if(index!==0) {
                ret += ","
            }
            ret += "\""+attrName+"\"" + superStringify(attrValue);
            if(maybeSpace) {
                ret += ")?";
            }
            index++;
        }
        ret += "}";
    }
    return ret;
}
var buildStrictRegExp = function (regexp) {
    var noStrictStr = superStringify(regexp);
    noStrictStr = noStrictStr.slice(1);
    var strictStr = "^"+noStrictStr+"$";
    return strictStr;
}
var a = buildStrictRegExp(regexp);
a = a.slice(1,a.length-1);


console.log(a);
console.log(JSON.stringify(test));

console.log(JSON.stringify(test).match(a));
