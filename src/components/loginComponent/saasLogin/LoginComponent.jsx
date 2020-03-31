import React from 'react';
import styles from './LoginComponent.less';
import {Input,message,Icon,Modal, Spin, Form} from 'antd';
import AccountActivePage from '../../../pages/login/login-page/AccountActivePage';

function LoginComponent ({

	dp,
    initData,       //window._init_data
	loginAccount,
	loginPassword,
	tenantList,
	showTenantModal,

}) {

	//账号
	function updateLoginAccount(e) {
		dp('updateState', {loginAccount : e.target.value});
	}

	//密码
	function updateLoginPassword(e) {
		dp('updateState', {loginPassword : e.target.value})
	}

	//注册
	function registered() {
		window.location.href = window.BASE_URL + '/orgApplyController/redirectPage/3';
	}

	//忘记密码
	function forgotPassword() {
		window.location.href = window.BASE_URL + '/orgApplyController/reSetPassWord?tenantId=' + initData.tenantId;
	}

	//提交
	function onLoginSubmit(item) {
		if(loginAccount != null && loginAccount != undefined && loginAccount!= '') {
			if(loginPassword != null && loginPassword != undefined && loginPassword != '') {
                if(!!initData && !!initData.tenantId){
                    dp('login', {mobile : loginAccount, password : loginPassword, tenantId : initData.tenantId});
                }else if(item != undefined) {
					dp('login', {mobile : loginAccount, password : loginPassword, tenantId : item.tenantId});
				} else {
					dp('login', {mobile : loginAccount, password : loginPassword});
				}
			} else {
				return message.error('请输入密码');
			}
		} else {
			return message.error('请输入账号');
		}
	}

	//取消选择商户
	function onCancelModal() {
		dp('updateState', {showTenantModal : !showTenantModal});
	}

    let logoImg = initData && !!initData.logoImg ? initData.logoImg : 'https://img.ishanshan.com/gimg/img/f204fd8affff8cdb30b68554143ef4f5';
    let brandName = initData && !!initData.brandName ? initData.brandName : '闪闪管家';

	return  (
		<div className="saas_login">
			<Form name='login_form' action='' method='post'>
				<Input type='hidden' name='_eventId' value={'submit'} />
				<Input type='hidden' name='lt' value={window._init_data.loginTicket} />
				<Input type='hidden' name='execution' value={window._init_data.flowExecutionKey} />
				<Input type='hidden' name='username' value={loginAccount} />
				<Input type='hidden' name='password' value={loginPassword} />
				<Input type='hidden' name='tenantId' value='' />
				<div className={styles.saas_login_box}>
					{/*
						<img className={styles.angle} useMap="#angle" src="https://img.ishanshan.com/gimg/img/04949ffae6d0c07a0502dfb36447851d" />
						<map name="angle" id="angle">
							<area shape="poly" coords="0, 0, 120, 120, 120, 0" target="_blank" href="http://mp.weixin.qq.com/s/6Hq_3nuQX_QPqm8MSOmWEg" alt="版本详情" />
						</map>
					*/}
					<img className={styles.common_logo} src = { logoImg }></img>
					<p className={styles.common_company}>{ brandName }</p>
					<div className={styles.common_company_info}>一站式早教管理云平台</div>
					<div className={styles.saas_login_input_user}>
						<Input
							type="phone"
							placeholder="请输入手机号码"
							addonBefore={<Icon type="user1" style={{color: '#5d9cec', marginLeft : '2px'}} />}
							className={styles.saas_login_input}
							value={loginAccount}
							onChange={updateLoginAccount}
						/>
					</div>
					<div className={styles.saas_login_input_pasword}>
						<Input type="password"
							placeholder="请输入密码"
							addonBefore={<Icon type="suo" style={{color: '#5d9cec', marginLeft : '2px'}} />}
							className={styles.saas_login_input}
							value={loginPassword}
							onChange={updateLoginPassword}
							onPressEnter={onLoginSubmit}
						/>
					</div>
					<div className={styles.saas_login} onClick={() => onLoginSubmit()}>登录</div>
					<div className={styles.saas_registered_forgot}>
						{ !!initData && !!initData.tenantId ? null : <div className={styles.saas_registered} onClick={() => registered()}>申请注册</div> }
						<div className={styles.saas_forgot_password} onClick={() => forgotPassword()}>忘记密码</div>
					</div>
				</div>

				<AccountActivePage />
				<Modal
					title="选择要登录的商户"
					visible={showTenantModal}
					maskClosable={false}
					closable={true}
					style={{top: '20vh'}}
					width={380}
					footer={null}
					onCancel={onCancelModal}>

					<div className={styles.login_tenant_select_cont}>
					{tenantList && tenantList.map(function(item, index) {
							return (
							<div className={styles.login_tenant_select_item} key={'login_tenant_select_item_'+index}>
								<div className={styles.tenant_select_item_name} title={item.tenantName} onClick={()=>onLoginSubmit(item)}>{item.tenantName}</div>
								{!!(item.activeStatus == '1') && <div className={styles.tenant_select_item_status_active}>已激活</div>}
								{!!(item.activeStatus == '0') && <div className={styles.tenant_select_item_status_noactive}>未激活</div>}
							</div>);
						})}
					</div>
				</Modal>
			</Form>
			{/*<div className={styles.guide}></div>*/}
		</div>
	)
}

export default LoginComponent;
