import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Button , Modal , Form , Icon } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import style from './WOfficeOrgIdComponent.less';

const  FormItem = Form.Item;

function WOfficeOrgIdComponent({
    TenantSelectOnSelect,
    orgId,

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

    function TenantSelectOnSelectAction( value ){
        if( !!value ){
            TenantSelectOnSelect( value );
        }
    };

    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 390,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
    };

      //表单布局
      let formItemLayout = {
        labelCol   : { span : 20 },
        wrapperCol : { span : 4 }
      };

	return (
        <div style = {{ padding : '20px 0 0px 20px'}}>
            <div>
                <Form>
                    <FormItem>
                        { getFieldDecorator('orgId',{
                            initialValue : orgId || '',
                            rules : [
                                { required : true, message : '请选择校区' }
                            ]
                        })(
                            <TenantOrgSelect { ...tenantOrgSelectProps } />
                        )}
                    </FormItem>
                </Form>
            </div>
        </div>
	)
}

export default Form.create({})(WOfficeOrgIdComponent);
