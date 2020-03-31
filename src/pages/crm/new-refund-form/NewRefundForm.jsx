import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import RefundFormTable from '../../../components/crm/new-refund-form/refund-form-table/RefundFormTable';
import RefundFormSuperSearch from '../../../components/crm/new-refund-form/refund-form-table/RefundFormSuperSearch';
import RefundFormCheckModal from '../../../components/crm/new-refund-form/refund-form-check/CheckModal';
import RefundFormPrintModal from '../../../components/crm/new-refund-form/refund-form-print/PrintModal';

/*退款单*/
function RefundForm({ dispatch , newRefundForm }) {

    let {
        wetherChangeRouter,                     //是否切换路由，用于清空快捷搜索与高级搜索栏内容

        /*常用searchBar*/
        refundFastSearchContent,                //快捷搜索栏搜索内容

        /*高级搜索*/
        refundRightSuperSearchVisible,          //高级搜索是否显示
        refundRightSuperSearchContent,          //高级搜索栏搜索内容

        /*table*/
        refundTableNewColumns,                  //选择列表是否显示字段是哪些
        refundTableLoading,                     //列表是否加载状态
        refundTablePageSize,                    //列表数据每页条数
        refundTablePageIndex,                   //列表数据第几页
        refundTableDataTotal,                   //列表数据总共条数
        refundTableDataSource,                  //列表数据
        refundTableSelectedRowKeys,             //多选框选中项的id,若无id，则取到当前索引
        refundTableSelectedRows,                //多选框选中的项的对象数组

        /*驳回退款单modal*/
        refundFormCheckModalVisible,                //新建退款单modal是否显示
        refundFormCheckModalPassButtonLoading,      //新建退款单modal通过按钮加载状态
        refundFormCheckModalRejectButtonLoading,    //新建退款单modal驳回按钮加载状态
        refundFormCheckModalCheckDetail,            //审核退款单详情

        /*打印退款单modal*/
        refundFormPrintModalVisible,                //打印退款单modal是否显示
        refundFormPrintModalPrintType,              //打印退款单类型
        refundFormPrintData,                        //打印退款单选择退款类型以后接口返回的数据

    } = newRefundForm
    //复选框onChange事件
    function RefundTableSelectedRowOnChange(selectedRowKeys, selectedRows){
        dispatch({
            type:'newRefundForm/updateState',
            payload:{
                refundTableSelectedRowKeys : selectedRowKeys,
                refundTableSelectedRows : selectedRows
            }
        });
    }

    //常用/快捷搜索栏点击搜索
    function RefundSearchBarOnSearch(values){
        if(!!values && !!values.dept_org){
            values.orgId = values.dept_org.substr(values.dept_org.indexOf('-') + 1);
            delete values.dept_org;
        }
        if(!!values && !!values.status && values.status=='4'){
            values.status = '';
        }
        dispatch({
            type:'newRefundForm/GetTableList',
            payload:{
                pageIndex : 0,
                pageSize : refundTablePageSize,
                fastSearchContent : values,
                superSearchContent : refundRightSuperSearchContent
            }
        });

    }

    //高级搜索点击搜索
    function RefundRightSuperSearchClick(data){
        dispatch({
            type:'newRefundForm/GetTableList',
            payload:{
                pageIndex : 0,
                pageSize : refundTablePageSize,
                fastSearchContent : refundFastSearchContent,
                superSearchContent : data
            }
        });

    }

    //table点击高级搜索事件和高级搜索点击右上角的X
    function RefundSuperSearchOnSearch(){
        dispatch({
            type:'newRefundForm/updateState',
            payload:{
                refundRightSuperSearchVisible : !refundRightSuperSearchVisible
            }
        });
    }

    //分页改变事件
    function RefundTablePageOnChange(pageIndex,pageSize){
        dispatch({
            type:'newRefundForm/GetTableList',
            payload:{
                pageIndex : pageIndex - 1,
                pageSize : pageSize,
                fastSearchContent : refundFastSearchContent,
                superSearchContent : refundRightSuperSearchContent
            }
        });

    }

    //列表控制显示行
    function RefundTableChangeColumns(refundTableNewColumns){
        dispatch({
            type:'newRefundForm/updateState',
            payload:{
                refundTableNewColumns
            }
        });
    }

    //leftBars点击打印
    function RefundTableOnPrint(){
        if(refundTableSelectedRows.length != 1){
            message.warn('只能选中一项打印');
        }else{
            //获取当前项的详情
            dispatch({
                type:'newRefundForm/GetRefundFormPrintDetail',
                payload:{
                    id : refundTableSelectedRows[0].id
                }
            });
        }
    }

    //leftBars点击审核
    function RefundTableOnCheck(){
        if(refundTableSelectedRows.length != 1){
            message.warn('只能选中一项审核');
        }else if(refundTableSelectedRows[0].status != '1'){
            message.error('此收款单不是待审核状态');
        }else{
            //获取当前项的详情
            dispatch({
                type:'newRefundForm/GetRefundFormCheckDetail',
                payload:{
                    id : refundTableSelectedRows[0].id
                }
            });
        }
    }

    //审核退款单modal点击通过
    function RefundFormCheckModalPass(data){
        dispatch({
            type:'newRefundForm/RefundFormCheckModalPass',
            payload:{
                ...data
            }
        });
    }

    //审核退款单modal点击驳回
    function RefundFormCheckModalReject(data){
        dispatch({
            type:'newRefundForm/RefundFormCheckModalReject',
            payload:{
                ...data
            }
        });
    }

    //审核退款单modal关闭
    function RefundFormCheckModalCancel(){
        dispatch({
            type:'newRefundForm/updateState',
            payload:{
                refundFormCheckModalVisible : false,
                refundFormCheckModalPassButtonLoading : false,      //新建退款单modal通过按钮加载状态
                refundFormCheckModalRejectButtonLoading : false,    //新建退款单modal驳回按钮加载状态
                refundTableSelectedRowKeys : [],             //多选框选中项的id,若无id，则取到当前索引
                refundTableSelectedRows : [],                //多选框选中的项的对象数组
            }
        });
    }



    //打印退款单modal关闭
    function RefundFormPrintModalCancel(){
        dispatch({
            type:'newRefundForm/updateState',
            payload:{
                refundFormPrintModalVisible : false,
                refundTableSelectedRowKeys : [],                //多选框选中项的id,若无id，则取到当前索引
                refundTableSelectedRows : [],                   //多选框选中的项的对象数组
            }
        });
    }


    /*高级搜索属性*/
    let RefundFormSuperSearchProps = {
        wetherChangeRouter,                             //是否切换路由，用于清空快捷搜索与高级搜索栏内容
        refundRightSuperSearchVisible,                  //高级搜索是否显示
        RefundRightSuperSearchClick,                    //高级搜索点击搜索或者重置
        RefundSuperSearchOnSearch,                      //点击右上角的X
    };

    /*驳回退款单modal属性*/
    let RefundFormCheckModalProps = {
        refundFormCheckModalVisible,                //审核退款单modal是否显示
        refundFormCheckModalPassButtonLoading,      //审核退款单modal通过按钮加载状态
        refundFormCheckModalRejectButtonLoading,    //审核退款单modal驳回按钮加载状态
        refundFormCheckModalCheckDetail,            //审核退款单详情

        RefundFormCheckModalPass,                   //审核退款单modal点击通过
        RefundFormCheckModalReject,                 //审核退款单modal点击驳回
        RefundFormCheckModalCancel,                 //审核退款单modal关闭
    }

    /*打印退款单modal属性*/
    let RefundFormPrintModalProps = {
        refundFormPrintModalVisible,                //打印退款单modal是否显示
        refundFormPrintModalPrintType,              //打印退款单类型
        refundFormPrintData,                        //打印退款单选择退款类型以后接口返回的数据

        RefundFormPrintModalCancel,                 //打印退款单modal关闭
    }

    /*table整体属性*/
    let LeadsFollowTableProps = {
        search : {
            onSearch : (data) => RefundSearchBarOnSearch(data),
            onClear : (data) => RefundSearchBarOnSearch(data),
            wetherChear : wetherChangeRouter,
            fields : [
                { key : 'dept_org' , type : 'dept_org' },
                { key : 'id' ,
                  type : 'input' ,
                  placeholder : '退款单单号' },
                { key : 'createName' ,
                  type : 'input' ,
                  placeholder : '创建人' },
                { key : 'status' ,
                  type : 'select' ,
                  placeholder : '退款单状态' ,
                  initialValue : '4',
                  options : [
                                { key : '4' , label : '全部' },
                                { key : '1' , label : '待退款' },
                                { key : '2' , label : '已退款' },
                                { key : '3' , label : '已驳回' }
                            ]
                },
            ],
        },
        table : {
            newColumns : refundTableNewColumns,
            changeColumns : RefundTableChangeColumns,
            loading : refundTableLoading,
            dataSource : refundTableDataSource,
            rowSelection : {
                selectedRowKeys : refundTableSelectedRowKeys,
                onChange : RefundTableSelectedRowOnChange,        //复选框onChange事件
            },
        },
        pagination : {
            total : refundTableDataTotal,
            pageIndex : refundTablePageIndex,
            pageSize : refundTablePageSize,
            onChange : RefundTablePageOnChange,
            onShowSizeChange : RefundTablePageOnChange,
            showSizeChanger : true,
            showQuickJumper : true,
            showTotal : () => (`共${refundTableDataTotal}条`),
        },
        leftBars : {
            label : '已选',
            labelNum : refundTableSelectedRows.length,
            btns : [{label : '打印' , handle : () => RefundTableOnPrint() , confirm : false},
                    {label : '审核' , handle : () => RefundTableOnCheck() , confirm : false}
                   ]
        },
        rightBars : {
            isSuperSearch : true,
            superSearchVisible : refundRightSuperSearchVisible,
            superSearch : RefundSuperSearchOnSearch,
            closeSearch : RefundSuperSearchOnSearch,
        }
    };

    return (
        <div style = {{ overflow : 'hidden', height : '100%' }}>
            <RefundFormTable {...LeadsFollowTableProps} />
            <RefundFormSuperSearch {...RefundFormSuperSearchProps}/>
            { refundFormCheckModalVisible ? <RefundFormCheckModal {...RefundFormCheckModalProps}/> : null }
            { refundFormPrintModalVisible ? <RefundFormPrintModal {...RefundFormPrintModalProps}/> : null }
        </div>
    );
}

function mapStateToProps({ newRefundForm }) {
    return { newRefundForm };
}

export default connect(mapStateToProps)(RefundForm);
