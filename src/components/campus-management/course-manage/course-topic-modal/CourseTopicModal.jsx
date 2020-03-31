import React from 'react';
import { NullData } from '../../../../components/common/new-component/NewComponent';
import styles from './CourseTopicModal.less';
import thead from './thead.json';
import { Modal , Form , Button , Popover ,Select , Spin , Input , Popconfirm } from 'antd';
const Option = Select.Option;
const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 20 }
}

//课阶课系
function CourseTopic({
    //上课主题
    courseTopicModalVisible,              //modal是否显示
    courseTopicModalLoading,              //modal加载状态
    courseTopicModalData,                 //modal数据

    CourseTopicModalAdd,                  //modal点击新增
    CourseTopicModalEdit,                 //modal编辑课系
    CourseTopicModalDelete,               //modal删除课系
    CourseTopicModalClose,                //modal关闭

    //新增编辑课阶课系
    courseTopicId,                        //选中的课程id
    courseTopicAddOrEditModalVisible,     //modal是否显示
    courseTopicAddOrEditModalType,        //类型(add/edit)
    courseTopicAddOrEditModalLoading,     //表单加载状态
    courseTopicAddOrEditModalData,        //编辑回填数据

    CourseTopicAddOrEditModalSubmit,      //新增编辑提交
    CourseTopicAddOrEditModalCancel,      //关闭modal

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
    for(let i in courseTopicModalData){
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
        for(let j in courseTopicModalData[i]){
            for(let k in thead){
                if(j == thead[k].id){
                    if(thead[k].id == 'type'){
                        tr_item.splice(k,1,
                            <div className = { styles.tr_item } key = { 'tr_item_' + i + j } style = {{ width : `${thead[k].width}` }}>
                                {courseTopicModalData[i][j] =='1'?
                                        <span>正课</span>
                                :
                                  courseTopicModalData[i][j] =='2'?
                                       <span>开学典礼</span>
                                :
                                  courseTopicModalData[i][j] =='3'?
                                       <span>公开课</span>
                                :
                                  courseTopicModalData[i][j] =='4'?
                                       <span>家长会</span>
                                :
                                  courseTopicModalData[i][j] =='5'?
                                       <span>毕业典礼</span>
                                : null
                                }
                            </div>
                        )
                    }else{
                        tr_item.splice(k,1,
                            <div className = { styles.tr_item } key = { 'tr_item_' + i + j } style = {{ width : `${thead[k].width}` }}>
                                <Popover placement='top' content = { courseTopicModalData[i][j] }>
                                    { courseTopicModalData[i][j] }
                                </Popover>
                            </div>
                        )
                    }

                    break;
                }
            }
        }
        //更新操作栏
        tr_item.splice(tr_item.length - 1,1,
            <div className = { styles.tr_item } key = { 'tr_item_' + i + '_operation' } style = {{ width : `${thead[thead.length-1].width}` }}>
                <a style = {{ marginRight : 20 }} onClick = {() => CourseTopicModalEdit(courseTopicModalData[i])}>编辑</a>
                    <Popconfirm placement="top" title={<div>确定删除<span style = {{ color : 'red' }}>{courseTopicModalData[i].name}</span>？</div>} onConfirm={() => CourseTopicModalDelete(courseTopicModalData[i].id)} okText="是" cancelText="否">
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

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if( !!errors ){
                return;
            }

            CourseTopicAddOrEditModalSubmit(values);
        });
    }

    function handleCancel(){
        resetFields();
        CourseTopicAddOrEditModalCancel();
    }

    //外层模态框的属性
    let modalOptsOut = {
        title: '管理上课主题',
        maskClosable : false,
        visible : courseTopicModalVisible,
        closable : true,
        width : 550,
        onCancel : CourseTopicModalClose,
        onOk : CourseTopicModalAdd,
        footer : [
            <Button key="cancel" type="ghost" onClick={ CourseTopicModalClose }>关闭</Button>,
            <Button key="submit" type="primary" onClick={ CourseTopicModalAdd } style={{ marginLeft : 10 }}>新增主题</Button>
        ],
        className : 'course_order_system_modal'
    };

    //内层模态框属性
    let modalOptsInner = {
        title: courseTopicAddOrEditModalType == 'add' ? '新增主题' : '编辑主题',
        maskClosable : false,
        visible : courseTopicAddOrEditModalVisible,
        closable : true,
        width : 550,
        onCancel : handleCancel,
        onOk : handleComplete,
        footer : [
            <Button key="cancel" type="ghost" onClick={ handleCancel }>关闭</Button>,
            <Button key="submit" type="primary" onClick={ handleComplete } style={{ marginLeft : 10 }} loading = { courseTopicAddOrEditModalLoading } disabled = { courseTopicAddOrEditModalLoading }>{ courseTopicAddOrEditModalType == 'add' ? '新增' : '保存' }</Button>
        ],
        className : 'course_order_system_add_or_edit_modal'
    }
    function handleChange(){

    }
    return(
       <Modal {...modalOptsOut}>
            <Spin spinning = { courseTopicModalLoading }>
                { courseTopicModalData && courseTopicModalData.length > 0 ?
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
            { courseTopicAddOrEditModalVisible ?
                <Modal {...modalOptsInner}>
                    <Form.Item
                        label = "类型"
                        { ...formItemLayout }
                        >
                        { getFieldDecorator('type',{
                            initialValue : courseTopicAddOrEditModalType == 'edit' && courseTopicAddOrEditModalData && courseTopicAddOrEditModalData.type ? courseTopicAddOrEditModalData.type : '1',
                        })(
                            <Select style={{ width: 441,marginBottom:'10px' }} onChange={handleChange}>
                              <Option value="1">正课</Option>
                              <Option value="2">开学典礼</Option>
                              <Option value="3">公开课</Option>
                              <Option value="4">家长会</Option>
                              <Option value="5">毕业典礼</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label = "主题名称" { ...formItemLayout }>
                        { getFieldDecorator('title',{
                            initialValue : courseTopicAddOrEditModalType == 'edit' && courseTopicAddOrEditModalData && courseTopicAddOrEditModalData.title ? courseTopicAddOrEditModalData.title : undefined,
                            rules : [
                                { required : true, message : '请输入上课主题名称' , whitespace : true },
                            ]
                        })(
                            <Input placeholder = '请输入上课主题名称' size = 'default'/>
                        )}
                    </Form.Item>
                </Modal>
                :
                null
            }
       </Modal>
    )
}

export default Form.create()(CourseTopic);
