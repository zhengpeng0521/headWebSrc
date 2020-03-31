import React from 'react';
import { Modal, Input, Button, Upload, Select, Popover } from 'antd';
import { NullData } from '../../../../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import styles from './SecondStep.less';
const Option = Select.Option;

/*leads导入第二步*/
const SecondStep = ({
    secondStepMatchData,                //第二步匹配数据
    secondStepMisMatchData,             //第二步不匹配数据
    secondStepSelectData,               //第二步下拉列表数据

    SecondStepSelectOnChange,           //第二步下拉列表onChange事件
}) => {


    let selectData = [];    //下拉列表数据
    let matchData = [];     //匹配数据
    let misMatchData = [];  //不匹配数据

    //渲染下拉列表数据
    if(secondStepSelectData && secondStepSelectData.length > 0){
        selectData = secondStepSelectData.map((item,index) => {
            return(
                <Option key = { 'select' + index } value = { index + '' } disabled = { item.disabled }>{ item[index] + '' }</Option>
            );
        })
    }

    //渲染匹配数据
    if(secondStepMatchData && secondStepMatchData.length > 0){
        matchData = secondStepMatchData.map((item,index) => {
            return(
                <div className={styles.map_item} key = { index } style = { index == secondStepMatchData.length - 1 ? { border : 0 } : {}}>
                    <div>
                        <Popover placement="top" content={ item.value } trigger="hover">{ index < 2 ? item.value + '（必填）' : item.value }</Popover>
                    </div>
                    <Select
                        notFoundContent = "未找到"
                        showSearch
                        allowClear
                        size = 'default'
                        placeholder = '请选择映射选项'
                        onChange = {(e) => SecondStepSelectOnChange(e,item.key)}>
                        { selectData || [] }
                    </Select>
                </div>
            );
        })
    }

    //渲染不匹配数据
    if(secondStepMisMatchData && secondStepMisMatchData.length > 0){
        misMatchData = secondStepMisMatchData.map((item,index) => {
            if(!item.disabled){
                return(
                    <div className={styles.mis_map_item} key = { index } style = { index == secondStepMisMatchData.length - 1 ? { border : 0 } : {}}>
                        <Popover placement="top" content={ item[index] + '' } trigger="hover">{ item[index] + '' }</Popover>
                    </div>
                );
            }else{
                return (<div key = { index }></div>);
            }
        })
    }

    return (
        <div className={styles.second_step}>
            <p>请将您上传的文件信息与闪闪系统的信息进行匹配</p>
            <p>无配对的文件信息将不会导入系统</p>
            <div className={styles.mapping_detail}>
                <div className={styles.left}>
                    <p>闪闪表单</p>
                    <p>配对数据</p>
                    <div className={styles.map}>
                        <QueueAnim type={[ 'right' , 'right' ]} delay={100}>
                            { matchData.length > 0 ?
                                matchData
                                :
                                <NullData height = { 398 } content = '无数据'/>
                            }
                        </QueueAnim>
                    </div>
                </div>
                <div className={styles.right}>
                    <p>未配对文件数据</p>
                    <div className={styles.mis_map}>
                        <QueueAnim type={[ 'right' , 'right' ]} delay={100}>
                            { misMatchData.length > 0 ?
                                misMatchData
                                :
                                <NullData height = { 398 } content = '无数据'/>
                            }
                        </QueueAnim>
                    </div>
                </div>
            </div>
		</div>
    );
};

export default SecondStep;
