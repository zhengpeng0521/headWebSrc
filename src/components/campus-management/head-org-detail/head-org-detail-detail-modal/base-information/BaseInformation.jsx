import React from 'react';
import { Popover } from 'antd';
import expect from './BaseInformation.json';
import styles from './BaseInformation.less';

//基本信息
function BaseInformation({
    rightTableOrgType,      //校区类型
    data                    //基本信息数据
}){
    let tag = [];
    for(let i = 0 ; i < 10 ; i++){
        tag.push(
            <span key = { i }>
                { i }
            </span>
        )
    }

    //取出渲染项中最长的lable长度
    let labelLen = 0;
    expect && expect.map((item,index) => {
        if(index > 0 && item.label.length > expect[index - 1].label.length){ labelLen = item.label.length }
    })
    let fontSize = 12;
    let renderStyle = {
        fontSize,
        width : (labelLen + 1)*fontSize,        //加了一个冒号
        minWidth : (labelLen + 1)*fontSize,     //加了一个冒号
    }

    //详情信息渲染
    function detailRender(expect,target){
        let arr = [];
        for(let i in expect){
            if(expect[i].value == 'categoryTag' || expect[i].value == 'utilityTag'){
                arr.push(
                    <div key = { i } className = { !!target[expect[i].value] && target[expect[i].value].length > 0 ? styles.render_item_special : styles.render_item }>
                        <div className = { styles.render_item_label } style = { renderStyle }>{ expect[i].label }：</div>
                        <div style = {{ marginTop : -3 }}>
                            { target[expect[i].value] && target[expect[i].value].map((item,index) => (
                                <div key = { index + '' } className = { styles.render_item_tag }>{ item }</div>
                            ))}
                        </div>
                    </div>
                )
            }else if(expect[i].value == 'addr'){
                let render_content = !target.province && !target.city && !target.area && !target.addr ? '--' : ((target.province || '') + (target.city || '') + (target.area || '') + (target.addr || ''));
                arr.push(
                    <div key = { i } className = { styles.render_item }>
                        <div className = { styles.render_item_label } style = { renderStyle }>{ expect[i].label }：</div>
                        <Popover placement="topLeft" content={ render_content } trigger="hover">
                            <div className = { styles.render_item_value }>{ render_content }</div>
                        </Popover>
                    </div>
                )
            }else if(expect[i].value == 'orgType'){
                let index = 'no_one';
                for(let j = 0 , len = rightTableOrgType.length ; j < len ; j++){
                    if(rightTableOrgType[j].id == target[expect[i].value]){
                        index = j;
                        break;
                    }
                }
                arr.push(
                    <div key = { i } className = { styles.render_item }>
                        <div className = { styles.render_item_label } style = { renderStyle }>{ expect[i].label }：</div>
                        <Popover placement = 'topLeft' content = { index != 'no_one' ? rightTableOrgType[index].name : '--' }>
                            <div className = { styles.render_item_value }>{ index != 'no_one' ? rightTableOrgType[index].name : '--' }</div>
                        </Popover>
                    </div>
                )
            }else{
                arr.push(
                    <div key = { i } className = { styles.render_item }>
                        <div className = { styles.render_item_label } style = { renderStyle }>{ expect[i].label }：</div>
                        <Popover placement="topLeft" content={ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' } trigger="hover">
                            <div className = { styles.render_item_value }>{ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }</div>
                        </Popover>
                    </div>
                )
            }
        }
        return arr;
    }

    let detail = detailRender(expect,data);     //渲染详情

    return(
        <div className = { styles.all }>
            { detail }
        </div>
    )
}

export default BaseInformation;
