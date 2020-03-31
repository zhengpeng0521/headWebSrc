import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Popconfirm, Popover } from 'antd';
import styles from './StudentWorksPage.less';
import StudentWorksComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';

import StudentWorksManageType from '../../../pages/erp/student-works/StudentWorksManageTypePage';
import StudentWorksUpload from '../../../pages/erp/student-works/StudentWorksUploadPage';
import StudentWorksUpdate from '../../../pages/erp/student-works/StudentWorksUpdatePage';

function StudentWorksPage ({ dispatch , studentWorksModel }){
	let {
		/*高级搜索*/
		searchVisible,         //高级搜索是否可见
		commonSearchContent,   //常用搜索内容
		superSearchContent,    //高级搜索内容

		dataSource,
		resultCount,
		newColumns,
		pageIndex,
		pageSize,
		loading,

		tagIdList,
		stuIdList,

		allSize,
		usedSize,

		selectedRecordIds,
		selectedRowKeys,
		selectedRows,

		} = studentWorksModel;

    //刷新列表
    function refreshList(){
        dispatch({
            type : 'studentWorksModel/getStudentWorkParams',
            payload : {}
        })
    };

    //改变校区得到学员下拉列表
    function TenantSelectOnSelect( value ){
        dispatch({
            type : 'studentWorksModel/TenantSelectOnSelect',
            payload : {
                value
            }
        })
    };

    //点击搜索
    function onSearch( values ){
        dispatch({
            type : 'studentWorksModel/onSearch',
            payload : {
				commonSearchContent : values,
				superSearchContent
            }
        })
    };

    //点击清除条件
    function onClear(){
        dispatch({
            type : 'studentWorksModel/onSearch',
            payload : {
                commonSearchContent : {},
				superSearchContent
            }
        })
    };

	//点击高级搜索
	function superSearchClick(){
		dispatch({
			type : 'studentWorksModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	//高级搜索
	function onSuperSearch( values ){
		dispatch({
            type : 'studentWorksModel/onSearch',
            payload : {
				superSearchContent : values,
                commonSearchContent,
            }
        })
	}

	//高级搜索重置
	function onSuperClear(){
		dispatch({
			type : 'studentWorksModel/onSearch',
			payload : {
				superSearchContent : {},
				commonSearchContent
			}
		})
	}

	//改变表格列
	function changeColumns( newColumns ){
		dispatch({
			type : 'studentWorksModel/updateState',
			payload : {
				newColumns
			}
		})
	}

    //选择表格项
    function rowSelectChangeAction( selectedRowKeys, selectedRows ){
        dispatch({
            type : 'studentWorksModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
    };

    //批量删除
    function deleteWorks(){
        let selectedRecordIds = [];
        selectedRows.map(function(item){
            selectedRecordIds.push(item.id);
        });
        dispatch({
            type : 'studentWorksModel/deleteWorks',
            payload : {
                selectedRecordIds
            }
        })
    };

	//管理分类弹出框
	function manageWorksType(){
		dispatch({
			type : 'studentWorksManageTypeModel/openManageTypeModal',
			payload : {
                tagIdList
			}
		})
	};

	//上传作品弹出框
	function uploadWorks(){
        let orgId;
        /*取到第一个校区(默认校区)ID*/
        if(window._init_data.firstOrg != undefined){
            orgId = window._init_data.cerp_orgId;                //获取所选的校区

            // dispatch({
            //     type : 'scrmStudentManageModel/TenantSelectOnSelect',
            //     payload : {
            //         value : orgId,
            //     }
            // })

            dispatch({
                type:'studentWorksUploadModel/updateState',
                payload:{
                    orgId
                }
            });

            dispatch({
                type : 'studentWorksUploadModel/openUploadModal',
                payload : {
                    allSize:allSize,
                    usedSize:usedSize,
                    tagIdList:tagIdList,
                    orgId
                }
            })
        }else  {
            dispatch({
                type : 'studentWorksUploadModel/openUploadModal',
                payload : {
                    allSize,
                    usedSize,
                    tagIdList,
                }
            })
        }
	};

    //修改作品
    function updateStudentWork( id, url ){
        dispatch({
            type : 'studentWorksModel/updateStudentWork',
            payload : {
                id, url
            }
        })
    };

    //删除作品
    function deleteWork( id ){
        dispatch({
            type : 'studentWorksModel/deleteWork',
            payload : {
                id
            }
        })
    };

    //改变pageIndex
    function pageIndexChange( pageIndex ){
        dispatch({
            type : 'studentWorksModel/paginationChange',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };

    //改变pageSize
    function pageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'studentWorksModel/paginationChange',
            payload : {
                pageIndex, pageSize
            }
        })
    };

	function sizeChange ( size ){
        if( size < 1024 ){
            return size + ' B '
        } else if( size < 1024*1024 ){
            return size/1024 + ' KB '
        } else if( size < 1024*1024*1024 ){
            return size/1024/1024 + ' M '
        } else if( size < 1024*1024*1024*1024 ){
            return size/(1024*1024*1024) + ' G '
        }
    }

	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'wId',
				type        : 'input',
				label       : '作品编号',
				placeholder : '请输入作品编号',
			},{
				key         : 'wName',
				type        : 'input',
				label       : '作品名称',
				placeholder : '请输入作品名称'
			}
		]
	}

	let StudentWorksComponentProps = {
		search : {
                onSearch : onSearch,
                onClear  : onClear,
                fields   : [
                    {
                        key         : 'stuId',
                        type        : 'select',
                        placeholder : '请选择学员',
						options     : stuIdList,
						opt_key     : 'stuId',
						opt_label   : 'stuName'
                    },{
                        key         : 'tagId',
                        type        : 'select',
                        placeholder : '作品分类',
						options     : tagIdList,
						opt_key     : 'id',
						opt_label   : 'name'
                    },
                ],
        },
		leftBars : {
            label    : '已选',
			labelNum : selectedRowKeys.length,
            btns : [
                {
                    label    : '删除',
                    handle   : deleteWorks,
                    confirm  : true,
                }
            ]
        },
        rightBars : {
            btns : [
				{
					label    : '管理分类',
					handle   : manageWorksType
				},{
                    label    : '上传作品',
                    handle   : uploadWorks
                }
            ],
			isSuperSearch      : true,
			superSearch        : superSearchClick,
			superSearchVisible : searchVisible,
        },
        table : {
            loading       : loading,
			dataSource    : dataSource,
            newColumns    : newColumns,
			changeColumns : changeColumns,
            rowKey        : 'clsId',
            columns       : [
				{
					dataIndex : 'operation',
					key       : 'operation',
					title     : '操作',
					width     : 120,
					render    : ( text , record ) => (
						<div>
							<a href = { record.imgurl } target = '_blank' >查看</a>
							<a onClick = { () => updateStudentWork( record.id, record.imgurl ) } style = {{ marginLeft : '10px' }} >修改</a>
							<Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => deleteWork( record.id ) } >
								<a style = {{ marginLeft : '10px' }} >删除</a>
							</Popconfirm>
						</div>
					)
				},{
					dataIndex : 'id',
					key       : 'id',
					title     : '作品编号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'title',
					key       : 'title',
					title     : '作品名称',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'tagName',
					key       : 'tagName',
					title     : '作品类型',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text == null ? '未分类' : text }
						</Popover>
					)
				},{
					dataIndex : 'stuName',
					key       : 'stuName',
					title     : '所属学员',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '上传时间',
					width     : 160,
				},{
					dataIndex : 'orgName',
					key       : 'orgName',
					title     : '所属校区',
				}
			],
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : rowSelectChangeAction,
            },
        },
        pagination : {
             total             : resultCount,
             pageIndex         : pageIndex,
             pageSize          : pageSize,
             showTotal         : total => `总共 ${total} 条` ,
             showSizeChanger   : true,
             showQuickJumper   : true,
             onChange          : pageIndexChange,
             onShowSizeChange  : pageSizeChange,
        }
	}

    let studentWorksManageTypeProps = {
        refreshList
    };
    let studentWorksUploadProps = {
        refreshList
    };
    let studentWorksUpdateProps = {
        refreshList
    }
	return (
		<div style = {{ position : 'relative', height : '100%' }}>
			<StudentWorksComponent { ...StudentWorksComponentProps } />
			<span className = { styles.use_space }>
				{ '已用空间 : ' + sizeChange(usedSize) + ' 剩余空间 : ' +  sizeChange( allSize - usedSize )  }
			</span>
			<SuperSearch { ...superSearchProps } />
            <StudentWorksManageType  { ...studentWorksManageTypeProps } />
			<StudentWorksUpload      { ...studentWorksUploadProps } />
            <StudentWorksUpdate      { ...studentWorksUpdateProps } />
		</div>
	)
};

function mapStateToProps ({ studentWorksModel }){
	return { studentWorksModel };
};

export default connect(mapStateToProps)(StudentWorksPage);
