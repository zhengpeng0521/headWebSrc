import React, { PropTypes } from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Icon, Upload, Radio } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './ScrmOverViewGetFreeTrailModal.less';

const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 18,
    },
};


/*免费申请试用招生方案modal*/
const ScrmOverViewGetFreeTrailModal = ({
    freeTrailModalVisible,                  //免费申请试用招生方案modal是否显示
    hotMethodMessage,                       //热门招生申请成功或者失败后信息提示
    ScrmOverViewGetFreeTrailModalCancel,    //免费申请试用招生方案modal是否关闭
    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {


    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        ScrmOverViewGetFreeTrailModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '免费申请试用招生方案',
        maskClosable : false,
        visible : freeTrailModalVisible,
        closable : true,
        width : 550,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="primary" onClick={handleCancel}>我知道了</Button>,
        ],
        className : 'zj_scrm_overview_getfreetrail_modal'
    };


    return (
        <div>
            <Modal {...modalOpts}>
                <div style={{textAlign:'center',fontSize:'14px'}}>{hotMethodMessage}</div>
            </Modal>
        </div>
    );
};

export default Form.create()(ScrmOverViewGetFreeTrailModal);
