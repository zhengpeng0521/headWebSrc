import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import HeaderQrcodeComponent from '../../../components/common/header-qrcode/HeaderQrcodeComponent';

function HeaderQrcode({dispatch, headerQrcodeModel}) {

    let { qrcodeSrc } = headerQrcodeModel;

    let headerQrcodeProps = {
        qrcodeSrc,
    };
    return (
        <HeaderQrcodeComponent {...headerQrcodeProps} />
    );
}

function mapStateToProps({ headerQrcodeModel }) {
  return { headerQrcodeModel };
}

export default connect(mapStateToProps)(HeaderQrcode);
