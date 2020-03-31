import React from 'react';
import { message, Button, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './OrderClassSchedulePage.less';
import ScheduleOperationComponent from '../../../components/erp/order-class/order-class-schedule/ScheduleOperation';      //头部操作栏
import OrderClassDetail from './OrderClassDetailPage';       //详情
import ScheduleSearchComponent from '../../../components/erp/order-class/order-class-schedule/ScheduleSearch';

//按周展示
import ScheduleDateComponent      from '../../../components/erp/order-class/order-class-schedule/ScheduleDateComponent';  //日期维度课表
import ScheduleTeachComponent     from '../../../components/erp/order-class/order-class-schedule/ScheduleTeachComponent'; //老师维度课表
import ScheduleRoomComponent      from '../../../components/erp/order-class/order-class-schedule/ScheduleRoomComponent';  //教室维度课表
//按天展示
import ScheduleDateByDay          from '../../../components/erp/order-class/order-class-schedule/ScheduleDateByDay';      //按天日期维度课表
import ScheduleTeachByDay         from '../../../components/erp/order-class/order-class-schedule/ScheduleTeachByDay';     //按天老师维度课表
import ScheduleRoomByDay          from '../../../components/erp/order-class/order-class-schedule/ScheduleRoomByDay';      //按天教室维度课表

class OrderClassSchedulePage extends React.Component {
	constructor(props) {
        super(props);
		//数据初始化
		this.state = {
			scheduleList              : [],              //排课数据

			orgId                     : undefined,       //所在校区
			currentDate               : undefined,       //当前时间
			startDate                 : undefined,       //开始时间
			endDate                   : undefined,       //结束时间

			scheduleType              : 'date',          //维度类型
			periodType                : 'perWeek',       //按天按周展示
			beginTime                 : 7,               //课表开始时间
			endTime                   : 22,              //课表结束时间
			roomSelectList            : [],              //班级下拉
			teachSelectList           : [],              //老师下拉
			courseSelectList          : [],              //课程下拉
			stuIdSelectList           : [],              //学员下拉
			classSelectList           : [],              //班级下拉

			selectedTeachers          : [],              //已选老师
			selectedRooms             : [],              //已选教室

			selectedTeacherKeys       : [],
			selectedRoomKeys          : [],


			teacherFlag               : false,           //初始进入老师维度 状态为false, 重新刷新得到dom
			roomFlag                  : false,           //初始进入教室维度 状态为false, 重新刷新得到dom

            dp                        : props.dispatch,

			commonSearchContent       : {}
		}

        // ES6 类中函数必须手动绑定
        this.init = this.init.bind(this);
        this.querySchedule = this.querySchedule.bind(this);

        this.changeTimeByDayAndWeek = this.changeTimeByDayAndWeek.bind(this);   //切换 上周 下周 下一天 上一天

        this.scheduleTypeChange = this.scheduleTypeChange.bind(this);  //改变课表维度
        this.teacherSelectFunc  = this.teacherSelectFunc.bind(this);   //选择老师
        this.roomSelectFunc     = this.roomSelectFunc.bind(this);      //选择教室
        this.dayAndWeekChange   = this.dayAndWeekChange.bind(this);    //按天按周


        this.showDetail = this.showDetail.bind(this);                  //显示详情
		//更新排课内容
        this.onUpdateSchedule = this.onUpdateSchedule.bind(this);
        this.onCreateSchedule = this.onCreateSchedule.bind(this);

		this.handleWheelAction = this.handleWheelAction.bind(this);     //刷新获取dom元素
		this.refreshSchedule = this.refreshSchedule.bind(this);     //刷新获取dom元素

        this.jumpToPrintByDay = this.jumpToPrintByDay.bind(this);

		//常用搜索
        this.searchFunction = this.searchFunction.bind(this);
        this.clearFunction = this.clearFunction.bind(this);

    }

	componentWillUnmount() {
    }

	componentDidMount(){
		let orgId = this.props.orgId || window._init_data.cerp_orgId;
		let startDate = moment().startOf('week').format('YYYY-MM-DD');
		let endDate = moment().endOf('week').format('YYYY-MM-DD');
		this.setState({
			orgId, startDate, endDate
		})
		this.init( startDate, endDate, orgId );
	}

	componentWillReceiveProps( nextProps ){
		let { orgId } = nextProps;
		let startDate = moment().startOf('week').format('YYYY-MM-DD');
		let endDate = moment().endOf('week').format('YYYY-MM-DD');
		this.setState({
			orgId, startDate, endDate, scheduleType : 'date'
		})
		this.init( startDate, endDate, orgId );
	}

	//进入页面初始化
	init( startDate, endDate, orgId ){
		let me = this;
		//初始化过滤员工下拉框
		serviceRequest(`${BASE_URL}/tenantUserController/summaryQuery`, { orgId },
			function(ret) {
				me.setState({
					teachSelectList : ret.results
				});
			}
		);
		//初始化教室下拉框
		serviceRequest(`${BASE_URL}/cerpClsroom/summaryQuery`, { orgId },
			function(ret) {
				me.setState({
					roomSelectList : ret.results
				});
			}
		);

		//初始化课程下拉列表
		serviceRequest(`${BASE_URL}/cerpCourse/summaryQuery`, { orgId },
			function(ret) {
				me.setState({
					courseSelectList : ret.results
				});
			}
		);

		//初始化学员下拉列表
		serviceRequest(`${BASE_URL}/stu/summaryQuery`, { orgId },
			function(ret) {
				me.setState({
					stuIdSelectList : ret.results
				});
			}
		);

		//初始化班级下拉列表
		serviceRequest(`${BASE_URL}/classGrade/classGradeSummary`, { orgId },
			function(ret) {
				me.setState({
					classSelectList : ret.results
				});
			}
		);

		//初始化时间
		serviceRequest(`${BASE_URL}/confController/get?confKey=CPTIMESET`, {},
			function ( ret ){
				let key = ret.list.length > 0 && ret.list[0] && ret.list[0].key;
				let arrs = !!key && key.split('-');
				let beginTime = Number(arrs[0]) >= 0 ? Number(arrs[0]) : 7;
				let endTime = Number(arrs[1]) || 22;
				me.setState({
					beginTime : beginTime,
					endTime   : endTime
				})
		})

		this.querySchedule( startDate, endDate, orgId );
	}

	refreshSchedule(){
		let { startDate, endDate, orgId, commonSearchContent } = this.state;
		this.querySchedule( startDate, endDate, orgId, commonSearchContent );
	}

	querySchedule( startDate, endDate, orgId, params ){

		let me = this;

        serviceRequest(`${BASE_URL}/cerpCoursePlan/query`, { startDate, endDate, orgId , pageIndex : 0 , pageSize : 99999, ...params },
            function( ret ) {
                let state = me.state;
				me.setState({
					scheduleList : ret.results
				})
            },
            function(ret) {
                message.error((ret && ret.errorMessage) || '没有查询到课程表数据');
            }
        );
	}

	//切换 上一周 下一周 前一天 后一天
	changeTimeByDayAndWeek( type ){
		let { startDate, endDate, orgId, commonSearchContent } = this.state;
		let newStartDate = undefined, newEndDate = undefined;
		if( type == 'lastWeek' ){ //上周
			newStartDate = moment( startDate ).subtract( 7, 'd' ).format('YYYY-MM-DD');
			newEndDate = moment( endDate ).subtract( 7, 'd' ).format('YYYY-MM-DD');
		}else if( type == 'currWeek' ){ //本周
			newStartDate = moment().startOf('week').format('YYYY-MM-DD');
			newEndDate = moment().endOf('week').format('YYYY-MM-DD');
		}else if( type == 'nextWeek' ){ //下周
			newStartDate = moment(startDate).add( 7, 'd' ).format('YYYY-MM-DD');
			newEndDate = moment(endDate).add( 7, 'd' ).format('YYYY-MM-DD');
		}else if( type == 'lastDay' ){ //上一天
			newStartDate = moment( startDate ).subtract( 1, 'd' ).format('YYYY-MM-DD');
			newEndDate = moment( endDate ).subtract( 1, 'd' ).format('YYYY-MM-DD');
		}else if( type == 'currDay' ){ //今天
			newStartDate = moment().format('YYYY-MM-DD');
			newEndDate = moment().format('YYYY-MM-DD');
		}else if( type == 'nextDay' ){ //下一天
			newStartDate = moment( startDate ).add( 1, 'd' ).format('YYYY-MM-DD');
			newEndDate = moment( endDate ).add( 1, 'd' ).format('YYYY-MM-DD');
		}
		this.setState({
			startDate : newStartDate,
			endDate   : newEndDate
		})
		this.querySchedule( newStartDate, newEndDate, orgId, commonSearchContent );
	}

	//点击切换按天按周展示
	dayAndWeekChange( e ){
		let { orgId, commonSearchContent } = this.state;            //得到orgId
		let periodType = e.target.value;       //按天按周
		let teachers = window.localStorage && window.localStorage.getItem('selectedTeachers[' + orgId + ']');
		let selectedTeachers = !!teachers && JSON.parse( teachers );
		let startDate = undefined,
			endDate = undefined;
		if( periodType == 'perDay' ){
			startDate = moment().format('YYYY-MM-DD');
			endDate = moment().format('YYYY-MM-DD');
			this.setState({
				scheduleType : 'teacher'
			})
		}else if( periodType = 'perWeek' ){
			startDate = moment().startOf('week').format('YYYY-MM-DD');
			endDate = moment().endOf('week').format('YYYY-MM-DD');
			this.setState({
				scheduleType : 'date'
			})
		}
		this.setState({
			periodType, startDate, endDate, selectedTeachers
		})
		this.querySchedule( startDate, endDate, orgId, commonSearchContent );
	}

	//改变课程表类型
	scheduleTypeChange( value ){
		let { orgId } = this.state;
		this.setState({
			scheduleType  : value,
			teacherFlag   : false,              //初始进入老师维度状态置为false
			roomFlag      : false               //初始进入教室维度状态置为false
		})
		let teachers = window.localStorage && window.localStorage.getItem('selectedTeachers[' + orgId + ']');
		let selectedTeachers = !!teachers && JSON.parse( teachers );
		let rooms = window.localStorage && window.localStorage.getItem('selectedRooms[' + orgId + ']');
		let selectedRooms = !!rooms && JSON.parse( rooms );
		this.setState({
			selectedTeachers,
			selectedRooms
		})
	}

	//选择老师更新课程表
	teacherSelectFunc( value ){
		let { teachSelectList, orgId } = this.state;
		let selectedTeachers = [];
		teachSelectList.length > 0 && teachSelectList.forEach(function( item, index ){
			for( let i = 0; i < value.length; i++ ){
				if( value[i] == item.userId ){
					selectedTeachers.push( item )
				}
			}
		})
		this.setState({
			selectedTeachers,
			selectedTeacherKeys : value
		});

		//本地存储
		let storage = window.localStorage;
		let teacherJson = JSON.stringify( value );
		let selectedTeacherJson = JSON.stringify( selectedTeachers );
		storage.setItem( 'teachers[' + orgId + ']', teacherJson );
		storage.setItem( 'selectedTeachers[' + orgId + ']', selectedTeacherJson );
	}

	//选择教室更新课程表
	roomSelectFunc( value ){
		let { roomSelectList, orgId } = this.state;
		let selectedRooms = [];
		roomSelectList.length > 0 && roomSelectList.forEach( function( item, index ){
			for( let i = 0; i < value.length; i++ ){
				if( value[i] == item.id ){
					selectedRooms.push( item );
				}
			}
		})
		this.setState({
			selectedRooms,
			selectedRoomKeys : value
		})

		//本地存储
		let storage = window.localStorage;
		let roomJson = JSON.stringify( value );
		let selectedRoomJson = JSON.stringify( selectedRooms )
		storage.setItem( 'rooms[' + orgId + ']', roomJson );
		storage.setItem( 'selectedRooms[' + orgId + ']', selectedRoomJson)
	}

	//显示详情
	showDetail( item ){
		if( !this.props.createAble ) {
            return;
        }
		let { orgId } = this.state;
		this.props.dispatch && this.props.dispatch({
			type : 'orderClassDetailModel/showDetail',
			payload : {
				item,
				orgId,
			}
		})
	}

	//更新排课内容
	onUpdateSchedule( orgId, cpId ){
		if( !this.props.createAble ) {
            return;
        }
        this.props.dispatch && this.props.dispatch({
            type: 'classScheduleFormModel/show',
            payload: {
                orgId,
				cpId
            }
        });
	}

	//新增排课内容
    onCreateSchedule( startTime, day_str, id ) {
        if( !this.props.createAble ) {
            return;
        }
		let currentDate = moment().format('YYYY-MM-DD');
		if( day_str < currentDate ){
			message.error( '今天之前不能排课' );
			return;
		}

		let endTime = undefined;
        if( startTime && ( typeof startTime == 'string' || startTime.constructor == String)) {
            endTime = moment( startTime, 'HH:mm' ).add( 60, 'm' ).format( 'HH:mm' );
        } else {
            startTime = undefined;
        }

		let params = {};
		let { scheduleType } = this.state;
		if( scheduleType == 'room' ){
			params = {
				startTime,
				endTime,
				studyDate : day_str || undefined,
				roomId     : id || undefined
			}
		}else if( scheduleType == 'teacher' ){
			params = {
				startTime,
				endTime,
				studyDate : day_str || undefined,
				ptArr : id + '' || undefined
			}
		}else if( scheduleType == 'date' ){
			params = {
				startTime,
				endTime,
				studyDate : day_str || undefined,
			}
		}

        this.props.dispatch && this.props.dispatch({
            type: 'classScheduleFormModel/show',
            payload: {
                ...params
            }
        });
    }

	//初次进入教室维度或老师维度 刷新页面获取dom节点
	handleWheelAction(){
		this.setState({
			teacherFlag   : true,
			roomFlag      : true
		})
	}

    jumpToPrintByDay(){
        this.props.dispatch && this.props.dispatch(routerRedux.push({
            pathname : 'schedule_print_by_day'
        }))
    }

	//常用搜索
	searchFunction( values ){
		let { startDate, endDate, orgId } = this.state;
		this.querySchedule( startDate, endDate, orgId, values );
	}

	clearFunction(){
		let { startDate, endDate, orgId } = this.state;
		this.querySchedule( startDate, endDate, orgId );
	}

	render(){
		let {
			orgId,               //校区id
			scheduleList,        //课程表数据

			startDate,           //开始日期
			endDate,             //结束日期
			beginTime,           //时间维度开始时间
			endTime,             //时间维度结束时间

			scheduleType,        //课表维度类型
			periodType,          //按周按天展示
			roomSelectList,      //教室下拉列表
			teachSelectList,     //老师下拉列表
			courseSelectList,
			stuIdSelectList,
			classSelectList,

			selectedTeachers,    //已选老师
			selectedTeacherKeys,
			selectedRooms,       //已选教室
			selectedRoomKeys,

			teacherFlag,         //老师维度状态参数
			roomFlag,            //教室维度状态参数
		} = this.state;

		let { createAble } = this.props;

		let scheduleOperationProps = {
			/*方法*/
			changeTimeByDayAndWeek : this.changeTimeByDayAndWeek,        //切换 上周 下周 前一天 后一天

			scheduleTypeChange  : this.scheduleTypeChange,               //改变课程表维度
			scheduleType,                                                //课程表维度( 日期, 日期+老师, 日期+教室 )
			teacherSelectFunc   : this.teacherSelectFunc,                //选中老师
			roomSelectFunc      : this.roomSelectFunc,                   //选中教室

			dayAndWeekChange    : this.dayAndWeekChange,                 //按周按天展示切换

            JumpToPrintByDay   : this.jumpToPrintByDay,                   //跳到按天打印课程表

			/*数据*/
			roomSelectList,       //教室下拉列表
			teachSelectList,      //老师下拉列表
			selectedTeacherKeys,  //已选老师
			selectedRoomKeys,     //已选教室
			orgId,                //当前校区id( 从localStorage获取缓存数据 )
			periodType,           //按天或按周展示
		}

		let scheduleSearchComponentProps = {
			onSearch : this.searchFunction,
			onClear  : this.clearFunction,

			stuIdSelectList,
			courseSelectList,
			classSelectList,
			teachSelectList,
		}

		let params = {
			startDate,      //开始日期
			endDate,        //结束日期
			beginTime,      //时间维度开始时间
			endTime,        //时间维度结束时间

			scheduleList,   //排课数据

			showDetail    : this.showDetail,

			createAble
		}

		//日期参数
		let scheduleDateComponentProps = {
			...params
		}

		//老师维度参数
		let scheduleTeachComponentProps = {
			selectedTeachers, //所选老师

			teacherFlag,
			handleWheelAction  : this.handleWheelAction,
			...params
		}

		//教室维度参数
		let scheduleRoomComponentProps = {
			selectedRooms,  //所选教室

			roomFlag,
			handleWheelAction  : this.handleWheelAction,
			...params
		}

		//按天 日期维度
		let scheduleDateByDayProps = {
			...params
		}

		//按天 老师维度
		let scheduleTeachByDayProps = {
			selectedTeachers, //所选老师

			teacherFlag,
			handleWheelAction  : this.handleWheelAction,
			...params
		}

		//按天 教室维度
		let scheduleRoomByDayProps = {
			selectedRooms,  //所选教室

			roomFlag,
			handleWheelAction  : this.handleWheelAction,
			...params
		}

		let orderClassDetailProps = {
			refreshSchedule : this.refreshSchedule
		}
		return (
			<div style = {{ height : createAble ? '100%' : '' }} >
				<ScheduleOperationComponent { ...scheduleOperationProps } />
				{ !!createAble &&
					<ScheduleSearchComponent { ...scheduleSearchComponentProps } />
				}
				<div className = 'common_schedule_wrapper' >
					{
						scheduleType == 'date' && periodType == 'perWeek' &&
						<ScheduleDateComponent { ...scheduleDateComponentProps } />
					}{
						scheduleType == 'teacher' && periodType == 'perWeek' &&
						<ScheduleTeachComponent { ...scheduleTeachComponentProps } />
					}{
						scheduleType == 'room' && periodType == 'perWeek' &&
						<ScheduleRoomComponent { ...scheduleRoomComponentProps } />
					}{
						scheduleType == 'date' && periodType == 'perDay' &&
						<ScheduleDateByDay { ...scheduleDateByDayProps } />
					}{
						scheduleType == 'teacher' && periodType == 'perDay' &&
						<ScheduleTeachByDay { ...scheduleTeachByDayProps } />
					}{
						scheduleType == 'room' && periodType == 'perDay' &&
						<ScheduleRoomByDay { ...scheduleRoomByDayProps } />
					}
				</div>
				{ !!createAble &&
					<OrderClassDetail { ...orderClassDetailProps } />
				}
			</div>
		)
	}
}


function mapStateToProps({ orderClassScheduleModel }) {
  return { orderClassScheduleModel };
}

export default connect(mapStateToProps)(OrderClassSchedulePage);
