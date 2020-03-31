import React from 'react';
import { connect } from 'dva';
import HeaderMenuComponent from '../../../components/common/header-menu/HeaderMenuComponent';

function HeaderMenu({dispatch, headerMenuModel}) {

    let { headMenuList, currentMenuKey, } = headerMenuModel;

    function onMenuItemClick(menuKey) {
        dispatch({
            type: 'headerMenuModel/changeCurrentMenu',
            payload : {
                menuKey,
				headMenuList
            }
        });
    }

    let headerMenuProps = {
        headMenuList,currentMenuKey,
        onMenuItemClick,
    };
    return (
        <HeaderMenuComponent {...headerMenuProps} />
    );
}

function mapStateToProps({ headerMenuModel }) {
  return { headerMenuModel };
}

export default connect(mapStateToProps)(HeaderMenu);
