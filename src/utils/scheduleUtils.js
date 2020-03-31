/*
 * 课程表数据整理算法
 *
 */

import moment from 'moment';

//按日期整理
export function scheduleDataByDate( arr ){
	if( arr && arr.length > 0 ){
		let obj = {};
		let keys = [];
		arr.forEach( function( item, index ){
			let label = item['studyDate'];
			if( keys.indexOf( label ) == -1 ){
				keys.push( label );
				obj[ label ] = [item];
			}else{
				obj[ label ].push( item );
			}
		})
		return obj;
	}else{
		return {};
	}
}

//按老师整理
export function scheduleDataByTeach( obj, selectedTeachers ){
	let dayKeys = Object.keys( obj );
	dayKeys.length > 0 && dayKeys.forEach( function( item, index ){
		let currentDayList = obj[item];                //一天的课程表
		let data = {};
		selectedTeachers.length > 0 && selectedTeachers.forEach(function( item, index ){
			let teacherKey = item.userId;        //老师id
			let teacherLabel = item.userName;    //老师名字
			data[teacherLabel] = [];
			currentDayList.forEach( function( item, index ){
				let currentTeacherArr = item.ptArr;
				let currentTeacherAtArr = item.atArr;
				for( let j = 0; j < currentTeacherArr.length; j++ ){
					if( teacherKey == currentTeacherArr[j].uid ){
						 data[teacherLabel].push( item )
					}
				}
				for( let i = 0; i < currentTeacherAtArr.length; i++ ){
					if( teacherKey == currentTeacherAtArr[i].uid ){
						 data[teacherLabel].push( item )
					}
				}
			})
		})
		obj[item] = data;
	})
	return obj;
}


//早教类按老师整理
export function scheduleDataByTeach2( obj, selectedTeachers ){
	let dayKeys = Object.keys( obj );
	dayKeys.length > 0 && dayKeys.forEach( function( item, index ){
		let currentDayList = obj[item];                //一天的课程表
		let data = {};
		selectedTeachers.length > 0 && selectedTeachers.forEach(function( item, index ){
			let teacherKey = item.userId;        //老师id
			let teacherLabel = item.userName;    //老师名字
			data[teacherLabel] = [];
			currentDayList.forEach( function( item, index ){
				let currentTeacherArr = item.mtids &&  item.mtids.split(',') || [];
				let currentTeacherAtArr = item.atids && item.atids.split(',') || [];
				for( let j = 0; j < currentTeacherArr.length; j++ ){
					if( teacherKey == currentTeacherArr[j] ){
						 data[teacherLabel].push( item )
					}
				}
				for( let i = 0; i < currentTeacherAtArr.length; i++ ){
					if( teacherKey == currentTeacherAtArr[i] ){
						 data[teacherLabel].push( item )
					}
				}
			})
		})
		obj[item] = data;
	})
	return obj;
}

//按教室整理
export function scheduleDataByRoom( obj, selectedRooms ){
	let dayKeys = Object.keys( obj );
	dayKeys.length > 0 && dayKeys.forEach( function( item, index ){
		let currentDayList = obj[item];                //一天的课程表
		let data = {};
		selectedRooms.length > 0 && selectedRooms.forEach(function( item, index ){
			let roomKey = item.roomId;        //教室id
			let roomLabel = item.roomName;    //教室名字
			data[roomLabel] = [];
			currentDayList.forEach( function( item, index ){
				if( roomKey == item.roomId ){
					data[roomLabel].push( item )
				}
			})
		})
		obj[item] = data;
	})
	return obj;
}

//早教类按教室整理
export function scheduleDataByRoom2( obj, selectedRooms ){
	let dayKeys = Object.keys( obj );
	dayKeys.length > 0 && dayKeys.forEach( function( item, index ){
		let currentDayList = obj[item];                //一天的课程表
		let data = {};
		selectedRooms.length > 0 && selectedRooms.forEach(function( item, index ){
			let roomKey = item.id;        //教室id
			let roomLabel = item.name;    //教室名字
			data[roomLabel] = [];
			currentDayList.forEach( function( item, index ){
				if( roomKey == item.roomId ){
					data[roomLabel].push( item )
				}
			})
		})
		obj[item] = data;
	})
	return obj;
}

//按時間排序
export function objListSortOfTime( arr, sortField, format ) {
    if( arr && arr.length > 0) {
        let new_arr = arr.sort(function(obj1, obj2){
            let str1 = obj1[sortField];
            let str2 = obj2[sortField];
            let time1 = moment(str1, format);
            let time2 = moment(str2, format);
            return time1 - time2;
        });
        return new_arr;
    } else {
        return arr;
    }
}

//按教室 时间整理
export function scheduleDataByRoomTime( obj, selectedRooms ){
	let dayKeys = Object.keys( obj );
	dayKeys.length > 0 && dayKeys.forEach(function(item) {
        let currentDayList = obj[item];                // 一天的所有课程表计划
		let roomKeys = Object.keys( currentDayList );
		roomKeys.length > 0 && roomKeys.forEach(function( item ){
			let roomScheduleList = currentDayList[ item ];
			if( roomScheduleList && roomScheduleList.length > 0 ){
				let afterSortList = objListSortOfTime( roomScheduleList, 'startTime', 'HH:mm' );
				let data = {};

				let min_begin_time = '';
				let max_end_time = '';

				afterSortList.length > 0 && afterSortList.forEach(function( classItem ){
					let class_begin_time = classItem.startTime;
					let class_end_time = classItem.endTime;

					if( min_begin_time == '' ){
						min_begin_time = class_begin_time;
					}
					if( max_end_time == '' ){
						max_end_time = class_end_time;
					}

					//新一行的課程表數據
					if( class_begin_time >= max_end_time ){
						//更新當前最小開始時間
						min_begin_time = class_begin_time;
						//更新當前最大結束時間
						max_end_time = class_end_time;
						if( !data[min_begin_time] ){
							data[min_begin_time] = [];
						}
						data[min_begin_time].push( classItem );
					}else {
						if( !data[min_begin_time] ){
							data[min_begin_time] = [];
						}
						data[min_begin_time].push( classItem );

						//更新當前最大結束時間
						if( class_end_time > max_end_time ){
							max_end_time = class_end_time;
						}
					}
				})
				currentDayList[ item ] = data;
			}
		})
		obj[ item ] = currentDayList;
    });
	return obj;
}

//按時間整理
export function scheduleDataByTime( obj, selectedTeachers ){
	let dayKeys = Object.keys( obj );
	dayKeys.length > 0 && dayKeys.forEach(function(item) {
        let currentDayList = obj[item];                // 一天的所有课程表计划
		let teacherKeys = Object.keys( currentDayList );
		teacherKeys.length > 0 && teacherKeys.forEach(function( item ){
			let teacherScheduleList = currentDayList[ item ];
			if( teacherScheduleList && teacherScheduleList.length > 0 ){
				let afterSortList = objListSortOfTime( teacherScheduleList, 'startTime', 'HH:mm' );
				let data = {};

				let min_begin_time = '';
				let max_end_time = '';

				afterSortList.length > 0 && afterSortList.forEach(function( classItem ){
					let class_begin_time = classItem.startTime;
					let class_end_time = classItem.endTime;

					if( min_begin_time == '' ){
						min_begin_time = class_begin_time;
					}
					if( max_end_time == '' ){
						max_end_time = class_end_time;
					}

					//新一行的課程表數據
					if( class_begin_time >= max_end_time ){
						//更新當前最小開始時間
						min_begin_time = class_begin_time;
						//更新當前最大結束時間
						max_end_time = class_end_time;
						if( !data[min_begin_time] ){
							data[min_begin_time] = [];
						}
						data[min_begin_time].push( classItem );
					}else {
						if( !data[min_begin_time] ){
							data[min_begin_time] = [];
						}
						data[min_begin_time].push( classItem );

						//更新當前最大結束時間
						if( class_end_time > max_end_time ){
							max_end_time = class_end_time;
						}
					}
				})
				currentDayList[ item ] = data;
			}
		})
		obj[ item ] = currentDayList;
    });
	return obj;
}
