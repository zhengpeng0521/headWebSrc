import React from 'react';
import styles from './OverViewStuRechart.less';
import moment from 'moment';
import { Calendar , Table , DatePicker} from 'antd';
import { NullData } from '../../common/new-component/NewComponent';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const MonthPicker = DatePicker.MonthPicker;

function OverviewStuRechart ({
    /*学员栏表格*/
    selectMonth,            /*全局选择日期*/
    stuDate,                /*学员栏日历日期显示*/
    stuTableMessage,        /*学员信息table数据*/
    stuChartMessage,        /*学员信息chart数据*/
    StuMonthChange,         /*学员栏日期选择*/
}) {

    //格式化列表数据，加入id主键
    let dataSource = stuTableMessage;
    for(let i in dataSource){
        dataSource[i].id = i;
    }

    //表头设置
    const columns=[{
        width: 80,
        title: '类型',
        dataIndex: 'type',
        key: 'type',
    },{
        width: 80,
        title: '总数',
        dataIndex: 'totalNum',
        key: 'totalNum',
    },{
        width: 80,
        title: '日均',
        dataIndex: 'averageDaily',
        key: 'averageDaily',
    }];

    /*chart悬浮设置*/
    function StuTooltip(props){
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
                    <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.dateTime}</p>
                    { map || [] }
                </div>
            );
        }
        return null;
    };

    return (
        <div className= 'overview_rechart_cont' style={{position:'relative'}}>
            { stuChartMessage.length > 0 ?
                <ResponsiveContainer width="60%" height={330} >
                    <LineChart
                        data={stuChartMessage}
                      >
                        <XAxis dataKey='specialTime' interval="preserveStartEnd" tickLine={false}/>
                        <YAxis yAxisId={0}/>
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ top : '2%' }}/>
                        <Tooltip content={ <StuTooltip/> }/>
                        <CartesianGrid stroke='#EEE' vertical={false}/>
                        <Line type='monotone' dataKey='跟进学员' stroke='rgb(129, 117, 199)' yAxisId={0} strokeWidth={2}/>
                        <Line type='monotone' dataKey='跟进记录' stroke='rgb(251, 179, 35)' yAxisId={0} strokeWidth={2}/>
                        <Line type='monotone' dataKey='新增学员' stroke='rgb(93, 156, 236)' yAxisId={0} strokeWidth={2}/>
                    </LineChart>
                </ResponsiveContainer>
                :
                <NullData height = '330px' width = '60%'/>
            }

            <div style={{position:'absolute',top:'3%',right:'0'}}>
                <MonthPicker value={stuDate != '' && stuDate != null && stuDate != undefined ? moment(stuDate) : moment(selectMonth)} placeholder="请选择月份" onChange={StuMonthChange}/>
            </div>
            <div style={{position:'absolute',top:'15%',right:'0',width:'40%',height:'100%',overflow:'auto'}} className='zj_crm_overview_table'>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                    rowKey="id"
                    />
            </div>
        </div>
    );
}

export default OverviewStuRechart;
