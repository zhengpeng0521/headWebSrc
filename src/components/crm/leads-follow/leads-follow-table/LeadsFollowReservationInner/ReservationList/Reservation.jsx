import React from 'react';
import { Button , Form , Input , Select , DatePicker , message , Icon , Spin , Popconfirm } from 'antd';
import { StatusFlag , NullData } from '../../../../../common/new-component/NewComponent';
import moment from 'moment';
import styles from './Reservation.less';
const Option = Select.Option;

/*预约试听*/
function Reservation({
    leadsFollowDetailLeadMessage,              //选中leads名单查看详情时当前人的信息
    leadsFollowReservationContentLoading,      //当前预约试听loading状态
    leadsFollowReservationContent,             //当前leads预约试听list
    leadsFollowReservationScrollFinish,        //滚动加载是否完成(即数据加载完毕)

    LeadsFollowReservationScrollBottom,        //leads预约试听已经滑动到最底部
    LeadsFollowReservationAddOrEditItem,       //leads预约试听新增编辑
    LeadsFollowReservationChangeItemStatus,    //leads预约试听改变状态
}){

    let reservation = [];   //预约试听记录
    let IntroHeight = 0;    //详情介绍高度
    let allHeight = 0;      //预约试听记录总高度
    //当前租户下所有的机构(预约试听需要判断机构类型orgKind，是1早教类还是2培训类)
    let tenantOrgId = window._init_data.orgIdList;
    let orgKind = undefined;


    //当前租户下所有的机构(预约试听需要判断机构类型orgKind，是1早教类还是2培训类)
    for(let i in tenantOrgId){
        if(tenantOrgId[i].orgId == leadsFollowDetailLeadMessage.orgId){
            orgKind = tenantOrgId[i].orgKind;
            break;
        }
    }

    //预约试听记录
    if(leadsFollowReservationContent && leadsFollowReservationContent.length > 0){
        reservation = leadsFollowReservationContent.map((item,index) => {
            return(
                <div className={styles.reservation_list_item} key = { index }>
                    <div className={styles.reservation_list_item_title}>
                        <div className={styles.reservation_list_item_title_left}>
                            <p><span>课程名称：</span><span>{ item.courseName || '--' }</span></p>
                            <p><span>预约时间：</span><span>{ (moment(item.auditionTime).format('YYYY-MM-DD HH:mm') || '--') + '~' + (moment(item.auditionEndTime).format('HH:mm') || '--') }</span></p>
                        </div>
                        <div className={styles.reservation_list_item_title_right}>
                            <StatusFlag
                                    type = { item.status == '取消' ? 'red' :
                                             item.status == '已预约' ? 'blue' :
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
                            <StatusFlag type = 'light_blue'>{ item.stuName || '--' }</StatusFlag>
                        </div>
                        <div className={styles.reservation_list_item_operation}>
                            { /*待跟进状态才能编辑和关闭*/ }
                            { item.status == '已预约'?

                                <a onClick={() => LeadsFollowReservationChangeItemStatus(item.id,'0',orgKind)}>取消</a>
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
    if(document.getElementById('leads_detail_message')){
        IntroHeight = document.getElementById('leads_detail_message').clientHeight;
    }

    allHeight = 70 + IntroHeight + 47 + 20 + 28 + 10;     //最上面菜单的高度+信息的高度+tab的高度+外层内边距+按钮高度+按钮下外边距

    //检测滚动条是否滚动到页面底部
    function isScrollToBottom(){
        let div = document.getElementById('leads_reservation_inner_list');
        //已经滚动到底部,且数据没有加载完毕时才发请求
        if(div.clientHeight + div.scrollTop >= div.scrollHeight && div.scrollTop > 0 && !leadsFollowReservationScrollFinish){
            setTimeout(LeadsFollowReservationScrollBottom,100);
        }
    }

    return(
        <div className={styles.leads_reservation_inner} onScroll={ isScrollToBottom } >
            <Button type='primary' style={{ width : 120 , marginBottom : 10 }} onClick = {() => LeadsFollowReservationAddOrEditItem()}>添加预约试听</Button>
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
