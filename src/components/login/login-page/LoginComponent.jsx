import React from 'react';
import styles from './LoginComponent.less';
import { Link } from 'dva/router';
import {Modal,Input,Icon,Button,Alert,message,Spin,} from 'antd';
import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import {TweenOne,TweenOneGroup} from 'rc-tween-one';
import QRCode from 'qrcode.react';
import AccountActivePage from '../../../pages/login/login-page/AccountActivePage';

const Element = BannerAnim.Element;

function LoginComponent ({
    loginType,
    loginModalVisible,
    onLoginSubmit,
    loading,
    errMsg,
    tenantSeelctVisible,
    tenantList,
    tenantSelect,
    OpenFreeTrailModal,             //打开免费试用表单
    OpenPasswordRecoveryModal,      //打开密码重置表单

    closeTenantSelect,//关闭租户选择
}) {

    let loginPageHandelProps = {
        loginType,
        onLoginSubmit,
        loading,
        errMsg,
        OpenFreeTrailModal,             //打开免费试用表单
        OpenPasswordRecoveryModal,      //打开密码重置表单
    };

    return (
        <div className={styles.login_page_content} >
            <div className={styles.login_page_bg}
                style={{
                    background: 'url(https://img.ishanshan.com/gimg/img/5b9666978f13563af11c5d7d801c906f) no-repeat', backgroundSize: 'cover'
                }}
            ></div>
            <div className={styles.login_page_cont}>
                <Modal
                    title={null}
                    visible={loginModalVisible}
                    maskClosable={false}
                    closable={false}
                    style={{top: '25vh', right: '-25vw'}}
                    width={350}
                    wrapClassName="common_login_wrap_cont"
                    className="common_login_handel_modal"
                    footer={null}>
                    <Spin tip="正在登陆..." spinning={loading}>
                        <LoginPageHandel {...loginPageHandelProps} />
                    </Spin>
                </Modal>
            </div>
            <div className={styles.foot_content}>
                <div className={styles.foot_text}>杭州闪宝科技有限公司  浙ICP备1501166号-1</div>
                <div className={styles.foot_text}>联系方式： 0571-56000069      联系地址： 杭州市滨江区海威大厦18F</div>
            </div>
            <LoginTenantSelect loading={loading} visible={tenantSeelctVisible} tenantList={tenantList} tenantSelect={tenantSelect} closeTenantSelect={closeTenantSelect}/>
            <AccountActivePage />
        </div>
    );
}


/*登陆页登陆选项卡*/
const LoginPageHandel = React.createClass({
    getInitialState() {
        return {
            loginAccount: undefined,
            loginPassword: undefined,

            logoImgUrl: 'https://img.ishanshan.com/gimg/img/baa997d48c3f4378c3855ecb0555119b',
            logoAnimPaused: true,
        };
    },

    componentWillReceiveProps(nextProps) {
          if(this.props.loginType != nextProps.loginType) {
              let animNum = 0;
              if(loginType == 'account_login') {
                  animNum = 0;
              } else if(loginType == 'qrcode_login') {
                  animNum = 1;
              }
              this.refs.login_handel_anim.slickGoTo(animNum);
          }
    },

    changeLoginType(loginType) {
//        message.warn('暂不支持二维码登陆');
//        return;
        let animNum = 0;
        if(loginType == 'account_login') {
            animNum = 0;
        } else if(loginType == 'qrcode_login') {
            animNum = 1;
        }
        this.refs.login_handel_anim.slickGoTo(animNum);
    },

    updateLoginAccount(e) {
        this.setState({
            loginAccount: e.target.value,
        });
    },

    onLoginSubmit() {
        this.props.onLoginSubmit && this.props.onLoginSubmit(this.state.loginAccount, this.state.loginPassword);
    },

    updateLoginPassword(e) {
        this.setState({
            loginPassword: e.target.value,
        });
    },

    render() {
        let logoAnimation = { rotate: 360, repeat: -1, duration: 1000 };
        return (
            <div className={styles.login_handel_content}>
                <BannerAnim
                  prefixCls='login_handel_content_wrapper'
                  sync
                  type="across"
                  duration={1000}
                  arrow={false}
                  thumb={false}
                  ease="easeInOutExpo"
                  dragPlay={false}
                  autoPlay={false}
                  initShow={this.props.loginType == 'account_login' ? 0 : 1}
                  ref='login_handel_anim'
                >
                    <Element key="account_login" hideProps>
                        <QueueAnim type="bottom" duration={500} delay={[500, 0]} key="account_login_cont">
                          <div key="logo_and_logintype" className={styles.logo_and_logintype}>
                              <div className={styles.login_handel_logintype}
                                  style={{
                                    background: 'url(https://img.ishanshan.com/gimg/img/4401f14fd97f2252248a7f0b69e36534) no-repeat', backgroundSize: 'contain'
                                  }}
                                  onClick={()=>this.changeLoginType('qrcode_login')}
                              ></div>
                          </div>

                          <div key="logo_text_one" className={styles.logo_text_one}>
                              闪闪管家
                          </div>
                          <div key="logo_text_two" className={styles.logo_text_two}>
                              一站式早教管理云平台
                          </div>

                          <div key="login_account_cont" className={styles.login_account_cont}>
                              <Input
                                placeholder="请输入手机号码"
                                addonBefore={<Icon type="user" style={{color: '#5D9CEC'}} />}
                                className={styles.login_input}
                                value={this.state.loginAccount}
                                onChange={this.updateLoginAccount}
                              />
                          </div>

                          <div key="login_password_cont" className={styles.login_password_cont}>
                              <Input type="password"
                                placeholder="请输入密码"
                                addonBefore={<Icon type="unlock" style={{color: '#5D9CEC'}} />}
                                className={styles.login_input}
                                value={this.state.loginPassword}
                                onChange={this.updateLoginPassword}
                                onPressEnter={()=>this.onLoginSubmit()}
                              />
                          </div>

                          <div key="login_submit_cont" className={styles.login_submit_cont}>
                              <Button className={styles.login_submit_btn} loading={this.props.loading} onClick={()=>this.onLoginSubmit()}>{this.props.loading?'正在登陆...' : '登 陆'}</Button>
                          </div>

                          <div key="login_bar_cont" className={styles.login_bar_cont}>
                              <span className={styles.forget_password_bar_btn} onClick={this.props.OpenPasswordRecoveryModal}>忘记密码</span>
                              <span className={styles.regist_bar_btn} onClick={this.props.OpenFreeTrailModal}>申请注册</span>
                          </div>
                        </QueueAnim>
                    </Element>
                    <Element key="qrcode_login" hideProps>
                        <QueueAnim type="bottom" duration={500} delay={[500, 0]} key="qrcode_login_cont">
                          <div key="logo_and_logintype" className={styles.logo_and_logintype}>

                              <div className={styles.login_handel_logintype}
                                  style={{
                                    background: 'url(https://img.ishanshan.com/gimg/img/b2bcf3e9c030303f03526ec2bfcb2e3a) no-repeat', backgroundSize: 'contain'
                                  }}
                                  onClick={()=>this.changeLoginType('account_login')}
                              >
                                  <div className={styles.account_login_tip}></div>
                              </div>
                          </div>

                          <div key="logo_text_one" className={styles.logo_text_one}>
                              闪闪管家
                          </div>
                          <div key="logo_text_two" className={styles.logo_text_two}>
                              一站式早教管理云平台
                          </div>

                          <div key="login_qrcode_cont" className={styles.login_qrcode_cont}>
                              <QRCode key="login_qrcode"
                                  value={'http://192.168.1.22:8989'}
                                  size={142}
                                  level="M"
                              />
                          </div>

                          <div key="login_qrcode_text" className={styles.login_qrcode_text}>
                              下载<span className={styles.app_url}>闪闪管家APP</span>扫描二维码, 安全登陆
                          </div>

                          <div key="login_bar_cont" className={styles.login_bar_cont}>
                              <span className={styles.regist_bar_btn}>注册新账号</span>
                          </div>
                        </QueueAnim>
                    </Element>
                </BannerAnim>
            </div>
        );
    },
});

/*登陆时  多租户选择界面*/
function LoginTenantSelect ({loading,visible,tenantList,tenantSelect,closeTenantSelect,}) {

    return (
        <Modal
            title="选择要登录的商户"
            visible={visible}
            maskClosable={false}
            closable={true}
            onClose={closeTenantSelect}
            style={{top: '20vh'}}
            width={380}
            footer={null}>

            <div className={styles.login_tenant_select_cont}>
              <Spin tip="正在登陆..." spinning={loading}>
               {tenantList && tenantList.map(function(item, index) {
                    return (
                    <div className={styles.login_tenant_select_item} key={'login_tenant_select_item_'+index}>
                        <div className={styles.tenant_select_item_name} title={item.tenantName} onClick={()=>tenantSelect(item)}>{item.tenantName}</div>
                        {!!(item.activeStatus == '1') && <div className={styles.tenant_select_item_status_active}>已激活</div>}
                        {!!(item.activeStatus == '0') && <div className={styles.tenant_select_item_status_noactive}>未激活</div>}
                    </div>);
                })}
                </Spin>
            </div>

        </Modal>
    );
}

export default LoginComponent;
