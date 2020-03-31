import React from 'react';
import Media from 'react-media';
import { Button , Form , Input , Tabs , Select , Icon , Dropdown , Menu , Popover , Radio } from 'antd';
import { NewModal } from '../../../common/new-component/NewComponent';
import Detail from './LeadsFollowDetailInner/Detail';                                                   //详细信息
import styles from './LeadsFollowDetailModal.less';
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

/*详情*/
function LeadsFollowDetailModal({

    leadsFollowDetailModalVisible,          //划入框是否显示
    leadsFollowDetailModalTabKey,           //tab项索引
    leadsFollowDetailLeadMessage,           //选中leads名单查看详情时当前人的信息

    LeadsFollowDetailModalTabChange,        //详情内tab的onChange事件
    LeadsFollowDetailModalCancel,           //详情划入框关闭


}){

    //详情属性
    let DetailProps = {
        leadsFollowDetailLeadMessage,          //选中leads名单查看详情时当前人的信息
    }
    let NewModalProps = {
        visible : leadsFollowDetailModalVisible,
        headVisible : false,
        closable : true,
        onCancel : LeadsFollowDetailModalCancel,
        footer : '',
    }

    return(
        <NewModal {...NewModalProps}>
            <div className={styles.leads_detail_message} id='leads_detail_message'>
                <div className={styles.leads_detail_message_top}>
                    <div className={styles.leads_detail_message_top_left}>
                        <img src='https://img.ishanshan.com/gimg/img/abde58fd2dc31461271d3bf6f3ee3259' className={styles.leads_detail_message_img}/>
                        <div className={styles.leads_detail_message_left}>
                            <Popover placement="left" trigger="hover" content = { leadsFollowDetailLeadMessage.name || '--' } >
                                { leadsFollowDetailLeadMessage.name || '--' }
                            </Popover>
                        </div>
                    </div>
                    <div className={styles.leads_detail_message_top_right}>

                        <Icon type="close" onClick={LeadsFollowDetailModalCancel}/>
                    </div>
                </div>

            </div>
            <Tabs onChange = { LeadsFollowDetailModalTabChange } size = "small" activeKey = { leadsFollowDetailModalTabKey }>
                <TabPane tab="详细信息" key="1">
                    <Detail {...DetailProps}/>
                </TabPane>
            </Tabs>
        </NewModal>
    );
}

export default LeadsFollowDetailModal;
