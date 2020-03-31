import React from 'react';
import { NullData } from '../../../../components/common/new-component/NewComponent';
import styles from './CourseOrderSystem.less';
import thead from './thead.json';
import { Modal , Form , Button , Popover , Spin , Input , Popconfirm } from 'antd';
const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 20 }
}

//课阶课系
function CourseOrderSystem({
    //课阶课系
    courseOrderSystemModalVisible,              //modal是否显示
    courseOrderSystemModalLoading,              //modal加载状态
    courseOrderSystemModalData,                 //modal数据

    CourseOrderSystemModalAdd,                  //modal点击新增
    CourseOrderSystemModalEdit,                 //modal编辑课系
    CourseOrderSystemModalDelete,               //modal删除课系
    CourseOrderSystemModalClose,                //modal关闭

    //新增编辑课阶课系
    courseOrderSystemAddOrEditModalVisible,     //modal是否显示
    courseOrderSystemAddOrEditModalType,        //类型(add/edit)
    courseOrderSystemAddOrEditModalLoading,     //表单加载状态
    courseOrderSystemAddOrEditModalData,        //编辑回填数据

    CourseOrderSystemAddOrEditModalSubmit,      //新增编辑提交
    CourseOrderSystemAddOrEditModalCancel,      //关闭modal
    //课系删除失败
    classCeletionFailed,                        //modal是否显示

    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll,
    },
}){

    let th = [];
    for(let i in thead){
        th.push(
            <div className = { styles.th_item } key = { 'th_item_' + thead[i].id } style = {{ width : `${thead[i].width}` }}>{ thead[i].name }</div>
        )
    }

    let tr = [];
    for(let i in courseOrderSystemModalData){
        let tr_item = [];
        for(let j in thead){
            if(thead[j].id == 'operation'){
                tr_item.push(
                    <div className = { styles.tr_item } key = { 'tr_item_' + j } style = {{ width : `${thead[j].width}` }}>
                        <a style = {{ marginRight : 20 }}>编辑</a>
                        <a >删除</a>
                    </div>
                )
            }else{
                tr_item.push(
                    <div className = { styles.tr_item } key = { 'tr_item_' + j } style = {{ width : `${thead[j].width}` }}></div>
                )
            }
        }
        for(let j in courseOrderSystemModalData[i]){
            for(let k in thead){
                if(j == thead[k].id){
                    tr_item.splice(k,1,
                        <div className = { styles.tr_item } key = { 'tr_item_' + i + j } style = {{ width : `${thead[k].width}` }}>
                            <Popover placement='top' content = { courseOrderSystemModalData[i][j] }>
                                { courseOrderSystemModalData[i][j] }
                            </Popover>
                        </div>
                    )
                    break;
                }
            }
        }
        //更新操作栏
        tr_item.splice(tr_item.length - 1,1,
            <div className = { styles.tr_item } key = { 'tr_item_' + i + '_operation' } style = {{ width : `${thead[thead.length-1].width}` }}>
                <a style = {{ marginRight : 20 }} onClick = {() => CourseOrderSystemModalEdit(courseOrderSystemModalData[i])}>编辑</a>
                <Popconfirm placement="top" title={<div>确定删除<span style={{ color: 'red' }}>{courseOrderSystemModalData[i].name}</span>？<span>(注：若该课系有关联课程，则不可删除)</span></div>} onConfirm={() => CourseOrderSystemModalDelete(courseOrderSystemModalData[i].id)} okText="是" cancelText="否">
                    <a>删除</a>
                </Popconfirm>
            </div>
        )
        tr.push(
            <div className = { styles.tr } key = { 'tr_' + i }>
                { tr_item || [] }
            </div>
        )
    }
    function failureConfirm() {
        ClassSystemFailureModel()
    }
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if( !!errors ){
                return;
            }
            CourseOrderSystemAddOrEditModalSubmit(values);
        });
    }

    function handleCancel(){
        resetFields();
        CourseOrderSystemAddOrEditModalCancel();
    }

    //外层模态框的属性
    let modalOptsOut = {
        title: '课系管理',
        maskClosable : false,
        visible : courseOrderSystemModalVisible,
        closable : true,
        width : 550,
        onCancel : CourseOrderSystemModalClose,
        onOk : CourseOrderSystemModalAdd,
        footer : [
            <Button key="cancel" type="ghost" onClick={ CourseOrderSystemModalClose }>关闭</Button>,
            <Button key="submit" type="primary" onClick={ CourseOrderSystemModalAdd } style={{ marginLeft : 10 }}>新增课系</Button>
        ],
        className : 'course_order_system_modal'
    };

    //内层模态框属性
    let modalOptsInner = {
        title: courseOrderSystemAddOrEditModalType == 'add' ? '新增课系' : '编辑课系',
        maskClosable : false,
        visible : courseOrderSystemAddOrEditModalVisible,
        closable : true,
        width : 550,
        onCancel : handleCancel,
        onOk : handleComplete,
        footer : [
            <Button key="cancel" type="ghost" onClick={ handleCancel }>关闭</Button>,
            <Button key="submit" type="primary" onClick={ handleComplete } style={{ marginLeft : 10 }} loading = { courseOrderSystemAddOrEditModalLoading } disabled = { courseOrderSystemAddOrEditModalLoading }>{ courseOrderSystemAddOrEditModalType == 'add' ? '新增' : '保存' }</Button>
        ],
        className : 'course_order_system_add_or_edit_modal'
    }
    //课程失败的模态框
    let modalFailure = {
        title: '课系删除失败',
        maskClosable : false,
        visible : classCeletionFailed,
        closable : true,
        width : 550,
        onOk : failureConfirm,
        footer : [
            <Button key="submit" type="primary" onClick={ failureConfirm }>确认</Button>
        ],
        className : 'course_order_system_add_or_edit_modal_list'
    }

    return(
       <Modal {...modalOptsOut}>
            <Spin spinning = { courseOrderSystemModalLoading }>
                { courseOrderSystemModalData && courseOrderSystemModalData.length > 0 ?
                    <div className = { styles.all }>
                        <div className = { styles.thead }>
                            { th || [] }
                        </div>
                        <div className = { styles.trow }>
                            { tr || [] }
                        </div>
                    </div>
                    :
                    <NullData height = '500px'/>
                }
            </Spin>
            { courseOrderSystemAddOrEditModalVisible ?
                <Modal {...modalOptsInner}>
                    <Form.Item label = "课系名称" { ...formItemLayout }>
                        { getFieldDecorator('name',{
                            initialValue : courseOrderSystemAddOrEditModalType == 'edit' && courseOrderSystemAddOrEditModalData && courseOrderSystemAddOrEditModalData.name ? courseOrderSystemAddOrEditModalData.name : undefined,
                            rules : [
                                { required : true, message : '请输入课系名称' , whitespace : true },
                            ]
                        })(
                            <Input placeholder = '请输入课系名称' size = 'default'/>
                        )}
                    </Form.Item>
                </Modal>
                :
                null
            }
            {classCeletionFailed ?
                <Modal {...modalFailure}>
                    <div>该课系已关联课程，请先将将相关课程调整至其他课系</div>
                    <div></div>
                </Modal>
                :
                null
            }
       </Modal>
    )
}

export default Form.create()(CourseOrderSystem);
