import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import LeftMenuComponent from '../../../components/common/left-menu/LeftMenuComponent';

function SaasBreadcrumb({dispatch, leftMenuModel}) {

    let { currentMenu, currentSubMenu, mapMenuItems, menuLoading, menuType,tipVersion,tipUpdateDate, } = leftMenuModel;

    function subMenuOpenChange(openKeys) {
        dispatch({
            type: 'leftMenuModel/updateState',
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
    function changeLeftMenuType(type) {
        dispatch({
            type: 'leftMenuModel/changeMenuType',
        });
        dispatch({
            type: 'leftMenuModel/changeOffsetWidth',
            payload:{
                type
            }
        });
        //console.info('type',type);

    }

    function changeVersionVisible() {
        dispatch({
            type: 'mainLayoutModel/changeVersionInfoVisible',
        });
    }

    let leftMenuProps = {
        currentMenu, currentSubMenu, mapMenuItems, menuLoading, menuType,tipVersion,tipUpdateDate,
        subMenuOpenChange,menuOnSelect,changeLeftMenuType,changeVersionVisible,
    };
    return (
        <LeftMenuComponent {...leftMenuProps} />
    );
}

function mapStateToProps({ leftMenuModel }) {
  return { leftMenuModel };
}

export default connect(mapStateToProps)(SaasBreadcrumb);
