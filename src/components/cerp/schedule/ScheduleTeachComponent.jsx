import React from 'react';
import { Button, Popover, Progress, Affix } from 'antd';
import moment from 'moment';
import styles from './ScheduleTeachComponent.less';
import { objListSortOfTime, scheduleDataAlgorithm } from '../../../utils/arrayUtils';
import { scheduleDataByDate, scheduleDataByTeach2, scheduleDataByTime } from '../../../utils/scheduleUtils';

function ScheduleTeachComponent({
	beginTime,
	endTime,
	startDate,
	endDate,

	scheduleList,
	selectedTeachers,

	onUpdateSchedule,           //更新排课内容
	onCreateSchedule,           //新增排课内容
	createAble,                 //是否可以新增

	teacherScroll,
	teacherFlag,
	handleWheelAction

}){
	let scheduleDataListByDate = scheduleDataByDate( scheduleList );                                 //按日期整理
	let scheduleDataListByTeach = scheduleDataByTeach2( scheduleDataListByDate, selectedTeachers );   //按老師整理
	let scheduleDataListByTime = scheduleDataByTime( scheduleDataListByTeach, selectedTeachers );    //按時間整理

	/*获取课程表的学员名称字符串*/
    function getScheduleStudent( stus ) {
        let stu_str = '';
        let stu_arr = [];
        if(stus && stus.length > 0) {
            stus.forEach(function( stu_item ) {
                stu_arr.push( stu_item.stuName );
            });
        }
        return stu_arr.join(',');
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

									//主教
									let ptArr = time_data_item.ptArr;
									let has_ptArr = ptArr && ptArr.length > 0;

									let ptArr_str = '';//上课老师
									let ptArr_arr = [];
									if(has_ptArr) {
										ptArr.forEach(function(tea_item) {
											ptArr_arr.push(tea_item.uname);
										});
									}
									if(ptArr_arr && ptArr_arr.length > 0) {
										ptArr_str = ptArr_arr.join(',');
									}

									//助教
									let atArr = time_data_item.atArr;
									let has_atArr = atArr && atArr.length > 0;

									let atArr_str = '';//上课老师
									let atArr_arr = [];
									if(has_atArr) {
										atArr.forEach(function(tea_item) {
											atArr_arr.push(tea_item.uname);
										});
									}
									if(atArr_arr && atArr_arr.length > 0) {
										atArr_str = atArr_arr.join(',');
									}

									//班课学员
									let normalStuStr = getScheduleStudent(time_data_item.normalStuArr);
									//补课学员
									let remedialStuStr = getScheduleStudent(time_data_item.remedialStuArr);
									//试听学员
									let auditionStuStr = getScheduleStudent(time_data_item.auditionStuArr);


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
											<div className = { styles.class_content_type } style = {{ backgroundColor : time_data_item_color }}>
												{schedule_class_item_type_text}
											</div>
											<div className = { styles.class_content_org_name } >
												{time_data_item.orgName||'无'}
											</div>
											<div className = { styles.class_content_time } >
												{class_time_str}
											</div>
											<div className = { styles.class_content_classroom } >
												{ time_data_item.roomName || '无' }
											</div>
											{ !!( time_data_item.courseName ) && <div className = { styles.class_content_course_name }>{ time_data_item.courseName || '无' }</div>}
											{ !!( time_data_item.className ) && <div className = { styles.class_content_class_name }>{ time_data_item.className || '无' }</div>}
                                        	{ !!time_data_item.mtNames && <div className = { styles.class_content_teachers_pt }>{time_data_item.mtNames || '无' }</div> }
											{ !!has_ptArr && <div className = { styles.class_content_teachers_pt } >{ ptArr_str || '无' }</div>}
											{ !!has_atArr && <div className = { styles.class_content_teachers_at } >{ atArr_str || '无' }</div>}

											{!!(normalStuStr   && normalStuStr.length > 0)   && <div className = { styles.class_content_students_normal }>{ normalStuStr || '无' }</div>}
											{!!(remedialStuStr && remedialStuStr.length > 0) && <div className = { styles.class_content_students_remedial }>{ remedialStuStr || '无' }</div>}
											{!!(auditionStuStr && auditionStuStr.length > 0) && <div className = { styles.class_content_students_audition }>{ auditionStuStr || '无' }</div>}

											{!!(time_data_item.type == '2') && <div className = { styles.class_content_intro_1 } >{ time_data_item.cpContent || '无' }</div> }
											{!!(time_data_item.type == '1') && <div className = { styles.class_content_intro_2 } >{ time_data_item.cpContent || '无' }</div> }
											{!!(time_data_item.type == '3') && <div className = { styles.class_content_intro_3 } >{ time_data_item.cpContent || '无' }</div> }
											{!!isShowProgress &&
												<div className = { styles.class_content_progress }>
													<Progress status = { progressPercent == 100 ? 'success' : 'active' } percent = { progressPercent } strokeWidth = { 5 } format = { () => curProgress + '/' + maxProgress } />
												</div>
											}
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
												onClick = { () => onUpdateSchedule( time_data_item.orgId, time_data_item.cpId ) }
												key={'schedule_class_item_'+time_data_item_index}
												style={{ backgroundColor : time_data_item_color, height : time_data_item_height, width : width_percent + '%', top : time_data_item_top }}
											>
												<div className = { styles.schedule_class_item_type_text }>{ schedule_class_item_type_text }</div>
												<div className = { styles.schedule_class_item_course_name } style = {{ display : classNameDisable, WebkitLineClamp: classNameLineClampNumRea }} >
													{ time_data_item.className || time_data_item.courseName || '无' }
												</div>
												{ !!isShowProgress &&
													<div className={ styles.schedule_class_item_course_progress } style = {{ display: classNameDisable }}>
														{'[' + curProgress + '/' + maxProgress + ']'}
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
							onClick = { () => onCreateSchedule( start_time, day_str, teacherId ) }
							style = {{ cursor : createAble && currentDate <= day_str ? 'pointer' : 'auto' }}
						>
						</div>
						<div
							className = { styles.schedule_item_bottom }
							onClick = { () => onCreateSchedule( start_time_2, day_str, teacherId ) }
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
				<div className = { styles.class_schedule_cont_table } id = 'class_schedule_cont_table'>
					{ render_cont }
				</div>
            </div>
		</div>
	)
}

export default ScheduleTeachComponent;
