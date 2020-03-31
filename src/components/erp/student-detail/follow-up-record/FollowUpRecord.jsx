import React from 'react';
import { Button, Pagination, Popconfirm, Icon } from 'antd';
import style from './FollowUpRecord.less';

function FollowUpRecord({
    followUpRecords,
    followUpRecordResultCount,
    followUpRecordPageIndex,
    followUpRecordPageSize,

    addFollowUpRecord,
    editFollowUpRecord,
    deleteFollowUpRecord,
    FollowUpRecordPageIndexChange,
    FollowUpRecordPageSizeChange,

    permissionUids,
}){

    let followUpRecordComponents = [];
    followUpRecords && followUpRecords.map(function(item, index){
        let isPermiss = false;
        if(permissionUids && permissionUids.length > 0) {
            isPermiss = permissionUids.findIndex(function(x) {
                return x == item.uid;
            }) > -1;
        }
        followUpRecordComponents.push(
            <div key = { 'followUpRecord_' + index } className = { style.sign_record_item }>
                <div className = { style.sign_record_item_head } >
                    <p className = { style.sign_record_item_head_left }>
                        <span className = { style.sign_record_item_head_label } >跟进人 : </span>
                        { item.uname }
                    </p>
                    <p className = { style.sign_record_item_head_right }>
                        <span className = { style.sign_record_item_head_label } >跟进时间 : </span>
                        { item.createTime }
                    </p>
                </div>
                <div className = { style.sign_record_item_head } >
                    <p className = { style.sign_record_item_head_left }>
                        <span className = { style.sign_record_item_head_label } >关联家长 : </span>
                        { item.parentName }
                    </p>
                    <p className = { style.sign_record_item_head_right }>
                        <span className = { style.sign_record_item_head_label } >跟进方式 : </span>
                        { item.type }
                    </p>
                </div>
                <div className = { style.sign_record_item_content } >
                    <span className = { style.sign_record_item_head_label } >跟进记录 : </span>
                    { item.content }
                </div>
                {!!isPermiss &&
                <div className = { style.sign_record_item_btn }>
                    <a onClick = { () => editFollowUpRecord( item.id ) } >编辑</a>
                    <Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => deleteFollowUpRecord( item.id ) } >
                        <a style = {{ marginLeft : '10px' }} >删除</a>
					</Popconfirm>
                </div>
                }
            </div>
        )
    });

    //分页属性
    let paginationProps = {
        total             : followUpRecordResultCount,
        showTotal         : total => `总共 ${total} 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : FollowUpRecordPageIndexChange,
        onShowSizeChange  : FollowUpRecordPageSizeChange,

    };

	return (
        <div className = "yhwu_table_bg" style = {{ width : '550px', marginBottom : '48px' }} >
            <div className = { style.sign_record_add_btn } >
                <Button type = 'primary' onClick = { addFollowUpRecord } >
                    <Icon type = "plus" />新增记录
                </Button>
            </div>
            { followUpRecordComponents }
            <Pagination style = {{ position : 'absolute', bottom : '-48px', right : '0' }} { ...paginationProps } />
        </div>
	)
};

export default FollowUpRecord;
