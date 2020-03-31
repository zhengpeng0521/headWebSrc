import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Pagination } from 'antd';

import { Button , Modal , Form , Input , Select , Icon , Radio ,Row, Col ,message} from 'antd';
import moment from 'moment';
import style from './ListrecordsModalL.less';

import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';

let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;

function StudentManageTranslateModal({


    confirmsaleStatusrecordModal,
    cancelsaleStatusrecordModal,
    Modalpageion,



    showlistrecordsModal ,//名单转化记录是否显示
    listrecordsstuList,
    listrecordsstuPageIndex,
    listrecordsstuPageSize,
    listrecordsstuCount,
    listrecordsstustuId,

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


        let  params  = {pageSize:pageSize, pageIndex:page-1,stuId:listrecordsstustuId};


        Modalpageion( params)


    }


    // let array = [];
    // array = listrecordsstuList && listrecordsstuList.map((item,index) => {
    //         return(
    //             <div key = {index} className = { style.sign_record_item }>
    //                 <div className = { style.sign_record_item_head } >
    //                     <p className = { style.sign_record_item_head_left }>
    //                         <span className = { style.sign_record_item_head_label } >跟进人 : </span>
    //                         { item.uname}
    //                     </p>
    //                     <p className = { style.sign_record_item_head_right }>
    //                         <span className = { style.sign_record_item_head_label } >跟进时间 : </span>
    //                         { item.createTime }
    //                     </p>
    //                 </div>
    //                 <div className = { style.sign_record_item_head } >
    //                     <p className = { style.sign_record_item_head_left }>
    //                         <span className = { style.sign_record_item_head_label } >关联家长 : </span>
    //                         { item.parentName}
    //                     </p>
    //                     <p className = { style.sign_record_item_head_right }>
    //                         <span className = { style.sign_record_item_head_label } >跟进方式 : </span>
    //                         { item.type}
    //                     </p>
    //                 </div>
    //                 <div className = { style.sign_record_item_content } >
    //                     <span className = { style.sign_record_item_head_label } >跟进内容 : </span>
    //                     { item.content }
    //                 </div>
    //
    //             </div>
    //         );
    //     })

    let StumagegeComponentProps = {



        table: {

            dataSource:listrecordsstuList,
            rowKey: 'id',
            xScroll       : 1166,

            columns: [
                {
                    key: 'leadsName',
                    title: '名单姓名',
                    dataIndex: 'leadsName',
                    width     :96,

                },

                {
                    dataIndex : 'channel',
                    key       : 'channel',
                    title     : '一级来源',
                    width     : 96,

                },
                {
                    dataIndex : 'secondChannel',
                    key       : 'secondChannel',
                    title     : '二级来源',
                     width     : 96,

                },
                {
                    key: 'parentName',
                    title: '家长姓名',
                    dataIndex: 'parentName',
                    width: 96,
                },
                {
                    key: 'mobile',
                    title: '手机号码',
                    dataIndex: 'mobile',
                    width: 112,
                },
                // {
                //     key: 'stauts',
                //     title: '性别',
                //     dataIndex: 'stauts',
                //     width: 68,
                // },
                // {
                //     key: 'birthday',
                //     title: '生日',
                //     dataIndex: 'birthday',
                //     width: 102,
                // },
                {
                    key: 'createTime',
                    title: '转化时间',
                    dataIndex: 'createTime',
                    width: 96,
                },


            ],

        },

    };


    // { array || [] }

    return (
        <Modal
            className = "yhwu_student_translate_modal"
            title = "名单转化记录"
            visible = { showlistrecordsModal }
            width = '1000px'
            onCancel = { cancelTranslateAction }
            maskClosable = { false }
            footer = {[
                <Button key = "confirmStudent" size = "large" type = "primary" onClick = { confirmTranslateAction } >确定</Button>
            ]}
        >

            <ClassPackageComponent {...StumagegeComponentProps} />
            <div className={style.Pagname}>
                <Pagination onChange={onChange} total={listrecordsstuCount} defaultCurrent={listrecordsstuPageIndex+1} pageSize={10}/>
            </div>



        </Modal>
    )
}

export default Form.create({})(StudentManageTranslateModal);
