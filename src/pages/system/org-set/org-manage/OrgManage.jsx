import React from 'react';
import { message, Tabs } from 'antd';
import QueueAnim from 'rc-queue-anim';

import OrgManageSearch from '../../../../components/system/org-set/org-manage/OrgManageSearch';
import OrgManageTable from '../../../../components/system/org-set/org-manage/OrgManageTable';
import OrgManageAddOrEditOrg from '../../../../components/system/org-set/org-manage/OrgManageAddOrEditOrg';

import { connect } from 'dva';
const TabPane = Tabs.TabPane;

/*校区管理*/
function OrgManage({ dispatch, orgManage }) {

    let {

        /*搜索栏*/
        orgManageSearchVisible,                 //搜索栏是否显示
        orgManageSearchContentUseing,           //营业中搜索栏数据
        orgManageSearchContentDisabled,         //已停业搜索栏数据

        /*table*/
        orgManageTableType,                     //table类型('1'营业中/'2'已停业)
        orgManagePageIndexUseing,               //营业中table页码
        orgManagePageSizeUseing,                //营业中表格每页显示数量
        orgManagePageIndexDisabled,             //已停业table页码
        orgManagePageSizeDisabled,              //已停业表格每页显示数量
        orgManageTableLoading,                  //表格加载状态
        orgManageTableTotal,                    //表格数据总数
        orgManageTableContent,                  //表格数据所有内容
        orgManageTableSelectedRowKeys,          //表格多选选中的数组
        orgManageTableSelectedRow,              //表格多选中的对象数组

        /*新增编辑校区*/
        addOrEditOrgModalType,                  //新增编辑校区类型('add'/'edit')
        addOrEditOrgModalVisible,               //新增编辑校区modal是否显示
        addOrEditOrgModalButtonLoading,         //新增编辑校区modal按钮是否在加载状态
        addOrEditOrgModalSelectData,            //新增编辑校区三个checkbox的选项
        addOrEditOrgModalData,                  //编辑校区时回填数据
        wetherAddNewPic,                        //是否新增了图片(用于判断图片删除操作)
        addOrEditOrgModaDisplayImg,             //用于显示回填的图片数组(包括uid,url,name,thumbUrl)
        addOrEditOrgModalPicArray,              //批量上传图片
		
		selectProvincesCityArea,				//选择的省市区
		selectdetailAddress,					//选择的详细地址

	} = orgManage;

    /*搜索栏*/
        /*页面点击筛选*/
        let OrgManageTableOnFilter = function(){
            dispatch({
                type:'orgManage/updateState',
                payload:{
                    orgManageSearchVisible : !orgManageSearchVisible
                }
            });
        }

        /*校区管理search点击搜索*/
        let OrgManageSearchSubmit = function(data){
            dispatch({
                type:'orgManage/updateState',
                payload:{
                    orgManageTableSelectedRowKeys : [],             //表格多选选中的数组
                    orgManageTableSelectedRow : [],                 //表格多选中的对象数组
                }
            });
            if('1' == orgManageTableType){
                dispatch({
                    type:'orgManage/updateState',
                    payload:{
                        orgManageSearchContentUseing : data,        //使用中员工管理查询条件
                        orgManagePageIndexUseing : 0,
                    }
                });
                dispatch({
                    type:'orgManage/ShowOrgManageTable',
                    payload:{
                        pageSize : orgManagePageSizeUseing,         //表格没页显示条数(已默认是10)
                        pageIndex : 0,                              //表格页码
                        status : orgManageTableType,                //判断是使用中还是停用中
                        ...data
                    }
                });
            }else if('2' == orgManageTableType){
                dispatch({
                    type:'orgManage/updateState',
                    payload:{
                        orgManageSearchContentDisabled : data,    //已停用员工管理查询条件
                        orgManagePageIndexDisabled : 0,
                    }
                });
                dispatch({
                    type:'orgManage/ShowOrgManageTable',
                    payload:{
                        pageSize : orgManagePageSizeDisabled,       //表格没页显示条数(已默认是10)
                        pageIndex : 0,                              //表格页码
                        status : orgManageTableType,                //判断是使用中还是停用中
                        ...data
                    }
                });
            }
        }

        /*校区管理search点击清除条件*/
        let OrgManageSearchReset = function(){
            dispatch({
                type:'orgManage/updateState',
                payload:{
                    orgManageSearchContentUseing : {},
                    orgManageSearchContentDisabled : {},
                    orgManageTableSelectedRowKeys : [],
                    orgManageTableSelectedRow : [],
                }
            });
            if( '1' == orgManageTableType){
                dispatch({
                    type:'orgManage/updateState',
                    payload:{
                        orgManagePageIndexUseing : 0
                    }
                });
                dispatch({
                    type:'orgManage/ShowOrgManageTable',
                    payload:{
                        pageSize : orgManagePageSizeUseing,
                        pageIndex : 0,
                        status : orgManageTableType,                //判断是营业中还是已停业
                    }
                });
            }else if( '2' == orgManageTableType){
                dispatch({
                    type:'orgManage/updateState',
                    payload:{
                        orgManagePageIndexDisabled : 0
                    }
                });
                dispatch({
                    type:'orgManage/ShowOrgManageTable',
                    payload:{
                        pageSize : orgManagePageSizeDisabled,
                        pageIndex : 0,
                        status : orgManageTableType,                //判断是营业中还是已停业
                    }
                });
            }
        }

    /*table*/
        /*营业中分页改变*/
        let OrgManageTableOnChangePageUseing = function(pagination, filters, sorter) {
            dispatch({
                type: 'orgManage/updateState',
                payload: {
                    orgManagePageIndexUseing : pagination.current-1,
                    orgManagePageSizeUseing : pagination.pageSize,
                    orgManageTableSelectedRowKeys : [],
                    orgManageTableSelectedRow : [],
                },
            });
            dispatch({
                type: 'orgManage/ShowOrgManageTable',
                payload: {
                    pageIndex : pagination.current-1,
                    pageSize : pagination.pageSize,
                    status : orgManageTableType,                //判断是营业中还是已停业
                    ...orgManageSearchContentUseing             //营业中校区搜索数据
                },
            });
        };

        /*已停业分页改变*/
        let OrgManageTableOnChangePageDisabled = function(pagination, filters, sorter) {
            dispatch({
                type: 'orgManage/updateState',
                payload: {
                    orgManagePageIndexDisabled : pagination.current-1,
                    orgManagePageSizeDisabled : pagination.pageSize,
                    orgManageTableSelectedRowKeys : [],
                    orgManageTableSelectedRow : [],
                },
            });
            dispatch({
                type: 'orgManage/ShowOrgManageTable',
                payload: {
                    pageIndex : pagination.current-1,
                    pageSize : pagination.pageSize,
                    status : orgManageTableType,                //判断是营业中还是已停业
                    ...orgManageSearchContentDisabled           //已停业校区搜索数据
                },
            });
        };

        /*表格多选框是否可选中*/
        let OrgManageTableRowCheckProps = function(record){
            return true;
        }

        /*多选框选中的onChange方法*/
        let OrgManageTableRowSelectChange = function(selectedRowKeys, selectedRows){
            //console.info('selectedRowKeys',selectedRowKeys);
            //console.info('selectedRows',selectedRows);
            dispatch({
                type: 'orgManage/updateState',
                payload: {
                    orgManageTableSelectedRowKeys : selectedRowKeys,
                    orgManageTableSelectedRow : selectedRows,
                },
            });
        }

        /*表格点击新增校区获取机构类型(机构类型获取后再获取适合年龄和配套设施，在modals里处理)*/
        let OrgManageTableOnAddOrg = function(){
            dispatch({
                type:'orgManage/OpenAddOrgModalGetCheckBox',
                payload:{
                    type : 'add'
                }
            });
        }

        /*表格点击编辑校区*/
        let OrgManageTableOnEditOrg = function(data,type){
            if(type == 'table' || (type == 'batch' && orgManageTableSelectedRow.length == 1)){
                dispatch({
                    type : 'orgManage/OpenAddOrgModalGetCheckBox',
                    payload:{
                        organId : data.id,
                        type : 'edit'
                    }
                });
            }else{
                message.warn('请选中一项编辑');
            }
        }

        /*表格点击启用或者停用或者删除*/
        let OrgManageTableOnChangeOrgStatus = function(data,type){
            if(data.length > 1){
                message.warn('暂不支持批量操作功能');
                dispatch({
                    type : 'orgManage/updateState',
                    payload:{
                        orgManageTableSelectedRowKeys : [],
                        orgManageTableSelectedRow : [],
                    }
                });
            }else if(data.length == 0){
                message.warn('请至少选中一项更改状态');
            }else{
                let ids = [];
                for(let i in data){
                    ids.push(data[i].id);
                }
                dispatch({
                    type:'orgManage/UpdateOrganStatus',
                    payload:{
                        organId : ids.join(','),
                        status : type
                    }
                });
            }
        }

    /*新增编辑校区modal*/
        /*批量上传图片onChange方法将url放到addOrEditOrgModalPicArray数组中*/

        let PushNewPic = function(info){
            if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != '9000') {
                return message.error(info.file.response.errorMessage || '图片上传失败');
            }
            if(info.file.status === 'removed'){
                message.success('移除成功');
                dispatch({
                    type : 'orgManage/updateState',
                    payload : {
                        addOrEditOrgModalPicArray : info.fileList,
                    }
                })
            }else if (info.file.status === 'done') {
                info.file.url = info.file.response.data.url;
                message.success(`${info.file.name} 上传成功`);
                dispatch({
                    type : 'orgManage/updateState',
                    payload : {
                        addOrEditOrgModalPicArray : info.fileList,
                        wetherAddNewPic : true,                         //是否新增了图片(用于判断图片删除操作)
                    }
                })
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        }

        /*移除已上传图片事件*/
        let RemovePic = function(removeItem){
            /*if(wetherAddNewPic == false){
                dispatch({
                    type:'orgManage/updateState',
                    payload:{
                        addOrEditOrgModalPicArray : addOrEditOrgModaDisplayImg,
                    }
                });
            }*/
        }
        /*新增编辑校区提交*/
        let AddOrEditOrgModalSubmit = function(data){
            dispatch({
                type : 'orgManage/updateState',
                payload:{
                    addOrEditOrgModalButtonLoading : true
                }
            });
            //拿到批量上传图片的url
            let images = [];
            if(addOrEditOrgModalPicArray && addOrEditOrgModalPicArray.length > 0){
                for(let i in addOrEditOrgModalPicArray){
                    images.push(addOrEditOrgModalPicArray[i].url || addOrEditOrgModalPicArray[i].response.data.url)
                }
            }
            if(addOrEditOrgModalType == 'add'){
                dispatch({
                    type : 'orgManage/AddNewOrg',
                    payload:{
                        images : images.join(','),
                        ...data
                    }
                });
            }else if(addOrEditOrgModalType == 'edit'){
                dispatch({
                    type : 'orgManage/EditExistOrg',
                    payload:{
                        images : images.join(','),
                        ...data
                    }
                });
            }
        }

        /*新增编辑校区modal关闭*/
        let AddOrEditOrgModalCancel = function(){
            dispatch({
                type:'orgManage/updateState',
                payload:{
                    addOrEditOrgModalType : '',                 //新增编辑校区类型('add'/'edit')
                    addOrEditOrgModalVisible : false,           //新增编辑校区modal是否显示
                    addOrEditOrgModalButtonLoading : false,     //取消按钮加载状态
                    addOrEditOrgModalData : {},
                    orgManageTableSelectedRowKeys : [],
                    orgManageTableSelectedRow : [],
                }
            });
        }

			
	/*更新省市区*/
	function updateProvincesCityArea(value) {
		_mapMoveAfter = false;
		dispatch({
			type : 'orgManage/updateState',
			payload : {
				selectProvincesCityArea : value,
			}
		})
	}
	
	/*更新详细地址*/
	function updateAddress(value) {
		_mapMoveAfter = false;
		dispatch({
			type : 'orgManage/updateState',
			payload : {
				selectdetailAddress : value,
			}
		})		
	}
	
	/*空更新属性调用地址定位*/
	function updateLocationFun() {
		_mapMoveAfter = false;
		dispatch({
			type : 'orgManage/updateState',
		})	
	}
	
    /*search栏属性*/
    let orgManageSearchProps = {
        OrgManageSearchSubmit,              //校区管理search点击搜索
        OrgManageSearchReset,               //校区管理search点击清除条件
    }

    /*table属性*/
    let orgManageTableProps = {
        orgManageTableType,                     //table类型('1'营业中/'2'已停业)
        orgManageTableLoading,                  //表格加载状态
        orgManageTableTotal,                    //表格数据总数
        orgManageTableContent,                  //表格数据所有内容
        orgManageTableSelectedRowKeys,          //表格多选选中的数组
        orgManageTableSelectedRow,              //表格多选中的对象数组
        orgManagePageIndexUseing,               //营业中table页码
        orgManagePageSizeUseing,                //营业中表格每页显示数量
        orgManagePageIndexDisabled,             //已停业table页码
        orgManagePageSizeDisabled,              //已停业表格每页显示数量

        OrgManageTableOnFilter,                 //表格点击筛选
        OrgManageTableOnAddOrg,                 //表格点击新增校区
        OrgManageTableOnEditOrg,                //表格点击编辑校区
        OrgManageTableOnChangeOrgStatus,        //表格点击启用或停用或删除
        OrgManageTableOnChangePageUseing,       //营业中分页改变
        OrgManageTableOnChangePageDisabled,     //已停业分页改变
        OrgManageTableRowCheckProps,            //多选框是否可被选中
        OrgManageTableRowSelectChange,          //多选框选择方法
    }

    /*新增编辑校区属性*/
    let orgManageAddOrEditOrgProps = {
        addOrEditOrgModalType,               //新增编辑校区类型('add'/'edit')
        addOrEditOrgModalVisible,            //新增编辑校区modal是否显示
        addOrEditOrgModalButtonLoading,      //新增编辑校区modal按钮是否在加载状态
        addOrEditOrgModalSelectData,         //新增编辑校区三个checkbox的选项
        addOrEditOrgModaDisplayImg,          //用于显示回填的图片数组(包括uid,url,name,thumbUrl)
        addOrEditOrgModalData,               //编辑校区时回填数据

        PushNewPic,                          //批量上传图片onChange方法将url放到addOrEditOrgModalPicArray数组中
        RemovePic,                           //移除已上传图片事件
        AddOrEditOrgModalSubmit,             //新增编辑校区提交
        AddOrEditOrgModalCancel,             //新增编辑校区modal关闭
		
		updateProvincesCityArea,
		updateLocationFun,
		updateAddress,
		selectProvincesCityArea,
		selectdetailAddress,
    }

    /*改变tabs回调函数*/
    let changeTabsSelect = function(value){
        dispatch({
            type:'orgManage/updateState',
            payload:{
                orgManageTableType : value
            }
        });
        if( '1' == value ){
            dispatch({
                type: 'orgManage/ShowOrgManageTable',
                payload: {
                    pageSize : orgManagePageSizeUseing,
                    pageIndex : orgManagePageIndexUseing,
                    status : value,
                    ...orgManageSearchContentUseing
                },
            });
        }else if( '2' == value){
            dispatch({
                type: 'orgManage/ShowOrgManageTable',
                payload: {
                    pageSize : orgManagePageSizeDisabled,
                    pageIndex : orgManagePageIndexDisabled,
                    status : value,
                    ...orgManageSearchContentDisabled
                },
            });
        }
    }

    return(
        <div style={{padding:'10px 20px 20px 20px'}}>
            <div className="tabs">
                <Tabs defaultActiveKey="1" type='card' onChange={changeTabsSelect}>
                    <TabPane tab={<span>营业中</span>} key="1">
                        <QueueAnim
                            type={['top', 'top']}
                            ease={['easeOutQuart', 'easeInOutQuart']}
                            className="common-search-queue" >
                            {orgManageSearchVisible ?
                                [ <OrgManageSearch {...orgManageSearchProps} key = 'OrgManageSearchUse'/> ] : null}
                        </QueueAnim>
                        <OrgManageTable {...orgManageTableProps}/>
                    </TabPane>
                    <TabPane tab={<span>已停业</span>} key="2">
                        <QueueAnim
                            type={['top', 'top']}
                            ease={['easeOutQuart', 'easeInOutQuart']}
                            className="common-search-queue" >
                            {orgManageSearchVisible ?
                                [ <OrgManageSearch {...orgManageSearchProps} key = 'OrgManageSearchUnUse'/> ] : null}
                        </QueueAnim>
                        <OrgManageTable {...orgManageTableProps}/>
                    </TabPane>
                </Tabs>
            </div>
            { addOrEditOrgModalVisible == true ? <OrgManageAddOrEditOrg {...orgManageAddOrEditOrgProps}/> : null }
        </div>
    );
}

function mapStateToProps({ orgManage }) {
  return { orgManage };
}

export default connect(mapStateToProps)(OrgManage);
