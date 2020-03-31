import React from 'react';
import { Form ,Button , Input , Popconfirm ,Icon , Select } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
let FormItem = Form.Item;
let Option = Select.Option;

function StudentWorksSearch({
    tagIdList,
    stuIdList,

    TenantSelectOnSelect,

    onSearch,
    onReset,

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
        onChange     : TenantSelectOnSelect,            //改变机构触发事件
    };

    //点击搜索
    function onSearchAction(){
        let values = getFieldsValue();
        onSearch( values );
    };

    //点击清除条件
    function onResetAction(){
        resetFields();
        onReset();
    };

	return (
		<div  className = 'yhwu_search_bg' >
			<Form inline>
				<FormItem>
					{ getFieldDecorator('orgId' ,{
                        initialValue : '',
					})(
						<TenantOrgSelect { ...tenantOrgSelectProps } />
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator('wId',{
                        initialValue : '',
					})(
						<Input size = 'default' style = {{ width : '120px' }} placeholder = '作品编号' />
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator('wName' ,{
                        initialValue : '',
					})(
						<Input size = 'default' style = {{ width : '120px' }} placeholder = '作品名称' />
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator('stuId' ,{

					})(
						<Select
                            placeholder = '请选择学员'
                            style = {{ width : '120px' }}
                            size = 'default'
                            showSearch
                            allowClear
                            optionFilterProp = "children"
                            notFoundContent = { '没有学员' }
                        >
							{
                                stuIdList && stuIdList.map(function(item, index){
                                    return (<Option key = { 'student_work_' + item.stuId } value = { item.stuId } >{ item.stuName }</Option>)
                                })
                            }
						</Select>
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator('tagId' ,{

					})(
						<Select
                            placeholder = '作品分类'
                            style = {{ width : '120px' }}
                            size = 'default'
                            showSearch
                            allowClear
                            optionFilterProp = 'children'
                            notFoundContent = { '没有分类' }
                        >
							{
                                tagIdList && tagIdList.map(function(item, index){
                                    return (<Option key = { 'student_work_' + item.key } value = { item.id } >{ item.name }</Option>)
                                })
                            }
						</Select>
					)}
				</FormItem>
				<div className = "yhwu_search_btn_group" >
					<Button type = 'primary' onClick = { onSearchAction }>
						<Icon type = 'search' />搜索
					</Button>
					<Button onClick = { onResetAction } style = {{ marginLeft : '10px' }} >
						清除条件
					</Button>
				</div>
			</Form>
		</div>
	)
};

export default Form.create({})(StudentWorksSearch);
