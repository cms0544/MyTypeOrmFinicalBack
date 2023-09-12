export function convertJsonArrToArr(arr){
    let newarr = [];
    console.log(arr)
    console.log("test")
    arr.map((item)=>{
        for(let attr in item){
            newarr.push(item[attr])
        }
    })

    return newarr;
}