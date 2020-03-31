import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import HeaderProductServiceComponent from '../../../components/common/header-product-service/HeaderProductServiceComponent';

function HeaderProductService({dispatch, headerProductServiceModel}) {

    let { modalVisible } = headerProductServiceModel;

    function changeModalVisible() {
        dispatch({
            type: 'headerProductServiceModel/changeModalVisible',
        });
    }

    let headerProductServiceProps = {
        modalVisible,
        changeModalVisible,
    };
    return (
        <HeaderProductServiceComponent {...headerProductServiceProps} />
    );
}

function mapStateToProps({ headerProductServiceModel }) {
  return { headerProductServiceModel };
}

export default connect(mapStateToProps)(HeaderProductService);
