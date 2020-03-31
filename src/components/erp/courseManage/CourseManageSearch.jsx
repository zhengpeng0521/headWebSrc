import React from 'react';
import { Button , Select , Form , Input, message } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import style from './CourseManageSearch.less';

let FormItem = Form.Item;
let Option = Select.Option;

function CourseManageSearch({
	onCourseSearch,
    onCourseReset,
    orgOptionsList,
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
}){

     //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 300,
//        onChange     : TenantSelectOnSelect,            //改变机构触发事件
    };

    function onCourseSearchAction(){
        let values  = getFieldsValue();
        onCourseSearch(values);
    };

    function onCourseResetAction(){
        resetFields();
        onCourseReset();
    };
	return (
        <div className = 'yhwu_search_bg' >
            <Form inline>
                <FormItem>
					{ getFieldDecorator('orgId' ,{
                        initialValue : '',
					})(
						<TenantOrgSelect { ...tenantOrgSelectProps } />
					)}
				</FormItem>
                <FormItem>
                    { getFieldDecorator('title' , {
//                        rules : [
//                        ],
                    })(
                        <Input size = 'default' style = {{ width : '120px' }} placeholder = "课程名称"/>
                    )}
                </FormItem>
                <FormItem>
                    { getFieldDecorator('courseType' , {

                    })(
                        <Select
                            allowClear
                            size = 'default'
                            style = {{ width : '120px' }}
                            placeholder = "课程类型"
                        >
                            <Option value = "1">主题式</Option>
                            <Option value = "2">渐进式</Option>
                        </Select>
                    )}
                </FormItem>
                <div className = "yhwu_search_btn_group" >
                    <Button type = 'primary' onClick = { onCourseSearchAction } >搜索</Button>
                    <Button onClick = { onCourseResetAction } style = {{ marginLeft : '10px' }} >清除条件</Button>
                </div>
            </Form>
        </div>

	)
}

export default Form.create({})(CourseManageSearch);
