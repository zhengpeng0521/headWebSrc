/**
 * 口碑 门店和 saas机构的映射关系
 * @author yujq
 */

import React from 'react';
import {Modal, Button, message, Steps, Tabs, Input, Popconfirm, } from 'antd';
import TweenOne from 'rc-tween-one';

const Step = Steps.Step;
const TabPane = Tabs.TabPane;

import style from './KoubeiOrgMap.less';

const KoubeiOrgMap = React.createClass({
	getInitialState() {
        let {initStep} = this.props.location.query;
        let initCurrentStep = (initStep == undefined || initStep == '' || initStep == '0') ? 0 : 1;//初始展示的步骤
		return {
			currentStep: initCurrentStep,
            submitBtnLoading: false,

            verifyCode: '',
            tenantId: '',
            tenantList: [],     //租户列表
            saasOrgList: [],    //saas机构列表
            koubeiOrgList: [],  //口碑门店列表
            initOrgMap: [],         //初始的机构门店映射关系
            orgMap: [],         //机构门店映射关系

            animation_one_moment: 0,
            animation_one_paused: true,
            animation_one_initY: 0,
            animation_one_info: {},
            animation_two_moment: 0,
            animation_two_paused: true,
            animation_two_initY: 0,
            animation_two_info: {},
		}
	},

    componentDidMount() {
        this.queryTenantList();
        if(this.state.currentStep == 1) {
            this.initOrgData();
        }
    },

    //初始化
    initOrgData() {
        let me = this;

        let saasOrgList = [];
        let koubeiOrgList = [];
        let initOrgMap = [];
        //查询租户下 的机构列表
        serviceRequest(BASE_URL+'/tenantMappingController/queryTenantOrgList', {funcKey: 'free-func', },
			function(ret) {
                let results = ret.results || [];
                results && results.length > 0 && results.map(function(item) {
                    saasOrgList.push({
                        orgId: item.id,
                        orgName: item.orgName,
                    });
                });
                me.setState({
                    saasOrgList
                });

                //查询商户下 的门店列表
                serviceRequest(BASE_URL+'/tenantMappingController/queryMerchantShop', {funcKey: 'free-func', },
                    function(ret) {
                        let results = ret.data.shopList || [];

                        results && results.length > 0 && results.map(function(item) {
                            koubeiOrgList.push({
                                shopId: item.shopId,
                                shopName: item.name,
                            });
                        });
                        me.setState({
                            koubeiOrgList
                        });

                        //查询机构映射关系
                        serviceRequest(BASE_URL+'/tenantMappingController/queryOrgMapping', {funcKey: 'free-func', type: '101'},
                            function(ret) {
                                let orgMap = ret.results;

                                orgMap && orgMap.length > 0 && orgMap.map(function(item) {
                                    let orgId = item.orgId;
                                    let shopId = item.shopId;
                                    let orgName = '';
                                    let shopName = '';

                                    saasOrgList && saasOrgList.length > 0 && saasOrgList.map(function(saasOrgItem) {
                                        if(saasOrgItem.orgId == orgId) {
                                            orgName = saasOrgItem.orgName
                                        }
                                    });

                                    koubeiOrgList && koubeiOrgList.length > 0 && koubeiOrgList.map(function(koubeiOrgItem) {
                                        if(koubeiOrgItem.shopId == shopId) {
                                            shopName = koubeiOrgItem.shopName
                                        }
                                    });

                                    initOrgMap.push({
                                        orgId,orgName,shopId,shopName,
                                    });
                                });
                                me.setState({
                                    initOrgMap
                                });
                            }
                        );
                    }
                );
			}
		);
    },

    //查询租户列表
    queryTenantList(keyWord) {
        let me = this;
        serviceRequest(BASE_URL+'/tenantMappingController/querySimilarTenant', {funcKey: 'free-func', keyWord, },
			function(ret) {
				me.setState({
					tenantList : ret.results
				});
			}
		);
    },

	changeStep(step) {
        let newStep = this.state.currentStep + step||0;
		this.setState({
			currentStep: newStep
		});
        if(newStep == 1) {
            //进入步骤二, 检索机构和门店数据
            this.initOrgData();
        }
	},

    veryCodeChange(event) {
        this.setState({
            verifyCode: event.target.value,
        });
    },

    //确认选择了商户后，向安全手机账号发送验证码
    confirmSelectTenant(tenantId) {
        let me = this;
        serviceRequest(BASE_URL+'/tenantMappingController/sendTenantMsg', {funcKey: 'free-func', tenantId, },
			function(ret) {
                me.setState({
                    tenantId,
                });
				Modal.confirm({
                    title: '请输入验证码',
                    content: (<div><Input placeholder="请输入验证码" onChange={me.veryCodeChange}/></div>),
                    onOk() {
                        me.validateVeryCodeAndNext();
                    },
                    onCancel() {
                        me.setState({
                            tenantId: '',
                            verifyCode: '',
                        });
                    },
                });
			}
		);
    },

    //校验验证码 如果正确进入下一步
    validateVeryCodeAndNext() {
        let me = this;
        let {tenantId, verifyCode } = this.state;
        serviceRequest(BASE_URL+'/tenantMappingController/createTenantMapping', {funcKey: 'free-func', tenantId, verifyCode },
			function(ret) {
				me.changeStep(1);
			}
		);
    },

    //没有找到商户，创建新的商户
    createTenant() {
        let me = this;
        serviceRequest(BASE_URL+'/tenantMappingController/createNewTenantMapping', {funcKey: 'free-func',},
			function(ret) {
				me.changeStep(1);
			}
		);
    },

    //租户机构的动画
    animationOneStart(info, event) {
        let initY = event.clientY - 158;
        this.setState({
            animation_one_initY: initY,
            animation_one_paused: false,
            animation_one_moment: 0,
            animation_one_info: info,
        }, ()=> {
            this.setState({
                animation_one_moment: null
            });
        });

    },

    //商户门店的动画
    animationTwoStart(info, event) {
        let initY = event.clientY - 158;
        this.setState({
            animation_two_initY: initY,
            animation_two_paused: false,
            animation_two_moment: 0,
            animation_two_info: info,
        }, ()=> {
            this.setState({
                animation_two_moment: null
            });
        });

    },

    //取消绑定
    clearMapOrg() {
        this.setState({
            animation_one_info: {},
            animation_two_info: {},
        });
    },

    //添加机构绑定
    addOrgMap() {
        let {orgMap, animation_one_info, animation_two_info, } = this.state;
        orgMap.push({
            orgId: animation_one_info.orgId || '',
            orgName: animation_one_info.orgName || '',
            shopId: animation_two_info.shopId || '',
            shopName: animation_two_info.shopName || '',
        });
        this.setState({
            orgMap,
            animation_one_info: {},
            animation_two_info: {},
        });
        message.success('绑定成功');
    },

    //已绑定的门店解除绑定
    deleteMap(info) {
        let {orgMap} = this.state;
        let newOrgMap = [];
        orgMap && orgMap.length > 0 && orgMap.map(function(item) {
            if(!(item.orgId == info.orgId && item.shopId == info.shopId)) {
                newOrgMap.push(item);
            }
        });
        this.setState({
            orgMap: newOrgMap,
        });
        message.success('解除绑定成功');
    },

    //提交门店绑定结构
    submitOrgMap() {
        let me = this;
        let {orgMap} = this.state;
        if(orgMap && orgMap.length > 0) {
            this.setState({
                submitBtnLoading: true,
            });

            serviceRequest(BASE_URL+'/tenantMappingController/bindShop', {funcKey: 'free-func', bindShopStr: JSON.stringify(orgMap)},
                function(ret) {
                    message.success('门店绑定成功');
                    window.location = BASE_URL;
                }, function(ret) {
                    message.error(ret.errorMessage||'服务端开小差啦');
                    me.setState({
                        submitBtnLoading: false,
                    });
                }
            );
        } else {
            message.warn('没有新增的门店绑定关系');
        }
    },

	render() {
        let me = this;

        let {tenantList,saasOrgList,koubeiOrgList,orgMap, initOrgMap, animation_one_info, animation_two_info,} = this.state;

        let animation_one_animation = [
            {left: '0', top: this.state.animation_one_initY + 'px', scale: '0.3', duration: 0, },
            { left: '347px', top: '65px', scale: '1.0', duration: 1000, },
        ];
        let animation_two_animation = [
            {left: '465', top: this.state.animation_two_initY + 'px', scale: '0.3', duration: 0, },
            { left: '347px', top: '133px', scale: '1.0', duration: 1000, },
        ];

		return(
				<div className={style.koubei_org_map_cont}>
					<div className={style.header_step}>
						<Steps current={this.state.currentStep}>
							<Step key="0" title="关联商户" status={this.state.currentStep == 0 ? 'process' : 'finish'} />
							<Step key="1" title="映射门店" status={this.state.currentStep == 1 ? 'process' : 'wait'} />
						</Steps>
					</div>

					<div className={style.koubei_org_map_content}>
						<Tabs activeKey={'' + this.state.currentStep} className="koubei_org_map_tab">
							<TabPane tab="" key="0">
								<div>
									<div className={style.tenant_list_cont}>
									    {!!(tenantList == undefined || tenantList.length == 0) && (
                                            <div className={style.empty_list_data}>这里没有数据</div>
                                        )}
									    {tenantList && tenantList.length > 0 && tenantList.map(function(item) {
                                            let confirm_msg = '确定向该商户的安全手机' + item.tel +'发送验证码吗?';
                                            return (
                                                <Popconfirm
                                                    key={'tenant_item_popconfirm_' + item.id}
                                                    placement="topLeft"
                                                    title={confirm_msg}
                                                    onConfirm={()=>me.confirmSelectTenant(item.id)}
                                                    okText="确定"
                                                    cancelText="取消">
                                                    <div className={style.tenant_item}>{item.name}</div>
                                                </Popconfirm>
                                            );
                                        })}

									</div>

									<div className={style.tenant_list_bar}>
                                        {!!false &&
                                        <div className={style.more_tenant_bar}>
                                            <Input className={style.more_tenant_word} placeholder="请输入查询商户的关键字或者联系方式" />
                                            <Button type="ghost" icon="search">查 询</Button>
										</div>
                                        }

									    <div className={style.create_tenant_bar}>
                                            <p className={style.create_tenant_msg}>没有找到?</p>
                                            <Button type="primary" onClick={this.createTenant}>新 建</Button>
										</div>

									</div>
								</div>
							</TabPane>
							<TabPane tab="" key="1">
								<div>
									<div className={style.org_map_content}>

                                        <div className={style.mapping_org_cont}>

                                            <div className={style.mapping_saas_org_cont}>
                                                <div className={style.title_cont}>
                                                    <div className={style.title}>选择机构</div>
                                                </div>
                                               <div className={style.mapping_saas_org_content}>
                                                {saasOrgList && saasOrgList.length > 0 && saasOrgList.map(function(item) {
                                                    if(animation_one_info && animation_one_info.orgId && animation_one_info.orgId != '' && animation_one_info.orgId == item.orgId) {
                                                        return null;
                                                    }
                                                    if(orgMap && orgMap.length > 0) {
                                                        for(let i = 0; i < orgMap.length; i++) {
                                                            let orgMapItem = orgMap[i];
                                                            if(orgMapItem.orgId && orgMapItem.orgId == item.orgId) {
                                                                return null;
                                                            }
                                                        }
                                                    }
													if(initOrgMap && initOrgMap.length > 0) {
                                                        for(let i = 0; i < initOrgMap.length; i++) {
                                                            let initOrgMapItem = initOrgMap[i];
                                                            if(initOrgMapItem.orgId && initOrgMapItem.orgId == item.orgId) {
                                                                return null;
                                                            }
                                                        }
                                                    }
                                                    return (
                                                        <div
                                                           className={style.saas_org_item}
                                                           title={item.orgName}
                                                           onClick={(e)=> {me.animationOneStart(item, e)}} >
                                                            {item.orgName}
                                                        </div>
                                                    );
                                                })}
                                                </div>
                                            </div>

                                            <div className={style.mapping_org_bar}>
                                                <TweenOne
                                                    animation={animation_one_animation}
                                                    paused={this.state.animation_one_paused}
                                                    moment={this.state.animation_one_moment}
                                                    style={{
                                                        top: this.state.animation_one_initY,
                                                        display: animation_one_info.orgId && animation_one_info.orgId != '' ? 'block' : 'none'
                                                    }}
                                                    className={style.animation_one_show_component}
                                                    title={animation_one_info.orgName || '未知机构'}
                                                >{animation_one_info.orgName || '未知机构'}</TweenOne>
                                                     <div className={style.maping_maped_box_one} ></div>
                                                     <div className={style.maping_maped_icon} title="取消绑定" onClick={this.clearMapOrg}></div>
                                                     <div className={style.maping_maped_box_two} ></div>
                                                  <TweenOne
                                                    animation={animation_two_animation}
                                                    paused={this.state.animation_two_paused}
                                                    moment={this.state.animation_two_moment}
                                                    style={{
                                                        top: this.state.animation_two_initY,
                                                        display: animation_two_info.shopId && animation_two_info.shopId != '' ? 'block' : 'none'
                                                    }}
                                                    className={style.animation_two_show_component}
                                                    title={animation_two_info.shopName || '未知门店'}
                                                >{animation_two_info.shopName || '未知门店'}</TweenOne>
                                                <Button
                                                    type="primary"
                                                    className={style.mapping_btn}
                                                    disabled={
                                                        !(this.state.animation_two_info.shopId && this.state.animation_two_info.shopId != '')
                                                    }
                                                    onClick={this.addOrgMap}
                                                > 绑 定 </Button>
                                            </div>

                                            <div className={style.mapping_koubei_org_cont}>
                                                <div className={style.title_cont}>
                                                    <div className={style.title}>匹配门店</div>
                                                </div>
                                               <div className={style.mapping_koubei_org_content}>
                                                {koubeiOrgList && koubeiOrgList.length > 0 && koubeiOrgList.map(function(item) {
                                                    if(animation_two_info && animation_two_info.shopId && animation_two_info.shopId != '' && animation_two_info.shopId == item.shopId) {
                                                        return null;
                                                    }
                                                    if(orgMap && orgMap.length > 0) {
                                                        for(let i = 0; i < orgMap.length; i++) {
                                                            let orgMapItem = orgMap[i];
                                                            if(orgMapItem.shopId && orgMapItem.shopId == item.shopId) {
                                                                return null;
                                                            }
                                                        }
                                                    }
													if(initOrgMap && initOrgMap.length > 0) {
                                                        for(let i = 0; i < initOrgMap.length; i++) {
                                                            let initOrgMapItem = initOrgMap[i];
                                                            if(initOrgMapItem.shopId && initOrgMapItem.shopId == item.shopId) {
                                                                return null;
                                                            }
                                                        }
                                                    }
                                                    return (
                                                        <div
                                                           className={style.koubei_org_item}
                                                           title={item.shopName}
                                                           onClick={(e)=> {me.animationTwoStart(item, e)}} >
                                                            {item.shopName}
                                                        </div>
                                                    );
                                                })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={style.maped_org_cont}>
                                            <div className={style.title_cont}>
                                                <div className={style.title}>绑定结果</div>
                                            </div>
                                            <div className={style.maped_org_content}>
                                                {!!(initOrgMap == undefined || initOrgMap.length == 0 && orgMap == undefined || orgMap.length == 0) && (
                                                    <div className={style.empty_list_data}>这里没有数据</div>
                                                )}

                                            {initOrgMap && initOrgMap.length > 0 && initOrgMap.map(function(item) {
                                                return (
                                                    <div className={style.maped_org_item}>
                                                        <div className={style.maped_org_item_saas} title={item.orgName}>{item.orgName}</div>
                                                        <div className={style.maped_icon} title="解除绑定" style={{display: 'none'}}></div>
                                                        <div className={style.maped_org_item_koubei} title={item.shopName}>{item.shopName}</div>
                                                    </div>
                                                );
                                            })}
                                            {orgMap && orgMap.length > 0 && orgMap.map(function(item) {
                                                return (
                                                    <div className={style.maped_org_item}>
                                                        <div className={style.maped_org_item_saas} title={item.orgName}>{item.orgName || '新建机构'}</div>
                                                        <div className={style.maped_icon} title="解除绑定" onClick={()=>{me.deleteMap(item)}}></div>
                                                        <div className={style.maped_org_item_koubei} title={item.shopName}>{item.shopName}</div>
                                                    </div>
                                                );
                                            })}
                                            </div>
                                        </div>
                                    </div>

                                     <div className={style.map_org_bar}>
                                        {!!false &&
                                        <Button type="ghost" onClick={()=>{this.changeStep(-1)}} className={style.map_org_bar_btn}>上一步</Button>
                                        }
                                         <Button type="primary" onClick={this.submitOrgMap} disabled={this.state.submitBtnLoading} loading={this.state.submitBtnLoading}>提 交</Button>
                                     </div>
								</div>
							</TabPane>
						</Tabs>
					</div>
				</div>
		);
	},
});

export default KoubeiOrgMap;
