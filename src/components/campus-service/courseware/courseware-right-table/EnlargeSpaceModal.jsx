import React from 'react';
import { Button , Modal , Form , Input , Select, Radio } from 'antd';
let FormItem = Form.Item;
let Option = Select.Option;

function EnlargeSpaceModal({
    enlargeSpaceVisible,
    cancelEnlargeSpace,
}){

	return (
        <Modal
            visible = { enlargeSpaceVisible }
            width = '300px'
            height = '300'
            onCancel = { cancelEnlargeSpace }
            maskClosable = { false }
            footer={null}
        >
            <div style={{padding:'30px'}}>请联系闪闪工作人员进行扩容！</div>
        </Modal>
	)
}

export default Form.create()(EnlargeSpaceModal);
