import React from 'react';
import { Table, Popconfirm, Button, Icon, Radio, Spin } from 'antd';
import { Surface, Pie, BarChart, Bar, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Sector, Cell, Treemap, ReferenceLine, Brush, ScatterChart, Scatter, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ProgressBar, NullData  } from '../../../common/new-component/NewComponent';
import styles from '../../chart-less/ReportFormBar.less';

//学员消课 表
function StuUseClassCharts({
	loading,

	courseList,
    organList,
	birthdayList,
	teacherList,
	salesList,
	counselorList,
	customerList,


	exportRecordByCourse,            /*按课程导出数据*/
    exportByOrgan,                   /*按机构导出数据*/
	exportByTeacher,                 /*按老师导出数据*/
	exportBySales,                   /*按负责销售导出数据*/
	exportByCounselor,               /*按负责顾问导出数据*/
	exportByCustomer,							   /*按负责客服导出数据*/

}){

    /*chartToolTip*/
    function OrgTooltip( props ){
        if ( props.active ) {
            const { payload, label, customer } = props;
            return (
                <div className = 'report_form_bar_tooltip_popover'>
                    <p style = {{ color : '#666666' }}>{ label }</p>
                    <p style = {{ color : payload[0].fill }}>消耗课时:{ payload[0].value }</p>
                    <p style = {{ color : payload[0].fill }}>金额 : { customer ? payload[0].payload.costMoney : payload[0].payload.money }</p>
                </div>
            )
        }
        return null;
    };

    /*chartBarShape*/
    function ModalShape(props){
        return(
            <rect style = {{ height : props.height , width : props.width , fill : props.fill , x : props.x , y : props.y , rx : 3 , ry : 3 }}/>
        )
    }

	/*渲染图表*/
	function renderChartsComponent( type, x_data_key, y_data_key ){
		/*渲染学员消课的类型*/
		let title = undefined;
		let data = [];
		let exportFunc = undefined;
		let color = undefined;

		if( type == 'course' ){
			title = '按课程统计';
			data = courseList;
			exportFunc = exportRecordByCourse;
			color = 'rgb(130,82,219)';
		}else if( type == 'organ' ){
			title = '按机构统计';
			data = organList;
			exportFunc = exportByOrgan;
			color = 'rgb(100, 194, 162)';
		}else if( type == 'birthday' ){
			title = '按学员生日统计';
			data = birthdayList;
			exportFunc = exportByBirthday;
			color = 'rgb(63,138,232)';
		}else if( type == 'teacher' ){
			title = '按老师统计';
			data = teacherList;
			exportFunc = exportByTeacher;
			color = 'rgb(78,176,217)';
		}else if( type == 'sales' ){
			title = '按负责销售统计';
			data = salesList;
			exportFunc = exportBySales;
			color = 'rgb(100,194,162)';
		}else if( type == 'counselor' ){
			title = '按负责顾问统计'
			data = counselorList;
			exportFunc = exportByCounselor;
			color = 'rgb(234,212,59)';
		}else if( type == 'customer' ){
			title = '按负责客服统计'
			data = customerList;
			exportFunc = exportByCustomer;
			color = 'rgb(255,179,86)';
		}

		return(
			<div className = 'report_form_bar_chart_all' key = { 'report_form_bar_chart_all' + type } >
				<div className = 'report_form_bar_chart_header' >
					<div className = 'report_form_bar_chart_header_info'>
						{ title }<span>(最多显示前10，查看全部请导出报表)</span>
					</div>
                    <Button
                        type = 'primary'
                        className = 'report_form_bar_chart_header_btn'
                        onClick = { exportFunc }
                    >
                        <Icon type = 'export' />按查询结果导出
                    </Button>
				</div>
				{ !!loading ? <ProgressBar height = '360px' content = '统计中'/>
				: !!data && data.length > 0 ?
					<ResponsiveContainer width = '100%' height = { 360 } >
						<BarChart
							data = { data }
							barSize = { 60 }
							margin={{ top : 40, right : 30, left : 10, bottom : 40 }}
						>
							<XAxis dataKey = { x_data_key } stroke = '#666' tickLine = { false } />
							<YAxis stroke = '#666' tickLine = { false } />
							<ReferenceLine y = { 0 } stroke = '#b4d5fe' />
							<CartesianGrid strokeDasharray = '3 3' />
							<Tooltip cursor = { false } content = { <OrgTooltip customer={true} /> } />
							<Bar dataKey = { y_data_key } stackId = 'a' minPointSize = { 2 } fill = { color } shape = { <ModalShape /> }/>
						</BarChart>
					</ResponsiveContainer>
					: <NullData height = '360px' />
				}
			</div>
		)
	}

    return (
        <div className = 'report_form_bar_charts_wrap' style = {{ height : 'calc(100% - 144px)' }}>
			<div className = 'report_form_bar_charts_content' >
				{ renderChartsComponent( 'course', 'courseName', 'cost' ) }
                { renderChartsComponent( 'organ', 'orgName', 'cost' ) }
				{ renderChartsComponent( 'teacher', 'userName', 'cost' ) }
				{ renderChartsComponent( 'sales', 'userName', 'cost' ) }
				{ renderChartsComponent( 'counselor', 'userName', 'cost' ) }
				{ renderChartsComponent( 'customer', 'name', 'costNum' ) }
			</div>
        </div>
    );
}

export default StuUseClassCharts;
