import React from 'react';
import { Radio } from 'antd';
import { ProgressBar } from '../../../../common/new-component/NewComponent';
const RadioGroup = Radio.Group;

/*合同导入第三步*/
const ThirdStep = ({
    contractOrderImportModalButtonLoading,      //合同导入按钮加载状态
    LastStepRadioOnChange,                      //第三步单选框onChange事件
}) => {

    let radioStyle = {
        marginBottom : 10
    }

    return (
        <div style = {{ marginBottom : 20 }}>
            { contractOrderImportModalButtonLoading ?
                <ProgressBar content = '合同导入中' height = '50px'/>
                :
                <div>系统导入合同默认<strong style={{ color:'red' }}>审核通过</strong></div>
            }
            {/*<div style={{ marginBottom : 10 }}>请选择导入合同审核状态</div>*/}
            {/*<RadioGroup onChange = { LastStepRadioOnChange } style = {{ width : 400 }} defaultValue='2'>
                <Radio value='1' style={ radioStyle }>待审核</Radio>
                <Radio value='2' style={ radioStyle }>审核通过</Radio>
            </RadioGroup>*/}
		</div>
    );
};

export default ThirdStep;
