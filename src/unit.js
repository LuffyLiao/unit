"use strict";
exports.__esModule = true;
var mapToOut = {
    region: 'regionid',
    section: 'sectionidStr',
    metro: 'mrtstation',
    station: 'mrtcoods',
    sort: 'o',
    floor: 'newfloor',
    goodhouse: 'is_good_house'
};
var mapToIn = {
    regionid: 'region',
    sectionidStr: 'section',
    mrtstation: 'metro',
    mrtcoods: 'station',
    o: 'sort',
    newfloor: 'floor',
    is_good_house: 'goodhouse'
};
/**
 * adapter
 * 数据适配器，适配本地数据和接口数据
 * @params.data
 */
function adapter(data, model) {
    if (model === void 0) { model = 'go out'; }
    var returnData = model === 'go out' ? goout(data) : goin(data);
    return returnData;
}
exports.adapter = adapter;
/**
 * @param {Object} data 需要轉換的數據
 */
function goout(data) {
    var copy = Object.assign({}, data);
    // 转换[区域]参数名称
    for (var key in mapToOut) {
        if (copy[key]) {
            copy[mapToOut[key]] = copy[key];
            delete copy[key];
        }
    }
    // [捷运]额外添加其他参数
    if (typeof data.metro !== 'undefined') {
        copy.searchtype = 4;
        copy.mrt = 1;
    }
    // 转换[其他]参数名称
    if (data.others) {
        data.others.split(',').forEach(function (name) {
            copy[name] = 1;
        });
        delete copy.others;
    }
    return copy;
}
/**
 * @param {Object} data 需要轉換的數據
 * @param {boolean} isMulti 是否是多選，默認為true
 */
function goin(data) {
    var copy = Object.assign({}, data);
    var toNumber = ['region', 'metro', 'kind', 'room', 'area', 'shape', 'floor', 'source', 'sex', 'sort', 'houseage'];
    var others = ['parking', 'balcony_1', 'pet', 'cook', 'ex_top_floor'];
    // 转换[区域]参数名称
    for (var key in mapToIn) {
        if (copy[key]) {
            copy[mapToIn[key]] = copy[key];
            delete copy[key];
        }
    }
    // 转换数据类型
    toNumber.forEach(function (name) {
        if (copy[name] === 'null') {
            copy[name] = 0;
        }
        if (typeof copy[name] !== 'undefined') {
            copy[name] = Number(copy[name]);
        }
    });
    // 转换[其他]参数
    copy.others = [];
    others.forEach(function (name) {
        if (copy[name]) {
            copy.others.push(name);
        }
    });
    copy.others.length
        ? (copy.others = copy.others.join(','))
        : delete copy.others;
    return copy;
}
function getSearch() {
    var search = decodeURIComponent(location.search);
    var searchObj = {};
    var temp;
    if (search.length) {
        search.slice(1).split('&').forEach(function (subAry) {
            temp = subAry.split('=');
            searchObj[temp[0]] = temp[1];
        });
    }
    return searchObj;
}
exports.getSearch = getSearch;
function LS(names) {
    var data = {};
    var _loop_1 = function (name_1) {
        var lsName = localStorage.getItem(names[name_1]);
        if (!lsName)
            return { value: void 0 };
        data[name_1] = names[name_1] && JSON.parse(lsName);
        Object.defineProperty(this_1, name_1, {
            get: function () {
                return data[name_1];
            },
            set: function (val) {
                data[name_1] = val;
                localStorage.setItem(names[name_1], JSON.stringify(val));
            }
        });
    };
    var this_1 = this;
    for (var name_1 in names) {
        var state_1 = _loop_1(name_1);
        if (typeof state_1 === "object")
            return state_1.value;
    }
}
exports.LS = LS;
