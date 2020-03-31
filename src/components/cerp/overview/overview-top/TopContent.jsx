import React from 'react';
import { Button , Select , Spin } from 'antd';
import { NullData } from '../../../common/new-component/NewComponent';
import expect from './render.json';         //需要从第一条数据中渲染的内容
import styles from './TopContent.less';
const Option = Select.Option;

/*cerp首页上方*/
const TopContent = ({
    stuDetail,                              //学员信息
    firstArrangeCourse,                     //默认第一条的排课信息
    topLeftLoading,                         //首页按课程签到加载状态
    topRightLoading,                        //按学员签到加载状态
    courseAlertNum,                         //续费提醒课时数

    CheckAllCourseMessage,                  //点击查看全部排课
    LeftBottomCheckSignQuery,               //左侧下方灰色区域点击事件查询考勤明细
    StuSelectOnChange,                      //选择学员onChange查看当前学员的排课数据
    PrintCourseSignList,                    //按课程打印签到表
    JumpToCourseAlertList,                  //查看续费提醒明细
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

    //详情信息渲染
    let detail = [];
    if(firstArrangeCourse && firstArrangeCourse.length > 0){
        detail = detailRender(expect,firstArrangeCourse[0]);
    }

    //学员下拉列表渲染
    let stu = []
    if(stuDetail && stuDetail.length > 0){
        stu = stuDetail.map((item,index) => {
            return(
                <Option key = { index + '' } value = { item.stuId }>{ item.stuName }</Option>
            );
        })
    }

    return (
        <div className={styles.top_all}>
            <Spin spinning = { topLeftLoading }>
                <div className={styles.left}>
                    <div className={styles.left_top}>
                        <div className={styles.left_top_left}>
                            <div>排课签到</div>
                            <a onClick = { CheckAllCourseMessage }>查看全部排课</a>
                        </div>
                        {/*<Button type = 'primary' disabled = { firstArrangeCourse && firstArrangeCourse.length > 0 ? false : true } onClick = {() => PrintCourseSignList(firstArrangeCourse[0])}>打印签到表</Button>*/}
                    </div>
                    { firstArrangeCourse && firstArrangeCourse.length > 0 ?
                        <div className={styles.left_bottom} onClick = { () => LeftBottomCheckSignQuery(firstArrangeCourse[0].cpmId,firstArrangeCourse[0].cpdId) }>
                            <div className={styles.left_bottom_title}>
                                <div>{ firstArrangeCourse[0].courseName || '佚名课程'}</div>
                                <div>上课人数：
                                    { !isNaN(parseFloat(firstArrangeCourse[0].num)) && !isNaN(parseFloat(firstArrangeCourse[0].maxNum)) ?
                                        ( parseFloat(firstArrangeCourse[0].num) >= parseFloat(firstArrangeCourse[0].maxNum)  ?
                                            <span style={{ color : '#ff7f75' }}>{firstArrangeCourse[0].num}/{firstArrangeCourse[0].maxNum}</span>
                                            :
                                            firstArrangeCourse[0].num + '/' + firstArrangeCourse[0].maxNum
                                        )
                                        :
                                        '--'
                                    }
                                </div>
                                <div>补课人数：
                                    { !isNaN(parseFloat(firstArrangeCourse[0].mulNum)) && !isNaN(parseFloat(firstArrangeCourse[0].maxMulNum)) ?
                                        ( parseFloat(firstArrangeCourse[0].mulNum) >= parseFloat(firstArrangeCourse[0].maxMulNum)  ?
                                            <span style={{ color : '#ff7f75' }}>{firstArrangeCourse[0].mulNum}/{firstArrangeCourse[0].maxMulNum}</span>
                                            :
                                            firstArrangeCourse[0].mulNum + '/' + firstArrangeCourse[0].maxMulNum
                                        )
                                        :
                                        '--'
                                    }
                                </div>
                                <div>试听人数：
                                    { !isNaN(parseFloat(firstArrangeCourse[0].tryNum)) && !isNaN(parseFloat(firstArrangeCourse[0].maxTryNum)) ?
                                        ( parseFloat(firstArrangeCourse[0].tryNum) >= parseFloat(firstArrangeCourse[0].maxTryNum)  ?
                                            <span style={{ color : '#ff7f75' }}>{firstArrangeCourse[0].tryNum}/{firstArrangeCourse[0].maxTryNum}</span>
                                            :
                                            firstArrangeCourse[0].tryNum + '/' + firstArrangeCourse[0].maxTryNum
                                        )
                                        :
                                        '--'
                                    }
                                </div>
                            </div>
                            <div className={styles.left_bottom_content}>
                                { detail || [] }
                            </div>
                        </div>
                        :
                        <NullData content = '今日暂无排课信息' height = 'calc("80% - 10px")'/>
                    }
                </div>
            </Spin>
            <div className={styles.right}>
                <div className={styles.right_top}>排课签到</div>
                <Spin spinning = { topRightLoading }>
                    <div className={styles.right_bottom}>
                        <Select
                            notFoundContent = "未找到学员"
                            showSearch
                            allowClear
                            size = 'default'
                            placeholder = '请选择学员'
                            style = {{ width : '100%' }}
                            optionFilterProp = "children"
                            onChange = { StuSelectOnChange }>
                            { stu || [] }
                        </Select>
                    </div>
                </Spin>
            </div>
            <div className={styles.course_alert}>
                <div className={styles.course_alert_top}>
                    <p>续费提醒</p>
                    <a onClick = { JumpToCourseAlertList }>详细></a>
                </div>
                <div className={styles.alert_num}>
                    { courseAlertNum }
                </div>
            </div>
        </div>
    );
};

export default TopContent;
