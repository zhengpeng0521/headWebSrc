import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import SiderMenuComponent from '../../../components/common/sider-menu/SiderMenuComponent';

function SiderMenuPage({dispatch, siderMenuModel, indexMainLayoutModel }) {

    let { menuLoading,currentMenu,selectedKeys,openModuleMenus,openSubMenus,menuType,menuTreeList,menuRenderInit, } = siderMenuModel;
    let {versionInfo} = indexMainLayoutModel;
    let tipVersion = (versionInfo && versionInfo.version) || '0.0.0';
    let tipUpdateDate = (versionInfo && versionInfo.updateDate) || '2017-07-06';

	function updateMenuRenderInit(menuRenderInit) {
		dispatch({
            type: 'siderMenuModel/updateState',
            payload : {
                menuRenderInit
            }
        });
	}

    function menuOpenChange(openKeys) {
        dispatch({
            type: 'siderMenuModel/menuOpenChange',
            payload : {
                openKeys
            }
        });
    }

    function subMenuOpenChange(openKeys) {
        dispatch({
            type: 'siderMenuModel/updateState',
            payload : {
                currentSubMenu: openKeys[openKeys.length - 1]
            }
        });
    }

    function menuOnSelect(selectedKey) {
        dispatch(routerRedux.push({
            pathname: selectedKey.key,
        }));
    }

    //改变菜单的展示方式
    function changeLeftMenuType() {
        dispatch({
            type: 'siderMenuModel/changeMenuType',
        });
    }

    function changeVersionVisible() {
        dispatch({
            type: 'indexMainLayoutModel/changeVersionInfoVisible',
        });
    }

	//点击子菜单路由跳转
	function menuSelectChange(selectedKey, moduleMenuKey) {
    	dispatch({
            type: 'siderMenuModel/updateState',
            payload : {
                currentMenu: selectedKey,
                selectedKeys: [moduleMenuKey],
                menuRenderInit: false,
            }
        });
        dispatch(routerRedux.push({
            pathname: selectedKey,
        }));
    }

    let componentProps = {
        menuLoading,currentMenu,selectedKeys,openModuleMenus,openSubMenus,menuType,menuTreeList,menuRenderInit,tipVersion,tipUpdateDate,updateMenuRenderInit,
        subMenuOpenChange,menuOnSelect,changeLeftMenuType,changeVersionVisible,
        menuOpenChange,
		menuSelectChange
    };
    return (
        <SiderMenuComponent {...componentProps} />
    );
}

function mapStateToProps({ siderMenuModel, indexMainLayoutModel }) {
    return { siderMenuModel, indexMainLayoutModel };
}

export default connect(mapStateToProps)(SiderMenuPage);
