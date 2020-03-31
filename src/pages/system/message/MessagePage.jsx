import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon } from 'antd';
import MessageComponent from '../../../components/common/manager-list/ManagerListMgr';

function MessagePage({ dispatch, messageModel }){
    let {
		searchVisible,
		pageSize,
		pageIndex,
		mobile,
		orgId,
		startTime,
		endTime,
		dataSource,
		resultCount,
		loading,

    } = messageModel;

	//筛选框是否显示
	function filterFunction(){
		dispatch({
			type : 'messageModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	};

	//搜索、重置
	function searchFunction( values ){
		dispatch({
			type : 'messageModel/searchAndClearFunction',
			payload : {
				values
			}
		})
	};
	function clearFunction(){
		dispatch({
			type : 'messageModel/searchAndClearFunction',
			payload : {
				values : {
					orgId     : '',
					mobile    : '',
					startTime : '',
					endTime   : '',
				}
			}
		})
	}

	//分页
	function pageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'messageModel/paginationChange',
			payload : {
				pageSize, pageIndex
			}
		})
	};
	function pageIndexChange( pageIndex ){
		dispatch({
			type : 'messageModel/paginationChange',
			payload : {
				pageIndex, pageSize
			}
		})
	};

    let messageComponentProps = {
        search : {
            searchAble    : true,
            showSearch    : searchVisible,
            filterBtnText : '筛选',
            onFilterClick : filterFunction,
            onSearch      : searchFunction,
            onClear       : clearFunction,
            fields : [
                        {
                            key         : 'orgId',
                            type        : 'orgSelect',
                            placeholder : '所属校区',
                            options : {
                                width : 300,
                            },
                        },{
                            key         : 'mobile',
                            type        : 'text',
                            placeholder : '手机号',
                        },{
							key   : 'time',
							type  : 'rangePicker',
							placeholder : '发送时间',
							options : {
                                format : 'YYYY-MM-DD'
                            }
						}
            ]
        },
		rightBars : {
            btns : [
            ]
        },
        table : {
            loading    : loading,
            dataSource : dataSource,
            columns : [
                {
                    dataIndex : 'recepMobile',
                    key       : 'recepMobile',
                    title     : '接收手机号',
                    width     : 80,
                },{
                    dataIndex : 'recepName',
                    key       : 'recepName',
                    title     : '姓名',
                    width     : 80,
                },{
                    dataIndex : 'content',
                    key       : 'content',
                    title     : '短信内容',
                    width     : 180,
                },{
                    dataIndex : 'orgName',
                    key       : 'orgName',
                    title     : '校区',
                    width     : 130,
                },{
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    title     : '发送时间',
                    width     : 150,
                }
            ],
            emptyText : '暂时没有数据',
            pagination : {
                total            : resultCount,
                pageIndex        : pageIndex,
                pageSize         : pageSize,
                showTotal        : '',
                showSizeChanger  : true,
                showQuickJumper  : true,
                onShowSizeChange : pageSizeChange,
                onChange         : pageIndexChange

            }
         }
    };


    return (
        <div>
            <MessageComponent { ...messageComponentProps } />
        </div>
    )
};

function mapStateToProps ({ messageModel }){
	return { messageModel };
};

export default connect( mapStateToProps )( MessagePage );
