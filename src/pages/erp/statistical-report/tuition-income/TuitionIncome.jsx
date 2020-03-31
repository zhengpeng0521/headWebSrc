import React, { PropTypes } from 'react';
import { message } from 'antd';
import TuitionIncomeSearch from '../../../../components/erp/statistical-report/tuition-income/TuitionIncomeSearch';
import TuitionIncomeCharts from '../../../../components/erp/statistical-report/tuition-income/TuitionIncomeCharts';

import { connect } from 'dva';

import styles from './TuitionIncome.less';

function TuitionIncome({ dispatch, tuitionIncome }) {

    let {
        activeIndex,                //饼状图鼠标hover索引

        orgTimeRange,               //校区时间范围
        courseTimeRange,            //课程时间范围
        payWayTimeRange,            //支付方式时间范围

        orgListLoading,             //图表1加载状态
        courseListLoading,          //图表2加载状态
        payWayListLoading,          //图表3加载状态

        topAllOrg,                  //上方统计校区数量
        topAllData,                 //上方总统计数据
        orgData,                    //校区统计数据
        courseData,                 //课程统计数据
        payWayData,                 //饼状图统计数据

        searchContent,              //搜索数据(时间范围)
    } = tuitionIncome;

    //查询框点击查询
    let SearchSubmit = function(searchData) {
        dispatch({
            type: 'tuitionIncome/updateState',
            payload: {
                searchContent : searchData
            },
        });
        dispatch({
            type: 'tuitionIncome/QueryOrgData',
            payload: {
                ...searchData
            },
        });
        dispatch({
            type: 'tuitionIncome/QueryCourseData',
            payload: {
                ...searchData
            },
        });
        dispatch({
            type: 'tuitionIncome/QueryPayWayData',
            payload: {
                ...searchData
            },
        });
    };


    //饼状图鼠标移动事件
    let ChangeIndex = function(data, index){
        dispatch({
            type:'tuitionIncome/updateState',
            payload: {
                activeIndex : index,
            }
        });
    }

    /*数据导出*/
    let HandleExport = function(type){
        dispatch({
            type : 'tuitionIncome/ExportData',
            payload : {
                flag : type,
                ...searchContent
            }
        })
    }



    let tuitionIncomeSearchProps = {
        topAllOrg,                  //上方统计校区数量
        topAllData,                 //上方总统计数据
        SearchSubmit,
    }


    let tuitionIncomeChartsProps = {
        ChangeIndex,                //饼状图鼠标移动事件
        activeIndex,                //饼状图鼠标hover索引

        orgTimeRange,               //校区时间范围
        courseTimeRange,            //课程时间范围
        payWayTimeRange,            //支付方式时间范围

        orgListLoading,             //图表1加载状态
        courseListLoading,          //图表2加载状态
        payWayListLoading,          //图表3加载状态

        orgData,                    //校区统计数据
        courseData,                 //课程统计数据
        payWayData,                 //饼状图统计数据

        HandleExport,               //导出
    }

    return (
        <div>
            <TuitionIncomeSearch {...tuitionIncomeSearchProps} />
            <TuitionIncomeCharts {...tuitionIncomeChartsProps} />
        </div>
    );
}

function mapStateToProps({ tuitionIncome }) {
  return { tuitionIncome };
}

export default connect(mapStateToProps)(TuitionIncome);
