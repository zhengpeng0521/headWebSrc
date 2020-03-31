import React from 'react';
import styles from './OverViewSalesOrderRechart.less';
import moment from 'moment';
import { Calendar , DatePicker} from 'antd';
import { NullData } from '../../common/new-component/NewComponent';
const MonthPicker = DatePicker.MonthPicker;
import {LineChart, Line, XAxis, YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer} from 'recharts';

function OverViewSalesOrderRechart ({
    selectMonth,                /*全局选择日期*/
    salesOrderDate,             /*销售订单栏历日期显示*/

    /*销售订单rechart*/
    salesOrderChartData,        /*销售订单chart数据*/

    /*销售订单table*/
    salesOrderCalenderData,     /*销售订单calender数据*/
    SalesOrderOnPanelChange     /*销售订单栏日历日期选择事件*/
}) {

    /*日历日内添加内容*/
    function dateCellRender(value) {
        for(let i in salesOrderCalenderData){
            if(value.format('YYYY-MM-DD') == salesOrderCalenderData[i].rightDate){
                return (
                    <div style={{textAlign:'center',marginTop:'9px',color:'rgb(169, 216, 110)',fontWeight:'600'}}>
                        {salesOrderCalenderData[i].orderNum}
                    </div>
                );
            }else{
                continue;
            }
        }
    }

    /*chart悬浮设置*/
    function SalesOrderTooltip(props){
        if (props.active) {
            const { payload, label } = props;
            let map = [];
            if(payload && payload.length > 0){
                map = payload.map((item,index) => {
                    return(
                        <p className={styles.inner} style={{color:item.stroke}} key={index}>
                            {item.dataKey}:{item.value}
                        </p>
                    );
                })
            }
            return (
                <div className={styles.Popover}>
                    <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.rightDate}</p>
                    { map || [] }
                </div>
            );
        }
        return null;
    };

    return (
        <div className = 'overview_rechart_cont' style={{position:'relative'}}>
            { salesOrderChartData.length > 0 ?
                <ResponsiveContainer width="60%" height={330} >
                    <LineChart data={salesOrderChartData}>
                        <XAxis dataKey='leftDate' interval="preserveStartEnd" tickLine={false}/>
                        <YAxis yAxisId={0}/>
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ top : '2%' }}/>
                        <Tooltip content={ <SalesOrderTooltip/> }/>
                        <CartesianGrid stroke='#EEE' vertical={false}/>
                        <Line type='monotone' dataKey='合同订单数' stroke='rgb(169, 216, 110)' yAxisId={0} strokeWidth={2}/>
                    </LineChart>
                </ResponsiveContainer>
                :
                <NullData height = '330px' width = '60%'/>
            }

            <div style={{position:'absolute',top:'3%',right:'0'}}>
                <MonthPicker value={salesOrderDate != '' && salesOrderDate != null && salesOrderDate != undefined ? moment(salesOrderDate) : moment(selectMonth)} placeholder="请选择月份" onChange={SalesOrderOnPanelChange}/>
            </div>
            <div style={{position:'absolute',top:'10%',right:'0',width:'40%',height:'90%',overflow:'hidden'}} className='zj_crm_overview_calender'>
                <Calendar
                    fullscreen={true}
                    dateCellRender={dateCellRender}
                    value={salesOrderDate != '' && salesOrderDate != null && salesOrderDate != undefined ? moment(salesOrderDate) : moment(selectMonth)}
                    />
            </div>
        </div>
    );
}

export default OverViewSalesOrderRechart;
