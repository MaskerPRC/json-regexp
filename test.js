var test = {
    "song": 1,
    "str": "232",
    "str1": {
        "song":"1",
        "num":12,
    },
    "arr": [1],
}

//2. 若对象存在，是基础类型
var JR_TYPE_MAYBE_SPACE = "UUID_6334923ED01011EC9D640242AC120002";
var JR_TYPE_JS_PATH_GAP = "";
var JR_INNER_NAMES = {};
JR_INNER_NAMES[JR_TYPE_MAYBE_SPACE] = 1;
var JR_IS_STRING = /\".*\"/;
var JR_IS_NUMBER = /[0-9]+/;
var JR_IS_ARRAY = /\[.*\]/;
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
        "num": JR_CALC_OR(12),
        [JR_TYPE_MAYBE_SPACE]: {
            "num": 1,
        },
    },
    "arr": JR_IS_ARRAY,
    [JR_TYPE_MAYBE_SPACE]: {
        "str1": 1,
        //修复易逝性数组匹配
        "arr": 1,
    }
};

var allIndex = 0;
//目前支持字符串，数字，对象三种
var superStringify = function (obj, curPath) {
    var ret = "";
    if(obj instanceof RegExp) {
        var regExpRaw = obj.toString();
        ret += ":(?<"+curPath+">"+regExpRaw.slice(1, regExpRaw.length-1)+")";
    }
    else if(obj instanceof Object)  {
        ret += ":{";
        var index = 0;
        var keys = Object.keys(obj).sort();
        for (var key_index in keys) {
            var key = keys[key_index];
            if(JR_INNER_NAMES[key]) {
                continue;
            }
            var attrName = key;
            var attrValue = obj[key];
            var maybeSpace = false;
            if(obj[JR_TYPE_MAYBE_SPACE] && obj[JR_TYPE_MAYBE_SPACE][attrName]) {
                maybeSpace = true;
                ret += "(";
            }
            if(index!==0) {
                ret += ","
            }
            ret += "\""+attrName+"\"" + superStringify(attrValue, curPath+JR_TYPE_JS_PATH_GAP+attrName);
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
    var noStrictStr = superStringify(regexp,"");
    noStrictStr = noStrictStr.slice(1);
    var strictStr = "^"+noStrictStr+"$";
    return strictStr;
}

var standJsonObjSort = function (value) {
    var newObj = undefined;
    if(value instanceof Array) {
        newObj = [];
        for (const arr_index in value) {
            var arr_value = value[arr_index];
            newObj.push(standJsonObjSort(arr_value));
        }
    }
    else if(value instanceof Object) {
        newObj = {};
        var keys = Object.keys(value).sort();

        for (const key_index in keys) {
            var key = keys[key_index];
            var sub_value = value[key];
            if(sub_value instanceof Object) {
                newObj[key] = standJsonObjSort(sub_value);
            }
            else {
                newObj[key] = sub_value;
            }
        }
    }
    else {
        newObj = value;
    }
    return newObj;
}

var matchObj = function (jsonObj, objRegexp) {
    var stdObj = standJsonObjSort(jsonObj);
    console.log(JSON.stringify(stdObj));
    var ret = JSON.stringify(stdObj).match(objRegexp);
    console.log(ret);
    return ret;
}


var objRegexp = buildStrictRegExp(regexp);

console.log(objRegexp);

matchObj(test, objRegexp);
