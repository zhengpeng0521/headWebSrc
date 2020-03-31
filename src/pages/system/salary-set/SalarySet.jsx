import React from 'react';
import { message } from 'antd';

import SalarySetTable from '../../../components/system/salary-set/salary-set-table/SalarySetTable';
import SalarySetModal from '../../../components/system/salary-set/salary-set-modal/SalarySetModal';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function SalarySet({ dispatch, salarySet }) {

    let {
        /*common*/
        courseSelectContent,        //课程下拉列表内容
        courseChooseContent,        //课程下拉列表被选中的内容(因为被选中的不能再次选)

        /*table*/
        newColumns,                 //table显示项数组
        loading,                    //table加载状态
        pageIndex,                  //table页码
        pageSize,                   //table每页条数
        total,                      //table数据总条数
        dataSource,                 //table数据
        selectedRowKeys,            //table复选框选中项的key数组
        selectedRows,               //table复选框选中项的数组

        /*快捷搜索*/
        roleSelectContent,          //角色下拉列表搜索框内容
        fastSearchContent,          //快捷搜索搜索内容

        /*设置工资modal*/
        setSalaryModalVisible,              //modal是否显示
        setSalaryModalLoading,              //modal加载状态
        setSalaryModalButtonLoading,        //modal按钮加载状态
        setSalaryModalData,                 //编辑时回填数据
        setSalaryCourseCommission,          //课时提成渲染数组

	} = salarySet;

    //console.info(JSON.stringify(setSalaryCourseCommission));
    //console.info(setSalaryCourseCommission)

    function dp(path,obj){
        dispatch({
            type : path ,
            payload : obj
        })
    }

    //快捷搜索查询
    function FastSearchOnSearch(data){
        dp('salarySet/QueryList',{
            pageIndex : 0,
            pageSize,
            fastSearchContent : data
        })
    }

    //列表显示项控制
    function TableChangeColumns(newColumns){
        dp('salarySet/updateState',{ newColumns })
    }

    //复选框onChange事件
    function TableSelectedRowOnChange(selectedRowKeys,selectedRows){
        dp('salarySet/updateState',{
            selectedRowKeys,
            selectedRows
        })
    }

    //分页改变事件
    function TablePageOnChange(current,pageSize){
        dp('salarySet/QueryList',{
            pageIndex : current - 1,
            pageSize : pageSize,
            fastSearchContent
        })
    }

    //点击设置工资
    function SetSalary(obj){
        if(!!obj){
            //列表点击姓名进入工资设置modal
            dp('salarySet/GetCourseSummary',obj)
        }else{
            //通过复选框选择进入工资设置modal
            if(!!selectedRowKeys && selectedRowKeys.length == 0){
                message.warn('请选择一名老师来设置工资')
            }else if(!!selectedRowKeys && selectedRowKeys.length > 1){
                message.warn('只能选择一名老师来设置工资')
            }else if(!!selectedRowKeys && selectedRowKeys.length == 1){
                dp('salarySet/GetCourseSummary',{ orgId : selectedRows[0].orgId , userId : selectedRows[0].userId })
            }
        }
    }

    //课程下拉列表onChange事件
    function CourseSelectOnChange(currentId,beforeId,zj_parent_index){
        //使课程下拉列表项可选
        dp('salarySet/courseSelectOperation',{ courseId : beforeId , display : true });
        //是课程下拉列表项置灰
        dp('salarySet/courseSelectOperation',{ courseId : currentId , display : false });
        //在数组中将选中项的courseId替换
        dp('salarySet/courseSelectSetCourse',{ courseId : currentId , zj_parent_index })
    }

    //新增课程设置项
    function CourseCommissionAdd(zj_parent_index){
        dp('salarySet/courseCommissionOperation',{
            type : 'add',
            zj_parent_index,
        })
    }

    //删除课程设置项
    function CourseCommissionDelete(zj_parent_index,courseId){
        if(setSalaryCourseCommission && setSalaryCourseCommission.length < 2 ){
            return message.warn('至少保留一项课时提成');
        }
        //将选中课程项恢复可选
        dp('salarySet/courseSelectOperation',{ courseId , display : true });
        //更新课程组
        dp('salarySet/courseCommissionOperation',{
            type : 'delete',
            zj_parent_index,
        })
    }

    //提成方式单选框onChange事件，替换新数组
    function RoyaltyMethodOnChange(key,zj_parent_index){
        dp('salarySet/courseCommissionOperation',{
            type : 'RoyaltyMethodOnChange',
            key,
            zj_parent_index,
        })
    }

    //计算方式单选框onChange事件
    function PayMethodOnChange(key,zj_parent_index){
        dp('salarySet/courseCommissionOperation',{
            type : 'PayMethodOnChange',
            key,
            zj_parent_index,
        })
    }

    //点击新增梯度
    function GradientAdd(groupName,zj_parent_index){
        dp('salarySet/gradientOperation',{
            type : 'add',
            groupName,
            zj_parent_index,
        })
    }

    //点击删除梯度
    function GradientDelete(groupName,zj_parent_index,zj_son_index){
        dp('salarySet/gradientOperation',{
            type : 'delete',
            groupName,
            zj_parent_index,
            zj_son_index
        })
    }

    //固定金额/比例input框onChange事件
    function SignleFixInputOnChange(type,value,zj_parent_index){
        dp('salarySet/courseCommissionOperation',{
            type,
            value,
            zj_parent_index,
        })
    }

    //梯度人次/课次内容onChange事件
    function GradientTimeOnChange(groupName,zj_parent_index,zj_son_index,value){
        dp('salarySet/gradientOperation',{
            type : 'time',
            groupName,
            zj_parent_index,
            zj_son_index,
            value
        })
    }

    //梯度金额内容onChange事件
    function GradientMoneyOnChange(groupName,zj_parent_index,zj_son_index,value){
        dp('salarySet/gradientOperation',{
            type : 'money',
            groupName,
            zj_parent_index,
            zj_son_index,
            value
        })
    }

    function formatSubmitArray(array){
        let formatArray = [];
        for(let i in array){
            formatArray[i] = { ...array[i] };
            delete formatArray[i].zj_parent_index;
            delete formatArray[i].zj_son_index;
        }
        return formatArray;
    }

    //工资设置modal提交
    function SetSalaryModalSubmit(values){
        let array = [];
        for(let i in setSalaryCourseCommission){
            array[i] = { ...setSalaryCourseCommission[i] }
            if(!!array[i].gradientOne && array[i].gradientOne.length > 0){
                array[i].gradientOne = formatSubmitArray(setSalaryCourseCommission[i].gradientOne);
            }
            if(!!array[i].gradientTwo && array[i].gradientOne.length > 0){
                array[i].gradientTwo = formatSubmitArray(setSalaryCourseCommission[i].gradientTwo);
            }
            if(!!array[i].gradientThree && array[i].gradientOne.length > 0){
                array[i].gradientThree = formatSubmitArray(setSalaryCourseCommission[i].gradientThree);
            }
            delete array[i].zj_parent_index;
        }
        let obj = {
            baseSalary : values.baseSalary,
            subsidy : values.subsidy,
            userId : setSalaryModalData.userId,
            orgId : setSalaryModalData.orgId,
            commission : JSON.stringify(array)
        }
        dp('salarySet/SetSalaryModalSubmit',{
            ...obj
        })
    }

    //工资设置modal关闭
    function SetSalaryModalCancel(){
        dp('salarySet/updateState',{
            setSalaryModalVisible : false,          //modal是否显示
            setSalaryModalLoading : false,          //modal加载状态
            setSalaryModalButtonLoading : false,    //modal按钮加载状态
            setSalaryModalData : {},                //编辑时回填数据
            setSalaryCourseCommission : [],         //课时提成渲染数组
            selectedRowKeys : [],                   //table复选框选中项的key数组
            selectedRows : [],                      //table复选框选中项的数组
        })
    }

    /*工资设置modal属性*/
    let SalarySetModalProps = {
        courseSelectContent,                //课程下拉列表内容

        setSalaryModalVisible,              //modal是否显示
        setSalaryModalLoading,              //modal加载状态
        setSalaryModalButtonLoading,        //modal按钮加载状态
        setSalaryModalData,                 //编辑时回填数据
        setSalaryCourseCommission,          //课时提成渲染数组

        CourseSelectOnChange,               //课程下拉列表onChange事件
        CourseCommissionAdd,                //新增课程设置项
        CourseCommissionDelete,             //删除课程设置项
        RoyaltyMethodOnChange,              //提成方式单选框onChange事件
        PayMethodOnChange,                  //计算方式单选框onChange事件
        GradientAdd,                        //点击新增梯度
        GradientDelete,                     //点击删除梯度
        SignleFixInputOnChange,             //固定金额/比例input框onChange事件
        GradientTimeOnChange,               //梯度人次/课次内容onChange事件
        GradientMoneyOnChange,              //梯度金额内容onChange事件
        SetSalaryModalSubmit,               //modal提交
        SetSalaryModalCancel,               //modal关闭
    }

    /*table整体属性*/
    let SalarySetTableProps = {
        SetSalary,              //点击姓名进入工资设置详情modal
        search : {
            onSearch : (data) => FastSearchOnSearch(data),
            onClear : (data) => FastSearchOnSearch(data),
            fields : [
                { key : 'orgId' ,
                  type : 'orgSelect' ,
                  placeholder : '选择校区' },
                { key : 'roleId' ,
                  type : 'select' ,
                  opt_key : 'id',
                  opt_label : 'name',
                  options : roleSelectContent,
                  placeholder : '选择角色' },
                { key : 'userName' ,
                  type : 'input' ,
                  placeholder : '姓名' }
            ],
        },
        table : {
            newColumns : newColumns,
            changeColumns : TableChangeColumns,
            loading : loading,
            dataSource : dataSource,
            rowKey : 'userId',
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange : TableSelectedRowOnChange,        //复选框onChange事件
            },
        },
        pagination : {
            total : total,
            pageIndex : pageIndex,
            pageSize : pageSize,
            onChange : TablePageOnChange,
            onShowSizeChange : TablePageOnChange,
            showSizeChanger : true,
            showQuickJumper : true,
            showTotal : () => (`共${total}条`),
        },
        leftBars : {
            label : '已选',
            labelNum : selectedRows.length,
            btns : [{ label : '设置工资' ,  confirm : false , handle : () => SetSalary() }]
        },
    };

    return(
        <div style = {{ overflow : 'hidden' }}>
            <SalarySetTable {...SalarySetTableProps}/>
            { !!setSalaryModalVisible ? <SalarySetModal {...SalarySetModalProps}/> : null  }
        </div>
    );
}

function mapStateToProps({ salarySet }) {
  return { salarySet };
}

export default connect(mapStateToProps)(SalarySet);
