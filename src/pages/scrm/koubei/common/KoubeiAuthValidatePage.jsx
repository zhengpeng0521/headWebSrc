import React, {PropTypes} from 'react';
import { connect } from 'dva';
import KoubeiAuthValidatePageComponent from '../../../../components/scrm/koubei/common/KoubeiAuthValidatePageComponent';

function KoubeiAuthValidatePage({dispatch, koubeiAuthValidateModel}) {

	let {
        authStatus,alipayAuthUrl,
    } = koubeiAuthValidateModel;

    let componProps = {
        authStatus,alipayAuthUrl,
    };

    return (
        <KoubeiAuthValidatePageComponent {...componProps} />
    );
}

KoubeiAuthValidatePage.propTypes = {
	koubeiAuthValidateModel	: PropTypes.object,
  	dispatch	: PropTypes.func,
};

function mapStateToProps({ koubeiAuthValidateModel }) {
  	return { koubeiAuthValidateModel };
}

export default connect(mapStateToProps)(KoubeiAuthValidatePage);
