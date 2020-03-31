import React from 'react';
import { Popover , Icon , Radio , Popconfirm } from 'antd';
import styles from './OperationBar.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/*排课列表上方操作栏*/
function OperationBar({
    currentDate,                        //当前日期(只做保存，不做修改)

    startDate,                          //操作改变开始时间
    endDate,                            //操作改变结束时间

    radioGroupValue,                    //radiogroup的值

    selectedRowKeys,                    //复选框选中对象的key数组
    selectedRows,                       //复选框选中对象的数组

    OperationQuery,                     //返回

	searchByLastDay,
	searchByNextDay,

    RadioGroupOnChange,                 //radioGroup的onChange事件

	updateStatus,                       //修改状态
	updateFix                           //修改固定位

}){
    return(
        <div className={styles.all}>
            <div className={styles.operation}>

            </div>
            {/*对于按天查询，startDate = endDate*/}
            { radioGroupValue == 'day' ?
                <div className={styles.chooseItem}>
                    <a onClick = { searchByLastDay }>上一天</a>
                    <p>{ startDate }
                        { startDate == currentDate ?
                            <span style={{ color:'#ddd' , cursor : 'default' }}>（返回今天）</span>
                            :
                            <span style={{ color:'#5d9cec' , cursor : 'pointer' }} onClick = {() => OperationQuery('backToday')}>（返回今天）</span>
                        }
                    </p>
                    <a onClick = { searchByNextDay }>下一天</a>
                </div>
                :
              radioGroupValue == 'week' ?
                <div className={styles.chooseItem}>
                    <a onClick = { searchByLastDay }>上一周</a>
                    <p>{ startDate } ~ { endDate }
                        { new Date(startDate).getTime() < new Date(currentDate).getTime() && new Date(endDate).getTime() > new Date(currentDate).getTime() ?
                            <span style={{ color:'#ddd' , cursor : 'default' }}>（返回本周）</span>
                            :
                            <span style={{ color:'#5d9cec' , cursor : 'pointer' }} onClick = {() => OperationQuery('backToWeek')}>（返回本周）</span>
                        }

                    </p>
                    <a onClick = { searchByNextDay }>下一周</a>
                </div>
                :
			  radioGroupValue == 'month' ?
                <div className={styles.chooseItem}>
                    <a onClick = { searchByLastDay }>上一月</a>
                    <p>{ startDate } ~ { endDate }
                        { new Date(startDate).getTime() < new Date(currentDate).getTime() && new Date(endDate).getTime() > new Date(currentDate).getTime() ?
                            <span style={{ color:'#ddd' , cursor : 'default' }}>（返回本月）</span>
                            :
                            <span style={{ color:'#5d9cec' , cursor : 'pointer' }} onClick = {() => OperationQuery('backToMonth')}>（返回本月）</span>
                        }

                    </p>
                    <a onClick = { searchByNextDay }>下一月</a>
                </div>
                :
                null
            }

            <div className={styles.radioGroup}>
                <div className='zj_new_arrange_corse_operation_radio_group'>
                    <RadioGroup value = { radioGroupValue } onChange = { RadioGroupOnChange }>
                        <RadioButton value = "day">按天</RadioButton>
                        <RadioButton value = "week">按周</RadioButton>
                        <RadioButton value = "month">按月</RadioButton>
                    </RadioGroup>
                </div>
            </div>
        </div>
    );
}

export default OperationBar;
