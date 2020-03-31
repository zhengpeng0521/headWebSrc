import React from 'react';
import styles from './SignRecordPageComponent.less';
import {Modal, Button,Rate,} from 'antd';
import moment from 'moment';
import ManagerListMgr from '../../common/manager-list/ManagerListMgr';
import ScheduleSignPage from '../../../pages/erp/stu-sign/ScheduleSignPage';

function SignRecordPageComponent ({
    table: {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        onRowSelectChange,
        onShowSizeChange,
        pageChange,
    },
    search: {
        showSearch,
        onSearch,
        onClear,
        onFilterClick,
        initQuery,
    },
    onBatchDelete,
    cancleSign,
    onEditClick,
    SignRecordTableItemPrint,
}) {

    let managerListProps = {
        search: {
            searchAble: true,
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
            fields: [
                {
                    key: 'organId',
                    type: 'orgSelect',
                    label: '校区:',
                    placeholder: '请选择校区',
                    width: '300px',
                },
                {
                    key: 'stuName',
                    type: 'text',
                    label: '学员姓名:',
                    placeholder: '请输入学员姓名',
                    width: '120px',
                },
                {
                    key: 'type',
                    type: 'select',
                    label: '签到类型:',
                    placeholder: '请选择签到类型',
                    initValue: initQuery ? initQuery.type : undefined,
                    width: '120px',
                    options: [
                        {key: '1',label: '上课'},
                        {key: '2',label: '请假'},
                        {key: '3',label: '补课'},
                        {key: '4',label: '旷课'},
                        {key: '5',label: '试听'},
                        {key: '6',label: '缺席'},
                    ]
                },
            ],
            initSearchValues: [],
        },
        table: {
            loading,
            rowKey: 'id',
            columns: [
                {
                    key: 'id',
                    title: '操作',
                    dataIndex: 'id',
                    width: 100,
                    render: function(text, record, index) {
                        let createTime = record.createTime;
                        let flg = false;
                        if(createTime && createTime!= '') {
                            flg = moment(createTime, 'YYYY-MM-DD').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD');
                        }
                        return (
                            <div>
                                <a disabled={!flg} className={styles.table_cell_href_item} onClick={()=>onEditClick(record.orgId, record.cpId)}>编辑</a>
                                {!!(record.status == '1') && <a disabled={!flg} className={styles.table_cell_href_item} onClick={()=>cancleSign(record.orgId, record.id)}>撤销</a>}
                                {!!(record.status == '0') && <div className={styles.table_cell_href_item} style={{color: '#999'}}>已撤销</div>}
                                { !!(record.status == '1') ? <a className={styles.table_cell_href_item} onClick={() => SignRecordTableItemPrint(record)}>打印</a> : null }
                            </div>
                        );
                    },
                },
                {
                    key: 'createTime',
                    title: '签到时间',
                    dataIndex: 'createTime',
                    width: 120,
                },
                {
                    key: 'orgName',
                    title: '所属校区',
                    dataIndex: 'orgName',
                    width: 180,
                },
                {
                    key: 'stuName',
                    title: '学员姓名',
                    dataIndex: 'stuName',
                    width: 120,
                },
                {
                    key: 'type',
                    title: '签到类型',
                    dataIndex: 'type',
                    width: 100,
                    render: function(text, record, index) {
                        return (
                            <div className={styles.table_cell_item}>
                                {text == '1' ? '上课' :
                                 text == '2' ? '请假' :
                                 text == '3' ? '补课' :
                                 text == '4' ? '旷课' :
                                 text == '5' ? '试听' :
                                 text == '6' ? '缺席' :
                                 '未知签到类型'}
                            </div>
                        );
                    },
                },
                {
                    key: 'cost',
                    title: '课时',
                    dataIndex: 'cost',
                    width: 80,
                },
                {
                    key: 'csName',
                    title: '班级',
                    dataIndex: 'csName',
                    width: 100,
                },
                {
                    key: 'effect',
                    title: '星级',
                    dataIndex: 'effect',
                    width: 120,
                    render: function(text, record) {
                        return (
                            <Rate value={text||0} disabled />
                        );
                    }
                },
                {
                    key: 'remark',
                    title: '备注',
                    dataIndex: 'remark',
                    width: 120,
                },
            ],
            dataSource,
            emptyText: '没有签到记录',
//            rowSelection: {
//                type: 'checkbox',
//                selectedRowKeys,
//                onChange: onRowSelectChange,
//            },
            pagination: {
                total,
                pageIndex,
                pageSize,
                onShowSizeChange,
                onChange: pageChange,
            }
        },
        leftBars: {
//            label: '操作:',
//            btns: [
//                {
//                    type: 'text',
//                    label: '撤销签到',
//                    handle: onBatchDelete,
//                    confirm: true,
//                }
//            ],
        },
        rightBars: {},
    };

    return (
        <div className={styles.sign_record_manage_cont} >
            <ManagerListMgr {...managerListProps} />
            <ScheduleSignPage />
        </div>
    );
}


export default SignRecordPageComponent;
