import React from 'react';
import QueueAnim from 'rc-queue-anim';

import styles from '../../../components/crm/leads-follow/leads-follow-table/LeadsFollowDetailModal.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import { NewModal , NewButton } from '../../../components/common/new-component/NewComponent';
import ClassSchedule 	from '../../../pages/erp/class-schedule/ClassSchedule';
import Detail from './ClassroomDetailPage';

import style from '../course-manage/course-manage-add-or-edit/CourseManageCreate.less';
import { Button , Modal , Icon ,Tabs ,Menu ,Form , Input , Select, Radio , Dropdown , Popover } from 'antd';
let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;
let ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;

function classroomCreate({

    //详情model
    createFormModelVisible,
    cancelCreateFormModelAction,
    confirmCreateFormModel,
    cancelClassRoomDetail,

    modalAllDetailContent,  //进入页面时获取数据
    deleteDetailClass,  //删除详情数据
    classroomAddUpdate,    //编辑页面

    addNewSchdule,
}){
    let NewModelProps = {
        visible     : createFormModelVisible,             //modal是否显示
        headVisible : false,
        closable    : true,                               //modal右上角是否显示关闭X
        onOk        : confirmCreateFormModel,             //modal点击确认
        onCancel    : cancelCreateFormModelAction,        //modal点击取消
        width       : 900,                                //modal宽度(默认600)
        top         : 50,                                 //距离浏览器上方距离(默认0)
        bottom      : 0,                                  //距离浏览器下方距离(默认0)
        height      : 'calc(100%-50px)',
        footer      : '',
    }

	let courseId;
    if(modalAllDetailContent && modalAllDetailContent.id){
        courseId=modalAllDetailContent.id;
    }
    function handleMenuClick(){
       deleteDetailClass(modalAllDetailContent);
    }
    //关闭页面
    function cancelClassRoomDetail(){
        cancelClassRoomDetail();
    }

    const menu = (
        <Menu onClick = { handleMenuClick }>
            <Menu.Item key="1" >删除</Menu.Item>
        </Menu>
    );

    //点击编辑
    function editNewPageAction(){
        classroomAddUpdate( modalAllDetailContent );
    }
    let DetailProps = {
        modalAllDetailContent,          //选中员工查看详情时员工的信息
    }

      //课程表信息属性
    let classScheduleProps = {
        defaultQuery : {
			orgId   : modalAllDetailContent.orgId,
			classId : modalAllDetailContent.id,
		}
    };

      //店家添加排课
    function addNewSchduleAction(){
        addNewSchdule();
    }

   return(
        <NewModal {...NewModelProps}>
            <div className={styles.leads_detail_message}>
                <div className={styles.leads_detail_message_top} style = {{ marginBottom : 10 }}>
                    <div className={styles.leads_detail_message_top_left}>
                        <img src='https://img.ishanshan.com/gimg/img/1194ed70779082a995c5b0e303b740a9' className={styles.leads_detail_message_img}/>
                        <div className={styles.leads_detail_message_left}>
                            <Popover placement="left" trigger="hover" content = { modalAllDetailContent.name || '--' } >
                                { modalAllDetailContent.name || '--'}
                            </Popover>
                        </div>
                    </div>
                    <div className={styles.leads_detail_message_top_right}>
                        <Button type = 'primary' style = {{ marginRight : 20 , width : 68 }} onClick = { editNewPageAction }>编辑</Button>
                        <ButtonGroup style = {{ marginRight : 20 , color : '#5d9cec' }} >
                            <Button className={styles.radio_button_group} onClick = { handleMenuClick } style = {{ width : 60 }}>删除</Button>
                        </ButtonGroup>
                        <Icon type="close" onClick={ cancelClassRoomDetail }/>
                    </div>
                </div>
            </div>
            <div className = 'courseManage_detail'>
                <Tabs size = "small" defaultActiveKey = { '1' }>
                    <TabPane tab = "详细信息" key = "1" ><Detail {...DetailProps}/></TabPane>
                    {/*<TabPane tab = "课程表"  key = "2" className='courseManage_schedule_tab'>
                        <div style = {{ height:'calc(100vh - 187px)',overflow:'scroll' }} className='courseManage_schedule'>
                            <ClassSchedule {...classScheduleProps} />
                        </div>
                    </TabPane>*/}
                </Tabs>
            </div>
        </NewModal>
   )
}

export default Form.create({})(classroomCreate);
