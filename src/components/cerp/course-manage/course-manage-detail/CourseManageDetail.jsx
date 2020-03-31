import React from 'react';
import QueueAnim from 'rc-queue-anim';
import styles from '../../../../components/crm/leads-follow/leads-follow-table/LeadsFollowDetailModal.less';
import TenantOrgSelect from '../../../../pages/common/tenant-org-select/TenantOrgSelect';
import { NewModal , NewButton } from '../../../../components/common/new-component/NewComponent';

import ClassSchedule 	from '../../../../pages/erp/class-schedule/ClassSchedule';                                                   //课程表
import Detail from './CourseManageDetailPage';

import style from '../course-manage-add-or-edit/CourseManageCreate.less';

import { Button , Modal , Icon ,Menu ,Form , Input , Tabs , Select , Radio , Dropdown , Popover } from 'antd';
let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;
let ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;

function CourseManageCreate({

    //详情model
    createFormModelVisible,
    confirmCreateFormModel,
    cancelCreateFormModel,

    leadsFollowDetailModalTabKey,  //tab项索引
    leadsFollowDetailModalTabChange,        //详情内tab的onChange事件
    modalAllDetailContent,  //进入页面时获取数据
    deleteDetailCourse,  //删除详情数据
    updateCourse,    //编辑页面
    addNewSchdule,  //添加排课
    addSchduleVisible,

}){
    let NewModelProps = {
        visible : createFormModelVisible,            //modal是否显示
        headVisible : false,
        closable :true,           //modal右上角是否显示关闭X
        onOk :confirmCreateFormModel,               //modal点击确认
        onCancel :cancelCreateFormModelAction,           //modal点击取消
        footer : '',
    }

    let courseId;
    if(modalAllDetailContent && modalAllDetailContent.id){
        courseId=modalAllDetailContent.id;
    }
    function handleMenuClick(){
       deleteDetailCourse(modalAllDetailContent);
    }
    //关闭页面
    function cancelCreateFormModelAction(){
        cancelCreateFormModel();
    }
    //店家添加排课
    function addNewSchduleAction(){
        addNewSchdule();
    }

    const menu = (
	  <Menu onClick={handleMenuClick}>
		 <Menu.Item key="1">删除此课程</Menu.Item>
	  </Menu>
	);
    function visibleChange( visible ){

	}

    //点击编辑
     let courseid=modalAllDetailContent.id;
     let orgid=modalAllDetailContent.orgId;

    function editNewPageAction(){
        updateCourse(modalAllDetailContent);
    }
    let DetailProps = {
        modalAllDetailContent,          //选中员工查看详情时员工的信息
    }

     //课程表信息属性
    let classScheduleProps = {
        defaultQuery : {
			orgId : modalAllDetailContent.orgId,
			courseId : modalAllDetailContent.id,
		}
    };

   return(
        <NewModal {...NewModelProps}>
            <div className={styles.leads_detail_message}>
                <div className={styles.leads_detail_message_top} style = {{ marginBottom : 10 }}>
                    <div className={styles.leads_detail_message_top_left}>
                        <img src='https://img.ishanshan.com/gimg/img/76b4f9887dbe6d49f80218c85901a0ca' className={styles.leads_detail_message_img}/>
                        <div className={styles.leads_detail_message_left}>
                            <Popover placement="left" trigger="hover" content = { modalAllDetailContent.title || '--' } >
                                { modalAllDetailContent.title || '--'}
                            </Popover>
                        </div>
                    </div>
                    <div className={styles.leads_detail_message_top_right}>
                        <Button type = 'primary' style = {{ marginRight : 20 , width : 68 }} onClick = { editNewPageAction }>编辑</Button>
                        <ButtonGroup style = {{ marginRight : 20 , color : '#5d9cec' }} >
                            <Button className={styles.radio_button_group} onClick = { handleMenuClick } style = {{ width : 60 }}>删除</Button>
                        </ButtonGroup>
                        <Icon type="close" onClick={ cancelCreateFormModelAction }/>
                    </div>
                </div>
            </div>
            <div className = 'courseManage_detail'>
                <Tabs onChange = { leadsFollowDetailModalTabChange } size = "small" defaultActiveKey = { '1' }>
                    <TabPane tab="详细信息" key="1"><Detail {...DetailProps}/></TabPane>
                    {/*<TabPane tab="课程表" key="2" className='courseManage_schedule_tab'>
                        <div style={{height:'calc(100vh - 187px)',overflow:'scroll'}} className='courseManage_schedule'>
                            <ClassSchedule {...classScheduleProps}/>
                        </div>
                    </TabPane>*/}
                </Tabs>
            </div>
        </NewModal>
   )
}

export default Form.create({})(CourseManageCreate);
