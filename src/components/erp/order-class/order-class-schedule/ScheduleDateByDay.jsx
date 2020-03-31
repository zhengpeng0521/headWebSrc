import React from 'react';
import { Button, Popover, Progress } from 'antd';
import moment from 'moment';
import styles from './ScheduleTeachByDay.less';
import { objListSortOfTime, scheduleDataAlgorithm } from '../../../../utils/arrayUtils';
import { scheduleDataByDate, scheduleDataByRoom, scheduleDataByTime } from '../../../../utils/scheduleUtils';

function ScheduleDateByDay({
	startDate,      //开始日期
	endDate,        //结束日期
	beginTime,      //时间维度开始时间
	endTime,        //时间维度结束时间

	scheduleList,

	showDetail,           //显示详情
	createAble,           //是否可以新增

}){

	function getStuStr( stus ){
		let stuArr = [];
		!!stus && stus.map(function( item, index ){
			stuArr.push( item.name );
		})
		return stuArr.join('、')
	}

	let scheduleDataListByDate = scheduleDataAlgorithm( scheduleList );   //按日期整理

	let loopRow = time_str => {
		let time_moment = moment( time_str, 'HH:mm' );                              //划线时间点
		let next_time_moment = moment( time_str, 'HH:mm' ).add( 1, 'h' );           //下个划线点
		let next_time_str = next_time_moment.format('HH:mm');                       //下个划线点的时间字符串

		let render_col = [];
		let day_str = moment( startDate ).format('YYYY-MM-DD');
		let dayData = scheduleDataListByDate[ day_str ];

		let scheduleRender = [];

		if( dayData ){
			let dayTimeKeys = Object.keys( dayData );
			dayTimeKeys.forEach(function(time_item, time_item_index){

				if( time_item >= time_str && time_item < next_time_str ) {
					let timeData = dayData[ time_item ];

					if( timeData && timeData.length > 0 ){
						//渲染课程表块
						let time_item_moment = moment( time_item, 'HH:mm' );                           //块起始 的时间点
						let top_percent = 1.0 * time_item_moment.diff( time_moment )/1000/60/60*100;   //块起点 离划线点的距离
						let width_percent = 100.0 / timeData.length;                                   //块所占的宽度

						let schedule_class_item_list = [];
						timeData.forEach( function(time_data_item, time_data_item_index){
							let time_data_item_startTime_moment = moment( time_data_item.startTime, 'HH:mm' );       //单个 块起点
							let time_data_item_endTime_moment = moment( time_data_item.endTime, 'HH:mm' );           //单个 块结束点
							let time_data_item_height = ( time_data_item_endTime_moment - time_data_item_startTime_moment )/60000*1.0/60*100*2;
							let time_data_item_color = time_data_item.color || '#5D9BEC';
							let time_data_item_top = ( time_data_item_startTime_moment - time_item_moment )/60000*1.0/60*100;

							//上课时间段
							let class_time_str = time_data_item.startTime + '~' + time_data_item.endTime;
                            let title = time_data_item.title || '——';                 //标题
							let course_name = time_data_item.courseName || '——';      //课程
							let class_room_name = time_data_item.roomName || '——';    //教室
							let main_teachers = time_data_item.mtNames || '——';       //主教
							let assit_teachers = time_data_item.atNames || '——';      //助教

							let stu_arr = !!time_data_item.stuArr && time_data_item.stuArr.length > 0 && getStuStr( time_data_item.stuArr ) || '——';                    //上课学员
							let mul_stu_arr = !!time_data_item.mulStuArr && time_data_item.mulStuArr.length > 0 && getStuStr( time_data_item.mulStuArr ) || '——';       //补课学员
							let try_stu_arr = !!time_data_item.tryStuArr && time_data_item.tryStuArr.length > 0 && getStuStr( time_data_item.tryStuArr ) || '——';       //试听学员

							schedule_class_item_list.push(
								<div
									className = { styles.schedule_class_item }
									onClick = { () => showDetail( time_data_item ) }
									key = { 'schedule_class_item_' + time_data_item_index }
									style={{ backgroundColor : time_data_item_color, height : time_data_item_height, width : width_percent + '%', top : time_data_item_top }}
								>
									<div className = { styles.order_class_time_str }>{ class_time_str }</div>
									<div className = { styles.course_name } >{ title || '——' }</div>
									<div className = { styles.class_room_name } >
										<span className = { styles.order_class_item_label } style = {{ color : time_data_item_color }}>课程</span>
										{ ' : ' + course_name || '——'}
									</div>
									{ time_data_item.process &&
										<div className = { styles.class_room_name } >
											<span className = { styles.order_class_item_label } style = {{ color : time_data_item_color }}>进度</span>
											{ ' : ' + time_data_item.process || '——' }
										</div>
									}
                                    <div className = { styles.class_room_name } >
										<span className = { styles.order_class_item_label } style = {{ color : time_data_item_color }}>教室</span>
										{ ' : ' + class_room_name || '——'}
									</div>
									<div className = { styles.main_teachers }>
										<span className = { styles.order_class_item_label } style = {{ color : time_data_item_color }}>主教</span>
										{ ' : ' + main_teachers || '——'}
									</div>
									<div className = { styles.assit_teachers } >
										<span className = { styles.order_class_item_label } style = {{ color : time_data_item_color }}>助教</span>
										{ ' : ' + assit_teachers || '——'}
									</div>
									<div className = { styles.order_class_stu_arr }>
										<span className = { styles.order_class_item_label } style = {{ color : time_data_item_color }}>
											{ '上课(' + time_data_item.num + '/' + time_data_item.maxNum + ')' }
										</span>
										{ ' : ' + stu_arr }
									</div>
									<div className = { styles.order_class_mul_stu_arr }>
										<span className = { styles.order_class_item_label } style = {{ color : time_data_item_color }}>
											{ '补课(' + time_data_item.mulNum + '/' + time_data_item.maxMulNum + ')' }
										</span>
										{ ' : ' + mul_stu_arr }
									</div>
									<div className = { styles.order_class_try_stu_arr }>
										<span className = { styles.order_class_item_label } style = {{ color : time_data_item_color }}>
											{ '试听(' + time_data_item.tryNum + '/' + time_data_item.maxTryNum + ')' }
										</span>
										{ ' : ' + try_stu_arr }
									</div>
								</div>
							)
						})
						scheduleRender.push(
							<div
								className = { styles.schedule_class_cont } key = { 'schedule_class_cont_' + time_item_index }
								style = {{ top: top_percent + '%', cursor : 'pointer' }}
							>
								{ schedule_class_item_list }
							</div>
						)
					}
				}
			})
		}
		let start_time = time_str;
		let start_time_2 = moment(time_str, 'HH:mm').add( 30, 'm' ).format('HH:mm');
		let currentDate = moment().format('YYYY-MM-DD');

		let render_col_item = (
			<div className = { styles.schedule_item }>
				{ scheduleRender }
				<div
					className = { styles.schedule_item_top }
					style = {{ cursor : createAble ? 'pointer' : 'auto' }}
				>
				</div>
				<div
					className = { styles.schedule_item_bottom }
					style = {{ cursor : createAble ? 'pointer' : 'auto' }}
				>
				</div>
			</div>
		);
		render_col.push( render_col_item );
		render_col.push(
			<div className = { styles.line } ></div>
		)
		return render_col;
	}

	let render_cont = [];
	for( let i = beginTime; i <= endTime; i++ ){
		let time_moment = moment( i + ':00', 'HH:mm' );
		let time_str = time_moment.format( 'HH:mm' );
		let time_moment_next = moment( i + ':30', 'HH:mm' );
		let time_str_next = time_moment_next.format('HH:mm');
		let render_row_item = (
			<div className = { styles.class_schedule_row } style = {{ height : '200px' }} key = { 'class_scheudle_row_' + i }>
				<div className = { styles.schedule_time } >
					<div className = { styles.schedule_time_item }>{ time_str }</div>
					<div className = { styles.schedule_time_item }>{ time_str_next }</div>
				</div>
				<div className = { styles.schedule_content } >
					<div className = { styles.schedule_content_item }>
						{ loopRow( time_str ) }
					</div>
				</div>
			</div>
		)
		render_cont.push( render_row_item );
		render_cont.push(
			<div key = { 'date_teach_schedule_line_' + i } className = { styles.line } ></div>
		)
	}

	/*顶部日期 星期*/
	let day_render_cont = [];
	let week_text_arr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
	let ant_layout_content = document.getElementById('common_content_left');
	let contentWidth = !!ant_layout_content && ant_layout_content.clientWidth - 168;
	let week_text_width = contentWidth / 7;
	for( let i = 0; i < 1; i++ ){
		let monday = moment( startDate, 'YYYY-MM-DD' ).startOf('week');
		let day = moment( startDate, 'YYYY-MM-DD' ).add( i, 'd' );
		let day_str = day.format('YYYY-MM-DD');
		let diff = moment( day ).diff( monday, 'days' );       //选中日期与 周一的天数差距
		if( day_str == moment().format('YYYY-MM-DD') ){
			day_render_cont.push(
				<div style = {{ width : week_text_width + 'px', minWidth : week_text_width + 'px' }} className = { styles.schedule_header_item_today } key = { 'schedule_header_item_' + i }>
                    <div className = { styles.schedule_header_item_date_text }>{ day_str }</div>
                </div>
			)
		}else{
			day_render_cont.push(
				<div style = {{ width : week_text_width + 'px', minWidth : week_text_width + 'px' }} className = { styles.schedule_header_item } key = { 'schedule_header_item_' + i }>
                    <div className = { styles.schedule_header_item_date_text }>{ day_str }</div>
                </div>
			)
		}
	}

	return(
		<div style = {{ height : '100%' }} >
			<div className = { styles.class_schedule_cont } style = {{ overflowX : 'auto', overflowY : 'hidden' }} >
				<div className = { styles.class_schedule_header }>
					<div className = { styles.schedule_header_cont }>
						<div className = { styles.schedule_header_cont_box } >
							{ day_render_cont }
						</div>
					</div>
				</div>
				<div style = {{ height : 'calc( 100% - 50px )', overflowX : 'auto', overflowY : 'auto' }} >
		  			{ render_cont }
				</div>
            </div>
		</div>
	)
}

export default ScheduleDateByDay;
