import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, DatePicker, InputNumber, Radio } from 'antd';
import QueueAnim from 'rc-queue-anim';
import moment from 'moment';
const [ RangePicker, Option, FormItem, RadioGroup ]   = [ DatePicker.RangePicker, Select.Option, Form.Item, Radio.Group ];

function WxActivityCreateForm({

	dp,
	title,
	organId,		 	//机构ID
	formVisible, 		//打开微传单护着活动模板
	activityCode,		//活动code码
	activityTypeId, 	//模板ID
	changeTempletInstanceFormVisible, //关闭模板
	currentSelectCampus,	//选中的校区名称
	automatedCompletion,	//自动化执行完毕

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

	function automated(props) {
		if(!automatedCompletion) {
//			dp('updateState', {
//				automatedCompletion : !automatedCompletion,
//			});
		}
	}

    return(
		<div>
			<div onClick={automated()}></div>
		</div>
	)
};



export default Form.create({})(WxActivityCreateForm);
