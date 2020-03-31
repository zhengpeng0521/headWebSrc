import React from 'react';
import { Button , Popover } from 'antd';
import styles from '../../../components/crm/leads-follow/leads-follow-table/LeadsFollowDetailInner/Detail.less';

/*详细信息*/
function Detail({
    modalAllDetailContent,          //选中员工查看详情时员工的信息
}){
    //需要从员工详情中筛选并渲染的内容
    let expect = [{label : '课程名称', value : 'name'},
               {label : '大致方位', value : 'intro'},
               {label : '所属校区', value : 'orgName'}];

    //详情信息渲染
    function detailRender(expect,target){
        let arr = [];
        for(let i in expect){
            arr.push(
                <p key = { i }>
                    <span style = {{ color : '#999' }}>{ expect[i].label }：</span>
                    <Popover placement="topLeft" content={ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' } trigger="hover">
                        <span style = {{ color : '#666' }}>{ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }</span>
                    </Popover>
                </p>
            )
        }
        return arr;
    }

    let detail = detailRender(expect,modalAllDetailContent);

    return(
        <div className={styles.leads_detail_inner}>
            <div className={styles.leads_detail_inner_message}>
                { detail || [] }
            </div>
        </div>
    );
}

export default Detail;
