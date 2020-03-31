import React from 'react';
import { connect } from 'dva';
import { routerRedux, Message } from 'dva/router';
import { Popover } from 'antd';
import ClassesManageComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';
import ClassesManagementModal from '../../../components/erp/classes-management/ClassesManagementModal';
//import ClassesManageDetailPage from './ClassesManageDetailPage';

function ClassesManagement({dispatch, classesManagementModel}) {
	let {
		/*搜索*/
		courseList,                          //课程列表
		cpCourseList,                        //备用课程列表
		teacherList,                         //老师列表

		/*常用搜索*/
		id,
		name,
		/*高级搜索*/
		searchVisible,

		orgId,
		courseId,
		uid,

		pageIndex,
		pageSize,
		selectedRowKeys,
		selectedRows,
		resultCount,
		dataSource,                  		//列表数据
      	loading,							//显示加载状态
		newColumns,

		showAddStudentModal,
		toDealBishopTeacherList,           //处理后的主教老师列表
		toDealTaTeacherList,   			   //处理后的助教老师列表
		selectBishopTeacherIds,			   //存放选中的主教老师ids
		selecttTaTeacherIds,         	   //存放选中的助教老师ids
		remainingOptionalTeacherList,	   //剩余可选老师

		pnum,
		cnum,
		ctype,
		btnLoading

	} = classesManagementModel;

	function dp(type, parameter) {
		dispatch({
			type : `classesManagementModel/${type}`,
			payload : {
				...parameter
			}
		});
	}

	/*常用搜索*/
	function searchFunction( values ){
		dispatch({
			type : 'classesManagementModel/searchFunction',
			payload : {
				params : {
					/*高级搜索*/
					uid, orgId, courseId, pageSize,
					pageIndex : 0,
					...values
				}
			}
		})
	}

	/*常用搜索重置*/
	function clearFunction(){
		dispatch({
			type : 'classesManagementModel/searchFunction',
			payload : {
				params : {
					/*高级搜索*/
					uid, orgId, courseId, pageSize,
					pageIndex : 0,
					id : undefined,
					name : undefined
				}
			}
		})
	}

	/*点击打开高级搜索*/
	function superSearchClick(){
		dispatch({
			type : 'classesManagementModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values ){
		dispatch({
			type : 'classesManagementModel/searchFunction',
			payload : {
				params : {
					/*常用搜索*/
					id, name, pageSize,
					pageIndex : 0,
					...values
				}
			}
		})
	}

	/*高级搜索重置*/
	function onSuperClear(){
		dispatch({
			type : 'classesManagementModel/searchFunction',
			payload : {
				params : {
					/*常用搜索*/
					id, name, pageSize,
					pageIndex : 0,
					uid      : undefined,
					orgId    : undefined,
					courseId : undefined
				}
			}
		})
	}

	/*删除班级*/
	function deleteClasses(){
		let ids = [];
		!!selectedRows && selectedRows.map( function( item, index ){
			ids.push( item.id );
		})
		dispatch({
			type : 'classesManagementModel/deleteClasses',
			payload : {
				ids
			}
		})
	}

	/*新增班级*/
	function createClasses(){
		let org;
		/*取到第一个校区(默认校区)ID*/
        if( window._init_data.firstOrg != undefined ){
            org = window._init_data.firstOrg;                //获取选择校区下的第一间校区
        }

        dp('getCourseListData', { 'id' : org.key });
        dp('getTeacherListData', { 'id' : org.key });

        dp('updateState', { showAddStudentModal : !showAddStudentModal, cnum : 0, pnum : 0, courseList : courseList });
	}

	/*选择表格项*/
	function rowSelectChange( selectedRowKeys, selectedRows ){
		dispatch({
			type : 'classesManagementModel/updateState',
			payload : {
				selectedRowKeys,
				selectedRows
			}
		})
	}

	/*显示列表项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'classesManagementModel/updateState',
			payload : {
				newColumns
			}
		})
	}

	/*分页*/
	function pageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'classesManagementModel/searchFunction',
			payload : {
				params : {
					uid, orgId, courseId, id, name,
					pageIndex : pageIndex - 1,
					pageSize
				}
			}
		})
	}

	function pageIndexChange( pageIndex ){
		dispatch({
			type : 'classesManagementModel/searchFunction',
			payload : {
				params : {
					uid, orgId, courseId, id, name,
					pageIndex : pageIndex - 1,
					pageSize
				}
			}
		})
	}

	/*显示详情*/
	function showDetail( text, record ){
		dispatch({
			type : 'classesDetailModel/showDetail',
			payload : {
				record
			}
		})
	}

	function getTeacher( p, isMain ) {
		let name	 	= '';
		let bishopArr 	= [];
		let taArr 		= [];
		let count 		= p&&p.length;
		for(let i = 0; i < count; i++) {
			if(parseInt (p[i].prime )){
				bishopArr.push(p[i].uname);
			}else{
				taArr.push( p[i].uname );
			}
			if(isMain) {
				if(bishopArr.length > 2){
					continue
				}else{
					name = bishopArr.join(',')
				}
			}else {
				if(taArr.length > 2){
					continue
				}else{
					name = taArr.join(',')
				}
			}
		}
		return name || '未安排';
	}

	function jumpToClassesDetailFunction( text, record ) {
		dispatch(
			routerRedux.push({
				pathname : '/classes_detail',
				query : {
					...record
				},
			})
		);
	}

	/*高级搜索属性*/
	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'orgId',
				type        : 'orgSelect',
				label       : '所属校区',
				options     : {
					width : 280,
					getPopupContainer : () => document.getElementById( 'super_search_wrap' )
				}
			}
		]
	}

	let classesManageComponentProps = {
		search : {
            onSearch      : searchFunction,
            onClear       : clearFunction,
            fields : [
				{
					key         : 'id',
					type        : 'input',
					placeholder : '班级Id',
				},{
					key         : 'name',
					type        : 'input',
					placeholder : '班级名称',
				},
            ]
        },
        leftBars : {
            label : '已选',
			labelNum : selectedRowKeys.length,
            btns : [
                {
                    label    : '删除',
                    handle   : deleteClasses,
                    confirm  : true,
                }
            ]
        },
        rightBars : {
			isSuperSearch      : true,
			superSearch        : superSearchClick,
			superSearchVisible : searchVisible,
            btns : [
                {
                    label    : '新增班级',
                    handle   : createClasses
                }
            ],
        },
        table : {
            loading       : loading,
            dataSource    : dataSource,
			xScroll       : 1320,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns : [
                {
					dataIndex : 'name',
					key       : 'name',
					title     : '班级名称',
					width     : 96,
					render    : (text, record) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<a onClick = { () => jumpToClassesDetailFunction( text, record ) } >{ text }</a>
						</Popover>
					),
				},{
					dataIndex : 'title',
					key       : 'title',
					title     : '所属课程',
					width     : 96,
					render    : (text, record) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					),
				},{
					dataIndex : 'stuNum',
					key       : 'stuNum',
					title     : '班级人数',
					width     : 96,
					render    : (text, record) => (
						<span>{ record.stuNum || 0 }/{ record.maxStuNum || 0 }</span>
					),
				},{
					title     : '课时消耗',
					dataIndex : 'classesConsumption',
					key       : 'classesConsumption',
					width     : 224,
					render    : (text, record) => (
						<p>
							{
								`上课 ${record.costTpl.split(',')[0] || '(无数据)'} 请假 ${record.costTpl.split(',')[1] || '(无数据)'} 补课 ${record.costTpl.split(',')[2] || '(无数据)'} 旷课 ${record.costTpl.split(',')[3] || '(无数据)'}`
							}
						</p>
					)
				},{
					dataIndex : 'progress',
					key       : 'progress',
					title     : '进度',
					width     : 68,
					render    :(text, record) => (
						<p>{ record.courseType == 2 ? `${ record.progress } / ${ record.maxProgress }` : '无'}</p>
					)
				},{
					dataIndex : 'teacherList',
					key       : 'teacherList',
					title     : '主教',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { <span>{ getTeacher( record.teacherList, true ) }</span> } trigger = 'hover' >
							<span>
								{ getTeacher( record.teacherList, true ) }
							</span>
						</Popover>
					),
				},{
					dataIndex : 'calssesTa',
					key       : 'calssesTa',
					title     : '助教',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { <span>{ getTeacher( record.teacherList, false ) }</span> } trigger = 'hover' >
							<span>
								{ getTeacher( record.teacherList, false ) }
							</span>
						</Popover>
					),
				}, {
					dataIndex : 'orgName',
					key       : 'orgName',
					title     : '所属校区',
					render    : (text, record) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					),
				}
            ],
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : rowSelectChange,
            },
         },
		pagination : {
			total            : resultCount,
			pageIndex        : pageIndex,
			pageSize         : pageSize,
			showTotal        : total => `总共 ${total} 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : pageSizeChange,
			onChange         : pageIndexChange
		}
	}

    //改变消耗数据
	function changePerNumFunction(pnum1, cnum1, ctype) {
		dp('updateState', {pnum : pnum1, cnum : cnum1, ctype : ctype});
	}

	//选择校区id
	function getCampusCourse(campusId) {
		dp('getCourseListData', {'id' : campusId});
		dp('getTeacherListData', {'id' : campusId});
	}

	//取消
	function modalCancelFunction() {
		dp('updateState', {
			showAddStudentModal : !showAddStudentModal,
			courseList : [], 
			toDealBishopTeacherList : [], 
			toDealTaTeacherList : [],
			selectBishopTeacherIds : [],
			selecttTaTeacherIds : [],
		});
	}

	function modalOkFunction(paramter) {
		dp('addClasses', { paramter : paramter });
	}

	function updataParamter(paramter) {
		dp('updateState', {...paramter});
	}

	//取消modal
	function handleCancelSourceModal() {
		modalCancelFunction();
	}

	//确定modal
	function handleOkSourceModal(paramter) {
		modalOkFunction(paramter);
	}

	//改变课程消耗
	function changePerNumFun(pnum, cnum, ctype) {
		changePerNumFunction(pnum, cnum, ctype);
	}

	//获取校区id
	function getCampusIdFun(campusId) {
		getCampusCourse(campusId);
	}

	//更新属性
	function updataParamterFunciton(paramter) {
		updataParamter(paramter);
	}

	//modal参数
	let createModalprops = {
		showAddStudentModal,
		handleCancelSourceModal,
		handleOkSourceModal,

		courseList,
		teacherList,
		toDealBishopTeacherList,
		toDealTaTeacherList,
		remainingOptionalTeacherList,
		selectBishopTeacherIds,
		selecttTaTeacherIds,

		cnum,
		pnum,
		ctype,
		btnLoading,

		changePerNumFun,
		getCampusIdFun,
		updataParamterFunciton,
	}

    return (
		<div>
			<ClassesManageComponent { ...classesManageComponentProps } />
			<SuperSearch { ...superSearchProps } />
			<ClassesManagementModal { ...createModalprops } />
		</div>
	);
}

function mapStateToProps({ classesManagementModel }) {
  	return { classesManagementModel };
}

export default connect(mapStateToProps)(ClassesManagement);
