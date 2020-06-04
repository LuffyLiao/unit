
interface exchangeOut{
    region: string,
    section: string,
    metro: string,
    station: string,
    sort: string,
    floor: string,
    goodhouse:string,
    searchtype?:Number,
    mrt?:Number,
    others?:string
}

interface exchangeIn{
    regionid: string,
    sectionidStr: string,
    mrtstation: string,
    mrtcoods: string,
    o: string,
    newfloor: string,
    is_good_house: string,
}

 const mapToOut: exchangeOut = {
    region: 'regionid',
    section: 'sectionidStr',
    metro: 'mrtstation',
    station: 'mrtcoods',
    sort: 'o',
    floor: 'newfloor',
    goodhouse: 'is_good_house'
}

const mapToIn: exchangeIn = {
    regionid: 'region',
    sectionidStr: 'section',
    mrtstation: 'metro',
    mrtcoods: 'station',
    o: 'sort',
    newfloor: 'floor',
    is_good_house: 'goodhouse'
}

/**
 * adapter
 * 数据适配器，适配本地数据和接口数据
 * @params.data
 */
function adapter (data:exchangeOut, model = 'go out') {
    let returnData = model === 'go out' ? goout(data) : goin(data)

    return returnData
}

/**
 * @param {Object} data 需要轉換的數據
 */
function goout (data:exchangeOut) {
    let copy:any = Object.assign({}, data)

    // 转换[区域]参数名称
    for (let key in mapToOut) {
        if (copy[key]) {
            copy[(<any>mapToOut)[key]] = copy[key]
            delete copy[key]
        }
    }

    // [捷运]额外添加其他参数
    if (typeof data.metro !== 'undefined') {
        copy.searchtype = 4
        copy.mrt = 1
    }

    // 转换[其他]参数名称
    if (data.others) {
        data.others.split(',').forEach(name => {
            copy[name] = 1
        })

        delete copy.others
    }

    return copy
}

/**
 * @param {Object} data 需要轉換的數據
 * @param {boolean} isMulti 是否是多選，默認為true
 */
function goin (data:exchangeOut) {
    let copy:any = Object.assign({}, data)
    let toNumber = ['region', 'metro', 'kind', 'room', 'area', 'shape', 'floor', 'source', 'sex', 'sort', 'houseage']
    let others = ['parking', 'balcony_1', 'pet', 'cook', 'ex_top_floor']

    // 转换[区域]参数名称
    for (let key in mapToIn) {
        if (copy[key]) {
            copy[(<any>mapToIn)[key]] = copy[key]
            delete copy[key]
        }
    }

    // 转换数据类型
    toNumber.forEach(name => {
        if (copy[name] === 'null') {
            copy[name] = 0
        }
        if (typeof copy[name] !== 'undefined') {
            copy[name] = Number(copy[name])
        }
    })

    // 转换[其他]参数
    copy.others = []
    others.forEach(name => {
        if (copy[name]) {
            copy.others.push(name)
        }
    })

    copy.others.length
        ? (copy.others = copy.others.join(','))
        : delete copy.others

    return copy
}

function getSearch () {
    let search = decodeURIComponent(location.search)
    let searchObj:any = {}
    let temp

    if (search.length) {
        search.slice(1).split('&').forEach(function (subAry) {
            temp = subAry.split('=')
            searchObj[temp[0]] = temp[1]
        })
    }

    return searchObj
}

function LS (names:object) {
    let data:any = {}

    for (let name in names) {
        const lsName = localStorage.getItem((<any>names)[name])
        
        if(!lsName) return

        data[name] = (<any>names)[name] && JSON.parse(lsName)
        
        Object.defineProperty(this, name, {
            get: function () {
                return data[name]
            },
            set: function (val) {
                data[name] = val
                localStorage.setItem((<any>names)[name], JSON.stringify(val))
            }
        })
    }
}

export { adapter, getSearch, LS }