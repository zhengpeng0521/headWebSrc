import React from 'react';
import { Table, Popconfirm, Button, Icon, Radio, Spin } from 'antd';
import { Surface, Pie, BarChart, Bar, XAxis, YAxis,ZAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,PieChart, Sector, Cell,Treemap,ReferenceLine,Brush,ScatterChart,Scatter,AreaChart,Area,ResponsiveContainer } from 'recharts';
import styles from './TextbookSales.less';

//统计报表 教材销售
function Charts({
    orgTimeRange,           //校区收入时间范围
    textTimeRange,          //教材统计时间范围
    orgListLoading,         //图表1加载状态
    textListLoading,        //图表2加载状态
    orgListData,            //校区统计数据
    textListData,           //教材统计数据
    HandleExport,           //导出
  }) {

    function onPieEnter(data, index){
        changeIndex(data, index);
    }

    /*悬浮设置*/
    const OrgTooltip = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.orgname}</p>
                        <p className={styles.inner} style={{color:'#5d9cec'}}>收入:{payload[0].payload.money}元</p>
                    </div>
                );
            }
            return null;
        }
    });

    const TextTooltip = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.taname}</p>
                        <p className={styles.inner} style={{color:'#5d9cec'}}>收入:{payload[0].payload.money}元</p>
                    </div>
                );
            }
            return null;
        }
    });

    return (
        <div className={styles.AllCharts}>
            <div className={styles.FirstBar}>
                <div className={styles.Button}>
                    <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('orgta')}>
                        <Button type="primary" style={{float:'right'}}><Icon type="upload" />导出数据</Button>
                    </Popconfirm>
                </div>
                <div className={styles.titleArea}>
                    <p className={styles.titleName}>校区收入排行
                        {'' == orgTimeRange || '' == orgTimeRange.startTime || '' == orgTimeRange.endTime?
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>近30日</span>
                            )
                        </span>
                        :
                        <span style={{color:'#999999',marginLeft:'20px'}}>(
                            <span style={{marginLeft:'4px',marginRight:'10px'}}>{orgTimeRange.startTime}</span>
                            <span>~</span>
                            <span style={{marginLeft:'10px',marginRight:'4px'}} >{orgTimeRange.endTime}</span>)
                        </span>
                        }
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>最多显示前10，查看全部请导出报表</span>
                            )
                        </span>
                    </p>
                </div>
                <Spin tip="Loading..." spinning={orgListLoading}>
                    { orgListData == '' || orgListData == null || orgListData == undefined || orgListData == [] ?
                        <div className={styles.barCharts}
                             style={{ height : 282  , width : '100%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af' style = {{ marginBottom : 5 }}/>
                            <div style = {{ cursor : 'default' , fontSize : '1rem' , color : '#999' }}>暂无数据</div>
                        </div>
                        :
                        <div className={styles.barCharts}>
                            <ResponsiveContainer width="100%" height={280} >
                                <BarChart
                                    data={orgListData}
                                    barSize={60}
                                    margin={{top: 30, right: 40, left: 15, bottom: 30}} >
                                    <XAxis dataKey="orgName" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip cursor={false} content={ <OrgTooltip/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="money" stackId="a" fill="#5d9cec"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    }
                </Spin>
            </div>

            <div className={styles.SecondBar}>
                <div className={styles.Button}>
                    <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('ta')}>
                        <Button type="primary" style={{float:'right'}}><Icon type="upload" />导出数据</Button>
                    </Popconfirm>
                </div>
                <div className={styles.titleArea}>
                    <p className={styles.titleName}>教材统计
                        {'' == textTimeRange || '' == textTimeRange.startTime || '' == textTimeRange.endTime?
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>近30日</span>
                            )
                        </span>
                        :
                        <span style={{color:'#999999',marginLeft:'20px'}}>(
                            <span style={{marginLeft:'4px',marginRight:'10px'}}>{textTimeRange.startTime}</span>
                            <span>~</span>
                            <span style={{marginLeft:'10px',marginRight:'4px'}} >{textTimeRange.endTime}</span>)
                        </span>
                        }
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>最多显示前10，查看全部请导出报表</span>
                            )
                        </span>
                    </p>
                </div>
                <Spin tip="Loading..." spinning={textListLoading}>
                    { textListData == '' || textListData == null || textListData == undefined || textListData == [] ?
                        <div className={styles.barCharts}
                             style={{ height : 282  , width : '100%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af' style = {{ marginBottom : 5 }}/>
                            <div style = {{ cursor : 'default' , fontSize : '1rem' , color : '#999' }}>暂无数据</div>
                        </div>
                        :
                        <div className={styles.barCharts}>
                            <ResponsiveContainer width="100%" height={280} >
                                <BarChart
                                    data={textListData}
                                    barSize={60}
                                    margin={{top: 30, right: 40, left: 15, bottom: 30}} >
                                    <XAxis dataKey="taName" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip cursor={false} content={ <TextTooltip/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="money" stackId="a" fill="#5d9cec"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    }
                </Spin>
            </div>
        </div>
    );
}

export default Charts;
