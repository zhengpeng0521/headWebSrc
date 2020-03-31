import React from 'react';
import Media from 'react-media';
import { Button , Icon, Spin } from 'antd';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import styles from './StuSilenceSheet.less';
import { ProgressBar, NullData  } from '../../../common/new-component/NewComponent';

/*学员沉默 表*/
function StuSilenceSheetComponent({
	loading,
	newPurStuNum,                 //新签学员
	renewPurStuNum,               //续约学员
	uncostStuNum,                 //未消耗课时学员
	oldStuNum,                    //新学员
	newStuNum,                    //老学员

	exportUnPackFunc,
	exportUnCostFunc
}){
	function formatter( text, item ){
		let value = item.point.value;
		return text + ' ' + value;
	}

	function inSideFormatter( text, item ){
		let value = item.point.value;
		let point = item.point;
		return '<div style = "width : 200px; color : #fff; font-size : 14px" >' + text + ' : ' + value + '</div>'; // 自定义 html 模板
	}

	function PieChart(){
		const data = [
			{ value : renewPurStuNum, type : '总学员', name : '续约学员' },
			{ value : newPurStuNum, type : '总学员', name : '新签学员' },
		];
		const Chart = createG2( chart => {
			chart.legend( false )
			chart.coord('theta', {
				radius: 0.5        // 设置饼图的大小
		    });
			chart.legend( false );

			chart.tooltip(true, {
				custom : true,           // 开启 tooltip 自定义模板功能
				html :  '<div class = "ac-tooltip" style = "position : absolute; border-radius : 5px; border : 1px dotted #ddd; padding : 10px; background : #fff" ><table class = "ac-list custom-table"></table></div>',  // tooltip 的 html 外层模板，可支持类似 jquery 的使用，直接传入 dom id，如 "#c1"
				itemTpl : '<div style="color:{color}">{name}：{value}</div>', // 使用 html 时每一个显示项的模板，默认支持 index, color, name, value 这四个变量。
				offset : 10,             // 偏移量，设置tooltip 显示位置距离 x 轴方向上的偏移
			});

			// 绘制内部的饼图
		  	chart.intervalStack()
				 .position( Stat.summary.percent( 'value' ) )
				 .color( 'type', [ '#F9815C' ] )
				 .label('type', {
						offset : -60,
						custom : true,
						label : { fontSize : 14 },
						renderer : inSideFormatter
				})
				 .selected({
				 	mode : false
				 })

			// 绘制外圈饼图
      		let view = chart.createView();
			view.source( data );
			view.coord('theta', {
				inner : 0.75 // 设置空心部分的大小
			});
			view.intervalStack()
				.position( Stat.summary.percent('value') )
				.color( 'name', [ '#4E7CCC', '#36B3C3' ] )
				.label( 'name', {
				   	 renderer : formatter
				})
				.selected({
					mode : 'multiple' // 设置 geom 的选择模式
				});
      		chart.render();
		})
		return (
			<Chart
				width = { 450 }
				height = { 400 }
				data = { data }
				plotCfg = {{ margin : 45 }}
				forceFit = { true }
			/>
		)
	}

	function PieChart1(){
		const data = [
			{ value : newStuNum, type : '总学员', name : '新学员' },
			{ value : oldStuNum, type : '总学员', name : '老学员' }
		]
		const Chart = createG2( chart => {
			chart.legend( false )
			chart.coord('theta', {
				radius: 0.5        // 设置饼图的大小
		    });
			chart.legend( false );

			chart.tooltip(true, {
				custom : true,           // 开启 tooltip 自定义模板功能
				html :  '<div class = "ac-tooltip" style = "position : absolute; border-radius : 5px; border : 1px dotted #ddd; padding : 10px; background : #fff" ><table class = "ac-list custom-table"></table></div>',  // tooltip 的 html 外层模板，可支持类似 jquery 的使用，直接传入 dom id，如 "#c1"
				itemTpl : '<div style="color:{color}">{name}：{value}</div>', // 使用 html 时每一个显示项的模板，默认支持 index, color, name, value 这四个变量。
				offset : 10,             // 偏移量，设置tooltip 显示位置距离 x 轴方向上的偏移
			});

			// 绘制内部的饼图
		  	chart.intervalStack()
				 .position( Stat.summary.percent( 'value' ) )
				 .color( 'type', [ '#F9815C' ] )
				 .label('type', {
						offset : -60,
						custom : true,
						label : { fontSize : 14 },
						renderer : inSideFormatter
				})
				 .selected({
				 	mode : false
				 })

			// 绘制外圈饼图
      		let view = chart.createView();
			view.source( data );
			view.coord('theta', {
				inner : 0.75 // 设置空心部分的大小
			});
			view.intervalStack()
				.position( Stat.summary.percent('value') )
				.color( 'name', [ '#4E7CCC', '#36B3C3' ] )
				.label( 'name', {
				   	 renderer : formatter
				})
				.selected({
					mode : 'multiple' // 设置 geom 的选择模式
				});
      		chart.render();
		})
		return (
			<Chart
				width = { 450 }
				height = { 400 }
				data = { data }
				plotCfg = {{ margin : 45 }}
				forceFit = { true }
			/>
		)
	}

    return(
		<div className = { styles.all }>
            <div className = { styles.row_sheet }>
				<div className = { styles.follow_record_sheet }>
					<div className = { styles.sheet_title }>
                        <p></p>
                        <Button type = 'primary' onClick = { exportUnCostFunc } ><Icon type = 'export'  />按查询结果导出</Button>
                    </div>
                    <Spin spinning = { loading }>
						<div className = { styles.use_less_class_wrap }>
							<p className = { styles.use_less_num }>{ uncostStuNum || '--' }</p>
							<p className = { styles.use_less_title }>选定时间内, 未消耗课时的学员</p>
							<div className = { styles.use_less_img }></div>
						</div>
					</Spin>
                </div>
                <div className = { styles.sheet }>
                    <div className = { styles.sheet_title }>
                        <p className = { styles.title_info } >
							<span className = { styles.title_info_label } >未开课包学员</span>
							<span className = { styles.title_info_text } >( 选定时间内, 审核通过的合同里, 未使用过课时的学员 )</span>
						</p>
                        <Button type = 'primary' onClick = { exportUnPackFunc } ><Icon type = 'export'  />按查询结果导出</Button>
                    </div>
                    <div className = 'report_form_pie_chart_area'>
						<div className = { styles.report_form_pie_chart_item }>
							{ !!loading ? <ProgressBar height = '100%' content = '统计中'/>
										: ( !!newPurStuNum || !!renewPurStuNum ) ? PieChart()
										: <NullData height = '100%' />
							}
						</div>
						<div className = { styles.report_form_pie_chart_item }>
							{ !!loading ? <ProgressBar height = '100%' content = '统计中'/>
										: ( !!newPurStuNum || !!renewPurStuNum ) ? PieChart1()
										: <NullData height = '100%' />
							}
						</div>
					</div>
                </div>
            </div>
		</div>
    );
}

export default StuSilenceSheetComponent;
