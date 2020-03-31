/**
 * 口碑
 * 校验是否订阅了
 * @author yujq
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

class KoubeiAuthValidate extends React.Component {

    state = {
        qrcodeUrl : '', //二维码的url
        hrefUrl : '',//点击超链接的url
        qrcodeType : '',//二维码类型

        authTimer: undefined, //刷新校验
    }

    componentDidMount() {
        let me = this;
		serviceRequest(BASE_URL+'/systemController/queryAlipayBuyRecord', {signType : this.props.signType || ''},
			function(ret) {

			}, function(ret) {
				let authStatus = ret.data.authStatus || '';
				let alipayAuthUrl = ret.data.alipayAuthUrl || '';

//				me.beginScanAuth();   //定时请求 是否完成订阅
				me.setState({
					qrcodeType : authStatus,
                    qrcodeUrl: alipayAuthUrl,
                    hrefUrl: alipayAuthUrl,
				});

                me.props.dispatch && me.props.dispatch(routerRedux.push({
                    pathname: 'koubei_auth_qrcode',
                    query: {
                        authStatus,alipayAuthUrl,
                    }
                }));
			}
		);
    }

    beginScanAuth() {
    	let me = this;
    	this.state.authTimer = setInterval(function(){
			me.scanAuth();
		},5000);
    }

    scanAuth() {
    	let me = this;
		serviceRequest(BASE_URL+'/systemController/queryAlipaySignState', {signType : this.props.signType || ''},
			function(ret) {
				if(ret.data.signStatus == 'VALID') {
					clearInterval(me.state.authTimer);
				}
			}
		);
    }

    render() {
        return (<div style={{display: 'none'}}></div>);
    }
}


function mapStateToProps({ koubeiAuthValidateModel }) {
  return { koubeiAuthValidateModel };
}

export default connect(mapStateToProps)(KoubeiAuthValidate);
