import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button } from 'antd';
import SendClassHourComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';
import DetailHeader from '../../../components/crm/vip-manage/vip-manage-detail/DetailHeader';

import BaseInfoTab from '../../../components/crm/vip-manage/vip-manage-detail/BaseInfoTab';
import StudentList from '../../../components/crm/vip-manage/vip-manage-detail/StudentList';
import ParentList from '../../../components/crm/vip-manage/vip-manage-detail/ParentList';
import ContractList from '../../../components/crm/vip-manage/vip-manage-detail/ContractList';
import RefundList from '../../../components/crm/vip-manage/vip-manage-detail/RefundList';
import SendClassList from '../../../components/crm/vip-manage/vip-manage-detail/SendClassList';
import ClassChangeList from '../../../components/crm/vip-manage/vip-manage-detail/ClassChangeList';
import BalanceList from '../../../components/crm/vip-manage/vip-manage-detail/BalanceList';
import { StatusFlag, NewModal } from '../../../components/common/new-component/NewComponent';

import AddSendClassModal from '../../../components/crm/vip-manage/vip-manage-modal/AddSendClassModal';          //添加赠送课时
import AddStudentModal from '../../../components/crm/vip-manage/vip-manage-modal/AddStudentModal';              //添加赠送课时

import TransCourseModal from '../../../components/crm/vip-manage/vip-manage-detail/TransCourseModal';           //转课modal

import styles from './VipManageDetailPage.less';

const TabPane = Tabs.TabPane;

function VipManageDetailPage({ dispatch, vipManageDetailModel }){
    let {
		detailVisible,

		activeKey,         //当前激活的tab
        orgId,              //校区id

		id,                //会员卡号

		/*基础信息*/
		baseInfo,

		/*适用学员参数*/
		studentDataSource,
		studentLoading,

		addStudentModalVisible,
		studentList,
		addStudentBtnLoading,
		/*适用学员参数*/

		/*适用家长参数*/
		parentDataSource,
		parentLoading,
		/*适用家长参数*/

		/*合同列表参数*/
		contractDataSource,
		contractResultCount,
		contractLoading,
		contractPageIndex,
		contractPageSize,
		/*合同列表参数*/

		/*退费列表参数*/
		refundDataSource,
		refundResultCount,
		refundPageSize,
		refundPageIndex,
		refundLoading,
		/*退费列表参数*/

		/*赠课记录参数*/
		sendClassDataSource,
		sendClassResultCount,
		sendClassPageIndex,
		sendClassPageSize,
		sendClassLoading,

		contractSelectList,
		addSendClassModalVisible,
		addSendClassModalBtnLoading,
		/*赠课记录参数*/

		/*课时变动参数*/
		classChangeDataSource,
		classChangeResultCount,
		classChangePageSize,
		classChangePageIndex,
		classChangeLoading,
		/*课时变动参数*/

		/*余额变动参数*/
		balanceDataSource,
		balanceResultCount,
		balancePageIndex,
		balancePageSize,
		balanceLoading,
		/*余额变动参数*/

        /*转课*/
        transCourseModalVisible,            //转课modal是否显示
        transCourseModalLoading,            //转课modal加载状态
        transCourseModalButtonLoading,      //转课modal按钮加载状态
        orderList,                          //合同下拉列表内容
        courseOutMessage,                   //合同下的转出课程信息
        courseInMessage,                    //合同下的转进课程信息
        courseInDetail,                     //转进课程的详细信息
        courseOutDetail,                    //转出课程的详细信息
        typeRadioItem,                      //选择类型(1平价/2补缴/3退费)

    } = vipManageDetailModel;

	/*关闭详情*/
	function closeDetail(){
		dispatch({
			type : 'vipManageDetailModel/updateState',
			payload : {
				detailVisible : false
			}
		})
	}

	function changeTab( activeKey ){
		dispatch({
			type : 'vipManageDetailModel/changeTab',
			payload : {
				activeKey,
			}
		})
	}

	/*合同*/
	function contractPageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'vipManageDetailModel/contractPagination',
			payload : {
				contractPageIndex : pageIndex,
				contractPageSize  : pageSize
			}
		})
	}
	function contractPageIndexChange( pageIndex ){
		dispatch({
			type : 'vipManageDetailModel/contractPagination',
			payload : {
				contractPageIndex : pageIndex,
				contractPageSize
			}
		})
	}

	/*退费*/
	function refundPageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'vipManageDetailModel/refundPagination',
			payload : {
				refundPageSize  : pageSize,
				refundPageIndex : pageIndex,
			}
		})
	}
	function refundPageIndexChange( pageIndex ){
		dispatch({
			type : 'vipManageDetailModel/refundPagination',
			payload : {
				refundPageSize,
				refundPageIndex : pageIndex,
			}
		})
	}

	/*赠送课时*/
	function sendClassPageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'vipManageDetailModel/sendClassPagination',
			payload : {
				sendClassPageSize  : pageSize,
				sendClassPageIndex : pageIndex,
			}
		})
	}

	function sendClassPageIndexChange( pageIndex ){
		dispatch({
			type : 'vipManageDetailModel/sendClassPagination',
			payload : {
				sendClassPageSize,
				sendClassPageIndex : pageIndex,
			}
		})
	}

	/*课时变动*/
	function classChangePageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'vipManageDetailModel/classChangePagination',
			payload : {
				classChangePageSize  : pageSize,
				classChangePageIndex : pageIndex,
			}
		})
	}
	function classChangePageIndexChange( pageIndex ){
		dispatch({
			type : 'vipManageDetailModel/classChangePagination',
			payload : {
				classChangePageSize,
				classChangePageIndex : pageIndex
			}
		})
	}

	/*余额变动*/
	function balancePageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'vipManageDetailModel/balancePagination',
			payload : {
				balancePageSize  : pageSize,
				balancePageIndex : pageIndex,
			}
		})
	}
	function balancePageIndexChange( pageIndex ){
		dispatch({
			type : 'vipManageDetailModel/balancePagination',
			payload : {
				balancePageSize,
				balancePageIndex : pageIndex,
			}
		})
	}

	/*点击添加赠送课时*/
	function addSendClass(){
		dispatch({
			type : 'vipManageDetailModel/addSendClass',
			payload : {
			}
		})
	}

	/*确认添加赠送课时*/
	function confirmAddSendClass( values ){
		dispatch({
			type : 'vipManageDetailModel/confirmAddSendClass',
			payload : {
				values
			}
		})
	}

	/*取消添加赠送课时*/
	function cancelAddSendClass(){
		dispatch({
			type : 'vipManageDetailModel/updateState',
			payload : {
				contractSelectList       : [],
				addSendClassModalVisible : false
			}
		})
	}


	/*点击新增适用学员*/
	function createStudent(){
		dispatch({
			type : 'vipManageDetailModel/createStudent',
		})
	}

	/*确认新增适用学员*/
	function confirmAddStudent( values ){
		dispatch({
			type : 'vipManageDetailModel/confirmAddStudent',
			payload : {
				values
			}
		})
	}

	/*取消新增适用学员*/
	function cancelAddStudent(){
		dispatch({
			type : 'vipManageDetailModel/updateState',
			payload : {
				addStudentModalVisible : false,
				studentList            : []
			}
		})
	}

	/*移除适用学员*/
	function removeStudent( record ){
		let stuId = record.id;
		dispatch({
			type : 'vipManageDetailModel/removeStudent',
			payload : {
				stuId
			}
		})
	}

    //打开转课modal
    function OpenTransCourseModal(){
        dispatch({
            type:'vipManageDetailModel/updateState',
            payload:{
                transCourseModalVisible : true
            }
        })
        //获取合同下拉列表内容
        dispatch({
            type:'vipManageDetailModel/GetOrderList',
            payload:{
                cardId : id,
                status :　'4'
            }
        })
    }

    //合同下拉列表onChange事件查询合同包含的课时信息
    function TransCourseModalOrderOnChange(value){
        if(value != '' && value != undefined && value != null){
            //获取转出课程信息(合同内)
            dispatch({
                type:'vipManageDetailModel/GetOutCourseDetail',
                payload:{
                    purchaseId : value,
                    orgId,
                    cardId : id
                }
            });
            //获取转进课程信息(全校区)
            dispatch({
                type:'vipManageDetailModel/GetInCourseDetail',
                payload:{
                    purchaseId : value,
                    orgId,
                    cardId : id
                }
            });
        }else{
            dispatch({
                type:'vipManageDetailModel/updateState',
                payload:{
                    courseOutMessage: [],
                }
            })
        }
        dispatch({
            type:'vipManageDetailModel/updateState',
            payload:{
                typeRadioItem : undefined,                  //选择类型(1平价/2补缴/3退费)
                courseInDetail : {},                        //转进课程的详细信息
                courseOutDetail : {},                       //转出课程的详细信息
            }
        })
    }

    //课程名称onChange
    function TransCourseModalCourseOnChange(value,lastValue,type){
        let currentId;          //当前课程id
        let lastId;             //上一个课程id
        if(!!value){
            currentId = value.substr(0,value.indexOf('-'));
        }
        if(!!lastValue){
            lastId = lastValue.substr(0,lastValue.indexOf('-'));
        }
        if(value != '' && value != undefined && value != null){     //下拉列表选中事件
            //拿到选中项的参数对象并使转出和转进课程该项置灰
            for(let i in courseOutMessage){     //转出下拉列表中此项置灰
                if(courseOutMessage[i].courseId == currentId){
                    courseOutMessage[i].display = false;
                    if(type == 'out'){          //如果操作的是转出选择，则需要获取当前选中项详情
                        dispatch({
                            type:'vipManageDetailModel/updateState',
                            payload:{
                                courseOutDetail : courseOutMessage[i],
                            }
                        })
                    }
                    break;
                }
            }
            for(let i in courseInMessage){      //转进下拉列表中此项置灰
                if(courseInMessage[i].courseId == currentId){
                    courseInMessage[i].display = false;
                    if(type == 'in'){           //如果操作的是转进选择，则需要获取当前选中项详情
                        dispatch({
                            type:'vipManageDetailModel/updateState',
                            payload:{
                                courseInDetail : courseInMessage[i],
                            }
                        })
                    }
                    break;
                }
            }
            //使转出课程上一次选中项可选
            for(let i in courseOutMessage){
                if(courseOutMessage[i].courseId == lastId){
                    courseOutMessage[i].display = true;
                    dispatch({
                        type:'vipManageDetailModel/updateState',
                        payload:{
                            courseOutMessage
                        }
                    })
                    break;
                }
            }
            //使转入课程上一次选中项可选
            for(let i in courseInMessage){
                if(courseInMessage[i].courseId == lastId){
                    courseInMessage[i].display = true;
                    dispatch({
                        type:'vipManageDetailModel/updateState',
                        payload:{
                            courseInMessage
                        }
                    })
                    break;
                }
            }
        }else{      //清空事件
            //拿到上一项项的参数对象并使转出和转进课程该项可选
            for(let i in courseOutMessage){     //转出下拉列表中此项置灰
                if(courseOutMessage[i].courseId == lastId){
                    courseOutMessage[i].display = true;
                    break;
                }
            }
            for(let i in courseInMessage){      //转进下拉列表中此项置灰
                if(courseInMessage[i].courseId == lastId){
                    courseInMessage[i].display = true;
                    break;
                }
            }
            //清空详情
            if(type == 'out'){
                dispatch({
                    type:'vipManageDetailModel/updateState',
                    payload:{
                        courseOutDetail : {}
                    }
                })
            }else if(type == 'in'){
                dispatch({
                    type:'vipManageDetailModel/updateState',
                    payload:{
                        courseInDetail : {}
                    }
                })
            }
        }
    }

    //处理方式onChange
    function TypeRadioOnChange(e){
        dispatch({
            type:'vipManageDetailModel/updateState',
            payload:{
                typeRadioItem : e.target.value
            }
        })
    }

    //转课提交
    function TransCourseModalSubmit(data){
        dispatch({
            type:'vipManageDetailModel/TransCourseModalSubmit',
            payload:{
                cardId : id,
                orgId,
                ...data
            }
        })
    }

    //关闭转课modal
    function TransCourseModalCancel(){
        dispatch({
            type:'vipManageDetailModel/updateState',
            payload:{
                transCourseModalVisible : false,
                courseOutMessage : [],                      //合同下的转出课程信息
                courseInMessage : [],                       //合同下的转进课程信息
                courseInDetail : {},                        //转进课程的详细信息
                courseOutDetail : {},                       //转出课程的详细信息
                typeRadioItem : undefined,                  //选择类型(1平价/2补缴/3退费)
            }
        })
    }

	let headDeatilProps = {
		closeDetail,
        OpenTransCourseModal,       //打开转课modal
	}

	let studentListProps = {
		studentDataSource,
		studentLoading,

		/*方法*/
		removeStudent
	}

	/*基础信息*/
	let baseInfoTabProps = {
		baseInfo
	}

	let parentListProps = {
		parentDataSource,
		parentLoading
	}

	let contractListProps = {
		contractDataSource,
		contractResultCount,
		contractLoading,
		contractPageIndex,
		contractPageSize,

		/*方法*/
		contractPageSizeChange,
		contractPageIndexChange
	}

	let refundListProps = {
		refundDataSource,
		refundResultCount,
		refundPageSize,
		refundPageIndex,
		refundLoading,

		/*方法*/
		refundPageSizeChange,
		refundPageIndexChange
	}

	let sendClassListProps = {
		sendClassDataSource,
		sendClassResultCount,
		sendClassPageIndex,
		sendClassPageSize,
		sendClassLoading,

		/*方法*/
		sendClassPageSizeChange,
		sendClassPageIndexChange
	}

	let classChangeListProps = {
		classChangeDataSource,
		classChangeResultCount,
		classChangePageSize,
		classChangePageIndex,
		classChangeLoading,

		/*方法*/
		classChangePageSizeChange,
		classChangePageIndexChange
	}

	let balanceListProps = {
		balanceDataSource,
		balanceResultCount,
		balancePageIndex,
		balancePageSize,
		balanceLoading,

		/*方法*/
		balancePageSizeChange,
		balancePageIndexChange
	}

	/*添加赠送课时*/
	let addSendClassModalProps = {
		contractSelectList,
		addSendClassModalVisible,
		id,
		addSendClassModalBtnLoading,

		cancelAddSendClass,
		confirmAddSendClass,
	}

	/*添加适用学员*/
	let addStudentModalProps = {
		addStudentModalVisible,
		studentList,

		addStudentBtnLoading,

		/*方法*/
		cancelAddStudent,
		confirmAddStudent,
	}

    /*转课*/
    let TransCourseModalProps = {
        transCourseModalVisible,            //转课modal是否显示
        transCourseModalLoading,            //转课modal加载状态
        transCourseModalButtonLoading,      //转课modal按钮加载状态
        orderList,                          //合同下拉列表内容
        courseOutMessage,                   //合同下的转出课程信息
        courseInMessage,                    //合同下的转进课程信息
        courseInDetail,                     //转进课程的详细信息
        courseOutDetail,                    //转出课程的详细信息
        typeRadioItem,                      //选择类型(1平价/2补缴/3退费)

        TransCourseModalOrderOnChange,      //合同下拉列表onChange事件
        TransCourseModalCourseOnChange,     //课程名称onChange
        TypeRadioOnChange,                  //处理方式onChange
        TransCourseModalSubmit,
        TransCourseModalCancel,
    }

    return (
		<div className = 'common_detail' >
			<NewModal
				visible = { detailVisible }
				width = '900px'
				headVisible = { false }
				footer = '' >
				<DetailHeader { ...headDeatilProps } />
				<Tabs onChange = { changeTab } size = "small" activeKey = { activeKey } >
					<TabPane tab = '基础信息' key = '8' >
						<div className = 'vip_detail_content_item' >
							<BaseInfoTab { ...baseInfoTabProps } />
						</div>
					</TabPane>
					<TabPane tab = '适用学员' key = "1">
						<div className = 'vip_detail_content_item' >
							<Button type = 'primary' style = {{ marginLeft : '20px', marginBottom : '10px' }} onClick = { createStudent } >添加适用学员</Button>
							<StudentList { ...studentListProps }  />
						</div>
					</TabPane>
					<TabPane tab = '适用家长' key = "2">
						<div className = 'vip_detail_content_item' >
							<ParentList { ...parentListProps }  />
						</div>
					</TabPane>
					<TabPane tab = '合同' key = "3">
						<div className = 'vip_detail_content_item' >
							<ContractList { ...contractListProps } />
						</div>
					</TabPane>
					<TabPane tab = '退费' key = "4">
						<div className = 'vip_detail_content_item' >
							<RefundList { ...refundListProps } />
						</div>
					</TabPane>
					<TabPane tab = '赠课记录' key = "5">
						<div className = 'vip_detail_content_item' >
							<Button type = 'primary' style = {{ marginLeft : '20px', marginBottom : '10px' }} onClick = { addSendClass } >添加赠送课时</Button>
							<SendClassList { ...sendClassListProps } />
						</div>
					</TabPane>
					<TabPane tab = '课时变动' key = "6">
						<div className = 'vip_detail_content_item' >
							<ClassChangeList { ...classChangeListProps } />
						</div>
					</TabPane>
					<TabPane tab = '余额变动' key = "7">
						<div className = 'vip_detail_content_item' >
							<BalanceList { ...balanceListProps } />
						</div>
					</TabPane>
				  </Tabs>
			</NewModal>
			<AddSendClassModal { ...addSendClassModalProps } />
			<AddStudentModal { ...addStudentModalProps } />
            { transCourseModalVisible ? <TransCourseModal {...TransCourseModalProps}/> : null }
		</div>
    )
};

function mapStateToProps ({ vipManageDetailModel }){
	return { vipManageDetailModel };
};

export default connect( mapStateToProps )( VipManageDetailPage );
