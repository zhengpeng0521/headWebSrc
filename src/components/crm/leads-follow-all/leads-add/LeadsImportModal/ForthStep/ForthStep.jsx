import React from 'react';
import { Radio } from 'antd';
import { ProgressBar } from '../../../../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
const RadioGroup = Radio.Group;

/*leads导入第四步*/
const ForthStep = ({
    leadsImportModalButtonLoading,      //leads导入按钮加载状态
    ForthStepRadioOnChange,             //第四步单选框onChange事件
}) => {

    let radioStyle = {
        marginBottom : 10
    }

    return (
        <div>
            { leadsImportModalButtonLoading ?
                <ProgressBar content = '名单导入中' height = '100px'/>
                :
                <div>
                    <div style={{ marginBottom : 10 }}>请选择名单姓名重复时的处理方式</div>
                    <RadioGroup onChange = { ForthStepRadioOnChange } style = {{ width : 400 }}>
                        <Radio value='1' style={ radioStyle }>全部导入，姓名重复的名单信息建立新的名单</Radio>
                        <Radio value='2' style={ radioStyle }>全部导入，姓名重复的名单信息覆盖掉旧的名单信息</Radio>
                        <Radio value='3' style={ radioStyle }>姓名重复的不导入，只导入不重复的</Radio>
                    </RadioGroup>
                </div>
            }
		</div>
    );
};

export default ForthStep;
