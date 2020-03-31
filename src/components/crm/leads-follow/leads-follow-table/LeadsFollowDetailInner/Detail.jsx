import React from 'react';
import { Button , Popover } from 'antd';
import styles from './Detail.less';
import expect from './Detail.json';         //需要从员工详情中筛选并渲染的内容


/*详细信息*/
function Detail({
    leadsFollowDetailLeadMessage,           //选中leads名单查看详情时当前人的信息
}){
    let IntroHeight = 0;        //定义详情介绍高度(不固定)
    let allHeight = 0;          //定义需要减去的总高度

    //详情信息渲染
    function detailRender(expect,target){
        let arr = [];
        for(let i in expect){
            if(expect[i].value == 'parentMobile'){
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <Popover placement="top" content={ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '暂无' } trigger="click">
                            <a>查看</a>
                        </Popover>
                    </p>
                )
            }else{
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <Popover placement="topLeft" content={ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' } trigger="hover">
                            <span>{ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }</span>
                        </Popover>
                    </p>
                )
            }
        }
        return arr;
    }

    let detail = detailRender(expect,leadsFollowDetailLeadMessage);     //渲染详情

    //高度计算
    if(document.getElementById('leads_detail_message')){
        IntroHeight = document.getElementById('leads_detail_message').clientHeight;
    }

    //最上面菜单的高度+信息的高度+tab的高度
    allHeight = 70 + IntroHeight + 47;

    return(
        <div className={styles.leads_detail_inner} style={{height:`calc(100vh - ${allHeight}px)`}}>
            <div className={styles.leads_detail_inner_img}>
                <img src={
                        !!leadsFollowDetailLeadMessage && !!leadsFollowDetailLeadMessage.headimgurl ?
                            leadsFollowDetailLeadMessage.headimgurl :
                        !!leadsFollowDetailLeadMessage && leadsFollowDetailLeadMessage.sex == '女' ?
                        'https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f' :
                        !!leadsFollowDetailLeadMessage && leadsFollowDetailLeadMessage.sex == '男' ?
                        'https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337' :
                        'https://img.ishanshan.com/gimg/img/6f1436b4c39b3afb25e5ac00509a5e64'
                    }
                    style = {{ width : 80 , height : 80 , borderRadius : '50%' }}/>
            </div>
            <div className={styles.leads_detail_inner_message}>
                { detail || [] }
            </div>
        </div>
    );
}

export default Detail;
