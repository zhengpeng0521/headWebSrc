import React from 'react';
import { Form, Input, Modal, Button, Upload, Icon, message, Select, Transfer, Spin , Popover } from 'antd';
import styles from './TeacherTeaching.less';

//模板1新增文章
const TeacherTeachingDetailModal = ({
    teachingDetailVisible,
    teachingDetailName,
    teachingDetailNameHeight,
    teachingDetailContent,
    teachingDetailSpining,
    teachingDetailModalCancel
  }) => {

    /*教学人次*/
    let sAttendAll = 0;     //上课总数
    let atsAttendAll = 0;
    let sMakeupAll = 0;     //补课总数
    let atsMakeupAll = 0;
    let sAuditionAll = 0;   //试听总数
    let atsAuditionAll = 0;
    let sAll = 0;           //总计
    let atsAll = 0;

    /*授课节数*/
    let tAttendAll = 0;     //上课总数
    let attAttendAll = 0;
    let tMakeupAll = 0;     //补课总数
    let attMakeupAll = 0;
    let tAuditionAll = 0;   //试听总数
    let attAuditionAll = 0;
    let tAll = 0;           //总计
    let attAll = 0;

    for(let i in teachingDetailContent){
        sAttendAll += parseFloat(teachingDetailContent[i].sAttend || 0);
        sMakeupAll += parseFloat(teachingDetailContent[i].sMakeup || 0);
        sAuditionAll += parseFloat(teachingDetailContent[i].sAudition || 0);

        tAttendAll += parseFloat(teachingDetailContent[i].tAttend || 0);
        tMakeupAll += parseFloat(teachingDetailContent[i].tMakeup || 0);
        tAuditionAll += parseFloat(teachingDetailContent[i].tAudition || 0);

        atsAttendAll += parseFloat(teachingDetailContent[i].atsAttend || 0);
        atsMakeupAll += parseFloat(teachingDetailContent[i].atsMakeup || 0);
        atsAuditionAll += parseFloat(teachingDetailContent[i].atsAudition || 0);

        attAttendAll += parseFloat(teachingDetailContent[i].attAttend || 0);
        attMakeupAll += parseFloat(teachingDetailContent[i].attMakeup || 0);
        attAuditionAll += parseFloat(teachingDetailContent[i].attAudition || 0);
    }

    sAll = sAttendAll+sMakeupAll+sAuditionAll;
    atsAll = atsAttendAll + atsMakeupAll + atsAuditionAll;
    tAll = tAttendAll+tMakeupAll+tAuditionAll;
    attAll = attAttendAll + attMakeupAll + attAuditionAll;

    let children = [];
    if( teachingDetailContent && teachingDetailContent.length > 0 ){
        children = teachingDetailContent.map((item,index) => {
            return (
                <div key={index}>
                    <div className={styles.detailStatus} style={{width : 180}}>
                        <Popover placement="top" content={item.title} trigger="hover">
                            {item.title}
                        </Popover>
                    </div>
                    <div className={styles.detailStatus}>
                        <Popover placement="top" content={item.tAttend + '(' + item.attAttend + ')'} trigger="hover">
                            {item.tAttend + '(' + item.attAttend + ')'}
                        </Popover>
                    </div>
                    <div className={styles.detailStatus}>
                        <Popover placement="top" content={item.tMakeup + '(' + item.attMakeup + ')'} trigger="hover">
                            {item.tMakeup + '(' + item.attMakeup + ')'}
                        </Popover>
                    </div>
                    <div className={styles.detailStatus}>
                        <Popover placement="top" content={item.attAttend + '(' + item.attAudition + ')'} trigger="hover">
                            {item.tAudition + '(' + item.attAudition + ')'}
                        </Popover>
                    </div>
                    <div className={styles.detailStatus}>
                        <Popover placement="top" content={parseFloat(item.tAttend)+parseFloat(item.tMakeup)+parseFloat(item.tAudition) + '(' + (parseFloat(item.attAttend)+parseFloat(item.attMakeup)+parseFloat(item.attAudition)) + ')'} trigger="hover">
                            {parseFloat(item.tAttend)+parseFloat(item.tMakeup)+parseFloat(item.tAudition) + '(' + (parseFloat(item.attAttend)+parseFloat(item.attMakeup)+parseFloat(item.attAudition)) + ')'}
                        </Popover>
                    </div>
                    <div className={styles.detailStatus}>
                        <Popover placement="top" content={item.sAttend + '(' + item.atsAttend + ')'} trigger="hover">
                            {item.sAttend + '(' + item.atsAttend + ')'}
                        </Popover>
                    </div>
                    <div className={styles.detailStatus}>
                        <Popover placement="top" content={item.sMakeup + '(' + item.atsMakeup + ')'} trigger="hover">
                            {item.sMakeup + '(' + item.atsMakeup + ')'}
                        </Popover>
                    </div>
                    <div className={styles.detailStatus}>
                        <Popover placement="top" content={item.sAudition + '(' + item.atsAudition + ')'} trigger="hover">
                            {item.sAudition + '(' + item.atsAudition + ')'}
                        </Popover>
                    </div>
                    <div className={styles.detailStatus}>
                        <Popover placement="top" content={parseFloat(item.sAttend)+parseFloat(item.sMakeup)+parseFloat(item.sAudition) + '(' + (parseFloat(item.atsAttend)+parseFloat(item.atsMakeup)+parseFloat(item.atsAudition)) + ')'} trigger="hover">
                            {parseFloat(item.sAttend)+parseFloat(item.sMakeup)+parseFloat(item.sAudition) + '(' + (parseFloat(item.atsAttend)+parseFloat(item.atsMakeup)+parseFloat(item.atsAudition)) + ')'}
                        </Popover>
                    </div>
                </div>
            );
        });
    }else{
        return (
            <div></div>
        );
    }

    //模态框的属性
    let modalOpts = {
        title: '授课明细',
        maskClosable : false,
        visible : teachingDetailVisible,
        closable : true,
        width : 760,
        onCancel : teachingDetailModalCancel,
        footer : '',
        className : 'zj_teather_teaching__modal'
    };

    return (
        <div>
            <Modal {...modalOpts} style={{minWidth:'760px'}}>
                <Spin tip="Loading..." spinning={teachingDetailSpining}>
                    <div className={styles.allModal}>
                        <div className={styles.topTitle} style={{height:'100px',width:'120px',border:'1px solid #dddddd'}}>
                        </div>
                        <div className={styles.topTitle} style={{height:'100px',width:'180px',border:'1px solid #dddddd',borderLeft:'',lineHeight:'100px',backgroundColor:'#f5f5f5'}}>
                            课程名称
                        </div>
                        <div className={styles.topTitle} style={{height:'50px',width:'200px',border:'1px solid #dddddd',borderLeft:'',lineHeight:'50px',backgroundColor:'#f5f5f5'}}>
                            授课节数
                        </div>
                        <div className={styles.topTitle} style={{height:'50px',width:'200px',border:'1px solid #dddddd',borderLeft:'',lineHeight:'50px',backgroundColor:'#f5f5f5'}}>
                            教学人次
                        </div>
                        <div className={styles.detailStatus}>
                            上课
                        </div>
                        <div className={styles.detailStatus}>
                            补课
                        </div>
                        <div className={styles.detailStatus}>
                            试听
                        </div>
                        <div className={styles.detailStatus}>
                            合计
                        </div>
                        <div className={styles.detailStatus}>
                            上课
                        </div>
                        <div className={styles.detailStatus}>
                            补课
                        </div>
                        <div className={styles.detailStatus}>
                            试听
                        </div>
                        <div className={styles.detailStatus}>
                            合计
                        </div>
                        <div style={{float:'left',width:'120px',borderLeft:'1px solid #dddddd',borderRight:'1px solid #dddddd',borderBottom:'1px solid #dddddd',textAlign:'center',lineHeight:teachingDetailNameHeight,height:teachingDetailNameHeight,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>
                            <Popover placement="top" content={teachingDetailName} trigger="hover">
                                { teachingDetailName }
                            </Popover>
                        </div>

                        { children || [] }

                        <div style={{float:'left',height:'50px',width:'180px',borderBottom:'1px solid #dddddd',borderRight:'1px solid #cccccc',lineHeight:'50px',textAlign:'center',backgroundColor:'#fcdd4f'}}>
                            汇总
                        </div>
                        <div className={styles.detailStatus} style={{backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>
                            <Popover placement="top" content={tAttendAll + '(' + attAttendAll + ')'} trigger="hover">
                                {tAttendAll + '(' + attAttendAll + ')'} 
                            </Popover>
                        </div>
                        <div className={styles.detailStatus} style={{backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>
                            <Popover placement="top" content={tMakeupAll +'(' + attMakeupAll + ')'} trigger="hover">
                                {tMakeupAll +'(' + attMakeupAll + ')'}
                            </Popover>
                        </div>
                        <div className={styles.detailStatus} style={{backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>
                            <Popover placement="top" content={tAuditionAll + '(' + attAuditionAll + ')'} trigger="hover">
                                {tAuditionAll + '(' + attAuditionAll + ')'}
                            </Popover>
                        </div>
                        <div className={styles.detailStatus} style={{backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>
                            <Popover placement="top" content={tAll+ '(' + attAll + ')'} trigger="hover">
                                {tAll + '(' + attAll + ')'}
                            </Popover>
                        </div>
                        <div className={styles.detailStatus} style={{backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>
                            <Popover placement="top" content={sAttendAll +'(' + atsAttendAll + ')'} trigger="hover">
                                {sAttendAll +'(' + atsAttendAll + ')'}
                            </Popover>
                        </div>
                        <div className={styles.detailStatus} style={{backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>
                            <Popover placement="top" content={sMakeupAll + '(' + atsMakeupAll + ')'} trigger="hover">
                                {sMakeupAll + '(' + atsMakeupAll + ')'}
                            </Popover>
                        </div>
                        <div className={styles.detailStatus} style={{backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>
                            <Popover placement="top" content={sAuditionAll + '(' + atsAuditionAll + ')'} trigger="hover">
                                {sAuditionAll + '(' + atsAuditionAll + ')'}
                            </Popover>
                        </div>
                        <div className={styles.detailStatus} style={{backgroundColor:'#fcdd4f'}}>
                            <Popover placement="top" content={sAll} trigger="hover">
                                {sAll + '(' + atsAll + ')'}
                            </Popover>
                        </div>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default TeacherTeachingDetailModal;
