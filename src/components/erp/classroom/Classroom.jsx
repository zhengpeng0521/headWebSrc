import React from 'react';
import styles from './Classroom.less';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';

const FormItem = Form.Item;
let Option = Select.Option;

function ClassroomComponent ({
    form : {
        getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
    },
    classroom,
    classroomAdd,
    classroomSearch,
}) {

    //教室列表表格
    const columns = [{
            title      : '教室名称',
            dataIndex  : 'name',
            key        : 'name',
            width: 400,
            render: (text,record)  => (
                <div>
                    <a onClick = {() => classroomAdd.classroomAddUpdate(record)}>{text}</a>
                </div>),
        }, {
            title      : '大致方位',
            dataIndex  : 'pos',
            key        : 'pos',
            width: 400,
        }, {
            title      : '所属校区',
            dataIndex  : 'orgName',
            key        : 'orgName',
            width: 400,
    }];

     //表格多选
    const rowSelection = {
        selectedRowKeys : classroom.selectedRowKeys,
        onChange : classroom.rowSelectChange,
    };

     //分页
    const paginationProps = {
        size              : 'large',
        current           : (classroom.pageIndex)+1,
        pageSize          : classroom.pageSize,
        total             : classroom.classRoomDataCount,
        showSizeChanger   : true,
        showQuickJumper   : true,                           //是否显示快速跳页
        showTotal         : total => `共 ${total} 条` ,
    };

    //筛选按钮点击
    function Onsearch (){
        classroomSearch.showSearchFunction();
    };

    //筛选框 清除条件
    function handleReset () {
        let data = {};
        resetFields();
        classroomSearch.searchClassroom(data);
    }

    //筛选框 搜索   up
    function searchBtn (){
        let data = {};
        data.id = getFieldValue('searchId');
        data.name = getFieldValue('searchName');
        data.orgId = getFieldValue('searchOrgId');
        classroomSearch.searchClassroom(data);
    }

    //新增教室按钮
    function OnAdd () {
        classroomAdd.createClassroom();
    }

    //新增框取消按钮
    function classroomAddCancelBtn (){
        classroomAdd.classroomAddCancel();
        resetFields();
    }

    //新增框保存按钮 up
    function classroomAddOkBtn (e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            classroomAdd.classroomAddOk(values);
            resetFields();
        });
    }

    //表单校验
    function check(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('输入内容不能为空'));
        }else{
            callback();
        }
    }

    //新增班级表单样式
    const addFormItemLayout = {
		labelCol	: { span: 4 },
      	wrapperCol	: { span: 18 },
    };

    /*校区选择框属性*/
    let tenantOrgSearchSelectProps = {
        width : 300,
    };

    let tenantOrgFormSelectProps = {
        width : 383,
    };

    let modalProps = {
        title: classroomAdd.modalType == 'create'?'新增教室':'编辑教室',
        maskClosable : false,
        visible : classroomAdd.showAdd,
        closable : true,
        width : 550,
        onOk: classroomAddOkBtn,
        onCancel : classroomAddCancelBtn,
        footer : [
            <Button key="cancel" type="ghost" onClick={classroomAddCancelBtn}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={classroomAddOkBtn}
                    disabled={classroomAdd.formButtonLoading}
                    loading={classroomAdd.formButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_classroom_modal'
    }

    return (
        <div className={styles.classBaseDiv}>

            <QueueAnim
				type = {[ 'top', 'top' ]}
                ease = {[ 'easeOutQuart', 'easeInOutQuart' ]}
                style = {{ width : '100%' }} >
					{ !! classroomSearch.showSearch  &&
                        <div key='classroom_search_content'>
                            <Form className={styles.searchForm} >
                                <FormItem
                                    style={{float : 'left',marginRight:'40px',marginBottom:'20px'}}
                                >
                                  {getFieldDecorator('searchOrgId')(
                                        <TenantOrgFilter {...tenantOrgSearchSelectProps}/>
                                  )}
                                </FormItem>

                                <FormItem
                                    style={{float : 'left',width:'120px',marginRight : '40px',marginBottom:'20px'}}
                                >
                                  {getFieldDecorator('searchId', {

                                  })(
                                    <Input placeholder="教室编号" size='default'/>
                                  )}
                                </FormItem>

                                <FormItem
                                    style={{float : 'left',width:'120px',marginBottom:'20px'}}
                                >
                                  {getFieldDecorator('searchName', {

                                  })(
                                    <Input placeholder="教室名称" size='default'/>
                                  )}
                                </FormItem>

                                <Button onClick={handleReset} className={styles.searchButton} style={{backgroundColor:'#fff'}}>清除条件</Button>
                                <Button type="primary" onClick={searchBtn} className={styles.searchButton}>搜索</Button>
                            </Form>
                        </div>
                    }
			</QueueAnim>


            <div className={styles.topOperation}>
                <div className={styles.topOperationLeft}>
                    <span>操作</span>
                    <Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { classroom.deleteClassroom } >
						<a style = {{ marginLeft : '10px' }} disabled={ (classroom.selectedRows).length > 0 ? false : true }>删除</a>
					</Popconfirm>
                </div>
                <div className={styles.topOperationRight}>
                    <Button type="primary" onClick = {OnAdd}><Icon type="plus" />新增教室</Button>
				    <Button type="primary" onClick = {Onsearch}><Icon type="filter" />筛选</Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={classroom.classRoomDataSource}
                rowSelection={rowSelection}
                loading={classroom.classRomeTableLoading}
                onChange={classroom.tablePageChange}
                pagination={paginationProps}
                bordered
                size='middle'
                rowKey="id"
            />

            <Modal {...modalProps}>
                <Form>
                    <FormItem
                        label="所属校区"
                        {...addFormItemLayout}
                        style={{lineHeight:'12px'}}
                    >
                        {getFieldDecorator('orgId',{
                            initialValue : classroomAdd.modalType == 'update' && classroomAdd.updateContent.orgId ? classroomAdd.updateContent.orgId : classroomAdd.classRomeSelectOrgId,
                            rules : [
                                { required : true , message : '请选择所属校区'}
                            ]
                        })(
                            <TenantOrgFilter {...tenantOrgFormSelectProps}/>
                        )}
                    </FormItem>

                    <FormItem
                        label="教室名称"
                        {...addFormItemLayout}
                        style={{lineHeight:'12px'}}
                    >
                      {getFieldDecorator('name', {
                            initialValue : classroomAdd.modalType == 'update' && classroomAdd.updateContent.name ? classroomAdd.updateContent.name : '',
                            rules : [
                                { required : true , message : '请输入教室名称'},{validator: check},
                            ]
                      })(
                        <Input placeholder="请输入教室名称" size='default'/>
                      )}
                    </FormItem>

                    <FormItem
                        label="大致方位"
                        {...addFormItemLayout}
                        style={{lineHeight:'12px'}}
                    >
                      {getFieldDecorator('pos', {
                            initialValue : classroomAdd.modalType == 'update' && classroomAdd.updateContent.pos ? classroomAdd.updateContent.pos : '',
                      })(
                        <Input placeholder="请输入大致方位" size='default'/>
                      )}
                    </FormItem>

                </Form>
            </Modal>

        </div>
    );
}


export default Form.create({})(ClassroomComponent);
