import React from 'react';
import { connect } from 'dva';
import HeaderOrgInfoComponent from '../../../components/common/header-org-info/HeaderOrgInfoComponent';

/**
 * 顶部导航
 * 机构信息块
 */
function HeaderOrgInfo({dispatch, headerOrgInfoModel}) {

    let {
        imgUrl
    } = headerOrgInfoModel;

    let headerOrgInfoProps = {
        imgUrl,
    };

    return (
        <HeaderOrgInfoComponent {...headerOrgInfoProps} />
    );
}

function mapStateToProps({ headerOrgInfoModel }) {
    return { headerOrgInfoModel };
}

export default connect(mapStateToProps)(HeaderOrgInfo);
