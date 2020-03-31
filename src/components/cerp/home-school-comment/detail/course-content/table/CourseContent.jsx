import React from 'react';
import { Popover , Rate , Button } from 'antd';
import { NullData } from '../../../../../common/new-component/NewComponent';
import styles from './CourseContent.less';
import expect from './CourseContent.json';

/*上课内容tab页*/
function CourseContent({
    courseContentMsg,                       //上课内容

    OpenContentEditModal,                   //打开上课内容编辑
}){

    return(
        <div className = { styles.all }>
            <Button type = 'primary' className = { styles.edit_button } onClick = { OpenContentEditModal }>编辑</Button>
            { expect && expect.length > 0 ?
                expect.map((item,index) => {
                    switch(item.key){
                        case 'picList' : return (
                            <div key = { index } className = { styles.render_item }>
                                <div style = {{ width : '7.5%' }}>{ item.name + '：' }</div>
                                <span style = {{ width : '92.5%' }}>{ `共${courseContentMsg[item.key] && courseContentMsg[item.key].length > 0 ? courseContentMsg[item.key].length : 0}张`}</span>
                            </div> ) ; break;
                        default : return (
                            <div key = { index } className = { styles.render_item }>
                                <div style = {{ width : '7.5%' }}>{ item.name + '：' }</div>
                                <Popover placement = 'left' trigger = 'hover' content = { courseContentMsg[item.key] }>
                                    <span style = {{ width : '92.5%' }}>{ (courseContentMsg[item.key] || '--') }</span>
                                </Popover>
                            </div> )
                    }
                })
                :
                <NullData height = '200px'/>
            }
        </div>
    );
}

export default CourseContent;
