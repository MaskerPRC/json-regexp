//对某个对象的正则可能情况
// 对任意对象进行正则，都是获取其Json的序列化字符串和某个 正则表达式 进行匹配
// 但是由于我们想让正则表达式更具灵魂，所以允许定义一个对象来等价这个正则表达式，这个项目就是用于实现这个对象的
// 要么是正则表达式，要么是对象形式，对象形式如何定义呢？


//todo:
/*
* 1. 实现数组结构的复杂排序
 */

var testWapper = {
    song: 1,
    str: "232",
    str1: {
        song:"1",
        s: {
            a: 1,
            song: "v",
        },
        num:12,
    },
    arr: [1,1,1],
}

//2. 若对象存在，是预定数据类型
var JR_NAMESPACE_NOT_NECESSARY = "UUID_6334923ED01011EC9D640242AC120002";
var JR_PREDEFINED_STRINGS = {
    [JR_NAMESPACE_NOT_NECESSARY]: 1,
};

var JR_MATCH_JS_PATH_GAP = "_";
var JR_DEBUG_NO_MATCH_GROUP = true;
var JR_IS_STRING = /\".*\"/;
var JR_IS_NUMBER = /[0-9]+/;
var JR_IS_ARRAY = /\[.*\]/;
var JR_CALC_OR = function () {
    //不是标准正则表达式，转化为正则表达式
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
    song: JR_IS_NUMBER,
    str: JR_IS_STRING,
    str1: {
        song: JR_IS_STRING,
        num: JR_CALC_OR(12),
        s: {
            a: JR_IS_NUMBER,
            song: JR_IS_STRING,
        },
        [JR_NAMESPACE_NOT_NECESSARY]: {
            num: 1,
            s:1,
        },
    },
    arr: [1,1,1],
    [JR_NAMESPACE_NOT_NECESSARY]: {
        str1: 1,
        arr: 1,
    }
};

// 目前支持字符串，数字，对象三种
var superStringify = function (obj, curPath) {
    var ret = "";
    if(obj instanceof RegExp) {
        var regExpRaw = obj.toString();
        var matchGroup = "(?<"+curPath+">";
        if(JR_DEBUG_NO_MATCH_GROUP) {
            matchGroup =  "(";
        }
        ret += ":"+matchGroup+regExpRaw.slice(1, regExpRaw.length-1)+")";
    }
    else if(obj instanceof Array) {
        ret += ":\\["+obj.toString()+"\\]";
    }
    else if(obj instanceof Object)  {
        ret += ":{";

        // 获取map的keys
        var keys = Object.keys(obj).sort();

        // 过滤无效key
        keys = keys.filter(key=>!JR_PREDEFINED_STRINGS[key]);

        // 遍历key构建正则表达式
        for (var key_index in keys) {
            var isLast = Number(key_index) === keys.length-1;

            var key = keys[key_index];

            var attrName = key;
            var attrValue = obj[key];

            var isNecessary = true;
            if(obj[JR_NAMESPACE_NOT_NECESSARY] && obj[JR_NAMESPACE_NOT_NECESSARY][attrName]) {
                isNecessary = false;
            }
            if(!isNecessary) {
                ret += "(";
            }
            ret += "\""+attrName+"\"" + superStringify(attrValue, curPath+JR_MATCH_JS_PATH_GAP+attrName);
            if(!isLast) {
                ret += ",";
            }
            if(!isNecessary) {
                ret += ")?";
            }
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
    console.log("stdObj: "+JSON.stringify(stdObj));
    console.log("objRegexp: "+new RegExp(objRegexp));
    var ret = JSON.stringify(stdObj).match(objRegexp);
    console.log(ret);
    return ret;
}


var objRegexp = buildStrictRegExp(regexp);

console.log(objRegexp);

matchObj(testWapper, objRegexp);
