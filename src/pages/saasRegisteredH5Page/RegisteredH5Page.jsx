import React from 'react';
import { connect } from 'dva';
import RegisteredH5Component 	from '../../components/loginComponent/saasRegisteredH5/RegisteredH5Component';

function RegisteredH5Page({dispatch, saas_registered_h5}) {

    let {

		codeDisabled,
		codeStateString,
		touchCode,
		submitSuccess,
		richText,
		schoolTypeArr,
        formConfiguration,
        formList,

    } = saas_registered_h5;


	function dp(name, param) {
		dispatch({
			type : `saas_registered_h5/${name}`,
			payload : {
				...param
			}
		})
	}
	let props = {
		dp,
		codeDisabled,
		codeStateString,
		touchCode,
		submitSuccess,
		richText,
		schoolTypeArr,
        formConfiguration,
        formList,
	}

    return (
		<RegisteredH5Component {...props} />
    );
}


function mapStateToProps({ saas_registered_h5 }) {
  return { saas_registered_h5 };
}

export default connect(mapStateToProps)(RegisteredH5Page);
