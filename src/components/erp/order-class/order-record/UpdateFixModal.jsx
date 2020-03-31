import React from 'react';
import { Form, Modal, Button, Icon, Select, Input, DatePicker, TimePicker, Spin, message } from 'antd';
import styles from './UpdateFixModal.less';
import moment from 'moment';
let Option = Select.Option;
let FormItem = Form.Item;

//主排课编辑
function UpdateFixModal({
	updateFixVisible,
	selectedRowKeys,

	cancelUpdateFix,
	confirmUpdateFix,

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

	function afterClose(){
		resetFields();
	}

	/*确认修改状态*/
	function confirmUpdatefixAction(){
		validateFieldsAndScroll(( err, values ) => {
			if( selectedRowKeys.length == 0 ){
				message.error( '未选中数据' );
				return;
			}
			if( !!err ){
				return;
			}
			confirmUpdateFix( values )
		})
	}
	return(
        <Modal
			className = 'update_fixed_status_modal'
            visible = { updateFixVisible }
            title = '修改固定位'
            maskClosable = { false }
            width = '400px'
            onCancel = { cancelUpdateFix }
		   	afterClose = { afterClose }
            footer = {[
				<Button key = "cancelbatchOrderClass" onClick = { cancelUpdateFix } >取消</Button>,
				<Button style = {{ marginLeft : '20px' }} key = "confirmbatchOrderClassAction" type = "primary" onClick = { confirmUpdatefixAction } >确定</Button>
			]}

		>
			<div className = { styles.update_status_head } >已选中<span>{ !!selectedRowKeys && selectedRowKeys.length || 0 }</span>条数据</div>
			<div style = {{ height : '28px', lineHeight : '28px' }}>
				<span style = {{ marginRight : '20px', fontSize : '14px' }}>请选择固定位状态</span>
				<Form style = {{ display : 'inline-block' }}>
					<FormItem>
						{ getFieldDecorator('status',{
							initialValue : '0',
							rules : [
								{ required : true, message : '请选择状态' }
							]
						})(
							<Select
								style = {{ width : '228px' }}
								size = 'default'
								>
								<Option value = '0' >否</Option>
								<Option value = '1' >是</Option>
							</Select>
						)}
					</FormItem>
				</Form>
			</div>
        </Modal>
	)

};
export default Form.create({})(UpdateFixModal);
