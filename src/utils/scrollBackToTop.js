export function scrollBackToTop(id){
    if(document.getElementById(id)){
        let div = document.getElementById(id);
        let timer = setInterval(function(){
            let scrollTop = div.scrollTop;
            let ispeed = Math.floor( -scrollTop / 6 );
            if(scrollTop == 0){
                clearInterval(timer);
            }
            div.scrollTop = scrollTop + ispeed;
        },30);
    }
}
