import React from "react"
import { connect } from "dva"
import { message } from "antd"
import TmkOwnSeaManageComponent from "../../components/tmk/tmkOwnSea/TmkOwnSeaManageComponent"
import TmkOwnSeaSuperSearch from "../../components/tmk/tmkOwnSea/TmkOwnSeaSuperSearch"
import StuFollowModal from "../../components/tmk/tmkOwnSea/stuFollowModal"
import StuOrderModal from "../../components/tmk/tmkOwnSea/stuOrderModal"
import DistributeCampusModal from "../../components/tmk/tmkOwnSea/distributeCampusModal"

function TmkOwnSeaPage({ dispatch, TmkOwnSeaModel }) {
    let {
        /*快捷搜索*/
        fastSearchContent, //快捷搜索栏搜索内容
        stuFollowStatelist,    // 学员跟进状态
        searchName,
        nextFollowTimeStart,
        nextFollowTimeEnd,
        studentFollowState,
        deptId,

        /*高级搜索*/
        superSearchVisible, //高级搜索是否显示
        superSearchContent, //高级搜索栏搜索内容
        followResultList, //跟进结果
        channel, // 来源类别
        secondChannel, //市场渠道
        followUserList, // 跟进人列表

        /*table*/
        tableNewColumns, //选择列表是否显示字段是哪些
        tableLoading, //列表是否加载状态
        tableDataSource, //table列表数据
        selectedRowKeys, // 复选框选中数据

        /*pagination*/
        resultCount, //数据总共数目
        pageIndex, //页码
        pageSize, //每页条数

        /* 机构选择 */
        selectModalVisible, // 校区选择框是否可见
        selectOrgs, // 机构选择- 选择的机构列表

        /* 学员跟进 */
        stuFollowModalVisible, //学员跟进modal是否显示
        stuFollowModalLoading, //学员跟进modal加载状态
        stuFollowModalButtonLoading, //学员跟进modal按钮加载状态
        followData, // 学员跟进数据
        followList, //跟进列表
        followListHasMore, //是否还有更多
        followPageSize,
        followPageIndex,

        /* 学员预约 */
        stuOrderModalVisible, //学员预约modal是否显示
        stuOrderModalLoading, //学员预约modal加载状态
        stuOrderModalButtonLoading, //学员预约modal按钮加载状态
        stuOrderData,          // 学员预约表单数据
        selectCourseTime,      //选中某时间段课程
        dayList,               //有课日期列表
		courseList,            //课程下拉列表
        courseDataSource,      //当日有课列表
        tryOrgId,              //预约试听校区

        /* 分配校区 */
        distributeModalVisible, //分配校区modal是否显示
        distributeModalLoading, //分配校区modal加载状态
        distributeModalButtonLoading, //分配校区modal按钮加载状态
        orgId, // 分配校区
        /* 跟进数据 */
        unRecordNum, //待跟进人数
        recordNum, // 已跟进人数
        recordItem,
        followRecordLoading,

        isAssign,        // 是否已分配
    } = TmkOwnSeaModel

    //搜索栏的OnSearch事件
    function SearchBarOnSearch(data) {
        if (!!data && !!data.dept_org) {
            data.tenantIds = data.dept_org.substr(0, data.dept_org.indexOf("-"))
            data.orgIds = data.dept_org.substr(data.dept_org.indexOf("-") + 1)
            data.orgId = data.dept_org.substr(data.dept_org.indexOf("-") + 1)
            delete data.dept_org
        }
        if(data.searchName) {
            data.searchName = data.searchName.replace(/\'/g,"");
        }
        formatTime(data, "followTime", "nextFollowTimeStart", "nextFollowTimeEnd")
        dispatch({
            type: "TmkOwnSeaModel/GetTableList",
            payload: {
                pageIndex: 0,
                pageSize: pageSize,
                fastSearchContent: data,
                superSearchContent
            }
        })
    }
    //搜索清空
    function SearchBarOnClear() {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                nextFollowTimeStart : '',
                nextFollowTimeEnd : '',
                searchName : '',
                studentFollowState : '',
                deptId : '',
            }
        })
        dispatch({
            type: "TmkOwnSeaModel/GetTableList",
            payload: {
                pageIndex: 0,
                pageSize: pageSize,
                fastSearchContent: {},
                superSearchContent,
                nextFollowTimeStart : '',
                nextFollowTimeEnd : '',
                searchName : '',
                studentFollowState : '',
                deptId : '',
            }
        })
    }

    //table点击高级搜索事件和高级搜索点击右上角的X
    function SuperSearchOnSearch() {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                superSearchVisible: !superSearchVisible
            }
        })
    }

    //时间格式化方法
    function formatTime(data, keyInit, keySubmitStart, keySubmitEnd) {
        if (data && data[keyInit] && data[keyInit].length > 0) {
            data[keySubmitStart] =
                data[keyInit][0] != undefined
                    ? data[keyInit][0].format("YYYY-MM-DD")
                    : undefined
            data[keySubmitEnd] =
                data[keyInit][1] != undefined
                    ? data[keyInit][1].format("YYYY-MM-DD")
                    : undefined
            delete data[keyInit]
        }
    }

    //高级搜索点击搜索
    function SuperSearchClick(data) {
        //时间格式化最后一次到访时间
        formatTime(data, "lastVisitTime", "lastVisitTimeStart", "lastVisitTimeEnd")
        dispatch({
            type: "TmkOwnSeaModel/GetTableList",
            payload: {
                pageIndex: 0,
                pageSize: pageSize,
                fastSearchContent,
                superSearchContent: data,
                nextFollowTimeStart,
                nextFollowTimeEnd,
                searchName,
                studentFollowState,
                deptId,
            }
        })
    }
    //高级搜索点击重置
    function SuperSearchOnClear() {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                superSearchContent: {},
            }
        })
        dispatch({
            type: "TmkOwnSeaModel/GetTableList",
            payload: {
                pageIndex: 0,
                pageSize: pageSize,
                superSearchContent: {},
                nextFollowTimeStart,
                nextFollowTimeEnd,
                searchName,
                studentFollowState,
                deptId,
            }
        })
    }

    //分页改变事件
    function TablePageOnChange(pageIndex, pageSize) {
        dispatch({
            type: "TmkOwnSeaModel/GetTableList",
            payload: {
                pageIndex: pageIndex - 1,
                pageSize: pageSize,
                fastSearchContent,
                superSearchContent
            }
        })
    }

    //列表控制显示行
    function TableChangeColumns(tableNewColumns) {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                tableNewColumns
            }
        })
    }
    //学员跟进modal打开
    function stuFollow(record, isAssign) {
        dispatch({
            type: "TmkOwnSeaModel/queryFollowList",
            payload: {
                stuId : record.clueStuId
            }
        })
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                followData : {},
                recordItem: record,
                isAssign
            }
        })
    }
    //学员跟进modal关闭
    function stuFollowModalCancel() {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                stuFollowModalVisible: false
            }
        })
    }
    /* 学员跟进提交 */
    function stuFollowModalSubmit(value,clear) {
        delete value.stuName
        delete value.parent
        dispatch({
            type: "TmkOwnSeaModel/followCreate",
            payload: {
                stuId : recordItem.clueStuId,
                parentId: recordItem.parentId,
                ...value,
                source: '2',
                clear
            }
        })
    }
    /* 跟进结果change */
    function followResultChange(val) {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                followData: {
                    followResult: val
                }
            }
        })
    }
    //学员预约modal打开
    function stuOrder(record) {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                stuOrderModalVisible: true,
                stuOrderData:{
                    orderType: '1'
                },
                recordItem: record
            }
        })
    }
    //学员预约modal关闭
    function stuOrderModalCancel() {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                stuOrderModalVisible: false,
                selectCourseTime              : "",
                courseDataSource              : [],
                dayList                       : [],
                courseList                    : []
            }
        })
    }
    /* 学员预约提交 */
    function stuOrderModalSubmit(value,clear) {
        if(value.orderType == '1') {
            delete value.stuName
            delete value.orderType
            dispatch({
                type: "TmkOwnSeaModel/addVisitRecord",
                payload: {
                    stuId: recordItem.clueStuId,
                    source: '2',
                    ...value,
                    clear
                }
            })
        }else if(value.orderType == '2') {
            delete value.courseId
            delete value.orderType
            delete value.selectCourseTime
            delete value.studyDate
            delete value.year
            dispatch({
                type: "TmkOwnSeaModel/addAudition",
                payload: {
                    stuId: recordItem.clueStuId,
                    source: "2",
                    ...value,
                    clear
                }
            })
        }
    }
    /* 学员预约类型 */
    function orderTypeChange(e) {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                stuOrderData: {
                    orderType: e.target.value,
                }
            }
        })
    }
    function OnCourseListAction( value, time ) {
        dispatch({
            type : 'TmkOwnSeaModel/queryCoursePlan',
            payload : {
                courseId  : value,
                endDate   : time,
                startDate : time,
            }
        })
    }
    /* 选中某个时间段的课程 */
    function selectCouseandtimeAction(data) {
        dispatch({
            type : 'TmkOwnSeaModel/updateState',
            payload : {
                selectCourseTime:data,
            }
        })
    }

    function OnCourseListreset() {
        dispatch({
            type : 'TmkOwnSeaModel/updateState',
            payload : {
                courseDataSource : [],
                selectCourseTime : [],
            }
        })
    }
    //预约试听机构change
    function orgIdChange(val) {
        dispatch({
            type: 'TmkOwnSeaModel/updateState',
            payload: {
                tryOrgId: val,
                courseDataSource : []
            }
        })
    }
    //选择年月得到有课的日期
	function selectYearToDate( month ){
        if(tryOrgId) {
            dispatch({
                type : 'TmkOwnSeaModel/tryDayQuery',
                payload : {
                    month,
                    orgId: tryOrgId
                }
            })
        }
		dispatch({
			type : 'TmkOwnSeaModel/updateState',
			payload : {
				courseDataSource : [],
			 	selectCourseTime : [],
			}
		})
	}
	//选择日期得到课程列表以及课程信息
	function selectDate( value ){
		dispatch({
			type : 'TmkOwnSeaModel/tryCourseQuery',
			payload : {
                studyDate: value,
                orgId: tryOrgId
			}
        })
        dispatch({
			type : 'TmkOwnSeaModel/queryCoursePlan',
			payload : {
                // orgId: tryOrgId,
                canTry: "1",
                endDate: value,
                pageIndex: 0,
                pageSize: 999999,
                startDate: value
			}
		})
	}
    //分配校区modal打开
    function distributeCampus(record) {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                distributeModalVisible: true,
                recordItem: record
            }
        })
    }
    //分配校区modal关闭
    function distributeModalCancel() {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                distributeModalVisible: false
            }
        })
    }
    /* 分配校区modal提交 */
    function distributeModalSubmit(value,clear) {
        dispatch({
            type: "TmkOwnSeaModel/distributionCampus",
            payload: {
                stuId: recordItem.clueStuId,
                orgId: value.orgId,
                clear
            }
        })
    }
    //复选框onChange事件
    function TableSelectedRowOnChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: "TmkOwnSeaModel/updateState",
            payload: {
                selectedRowKeys,
                selectedRows
            }
        })
    }
    /* 返回公海池 */
    function backToPublicSea() {
        if(selectedRowKeys && selectedRowKeys.length > 0) {
            let ids = selectedRowKeys.join(',')
            dispatch({
                type: "TmkOwnSeaModel/recycleStu",
                payload: {
                    stuIds:ids
                }
            })
        }else {
            message.warn('至少选择一项退回公海池')
        }
    }
    function onSelectOrgModalClose() {
        dispatch({
            type: 'TmkOwnSeaModel/onSelectOrgModalClose',
            payload : {
                selectModalVisible
            }
        });
    }
    function afterSelectOrgModal(org_select) {
        dispatch({
            type: 'TmkOwnSeaModel/afterSelectOrgModalSubmit',
            payload : {
                selectOrgs: org_select,
            }
        });
    };

    function queryMoreFollowData() {
		dispatch({
			type: 'TmkOwnSeaModel/queryFollowList',
			payload: {
                stuId: recordItem.clueStuId,
			}
        });
        dispatch({
			type: 'TmkOwnSeaModel/updateState',
			payload: {
                followPageSize: followPageSize + 3,
			}
		});
	}
    /* 加载更多 */
    function followContScroll() {
        let div = document.getElementById('record_list');
        if(div.clientHeight + div.scrollTop + 200 >= div.scrollHeight > 0 && followListHasMore){
            setTimeout(queryMoreFollowData, 200);
        }
    }

    /*高级搜索属性*/
    let TmkOwnSeaSuperSearchProps = {
        stuFollowStatelist,
        superSearchVisible, //高级搜索是否显示
        superSearchContent, //高级搜索栏搜索内容
        SuperSearchClick, //高级搜索点击搜索
        SuperSearchOnClear, //高级搜索点击重置
        SuperSearchOnSearch, //点击右上角的X
        followResultList, //跟进结果
        channel, // 来源类别
        secondChannel, //市场渠道
        followUserList, // 跟进人列表
    }
    //table整体属性
    let TmkOwnSeaManageComponentProps = {
        stuFollowStatelist, // 跟进状态
        followResultList,  //跟进结果
        stuFollow,
        stuOrder,
        distributeCampus,
        unRecordNum, //待跟进人数
        recordNum, // 已跟进人数
        search: {
            onSearch: data => SearchBarOnSearch(data),
            onClear: data => SearchBarOnClear(data),
            noSearchBtn: true,
            fields: [
                {
                    key: "followTime",
                    type: "rangePicker",
                    startPlaceholder: "开始日期",
                    endPlaceholder: "结束日期",
                    format: 'YYYY-MM-DD',
                    width: 220,
                    showTime: false,
                },
                {
                    key: "searchName",
                    type: "inputSearch",
                    placeholder: "请输入学员/家长姓名",
                },
                {
                    key: "mobile",
                    type: "inputSearch",
                    placeholder: "请输入电话号码",
                },
                {
                    key: "deptId",
                    type: "dept_name",
                    placeholder: "请选择城市",
                }
            ]
        },
        table: {
            newColumns: tableNewColumns,
            changeColumns: TableChangeColumns,
            loading: tableLoading,
            dataSource: tableDataSource,
            rowKey: "clueStuId",
            rowSelection: {
                selectedRowKeys: selectedRowKeys,
                onChange: TableSelectedRowOnChange, //复选框onChange事件
                getCheckboxProps: record => ({
                    disabled: record.tmkStatus != '1', // 已分配不可选
                })
            },
            height : 310,
        },
        pagination: {
            total: resultCount,
            pageIndex: pageIndex,
            pageSize: pageSize,
            onChange: TablePageOnChange,
            onShowSizeChange: TablePageOnChange,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: () => `共${resultCount}条`
        },
        rightBars: {
            isSuperSearch: false,
            isleftSuperSearch: true,
            superSearchVisible: superSearchVisible,
            superSearch: SuperSearchOnSearch,
            closeSearch: SuperSearchOnSearch,
            btns: [
                {
                    label: "退回公海池",
                    type: "tmkOwnSea",
                    content: "确定要退回公海池吗？",
                    handle: backToPublicSea,
                    placement: 'topRight'
                }
            ]
        }
    }
    /* 学员跟进modal */
    let stuFollowModalProp = {
        stuFollowModalVisible, //学员跟进modal是否显示
        stuFollowModalLoading, //学员跟进modal加载状态
        stuFollowModalButtonLoading, //学员跟进modal按钮加载状态
        stuFollowModalCancel, // 关闭modal
        stuFollowModalSubmit, // 提交
        followData,
        followResultChange, // 跟进结果change
        selectModalVisible, // 校区选择框是否可见
        selectOrgs, // 机构选择- 选择的机构列表
        afterSelectOrgModal,
        onSelectOrgModalClose,
        followList, //跟进列表
        recordItem, //每小项表格信息
        stuFollowStatelist, // 跟进状态
        followResultList, // 跟进结果
        followListHasMore,
        followContScroll,
        followRecordLoading,
        isAssign,        // 是否已分配
    }
    /* 学员预约modal */
    let stuOrderModalProp = {
        stuOrderModalVisible, //学员预约modal是否显示
        stuOrderModalLoading, //学员预约modal加载状态
        stuOrderModalButtonLoading, //学员预约modal按钮加载状态
        stuOrderModalCancel, // 取消
        stuOrderModalSubmit, // 确定
        stuOrderData, // 学员预约表单数据
        orderTypeChange, // 预约类型change
        dayList,                   //有课日期列表
        courseList,                //课程下拉列表
        courseDataSource,          //当日有课列表
        selectYearToDate,          //选择年月得到有课的日期
        selectDate,                //选择日期
        selectCourseTime,
        selectCouseandtimeAction, // 选择表格中的课程
        OnCourseListreset,
        OnCourseListAction,
        recordItem,
        orgIdChange, // 机构change
        tryOrgId  //试听校区
    }
    /* 分配校区 */
    let distributeModalProp = {
        distributeModalVisible, //分配校区modal是否显示
        distributeModalLoading, //分配校区modal加载状态
        distributeModalButtonLoading, //分配校区modal按钮加载状态
        distributeModalCancel, // 取消
        distributeModalSubmit, // 确定
        orgId, // 分配校区
        selectModalVisible, // 校区选择框是否可见
        selectOrgs, // 机构选择- 选择的机构列表
        afterSelectOrgModal,
        onSelectOrgModalClose,
    }

    return (
        <div style={{ overflow: "hidden", height: "100%", minWidth: 980 }}>
            <TmkOwnSeaManageComponent {...TmkOwnSeaManageComponentProps} />
            <TmkOwnSeaSuperSearch {...TmkOwnSeaSuperSearchProps} />
            <StuFollowModal {...stuFollowModalProp} />
            <StuOrderModal {...stuOrderModalProp} />
            <DistributeCampusModal {...distributeModalProp}/>>
        </div>
    )
}

function mapStateToProps({ TmkOwnSeaModel }) {
    return { TmkOwnSeaModel }
}

export default connect(mapStateToProps)(TmkOwnSeaPage)
