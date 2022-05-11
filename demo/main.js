// 演示案例

var jsonRegExp = require("../index");
var PDR = jsonRegExp.PRE_DEFINED_REGEXP;
var PDRO = jsonRegExp.PRE_DEFINED_REGEXP_OPERATOR;
var PDSA = jsonRegExp.PRE_DEFINED_SPECIAL_ATTR;
var buildStrictRegExp = jsonRegExp.buildStrictRegExp;
var matchJsonObj = jsonRegExp.matchJsonObj;

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

var regexp = {
    song: PDR.JR_IS_NUMBER,
    str: PDR.JR_IS_STRING,
    str1: {
        song: PDR.JR_IS_STRING,
        num: PDRO.JR_CALC_OR(12),
        s: {
            a: PDR.JR_IS_NUMBER,
            song: PDR.JR_IS_STRING,
        },
        [PDSA.JR_NAMESPACE_NOT_NECESSARY]: {
            num: 1,
            s:1,
        },
    },
    arr: [1,1,1],
    [PDSA.JR_NAMESPACE_NOT_NECESSARY]: {
        str1: 1,
        arr: 1,
    }
};

var formalRegexp = buildStrictRegExp(regexp);

var ret = matchJsonObj(testWapper, formalRegexp);

console.log(ret);
