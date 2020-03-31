import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import LeftMenuComponent from '../../../components/common/left-menu/LeftMenuComponent';

function LeftMenu({dispatch, leftMenuModel, mainLayoutModel}) {

    let { currentMenu, currentSubMenu, mapMenuItems, menuLoading, menuType, } = leftMenuModel;
    let {versionInfo} = mainLayoutModel;
    let tipVersion = (versionInfo && versionInfo.version) || '0.0.0';
    let tipUpdateDate = (versionInfo && versionInfo.updateDate) || '2017-07-06';

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

function mapStateToProps({ leftMenuModel, mainLayoutModel }) {
  return { leftMenuModel, mainLayoutModel };
}

export default connect(mapStateToProps)(LeftMenu);
