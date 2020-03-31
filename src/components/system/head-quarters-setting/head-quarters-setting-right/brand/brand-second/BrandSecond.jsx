import React from 'react';
import { Popover } from 'antd';
import styles from './BrandSecond.less';
import render from '../BrandItem.json';

function BrandSecond({
    brandData,                      //品牌审核和成功后的回显品牌信息
}){
    return(
        <div className = { styles.all }>
            { render && render.map((item,index) =>
               <div key = { index } className = { styles.item }>
                    { `${item.label}：` }
                    <Popover placement = 'top' content = { brandData[item.key] || '--' } trigger = 'hover'>
                        { brandData[item.key] || '--' }
                    </Popover>
               </div>
            ) }
        </div>
    )
}

export default BrandSecond;
