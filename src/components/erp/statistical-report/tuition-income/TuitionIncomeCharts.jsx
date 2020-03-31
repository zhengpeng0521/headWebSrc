import React from 'react';
import { Table, Popconfirm, Button, Icon, Radio, Spin } from 'antd';
import { Surface, Pie, BarChart, Bar, XAxis, YAxis,ZAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,PieChart, Sector, Cell,Treemap,ReferenceLine,Brush,ScatterChart,Scatter,AreaChart,Area,ResponsiveContainer } from 'recharts';
import styles from './TuitionIncome.less';

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} style={{fontSize:'18px',fontWeight:'700'}}>{payload.paymentValue}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{fontSize:'15px',fontWeight:'600'}}>{`${value}`}元</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" style={{fontSize:'15px',fontWeight:'600'}}>
            {`(占比 ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};
const colors = ['#5D9CEC', '#8175C7', '#FBB323', '#A9D86E', '#FF6C60', '#88e9d8'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x  = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

//学费收入销售统计报表
function Charts({
    ChangeIndex,                //饼状图鼠标移动事件
    activeIndex,                //饼状图鼠标hover索引

    orgTimeRange,               //校区时间范围
    courseTimeRange,            //课程时间范围
    payWayTimeRange,            //支付方式时间范围

    orgListLoading,             //图表1加载状态
    courseListLoading,          //图表2加载状态
    payWayListLoading,          //图表3加载状态

    orgData,                    //校区统计数据
    courseData,                 //课程统计数据
    payWayData,                 //饼状图统计数据

    HandleExport,               //导出
  }) {

    function onPieEnter(data, index){
        ChangeIndex(data, index);
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
                        <p className={styles.inner} style={{color:'#5d9cec'}}>收入:{payload[0].payload.realMoney}元</p>
                    </div>
                );
            }
            return null;
        }
    });

    const CourseTooltip = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.Title}</p>
                        <p className={styles.inner} style={{color:'#5d9cec'}}>收入:{payload[0].payload.money}元</p>
                    </div>
                );
            }
            return null;
        }
    });

    return (
        <div className={styles.AllCharts}>
            <div className={styles.Bar}>
                <div className={styles.Button}>
                    <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('couorg')}>
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
                    { orgData == '' || orgData == null || orgData == undefined || orgData == [] ?
                        <div className={styles.barCharts}
                             style={{ height : 282  , width : '100%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af' style = {{ marginBottom : 5 }}/>
                            <div style = {{ cursor : 'default' , fontSize : '1rem' , color : '#999' }}>暂无数据</div>
                        </div>
                        :
                        <div className={styles.barCharts}>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart
                                    data={orgData}
                                    barSize={60}
                                    margin={{top: 30, right: 40, left: 15, bottom: 30}} >
                                    <XAxis dataKey="orgName" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip cursor={false} content={ <OrgTooltip/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="realMoney" stackId="a" fill="#5d9cec"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    }
                </Spin>
            </div>

            <div className={styles.Bar}>
                <div className={styles.Button}>
                    <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('course')}>
                        <Button type="primary" style={{float:'right',marginRight:'10px'}}><Icon type="upload" />导出数据</Button>
                    </Popconfirm>
                </div>
                <div className={styles.titleArea}>
                    <p className={styles.titleName}>课程收入排行
                        {'' == courseTimeRange || '' == courseTimeRange.startTime || '' == courseTimeRange.endTime?
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>近30日</span>
                            )
                        </span>
                        :
                        <span style={{color:'#999999',marginLeft:'20px'}}>(
                            <span style={{marginLeft:'4px'}}>{courseTimeRange.startTime}</span>
                            <span>~</span>
                            <span style={{marginLeft:'10px',marginRight:'4px'}} >{courseTimeRange.endTime}</span>)
                        </span>
                        }
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>最多显示前10，查看全部请导出报表</span>
                            )
                        </span>
                    </p>
                </div>
                <Spin tip="Loading..." spinning={courseListLoading}>
                    { courseData == '' || courseData == null || courseData == undefined || courseData == [] ?
                        <div className={styles.barCharts}
                             style={{ height : 282  , width : '100%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af' style = {{ marginBottom : 5 }}/>
                            <div style = {{ cursor : 'default' , fontSize : '1rem' , color : '#999' }}>暂无数据</div>
                        </div>
                        :
                        <div className={styles.barCharts}>
                            <ResponsiveContainer width="100%" height={280} >
                                <BarChart
                                    data={courseData}
                                    barSize={60}
                                    margin={{top: 30, right: 40, left: 15, bottom: 30}} >
                                    <XAxis dataKey="title" height={20} stroke="#666666" tickLine={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false}/>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip cursor={false} content={ <CourseTooltip/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="money" stackId="a" fill="#5d9cec"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    }
                </Spin>
            </div>

            <div className={styles.Pie}>
                <div className={styles.Button}>
                     <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('pay')}>
                        <Button type="primary" style={{float:'right',marginRight:'10px'}}><Icon type="upload" />导出数据</Button>
                    </Popconfirm>
                </div>
                <div className={styles.titleArea}>
                    <p className={styles.titleName}>支付方式
                        {'' == payWayTimeRange || '' == payWayTimeRange.startTime || '' == payWayTimeRange.endTime?
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>近30日</span>
                            )
                        </span>
                        :
                        <span style={{color:'#999999',marginLeft:'20px'}}>(
                            <span style={{marginLeft:'4px',marginRight:'10px'}}>{payWayTimeRange.startTime}</span>
                            <span>~</span>
                            <span style={{marginLeft:'10px',marginRight:'4px'}} >{payWayTimeRange.endTime}</span>)
                        </span>
                        }
                    </p>
                </div>
                <Spin tip="Loading..." spinning={payWayListLoading}>
                    { payWayData == '' || payWayData == null || payWayData == undefined || payWayData == [] ?
                        <div className={styles.pieCharts}
                             style={{ height : 400  , width : '100%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af' style = {{ marginBottom : 5 }}/>
                            <div style = {{ cursor : 'default' , fontSize : '1rem' , color : '#999' }}>暂无数据</div>
                        </div>
                        :
                        <div className={styles.pieCharts}>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart onMouseEnter={onPieEnter} >
                                    <Pie
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        data={payWayData}
                                        innerRadius={80}
                                        outerRadius={150}
                                        minAngle={1}
                                        fill="#8884d8"
                                        paddingAngle={1.5}
                                        >
                                        {
                                            payWayData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[index]}/>
                                            ))
                                        }
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    }
                </Spin>
            </div>
        </div>
    );
}

export default Charts;
