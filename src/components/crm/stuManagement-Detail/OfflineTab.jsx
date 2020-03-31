import React from 'react';
import { Button , Form , Input , Select , DatePicker , message , Icon , Spin , Popconfirm } from 'antd';
import { StatusFlag , NullData } from '../../common/new-component/NewComponent';
import moment from 'moment';
import styles from './OfflineTab.less';
const Option = Select.Option;

/*预约试听*/
function Reservation({
    leadsFollowReservationContentLoading,      //当前预约试听loading状态
    leadsFollowReservationContent,             //当前leads预约试听list
    leadsFollowReservationScrollFinish,        //滚动加载是否完成(即数据加载完毕)

    LeadsFollowReservationScrollBottom,        //leads预约试听已经滑动到最底部
    LeadsFollowReservationAddOrEditItem,       //leads预约试听新增编辑
    LeadsFollownewReservationChangeItemStatus,    //leads预约试听改变状态
}){

    let reservation = [];
    if(leadsFollowReservationContent && leadsFollowReservationContent.length > 0){
        reservation = leadsFollowReservationContent.map((item,index) => {
			let startDateTime = !!item.auditionTime && moment( item.auditionTime ).format('YYYY-MM-DD HH:mm') || '';
			let endDateTime = !!item.auditionEndTime && moment( item.auditionEndTime ).format('HH:mm') || '';
            return(
                <div className={styles.reservation_list_item} key = { index }>
                    <div className={styles.reservation_list_item_title}>
                        <p><span>课程名称：</span><span style = {{ marginRight : '10px', color : '#999' }}>{ item.courseName || '--' }</span><span>上课时间：</span><span>{ ( !!item.auditionTime && startDateTime + '~' + endDateTime) || '--' }</span></p>
                        <div>
                            <StatusFlag
                                type = { item.status == '取消' ? 'red' :
                                    item.status == '已试听' ? 'green' :
                                        item.status == '旷课' ? 'yellow' :
                                            item.status == '无' ? 'gray' : 'blue'}>{ item.status || '无' }</StatusFlag>
                        </div>
                    </div>
                    <div className={styles.reservation_list_item_content}>
                        <div className={styles.reservation_list_item_img}>
                            <img src='https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443' width='60px' height='60px'/>
                        </div>
                        <div className={styles.reservation_list_item_name}>
                            <StatusFlag>{ item.stuName || '--' }</StatusFlag>
                        </div>
                        <div className={styles.reservation_list_item_operation}>
                            { /*待跟进状态才能编辑和关闭*/ }
                            { item.status != '取消' ?
                                <Popconfirm placement="left" title='确定关闭吗' okText="是" cancelText="否" onConfirm={() =>  LeadsFollownewReservationChangeItemStatus(item.id,'0')} >
                                    <span>取消</span>
                                </Popconfirm>
                                :
                                null
                            }
                        </div>
                        {/*超过110个字显示省略号*/}
                        <div className={styles.reservation_list_item_intro}>
                            { item.remark && item.remark.length > 110 ? item.remark.substr(0,110) + '...' : item.remark }
                        </div>
                    </div>
                </div>
            );
        })
    }

    //跟进记录高度设置
    let IntroHeight;
    if(document.getElementById('stu_manage_detail_message')){
        IntroHeight = document.getElementById('stu_manage_detail_message').clientHeight;
    }

    let allHeight = 70 + Number(IntroHeight) + 47 + 20 + 28 + 10;     //最上面菜单的高度+信息的高度+tab的高度+外层内边距+按钮高度+按钮下外边距

    //检测滚动条是否滚动到页面底部
    function isScrollToBottom(){
        let div = document.getElementById('leads_reservation_inner_list');
        //已经滚动到底部,且数据没有加载完毕时
        if(div.clientHeight + div.scrollTop >= div.scrollHeight && div.scrollTop > 0 && !leadsFollowReservationScrollFinish){
            setTimeout(LeadsFollowReservationScrollBottom,100);
        }
    }

    return(
        <div className={styles.leads_reservation_inner} onScroll={ isScrollToBottom } >
            <Button type='primary' style={{ width : 120 , marginBottom : 10 }} onClick = {() => LeadsFollowReservationAddOrEditItem('add')}>添加预约试听</Button>
            <Spin spinning = { leadsFollowReservationContentLoading }>
                <div className={styles.leads_reservation_inner_list} id='leads_reservation_inner_list' style={{height:`calc(100vh - ${allHeight}px)`}}>
                    { reservation || [] }
                    { reservation.length == 0 ?
                        <NullData height = '200px' content = '没有更多了'/>
                        :
                        leadsFollowReservationScrollFinish ?
                            <div className={styles.leads_reservation_inner_bottom}>
                                <span>没有更多了</span>
                            </div>
                            :
                            <div className={styles.leads_reservation_inner_bottom}>
                                <Icon type="loading" style={{fontSize:'2rem'}}/>
                                <span>加载中...</span>
                            </div>
                    }
                </div>
            </Spin>
        </div>
    );
}

export default Reservation;
