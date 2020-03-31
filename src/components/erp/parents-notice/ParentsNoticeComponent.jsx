import React from 'react';
import styles from './ParentsNoticeComponent.less';
import {Modal, Button,} from 'antd';
import ManagerListMgr from '../../common/manager-list/ManagerListMgr';
import ParentsNoticeFormPage from '../../../pages/erp/parents-notice/ParentsNoticeFormPage';

function ParentsNoticeComponent ({
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
        employComList,
        onFilterClick,
    },
    onBatchDelete,
    onCreateClick,
    statusActive,
    onStatusTabChange,

    showReadInfo,closeReadInfo,
    readInfoVisible,
    readInfoList,

    onEditClick,
}) {

    let targetListOptions = [];
    employComList && employComList.length > 0 && employComList.map(function(item) {
        targetListOptions.push({
            key: item.userId,
            label: item.userName,
        });
    });

    let managerListProps = {
        search: {
            searchAble: true,
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
            fields: [
                {
                    key: 'id',
                    type: 'text',
                    label: '通知编号:',
                    placeholder: '请输入通知编号',
                    width: '120px',
                },
                {
                    key: 'title',
                    type: 'text',
                    label: '通知标题:',
                    placeholder: '请输入通知标题',
                    width: '120px',
                },
                {
                    key: 'user',
                    type: 'select',
                    label: '发送人',
                    width: '120px',
                    placeholder: '请选择发送人',
                    options: targetListOptions,
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
                    title: '通知标题/编号',
                    dataIndex: 'id',
                    width: 150,
                    render: function(text, record, index) {
                        return (
                            <div className={styles.table_cell_cont}>
                                <div className={styles.table_cell_item_notice_title} onClick={()=>onEditClick(record.id)}>{record.title}</div>
                                <div className={styles.table_cell_item}>{record.id}</div>
                            </div>
                        );
                    },
                },
                {
                    key: 'stuAll',
                    title: '发送对象及阅读情况',
                    dataIndex: 'stuAll',
                    width: 200,
                    render: function(text, record, index) {
                        return (
                            <div className={styles.table_cell_target_info} onClick={()=>showReadInfo(record.id)}>{text + '学员'}</div>
                        );
                    },
                },
                {
                    key: 'stuRead',
                    title: '阅读率',
                    dataIndex: 'stuRead',
                    width: 100,
                    render: function(text, record, index) {
                        let targetReadNum = record.stuRead || 0;
                        let targetSumNum = record.stuAll || 0;
                        let percent = 0;
                        if(targetSumNum != 0) {
                            percent = targetReadNum / targetSumNum * 100;
                        }
                        return (
                            <div className={styles.table_cell_item}>{Math.round(percent*100)/100 + '%'}</div>
                        );
                    },
                },
                {
                    key: 'sendUser',
                    title: '发送人',
                    dataIndex: 'sendUser',
                    width: 150,
                },
                {
                    key: 'satus',
                    title: '状态',
                    dataIndex: 'status',
                    width: 120,
                    render: function(text, record, index) {
                        let renderText = text == '0' ? '未发送' :
                                         text == '1' ? '已发送' : '未知状态';
                        return (
                            <div className={styles.table_cell_item}>{renderText}</div>
                        );
                    },
                },
                {
                    key: 'sendTime',
                    title: '发送时间',
                    dataIndex: 'sendTime',
                    width: 120,
                },
            ],
            dataSource,
            emptyText: '没有通知记录',
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys,
                onChange: onRowSelectChange,
            },
            pagination: {
                total,
                pageIndex,
                pageSize,
                onShowSizeChange,
                onChange: pageChange,
            }
        },
        leftBars: {
            label: '批量操作:',
            btns: [
                {
                    type: 'text',
                    label: '删除',
                    handle: onBatchDelete,
                    confirm: true,
                }
            ],
        },
        rightBars: {
            label: '',
            btns: [
                {
                    type: 'btn',
                    label: '新增通知',
                    icon: '',
                    handle: onCreateClick,
                },
            ]
        },
    };

    return (
        <div className={styles.parent_notice_cont} >
            <ManagerListMgr {...managerListProps} />
            <NoticeReadInfo readInfoVisible={readInfoVisible} readInfoList={readInfoList} closeReadInfo={closeReadInfo}/>
            <ParentsNoticeFormPage />
        </div>
    );
}

function NoticeReadInfo ({readInfoVisible, readInfoList, closeReadInfo}) {

    let allNum = 0;
    let noreadNum = 0;
    if(readInfoList && readInfoList.length > 0) {
        allNum = readInfoList.length;
        readInfoList.map(function(readInfoItem) {
            let status = readInfoItem.status || '0';
            if(status == '0') {
                //未读的通知
                noreadNum++;
            }
        });
    }

    return (
        <Modal
            title={null}
            visible={readInfoVisible}
            maskClosable={false}
            closable={false}
            onCancel={closeReadInfo}
            width={250}
            className={styles.parents_notice_read_info_modal}
            footer={null}
        >
           <div className={styles.parents_notice_read_info_cont}>
               <div className={styles.parents_notice_read_info_header}>
                   {(allNum-noreadNum) + '学员'}<span style={{color: 'green'}}>已读</span>,{noreadNum + '学员'}<span style={{color: 'red'}}>未读</span>
               </div>
               <div className={styles.parents_notice_read_info_content}>
                {readInfoList && readInfoList.map(function(item, index) {
                    return (
                        <div className={styles.parents_notice_read_info_item} key={'parents_notice_read_info_item_' + index}>
                            <div className={styles.read_info_nickname}>{item.stuName}</div>
                            {!!(item.status == '0') && <div key="read_info_status_noread" className={styles.read_info_status_noread}>未读</div>}
                            {!!(item.status == '1') && <div key="read_info_status_read" className={styles.read_info_status_read}>已读</div>}
                        </div>
                    );
                })}
                </div>
                <div className={styles.parents_notice_read_info_foot}>
                    <Button type="ghost" onClick={closeReadInfo}>我知道了</Button>
                </div>
           </div>

        </Modal>
    );
}

export default ParentsNoticeComponent;
