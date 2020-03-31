import React, { PropTypes } from 'react';
import { message } from 'antd';
import TextbookSalesSearch from '../../../../components/erp/statistical-report/textbook-sales/TextbookSalesSearch';
import TextbookSalesCharts from '../../../../components/erp/statistical-report/textbook-sales/TextbookSalesCharts';

import { connect } from 'dva';

import styles from './TextbookSales.less';

function TextbookSales({ dispatch, textbookSales }) {

    let {
        orgTimeRange,           //校区收入时间范围
        textTimeRange,          //教材统计时间范围
        orgListLoading,         //图表1加载状态
        textListLoading,        //图表2加载状态
        topAllInCome,           //上方总收入
        topOrgCount,            //上方统计校区数
        orgListData,            //校区收入数据
        textListData,           //教材统计数据
        searchContent,          //搜索条件(时间范围)
    } = textbookSales;

    //查询框点击查询
    let SearchSubmit = function(searchData) {
        dispatch({
            type: 'textbookSales/updateState',
            payload:{
                searchContent : searchData
            }
        });
        dispatch({
            type: 'textbookSales/QueryOrgAllData',
            payload: {
                ...searchData
            },
        });
        dispatch({
            type: 'textbookSales/QueryTextAllData',
            payload: {
                ...searchData
            },
        });
    };

    /*数据导出*/
    let HandleExport = function(type){
        dispatch({
            type : 'textbookSales/ExportData',
            payload : {
                flag : type,
                ...searchContent
            }
        })
    }

    let textbookSalesSearchProps = {
        topAllInCome,           //上方总收入
        topOrgCount,            //上方统计校区数
        SearchSubmit,
    };


    let textbookSalesChartsProps = {
        orgTimeRange,           //校区收入时间范围
        textTimeRange,          //教材统计时间范围
        orgListLoading,         //图表1加载状态
        textListLoading,        //图表2加载状态
        orgListData,            //校区收入数据
        textListData,           //教材统计数据
        HandleExport,           //数据导出
    };


    return (
        <div>
            <TextbookSalesSearch {...textbookSalesSearchProps}/>
            <TextbookSalesCharts {...textbookSalesChartsProps} />
        </div>
  );
}

TextbookSales.propTypes = {
  textbookSales: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ textbookSales }) {
  return { textbookSales };
}

export default connect(mapStateToProps)(TextbookSales);
