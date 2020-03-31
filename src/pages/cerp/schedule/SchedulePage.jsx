import React from 'react';
import { message, Button, Spin } from 'antd';
import moment from 'moment';
import styles from './SchedulePage.less';
import { connect } from 'dva';
import ScheduleOperationComponent from '../../../components/cerp/schedule/ScheduleOperation';
import ScheduleDateComponent from '../../../components/cerp/schedule/ScheduleDateComponent';
import ScheduleTeachComponent from '../../../components/cerp/schedule/ScheduleTeachComponent';
import ScheduleRoomComponent from '../../../components/cerp/schedule/ScheduleRoomComponent';

class SchedulePage extends React.Component {
	constructor(props) {
        super(props);

		//初始数据
		this.state = {

			orgId                     : undefined,       //所在校区
			currentDate               : undefined,       //当前时间
			startDate                 : undefined,       //开始时间
			endDate                   : undefined,       //结束时间

			scheduleList              : [],              //排课数据

			scheduleType              : 'date',
			roomSelectList            : [],              //班级下拉
			teachSelectList           : [],              //老师下拉

			selectedTeachers          : [],              //已选老师
			selectedRooms             : [],              //已选教室

			selectedTeacherKeys       : [],
			selectedRoomKeys          : [],

			beginTime                 : 7,
			endTime                   : 22,

			teacherScroll             : 0,
			teacherFlag               : false,
			roomFlag                  : false

			//课程表渲染区域

		}

        // ES6 类中函数必须手动绑定
        this.init = this.init.bind(this);
        this.querySchedule = this.querySchedule.bind(this);

        this.lastWeekClick = this.lastWeekClick.bind(this);
        this.currentWeekClick = this.currentWeekClick.bind(this);
        this.nextWeekClick = this.nextWeekClick.bind(this);

        this.scheduleTypeChange = this.scheduleTypeChange.bind(this);
        this.teacherSelectFunc = this.teacherSelectFunc.bind(this);
        this.roomSelectFunc = this.roomSelectFunc.bind(this);

		//更新排课内容
        this.onUpdateSchedule = this.onUpdateSchedule.bind(this);
        this.onCreateSchedule = this.onCreateSchedule.bind(this);
		//表单提交之后
        this.afterFormSubmit = this.afterFormSubmit.bind(this);

		/*校区选择*/
        this.orgFilterChange = this.orgFilterChange.bind(this);

		this.handleWheelAction = this.handleWheelAction.bind(this)

    }

	componentWillUnmount() {

    }

	componentDidMount(){
//		let orgId = window._init_data.firstOrg.key;                     //??????????到底用哪个orgId
		let orgId = this.props.orgId || window._init_data.firstOrg.key;
		let startDate = moment().startOf('week').format('YYYY-MM-DD');
		let endDate = moment().endOf('week').format('YYYY-MM-DD');
		this.setState({
			startDate,
			endDate,
			orgId
		})
		this.init( startDate, endDate, orgId );
	}

	componentWillReceiveProps( nextProps ){
		let { orgId } = nextProps;
		let startDate = moment().startOf('week').format('YYYY-MM-DD');
		let endDate = moment().endOf('week').format('YYYY-MM-DD');
		this.setState({
			startDate,
			endDate,
			orgId,
			scheduleType        : 'date'
		})
		this.init( startDate, endDate, orgId );
	}

	//进入页面初始化
	init( startDay, endDay, orgId ){
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

		//初始化时间
		serviceRequest(`${BASE_URL}/confController/get?confKey=CPTIMESET`, {},
			function ( ret ){
				let key = ret.list.length > 0 && ret.list[0] && ret.list[0].key;
				let arrs = !!key && key.split('-');
				let beginTime = Number(arrs[0]) || 7;
				let endTime = Number(arrs[1]) || 22;
				me.setState({
					beginTime : beginTime,
					endTime   : endTime
				})
		})

		this.querySchedule( startDay, endDay, orgId );
	}

	querySchedule( startDay, endDay, orgId ){

		let me = this;

        serviceRequest(`${BASE_URL}/cerpCoursePlan/query`, { startDate : startDay, endDate : endDay, orgId, pageSize : 9999, pageIndex : 0 },
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

	//点击上周
	lastWeekClick(){
		let { startDate, endDate, orgId } = this.state;
		let lastStartDate = moment( startDate ).subtract( 7, 'd' ).format('YYYY-MM-DD');
		let lastEndDate = moment( endDate ).subtract( 7, 'd' ).format('YYYY-MM-DD');
		this.setState({
			startDate  : lastStartDate,
			endDate    : lastEndDate
		})
		this.querySchedule( lastStartDate, lastEndDate, orgId );
	}

	//点击本周
	currentWeekClick(){
		let startDate = moment().startOf('week').format('YYYY-MM-DD');
		let endDate = moment().endOf('week').format('YYYY-MM-DD');
		let { orgId } = this.state;
		this.setState({
			startDate,
			endDate
		})
		this.querySchedule( startDate, endDate, orgId );
	}

	//点击下周
	nextWeekClick(){
		let { startDate, endDate, orgId } = this.state;
		let nextStartDate = moment(startDate).add( 7, 'd' ).format('YYYY-MM-DD');
		let nextEndDate = moment(endDate).add( 7, 'd' ).format('YYYY-MM-DD');
		this.setState({
			startDate : nextStartDate,
			endDate   : nextEndDate
		})
		this.querySchedule( nextStartDate, nextEndDate, orgId );
	}

	//改变课程表类型
	scheduleTypeChange( value ){
		let { orgId } = this.state;
		this.setState({
			scheduleType  : value,
			teacherFlag   : false,              //初始进入老师列表状态置为false
			roomFlag      : false
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

	//排课表单提交之后
	afterFormSubmit(){
		let { startDate, endDate, orgId } = this.state;
		this.querySchedule( startDate, endDate, orgId );
	}

	/*校区切换*/
	orgFilterChange( value ){
		this.setState({
			orgId               : value,
			scheduleType        : 'date'
		})
		let me = this;

		//初始化过滤员工下拉框
		serviceRequest(`${BASE_URL}/tenantUserController/summaryQuery`, { orgId : value },
			function(ret) {
				me.setState({
					teachSelectList : ret.results
				});
			}
		);

		//初始化教室下拉框
		serviceRequest(`${BASE_URL}/classRoomController/summaryQuery`, { orgId : value },
			function(ret) {
				me.setState({
					roomSelectList : ret.results
				});
			}
		);
		let { startDate, endDate } = this.state;
		this.querySchedule( startDate, endDate, value );
	}

	handleWheelAction(){
		this.setState({
			teacherFlag   : true,
			roomFlag      : true
		})
	}

	render(){

		let {
			orgId,

			startDate,
			endDate,

			scheduleType,
			roomSelectList,
			teachSelectList,

			scheduleList,               //课程表数据


			selectedTeachers,           //已选老师
			selectedRooms,              //已选教室
			selectedTeacherKeys,
			selectedRoomKeys,

			beginTime,
			endTime,

			teacherFlag,
			roomFlag,

		} = this.state;
		let { createAble } = this.props;

		let scheduleOperationProps = {

			lastWeekClick       : this.lastWeekClick,
			currentWeekClick    : this.currentWeekClick,
			nextWeekClick       : this.nextWeekClick,

			scheduleTypeChange  : this.scheduleTypeChange,

			teacherSelectFunc   : this.teacherSelectFunc,
			roomSelectFunc      : this.roomSelectFunc,

			scheduleType,

			roomSelectList,
			teachSelectList,

			selectedTeacherKeys,                          //已选老师
			selectedRoomKeys,                             //已选教室

			orgId,
			orgFilterChange     : this.orgFilterChange,   //校区切换

			createAble
		}

		//日期参数
		let scheduleDateComponentProps = {
			beginTime : beginTime,
			endTime   : endTime,
			startDate,
			endDate,

			scheduleList,                 //排课数据

			onUpdateSchedule   : this.onUpdateSchedule,
			onCreateSchedule   : this.onCreateSchedule,

			createAble
		}

		//老师维度参数
		let scheduleTeachComponentProps = {

			beginTime : beginTime,
			endTime   : endTime,
			startDate,
			endDate,

			scheduleList,                 //排课数据
			selectedTeachers,             //所选老师

			onUpdateSchedule   : this.onUpdateSchedule,
			onCreateSchedule   : this.onCreateSchedule,

			createAble,

			teacherFlag,
			handleWheelAction  : this.handleWheelAction

		}

		//教室维度参数
		let scheduleRoomComponentProps = {
			beginTime : beginTime,
			endTime   : endTime,
			startDate,
			endDate,

			selectedRooms,               //所选教室
			scheduleList,                //排课数据

			onUpdateSchedule   : this.onUpdateSchedule,
			onCreateSchedule   : this.onCreateSchedule,

			createAble,

			roomFlag,
			handleWheelAction  : this.handleWheelAction

		}

		//表单参数
		let scheduleFormPageProps = {
			afterSubmit : this.afterFormSubmit
		}

		return (
			<div>
				<ScheduleOperationComponent { ...scheduleOperationProps } />
				<div className = 'common_schedule_wrapper' >
					{ scheduleType == 'date' &&
						<ScheduleDateComponent { ...scheduleDateComponentProps } />
					}
					{ scheduleType == 'teacher' &&
						<ScheduleTeachComponent { ...scheduleTeachComponentProps } />
					}
					{ scheduleType == 'room' &&
						<ScheduleRoomComponent { ...scheduleRoomComponentProps } />
					}
				</div>
			</div>
		)
	}
}


function mapStateToProps({ scheduleModel }) {
  return { scheduleModel };
}

export default connect(mapStateToProps)(SchedulePage);
