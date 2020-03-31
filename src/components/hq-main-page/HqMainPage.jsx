import React from 'react';
import moment from 'moment';
import styles from './HqMainPage.less';
import { Select , DatePicker , Card ,Spin } from 'antd';
import TmkHome from '../../components/hq-main-page/TmkHome'
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;

function HqMainPage({
    loading,
    selectMonth,
    changeSelectMonth, //月份选择事件
    selectType,        //下拉框选择类型
    handleChange,     //下拉框选择事件
    handleChangeYear, //年份下拉框选择事件

    sellerJobList,  //销售工作报表
    sellerPerList,  //销售业绩表
    periodIndexList ,//学员销课表
    purMoneySortList ,//合同总金额数据列表
    costCourseMoneySortList, //消课总金额

    JumpRouter,    //报表路由跳转

    windowWidth,
    windowWidthLevel,
    WindowOnReSize,

    tmkHomeProps,
}){
    let totalList = [...sellerJobList, ...sellerPerList, ...periodIndexList];

    function monthChange(date, dateString) {
        changeSelectMonth(dateString);
    }
    /*浏览器宽度实时改变事件*/
    window.onresize = function(){
        if(document.getElementById("wyp_home_card") != null){
            WindowOnReSize(document.getElementById("wyp_home_card").offsetWidth);
        }
    }
    return(
        <div>
            <div className = {styles.home_top}>
                <span>全局选择</span>
                <div className = {styles.home_top_select}>
                    <Select
                        defaultValue="today"
                        allowClear = { false }
                        onChange={handleChange}
                        style={{ width: 200 ,height :28 }}>
                        <Option value="today">今日</Option>
                        <Option value="yesterday">昨日</Option>
                        <Option value="currentWeek">本周</Option>
                        <Option value="lastWeek">上周</Option>
                        <Option value="currentMonth">本月</Option>
                        <Option value="lastMonth">上月</Option>
                        <Option value="year">年份</Option>
                        <Option value="month">月份</Option>
                    </Select>
                    {selectType == 'month' ?
                        <MonthPicker
                            allowClear = {false}
                            onChange={monthChange}
                            placeholder="选择月份"
                            style = {{marginLeft:'10px'}}
                            />
                    : null
                    }
                    {selectType == 'year' ?
                        <Select
                                onChange={handleChangeYear}
                                allowClear = { false }
                                style={{ width: 200 ,height :28 ,marginLeft:'10px'}}
                                placeholder="选择年份">
                            <Option value="2012">2012</Option>
                            <Option value="2013">2013</Option>
                            <Option value="2014">2014</Option>
                            <Option value="2015">2015</Option>
                            <Option value="2016">2016</Option>
                            <Option value="2017">2017</Option>
                            <Option value="2018">2018</Option>
                            <Option value="2019">2019</Option>
                            <Option value="2020">2020</Option>
                            <Option value="2021">2021</Option>
                            <Option value="2022">2022</Option>
                        </Select>
                    : null
                    }
                </div>
            </div>

            <Spin tip="报表加载中..." spinning={loading}>
            <div className = { styles.home_all }>
                <div className = {styles.home_title}><span></span><span>核心数据</span></div>
                <div className = {styles.home_card} id = 'wyp_home_card'>
                    { !!totalList && totalList.length>0 && totalList.map((item, index) =>
                        <Card className = 'home_card_item'
                            key= {index}
                            onClick = {()=>JumpRouter(item)}
                            className={
                                    windowWidthLevel == 'Lv1' ? 'home_card_item_Lv1' :
                                    windowWidthLevel == 'Lv2' ? 'home_card_item_Lv2' :
                                    windowWidthLevel == 'Lv3' ? 'home_card_item_Lv3' :
                                    windowWidthLevel == 'Lv4' ? 'home_card_item_Lv3' : undefined
                                }
                            >
                            <div className = 'home_card_item_icon'>
                            {item.smallKey =='oldStuPurMoney' ?
                                    <img src='https://img.ishanshan.com/gimg/img/b4896baf9e72176ac0f11efe34dbca13'/>
                                :item.smallKey =='oldStuPurNum' ?
                                    <img src='https://img.ishanshan.com/gimg/img/a5c34671a3be036d3c2d834a39624b24'/>
                                :item.smallKey =='costTotalMoney' ?
                                    <img src='https://img.ishanshan.com/gimg/img/e0a97f9dd9ee0d24177951fc0e164925'/>
                                :item.smallKey =='costTotalNum' ?
                                    <img src='https://img.ishanshan.com/gimg/img/d3645f9c74c8ac328063c6cfa5235e66'/>
                                :item.smallKey =='newStuPurMoney' ?
                                    <img src='https://img.ishanshan.com/gimg/img/2d43070f294270825ebf823a800e50d8'/>
                                :item.smallKey =='newStuPurNum' ?
                                    <img src='https://img.ishanshan.com/gimg/img/ee44b33fc0e7fae26a28364b604be43f'/>
                                :item.smallKey =='newLeads' ?
                                    <img src='https://img.ishanshan.com/gimg/img/4338f8204b5f2045c6619e155b85e15b'/>
                                :item.smallKey =='totalPurMoney' ?
                                    <img src='https://img.ishanshan.com/gimg/img/21735cb57add9b2a321f701d71bda92d'/>
                                :item.smallKey =='totalPurNum' ?
                                    <img src='https://img.ishanshan.com/gimg/img/299f437d7de839853941a7b984c6bcc5'/>
                                :null

                                }
                            </div>
                            <div className = 'home_card_item_date'>
                                <div className = 'home_card_item_date_top'>{item.num}</div>
                                <div className = 'home_card_item_title'>{item.name}</div>

                                <div className = 'home_card_item_date_bot'>
                                    {selectType =='today' || selectType =='yesterday'?
                                        <span className = 'home_card_item_date_time'>较上一天</span>
                                        :
                                    selectType =='currentWeek' || selectType =='lastWeek'?
                                        <span className = 'home_card_item_date_time'>较上一周</span>
                                        :
                                    selectType =='currentMonth' || selectType =='lastMonth' || selectType =='month'?
                                        <span className = 'home_card_item_date_time'>较上一月</span>
                                        :
                                    selectType =='year'?
                                        <span className = 'home_card_item_date_time'>较上一年</span>
                                        : null
                                    }

                                    {!!item.plus?
                                        <span className = 'home_card_item_date_per' style={{color:'#54AC41'}}>{item.rate}</span>
                                        :
                                        <span className = 'home_card_item_date_per'style={{color:'#D0021B'}}>{item.rate}</span>
                                    }
                                </div>

                            </div>
                        </Card>
                    )}
                </div>

                <div className = {styles.home_title}><span></span><span>TMK数据</span></div>
                <TmkHome {...tmkHomeProps} />

                <div className = {styles.home_title} style={{marginTop:'10px'}}><span></span><span>校区排行</span></div>
                <div className = {styles.home_rank}>
                    <div className = {styles.home_rank_item}>
                        <div className = {styles.home_rank_item_title}>总合同金额排名</div>
                        <div className = {styles.home_rank_item_list}>
                            {
                                purMoneySortList.length>0 && purMoneySortList.map((item,index)=>
                                <p className = {styles.home_rank_item_item} key={index}>
                                        <span>{index+1}</span>
                                        <span>{item.orgName}</span>
                                        <span>￥{item.totalPurMoney}</span>
                                    </p>
                            )}

                        </div>
                    </div>
                    <div className = {styles.home_rank_item}>
                        <div className = {styles.home_rank_item_title}>消课总金额排名</div>
                        <div className = {styles.home_rank_item_list}>
                            {
                                costCourseMoneySortList.length>0 && costCourseMoneySortList.map((item,index)=>
                                <p className = {styles.home_rank_item_item} key={index}>
                                        <span>{index+1}</span>
                                        <span>{item.orgName}</span>
                                        <span>￥{item.periodCostMoney}</span>
                                    </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            </Spin>
        </div>
    )
}

export default HqMainPage;
