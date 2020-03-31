import React from 'react';
import { Button , Form , Input , Select , DatePicker , message , Icon , Spin , Popconfirm } from 'antd';
import { StatusFlag , NullData } from '../../../../../common/new-component/NewComponent';
import styles from './VisitingPlan.less';
const Option = Select.Option;

/*到访记录*/
function VisitingPlan({
    leadsFollowVisitingPlanContentLoading,      //当前到访计划loading状态
    leadsFollowVisitingPlanContent,             //当前leads到访计划list
    leadsFollowVisitingPlanScrollFinish,        //滚动加载是否完成(即数据加载完毕)

    LeadsFollowVisitingPlanScrollBottom,        //leads到访计划已经滑动到最底部
    LeadsFollowVisitingPlanAddOrEditItem,       //leads到访计划新增编辑
    LeadsFollowVisitingPlanChangeItemStatus,    //leads到访计划改变状态
}){

    let visitingPlan = [];  //到访计划
    let IntroHeight = 0;    //详情介绍高度
    let allHeight = 0;      //预约试听记录总高度

    //到访计划
    if(leadsFollowVisitingPlanContent && leadsFollowVisitingPlanContent.length > 0){
        visitingPlan = leadsFollowVisitingPlanContent.map((item,index) => {
            return(
                <div className={styles.visiting_plan_list_item} key = { index }>
                    <div className={styles.visiting_plan_list_item_title}>
                        <p><span>到访时间：</span><span>{ item.visitTime || '--' }</span></p>
                        <div>
                            {item.status == '待跟进' ?
                                <StatusFlag
                                    type = { item.status == '已关闭' ? 'gray' :
                                             item.status == '已到访' ? 'yellow' : 'blue'}>{ item.status || '无' }</StatusFlag>
                                :
                                <StatusFlag
                                        type = { item.status == '已关闭' ? 'gray' :
                                                 item.status == '已到访' ? 'yellow' : 'blue'}>{ item.status || '无' }</StatusFlag>
                            }
                        </div>
                    </div>
                    <div className={styles.visiting_plan_list_item_content}>
                        <div className={styles.visiting_plan_list_item_img}>
                            <img src='https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443' width='60px' height='60px'/>
                        </div>
                        <div className={styles.visiting_plan_list_item_name}>
                            <StatusFlag type = 'light_blue'>{ item.stuName || '--' }</StatusFlag>
                        </div>
                        {/*<div className={styles.visiting_plan_list_item_parent}>
                            跟进家长：{ item.parentName || '--' }
                        </div>*/}
                        <div className={styles.visiting_plan_list_item_operation}>
                            { /*待跟进状态才能编辑和关闭*/ }
                            { item.status == '待跟进' ?
                                <a onClick = {() => LeadsFollowVisitingPlanAddOrEditItem('edit',item)}>编辑</a>
                                :
                                null
                            }
                            { item.status == '待跟进' ?
                                <Popconfirm placement="left" title='更新为已到访？' okText="是" cancelText="否" onConfirm={() => LeadsFollowVisitingPlanChangeItemStatus(item.id,'1')} >
                                    <a>确认</a>
                                </Popconfirm>
                                :
                                null
                            }
                            { item.status == '待跟进' ?
                                <Popconfirm placement="left" title='确定关闭吗' okText="是" cancelText="否" onConfirm={() => LeadsFollowVisitingPlanChangeItemStatus(item.id,'0')} >
                                    <a>关闭</a>
                                </Popconfirm>
                                :
                                null
                            }
                        </div>
                        {/*超过110个字显示省略号*/}
                        <div className={styles.visiting_plan_list_item_intro}>
                            { item.content && item.content.length > 110 ? item.content.substr(0,110) + '...' : item.content }
                        </div>
                    </div>
                </div>
            );
        })
    }

    //跟进记录高度设置
    if(document.getElementById('leads_detail_message')){
        IntroHeight = document.getElementById('leads_detail_message').clientHeight
    }

    allHeight = 70 + IntroHeight + 47 + 20 + 28 + 10;     //最上面菜单的高度+信息的高度+tab的高度+外层内边距+按钮高度+按钮下外边距

    //检测滚动条是否滚动到页面底部
    function isScrollToBottom(){
        let div = document.getElementById('leads_visiting_plan_inner_list');
        //已经滚动到底部,且数据没有加载完毕时才发请求
        if(div.clientHeight + div.scrollTop >= div.scrollHeight && div.scrollTop > 0 && !leadsFollowVisitingPlanScrollFinish){
            setTimeout(LeadsFollowVisitingPlanScrollBottom,100);
        }
    }

    return(
        <div className={styles.leads_visiting_plan_inner} onScroll={ isScrollToBottom } >
            <Button type='primary' style={{ width : 120 , marginBottom : 10 }} onClick = {() => LeadsFollowVisitingPlanAddOrEditItem('add')}>添加到访计划</Button>
            <Spin spinning = { leadsFollowVisitingPlanContentLoading }>
                <div className={styles.leads_visiting_plan_inner_list} id='leads_visiting_plan_inner_list' style={{height:`calc(100vh - ${allHeight}px)`}}>
                    { visitingPlan || [] }
                    {
                      visitingPlan.length == 0 ?
                        <NullData height = '200px' content = '没有更多了'/>
                        :
                      leadsFollowVisitingPlanScrollFinish ?
                        <div className={styles.leads_visiting_plan_inner_bottom}>
                            <span>没有更多了</span>
                        </div>
                        :
                        <div className={styles.leads_visiting_plan_inner_bottom}>
                            <Icon type="loading" style={{fontSize:'2rem'}}/>
                            <span>加载中...</span>
                        </div>
                    }
                </div>
            </Spin>
        </div>
    );
}

export default VisitingPlan;
