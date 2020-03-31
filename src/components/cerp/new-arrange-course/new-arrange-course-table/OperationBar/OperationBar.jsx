import React from 'react';
import { Popover , Icon , Radio , Popconfirm } from 'antd';
import styles from './OperationBar.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/*排课列表上方操作栏*/
function OperationBar({
    nowDate,                            //当前日期(只做保存，不做修改)
    startDate,                          //操作改变开始时间
    endDate,                            //操作改变结束时间
    radioGroupValue,                    //radiogroup的值
//    tableSelectedRowKeys,               //复选框选中对象的key数组
//    tableSelectedRows,                  //复选框选中对象的数组

    OperationQuery,                     //查询上一天/下一天 上一周/下一周数据
//    OperationChangeStatus,              //操作栏点击状态改变(这里只有删除)
//    OperationChangeEdit,                //操作栏点击编辑
    RadioGroupOnChange,                 //radioGroup的onChange事件
}){
    return(
        <div className={styles.all}>
            <div className={styles.operation}>
                {/*<span>已选（{tableSelectedRows.length || 0}）</span>
                <a onClick = {() => OperationChangeStatus('delete')}>删除</a>
                <a onClick = {() => OperationChangeEdit()}>编辑</a>*/}
            </div>
            {/*对于按天查询，startDate = endDate*/}
            { radioGroupValue == 'day' ?
                <div className={styles.chooseItem}>
                    <a onClick = {() => OperationQuery('yesterday')}>上一天</a>
                    <p>{ startDate }
                        { startDate == nowDate ?
                            <span style={{ color:'#ddd' , cursor : 'default' }}>（返回今天）</span>
                            :
                            <span style={{ color:'#5d9cec' , cursor : 'pointer' }} onClick = {() => OperationQuery('backToday')}>（返回今天）</span>
                        }
                    </p>
                    <a onClick = {() => OperationQuery('tomorrow')}>下一天</a>
                </div>
                :
              radioGroupValue == 'week' ?
                <div className={styles.chooseItem}>
                    <a onClick = {() => OperationQuery('lastWeek')}>上一周</a>
                    <p>{ startDate } ~ { endDate }
                        { new Date(startDate).getTime() < new Date(nowDate).getTime() && new Date(endDate).getTime() > new Date(nowDate).getTime() ?
                            <span style={{ color:'#ddd' , cursor : 'default' }}>（返回本周）</span>
                            :
                            <span style={{ color:'#5d9cec' , cursor : 'pointer' }} onClick = {() => OperationQuery('backToWeek')}>（返回本周）</span>
                        }
                    </p>
                    <a onClick = {() => OperationQuery('nextWeek')}>下一周</a>
                </div>
                :
                null
            }
            <div className={styles.radioGroup}>
                <div className='zj_new_arrange_corse_operation_radio_group'>
                    <RadioGroup value = { radioGroupValue } onChange = { RadioGroupOnChange }>
                        <RadioButton value="day">按天</RadioButton>
                        <RadioButton value="week">按周</RadioButton>
                    </RadioGroup>
                </div>
            </div>
        </div>
    );
}

export default OperationBar;
