
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