import React from 'react';
import { Form ,Popconfirm , Button , Input , InputNumber, Select } from 'antd';
import style from './SignRecordSearch.less';
let FormItem = Form.Item;
let Option = Select.Option;

function SignRecordSearch({
    signRecordClassList,

    signRecordSearch,
    signRecordDataSource,
    signRecordClass,
    signRecordSignType,
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

    function signRecordClassSearch(value){
        let searchOptions = {
            signRecordOrg : signRecordOrg,
            signRecordClass : value,
            signRecordSignType : signRecordSignType,
        }
        signRecordSearch( searchOptions );
    };

    function signRecordSignTypeSearch(value){
        let searchOptions = {
            signRecordOrg : signRecordOrg,
            signRecordClass : signRecordClass,
            signRecordSignType : value,
        }
        signRecordSearch( searchOptions );
    };

	return (
		<div className = 'yhwu_sign_record_search' >
			<Form inline >
				<FormItem>
					{ getFieldDecorator('class',{

                    })(
                        <Select size = 'default' style = {{ width : '120px' }} placeholder = "所在班级" onChange = { signRecordClassSearch } >
                            <Option value = ''>全部</Option>
                            <Option value = "1">1班</Option>
                            <Option value = "2">2班</Option>
                        </Select>
                    )}
				</FormItem>
                <FormItem>
					{ getFieldDecorator('signType',{

                    })(
                        <Select size = 'default' style = {{ width : '120px' }} placeholder = "签到类型" onChange = { signRecordSignTypeSearch } >
                            <Option value = ''>全部</Option>
                            <Option value = "1">上课</Option>
                            <Option value = "2">请假</Option>
                            <Option value = "3">补课</Option>
                            <Option value = "4">旷课</Option>
                            <Option value = "5">试听</Option>
                            <Option value = "6">缺席</Option>
                        </Select>
                    )}
				</FormItem>
			</Form>
		</div>
	)
};

export default Form.create({})(SignRecordSearch);
