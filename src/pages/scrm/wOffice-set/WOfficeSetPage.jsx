import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs } from 'antd';
import WOfficeOrgIdComponent     from '../../../components/scrm/wOffice-set/WOfficeOrgIdComponent';
import WOfficeSetComponent       from '../../../components/scrm/wOffice-set/WOfficeSetComponent';
import WOfficeSetCodeUrlComponent from '../../../components/scrm/wOffice-set/WOfficeSetCodeUrlComponent';
import WOfficeSetChangeTitleModal from '../../../components/scrm/wOffice-set/WOfficeSetChangeTitleModal';

const TabPane = Tabs.TabPane;

function WOfficeSetPage({ dispatch, wOfficeSetModel }){
    let {
        orgId,
		wOfficeTab,

		dataSource,
		selectedRows,
		selectedRowKeys,

		name,
		title,
		linkUrl,
		changeTitleModal,

		orgSelect,
		orgHome,
		orgAudition,

    } = wOfficeSetModel;


	//改变机构Id
    function TenantSelectOnSelect( value ){		
        dispatch({
            type : 'wOfficeSetModel/TenantSelectOnSelect',
            payload : {
                value
            }
        })
    };

	function jumpToOrgManage(){
        dispatch({
            type: 'mainLayoutModel/changeHeadMenu',
            payload : {
                headMenu: 'sys'
            }
          });
        dispatch(
            routerRedux.push('/sys_org_list')
        );
    }

    //切换tab分页
    function changeTableTab( value ){
		dispatch({
			type : 'wOfficeSetModel/updateState',
			payload : {
				wOfficeTab : value
			}
		})
    };

	//选择表格项
	function rowSelectChange( selectedRowKeys, selectedRows ){
		dispatch({
			type : 'wOfficeSetModel/updateState',
			payload : {
				selectedRows,
				selectedRowKeys
			}
		})
	};

	//显示
	function showItem(){
		dispatch({
			type : 'wOfficeSetModel/showAndHideItem',
			payload : {
				selectedRows,
				show : 1,
			}
		})
	};

	//隐藏
	function hideItem(){
		dispatch({
			type : 'wOfficeSetModel/showAndHideItem',
			payload : {
				selectedRows,
				show : 0,
			}
		})
	};

	//编辑
	function editItem(){
		dispatch({
			type : 'wOfficeSetModel/editItem',
			payload : {
				changeTitleModal,
				selectedRows,
			}
		})
	};

	//取消更改显示项
	function cancelChangeTitle(){
		dispatch({
			type : 'wOfficeSetModel/updateState',
			payload : {
				changeTitleModal   : false,
				name               : '',
				title              : '',
				linkUrl            : '',
			}
		})
	};

	//确认更改显示项
	function confirmChangeTitle( value ){
		dispatch({
			type : 'wOfficeSetModel/confirmChangeTitle',
			payload : {
				changeTitleModal,
				value
			}
		})
	};

    let WOfficeSetComponentProps = {
        dataSource,
		selectedRows,
		selectedRowKeys,

        jumpToOrgManage,

		rowSelectChange,
		showItem,
		hideItem,
		editItem,
    };

	let wOfficeSetChangeTitleModalProps = {
		changeTitleModal,
		title,
		linkUrl,
		name,

		cancelChangeTitle,
		confirmChangeTitle,
	}

    let WOfficeOrgIdComponentProps = {
        TenantSelectOnSelect,
        orgId,
    };

	let WOfficeOrgSelectComponentProps = {
		url      : window.compatibleProtocol(orgSelect),
		code_tip : '该链接为校区列表页的地址，是所有校区的入口',
		type     : 'orgSelect'
	};

	let WOfficeOrgHomeComponentProps = {
		url      : window.compatibleProtocol(orgHome),
		code_tip : '该链接为各个校区主页的地址',
		type     : 'orgHome',
	};

	let WOfficeOrgAuditionComponentProps = {
		url      : window.compatibleProtocol(orgAudition),
		code_tip : '该链接为各个校区预约试听的地址',
		type     : 'orgAudition'
	}
    return (
        <div>
            <WOfficeOrgIdComponent     { ...WOfficeOrgIdComponentProps } />
			<div className = 'tabs' style = {{ paddingLeft : '20px' }} >
				<Tabs
				  activeKey = { wOfficeTab }
				  type = 'card'
				  onChange = { changeTableTab }
				>
					<TabPane tab = { <span>官网设置</span> } key = "wOffice_set" >
						<WOfficeSetComponent { ...WOfficeSetComponentProps } />
					</TabPane>
					<TabPane tab = { <span>校区选择页</span> } key = "org_select" >
						<WOfficeSetCodeUrlComponent { ...WOfficeOrgSelectComponentProps } />
					</TabPane>
					<TabPane tab = { <span>校区主页</span> } key = "org_main" >
						<WOfficeSetCodeUrlComponent { ...WOfficeOrgHomeComponentProps } />
					</TabPane>
					<TabPane tab = { <span>预约试听</span> } key = "reservation_lis" >
						<WOfficeSetCodeUrlComponent { ...WOfficeOrgAuditionComponentProps } />
					</TabPane>
				</Tabs>
			</div>
			<WOfficeSetChangeTitleModal { ...wOfficeSetChangeTitleModalProps } />
        </div>
    )
};

function mapStateToProps ({ wOfficeSetModel }){
	return { wOfficeSetModel };
};

export default connect( mapStateToProps )( WOfficeSetPage );
