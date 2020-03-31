import React from 'react';
import { Button ,Table , Icon } from 'antd';
import style from './ParentInfoTable.less';

function ParentInfoTable({
    parentInfoDataSource,
    parentInfoLoading,

    addParent,
}){
    parentInfoDataSource && parentInfoDataSource.map(function(item, index){
        item.key = index;
    });

    let columns = [
        {
            dataIndex : 'name',
            key       : 'name',
            title     : '家长姓名',
            width     : '160px'
        },{
            dataIndex : 'relation',
            key       : 'relation',
            title     : '家长关系',
            width     : '100px',
        },{
            dataIndex : 'mobile',
            key       : 'mobile',
            title     : '联系电话',
            width     : '150px'
        },{
            dataIndex : 'attention',
            key       : 'attention',
            title     : '微信',
            width     : '100px',
            render    : (text, record) => (
                <div>
                    <Icon type="guanzhuweixin" className={ record.attention == '1' ? style.yiguanzhu : style.noguanzhu } />
                </div>
            )
        },{
            dataIndex : 'email',
            key       : 'email',
            title     : '邮箱',
            width     : '220px'
        }
    ];

	return (
        <div className = 'yhwu_table_bg' >
            <div style = {{ textAlign : 'right', marginBottom : '10px' }}>

            </div>
            <Table columns = {columns } dataSource = { parentInfoDataSource } bordered scroll = {{ x: 750 }} loading = { parentInfoLoading } />
        </div>
	)
};

export default ParentInfoTable;
