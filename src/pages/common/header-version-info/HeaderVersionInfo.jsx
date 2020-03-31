import React from 'react';
import { connect } from 'dva';
import HeaderVersionInfoComponent from '../../../components/common/header-version-info/HeaderVersionInfoComponent';

/**
 * 顶部导航
 * 版本信息块
 */
function HeaderVersionInfo({dispatch, headerVersionInfoModel}) {

    return (
        <HeaderVersionInfoComponent />
    );
}

function mapStateToProps({ headerVersionInfoModel }) {
  return { headerVersionInfoModel };
}

export default connect(mapStateToProps)(HeaderVersionInfo);
