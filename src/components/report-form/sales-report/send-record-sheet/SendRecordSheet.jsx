import React from 'react';
import { Table, Popconfirm, Button, Icon, Radio, Spin } from 'antd';
import { Surface, Pie, BarChart, Bar, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Sector, Cell, Treemap, ReferenceLine, Brush, ScatterChart, Scatter, AreaChart, Area, ResponsiveContainer } from 'recharts';
import createG2 from 'g2-react';
import { Stat, Frame } from 'g2';
import { ProgressBar, NullData  } from '../../../common/new-component/NewComponent';
import styles from './SendRecordSheet.less';

//赠课记录 表
function SendRecordSheet({
	classByTypeList,
	classByTimeList,
	commCourseNum,
    excCourseNum,
    costCommCourseNum,
    costExcCourseNum,
	createContractSendClass,
	afterContractSendClass,
	loading,

	exportFuncByType,
	exportFuncByTime
}){

	function formatter( text, item ){
		let value = item.point['数量'];
		return value;
	}

	let frame1 = new Frame( classByTypeList );
	frame1 = Frame.sort( frame1, 'num' ); // 将数据按照num 进行排序，由大到小

	let frame2 = new Frame( classByTimeList );
	frame2 = Frame.sort( frame2, 'num' );

	const Chart1 = createG2( chart => {
		chart.axis('type', {
			title : null
		});

		chart.tooltip(true, {
			custom : true,           // 开启 tooltip 自定义模板功能
			html :  '<div class = "ac-tooltip" style = "position : absolute; border-radius : 5px; border : 1px dotted #ddd; padding : 10px; background : #fff" ><table class = "ac-list custom-table"></table></div>',  // tooltip 的 html 外层模板，可支持类似 jquery 的使用，直接传入 dom id，如 "#c1"
			itemTpl : '<tr><td style="color:{color}">{name}：</td><td style="color:{color}">{value}</td></tr>', // 使用 html 时每一个显示项的模板，默认支持 index, color, name, value 这四个变量。
			offset : 10,             // 偏移量，设置tooltip 显示位置距离 x 轴方向上的偏移
		});

		chart.coord('rect').transpose();
		chart.interval()
			.position('type*数量')
			.tooltip('数量*成本')
			.label( 'type', {
				 renderer : formatter
			});
		chart.render();
    });

	const Chart2 = createG2( chart => {
		chart.axis('type', {
			title : null
		});
		chart.tooltip(true, {
			custom : true,           // 开启 tooltip 自定义模板功能
			html :  '<div class = "ac-tooltip" style = "position : absolute; border-radius : 5px; border : 1px dotted #ddd; padding : 10px; background : #fff" ><table class = "ac-list custom-table"></table></div>',  // tooltip 的 html 外层模板，可支持类似 jquery 的使用，直接传入 dom id，如 "#c1"
			itemTpl : '<tr><td style="color:{color}">{name}：</td><td style="color:{color}">{value}</td></tr>', // 使用 html 时每一个显示项的模板，默认支持 index, color, name, value 这四个变量。
			offset : 10,             // 偏移量，设置tooltip 显示位置距离 x 轴方向上的偏移
		});
		chart.coord('rect').transpose();
		chart.interval()
			.color('#88c702')
			.position('type*数量')
			.tooltip('数量*成本')
			.label( 'type', {
				 renderer : formatter
			});
		chart.render();
	})

    return (
        <div className = 'report_form_bar_charts_wrap' style = {{ height : 'calc(100% - 144px)' }}>
			<div className = 'report_form_bar_charts_content' >
				<div className = 'report_form_bar_chart_all' >
					<div className = 'report_form_bar_chart_header' >
						<div className = 'report_form_bar_chart_header_info'>
							赠送课时
						</div>
                        <Button
                            type = 'primary'
                            onClick = { exportFuncByType }
                            className = 'report_form_bar_chart_header_btn'
                        >
                            <Icon type = 'export' />按查询结果导出
                        </Button>
					</div>
					{ !!loading ? <ProgressBar height = '360px' content = '统计中' />
					: ( !!commCourseNum || !!excCourseNum || !!costCommCourseNum || !!costExcCourseNum ) ?
						<Chart1
							data = { classByTypeList }
							width = { 900 }
							height = { 200 }
							plotCfg = {{ margin: [ 20, 60, 20, 120 ] }}
							forceFit = { true }
						/>
						: <NullData height = '360px' />
					}
				</div>
				<div className = 'report_form_bar_chart_all' >
					<div className = 'report_form_bar_chart_header' >
						<div className = 'report_form_bar_chart_header_info'>
							赠送时间
						</div>
						<Button
                            type = 'primary'
                            onClick = { exportFuncByTime }
                            className = 'report_form_bar_chart_header_btn'
                        >
                            <Icon type = 'export' />按查询结果导出
                        </Button>
					</div>
					{ !!loading ? <ProgressBar height = '360px' content = '统计中' />
					: ( !!createContractSendClass || !!afterContractSendClass ) ?
						<Chart2
							data = { classByTimeList }
							width = { 900 }
							height = { 200 }
							plotCfg = {{ margin: [ 20, 60, 20, 120 ] }}
							forceFit = { true }
						/>
						: <NullData height = '360px' />
					}
				</div>
			</div>
        </div>
    );
}

export default SendRecordSheet;
