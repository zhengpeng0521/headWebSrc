import React from 'react';
import { Checkbox , Input , Button , Spin ,Radio } from 'antd';
import { BlockTitle } from '../../common/new-component/NewComponent';
import styles from './check-on-work-attendance.less';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

/*考勤小票预览*/
function checkOnWorkAttendance({
    loading,            //是否加载状态
    attendWorkStatus,   //出勤状态
    leaveWorkStatus,    //请假状态
    outSchoolStatus,    //旷课状态
    cancelStatus,       //取消状态
    changeStatus1,       //单选框改变事件
    changeStatus2,
    changeStatus3,
    changeStatus4,
    SaveAttendance,      //保存
}) {

    function attendWorkFunction(e){
        let data1=e.target.value;
        changeStatus1(data1);
    }
    function leaveWorkFunction(e){
        let data2=e.target.value;
        changeStatus2(data2);
    }
    function outSchoolFunction(e){
        let data3=e.target.value;
        changeStatus3(data3);
    }


    //保存
     let arr=[];
    function SaveAttendanceFunction(){

        let obj1={};
        let obj2={};
        let obj3={};
        let obj4={};

        obj1.status='1'; obj1.key='attendance'; obj1.text='出勤';  obj1.value=attendWorkStatus;
        obj2.status='1'; obj2.key='leave';      obj2.text='请假';  obj2.value=leaveWorkStatus;
        obj3.status='1'; obj3.key='truant';     obj3.text='旷课';  obj3.value=outSchoolStatus;
        //obj4.status='1'; obj4.key='cancel';     obj4.text='取消';  obj4.value=cancelStatus;

        arr.push(obj1);
        arr.push(obj2);
        arr.push(obj3);
        //arr.push(obj4);

        SaveAttendance(JSON.stringify(arr));



    }
    return(
        <div className={styles.small_ticket_all_content}>
            <Spin spinning={loading}>
                <div className={styles.small_ticket_preview}>
                    <BlockTitle content = '考勤课时设置'/>
                    <div className={styles.check_on_work_attendance_title}>扣除课时的数量由课程设置决定</div>
                    <ul className={styles.check_on_work_attendance_list}>
                        <li>
                            <p>考勤类型</p>
                            <div className={styles.check_on_work_title}>是否扣课时</div>
                        </li>
                        <li>
                            <p>出勤</p>
                            <div className={styles.radio_group}>
                                <RadioGroup onChange={attendWorkFunction} value={attendWorkStatus}>
                                    <Radio value='1'>是</Radio>
                                    <Radio value='0'>否</Radio>
                                </RadioGroup>
                            </div>
                        </li>
                        <li>
                            <p>请假</p>
                            <div className={styles.radio_group}>
                                <RadioGroup onChange={leaveWorkFunction} value={leaveWorkStatus}>
                                    <Radio value='1'>是</Radio>
                                    <Radio value='0'>否</Radio>
                                </RadioGroup>
                            </div>
                        </li>
                        <li>
                            <p>旷课</p>
                            <div className={styles.radio_group}>
                                <RadioGroup onChange={outSchoolFunction} value={outSchoolStatus}>
                                    <Radio value='1'>是</Radio>
                                    <Radio value='0'>否</Radio>
                                </RadioGroup>
                            </div>
                        </li>
                    </ul>
                    <Button type="primary" onClick={SaveAttendanceFunction}>保存</Button>
                </div>

            </Spin>
        </div>
    );
}

export default checkOnWorkAttendance;
