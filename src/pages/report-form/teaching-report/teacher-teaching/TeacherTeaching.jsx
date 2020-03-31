import React from 'react';
import qs from 'qs';
import { message } from 'antd';
import TeacherTeachingBar from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import TeacherTeachingTable from '../../../../components/report-form/teaching-report/teacher-teaching/TeacherTeachingTable';
import TeacherTeachingDetailModal from '../../../../components/report-form/teaching-report/teacher-teaching/TeacherTeachingDetailModal';
import moment from 'moment';
import { connect } from 'dva';

function TeacherTeaching({ dispatch, teacherTeachingSheet }) {

    let {
        modalBoxAppears, //模块数据
        updateshow,     //判断哪个按钮出现
        content,        //时间出现
        updateDate,     //更新云数据
        startDate,      //开始时间
        endDate,        //结束时间
        firstEnter,                     //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        pageIndex,                      //页码
        pageSize,                       //默认永远是20
        sortParams,                     //排序方式(放在state里方便做统一处理)

        exportSearchContent,            //查询的数据(时间范围)

        tableLoading,                   //table是否在加载状态
        listTopAllContent ,             //table列表上方所有数据
        listBottomTeacherContent,       //table列表下方老师所有数据
        listBottomTeacherCount,         //下方table总数据
        disabledDateFunc,
        teachingDetailVisible,          //授课详情modal展示
        teachingDetailNameHeight,       //授课详情姓名栏高度
        teachingDetailName,             //授课详情老师姓名
        teachingDetailContent,          //授课详情内容
        teachingDetailSpining,          //授课详情模态框是否加载状态
        startDateTime,
        buttonLoading,                  //生成报表按钮加载状态
    } = teacherTeachingSheet

    //点击生成报表
    let GeneratingReports = function(data){
        dispatch({
            type:'teacherTeachingSheet/GetTeacherTeachingTable',
            payload:{
                pageIndex : 0,
                pageSize,
                exportSearchContent : data
            }
        });
    }
    function getEndDate(dateString) {
    const   date=(moment(dateString).format('YYYY-MM-DD'))
        dispatch({
            type:'teacherTeachingSheet/updateDate',
            payload:{
                endDate: date
            }
        });
	}
    function getStartDate(dateString) {
        const   date=moment(dateString)
        dispatch({
            type:'teacherTeachingSheet/updateDate',
            payload:{
                startDate: date
            }
        });
    }
    //点击云数据触发时
    function onconfirmDeptOrg(coleback,shutback) {
        dispatch({
            type: 'teacherTeachingSheet/onconfirmDeptOrgSelect',
            payload: {
             coleback,shutback
			}
        })
    }
    //点击弹框确定
    function affirmBtn(params, colback) {
        dispatch({
            type: 'teacherTeachingSheet/ConfirmDeptOrgSelect',
            payload: {
                params, colback
			}
        })
    }

    //table分页改变
    let tableOnChange = function(pagination, filters, sorter){
        dispatch({
            type:'teacherTeachingSheet/GetTeacherTeachingTable',
            payload:{
                pageIndex : pagination.current-1,
                pageSize : pagination.pageSize,
                exportSearchContent,
            }
        });
    }

    //打开授课详情modal
    let tableOnOpenDetail = function(data){
        let { startDate , endDate } = exportSearchContent;
        dispatch({
            type:'teacherTeachingSheet/OpenTeachingDetail',
            payload:{
                uid : data.uid,
                orgId : data.orgId,
                tenantId : data.tenantId,
                pageSize : 99999,
                pageIndex : 0,
                startTime : startDate,
                endTime : endDate
            }
        });
    }

    //关闭授课详情modal
    let teachingDetailModalCancel = function(){
        dispatch({
            type:'teacherTeachingSheet/updateState',
            payload:{
                teachingDetailVisible : false,
            }
        });
    }

    let TeacherTeachingBarProps = {
        onconfirmDeptOrg,
        modalBoxAppears,//模态框出现
        affirmBtn, //点击确认的方法
        content,    //云数据时间
        getStartDate,//更新开始时间的方法
		getEndDate,  //更新结束时间的方法
        startDate,//开始时间参数
		endDate,    //结束时间参数
        updateDate,//开始时间参数
        updateshow,//判断哪个按钮出现
        GeneratingReports,                  //点击生成报表
        // disabledDateFunc,
        dataTotal : listBottomTeacherCount,
        exportPath : '/crm/hq/erp/stuClass/export',
        exportObj : { ...exportSearchContent , flag : 'detail' },
        searchContent : [
            {
                type : 'select' ,
                key : 'sortParam',
                placeholder : '排序方式',
                options : sortParams
            }
        ],
        buttonLoading,                      //生成报表按钮加载状态
        firstEnter,                         //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    }
    let teacherTeachingTableProps = {
        pageIndex,                      //页码
        pageSize,                       //默认永远是20
        tableLoading,                   //table是否在加载状态
        listTopAllContent ,             //table列表上方所有数据
        listBottomTeacherContent,       //table列表下方老师所有数据
        listBottomTeacherCount,         //下方table总数据
        tableOnChange,                  //table分页改变
        tableOnOpenDetail,              //打开授课详情
    }

    let teacherTeachingDetailModalProps = {
        teachingDetailVisible,
        teachingDetailName,
        teachingDetailNameHeight,
        teachingDetailContent,
        teachingDetailSpining,
        teachingDetailModalCancel
    }

    return (
        <div style = {{ overflow : 'hidden' , height : '100%' }}>
            <TeacherTeachingBar {...TeacherTeachingBarProps} style = {{ marginBottom : 20 }}/>
            <TeacherTeachingTable {...teacherTeachingTableProps}/>
            <TeacherTeachingDetailModal {...teacherTeachingDetailModalProps} />
        </div>
  );
}

function mapStateToProps({ teacherTeachingSheet }) {
  return { teacherTeachingSheet };
}

export default connect(mapStateToProps)(TeacherTeaching);
