import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Pagination } from 'antd';

import { Button , Modal , Form , Input , Select , Icon , Radio ,Row, Col ,message} from 'antd';
import moment from 'moment';
import style from './SaleStatusrecordModal.less';

let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;

function StudentManageTranslateModal({
    showsaleStatusecord,

    confirmsaleStatusrecordModal,
    cancelsaleStatusrecordModal,
    saleStatusrecordarr,
    saleStatusrecordarrCount ,
    saleStatusrecordarrselctstuId ,
    Modalpageion,
    pageIndex,

    form : {
        getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
    }
}){


    //确认转移
    function confirmTranslateAction(){
        validateFieldsAndScroll((err, values) => {
            if ( !!err ){
                return;
            }
            confirmsaleStatusrecordModal(values);
            cancelTranslateAction();
        });
    };

    //取消转移
    function cancelTranslateAction(){
        resetFields();
        cancelsaleStatusrecordModal();
    };
    function onChange(page, pageSize) {


        let  params  = {pageSize:pageSize, pageIndex:page-1,stuId:saleStatusrecordarrselctstuId};


        Modalpageion( params)

        
    }

    let array = [];
    array = saleStatusrecordarr && saleStatusrecordarr.map((item,index) => {
        return(
            <div key = {index} className = { style.sign_record_item }>
                <div className = { style.sign_record_item_head } >
                    <p className = { style.sign_record_item_head_left }>
                        <span className = { style.sign_record_item_head_label } >跟进人 : </span>
                        { item.uname}
                    </p>
                    <p className = { style.sign_record_item_head_right }>
                        <span className = { style.sign_record_item_head_label } >跟进时间 : </span>
                        { item.createTime }
                    </p>
                </div>
                <div className = { style.sign_record_item_head } >
                    <p className = { style.sign_record_item_head_left }>
                        <span className = { style.sign_record_item_head_label } >关联家长 : </span>
                        { item.parentName}
                    </p>
                    <p className = { style.sign_record_item_head_right }>
                        <span className = { style.sign_record_item_head_label } >跟进方式 : </span>
                        { item.type}
                    </p>
                </div>
                <div className = { style.sign_record_item_content } >
                    <span className = { style.sign_record_item_head_label } >跟进内容 : </span>
                    { item.content }
                </div>

            </div>
        );
    })

    return (
        <Modal
            className = "yhwu_student_translate_modal"
            title = "全部记录"
            visible = { showsaleStatusecord }
            width = '610px'
            onCancel = { cancelTranslateAction }
            maskClosable = { false }
            footer = {[
                <Button key = "confirmStudent" size = "large" type = "primary" onClick = { confirmTranslateAction } >确定</Button>
            ]}
        >
            { array || [] }
            <div className={style.Pagname}>
                <Pagination onChange={onChange} total={saleStatusrecordarrCount} defaultCurrent={pageIndex+1} pageSize={10}/>
            </div>



        </Modal>
    )
}

export default Form.create({})(StudentManageTranslateModal);


