import React from 'react';
import { Form, Modal, Button, Icon, Select, Input, DatePicker, TimePicker, Spin, message } from 'antd';
import styles from './UpdateStatusModal.less';
import moment from 'moment';
let Option = Select.Option;
let FormItem = Form.Item;

//主排课编辑
function UpdateStatusModal({
	updateStatusVisible,
	selectedRowKeys,

	cancelUpdateStatus,
	confirmUpdateStatus,

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
	function confirmUpdateStatusAction(){
		validateFieldsAndScroll(( err, values ) => {
			if( selectedRowKeys.length == 0 ){
				message.error( '未选中数据' );
				return;
			}
			if( !!err ){
				return;
			}
			confirmUpdateStatus( values )
		})
	}
	return(
        <Modal
			className = 'update_status_modal'
            visible = { updateStatusVisible }
            title = '修改状态'
            maskClosable = { false }
            width = '400px'
            onCancel = { cancelUpdateStatus }
		   	afterClose = { afterClose }
            footer = {[
				<Button key = "cancelbatchOrderClass" onClick = { cancelUpdateStatus } >取消</Button>,
				<Button key = "confirmbatchOrderClassAction" type = "primary" onClick = { confirmUpdateStatusAction } >确定</Button>
			]}

		>
			<div className = { styles.update_status_head } >已选中<span>{ !!selectedRowKeys && selectedRowKeys.length || 0 }</span>条数据</div>
			<div style = {{ height : '28px', lineHeight : '28px' }}>
				<span style = {{ marginRight : '20px', fontSize : '14px' }}>请选择约课状态</span>
				<Form layout = 'inline' style = {{ display : 'inline-block' }}>
					<FormItem>
						{ getFieldDecorator('status',{
							initialValue : '6',
							rules : [
								{ required : true, message : '请选择状态' }
							]
						})(
							<Select
								style = {{ width : '200px' }}
								size = 'default'
								>
								<Option value = '6' >取消</Option>
							</Select>
						)}
					</FormItem>
				</Form>
			</div>
        </Modal>
	)

};
export default Form.create({})(UpdateStatusModal);
