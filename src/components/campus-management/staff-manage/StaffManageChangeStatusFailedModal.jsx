import React from 'react';
import { Modal, Button, Table } from 'antd';
import styles from './StaffManageChangeStatusFailedModal.less';

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};

/*员工修改状态失败的员工会显示在此表单中*/
const StaffManageChangeStatusFailedModal = ({
    addOrEditStaffModalType,                        //新增编辑员工表单类型('add'/'edit'/'modifyFunction')
    changeStatusOperateAllStaffNum,                    //总共有多少个员工被改变了状态
    changeStatusFailedModalVisible,

    //员工需要交接任务列表
    staffManageChangeStatusPageIndex,               //页码
    staffManageChangeStatusPageSize,                //每页条数
    changeStatusOperateFailStaffNum,              //列表总数
    staffManageChangeStatusTableContent,            //列表内容

    StaffManageChangeStatusTableOnChange,           //列表分也等信息改变

    StaffManageChangeStatusFailedModalCancel,       //关闭modal
  }) => {

    function handleCancel(e) {
        StaffManageChangeStatusFailedModalCancel();
    }

    const columns = [{
        width: 70,
        title: '员工编号',
        dataIndex: 'uid',
        key: 'uid',
    }, {
        width: 70,
        title: '员工姓名',
        dataIndex: 'userName',
        key: 'userName',
    }, {
        width: 70,
        title: '学员数',
        dataIndex: 'stuNum',
        key: 'stuNum',
    }, {
        width: 70,
        title: '班级数',
        dataIndex: 'classNum',
        key: 'classNum',
    }, {
        width: 70,
        title: '排课数',
        dataIndex: 'coursePlanNum',
        key: 'coursePlanNum',
    }]

    //模态框的属性
    let modalOpts = {
        title: '工作提醒',
        maskClosable : false,
        visible : changeStatusFailedModalVisible,
        closable : true,
        width :600,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="primary" onClick = { handleCancel }>我知道了</Button>,
        ],
        className : 'zj_staff_change_status_fail_modal'
    };

    let paginationProps = {
        size : 'large',
        total: changeStatusOperateFailStaffNum,
        current : staffManageChangeStatusPageIndex + 1,
        pageSize : staffManageChangeStatusPageSize,
        showQuickJumper :true,
        showTotal(){
            return '共失败'+this.total+'条';
        }
    };

    return (
        <Modal {...modalOpts}>
            { addOrEditStaffModalType != 'modifyFunction' ?
                <div className = { styles.title }>
                    <span style={{color:'#5d9cec'}}>共操作（{changeStatusOperateAllStaffNum}），</span>
                    <span style={{color:'#69b439'}}>成功（{changeStatusOperateAllStaffNum - changeStatusOperateFailStaffNum}），</span>
                    <span style={{color:'#ff4f3e'}}>失败（{changeStatusOperateFailStaffNum}）</span>
                </div>
                :
                null
            }
            <div className = { styles.reason }>
                <div style={{display:'inline-block',marginRight:'20px'}}><span style={{color:'#ff4f3e'}}>失败理由</span>：学员/班级/排课&nbsp;存在未交接</div>
                <div style={{display:'inline-block'}}><span style={{color:'#69b439'}}>建议</span>：请联系<span style={{fontWeight:'900'}}>系统管理员</span>协助完成交接</div>
            </div>
            <Table
                columns={columns}
                dataSource={staffManageChangeStatusTableContent}
                pagination={addOrEditStaffModalType != 'modifyFunction' ? paginationProps : false}
                onChange={StaffManageChangeStatusTableOnChange}
                bordered
                rowKey="id"
                size='small'
                scroll={{ x : 200 }} />
        </Modal>
    );
};

export default StaffManageChangeStatusFailedModal;
