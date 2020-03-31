import React from 'react';
import styles from './IndexLayoutComponent.less';
import { Layout, Menu, Icon, Tooltip, Dropdown, Popover,Input,Button, Radio } from 'antd';
const { Header, Sider, Content } = Layout;
import InitGuidePage from '../../../pages/common/init-guide/InitGuidePage';
import VersionInfo from '../../common/version-info/VersionInfo';
const Search = Input.Search;
const RadioGroup = Radio.Group;
/*
 * 布局文件
 */
function IndexLayoutComponent({
    routes,
    children,
    applicationList,
    currentApplication,
    changeApplication,
    orgInfo,                    //机构信息
    userMsg,                    //用户信息
    ChangePassWord,             //点击修改密码

	versionInfoVisible,
	versionInfo,
    changeVersionInfoVisible,

    switchVisible, // 切换校区显示
    campusList, // 校区列表
    selectedCampus, // 选中的校区id
    filterKey, // 过滤关键字
    cancelSelectCampus, // 取消切换校区
    switchChange,
    selectCampusChange, // 选中某个校区改变
    searchChange, // 搜索过滤字段
    confirmCampus, // 确定选择的校区
    setDefaultOrg  // 设置默认校区
  }) {
    function orgSelectChange(e) {
        searchChange(e.target.value)
    }
    function radioChange(e) {
        selectCampusChange(e.target.value)
    }

    function hqRender(){
        return campusList.map((item,index) => {
            let node_show = item.orgName.includes(filterKey);
            if (item.type == '1'){
                return (
                    <div key={'hq_'+index} className={node_show ? styles.orgItem : styles.hidden_tree_node}>
                        <Radio value={item.userId}>
                            <span className={styles.orgName}>{item.orgName}</span>
                        </Radio>
                        {
                            window._init_data && window._init_data.orgId == item.orgId && node_show?

                                <div className={styles.default} onClick={setDefaultOrg}>
                                    <Popover placement="right" content='设置默认登录页' trigger="hover">
                                         <img src="https://img.ishanshan.com/gimg/n/20190726/a5e96434da0a63aa31a0aa9eb9661b9d" />
                                    </Popover>
                                </div>
                            :
                            null
                        }
                    </div>
                )
            }
        });
    };
    function orgRender(){
        return campusList.map((item,index) => {
            let node_show = item.orgName.includes(filterKey);
            if (item.type == '2'){
                return (
                    <div key={'org_'+index} className={node_show ? styles.orgItem : styles.hidden_tree_node}>
                        <Radio value={item.userId}>
                            <span className={styles.orgName}>{item.orgName}</span>
                        </Radio>
                        {
                            window._init_data && window._init_data.orgId == item.orgId && node_show?
                            <div className={styles.default} onClick={setDefaultOrg}>
                                <Popover placement="right" content='设置默认登录页' trigger="hover">
                                    <img src="https://img.ishanshan.com/gimg/n/20190726/a5e96434da0a63aa31a0aa9eb9661b9d" />
                                </Popover>
                            </div>
                            :
                            null
                        }
                    </div>
                )
            }
        });
    };
    let user_drap_menu = (
        <Menu theme = "dark" className={styles.user_drap_menu}>
            <Menu.Item key = 'update_password'>
                <a href = "javascript:void(0)" className={styles.top_user_drap_menu_text} onClick = { ChangePassWord }>修改密码</a>
            </Menu.Item>
            <Menu.Item key = 'logout'>
                <a href = { BASE_URL + '/logout/' } target = "_self" className={styles.top_user_drap_menu_text}>注销</a>
            </Menu.Item>
        </Menu>
    );
    let connect_popover = (
        <div className={styles.connect_popover_cont}>
            <img className={styles.connect_popover_img} src='https://img.ishanshan.com/gimg/img/8ecc02e518214f49736de1fb4fe91fb5'/>
        </div>
    );
    /* 切换校区 */
    let switchCampusContent = (
        <div className={styles.connect_popover_cont}>
	  		<Search
                placeholder="请输入要查询的校区"
                className={styles.org_select_input}
                onChange={orgSelectChange}
                style={{width: '270px'}}
            />
            <div className={styles.orgList}>
                <RadioGroup onChange={radioChange} value={selectedCampus}>
                    <div className={styles.title}>总部</div>
                    {hqRender()}
                    <div className={styles.title}>校区</div>
                    {orgRender()}
                </RadioGroup>
            </div>
            <div className={styles.footer}>
                <Button style={{marginRight:'10px'}} onClick={cancelSelectCampus}>取消</Button>
                <Button type='primary' onClick={confirmCampus}>确定</Button>
            </div>
	  	</div>
    );
   	function qqTalk() {
        window.open('http://wpa.qq.com/msgrd?v=3&uin=3519232593&site=qq&menu=yes', '_blank', 'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
    }
    //是否是番茄田系统
    let isTomato =  window.runAs=='tomato' ? true : false;
    return (
        <Layout className={styles.main_layout_cont}>
			<InitGuidePage/>

            {!isTomato ? <Header className={styles.main_layout_header}>
                <div className={styles.main_layout_header_left}>
                    <img src = { !!orgInfo && !!orgInfo.imgurl ? orgInfo.imgurl : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223' } className={styles.org_logo_img_cont}/>
                    {/* <span className = { styles.org_logo_name_cont }>{ orgInfo.orgName || '' }</span> */}
                </div>

                <div className={styles.main_layout_header_right}>
                
	                <div className={styles.main_layout_header_right_item}>
			            {!!false && <Icon type="phone" className={styles.btn_a_icon} />}
			            <div className={styles.btn_a_text} id="BDBridgeFixedWrap" title="在线客服"></div>
			          </div>
		          
		            <div className={styles.main_layout_header_right_item_split}></div>

                    <div className={styles.main_layout_header_right_item}>
                        <span className = { styles.org_logo_name_cont }>{ orgInfo.orgName || '' }</span>
                        <Popover
                            content= {switchCampusContent}
                            trigger="click"
                            placement="bottomLeft"
                            visible={switchVisible}
                            // onVisibleChange={switchChange}
                            overlayClassName={styles.switch_org}
                        >
                            <span className = { styles.org_switch_cont } onClick={switchChange}>切换校区</span>
                        </Popover>
                    </div>
                	
                	<div className={styles.main_layout_header_right_item}>
		            	<div className={styles.btn_a_text} id="qq_talk_warp" title="QQ在线">
			            	<img 
			            		alt="QQ在线咨询"
			            		src="https://img.ishanshan.com/gimg/img/54cd57420c9b544d280a38f38a0bb392"
			            		className={styles.qq_talk_warp_img} 
			            		onClick={qqTalk} />
						</div>
		          	</div>
		          
		          <div className={styles.main_layout_header_right_item_split}></div>

                    <Popover 
		        		key={'connect_popover'} 
		        		overlayClassName={styles.connect_popover} 
		        		content={connect_popover} 
		        		title={null} trigger="hover" placement="bottom">
			          <div className={styles.main_layout_header_right_item}>
			            <Icon type="question-circle" className={styles.btn_a_icon} />
			            <div className={styles.btn_a_text}>帮助中心</div>
			          </div>
		          </Popover>

                    <Dropdown overlay={user_drap_menu} >
                        <div className={styles.main_layout_header_right_item}>
                            {/*目前不显示用户头像，显示用户统一icon*/}
                            {/* !!userMsg.headImgUrl ? <img src={ userMsg.headImgUrl } className={styles.login_user_info_img} /> : null */}
                            <Icon type="user" className={styles.btn_a_icon}/>
                            <div className={styles.btn_a_text} style={{ textOverflow : 'ellipsis', whiteSpace : 'nowrap', maxWidth : '100px', display : 'block', overflow : 'hidden',
                            }}>
                                { userMsg.userName || '无姓名' }
                            </div>
                            <div className={styles.user_text_trigger}>
                                <Icon type="cas-right-bottom" className={styles.user_text_trigger_icon}/>
                            </div>
                        </div>
                    </Dropdown>
                </div>
            <div className={styles.header_show_split}></div>
        </Header> : null}
        <Layout className={styles.content_layout_cont}>
            {/*<Sider
                trigger={null}
                width='50'>
                <div className={styles.cas_layout_left_cont} >
                    {applicationList && applicationList.map(function(item, index) {
                        let isCurrentApp = item.appCode == currentApplication;
                        return (
                            <div className={styles.cas_layout_left_item_cont} key={'cas_layout_left_item_' + index}>
                                <Tooltip placement="right" title={item.name} trigger="hover" overlayClassName = 'saas_layout_left_tooltip'>
                                    <div className={isCurrentApp ? styles.cas_layout_left_item_active : styles.cas_layout_left_item} key={'cas_layout_left_item_' + index}>
                                        <Icon type={item.icon} className={styles.cas_layout_left_item_icon} onClick={()=>changeApplication( item.url, item.appCode )}/>
                                    </div>
                                </Tooltip>
                            </div>
                        )
                })}
                    <div className={styles.cas_layout_left_bottom_split}></div>
                </div>
            </Sider>*/}
                <Content className={styles.main_layout_content}>
                    {children}
                </Content>
            </Layout>
			<VersionInfo visible = { versionInfoVisible } versionInfo = { versionInfo } changeVisible = { changeVersionInfoVisible } />
        </Layout>
    );
}

export default IndexLayoutComponent;
