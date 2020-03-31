import React from 'react';
import styles from './StuAttendance.less';
import {Modal, Button,Rate,DatePicker,Pagination,Spin} from 'antd';
import { NullData } from '../../common/new-component/NewComponent';
import moment from 'moment';

function StuAttendanceComponent ({
    orgId,
	dataSource,
	loading ,
    pageIndex,
    pageSize,
    total,
	studyDate,
	todayDate,
    tomButtonLoading,   //下一天按钮加载状态
    yesButtonLoading,   //上一天按钮加载状态

    dateChange,
    yestDaychange,
    nextDaychange,

    stuattendancerecord,
    stuattendanceChange,

    PageOnChange,          //分页改变

    /*补打小票*/
    OpenPrintSmallTicketModal,      //打开补打小票modal

}) {

    var date1 = new Date(studyDate);
    var date2 = new Date(todayDate);
    var istrue = true;
	if (date1.getTime() == date2.getTime()){
		istrue = true;
	}else {
		istrue = false;
	}
    function disabledDate(current) {
		return current && current.valueOf() > Date.now(studyDate);
    }

    function disabledDateTime() {
        return {
            disabledHours: () => range(0, 24).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }

    let stuattendance = [];
    if(dataSource && dataSource.length > 0){
        stuattendance = dataSource.map((item,index) => {
            if ( istrue ){
                return(
                    <div className={styles.stuAttendancecontone} key = { 'stuAttendance_content_one_' + index }>
                        <div className={styles.stuAttendancecontone_title}>
                            <div className={styles.stuAttendance_item_left}>
                                <div className={styles.stuAttendance_item_left_top}>
                                    <p><span>课程名称：</span><span>{ item.courseName || '--' }</span></p>
                                    <p>
                                        {/*默认展示月龄形式*/}
                                        <span>
                                            { item.courseAgeType == '2' ? '适合年龄' : '适合月龄' }：
                                        </span>
                                        <span>
                                            { item.courseAgeType == '2' ?
                                                (!isNaN(parseFloat(item.minMa)) && !isNaN(parseFloat(item.maxMa)) ?
                                                    (Math.floor(parseFloat(item.minMa)/12) || 0)  + '~' + (Math.floor(parseFloat(item.maxMa)/12) || 0) + '岁'
                                                    :
                                                    '年龄信息不合法'
                                                 )
                                                :
                                                (item.minMa || 0)  + '~' + (item.maxMa || 0) + '月'
                                            }
                                        </span>
                                    </p>
                                    <p><span>消耗课时：</span><span>{ item.cost || '--'}</span></p>
                                    <p><span>日期：</span><span>{ item.studyDate }</span></p>
                                    <p><span>时间段：</span><span>{ item.startTime + '-' + item.endTime }</span></p>
                                </div>
                                <div className={styles.stuAttendance_item_left_bottom}>
                                    <p><span>主教：</span><span>{ item.mtNames || '--' }</span></p>
                                    <p><span>助教：</span><span>{ item.atNames || '--' }</span></p>
                                    <p><span>教室：</span><span>{ item.roomName || '--' }</span></p>
                                    <p><span>所属校区：</span><span>{ item.orgName || '--'}</span></p>
                                    <p><span></span><span></span></p>
                                    <div></div>
                                </div>
                            </div>
                            <div className={styles.stuAttendance_item_right}>
                                <Button type='primary' disabled = { !!orgId ? false : true } style={{ width : 80 , marginRight : 10 }} onClick = {() =>  stuattendanceChange(item)}>考勤</Button>
                                <Button type='ghost' style={{ width : 80 , background : '#fff' }} onClick = {() => OpenPrintSmallTicketModal(item)}>补打小票</Button>
                            </div>
                        </div>

                        <div className={styles.stuAttendancecontback}>
                            <p className={styles.stuAttendancemyp}><img  className={styles.stuAttendanceimg} src='https://img.ishanshan.com/gimg/img/f5bf97ef0a65c4cd035d99b48746cbf8' />
                                <span className={styles.stuAttendancespanone}>上课学员</span>
                                <span className={styles.stuAttendancespantwo}>{ (item.num || 0)  + '/' + (item.maxNum || 0) + '(' + (item.lineNum || 0) + ')' }</span>
                            </p>
                            <p className={styles.stuAttendancemyp}>
                                <img  className={styles.stuAttendanceimg} src='https://img.ishanshan.com/gimg/img/80d783e249f9eccf88b64b8bc910be33' />
                                <span  className={styles.stuAttendancespanone}>补课学员</span>
                                <span className={styles.stuAttendancespantwo} >{ (item.mulNum || 0) + '/' + (item.maxMulNum || 0) }</span>
                            </p>
                            <p className={styles.stuAttendancemyp}><img className={styles.stuAttendanceimg} src='https://img.ishanshan.com/gimg/img/70024b1ffab1ee4e23fbd7a6be6accf0' />
                                <span className={styles.stuAttendancespanone} >预约试听</span>
                                <span className={styles.stuAttendancespantwo} >{ (item.tryNum || 0)  + '/' + (item.maxTryNum || 0) }</span>
                            </p>
                        </div>
                    </div>
                );
            }else{
                return (
                    <div className={styles.stuAttendanceconttwo} key = { 'stuAttendance_content_two_' + index }>
                        <div className={styles.stuAttendancecontone_title}>
                            <div className={styles.stuAttendance_item_left}>
                                <div className={styles.stuAttendance_item_left_top}>
                                    <p><span>课程名称：</span><span>{ item.courseName || '--' }</span></p>
                                    <p>
                                        {/*默认展示月龄形式*/}
                                        <span>
                                            { item.courseAgeType == '2' ? '适合年龄' : '适合月龄' }：
                                        </span>
                                        <span>
                                            { item.courseAgeType == '2' ?
                                                (!isNaN(parseFloat(item.minMa)) && !isNaN(parseFloat(item.maxMa)) ?
                                                    (Math.floor(parseFloat(item.minMa)/12) || 0)  + '~' + (Math.floor(parseFloat(item.maxMa)/12) || 0) + '岁'
                                                    :
                                                    '年龄信息不合法'
                                                 )
                                                :
                                                (item.minMa || 0)  + '~' + (item.maxMa || 0) + '月'
                                            }
                                        </span>
                                    </p>
                                    <p><span>消耗课时：</span><span>{ item.cost || '--' }</span></p>
                                    <p><span>日期：</span><span>{ item.studyDate }</span></p>
                                    <p><span>时间段：</span><span>{ item.startTime   + '-' + item.endTime }</span></p>
                                </div>
                                <div className={styles.stuAttendance_item_left_bottom}>
                                    <p><span>主教：</span><span>{ item.mtNames || '--' }</span></p>
                                    <p><span>助教：</span><span>{ item.atNames || '--' }</span></p>
                                    <p><span>教室：</span><span>{ item.roomName || '--' }</span></p>
                                    <p><span>所属校区：</span><span>{ item.orgName || '--' }</span></p>
                                    <p></p>
                                    <div></div>
                                </div>
                            </div>
                            <div className={styles.stuAttendance_item_right}>
                                <Button type='primary' disabled = { !!orgId ? false : true } style={{ width : 80 , marginRight : 10 }} onClick = {() =>  stuattendancerecord(item)}>明细</Button>
                                <Button type='ghost' style={{ width : 80 , background : '#fff' }} onClick = {() => OpenPrintSmallTicketModal(item)}>补打小票</Button>
                            </div>
                        </div>
                        <div className={styles.stuAttendancecontbacknew}>
                            <p className={styles.stuAttendancecontbacknewmyp}>
                                <div className={styles.stuAttendancecontbacknewmyp_top}>
                                    <img  className={styles.stuAttendanceimg} src='https://img.ishanshan.com/gimg/img/f5bf97ef0a65c4cd035d99b48746cbf8' />
                                    <span className={styles.stuAttendancecontbacknewone}>上课学员</span>
                                    <span className={styles.stuAttendancecontbacknewtwo}>{ (item.num || 0) + '/' + (item.maxNum || 0) + '(' + (item.lineNum || 0) + ')' }</span>
                                </div>
                                <div className={styles.stuAttendancecontbacknewthree}>
                                    <span className={styles.stuAttendancecontbacknewzlone}>{'出勤:' + (item .cq || 0) }</span>
                                    <span className={styles.stuAttendancecontbacknewzltwo}>{'请假:' + (item .qj || 0) }</span>
                                    <span className={styles.stuAttendancecontbacknewzlthree}>{'旷课:' +(item .kk || 0) }</span>
                                    <span className={styles.stuAttendancecontbacknewzlfour}>{'取消:' + (item .qx || 0)}</span>
                                </div>
                            </p>
                            <p className={styles.stuAttendancecontbacknewmyp}>
                                <div className={styles.stuAttendancecontbacknewmyp_top}>
                                    <img  className={styles.stuAttendanceimg} src='https://img.ishanshan.com/gimg/img/80d783e249f9eccf88b64b8bc910be33' />
                                    <span className={styles.stuAttendancecontbacknewone}>补课学员</span>
                                    <span className={styles.stuAttendancecontbacknewtwo}>{ (item.mulNum || 0) + '/' + (item.maxMulNum || 0) }</span>
                                </div>
                                <div className={styles.stuAttendancecontbacknewthree}>
                                    <span className={styles.stuAttendancecontbacknewzlone}>{'出勤:' + (item .bkcq || 0) }</span>
                                    <span className={styles.stuAttendancecontbacknewzltwo}>{'请假:' + (item .bkqj || 0) }</span>
                                    <span className={styles.stuAttendancecontbacknewzlthree}>{'旷课:' +(item .bkkk || 0) }</span>
                                    <span className={styles.stuAttendancecontbacknewzlfour}>{'取消:' + (item .bkqx || 0)}</span>
                                </div>
                            </p>
                            <p className={styles.stuAttendancecontbacknewmyp}>
                                <div className={styles.stuAttendancecontbacknewmyp_top}>
                                    <img  className={styles.stuAttendanceimg} src='https://img.ishanshan.com/gimg/img/70024b1ffab1ee4e23fbd7a6be6accf0' />
                                    <span className={styles.stuAttendancecontbacknewone}>预约试听</span>
                                    <span className={styles.stuAttendancecontbacknewtwo}>{ (item.tryNum || 0)   + '/' + (item.maxTryNum || 0) }
                                    </span>
                                </div>
                                <div className={styles.stuAttendancecontbacknewthree}>
                                    <span className={styles.stuAttendancecontbacknewzlone}>{'已试听:' + (item .st || 0) }</span>
                                    <span className={styles.stuAttendancecontbacknewzltwo}>{'旷课:' + (item .stkk || 0)}</span>
                                    <span className={styles.stuAttendancecontbacknewzlthree}>{'取消:' + (item .stqx || 0)}</span>
                                </div>
                            </p>
                        </div>
                    </div>
                );
            }
        })
    }else{
        stuattendance.push(
            <NullData/>
        )
    }

    //跟进记录高度设置
    let IntroHeight;
    if(document.getElementById('common_detail_inner_list')){
        IntroHeight = document.getElementById('common_detail_inner_list').clientHeight
    }

    let allHeight = 50 + IntroHeight + 10 + 46 + 50;     //最上面菜单的高度+日期选择的高度+外边距+面包屑+分页

    const dateFormat = 'YYYY-MM-DD';

    return (
        <div className={styles.bigstuAttendance}>
            <Spin spinning = { loading }>
                <div className={styles.stuAttendance} id ='common_detail_inner_list'>
                   <span style={{ fontSize : 12  }}> 日期选择:</span>
                    <span> &nbsp;&nbsp;</span>
                        <DatePicker
                            size = 'default'
                            style = {{ width : '220px' }}
                            value = {  studyDate ? moment(studyDate, dateFormat) : moment(todayDate, dateFormat)}
                            format={dateFormat}
                            onChange={dateChange}
                            disabledDate={disabledDate}
                            disabledTime={disabledDateTime}
                            showToday
                        />
                    <Button className={styles.stuAttendanceyestDay} type='primary' style={{ width : 80  }} onClick = {() =>  yestDaychange('add')}>上一天</Button>
                    <Button className={styles.stuAttendancenextDay} disabled={ istrue } type='primary' style={{ width : 80  }} onClick = {() =>  nextDaychange('add')} >下一天</Button>
                </div>
                <div className={styles.stuAttendancecont } id='stuAttendancecont_inner_list' style={{height:`calc(100vh - ${allHeight}px)`}} >
                    <div className={styles.stuAttendanceconttest }>
                        { stuattendance || [] }
                    </div>
                </div>
                <div className={styles.pagination}>
                    <Pagination
                        showQuickJumper
                        showSizeChanger
                        current = { pageIndex + 1 }
                        pageSize = { pageSize }
                        onChange = { PageOnChange }
                        onShowSizeChange = { PageOnChange }
                        total = { total }
                        showTotal = {total => `共${total}条`}/>
                </div>
            </Spin>
       </div>
    );
}

export default StuAttendanceComponent;
