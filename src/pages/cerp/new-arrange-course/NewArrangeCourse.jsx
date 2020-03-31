import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { FormatDate } from '../../../utils/dateFormat';
import Search from '../../../components/cerp/new-arrange-course/new-arrange-course-table/Search/Search';
import OperationBar from '../../../components/cerp/new-arrange-course/new-arrange-course-table/OperationBar/OperationBar';
import Table from '../../../components/cerp/new-arrange-course/new-arrange-course-table/Table/Table';
import { AlertModal } from '../../../components/common/new-component/NewComponent';

/*排课列表*/
function NewArrangeCourse({ dispatch , newArrangeCourse }) {

    let {
        nowDate,                            //当前日期(只做保存，不做修改)
        startDate,                          //操作改变开始时间
        endDate,                            //操作改变结束时间
        currentOrgId,                       //当前机构id

        /*快捷搜索*/
        fastSearchContent,                  //快捷搜索内容

        /*高级搜索*/
        superSearchVisible,                 //是否显示高级搜索
        superSearchContent,                 //高级搜索内容

        //operationBar
        radioGroupValue,                    //radiogroup的值

        //table
        tableLoading,                       //整个页面是否加载状态
        tableNewColumns,                    //列表控制显示行数组
        tableDataSource,                    //从接口获取的列表数据
        tableDataTotal,                     //列表数据条数
        tablePageIndex,                     //列表页码
        tablePageSize,                      //列表每页条数
        tableSelectedRowKeys,               //复选框选中对象的key数组
        tableSelectedRows,                  //复选框选中对象的数组

        //alert modal
        alertModalVisible,                  //提示框是否显示
        alertModalTitle,                    //提示框标题
        alertModalContent,                  //提示框内容
        alertModalButtonLoading,            //提示框按钮是否加载状态
        alertModalSubmitContent,            //提示框点击确定需要请求后台的数据

        //编辑modal
        courseEditModalVisible,                 //主排课编辑modal是否显示
        courseEditModalButtonLoading,           //主排课编辑modal按钮是否加载
        courseEditModalTableLoading,            //主排课编辑modal中的子排课列表加载状态
        courseEditModalSelectedRowKeys,         //子排课查询选中项的key数组
        courseEditModalSelectedRows,            //子排课查询选中项的对象数组

        courseEditModalGetContent,              //主排课点击编辑获取到的详情

        courseEditModalTeacherSelectContent,       //主教和助教下拉列表数据
        courseEditModalClassRoomSelectContent,     //教室下拉列表数据
        courseEditModalRangeCourseDetail,          //选择时间范围后出来的子排课数据

        wetherClearCourseEditModal,             //是否编辑成功(用来清空表单)

    } = newArrangeCourse

    //radioGroup的onChange事件
    function RadioGroupOnChange(e){
        let value = e.target.value;
        if(value == 'day'){
            dispatch({
                type:'newArrangeCourse/GetCourseList',
                payload:{
                    fastSearchContent,
                    superSearchContent,
                    startDate : nowDate,
                    endDate : nowDate,
                    pageIndex : 0,
                    pageSize : tablePageSize,
                    radioGroupValue : value
                }
            });
        }else if(value == 'week'){
            let week = new Date(nowDate).getDay();          //获取当前星期几(0-6/周日-周六)
            let start;
            let end;
            if(week == 0){      //如果当前日期是周日
                start = new Date(nowDate).getTime() - 6*24*60*60*1000;
                start = FormatDate(start).substr(0,10);
                end = nowDate;
            }else{
                start = new Date(nowDate).getTime() - (week-1)*24*60*60*1000;
                start = FormatDate(start).substr(0,10);
                end = new Date(nowDate).getTime() - (week-1-6)*24*60*60*1000;
                end = FormatDate(end).substr(0,10);
            }
            dispatch({
                type:'newArrangeCourse/GetCourseList',
                payload:{
                    fastSearchContent,
                    superSearchContent,
                    startDate : start,
                    endDate : end,
                    pageIndex : 0,
                    pageSize : tablePageSize,
                    radioGroupValue : value
                }
            });
        }
    }

    //列表控制显示行
    function TableChangeColumns(tableNewColumns){
        dispatch({
            type:'newArrangeCourse/updateState',
            payload:{
                tableNewColumns
            }
        });
    }

    //复选框onChange事件
    function tableSelectedRowOnChange(selectedRowKeys, selectedRows){
        dispatch({
            type:'newArrangeCourse/updateState',
            payload:{
                tableSelectedRowKeys : selectedRowKeys,
                tableSelectedRows : selectedRows
            }
        });
    }

    //分页改变事件
    function TablePageOnChange(pageIndex,pageSize){
        dispatch({
            type:'newArrangeCourse/GetCourseList',
            payload:{
                fastSearchContent,
                superSearchContent,
                startDate,
                endDate,
                pageIndex : pageIndex - 1,
                pageSize : pageSize,
                radioGroupValue,
            }
        });
    }

    //快捷搜索点击搜索
    function FastSearchFunction(data){
        if(!!data && !!data.dept_org){
            data.tenantIds = data.dept_org.substr(0,data.dept_org.indexOf('-'));
            data.orgIds = data.dept_org.substr(data.dept_org.indexOf('-') + 1);
            data.orgId = data.dept_org.substr(data.dept_org.indexOf('-') + 1);
            delete data.dept_org;
        }
        dispatch({
            type:'newArrangeCourse/GetCourseList',
            payload:{
                fastSearchContent : data,
                superSearchContent,
                startDate,
                endDate,
                pageIndex : 0,
                pageSize : tablePageSize,
                radioGroupValue
            }
        });
    }

    //高级搜索点击事件
    function SuperSearchOpenOrClose(){
        dispatch({
            type : 'newArrangeCourse/updateState',
            payload : {
                superSearchVisible : !superSearchVisible
            }
        })
    }

    //高级搜索点击搜索
    function SuperSearchFunction(data){
        dispatch({
            type:'newArrangeCourse/GetCourseList',
            payload:{
                fastSearchContent,
                superSearchContent : data,
                startDate,
                endDate,
                pageIndex : 0,
                pageSize : tablePageSize,
                radioGroupValue
            }
        });
    }

    //查询上一天/下一天 上一周/下一周数据
    function OperationQuery(type){
        let start;
        let end;
        if(type == 'yesterday'){        //点击上一天
            start = new Date(startDate).getTime() - 24*60*60*1000;
            start = FormatDate(start).substr(0,10);
            end = new Date(endDate).getTime() - 24*60*60*1000;
            end = FormatDate(end).substr(0,10);
        }else if(type == 'tomorrow'){   //点击下一天
            start = new Date(startDate).getTime() + 24*60*60*1000;
            start = FormatDate(start).substr(0,10);
            end = new Date(endDate).getTime() + 24*60*60*1000;
            end = FormatDate(end).substr(0,10);
        }else if(type == 'backToday'){  //点击返回今天
            start = nowDate;
            end = nowDate;
        }else if(type == 'lastWeek'){   //点击上一周
            //state中的startDate只能是周一
            start = new Date(startDate).getTime() - 7*24*60*60*1000;
            start = FormatDate(start).substr(0,10);
            end = new Date(startDate).getTime() - 1*24*60*60*1000;
            end = FormatDate(end).substr(0,10);
        }else if(type == 'nextWeek'){   //点击下一周
            //state中的endDate只能是周日
            start = new Date(endDate).getTime() + 1*24*60*60*1000;
            start = FormatDate(start).substr(0,10);
            end = new Date(endDate).getTime() + 7*24*60*60*1000;
            end = FormatDate(end).substr(0,10);
        }else if(type == 'backToWeek'){ //点击返回本周
            let week = new Date(nowDate).getDay();          //获取当前星期几(0-6/周日-周六)
            if(week == 0){      //如果当前日期是周日
                start = new Date(nowDate).getTime() - 6*24*60*60*1000;
                start = FormatDate(start).substr(0,10);
                end = nowDate;
            }else{
                start = new Date(nowDate).getTime() - (week-1)*24*60*60*1000;
                start = FormatDate(start).substr(0,10);
                end = new Date(nowDate).getTime() - (week-1-6)*24*60*60*1000;
                end = FormatDate(end).substr(0,10);
            }
        }else{          //按理说不会进入最后的else
            start = nowDate;
            end = nowDate;
        }
        dispatch({
            type:'newArrangeCourse/GetCourseList',
            payload:{
                fastSearchContent,
                superSearchContent,
                startDate : start,
                endDate : end,
                pageIndex : 0,
                pageSize : tablePageSize,
                radioGroupValue
            }
        });
    }

    //search
    let SearchProps = {
        /*快捷搜索*/
        FastSearchFunction,                 //快捷搜索点击搜索

        /*高级搜索*/
        superSearchVisible,                 //高级搜索是否显示
        SuperSearchOpenOrClose,             //高级搜索点击事件
        SuperSearchFunction,                //高级搜索点击搜索
    }

    //operationBars
    let OperationBarProps = {
        nowDate,                            //当前日期(只做保存，不做修改)
        startDate,                          //操作改变开始时间
        endDate,                            //操作改变结束时间
        radioGroupValue,                    //radiogroup的值
    //    tableSelectedRowKeys,               //复选框选中对象的key数组
    //    tableSelectedRows,                  //复选框选中对象的数组

        OperationQuery,                     //查询上一天/下一天 上一周/下一周数据
    //    OperationChangeStatus,              //操作栏点击状态改变(这里只有删除)
    //    OperationChangeEdit,                //操作栏点击编辑
        RadioGroupOnChange,                 //radioGroup的onChange事件
    }

    //table整体属性
    let TableProps = {
        table : {
            newColumns : tableNewColumns,
            changeColumns : TableChangeColumns,
            loading : tableLoading,
            dataSource : tableDataSource,
//            rowSelection : {
//                selectedRowKeys : tableSelectedRowKeys,
//                onChange : tableSelectedRowOnChange,        //复选框onChange事件
//            },
            rowKey : 'cpdId'
        },
        pagination : {
            total : tableDataTotal,
            pageIndex : tablePageIndex,
            pageSize : tablePageSize,
            onChange : TablePageOnChange,
            onShowSizeChange : TablePageOnChange,
            showSizeChanger : true,
            showQuickJumper : true,
            showTotal : () => (`共${tableDataTotal}条`),
        },
    };

    return (
        <div style = {{ overflow : 'hidden', height : '100%' }}>
            <Search {...SearchProps}/>
            <OperationBar {...OperationBarProps}/>
            <Table {...TableProps}/>
        </div>
    );
}

function mapStateToProps({ newArrangeCourse }) {
    return { newArrangeCourse };
}

export default connect(mapStateToProps)(NewArrangeCourse);
