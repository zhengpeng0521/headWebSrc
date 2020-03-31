import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import LeadsFollowTable from '../../../components/crm/leads-follow-all/leads-follow-table/LeadsFollowTable';
import LeadsFollowRightSuperSearch from '../../../components/crm/leads-follow-all/leads-follow-table/LeadsFollowSuperSearch';
/*leads跟进*/
function LeadsFollowAll({ dispatch , leadsFollowAll }) {
    let {
        /*快捷搜索*/
        fastSearchContent,                          //快捷搜索栏搜索内容
        /*高级搜索*/
        superSearchVisible,                         //高级搜索是否显示
        superSearchContent,                         //高级搜索栏搜索内容
        /*table*/
        tableNewColumns,                            //选择列表是否显示字段是哪些
        tableLoading,                               //列表是否加载状态
        tableDataSource,                            //table列表数据
        /*pagination*/
        tableDataTotal,                             //数据总共数目
        tablePageIndex,                             //页码
        tablePageSize,                              //每页条数


    } = leadsFollowAll
    //搜索栏的OnSearch事件
    function SearchBarOnSearch(data){
        if(!!data && !!data.dept_org){
            data.tenantIds = data.dept_org.substr(0,data.dept_org.indexOf('-'));
            data.orgIds = data.dept_org.substr(data.dept_org.indexOf('-') + 1);
            data.orgId = data.dept_org.substr(data.dept_org.indexOf('-') + 1);
            delete data.dept_org;
        }
        dispatch({
            type:'leadsFollowAll/GetTableList',
            payload:{
                pageIndex : 0,
                pageSize : tablePageSize,
                fastSearchContent : data,
                superSearchContent
            }
        });
    }
    //table点击高级搜索事件和高级搜索点击右上角的X
    function SuperSearchOnSearch(){
        dispatch({
            type:'leadsFollowAll/updateState',
            payload:{
                superSearchVisible : !superSearchVisible
            }
        });
    }
    //时间格式化方法
    function formatTime(data,keyInit,keySubmitStart,keySubmitEnd){
        if(data && data[keyInit] && data[keyInit].length > 0){
            data[keySubmitStart] = data[keyInit][0] != undefined ? data[keyInit][0].format('YYYY-MM-DD HH:mm') : undefined;
            data[keySubmitEnd] = data[keyInit][1] != undefined ? data[keyInit][1].format('YYYY-MM-DD HH:mm') : undefined;
            delete data[keyInit];
        }
    }
    //高级搜索点击搜索
    function SuperSearchClick(data){
        //处理生日时间范围
        formatTime(data,'birthday','startBirthday','endBirthday')
        //处理创建时间范围
        formatTime(data,'createTime','startCreateTime','endCreateTime')
        //处理下次跟进时间范围
        formatTime(data,'nextFollowTime','startNextFollowTime','endNextFollowTime')
        //处理最后跟进时间范围
        formatTime(data,'finalFollowTime','startFinalFollowTime','endFinalFollowTime')
        dispatch({
            type:'leadsFollowAll/GetTableList',
            payload:{
                pageIndex : 0,
                pageSize : tablePageSize,
                fastSearchContent,
                superSearchContent : data
            }
        });
    }
    //分页改变事件
    function TablePageOnChange(pageIndex,pageSize){
        dispatch({
            type:'leadsFollowAll/GetTableList',
            payload:{
                pageIndex : pageIndex - 1,
                pageSize : pageSize,
                fastSearchContent,
                superSearchContent
            }
        });
    }
    //列表控制显示行
    function TableChangeColumns(tableNewColumns){
        dispatch({
            type:'leadsFollowAll/updateState',
            payload:{
                tableNewColumns
            }
        });
    }
    /*高级搜索属性*/
    let LeadsFollowRightSuperSearchProps = {
        superSearchVisible,                     //高级搜索是否显示
        superSearchContent,                     //高级搜索栏搜索内容
        SuperSearchClick,                       //高级搜索点击搜索或者重置
        SuperSearchOnSearch,                    //点击右上角的X

    };
    //table整体属性
    let LeadsFollowTableProps = {
        search : {
            onSearch : (data) => SearchBarOnSearch(data),
            onClear : (data) => SearchBarOnSearch(data),
            fields : [
                { key : 'dept_org' , type : 'dept_org' },
                { key : 'name' , type : 'input' , placeholder : '名单姓名' },
                { key : 'parentMobile' , type : 'input' , placeholder : '家长手机号' }
            ],
        },
        table : {
            newColumns : tableNewColumns,
            changeColumns : TableChangeColumns,
            loading : tableLoading,
            dataSource : tableDataSource,
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
        rightBars : {
            isSuperSearch : true,
            superSearchVisible : superSearchVisible,
            superSearch : SuperSearchOnSearch,
            closeSearch : SuperSearchOnSearch
        }
    };
    return (
        <div style = {{ overflow : 'hidden', height : '100%' }}>
            <LeadsFollowTable {...LeadsFollowTableProps} />
            <LeadsFollowRightSuperSearch {...LeadsFollowRightSuperSearchProps}/>
        </div>
    );
}
function mapStateToProps({ leadsFollowAll }) {
    return { leadsFollowAll };
}
export default connect(mapStateToProps)(LeadsFollowAll);
