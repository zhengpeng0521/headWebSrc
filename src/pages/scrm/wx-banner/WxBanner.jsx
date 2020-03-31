import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import QueueAnim from 'rc-queue-anim';
import WxBannerSearchBar from '../../../components/scrm/wx-banner/WxBannerSearchBar';
import WxBannerTable from '../../../components/scrm/wx-banner/WxBannerTable';
import WxBannerAddOrEditBanner from '../../../components/scrm/wx-banner/WxBannerAddOrEditBanner';

/*请假列表*/
function WxBanner({dispatch, wxBanner}) {

	let {

        /*searchBar*/
        wxBannerSearchVisible,                  //搜索栏是否显示
        wxBannerSearchContent,                  //搜索栏搜素内容

        /*table*/
        wxBannerPageIndex,                      //页码
        wxBannerPageSize,                       //每页条数
        wxBannerTableLoading,                   //表格加载状态
        wxBannerTableContent,                   //表格数据
        wxBannerTableTotal,                     //表格数据总数
        wxBannerTableSelectedRowKeys,           //表格多选选中的数组
        wxBannerTableSelectedRow,               //表格多选中的对象数组

        /*banner新增编辑modal*/
        wxBannerAddOrEditBannerModalType,       //modal类型('add'/'edit')
        wxBannerAddOrEditBannerModalVisible,    //modal是否显示
        wxBannerAddOrEditBannerModalLoading,    //modal是否loading
        wxBannerAddOrEditBannerButtonLoading,   //modal按钮是否加载状态
        wxBannerAddOrEditBannerModalWetherAdd,  //新增时是否可以在该校区下添加banner
        wxBannerAddOrEditBannerModalLetUChoose, //新增时说明(若未选择校区 则提示用户请选择校区)
        wxBannerAddOrEditBannerModalContent,    //modal回填数据(主要用到校区ID和校区name)
        wxBannerAddOrEditBannerModalHrefType,   //选择外链方式类型('0'无,'1'自定义,'2'活动,'3'课程)
        wxBannerAddOrEditBannerCourseSelectContent,    //modal课程外链下拉列表
        wxBannerAddOrEditBannerActivitySelectContent,  //modal活动外链下拉列表

    } = wxBanner;

    //banner搜索栏点击搜索或清除条件
    let WxBannerSearchSubmit = function(data){
        dispatch({
            type:'wxBanner/GetBannerList',
            payload:{
                pageIndex : 0,
                pageSize : wxBannerPageSize,
                ...data
            }
        });
    }

    //分页等信息改变
    let WxBannerTableOnChange = function(pagination, filters, sorter){
        dispatch({
            type:'wxBanner/GetBannerList',
            payload:{
                pageIndex : pagination.current-1,
                pageSize : pagination.pageSize,
                ...wxBannerTableContent
            }
        });
    }

    //表格多选状态改变时方法
    let WxBannerTableSelectedRow = function(selectedRowKeys, selectedRows){
        dispatch({
            type: 'wxBanner/updateState',
            payload: {
                wxBannerTableSelectedRowKeys : selectedRowKeys,
                wxBannerTableSelectedRow : selectedRows,
            },
        });
    }

    //表格点击筛选
    let WxBannerShowOrHideSearchBar = function(){
        dispatch({
            type: 'wxBanner/updateState',
            payload: {
                wxBannerSearchVisible : !wxBannerSearchVisible,
            },
        });
    }


    //banner批量操作改变状态('显示','隐藏','删除')
    let WxBannerChangeBannerStatus = function(type){
        if(wxBannerTableSelectedRow.length == 0){
            message.warn('请至少选中一项进行操作')
        }else{
            let ids = [];
            for(let i in wxBannerTableSelectedRow){
                ids.push(wxBannerTableSelectedRow[i].id);
            }
            dispatch({
                type : 'wxBanner/ChangeWxBannerStatus',
                payload : {
                    ids : ids.join(','),
                    status : type
                }
            });
        }
    }

    //表格点击新增banner
    let WxBannerAddNewBanner = function(){
        dispatch({
            type:'wxBanner/CheckOrgBannersNum',
            payload:{
                orgId : (window._init_data.firstOrg).key
            }
        });
    }

    //校区选择onChange事件，用来查询当前校区下banner数是否已到限制数(5个)
    let WxBannerAddOrEditBannerModalChangeTenantFilter = function(orgId){
        if(orgId == '' || orgId == null || orgId == undefined || /^[\s]*$/.test(orgId)){
            dispatch({
                type:'wxBanner/updateState',
                payload:{
                    wxBannerAddOrEditBannerModalLetUChoose : true
                }
            });
        }else{
            dispatch({
                type:'wxBanner/CheckOrgBannersNum',
                payload:{
                    orgId
                }
            });

            dispatch({
                type: 'wxBanner/GetCourseSelectContent',
                payload: {
                    pageIndex: 0,
                    pageSize: 99999,
                    status: 1,
                    orgId : orgId,
                }
            });

            dispatch({
                type: 'wxBanner/GetActivitySelectContent',
                payload: {
                    pageIndex: 0,
                    pageSize: 99999,
                    status: 1,
                    orgId : orgId,
                }
            });





        }
    }

    //外链下拉列表onChange事件
    let WxBannerAddOrEditBannerModalChangeHrefType = function(type){
        dispatch({
            type: 'wxBanner/updateState',
            payload: {
                wxBannerAddOrEditBannerModalHrefType : type,
            },
        });
    }

    //banner点击编辑
    let WxBannerTableEditItem = function(item,type){
        if(type == 'byCheckBox' && wxBannerTableSelectedRow.length != 1){
            message.warn('编辑时应选中一项')
        }else{
            dispatch({
                type:'wxBanner/updateState',
                payload:{
                    wxBannerAddOrEditBannerModalType : 'edit',
                    wxBannerAddOrEditBannerModalWetherAdd : {},
                    wxBannerAddOrEditBannerModalContent : item,
                    wxBannerAddOrEditBannerModalVisible : true,
                    wxBannerAddOrEditBannerButtonLoading : false,
                    wxBannerAddOrEditBannerModalHrefType : (JSON.parse(item.uri)).type,
                }
            });
        }
    }

    //新增编辑banner表单提交
    let WxBannerAddOrEditBannerModalSubmit = function(data){
        dispatch({
            type:'wxBanner/AddOrEditBanner',
            payload:{
                ...data
            }
        });
    }

    //新增编辑banner表单关闭
    let WxBannerAddOrEditBannerModalCancel = function(){
        dispatch({
            type: 'wxBanner/updateState',
            payload: {
                wxBannerAddOrEditBannerModalType : undefined,
                wxBannerAddOrEditBannerModalVisible : false,
                wxBannerAddOrEditBannerButtonLoading : false,
                wxBannerAddOrEditBannerModalContent : {},
                wxBannerAddOrEditBannerModalHrefType : '0',
                wxBannerTableSelectedRowKeys : [],              //表格多选选中的数组
                wxBannerTableSelectedRow : [],                  //表格多选中的对象数组
            },
        });
    }

    /*搜索栏属性*/
    let wxBannerSearchBarProps = {
        WxBannerSearchSubmit,             //请假列表search点击搜索
    }

    /*table属性*/
    let wxBannerTableProps = {
        wxBannerTableLoading,                   //表格加载状态
        wxBannerTableContent,                   //表格数据
        wxBannerTableTotal,                     //表格数据总数
        wxBannerTableSelectedRowKeys,           //表格多选选中的数组
        wxBannerTableSelectedRow,               //表格多选中的对象数组
        wxBannerPageSize,                       //表格一页多少数据
        wxBannerPageIndex,                      //表格页码

        WxBannerTableOnChange,                  //表格分页，排序等信息改变事件
        WxBannerShowOrHideSearchBar,            //表格点击筛选
        WxBannerTableSelectedRow,               //批量操作checkbox改变事件
        WxBannerTableEditItem,                  //banner点击编辑
        WxBannerChangeBannerStatus,             //banner批量操作改变状态('显示','隐藏','删除')
        WxBannerAddNewBanner,                   //表格点击新增banner
    }

    let wxBannerAddOrEditBannerProps = {
        wxBannerAddOrEditBannerModalType,               //modal类型('add'/'edit')
        wxBannerAddOrEditBannerModalLoading,            //modal是否loading
        wxBannerAddOrEditBannerModalVisible,            //modal是否显示
        wxBannerAddOrEditBannerButtonLoading,           //modal按钮是否加载状态
        wxBannerAddOrEditBannerModalWetherAdd,          //新增时是否可以在该校区下添加banner
        wxBannerAddOrEditBannerModalLetUChoose,         //新增时说明(若未选择校区 则提示用户请选择校区)
        wxBannerAddOrEditBannerModalContent,            //modal回填数据(主要用到校区ID和校区name)
        wxBannerAddOrEditBannerModalHrefType,           //选择外链方式类型('0'无,'1'自定义,'2'活动,'3'课程)
        wxBannerAddOrEditBannerCourseSelectContent,     //modal课程外链下拉列表
        wxBannerAddOrEditBannerActivitySelectContent,   //modal活动外链下拉列表

        WxBannerAddOrEditBannerModalChangeTenantFilter, //校区选择onChange事件，用来查询当前校区下banner数是否已到限制数(5个)
        WxBannerAddOrEditBannerModalChangeHrefType,     //外链下拉列表onChange事件
        WxBannerAddOrEditBannerModalSubmit,             //请假处理表单提交
        WxBannerAddOrEditBannerModalCancel,             //请假处理表单关闭
    }

    return (
        <div>
            <QueueAnim
                type={['top', 'top']}
                ease={['easeOutQuart', 'easeInOutQuart']}
                className="common-search-queue" >
                {wxBannerSearchVisible ?
                    [ <WxBannerSearchBar {...wxBannerSearchBarProps} key='WxBannerSearchBar'/>] : null}
            </QueueAnim>
            <WxBannerTable {...wxBannerTableProps} />
            { wxBannerAddOrEditBannerModalVisible == true ? <WxBannerAddOrEditBanner {...wxBannerAddOrEditBannerProps}/> : null }
        </div>
    );
}

function mapStateToProps({ wxBanner }) {
  	return { wxBanner };
}

export default connect(mapStateToProps)(WxBanner);
