import React from 'react';
import { Form, Modal, Select } from 'antd';
import styles from './OrgSelectModalComponent.less';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;

function OrgSelectModalComponent({

	orgSelectModalVisible,
	orgIdList,

	orgSelectChange,
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

	function afterColse(){
		resetFields();
	}

	let formItemLayout = {
		labelCol : { span : 5 },
		wrapperCol : { span : 18 }
	}
	return (
		<Modal
			className = 'erp_cerp_org_select_modal'
			visible = { orgSelectModalVisible }
			title = '选择校区'
			maskClosable = { false }
			width = '400px'
			closable = { false }
			afterClose = { afterColse }
			footer = { null }
		>
			<Form>
				<FormItem
					{ ...formItemLayout }
					label = '选择校区'
                    style = {{ margin : 0 }}
				>
					{ getFieldDecorator('orgId', {
						initialValue : undefined,
					})(
						<Select
							onSelect = { orgSelectChange }
							size = 'default'
                            placeholder = '请选择校区'
						>
							{ !!orgIdList && orgIdList.map(function( item, index ){
								return ( <Option key = { item.orgId } value = { item.orgId } orgKind = { item.orgKind } >{ item.orgName }</Option> )
							}) }
						</Select>
					)}
				</FormItem>
			</Form>
		</Modal>
	)
};

export default Form.create({})(OrgSelectModalComponent);
