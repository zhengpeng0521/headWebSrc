/*
 * 获取sstoken
 */
export function getSsToken(){
    var oCookie = {};
    var aCookie = document.cookie.split(';');
    for( var i = 0; i < aCookie.length; i++ ){
        if(!!aCookie[i]){
            oCookie[aCookie[i].split('=')[0].trim()] = aCookie[i].split('=')[1].trim();
        }
    }
    return oCookie.sstoken;
}
