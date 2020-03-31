import React from 'react';
import { connect } from 'dva';
import MainLayoutComponent from '../../../components/common/main-layout/MainLayoutComponent';

function MainLayout({dispatch, location, children, route, mainLayoutModel}) {

    let {headMenuKey, allMenuList, versionInfoVisible, hasInitMenu, versionInfo,} = mainLayoutModel;

    function changeVersionInfoVisible() {
        dispatch({
            type: 'mainLayoutModel/closeVersionInfoVisible',
        });
    }

    let mainLayoutProps = {
        children,
        headMenuKey,
        versionInfoVisible,versionInfo,
        changeVersionInfoVisible,hasInitMenu,
    };

    return (
        <MainLayoutComponent {...mainLayoutProps} />
    );
}


function mapStateToProps({mainLayoutModel}) {
  return {mainLayoutModel};
}

export default connect(mapStateToProps)(MainLayout);
