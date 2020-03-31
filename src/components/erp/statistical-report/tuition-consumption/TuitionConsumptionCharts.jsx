import React from 'react';
import { Table, Popconfirm, Button, Icon, Radio, Spin } from 'antd';
import { Surface, Pie, BarChart, Bar, XAxis, YAxis,ZAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,PieChart, Sector, Cell,Treemap,ReferenceLine,Brush,ScatterChart,Scatter,AreaChart,Area,ResponsiveContainer } from 'recharts';
import styles from './TuitionConsumption.less';

//统计报表 学费消耗
function Charts({
    storeTimeRange,         //门店图用于显示时间范围
    courseTimeRange,        //课程图用于显示时间范围
    classTimeRange,         //班级图用于显示时间范围
    storeDataLoading,       //门店图加载状态
    courseDataLoading,      //课程图加载状态
    classDataLoading,       //班级图加载状态
    storeData,              //门店图数据
    courseData,             //课程图数据
    classData,              //班级图数据
    HandleExport,           //数据导出(org 机构/course课程/class班级)
  }) {

    /*悬浮设置*/
    const OrgTooltipOne = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.orgname}</p>
                        <p className={styles.inner} style={{color:'#5d9cec'}}>课时数:{payload[0].payload.cost}节</p>
                    </div>
                );
            }
            return null;
        }
    });

    const OrgTooltipTwo = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.orgname}</p>
                        <p className={styles.inner} style={{color:'#A9D86E'}}>消费数:{payload[0].payload.money}元</p>
                    </div>
                );
            }
            return null;
        }
    });

    const CourseTooltipOne = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.Title}</p>
                        <p className={styles.inner} style={{color:'#5d9cec'}}>课时数:{payload[0].payload.cost}节</p>
                    </div>
                );
            }
            return null;
        }
    });

    const CourseTooltipTwo = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.Title}</p>
                        <p className={styles.inner} style={{color:'#A9D86E'}}>消费数:{payload[0].payload.money}元</p>
                    </div>
                );
            }
            return null;
        }
    });

    const ClassTooltipOne = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.clsname}</p>
                        <p className={styles.inner} style={{color:'#5d9cec'}}>课时数:{payload[0].payload.cost}节</p>
                    </div>
                );
            }
            return null;
        }
    });

    const ClassTooltipTwo = React.createClass({
        render() {
            const { active } = this.props;
            if (active) {
                const { payload, label } = this.props;
                return (
                    <div className={styles.Popover}>
                        <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.clsname}</p>
                        <p className={styles.inner} style={{color:'#A9D86E'}}>消费数:{payload[0].payload.money}元</p>
                    </div>
                );
            }
            return null;
        }
    });

    /*storeData*/
    return (
        <div className={styles.AllCharts}>
            <div className={styles.FirstBar}>
                <div className={styles.Button}>
                    <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('org')}>
                        <Button type="primary" style={{float:'right'}}><Icon type="export" />导出数据</Button>
                    </Popconfirm>
                </div>
                <div className={styles.titleArea}>
                    <p className={styles.titleName}>按校区划分
                        {'' == storeTimeRange || '' == storeTimeRange.startTime || '' == storeTimeRange.endTime?
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>近30日</span>
                            )
                        </span>
                        :
                        <span style={{color:'#999999',marginLeft:'20px'}}>(
                            <span style={{marginLeft:'4px',marginRight:'10px'}}>{storeTimeRange.startTime}</span>
                            <span>~</span>
                            <span style={{marginLeft:'10px',marginRight:'4px'}} >{storeTimeRange.endTime}</span>)
                        </span>
                        }
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>最多显示前10，查看全部请导出报表</span>
                            )
                        </span>
                    </p>
                </div>
                <Spin tip="Loading..." spinning={storeDataLoading}>
                    { storeData == '' || storeData == null || storeData == undefined || storeData == [] ?
                        <div className={styles.barCharts}
                             style={{ height : 440  , width : '100%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af' style = {{ marginBottom : 5 }}/>
                            <div style = {{ cursor : 'default' , fontSize : '1rem' , color : '#999' }}>暂无数据</div>
                        </div>
                        :
                        <div className={styles.barCharts}>
                            <ResponsiveContainer width="100%" height={220} >
                                <BarChart
                                    data={storeData}
                                    barSize={60}
                                    margin={{top: 15, right: 40, left: 15, bottom: 0}}
                                    syncId="orgData">
                                    <XAxis dataKey="orgName" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Tooltip cursor={false} content={ <OrgTooltipOne/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="课时数" stackId="a" fill="#5d9cec"/>
                                </BarChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer width="100%" height={220} >
                                <BarChart
                                    data={storeData}
                                    barSize={60}
                                    margin={{top: 0, right: 40, left: 15, bottom: 30}}
                                    syncId="orgData">
                                    <XAxis dataKey="orgName" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Tooltip cursor={false} content={ <OrgTooltipTwo/> }/>
                                    <ReferenceLine y={0} stroke='#A9D86E'/>
                                    <Bar dataKey="消费数" stackId="a" fill="#A9D86E"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    }
                </Spin>
            </div>

            <div className={styles.SecondBar} >
                <div className={styles.Button}>
                    <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('course')}>
                        <Button type="primary" style={{float:'right'}}><Icon type="export" />导出数据</Button>
                    </Popconfirm>
                </div>
                <div className={styles.titleArea}>
                    <p className={styles.titleName}>按课程划分
                        {'' == courseTimeRange || '' == courseTimeRange.startTime || '' == courseTimeRange.endTime?
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>近30日</span>
                            )
                        </span>
                        :
                        <span style={{color:'#999999',marginLeft:'20px'}}>(
                            <span style={{marginLeft:'4px',marginRight:'10px'}}>{courseTimeRange.startTime}</span>
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
                <Spin tip="Loading..." spinning={courseDataLoading}>
                    { courseData == '' || courseData == null || courseData == undefined || courseData == [] ?
                        <div className={styles.barCharts}
                             style={{ height : 440  , width : '100%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af' style = {{ marginBottom : 5 }}/>
                            <div style = {{ cursor : 'default' , fontSize : '1rem' , color : '#999' }}>暂无数据</div>
                        </div>
                        :
                        <div className={styles.barCharts}>
                            <ResponsiveContainer width="100%" height={220} >
                                <BarChart
                                    data={courseData}
                                    barSize={60}
                                    margin={{top: 15, right: 40, left: 15, bottom: 0}}
                                    syncId="courseData">
                                    <XAxis dataKey="title" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Tooltip cursor={false} content={ <CourseTooltipOne/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="课时数" stackId="a" fill="#5d9cec"/>
                                </BarChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer width="100%" height={220} >
                                <BarChart
                                    data={courseData}
                                    barSize={60}
                                    margin={{top: 0, right: 40, left: 15, bottom: 30}}
                                    syncId="courseData">
                                    <XAxis dataKey="title" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Tooltip cursor={false} content={ <CourseTooltipTwo/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="消费数" stackId="a" fill="#A9D86E"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    }
                </Spin>
            </div>

            <div className={styles.ThirdBar}>
                <div className={styles.Button}>
                    <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('class')}>
                        <Button type="primary" style={{float:'right'}}><Icon type="export" />导出数据</Button>
                    </Popconfirm>
                </div>
                <div className={styles.titleArea}>
                    <p className={styles.titleName}>按班级划分
                        {'' == classTimeRange || '' == classTimeRange.startTime || '' == classTimeRange.endTime?
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>近30日</span>
                            )
                        </span>
                        :
                        <span style={{color:'#999999',marginLeft:'20px'}}>(
                            <span style={{marginLeft:'4px',marginRight:'10px'}}>{classTimeRange.startTime}</span>
                            <span>~</span>
                            <span style={{marginLeft:'10px',marginRight:'4px'}} >{classTimeRange.endTime}</span>)
                        </span>
                        }
                        <span style={{color:'#999999',marginLeft:'20px'}}>
                            (
                            <span style={{margin:'0 4px'}}>最多显示前10，查看全部请导出报表</span>
                            )
                        </span>
                    </p>
                </div>
                <Spin tip="Loading..." spinning={classDataLoading}>
                    { classData == '' || classData == null || classData == undefined || classData == [] ?
                        <div className={styles.barCharts}
                             style={{ height : 440  , width : '100%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center'}}>
                            <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af' style = {{ marginBottom : 5 }}/>
                            <div style = {{ cursor : 'default' , fontSize : '1rem' , color : '#999' }}>暂无数据</div>
                        </div>
                        :
                        <div className={styles.barCharts}>
                            <ResponsiveContainer width="100%" height={220} >
                                <BarChart
                                    data={classData}
                                    barSize={60}
                                    margin={{top: 15, right: 40, left: 15, bottom: 0}}
                                    syncId="classData">
                                    <XAxis dataKey="clsName" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Tooltip cursor={false} content={ <ClassTooltipOne/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="课时数" stackId="a" fill="#5d9cec"/>
                                </BarChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer width="100%" height={220} >
                                <BarChart
                                    data={classData}
                                    barSize={60}
                                    margin={{top: 0, right: 40, left: 15, bottom: 30}}
                                    syncId="classData">
                                    <XAxis dataKey="clsName" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                    <YAxis stroke="#666666" tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Tooltip cursor={false} content={ <ClassTooltipTwo/> }/>
                                    <ReferenceLine y={0} stroke='#b4d5fe'/>
                                    <Bar dataKey="消费数" stackId="a" fill="#A9D86E"/>
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
