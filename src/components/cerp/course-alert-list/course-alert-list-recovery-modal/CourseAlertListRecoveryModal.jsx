import React from 'react';
import QueueAnim from 'rc-queue-anim';
import ManagerList from '../../../common/new-component/manager-list/ManagerList';
import { NullData } from '../../../common/new-component/NewComponent';
import styles from './CourseAlertListRecoveryModal.less';
import { Button , Modal , Popover , Table , Spin } from 'antd';

//恢复提醒modal
function CourseAlertListRecoveryModal({
    //恢复提醒modal
    recoveryModalVisible,                   //modal是否显示
    recoveryModalLoading,                   //modal加载状态
    recoveryModalButtonLoading,             //modal中按钮加载状态

    RecoveryModalSubmit,                    //modal点击恢复提醒
    RecoveryModalClose,                     //关闭modal
    //恢复提醒modal中的table
    recoveryModalTableDataSource,           //modal中table数据
    recoveryModalTableDataTotal,            //列表数据条数
    recoveryModalTablePageIndex,            //列表页码
    recoveryModalTablePageSize,             //列表每页条数
    recoveryModalTableSelectedRowKeys,      //复选框选中项的key数组
    recoveryModalTableSelectedRows,         //复选卡U那个选中项数组

    RecoveryModalTablePageOnChange,         //列表分页改变
    RecoveryModalTableRowSelection,         //复选框onChange事件
}){
    let columns = [{
            title : '会员卡号',
            key : 'cardId',
            dataIndex : 'cardId',
            width : 115,
            render : (text,record) => (
                <Popover placement="top" content={ text } trigger="hover">
                    { text }
                </Popover>
            )
        }, {
            title : '适用学员',
            key : 'stuName',
            dataIndex : 'stuName',
            width : 115,
            render : (text,record) => (
                <Popover placement="top" content={ text } trigger="hover">
                    { text }
                </Popover>
            )
        }, {
            title : '剩余课时',
            key : 'periodLeft',
            dataIndex : 'periodLeft',
            width : 115,
            render : (text,record) => (
                <Popover placement="top" content={ text } trigger="hover">
                    { text }
                </Popover>
            )
        }, {
            title : '余额',
            key : 'balance',
            dataIndex : 'balance',
            width : 115,
            render : (text,record) => (
                <Popover placement="top" content={ text } trigger="hover">
                    { text }
                </Popover>
            )
        }]

    //模态框的属性
    let modalOpts = {
        title: '恢复提醒',
        maskClosable : false,
        visible : recoveryModalVisible,
        closable : true,
        width : 550,
        onOk: RecoveryModalSubmit,
        onCancel : RecoveryModalClose,
        footer : [
            <Button key="cancel" type="ghost" onClick={ RecoveryModalClose }>关闭</Button>,
            <Button key="submit" type="primary"
                    onClick={ RecoveryModalSubmit }
                    disabled={ recoveryModalButtonLoading }
                    loading={ recoveryModalButtonLoading }
                    style={{ marginLeft:10 }}>恢复提醒</Button>
        ],
        className : 'course_alert_recovery_modal'
    };

    let rowSelection = {
        selectedRowKeys : recoveryModalTableSelectedRowKeys,
        onChange : RecoveryModalTableRowSelection,
	};

    let paginationProps = {
        size : 'large',
        total: recoveryModalTableDataTotal,
        current : recoveryModalTablePageIndex+1,
        pageSize : recoveryModalTablePageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal(){
            return '共'+this.total+'条';
        }
    };


	return (
        <Modal {...modalOpts}>
            <div className={styles.table}>
                <Table
                    columns = { columns }
                    dataSource = { recoveryModalTableDataSource }
                    loading = { recoveryModalLoading }
                    pagination = { paginationProps }
                    rowSelection = { rowSelection }
                    onChange = { RecoveryModalTablePageOnChange }
                    bordered
                    locale = {{ emptyText : <NullData height = '300px' content = '暂无恢复提醒项'/> }}
                    scroll = {{ y : 400 }}
                    rowKey = "cardId"
                    size = 'middle'/>
            </div>
        </Modal>
	)
}

export default CourseAlertListRecoveryModal;
