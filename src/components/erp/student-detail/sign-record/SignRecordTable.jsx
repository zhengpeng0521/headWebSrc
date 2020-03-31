import React from 'react';
import { Button ,Table , Icon, Rate, } from 'antd';
import moment from 'moment';
import { Popconfirm } from 'antd';
import styles from './SignRecordTable.less';

function SignRecordTable({
    signRecordSignTypeList,

    signRecordOrg,
    signRecordClass,
    signRecordSignType,
    signRecordPageSize,
    signRecordPageIndex,
    signRecordDataSource,
    signRecordLoading,
    signRecordResultCount,

    signRecordPageIndexChange,
    signRecordPageSizeChange,

    deleteSignRecord,

    clickToDetail,

}){
    signRecordDataSource && signRecordDataSource.map(function(item, index){
        item.key = index;
    });
    let columns = [
        {
            dataIndex : 'operation',
            key       : 'operation',
            title     : '操作',
            width     : 90,
            render    : ( text, record) => {
                let createTime = record.createTime;
                let flg = false;
                if(createTime && createTime!= '') {
                    flg = moment(createTime, 'YYYY-MM-DD').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD');
                }
                return (
                    <div>
                        <a disabled = { !record.cpId || !record.orgId || !flg} onClick = { () => clickToDetail( record.cpId, record.orgId ) } className={styles.table_cell_href_item}  >修改</a>
                        {!!(record.status == '1') &&
                        <Popconfirm placement = "top" title = { '确定要撤销吗?' } onConfirm={ () => deleteSignRecord( record.id ) } okText = "确定" cancelText = "取消" >
                            <a style = {{ marginLeft : '10px' }} disabled={!flg} className={styles.table_cell_href_item} >撤销</a>
                        </Popconfirm>
                        }
                        {!!(record.status == '0') && <a style={{color: '#999', marginLeft : '10px'}}>已撤销</a>}
                    </div>
                )}
        },{
            dataIndex : 'createTime',
            key       : 'createTime',
            title     : '签到时间',
            width     : 130,
        },{
            dataIndex : 'type',
            key       : 'type',
            title     : '签到类型',
            width     : 80,
            render    : ( text, record ) => (
                <span>
                    { text && text == '1' ? '上课' :  text == '2' ? '请假' : text == '3' ? '补课' : text == '4' ? '旷课' : text == '5' ? '试听' : text == '6' ? '缺席' : null }
                </span>
            )
        },{
            dataIndex : 'cost',
            key       : 'cost',
            title     : '课时',
            width     : 80,
        },{
            dataIndex : 'csName',
            key       : 'csName',
            title     : '班级',
            width     : 120,
        },{
            dataIndex : 'effect',
            key       : 'effect',
            title     : '星级',
            width     : 130,
            render: function(text, record) {
                return (
                    <Rate value={text||0} disabled />
                );
            }
        },{
            dataIndex : 'cpContent',
            key       : 'cpContent',
            title     : '上课内容',
            width     : 150,
        },{
            dataIndex : 'homework',
            key       : 'homework',
            title     : '课后作业',
            width     : 130,
        },{
            dataIndex : 'remark',
            key       : 'remark',
            title     : '备注',
            width     : 100,
        },
    ];

    let pagination = {
        total             : signRecordResultCount,
        showTotal         : total => `总共 ${total} 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : signRecordPageIndexChange,
        onShowSizeChange  : signRecordPageSizeChange,
        size              : 'large'
    };

	return (
        <div className = 'yhwu_table_bg' >
            <Table size = { 'middle' } columns = {columns } dataSource = { signRecordDataSource } pagination = { pagination } loading = { signRecordLoading } scroll = {{ x : 1000 }} bordered/>
        </div>
	)
};

export default SignRecordTable;
