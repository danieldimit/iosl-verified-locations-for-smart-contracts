var ConvertBase = function (num) {
    return {
        from : function (baseFrom) {
            return {
                to : function (baseTo) {
                    return parseInt(num, baseFrom).toString(baseTo);
                }
            };
        }
    };
};

var encodeS2Id = function (id) {
    prefix = ConvertBase(id.substring(0,3)).from(2).to(10);
    x = id.substring(3, id.length);

    for(var l = x.length - 1; l >= 0; l -= 1){
        if( x[l]  == "1" ){
            x = x.substring(0, l);
            break;
        }
    }

    var suffix = "";
    for(var k = 0; k < x.length - 1; k+=2){
        if( x[k] + x[k + 1] == "00"){
            suffix += "1";
        }
        if( x[k] + x[k + 1] == "01"){
            suffix += "2";
        }
        if( x[k] + x[k + 1] == "10"){
            suffix += "3";
        }
        if( x[k] + x[k + 1] == "11"){
            suffix += "4";
        }
    }
    return prefix + suffix;
};

function decodeS2Id(position) {

    position = position.toString();
    var prefix = position[0];
    prefix = ConvertBase(prefix).from(10).to(2);

    var pos = position.toString();
    lvl = pos.length - 1;
    var realPosition = "";
    for(var i = 1; i < pos.length; i++){
        if( pos[i] == "1"){
            realPosition += "00";
        }
        if( pos[i] == "2"){
            realPosition += "01";
        }
        if( pos[i] == "3"){
            realPosition += "10";
        }
        if( pos[i] == "4"){
            realPosition += "11";
        }
    }
    realPosition = prefix + realPosition + "10";
    for(var i = lvl+2; i <=30; i++)
        realPosition += "00";

    return ConvertBase(realPosition).from(2).to(10) ;
}
a = 5163462835887407104;
s = encodeS2Id(ConvertBase(5163462835887407104).from(10).to(2));

console.log(ConvertBase(a).from(10).to(2));
console.log(decodeS2Id(4243331221242444));