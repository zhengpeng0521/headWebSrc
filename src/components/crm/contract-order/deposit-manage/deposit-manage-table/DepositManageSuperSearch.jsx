import React from 'react';
import { Popover } from 'antd';
import SuperSearch from '../../../../common/new-component/super-search/SuperSearch';

/*高级搜索*/
function DepositManageSuperSearch({
    paymentMethod,              //收款方式
    superSearchVisible,         //高级搜索是否显示
    SuperSearchClick,           //高级搜索点击搜索或者重置
    superSearchOnSearch,        //点击右上角的X
}){

    let fields = [
        { label : '收款方式' , key : 'paId' , type : 'select' , placeholder : '收款方式' , options : paymentMethod },
        { label : '收款人' , key : 'receiverName' , type : 'input' , placeholder : '收款人' },
        { label : '所属校区' , key : 'orgId' , type : 'orgSelect' , placeholder : '所属校区' , options : { getPopupContainer : () => document.getElementById( 'super_search_wrap' )}}
    ];

    return(
        <SuperSearch
            searchVisible = { superSearchVisible }
            onSearch = { (data) => SuperSearchClick(data) }
            onClear = { (data) => SuperSearchClick(data) }
            closeSearch = { superSearchOnSearch }
            fields = { fields }
            />
    );
}

export default DepositManageSuperSearch;
