import React from 'react';
import { Button, Popover, Progress, Affix } from 'antd';
import moment from 'moment';
import styles from './ScheduleTeachComponent.less';
import { objListSortOfTime, scheduleDataAlgorithm } from '../../../../utils/arrayUtils';
import { scheduleDataByDate, scheduleDataByTeach2, scheduleDataByTime } from '../../../../utils/scheduleUtils';

function ScheduleTeachComponent({
	beginTime,
	endTime,
	startDate,
	endDate,

	scheduleList,
	selectedTeachers,

	showDetail,
	createAble,                 //是否可以新增

	teacherFlag,
	handleWheelAction

}){
	let scheduleDataListByDate = scheduleDataByDate( scheduleList );                                 //按日期整理
	let scheduleDataListByTeach = scheduleDataByTeach2( scheduleDataListByDate, selectedTeachers );   //按老師整理
	let scheduleDataListByTime = scheduleDataByTime( scheduleDataListByTeach, selectedTeachers );    //按時間整理

	function getStuStr( stus ){
		let stuArr = [];
		!!stus && stus.map(function( item, index ){
			stuArr.push( item.name );
		})
		return stuArr.join('、')
	}

	let loopRow = time_str => {
		let time_moment = moment( time_str, 'HH:mm' );                              //划线时间点
		let next_time_moment = moment( time_str, 'HH:mm' ).add( 1, 'h' );           //下个划线点
		let next_time_str = next_time_moment.format('HH:mm');                       //下个划线点的时间字符串

		let render_col = [];
		for( let i = 0; i < 7; i++ ){
			let day = moment( startDate, 'YYYY-MM-DD' ).add( i, 'd' );
			let day_str = day.format('YYYY-MM-DD');
			let dayData = scheduleDataListByTime[ day_str ];

			for( let j = 0; j < selectedTeachers.length; j++ ){
				let teacherObj = selectedTeachers[j];
				let teacherId = teacherObj.userId;
				let teacherName = teacherObj.userName;
				let teacherData = !!dayData && dayData[teacherName];
				let scheduleRender = [];

				if( teacherData ){
					let dayTimeKeys = Object.keys(teacherData);
					dayTimeKeys.forEach(function(time_item, time_item_index) {

						if( time_item >= time_str && time_item < next_time_str ) {
							let timeData = teacherData[ time_item ];

							if(timeData && timeData.length > 0) {
								//渲染课程表块
								let time_item_moment = moment( time_item, 'HH:mm' );        //块起始 的时间点

								let top_percent = 1.0 * time_item_moment.diff(time_moment)/1000/60/60*100;
								let width_percent = 100.0 / timeData.length;

								let schedule_class_item_list = [];
								timeData.forEach(function(time_data_item, time_data_item_index) {
									let time_data_item_startTime_moment = moment( time_data_item.startTime, 'HH:mm' );
									let time_data_item_endTime_moment = moment(time_data_item.endTime, 'HH:mm');
									let time_data_item_height = (time_data_item_endTime_moment - time_data_item_startTime_moment)/60000*1.0/60*100;
									let time_data_item_color = time_data_item.color || '#5D9BEC';
									let time_data_item_top = (time_data_item_startTime_moment - time_item_moment)/60000*1.0/60*100;

									let schedule_class_item_type_text = time_data_item.type == '1' ? '听' : time_data_item.type == '2' ? '课' : time_data_item.type == '3' ? '补' : '课';

                                	let class_time_str = time_data_item.studyDate + ' ' + time_data_item.startTime + '~' + time_data_item.endTime;

									let title = time_data_item.title || '——';                 //标题
									let course_name = time_data_item.courseName || '——';      //课程
									let process = time_data_item.process || '——';             //进度
									let class_room_name = time_data_item.roomName || '——';    //教室
									let main_teachers = time_data_item.mtNames || '——';       //主教
									let assit_teachers = time_data_item.atNames || '——';      //助教

									let stu_arr = !!time_data_item.stuArr && time_data_item.stuArr.length > 0 && getStuStr( time_data_item.stuArr ) || '——';                    //上课学员
									let mul_stu_arr = !!time_data_item.mulStuArr && time_data_item.mulStuArr.length > 0 && getStuStr( time_data_item.mulStuArr ) || '——';       //补课学员
									let try_stu_arr = !!time_data_item.tryStuArr && time_data_item.tryStuArr.length > 0 && getStuStr( time_data_item.tryStuArr ) || '——';       //试听学员

									//进度条
									let { curProgress, maxProgress } = time_data_item;
									let isShowProgress = maxProgress != undefined && maxProgress > 0;
									let progressPercent = 100.0 * curProgress/maxProgress;

									//班级名称显示的行数
									let classNameLineClamp = isShowProgress ?　time_data_item_height / 50　: time_data_item_height / 40;
									let classNameLineClampNum = Math.floor(classNameLineClamp);
									let classNameLineClampNumRea = classNameLineClampNum == 0 ? 1 : classNameLineClampNum;

									//班级名称和进度是否显示
									let classNameDisable = time_data_item_height <= 50 && width_percent < 34 ? 'none' : '-webkit-box';

									//鼠标悬停 显示块
									let class_content = (
										<div className = { styles.class_content } key = { 'schedule_class_item_pop_cont_' + time_data_item_index } >
											<div className = { styles.class_room_name } style = {{ marginRight : '10px' }} >
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>时间 : </span>
												{ class_time_str }
											</div>
											<div className = { styles.class_room_name } >
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>标题</span>
												{ ' : ' + title || '——'}
											</div>
											<div className = { styles.class_room_name } >
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>课程</span>
												{ ' : ' + course_name || '——'}
											</div>
											<div className = { styles.class_room_name } >
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>进度</span>
												{ ' : ' + process || '——'}
											</div>
											<div className = { styles.class_room_name } >
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>教室</span>
												{ ' : ' + class_room_name || '——'}
											</div>
											<div className = { styles.main_teachers }>
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>主教</span>
												{ ' : ' + main_teachers || '——'}
											</div>
											<div className = { styles.assit_teachers } >
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>助教</span>
												{ ' : ' + assit_teachers || '——'}
											</div>
											<div className = { styles.order_class_stu_arr }>
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>
													{ '上课(' + time_data_item.num + '/' + time_data_item.maxNum + ')' }
												</span>
												{ ' : ' + stu_arr }
											</div>
											<div className = { styles.order_class_mul_stu_arr }>
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>
													{ '补课(' + time_data_item.mulNum + '/' + time_data_item.maxMulNum + ')' }
												</span>
												{ ' : ' + mul_stu_arr }
											</div>
											<div className = { styles.order_class_try_stu_arr }>
												<span className = { styles.order_class_item_label } style = {{ color : '#999' }}>
													{ '试听(' + time_data_item.tryNum + '/' + time_data_item.maxTryNum + ')' }
												</span>
												{ ' : ' + try_stu_arr }
											</div>
										</div>
									);

									schedule_class_item_list.push(
										<Popover
											key = {'schedule_class_item_pop_' + time_data_item_index }
											content = { class_content }
											overlayClassName = "common_class_content_pop"
											title = { null }
											trigger = "hover"
											placement = "right"
											arrowPointAtCenter = { true }>
											<div
												className = { styles.schedule_class_item }
												onClick = { () => showDetail( time_data_item ) }
												key={'schedule_class_item_'+time_data_item_index}
												style={{ backgroundColor : time_data_item_color, height : time_data_item_height, width : width_percent + '%', top : time_data_item_top }}
											>
												<div className = { styles.schedule_class_item_type_text }>{ schedule_class_item_type_text }</div>
												<div className = { styles.schedule_class_item_course_name } style = {{ display : classNameDisable, WebkitLineClamp: classNameLineClampNumRea }} >
													{ time_data_item.title || '无' }
												</div>
												{ !!time_data_item.process &&
													<div className = { styles.schedule_class_item_course_name } style = {{ display : classNameDisable, WebkitLineClamp: classNameLineClampNumRea }} >
														{ time_data_item.process || '无' }
													</div>
												}
											</div>
										</Popover>
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
				let start_time_2 = moment(time_str, 'HH:mm').add(30, 'm').format('HH:mm');
				let currentDate = moment().format('YYYY-MM-DD');

				let render_col_item = (
					<div className = { styles.schedule_item } key = { 'schedule_item_' + i + j }>
						{ scheduleRender }
						<div
							className = { styles.schedule_item_top }
							style = {{ cursor : createAble && currentDate <= day_str ? 'pointer' : 'auto' }}
						>
						</div>
						<div
							className = { styles.schedule_item_bottom }
							style = {{ cursor : createAble && currentDate <= day_str ? 'pointer' : 'auto' }}
						>
						</div>
					</div>
				);
            	render_col.push( render_col_item );
			}
			render_col.push(
				<div key = { 'schedule_line_' + i } className = { !!selectedTeachers && selectedTeachers.length > 0 && styles.line } ></div>
			)
		}
		return render_col;
	}

	/*首行*/
	function headerRow(){
		let head_render_col = [];
		for( let i = 0; i < 7; i++ ){
			for( let j = 0; j < selectedTeachers.length; j++ ){
				let render_col_item = (
					<div className = { styles.head_schedule_item } key = { 'head_schedule_item_' + i + j }>
						{ selectedTeachers[j].userName }
					</div>
				);
            	head_render_col.push( render_col_item );
			}
			head_render_col.push(
				<div key = { 'content_schedule_line_' + i } className = { !!selectedTeachers && selectedTeachers.length > 0 && styles.line } ></div>
			)
		}
		return head_render_col;
	}

	let render_cont = [];
	for( let i = beginTime; i <= endTime; i++ ){
		let time_moment = moment( i + ':00', 'HH:mm' );
		let time_str = time_moment.format('HH:mm');
		let render_row_item = (
			<div className = { styles.class_schedule_row } style = {{ height : '100px' }} key = { 'class_scheudle_row_' + i }>
				<div className = { styles.schedule_time } >{ time_str }</div>
				<div className = { styles.schedule_content } >
					<div className = { styles.schedule_content_item }>
						{ loopRow( time_str ) }
					</div>
				</div>
			</div>
		)
		render_cont.push( render_row_item );
	}

	/*顶部日期 星期*/
	let day_render_cont = [];
	let week_text_arr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
	let week_text_width = undefined;
	let scroll_width = selectedTeachers.length * 7 * 80;
	let ant_layout_content = document.getElementById('common_content_left');
	let contentWidth = !!ant_layout_content && ant_layout_content.clientWidth - 168;
	if( contentWidth < scroll_width ){
		week_text_width = scroll_width / 7;
	}else{
		week_text_width = contentWidth / 7
	}
	for( let i = 0; i < 7; i++ ){
		let day = moment( startDate, 'YYYY-MM-DD' ).add( i, 'd' );
		let day_str = day.format('YYYY-MM-DD');
		if( day_str == moment().format('YYYY-MM-DD') ){
			day_render_cont.push(
				<div style = {{ width : week_text_width + 'px', minWidth : week_text_width + 'px' }} className = { styles.schedule_header_item_today } key = { 'schedule_header_item_' + i }>
                    <div className = { styles.schedule_header_item_week_text }>今天</div>
                    <div className = { styles.schedule_header_item_date_text }>{ day_str }</div>
                </div>
			)
		}else{
			day_render_cont.push(
				<div style = {{ width : week_text_width + 'px', minWidth : week_text_width + 'px' }} className = { styles.schedule_header_item } key = { 'schedule_header_item_' + i }>
                    <div className = { styles.schedule_header_item_week_text }>{ week_text_arr[i] }</div>
                    <div className = { styles.schedule_header_item_date_text }>{ day_str }</div>
                </div>
			)
		}
	}


	let topDom = document.getElementById('class_schedule_cont_table');
	if( !!topDom ){
		topDom.addEventListener('scroll', function( e ){
			let class_schedule_header = document.getElementById('class_schedule_header');
			let class_schedule_cont_header = document.getElementById('class_schedule_cont_header');
			if(class_schedule_header) {
				class_schedule_header.scrollLeft = topDom.scrollLeft;
			}
			if( class_schedule_cont_header ){
				class_schedule_cont_header.scrollLeft = topDom.scrollLeft;
			}
		});

	}
	if( !teacherFlag ){
		handleWheelAction()
	}

	return(
		<div style = {{ height : '100%', position : 'relative' }} >
			<div className = { styles.class_schedule_cont } style = {{ overflowX : 'hidden', overflowY : 'hidden' }} >

				<div className = { styles.class_schedule_header } id = 'class_schedule_header' >
					<div className = { styles.schedule_header_cont }>
						<div className = { styles.schedule_header_cont_box } >
							{ day_render_cont }
						</div>
					</div>
				</div>
				<div style = {{ overflow : 'hidden', width : 'calc( 100% - 5px )' }}
					 className = { styles.class_schedule_row }
					 key = { 'class_scheudle_row_special' }
					 id = 'class_schedule_cont_header'
				>
					<div style = {{ height : '28px', width : '40px' }} className = { styles.schedule_time } ></div>
					<div className = { styles.schedule_content } >
						<div className = { styles.schedule_content_item }>
							{ headerRow() }
						</div>
					</div>
				</div>
				<div
					className = { styles.class_schedule_cont_table }
					id = 'class_schedule_cont_table'
					style = {{ overflowY : createAble ? 'auto' : 'hidden', width : createAble ? '100%' : 'calc( 100% - 5px )' }}
				>
					{ render_cont }
				</div>
            </div>
		</div>
	)
}

export default ScheduleTeachComponent;
