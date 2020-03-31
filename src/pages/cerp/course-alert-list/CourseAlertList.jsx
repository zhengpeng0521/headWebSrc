import React from 'react';
import { message , Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import CourseAlertListTable from '../../../components/cerp/course-alert-list/course-alert-list-table/CourseAlertListTable';
import CourseAlertListRecoveryModal from '../../../components/cerp/course-alert-list/course-alert-list-recovery-modal/CourseAlertListRecoveryModal';

/*续费提醒*/
function CourseAlertList({ dispatch , courseAlertList }) {

    let {

        //续费提醒列表
        newColumns,                             //选择行显示内容
        courseAlertTableLoading,                //列表加载状态
        courseAlertTableDataSource,             //列表数据
        courseAlertTableDataTotal,              //列表数据条数
        courseAlertTablePageIndex,              //列表页码
        courseAlertTablePageSize,               //列表每页条数
        courseAlertTableSelectedRowKeys,        //复选框选中项的key数组
        courseAlertTableSelectedRows,           //复选卡U那个选中项数组

        //快捷搜索
        fastSearchContent,                      //快捷搜索内容

        //恢复提醒modal
        recoveryModalVisible,                   //modal是否显示
        recoveryModalLoading,                   //modal加载状态
        recoveryModalButtonLoading,             //modal中按钮加载状态

        //恢复提醒modal中的table
        recoveryModalTableDataSource,           //modal中table数据
        recoveryModalTableDataTotal,            //列表数据条数
        recoveryModalTablePageIndex,            //列表页码
        recoveryModalTablePageSize,             //列表每页条数
        recoveryModalTableSelectedRowKeys,      //复选框选中项的key数组
        recoveryModalTableSelectedRows,         //复选卡U那个选中项数组

    } = courseAlertList

    function dp(path,data){
        dispatch({
            type : path,
            payload : {
                ...data
            }
        })
    }

    function ChangeNewColumns(columns){
        dp('courseAlertList/updateState',{
            newColumns : columns
        })
    }

    //快捷搜索点击搜索
    function CourseAlertFastOnSearch(data){
        dp('courseAlertList/GetCourseAlertList',{
            pageIndex : courseAlertTablePageIndex,
            pageSize : courseAlertTablePageSize,
            periodRemind : '1',
            fastSearchContent : data
        })
    }

    //分页改变
    function CourseAlertTablePageOnChange(pageIndex,pageSize){
        dp('courseAlertList/GetCourseAlertList',{
            pageIndex : pageIndex - 1,
            pageSize,
            periodRemind : '1',
            fastSearchContent
        })
    }

    //复选框onChange事件
    function CourseAlertTableSelectedRowOnChange(selectedRowKeys, selectedRows){
        dp('courseAlertList/updateState',{
            courseAlertTableSelectedRowKeys : selectedRowKeys,
            courseAlertTableSelectedRows : selectedRows
        })
    }

    //table点击取消提醒
    function CourseAlertTableOnCancelAlert(){
        //由于table的rowKey是cardId,故selectedRowKeys数组中的每一项都是cardId
        dp('courseAlertList/CourseAlertTableOnCancelAlert',{
            cardId : courseAlertTableSelectedRowKeys.join(',')
        })
    }

    //table点击恢复提醒
    function CourseAlertTableOnRecoveryAlert(){
        dp('courseAlertList/updateState',{
            recoveryModalVisible : true,                   //modal是否显示
        })
        dp('courseAlertList/GetCourseAlertList',{
            pageIndex : 0,
            pageSize : 10,
            periodRemind : '0'
        })
    }

    //恢复提醒列表分页改变
    function RecoveryModalTablePageOnChange(pagination){
        dp('courseAlertList/GetCourseAlertList',{
            pageIndex : pagination.current - 1,
            pageSize : pagination.pageSize,
            periodRemind : '0'
        })
    }

    //复选框onChange事件
    function RecoveryModalTableRowSelection(selectedRowKeys, selectedRows){
        dp('courseAlertList/updateState',{
            recoveryModalTableSelectedRowKeys : selectedRowKeys,
            recoveryModalTableSelectedRows : selectedRows
        })
    }

    //modal点击恢复提醒
    function RecoveryModalSubmit(){
        if(recoveryModalTableSelectedRowKeys && recoveryModalTableSelectedRowKeys.length > 0){
            //由于table的rowKey是cardId,故selectedRowKeys数组中的每一项都是cardId
            dp('courseAlertList/RecoveryModalSubmit',{
                cardId : recoveryModalTableSelectedRowKeys.join(',')
            })
        }else{
            return message.warn('请至少选中一项取消');
        }
    }

    //关闭modal
    function RecoveryModalClose(){
        dp('courseAlertList/updateState',{
            recoveryModalVisible : false,                   //modal是否显示
            recoveryModalButtonLoading : false,             //modal中按钮加载状态
        })
    }

    //恢复提醒modal属性
    let CourseAlertListRecoveryModalProps = {
        //恢复提醒modal
        recoveryModalVisible,                   //modal是否显示
        recoveryModalLoading,                   //modal加载状态
        recoveryModalButtonLoading,             //modal中按钮加载状态

        RecoveryModalSubmit,                    //modal点击恢复提醒
        RecoveryModalClose,                     //关闭modal
        //恢复提醒modal中的table
        recoveryModalTableDataSource,           //modal中table数据
        recoveryModalTableDataTotal,            //列表数据条数
        recoveryModalTablePageIndex,            //列表页码
        recoveryModalTablePageSize,             //列表每页条数
        recoveryModalTableSelectedRowKeys,      //复选框选中项的key数组
        recoveryModalTableSelectedRows,         //复选卡U那个选中项数组

        RecoveryModalTablePageOnChange,         //列表分页改变
        RecoveryModalTableRowSelection,         //复选框onChange事件
    }

    //续费提醒table属性
    let CourseAlertListTableProps = {
        search : {
            onSearch : (data) => CourseAlertFastOnSearch(data),
            onClear : (data) => CourseAlertFastOnSearch(data),
            fields : [
                { key : 'cardId' ,
                  type : 'input' ,
                  placeholder : '会员卡号' },
                { key : 'stuName' ,
                  type : 'input' ,
                  placeholder : '适用学员' },
                { key : 'orgId' ,
                  type : 'orgSelect' ,
                  placeholder : '所属校区' }
            ],
        },
        table : {
            newColumns,
            changeColumns : ChangeNewColumns,
            loading : courseAlertTableLoading,
            dataSource : courseAlertTableDataSource,
            rowSelection : {
                selectedRowKeys : courseAlertTableSelectedRowKeys,
                onChange : CourseAlertTableSelectedRowOnChange,        //复选框onChange事件
            },
            rowKey : 'cardId'
        },
        pagination : {
            total : courseAlertTableDataTotal,
            pageIndex : courseAlertTablePageIndex,
            pageSize : courseAlertTablePageSize,
            onChange : CourseAlertTablePageOnChange,
            onShowSizeChange : CourseAlertTablePageOnChange,
            showSizeChanger : true,
            showQuickJumper : true,
            showTotal : () => (`共${courseAlertTableDataTotal}条`),
        },
        leftBars : {
            label : '已选',
            labelNum : courseAlertTableSelectedRows.length,
            btns : [{ label : '取消提醒' , handle : () => CourseAlertTableOnCancelAlert() , confirm : true }]
        },
        rightBars : {
            btns : [{ label : '恢复提醒' , handle : () => CourseAlertTableOnRecoveryAlert() }]
        }
    }

    return (
        <div style = {{ overflow : 'hidden' }}>
            <CourseAlertListTable {...CourseAlertListTableProps}/>
            { recoveryModalVisible ? <CourseAlertListRecoveryModal {...CourseAlertListRecoveryModalProps}/> : null }
        </div>
    );
}

function mapStateToProps({ courseAlertList }) {
    return { courseAlertList };
}

export default connect(mapStateToProps)(CourseAlertList);
