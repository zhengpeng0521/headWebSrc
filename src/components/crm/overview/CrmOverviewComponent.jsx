import React from 'react';
import Media from 'react-media';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';
import styles from './CrmOverviewComponent.less';
import { Spin,DatePicker,Icon,Popover } from 'antd';
import { NullData } from '../../common/new-component/NewComponent';
import StuRechart from './OverViewStuRechart';
import SalesOrderRechart from './OverViewSalesOrderRechart';
import StuSignBySelfPage from '../../../pages/erp/stu-sign/StuSignBySelfPage';

const MonthPicker = DatePicker.MonthPicker;

function CrmOverviewComponent ({
    loading,
    selectMonth,                /*全局选择日期*/
    changeSelectMonth,

    /*上方数据看板*/
    topDataBoard,               /*上方数据看板数据*/

    /*右方当日数据看板*/
    rightDataBoard,             /*右方数据看板数据*/

    /*学员栏表格*/
    stuDate,                    /*学员栏日期显示*/
    stuTableMessage,            /*学员信息table数据*/
    stuChartMessage,            /*学员信息chart数据*/
    StuMonthChange,             /*学员栏日期选择*/

    /*销售订单*/
    salesOrderDate,             /*销售订单栏历日期显示*/
    salesOrderChartData,        /*销售订单chart数据*/
    salesOrderCalenderData,     /*销售订单calender数据*/
    SalesOrderOnPanelChange,    /*销售订单栏日历日期选择事件*/

    /*漏斗图*/
    funnelData,                 /*漏斗图数据*/
    funnelLoading,              /*漏斗图加载状态*/
    JumpToOtherRouter,          /*点击区块跳转到相应路由*/
}) {

    function monthChange(date, dateString) {
        changeSelectMonth(dateString);
    }

    /*学员栏*/
    let stuRechartProps = {
        selectMonth,            /*全局选择日期*/
        stuDate,                /*学员栏日期显示*/
        stuTableMessage,        /*学员信息table数据*/
        stuChartMessage,        /*学员信息chart数据*/
        StuMonthChange,         /*学员栏日期选择*/
    };

    /*销售订单*/
    let salesOrderRechartProps = {
        selectMonth,                /*全局选择日期*/
        salesOrderDate,             /*销售订单栏历日期显示*/

        /*销售订单rechart*/
        salesOrderChartData,        /*销售订单chart数据*/

        /*销售订单table*/
        salesOrderCalenderData,     /*销售订单calender数据*/
        SalesOrderOnPanelChange     /*销售订单栏日历日期选择事件*/
    };

    let topDate;                /*上方日期*/
    let funnelRender = [];      /*漏斗图*/

    /*新增学员，跟进学员，跟进记录月份显示*/
    if(parseInt(selectMonth.substr(5,2))<10){
        topDate = selectMonth.substr(6,1)
    }else{
        topDate = selectMonth.substr(5,2)
    }

    let date = new Date();
    let month = date.getMonth()+1;

    /*渲染漏斗图只取前7项*/
    if(funnelData && funnelData.length > 0){
        funnelRender = funnelData.slice(0,7).map((item,index) => {
            return(
                <div className={styles.funnel_pic_item} key = { index  + '' }>
                    <div className={styles.funnel_pic_item_name}>
                        <span><Popover placement="left" content={ item.v + ''} trigger="hover">{ item.v + ''}</Popover></span>
                        <div></div>
                    </div>
                    <span></span>
                    <div className={styles.funnel_pic_item_area} onClick = {() => JumpToOtherRouter('crm_leads_mine',item.k)}>{ item.num + '' }</div>
                </div>
            );
        })
    }

    return (
            <div className={styles.crm_overview_cont} >
                <div className={styles.month_data_cont}>
                   <Spin tip="闪电般的速度加载中..." spinning={loading}>

                        <div className={styles.title_and_month_seelct}>
                            <div className={styles.overview_title}>我的数据看板</div>
                            <div className={styles.overview_month_cont}>
                                <span className={styles.overview_month_text}>全局选择</span>
                                <MonthPicker value={moment(selectMonth, 'YYYY-MM')} onChange={monthChange} placeholder="请选择月份" />
                            </div>
                        </div>

                        <div className={styles.month_data_list} >
                            <div className={styles.month_data_item_cont} onClick = {() => JumpToOtherRouter('crm_leads_mine','new_leads')}>
                                <div className={styles.month_data_item}>
                                    <div className={styles.month_data_item_icon_cont} style={{backgroundColor: '#5D9CEC'}}>
                                        <Icon type="home-xzxy" className={styles.month_data_item_icon}/>
                                    </div>
                                    <div className={styles.month_data_item_num}>
                                        <div className={styles.title_num}>
                                            {   month == topDate ?
                                                parseInt(topDataBoard.newlyLeads || 0) + parseInt(rightDataBoard.newlyLeads || 0)
                                                :
                                                parseInt(topDataBoard.newlyLeads || 0)
                                            }
                                        </div>
                                        <div className={styles.title_num_text}><span className={styles.normal_color}>{topDate}月</span>新增名单</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.month_data_item_cont} onClick = {() => JumpToOtherRouter('crm_follow_mine')}>
                                <div className={styles.month_data_item}>
                                    <div className={styles.month_data_item_icon_cont} style={{backgroundColor: '#8175C7'}}>
                                        <Icon type="menu-xygl" className={styles.month_data_item_icon}/>
                                    </div>
                                    <div className={styles.month_data_item_num}>
                                        <div className={styles.title_num}>
                                            {   month == topDate ?
                                                parseInt(topDataBoard.followRecord || 0) + parseInt(rightDataBoard.followRecord || 0)
                                                :
                                                parseInt(topDataBoard.followRecord || 0)
                                            }
                                        </div>
                                        <div className={styles.title_num_text}><span className={styles.normal_color}>{topDate}月</span>跟进记录</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.month_data_item_cont} onClick = {() => JumpToOtherRouter('crm_leads_mine')}>
                                <div className={styles.month_data_item}>
                                    <div className={styles.month_data_item_icon_cont} style={{backgroundColor: '#FBB323'}}>
                                        <Icon type="menu-xyjz" className={styles.month_data_item_icon}/>
                                    </div>
                                    <div className={styles.month_data_item_num}>
                                        <div className={styles.title_num}>
                                            { parseInt(topDataBoard.leadsNum) || 0 }
                                        </div>
                                        <div className={styles.title_num_text}><span className={styles.normal_color}></span>名单总数</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.month_data_item_cont} onClick = {() => JumpToOtherRouter('crm_sorder_list')}>
                                <div className={styles.month_data_item}>
                                    <div className={styles.month_data_item_icon_cont} style={{backgroundColor: '#A9D86E'}}>
                                        <Icon type="menu-tjbb" className={styles.month_data_item_icon}/>
                                    </div>
                                    <div className={styles.month_data_item_num}>
                                        <div className={styles.title_num}>
                                            {   month == topDate ?
                                                parseInt(topDataBoard.orderNum || 0) + parseInt(rightDataBoard.orderNum || 0)
                                                :
                                                parseInt(topDataBoard.orderNum || 0)
                                            }
                                        </div>
                                        <div className={styles.title_num_text}><span className={styles.normal_color}>{topDate}月</span>合同数</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.month_data_item_cont} onClick = {() => JumpToOtherRouter('crm_sorder_list')}>
                                <div className={styles.month_data_item}>
                                    <div className={styles.month_data_item_icon_cont} style={{backgroundColor: '#FF6C60'}}>
                                        <Icon type="menu-xsdd" className={styles.month_data_item_icon}/>
                                    </div>
                                    <div className={styles.month_data_item_num}>
                                        <div className={styles.title_num}>
                                            {   month == topDate ?
                                                Math.round(topDataBoard.orderAmount || 0) + Math.round(rightDataBoard.orderAmount || 0)
                                                :
                                                Math.round(topDataBoard.orderAmount || 0)
                                            }
                                        </div>
                                        <div className={styles.title_num_text}><span className={styles.normal_color}>{topDate}月</span>合同金额</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <Spin spinning = { funnelLoading }>
                            <div className={styles.today_follow_list_and_funnel}>
                                <div className={styles.today_follow_list} onClick = {() =>JumpToOtherRouter('crm_leads_mine','today_need_follow')}>
                                    <div>
                                        <img src='https://img.ishanshan.com/gimg/img/8181b9c89ff0f8913995c9fe72cfbc09'/>
                                    </div>
                                    <div>
                                        <div>{ rightDataBoard.needFollow || 0 }</div>
                                        <div>今日需要跟进名单</div>
                                    </div>
                                </div>
                                <div className={styles.funnel}>
                                    <div className={styles.funnel_left}>销售漏斗</div>
                                    { funnelData && funnelData.length > 0 ?
                                        <div className={styles.funnel_pic}>
                                            { funnelRender || [] }
                                        </div>
                                        :
                                        <NullData content = '请在[设置]里完善学生跟进状态' height = '100%' width = 'calc(100% - 56px)'/>
                                    }
                                </div>
                            </div>
                        </Spin>
                        <div className={styles.add_stu_recharts_cont}>
                            <StuRechart {...stuRechartProps}/>
                        </div>
                        <div className={styles.add_stu_recharts_cont}>
                            <SalesOrderRechart {...salesOrderRechartProps}/>
                        </div>
                    </Spin>
                </div>

                <div className={styles.today_data_cont}>
                    <div className={styles.today_date_list}>
                        <QueueAnim type={[ 'right' , 'right' ]} delay={500}>

                            <div className={styles.sign_self_cont} key='a'>
                                <StuSignBySelfPage />
                            </div>

                            <div className={styles.today_data_item_one} key='b'>
                                <div className={styles.today_data_item_icon_cont} >
                                    <img src="https://img.ishanshan.com/gimg/img/69518749a6f83c213c01e9124cb2782c" />
                                </div>

                                <div className={styles.today_data_num_cont} key = 'c'>
                                    <div className={styles.today_data_num}>
                                        { rightDataBoard.followRecord || 0 }
                                    </div>
                                    <div className={styles.today_data_num_text}>今日跟进记录</div>
                                </div>
                            </div>

                            <div className={styles.today_data_item_two} key='d'>
                                <div className={styles.today_data_item_icon_cont} >
                                    <img src="https://img.ishanshan.com/gimg/img/69518749a6f83c213c01e9124cb2782c" />
                                </div>

                                <div className={styles.today_data_num_cont}>
                                    <div className={styles.today_data_num}>
                                        { rightDataBoard.newlyLeads || 0 }
                                    </div>
                                    <div className={styles.today_data_num_text}>今日新增名单</div>
                                </div>
                            </div>
                        </QueueAnim>
                    </div>
                </div>
            </div>
    );
}

export default CrmOverviewComponent;
