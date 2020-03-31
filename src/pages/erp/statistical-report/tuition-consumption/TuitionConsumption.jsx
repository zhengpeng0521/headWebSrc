import React, { PropTypes } from 'react';
import { message } from 'antd';
import TuitionConsumptionSearch from '../../../../components/erp/statistical-report/tuition-consumption/TuitionConsumptionSearch';
import TuitionConsumptionCharts from '../../../../components/erp/statistical-report/tuition-consumption/TuitionConsumptionCharts';

import { connect } from 'dva';

import styles from './TuitionConsumption.less';

function TuitionConsumption({ dispatch, tuitionConsumption }) {

    let {
        storeTimeRange,         //门店图用于显示时间范围
        courseTimeRange,        //课程图用于显示时间范围
        classTimeRange,         //班级图用于显示时间范围
        topAllData,             //统计校区，总消耗课时，总学费消耗数
        storeDataLoading,       //门店图加载状态
        courseDataLoading,      //课程图加载状态
        classDataLoading,       //班级图加载状态
        storeData,              //门店图数据
        courseData,             //课程图数据
        classData,              //班级图数据
        searchContent,          //搜索条件(时间范围)
    } = tuitionConsumption;

    //选择时间onChange查询
    let SearchSubmit = function(searchData) {
        dispatch({
            type: 'tuitionConsumption/updateState',
            payload:{
                searchContent : searchData
            }
        });
        dispatch({
            type: 'tuitionConsumption/QueryForStoreData',
            payload: {
                ...searchData
            },
        });
        dispatch({
            type: 'tuitionConsumption/QueryForCourseData',
            payload: {
                ...searchData
            },
        });
        dispatch({
            type: 'tuitionConsumption/QueryForClassData',
            payload: {
                ...searchData
            },
        });
    }

    let HandleExport = function(value){
        dispatch({
            type: 'tuitionConsumption/ExportData',
            payload: {
                flag : value,
                ...searchContent
            },
        });
    }

    let tuitionConsumptionSearchProps = {
        topAllData,         //统计校区，总消耗课时，总学费消耗数
        SearchSubmit,
    }


    let tuitionConsumptionChartsProps = {
        storeTimeRange,         //门店图用于显示时间范围
        courseTimeRange,        //课程图用于显示时间范围
        classTimeRange,         //班级图用于显示时间范围
        storeDataLoading,       //门店图加载状态
        courseDataLoading,      //课程图加载状态
        classDataLoading,       //班级图加载状态
        storeData,              //门店图数据
        courseData,             //课程图数据
        classData,              //班级图数据
        HandleExport,           //数据导出(org 机构/course课程/class班级)
    }


    return (
        <div>
            <TuitionConsumptionSearch {...tuitionConsumptionSearchProps}/>
            <TuitionConsumptionCharts {...tuitionConsumptionChartsProps} />
        </div>
  );
}

function mapStateToProps({ tuitionConsumption }) {
  return { tuitionConsumption };
}

export default connect(mapStateToProps)(TuitionConsumption);
