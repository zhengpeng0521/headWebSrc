import React, {PropTypes} from 'react';
import { connect } from 'dva';
import TextbookSaleRecord from '../../../components/erp/textbook-sale-record/TextbookSaleRecord';
function textbookSaleFun({dispatch, textbookSaleModel}) {

	let {
        //search
        showSearch,                   //筛选框

        //table
        textbookSaleRecordDataSource, //表格数据
        selectedRowKeys,
        selectedRows,
        pageIndex,
        pageSize,


    } = textbookSaleModel;

    //筛选
    function showSearchFunction () {
        dispatch({
			type : "textbookSaleModel/showSearchFunction",
			payload : {
				showSearch
			}
		});
    }

    //选中表格项进行批量操作
    function rowSelectChange ( selectedRowKeys,selectedRows ) {
        dispatch({
            type : 'textbookSaleModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
    }

    //列表分页
    let tablePageChange = function() {
        dispatch({
            type : 'textbookSaleModel/paginationChange',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };

    //筛选  搜索
    function textbookSearch ( params ) {

    }

    let props = {
        textbookSaleTable:{
            textbookSaleRecordDataSource,  // 表格数据
            rowSelectChange,
            tablePageChange,

        },
        textbookSaleSearch:{
            showSearchFunction,      //显示筛选框
            showSearch,
            textbookSearch,          //筛选  搜索
        },
    }

    return (
        <TextbookSaleRecord {...props}/>
    );
}

textbookSaleFun.propTypes = {
	textbookSaleModel	: PropTypes.object,
  	dispatch	: PropTypes.func,
};

function mapStateToProps({ textbookSaleModel }) {
  	return { textbookSaleModel };
}

export default connect(mapStateToProps)(textbookSaleFun);
