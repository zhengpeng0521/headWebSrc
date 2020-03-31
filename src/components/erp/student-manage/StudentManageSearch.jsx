import React from 'react';
import { Form ,Popconfirm , Button , Input , InputNumber, Select } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
let FormItem = Form.Item;
let Option = Select.Option;

function StudentManageSearch({
	onStudentSearch,
    onStudentReset,
    salesManOptions,
    teacherOptions,
    orgOptions,
    classOptions,

    changeOrgId,    //改变校区得到班级下拉列表
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

    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 300,
        onChange     : changeOrgId,
    };

    function onStudentSearchAction(){
        let values  = getFieldsValue();
        onStudentSearch(values);
    };
    function onStudentResetAction(){
        resetFields();
        onStudentReset();
    };
	return (
        <div className = 'yhwu_search_bg' >
            <Form inline>
                <FormItem>
                    { getFieldDecorator('orgId',{
                        initialValue : '',
                        rules : [

                        ]
                    })(
                        <TenantOrgSelect { ...tenantOrgSelectProps } />
                    )}
                </FormItem>
                <FormItem>
                    { getFieldDecorator('name',{
                        initialValue : '',
                        rules : [
                        ]
                    })(
                        <Input size = 'default' style = {{ width : '120px' }} placeholder = "学员姓名" />
                    )}
                </FormItem>
                <FormItem>
                    { getFieldDecorator('sex',{

                        rules : [

                        ]
                    })(
                        <Select size = 'default' style = {{ width : '120px' }} placeholder = "学员性别" allowClear >
                            <Option value = "1">男</Option>
                            <Option value = "2">女</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    { getFieldDecorator('teacherId',{
                        rules : [

                        ]
                    })(
                        <Select
                            style = {{ width : '120px' }}
                            size = 'default'
                            placeholder = "带班老师"
                            allowClear
                            showSearch
                            optionFilterProp = "children"
                            notFoundContent = "没有老师"
                        >
                             { teacherOptions && teacherOptions.map(function(item,index){
                                return (
                                    <Option key = { item.teacherId + '' } value = { item.id + '' }>{ item.name }</Option>
                                )
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    { getFieldDecorator('attention',{
                        rules : [

                        ]
                    })(
                        <Select size = 'default' style = {{ width : '120px' }} placeholder = "微信" allowClear >
                            <Option value = "1">已关注</Option>
                            <Option value = "0">未关注</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    { getFieldDecorator('mobile',{
                        initialValue : '',
                        rules : [

                        ]
                    })(
                        <Input size = 'default' style = {{ width : '120px' }} placeholder = "联系信息" />
                    )}
                </FormItem>
                <FormItem>
                    { getFieldDecorator('clsId',{
                        rules : [

                        ]
                    })(
                        <Select
                            style = {{ width : '120px' }}
                            size = 'default'
                            placeholder = "报读信息"
                            allowClear
                            showSearch
                            optionFilterProp = "children"
                            notFoundContent = "没有报读信息"
                        >
                            { classOptions && classOptions.map(function(item,index){
                                return (
                                    <Option key = { item.clsId + '' } value = { item.clsId + ''}>{ item.clsName }</Option>
                                )
                            })}
                        </Select>
                    )}
                </FormItem>
                <div className = "yhwu_search_btn_group" >
                    <Button type = "primary" onClick = { onStudentSearchAction } >搜索</Button>
                    <Button onClick = { onStudentResetAction } style = {{ marginLeft : '10px' }}>清除条件</Button>
                </div>
            </Form>
        </div>
	)
};

export default Form.create({})(StudentManageSearch);
