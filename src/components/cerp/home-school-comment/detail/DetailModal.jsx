import React from 'react';
import Media from 'react-media';
import { Button , Form , Input , Tabs , Select , Icon , Dropdown , Menu , Popover , Radio } from 'antd';
import { NewModal } from '../../../common/new-component/NewComponent';
import expect from './DetailRenderGroup.json';
import styles from './DetailModal.less';
import TeacherComment from './teacher-comment/table/TeacherComment';                            //老师评价
import TeacherCommentEditModal from './teacher-comment/modal/TeacherCommentEditModal';          //老师评价编辑modal
import ParentComment from './parent-comment/ParentComment';                                     //家长评价
import CourseContent from './course-content/table/CourseContent';                               //课程评价
import CourseContentEditModal from './course-content/modal/CourseContentEditModal';             //上課內容编辑modal
const TabPane = Tabs.TabPane;

/*家校互评详情*/
function DetailModal({
    detailModalVisible,                     //详情modal是否显示
    detailModalKey,                         //详情modalkey
    detailModalMsg,                         //详情需要渲染的数据(列表中当前项的数据，详情头部和上课内容tab页的数据从此取，老师评价和家长评价数据从接口中取)

    ModalTabChange,                         //详情modal内tab页onChange事件
    CloseDetailModal,                       //关闭详情modal

    /*老師评价tab页*/
    teacherCommentLoading,                  //老师评价tab页是否是加载状态
    teacherCommentMsg,                      //老师评价列表数据

    OpenCommentEditModal,                   //打开老师评价编辑modal

    /*老师评价编辑modal*/
    teacherCommentEditModalVisible,         //老师评价编辑modal是否显示
    teacherCommentEditModalLoading,         //老师评价编辑modal加载状态
    teacherCommentEditModalData,            //老师评价编辑modal回填数据

    CloseCommentEditModal,                  //老师评价编辑modal关闭
    SubmitCommentEditModal,                 //老师评价编辑modal提交

    /*家长评价tab页*/
    parentCommentLoading,                   //家长评价tab页是否是加载状态
    parentCommentMsg,                       //家长评价列表数据

    /*上课内容tab页*/
    courseContentMsg,                       //上课内容

    OpenContentEditModal,                   //打开課內容編輯modal

    /*上课內容编辑modal*/
    courseContentEditModalVisible,          //上课內容编辑modal是否显示
    courseContentEditModalLoading,          //上课內容编辑modal加载状态
    courseContentEditModalData,             //上课內容编辑modal回填数据

    CloseContentEditModal,                  //上课內容编辑modal关闭
    SubmitContentEditModal,                 //上课内容编辑modal提交
}){

    //详情信息渲染
    function detailRender(expect,target){
        let arr = [];
        for(let i in expect){
            if(expect[i].value == 'time'){
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <Popover placement = 'left' content = { target.studyDate + ' ' + target.startTime + '~' + target.endTime }>
                            { target.studyDate + ' ' + target.startTime + '~' + target.endTime }
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

    let NewModalProps = {
        visible : detailModalVisible,
        headVisible : false,
        closable : true,
        onCancel : CloseDetailModal,
        footer : '',
    }

    /*计算tab页需要从100vh中减去的高度*/
    let IntroHeight = 0;
    if(document.getElementById('home_school_comment_detail_modal_top')){
        IntroHeight = document.getElementById('home_school_comment_detail_modal_top').clientHeight;
    }
    window.onresize = function(){
        if(document.getElementById('home_school_comment_detail_modal_top')){
            IntroHeight = document.getElementById('home_school_comment_detail_modal_top').clientHeight;
        }
    }
    let innerHeight = `calc(100vh - ${50 + IntroHeight + 47})` ;     //最上面菜单的高度+信息的高度+tab的高度


    //老师评价属性
    let TeacherCommentProps = {
        teacherCommentLoading,                  //老师评价tab页是否是加载状态
        teacherCommentMsg,                      //老师评价列表数据

        OpenCommentEditModal,                   //打开老师评价编辑modal
    }

    //老师评价编辑modal属性
    let TeacherCommentEditModalProps = {
        teacherCommentEditModalVisible,         //老师评价编辑modal是否显示
        teacherCommentEditModalLoading,         //老师评价编辑modal加载状态
        teacherCommentEditModalData,            //老师评价编辑modal回填数据

        CloseCommentEditModal,                  //老师评价编辑modal关闭
        SubmitCommentEditModal,                 //老师评价编辑modal提交
    }

    //家长评价属性
    let ParentCommentProps = {
        parentCommentLoading,                   //家长评价tab页是否是加载状态
        parentCommentMsg,                       //家长评价列表数据
    }

    //上课内容属性
    let CourseContentProps = {
        courseContentMsg,                       //上课内容

        OpenContentEditModal,                   //打開上課內容編輯modal
    }

    //上課內容編輯modal屬性
    let CourseContentEditModalProps = {
        courseContentEditModalVisible,          //上课内容编辑modal是否显示
        courseContentEditModalLoading,          //上课内容编辑modal加载状态
        courseContentEditModalData,             //上课内容编辑modal回填数据

        CloseContentEditModal,                  //上课内容编辑modal关闭
        SubmitContentEditModal,                 //上课内容编辑modal提交
    }

    return(
        <NewModal {...NewModalProps}>
            <div className={styles.leads_detail_message} id = 'home_school_comment_detail_modal_top'>
                <div className={styles.leads_detail_message_top}>
                    <div className={styles.leads_detail_message_top_left}>
                        <img src='https://img.ishanshan.com/gimg/img/abde58fd2dc31461271d3bf6f3ee3259' className={styles.leads_detail_message_img}/>
                        <div className={styles.leads_detail_message_left}>
                            <Popover placement="left" trigger="hover" content = '家校互评' >
                                家校互评
                            </Popover>
                        </div>
                    </div>
                    <div className={styles.leads_detail_message_top_right}>
                        <Icon type="close" onClick={CloseDetailModal}/>
                    </div>
                </div>
                <div className={styles.leads_detail_message_detail_message}>
                    { detailRender(expect,detailModalMsg) || [] }
                </div>
            </div>
            <Tabs onChange = { ModalTabChange } size = "small" activeKey = { detailModalKey }>
                <TabPane tab="老师评价" key="0">
                    <div style= {{ height : innerHeight }}>
                        <TeacherComment {...TeacherCommentProps}/>
                        { !!teacherCommentEditModalVisible ? <TeacherCommentEditModal {...TeacherCommentEditModalProps}/> : null }
                    </div>
                </TabPane>
                <TabPane tab='家长评价' key="1">
                    <div style= {{ height : innerHeight }}>
                        <ParentComment {...ParentCommentProps}/>
                    </div>
                </TabPane>
                <TabPane tab='上课内容' key="2">
                    <div style= {{ height : innerHeight }}>
                        <CourseContent {...CourseContentProps}/>
                        { !!courseContentEditModalVisible ? <CourseContentEditModal {...CourseContentEditModalProps}/> : null }
                    </div>
                </TabPane>
            </Tabs>
        </NewModal>
    );
}

export default DetailModal;
