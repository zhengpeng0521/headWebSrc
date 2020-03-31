import React from 'react';
import { Form, Input, Modal, Button, message, Select, Checkbox, Radio, Spin } from 'antd';
import { NullData } from '../../../common/new-component/NewComponent';
import expect from './render.json';         //需要渲染的内容
import styles from './CheckCourseModal.less';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

/*cerp当前学员排课信息modal*/
const CheckCourseModal = ({
    cerpOverviewCheckCourseModalType,       //查看排课信息modal类型('all'全部排课/'stu'当前学生排课)
    cerpOverviewCheckCourseModalVisible,    //查看排课信息modal是否显示
    cerpOverviewCheckCourseModalLoading,    //查看排课信息modal加载状态
    allArrangeCourseList,                   //全部排课信息
    curentArrangeCourseList,                //当前学员的排课信息(select下拉选中之后)

    CurrentStuSignQuery,                    //当前学员选中一项排课信息查询
    CerpOverviewCurrentStuModalCancel,      //当前学员排课信息modal关闭
    PrintCourseSignList,                    //按课程打印签到表
}) => {

    //排课数据渲染
    function detailRender(expect,target){
        let arr = [];
        for(let i in expect){
            if(expect[i].value == 'studyDate' && target.startTime != null && target.endTime != null){
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <span>{ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + ' ' + target.startTime + '~' + target.endTime : '--' }</span>
                    </p>
                )
            }else{
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <span>{ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }</span>
                    </p>
                )
            }
        }
        return arr;
    }

    //渲染排课信息
    let courseDetail = [];
    let renderList = [];
    if(cerpOverviewCheckCourseModalType == 'all'){
        renderList = allArrangeCourseList;          //若是查询全部排课，则渲染此数组
    }else if(cerpOverviewCheckCourseModalType == 'stu'){
        renderList = curentArrangeCourseList;       //若是查询当前学员排课，则渲染此数组
    }
    if(renderList && renderList.length > 0){
        //如果超出4个，出现滚动条，右边与滚动条之间需要拉开20px的距离
        let length = renderList.length;
        courseDetail = renderList.map((item,index) => {
            //详情信息渲染
            let detail = detailRender(expect,item);
            return(
                <div className={styles.course_message} style={ length < 4 ? { width : '100%' } : { width : 'calc(100% - 20px)' } } key = { index + '' }>
                    <div className={styles.course_detail} onClick = { () => CurrentStuSignQuery(item.cpmId,item.cpdId) }>
                        <div className={styles.course_detail_title}>
                            <div>{ item.courseName || '佚名课程'}</div>
                            <div>上课人数：
                                { !isNaN(parseFloat(item.num)) && !isNaN(parseFloat(item.maxNum)) ?
                                    ( parseFloat(item.num) >= parseFloat(item.maxNum)  ?
                                        <span style={{ color : '#ff7f75' }}>{item.num}/{item.maxNum}</span>
                                        :
                                        item.num + '/' + item.maxNum
                                    )
                                    :
                                    '--'
                                }
                            </div>
                            <div>补课人数：
                                    { !isNaN(parseFloat(item.mulNum)) && !isNaN(parseFloat(item.maxMulNum)) ?
                                        ( parseFloat(item.mulNum) >= parseFloat(item.maxMulNum)  ?
                                            <span style={{ color : '#ff7f75' }}>{item.mulNum}/{item.maxMulNum}</span>
                                            :
                                            item.mulNum + '/' + item.maxMulNum
                                        )
                                        :
                                        '--'
                                    }
                                </div>
                            <div>试听人数：
                                { !isNaN(parseFloat(item.tryNum)) && !isNaN(parseFloat(item.maxTryNum)) ?
                                    ( parseFloat(item.tryNum) >= parseFloat(item.maxTryNum)  ?
                                        <span style={{ color : '#ff7f75' }}>{item.tryNum}/{item.maxTryNum}</span>
                                        :
                                        item.tryNum + '/' + item.maxTryNum
                                    )
                                    :
                                    '--'
                                }
                            </div>
                        </div>
                        <div className={styles.course_detail_content}>
                            { detail || [] }
                        </div>
                    </div>
                    {/*<Button type = 'primary' onClick = {() => PrintCourseSignList(item)}>打印签到表</Button>*/}
                </div>
            );
        })
    }else{
        courseDetail = (
            <NullData content = '暂无课程信息' height = 'inherit'/>
        )
    }

    function handleCancel(e) {
        e.preventDefault();
        CerpOverviewCurrentStuModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '排课查询',
        maskClosable : false,
        visible : cerpOverviewCheckCourseModalVisible,
        closable : true,
        width : 550,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>关闭</Button>,
        ],
        className : 'cerp_overview_current_stu_modal'
    };

    return (
        <Modal {...modalOpts}>
            <Spin spinning = { cerpOverviewCheckCourseModalLoading }>
                <div className={styles.content}>
                    { courseDetail }
                </div>
            </Spin>
        </Modal>
    );
};

export default CheckCourseModal;
