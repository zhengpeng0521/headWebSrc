import React from 'react';
import Media from 'react-media';
import { Button , Form , Input , Tabs , Select , Icon , Dropdown , Menu , Popover , Radio , Spin } from 'antd';
import { NewModal } from '../../../common/new-component/NewComponent';
import DetailModalTop from './DetailModalTop.json';
import BaseInformation from './base-information/BaseInformation';
import PackageInformation from './package-information/table';
import ServiceManage from './service-manage/ServiceManage';
import styles from './HeadOrgDetailModal.less';
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

/*详情侧滑框*/
function HeadOrgDetailModal({
    detailModalVisible,                     //是否显示
    detailModalTabLoading,                  //加载状态
    rightTableOrgType,                      //校区类型
    HeadOrgDetailModalEdit,                 //详情框内点击编辑
    HeadOrgDetailModalClose,                //关闭详情框

    /*基本信息tab页*/
    baseInformationData,                    //基本信息数据

    /*套餐信息tab页*/
    packageInfoData,                        //列表内容
    OpenPackageModal,                       //打开套餐编辑modal

    /*服务管理tab页*/
    serviceInfoData,                        //服务管理列表数据
    ServiceSwitchOnChange,                  //开关onChange事件
    coursewareSetChange,                    //课件可见人设置
}){

    //详情信息渲染
    function detailRender(expect,target){
        let arr = [];
        for(let i in expect){
            if(expect[i].value == 'addr'){
                let render_content = !target.province && !target.city && !target.area && !target.addr ? '--' : ((target.province || '') + (target.city || '') + (target.area || '') + (target.addr || ''));
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <Popover placement = 'left' content = { render_content }>
                            { render_content }
                        </Popover>
                    </p>
                )
            }else if(expect[i].value == 'orgType'){
                let index = 'no_one';
                for(let j = 0 , len = rightTableOrgType.length ; j < len ; j++){
                    if(rightTableOrgType[j].id == target[expect[i].value]){
                        index = j;
                        break;
                    }
                }
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <Popover placement = 'left' content = { index != 'no_one' ? rightTableOrgType[index].name : '--' }>
                            { index != 'no_one' ? rightTableOrgType[index].name : '--' }
                        </Popover>
                    </p>
                )
            }else{
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <Popover placement = 'left' content = { !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }>
                            { !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }
                        </Popover>
                    </p>
                )
            }
        }
        return arr;
    }

    let detail = detailRender(DetailModalTop,baseInformationData);

    let NewModalProps = {
        visible : detailModalVisible,
        headVisible : false,
        closable : true,
        onCancel : HeadOrgDetailModalClose,
        footer : '',
    }

    let IntroHeight = 0;

    if(document.getElementById('head_org_detail_modal')){
        IntroHeight = document.getElementById('head_org_detail_modal').clientHeight;
    }

    window.onresize = function(){
        if(document.getElementById('head_org_detail_modal')){
            IntroHeight = document.getElementById('head_org_detail_modal').clientHeight;
        }
    }

    let tabHeight = `calc(100vh - 50px - ${IntroHeight}px - 47px)` ;     //最上面菜单的高度+信息的高度+tab的高度

    return(
        <NewModal {...NewModalProps}>
            <div className={styles.detail_message} id='head_org_detail_modal'>
                <div className={styles.detail_message_top}>
                    <div className={styles.detail_message_top_left}>
                        <img src='https://img.ishanshan.com/gimg/img/0006b7890ce2c94aa8893486e2556c6d' className={styles.detail_message_img}/>
                        <div className={styles.detail_message_left}>
                            <Popover placement="left" trigger="hover" content = { '校区详情' } >
                                校区详情
                            </Popover>
                        </div>
                    </div>
                    <div className={styles.detail_message_top_right}>
                        <Button type = 'primary' style = {{ marginRight : 20 , width : 68 }} onClick = { HeadOrgDetailModalEdit }>编辑</Button>
                        <Icon type = "close" onClick = { HeadOrgDetailModalClose }/>
                    </div>
                </div>
                <div className={styles.detail_message_detail_message}>
                    { detail || [] }
                </div>
            </div>
            <Spin spinning = { detailModalTabLoading }>
                <Tabs size = "small" defaultActiveKey = '1'>
                    <TabPane tab="基础信息" key="1" style = {{ height : tabHeight }} className = { styles.tab_item }>
                        <BaseInformation data = { baseInformationData } rightTableOrgType = { rightTableOrgType }/>
                    </TabPane>
                    <TabPane tab="套餐信息" key="2" style = {{ height : tabHeight }} className = { styles.tab_item }>
                        <PackageInformation data = { packageInfoData } OpenPackageModal = { OpenPackageModal }/>
                    </TabPane>
                    <TabPane tab="服务管理" key="3" style = {{ height : tabHeight }} className = { styles.tab_item }>
                        <ServiceManage data = { serviceInfoData } switchOnChange = { ServiceSwitchOnChange } coursewareSet = { coursewareSetChange }/>
                    </TabPane>
                </Tabs>
            </Spin>
        </NewModal>
    );
}

export default HeadOrgDetailModal;
