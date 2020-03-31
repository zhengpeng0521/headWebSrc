import React from 'react';
import { Button,Pagination } from 'antd';
import style from './CommunicationRecord.less';
import CommunicationRecordCreate from './CommunicationRecordCreate';

function CommunicationRecord({
    communicationRecordVisible,
    communicationRecords,
    communicationContent,

    addCommunicationRecord,
    editCommunicateRecord,
    deleteCommunicateRecord,
    confirmAddCommunicationRecord,
    cancelAddCommunicationRecord,

    CommunicationRecordPageIndexChange,
    CommunicationRecordPageSizeChange,

}){

    let communicationRecordsComponent = [];
    communicationRecords && communicationRecords.length > 0 && communicationRecords.map(function(item,index){
        communicationRecordsComponent.push(
            <div key = { 'communicationRecords_' + index } className = { style.sign_record_item }>
                <div className = { style.sign_record_item_head } >
                    <p className = { style.sign_record_item_head_left }>
                        <span className = { style.sign_record_item_head_label } >记录人 : </span>
                        { item.uname }
                    </p>
                    <p className = { style.sign_record_item_head_right }>
                        <span className = { style.sign_record_item_head_label } >记录时间 : </span>
                        { item.createTime }
                    </p>
                </div>
                <div className = { style.sign_record_item_content } >
                    <span className = { style.sign_record_item_head_label } >沟通记录 : </span>
                    { item.content }
                </div>
                <div className = { style.sign_record_item_btn }>
                    <a onClick = { () => editCommunicateRecord( item.id , item.content ) } >编辑</a>
                    <a onClick = { () => deleteCommunicateRecord( item.id ) } style = {{ marginLeft : '10px' }} >删除</a>
                </div>
            </div>
        )
    });

    //分页属性
    let paginationProps = {
        total             : communicationRecords.length,
        showTotal         : total => `总共 ${total} 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : CommunicationRecordPageIndexChange,
        onShowSizeChange  : CommunicationRecordPageSizeChange,

    };

    //新增记录
    let communicationRecordCreateProps = {
        communicationRecordVisible,
        communicationContent,

        confirmAddCommunicationRecord,
        cancelAddCommunicationRecord,
    };

	return (
        <div className = "yhwu_table_bg" style = {{ width : '550px', marginBottom : '48px' }} >
            <div className = { style.sign_record_add_btn } >
                <Button type = 'primary' onClick = { addCommunicationRecord } >新增记录</Button>
            </div>
            { communicationRecordsComponent }
            <CommunicationRecordCreate { ...communicationRecordCreateProps } />
            <Pagination style = {{ position : 'absolute', bottom : '-48px', right : '0' }} { ...paginationProps } />
        </div>
	)
};

export default CommunicationRecord;
