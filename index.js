//对某个对象的正则可能情况
// 对任意对象进行正则，都是获取其Json的序列化字符串和某个 正则表达式 进行匹配
// 但是由于我们想让正则表达式更具灵魂，所以允许定义一个对象来等价这个正则表达式，这个项目就是用于实现这个对象的
// 要么是正则表达式，要么是对象形式，对象形式如何定义呢？

/*
* todo:
. 实现数组结构的复杂排序
 */

// 配置
var JR_MATCH_JS_PATH_GAP = "_";
var JR_DEBUG_NO_MATCH_GROUP = true;
var JR_VERBOSE_LOG_OUTPUT = true;

// 配置有效性检测
var isValidPathGap = function () {
    //todo: 添加有效性检测
    return true;
}


//若对象存在，是预定数据类型
var JR_NAMESPACE_NOT_NECESSARY = "UUID_6334923ED01011EC9D640242AC120002";
var JR_PREDEFINED_STRINGS = {
    [JR_NAMESPACE_NOT_NECESSARY]: 1,
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

var matchJsonObj = function (jsonObj, objRegexp) {
    var stdObj = standJsonObjSort(jsonObj);
    if(JR_VERBOSE_LOG_OUTPUT) {
        console.log("stdObj: ");
        console.log(JSON.stringify(stdObj));
        console.log("objRegexp: ");
        console.log(new RegExp(objRegexp));
    }
    var ret = JSON.stringify(stdObj).match(objRegexp);
    return ret;
}

var configure = function (setting) {
    if(setting) {
        if(setting.hasOwnProperty(JR_MATCH_JS_PATH_GAP) && isValidPathGap(setting[JR_MATCH_JS_PATH_GAP])) {
            JR_DEBUG_NO_MATCH_GROUP = setting[JR_DEBUG_NO_MATCH_GROUP];
        }
        if(setting.hasOwnProperty(JR_DEBUG_NO_MATCH_GROUP) ) {
            JR_DEBUG_NO_MATCH_GROUP = setting[JR_DEBUG_NO_MATCH_GROUP];
        }
        if(setting.hasOwnProperty(JR_VERBOSE_LOG_OUTPUT)) {
            JR_VERBOSE_LOG_OUTPUT = setting[JR_VERBOSE_LOG_OUTPUT];
        }
    }
}

module.exports = {
    PRE_DEFINED_REGEXP: {
        JR_IS_STRING : /\".*\"/,
        JR_IS_NUMBER : /[0-9]+/,
        JR_IS_ARRAY : /\[.*\]/,
    },
    PRE_DEFINED_SPECIAL_ATTR: {
        JR_NAMESPACE_NOT_NECESSARY: JR_NAMESPACE_NOT_NECESSARY,
    },
    PRE_DEFINED_REGEXP_OPERATOR: {
        JR_CALC_OR : function () {
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
        },
    },
    buildStrictRegExp: buildStrictRegExp,
    matchJsonObj: matchJsonObj,
    configure: configure,
}