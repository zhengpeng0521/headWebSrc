import React from 'react';
import { Table, Popconfirm, Button, Icon, Radio, Spin } from 'antd';
import { Surface, Pie, BarChart, Bar, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Sector, Cell, Treemap, ReferenceLine, Brush, ScatterChart, Scatter, AreaChart, Area, ResponsiveContainer } from 'recharts';
import createG2 from 'g2-react';
import { Stat, Frame } from 'g2';
import { ProgressBar, NullData  } from '../../../common/new-component/NewComponent';
import styles from './ContractIncomeSheet.less';

//赠课记录 表
function ContractIncomeSheet({
	newSignMoney,
	oldSignMoney,
	newSignIntroMoney,
	newStuMoney,
	oldStuMoney,
	incomeByClassPackageList,
	incomeByTeachingList,
	nurseryList,

	loading,

	exportFuncByType,
	exportFuncByStu,
	exportFuncByPackage,
	exportFuncByTeaching,
	exportFuncByNursery,
}){

	let contractIncomeList = [
		{ type : '新签', income : Number(newSignMoney.toFixed(2)) },
		{ type: '新签-转介绍', income : Number(newSignIntroMoney.toFixed(2)) },
		{ type : '续约', income : Number(oldSignMoney.toFixed(2)) }
	]

	let contractIncomeByStu = [
		{ type : '新学员', income : Number( newStuMoney.toFixed(2) ) },
		{ type : '老学员', income : Number( oldStuMoney.toFixed(2) ) }
	]

	function formatter( text, item ){
		let value = item.point.income;
		return value;
	}

	let frame = new Frame( contractIncomeList );
	frame = Frame.sort( frame, 'income' ); // 将数据按照num 进行排序，由大到小

	const Chart = createG2( chart => {
		chart.axis('type', {
			title : null
		});

		chart.tooltip(true, {
			custom : true,           // 开启 tooltip 自定义模板功能
			html :  '<div class = "ac-tooltip" style = "position : absolute; border-radius : 5px; border : 1px dotted #ddd; padding : 10px; background : #fff" ><table class = "ac-list custom-table"></table></div>',  // tooltip 的 html 外层模板，可支持类似 jquery 的使用，直接传入 dom id，如 "#c1"
			itemTpl : '<div style = "color:{color}">收入：{value}</div>', // 使用 html 时每一个显示项的模板，默认支持 index, color, name, value 这四个变量。
			offset : 10,             // 偏移量，设置tooltip 显示位置距离 x 轴方向上的偏移
		});

		chart.coord('rect').transpose();
		chart.interval()
			.position('type*income')
			.label( 'type', {
				 renderer : formatter
			});
		chart.render();
    });

	/*chartToolTip*/
    function OrgTooltip( props ){
        if ( props.active ) {
            const { payload, label } = props;
            return (
                <div className = 'report_form_bar_tooltip_popover'>
                    <p style = {{ color : '#666666' }}>{ label }</p>
                    <p style = {{ color : payload[0].fill }}>收入:{ payload[0].value }</p>
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

    return (
        <div className = 'report_form_bar_charts_wrap' style = {{ height : 'calc(100% - 144px)' }}>
			<div className = 'report_form_bar_charts_content' >
				<div className = 'report_form_bar_chart_all' >
					<div className = 'report_form_bar_chart_header' >
						<div className = 'report_form_bar_chart_header_info'>
							签约类型
						</div>
						<div className = 'report_form_bar_chart_header_btn' >
							<Button
                                type = 'primary'
								onClick = { exportFuncByType }
							>
								<Icon type = 'export' />按查询结果导出
							</Button>
						</div>
					</div>
					{ !!loading ? <ProgressBar height = '360px' content = '统计中' />
					: ( !!newSignMoney || !!oldSignMoney || !!newSignIntroMoney ) ?
						<Chart
							data = { contractIncomeList }
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
							新老学员
						</div>
						<div className = 'report_form_bar_chart_header_btn' >
							<Button
                                type = 'primary'
								onClick = { exportFuncByStu }
							>
								<Icon type = 'export' />按查询结果导出
							</Button>
						</div>
					</div>
					{ !!loading ? <ProgressBar height = '360px' content = '统计中' />
					: ( !!newStuMoney || !!oldStuMoney ) ?
						<Chart
							data = { contractIncomeByStu }
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
							课时套餐 <span>(最多显示前10，查看全部请导出报表)</span>
						</div>
						<div className = 'report_form_bar_chart_header_btn' >
							<Button
                                type = 'primary'
								onClick = { exportFuncByPackage }
							>
								<Icon type = 'export' />按查询结果导出
							</Button>
						</div>
					</div>
					{ !!loading ? <ProgressBar height = '360px' content = '统计中' />
					: !!incomeByClassPackageList && incomeByClassPackageList.length > 0 ?
						<ResponsiveContainer width = '100%' height = { 360 } >
							<BarChart
								data = { incomeByClassPackageList }
								barSize = { 60 }
								margin={{ top : 40, right : 30, left : 10, bottom : 40 }}
							>
								<XAxis dataKey = { 'productName' } stroke = '#666' tickLine = { false } />
								<YAxis stroke = '#666' tickLine = { false } />
								<ReferenceLine y = { 0 } stroke = '#b4d5fe' />
								<CartesianGrid strokeDasharray = '3 3' />
								<Tooltip cursor = { false } content = { <OrgTooltip /> } />
								<Bar dataKey = { 'money' } stackId = 'a' minPointSize = { 2 } fill = { 'rgb(130,82,219)' } shape = { <ModalShape /> }/>
							</BarChart>
						</ResponsiveContainer>
						: <NullData height = '360px' />
					}
				</div>
				<div className = 'report_form_bar_chart_all' >
					<div className = 'report_form_bar_chart_header' >
						<div className = 'report_form_bar_chart_header_info'>
							托班套餐 <span>(最多显示前10，查看全部请导出报表)</span>
						</div>
						<div className = 'report_form_bar_chart_header_btn' >
							<Button
                                type = 'primary'
								onClick = { exportFuncByNursery }
							>
								<Icon type = 'export' />按查询结果导出
							</Button>
						</div>
					</div>
					{ !!loading ? <ProgressBar height = '360px' content = '统计中' />
					: !!nurseryList && nurseryList.length > 0 ?
						<ResponsiveContainer width = '100%' height = { 360 } >
							<BarChart
								data = { nurseryList }
								barSize = { 60 }
								margin={{ top : 40, right : 30, left : 10, bottom : 40 }}
							>
								<XAxis dataKey = { 'productName' } stroke = '#666' tickLine = { false } />
								<YAxis stroke = '#666' tickLine = { false } />
								<ReferenceLine y = { 0 } stroke = '#b4d5fe' />
								<CartesianGrid strokeDasharray = '3 3' />
								<Tooltip cursor = { false } content = { <OrgTooltip /> } />
								<Bar dataKey = { 'money' } stackId = 'a' minPointSize = { 2 } fill = { 'rgb(130,82,219)' } shape = { <ModalShape /> }/>
							</BarChart>
						</ResponsiveContainer>
						: <NullData height = '360px' />
					}
				</div>
				<div className = 'report_form_bar_chart_all' >
					<div className = 'report_form_bar_chart_header' >
						<div className = 'report_form_bar_chart_header_info'>
							教材 <span>(最多显示前10，查看全部请导出报表)</span>
						</div>
						<div className = 'report_form_bar_chart_header_btn' >
							<Button
                                type = 'primary'
								onClick = { exportFuncByTeaching }
							>
								<Icon type = 'export' />按查询结果导出
							</Button>
						</div>
					</div>
					{ !!loading ? <ProgressBar height = '360px' content = '统计中' />
					: !!incomeByTeachingList && incomeByTeachingList.length > 0 ?
						<ResponsiveContainer width = '100%' height = { 360 } >
							<BarChart
								data = { incomeByTeachingList }
								barSize = { 60 }
								margin={{ top : 40, right : 30, left : 10, bottom : 40 }}
							>
								<XAxis dataKey = { 'aidName' } stroke = '#666' tickLine = { false } />
								<YAxis stroke = '#666' tickLine = { false } />
								<ReferenceLine y = { 0 } stroke = '#b4d5fe' />
								<CartesianGrid strokeDasharray = '3 3' />
								<Tooltip cursor = { false } content = { <OrgTooltip /> } />
								<Bar dataKey = { 'money' } stackId = 'a' minPointSize = { 2 } fill = { 'rgb(63,138,232)' } shape = { <ModalShape /> }/>
							</BarChart>
						</ResponsiveContainer>
						: <NullData height = '360px' />
					}
				</div>
			</div>
        </div>
    );
}

export default ContractIncomeSheet;
