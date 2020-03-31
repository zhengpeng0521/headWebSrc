import React from 'react';
import { Modal, Button, } from 'antd';
import styles from './ContractOrderReceiptListCheckModel.less';

const ContractOrderReceiptListCheckModel = ({
    ContractReceiptCheckVisible,
    ContractReceiptCheckCancel, //暂不处理
    ContractReceiptCheckInvalid, //作废
    ContractReceiptCheckSure, //确认到账
    selectedRows,
  }) => {



    //模态框的属性
    let modalOpts = {
        title: '到账审核',
        maskClosable : false,
        visible : ContractReceiptCheckVisible,
        closable : true,
        onOk: ContractReceiptCheckSure,
        onCancel : ContractReceiptCheckCancel,
        footer : [
            <Button key="submit" type="primary" size="default"
                    onClick={ ContractReceiptCheckSure } style={{marginLeft:'20px'}} >确认到账</Button>,
            <Button key="abolition" type="primary" size="default" className = 'abolition_btn'
                    onClick={ ContractReceiptCheckInvalid } style={{marginLeft:'10px'}} >作废</Button>,
            <Button key="cancel" type="ghost" size="default" onClick={ ContractReceiptCheckCancel }>暂不处理</Button>,

        ],
        className :'wyp_ContractReceiptCheck'
      };

    let length = 0;
    if(selectedRows){
        length = selectedRows && selectedRows.length;
    }else{
        length = 0;
    }

    return (
        <Modal {...modalOpts}>
            <div>已选择{length}条收款单，操作后无法更改</div>
        </Modal>
    );
};

export default ContractOrderReceiptListCheckModel;
