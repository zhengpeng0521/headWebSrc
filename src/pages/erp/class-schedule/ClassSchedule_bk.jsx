/**
 * 排课查询界面
 * @author yujq
 * @props:
 *        date string 当天日期 Format: YYYY-MM-DD HH:mm:ss
 *        onClose Function 关闭窗口触发事件
 *        afterSubmit Function 提交提交后触发事件
 *        disabled Boolean 是否可以编辑修改， 默认false
 *        init_org_select Array 初始选中的机构编号列表
 *        tbody_height string 课程表内容的高度
 *        createAble boolean 是否显示新增按钮 默认不显示
 *        filterType array 过滤的类型  ['org', 'class', 'course', 'teacher', 'sutdent']
 *        defaultQuery object 默认的检索对象  {orgId: 123, classId: 234}
 */

import React from 'react';
import {Modal, Button, Spin, message, } from 'antd';
import moment from 'moment';
import ClassScheduleComponent from '../../../components/erp/class-schedule/ClassScheduleComponent';
import ClassScheduleFormPage from './ClassScheduleFormPage';
import {objEquals} from '../../../utils/objectUtil';

const ClassSchedule = React.createClass({
    getInitialState() {
        return {
            loading: false,             //是否加载中
            classScheduleList: [],             //排课数据
            nextWeek_classScheduleList: [],             //下周排课数据
            previousWeek_classScheduleList: [],             //上周排课数据

            classes_list: [],//班级列表 下拉框
            course_list: [],//课程列表 下拉框
            teacher_list: [],//老师列表 下拉框
            student_list: [],//学员列表 下拉框
            query: this.props.defaultQuery || {},                      //过滤参数

            formModalVisible: false, //表单窗口是否显示
            classScheduleData: {},//表单数据

            filterType: this.props.filterType || [], //用于过滤课程表的选项

            courseComData: [],//表单界面里 课程下的相关下拉框数据
        }
    },

    componentDidMount() {
        this.init(moment().startOf('week').format('YYYY-MM-DD'), moment().endOf('week').format('YYYY-MM-DD'));
    },

    init(startDay, endDay) {
        let me = this;

        let {filterType,query,} = this.state;

        filterType && filterType.length > 0 && filterType.map(function(filterTypeItem) {
            if(filterTypeItem == 'class') {
                //初始化过滤班级下拉框
                serviceRequest(`${BASE_URL}/classesService/summaryQuery`, {},
                    function(ret) {
                        me.setState({
                            classes_list : ret.results
                        });
                    }
                );
            } else if(filterTypeItem == 'course') {
                //初始化过滤课程下拉框
                serviceRequest(`${BASE_URL}/courseController/summaryQuery`, {},
                    function(ret) {
                        me.setState({
                            course_list : ret.results
                        });
                    }
                );
            } else if(filterTypeItem == 'teacher') {
                //初始化过滤员工下拉框
                serviceRequest(`${BASE_URL}/tenantUserController/summaryQuery`, {},
                    function(ret) {
                        me.setState({
                            teacher_list : ret.results
                        });
                    }
                );
            } else if(filterTypeItem == 'sutdent') {
                //初始化过滤学员下拉框
                serviceRequest(`${BASE_URL}/stu/summaryQuery`, {},
                    function(ret) {
                        me.setState({
                            student_list : ret.results
                        });
                    }
                );
            }
        });

        if(this.props.defaultQuery == undefined) {
            //初始化过滤员工下拉框
            query.orgId = window._init_data.firstOrg ? window._init_data.firstOrg.key : '';
            me.queryClassSchedule(startDay, endDay, query, 'classScheduleList');
        } else {
            this.queryClassSchedule(startDay, endDay, query, 'classScheduleList');
        }

    },

    /*defaultQuery 属性受控*/
    componentWillReceiveProps(nextProps) {
        if ('defaultQuery' in nextProps) {
          if(nextProps.defaultQuery != this.props.defaultQuery) {
              let defaultQuery = nextProps.defaultQuery;
              let oldDefaultQuery = this.props.defaultQuery;

              //比较两个defaultQuery的值是否相同
              if(!objEquals(defaultQuery, oldDefaultQuery)) {
                  this.onFilterQuery(defaultQuery);
              }
          }
        }
    },

        /*查询课程表数据*/
    queryClassSchedule(startDay, endDay, query, classScheduletype) {
        let me = this;

        me.setState({
            loading: true,
        });

        let currentQuery = this.state.query;
        let newQuery = {...currentQuery, ...query};

        serviceRequest(`${BASE_URL}/coursePlanController/cpquery`, {startDay, endDay, ...newQuery},
            function(ret) {
                let state = me.state;
                state[classScheduletype] = ret.results;
                state.query = newQuery;
                me.setState({
                    ...state,
                    loading: false,
                });
            },
            function(ret) {
                me.setState({
                    loading: false,
                });
                message.error((ret && ret.errorMessage) || '没有查询到课程表数据');
            }
        );
    },

    onMenuItemClick(value) {
        let me = this;
        if('next_week' == value) {
            if(this.state.nextWeek_classScheduleList.length > 0) {
                return;
            }
            //加载下周课程表
            let startDay = moment().startOf('week').add(7, 'd').format('YYYY-MM-DD');
            let endDay   = moment().endOf('week').add(7, 'd').format('YYYY-MM-DD');
            let query = this.state.query;
            this.queryClassSchedule(startDay, endDay, query, 'nextWeek_classScheduleList');
        } else if('previous_week' == value) {
            if(this.state.previousWeek_classScheduleList.length > 0) {
                return;
            }
            //加载上周课程表
            let startDay = moment().startOf('week').subtract(7, 'd').format('YYYY-MM-DD');
            let endDay   = moment().endOf('week').subtract(7, 'd').format('YYYY-MM-DD');
            let query = this.state.query;
            this.queryClassSchedule(startDay, endDay, query, 'previousWeek_classScheduleList');
        }
    },

    onFilterQuery(query) {
        let startDay = moment().startOf('week').format('YYYY-MM-DD');
        let endDay   = moment().endOf('week').format('YYYY-MM-DD');
        this.queryClassSchedule(startDay, endDay, query, 'classScheduleList');

        if(this.state.nextWeek_classScheduleList.length > 0) {
             //加载下周课程表
            let nextWeek_startDay = moment().startOf('week').add(7, 'd').format('YYYY-MM-DD');
            let nextWeek_endDay   = moment().endOf('week').add(7, 'd').format('YYYY-MM-DD');
            this.queryClassSchedule(nextWeek_startDay, nextWeek_endDay, query, 'nextWeek_classScheduleList');
        }
        if(this.state.previousWeek_classScheduleList.length > 0) {
            //加载上周课程表
            let previousWeek_startDay = moment().startOf('week').subtract(7, 'd').format('YYYY-MM-DD');
            let previousWeek_endDay   = moment().endOf('week').subtract(7, 'd').format('YYYY-MM-DD');
            this.queryClassSchedule(previousWeek_startDay, previousWeek_endDay, query, 'previousWeek_classScheduleList');
        }
    },

    /*点击新增课程表*/
    onCreateSchedule() {
        this.setState({
            formModalVisible: true,
        });
    },

    /*课程表块上 点击事件*/
    onUpdateSchedule(orgId, cpId) {
        if(!this.props.createAble) {
            return;
        }
        //查询课程表详细
        let me = this;

        me.setState({
            loading: true,
        });

        serviceRequest(`${BASE_URL}/coursePlanController/cpdetail`, {orgId, cpId},
            function(ret) {

                me.setState({
                    loading: false,
                    formModalVisible: true,
                    classScheduleData: {
                        ...ret,
                    },
                });
                if(ret.type == '3') {
                    //补课的排课计划
                    me.updateCourseComData(ret.orgId, ret.courseId);
                } else if(ret.type == '2') {
                    //班课课的学员
                    me.updateClassComData(ret.orgId, ret.clsId);
                }
            },
            function(ret) {
                me.setState({
                    loading: false,
                });
                message.error((ret && ret.errorMessage) || '没有查询到课程表数据');
            }
        );
    },

    onFormModalClose() {
        this.setState({
            formModalVisible: false,
            classScheduleData: {},
        });
    },

    afterFormSubmit() {
        this.onFilterQuery(this.state.query);
    },

    /*修改课程下的相关下拉框数据*/
    updateCourseComData(orgId, courseId) {
        let me = this;
        serviceRequest(`${BASE_URL}/stuCourse/stuCourseClass`, {orgId, courseId},
            function(ret) {
                me.setState({
                    courseComData: ret.results,
                });
            },
            function(ret) {
                message.error((ret && ret.errorMessage) || '没有查询到课程下的学员和报课信息');
            }
        );
    },

    /*修改班级下的学员*/
    updateClassComData(orgId, classId) {

    },

    render() {
        let {
            loading,
            classScheduleList,
            nextWeek_classScheduleList,
            previousWeek_classScheduleList,
            classes_list,
            course_list,
            teacher_list,
            student_list,
            formModalVisible, classScheduleData,filterType,
            courseComData,query,} = this.state;

        let classScheduleProps = {
            classScheduleList,previousWeek_classScheduleList,nextWeek_classScheduleList,query,
            classes_list,
            course_list,
            teacher_list,
            student_list,
            filterType,
            onMenuItemClick: this.onMenuItemClick,
            onFilterQuery: this.onFilterQuery,
            tbody_height: this.props.tbody_height,
            createAble: this.props.createAble || false,
            onCreateSchedule: this.onCreateSchedule,
            onUpdateSchedule: this.onUpdateSchedule,
        };

        let classScheduleFormProps = {
            visible: formModalVisible,
            classScheduleData: classScheduleData,
            onClose: this.onFormModalClose,
            afterSubmit: this.afterFormSubmit,
            courseComData: courseComData,
            updateCourseComData: this.updateCourseComData,
        };

        return (
            <div>
               <Spin tip="加载课程表..." spinning={loading} >
                    <ClassScheduleComponent {...classScheduleProps} />
                </Spin>
                {!!(this.props.createAble && formModalVisible) && <ClassScheduleFormPage {...classScheduleFormProps} />}
            </div>
        );
    },

});

function mapStateToProps({classScheduleModel}) {
  return {classScheduleModel};
}

export default connect(mapStateToProps)(ClassSchedule);
