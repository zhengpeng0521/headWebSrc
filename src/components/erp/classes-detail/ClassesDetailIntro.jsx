import React from 'react';
import { Form, Input, Button, Icon, Select, DatePicker  } from 'antd';

import styles from './ClassesDetail.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const ClassesMgrIntro = ({
    searchReset,
    searchSubmit,
    IntroEdit,
    topList,
	classesListTotal,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    },
}) => {
	
	let lengthArr 	= Object.keys(topList);	
	let bishopArr 	= [];
	let taArr 		= [];
	let bishop 		= [];
	let ta			= [];
	
	if(lengthArr&&lengthArr.length>0) {
		topList.teacherList&&topList.teacherList.map(function(item,index){
			if(parseInt(item.prime)) {
				bishopArr.push(item.uname);
				if(bishopArr.length < 3) {
					bishop = bishopArr.join(',');
				}
			} else {
				
				taArr.push(item.uname);
				if(taArr.length < 3) {
					ta = taArr.join(',');
				}
			}
		});	
	}

	function handleSearchSubmit(e) {
        e.preventDefault();
        let values={};
        validateFields((errors,fieldsValue) => {
            if (!!errors) {
                return;
            }
            values = {...fieldsValue};
            searchSubmit(values);
        });
    }

    function handleSearchClear(e) {
        e.preventDefault();
        resetFields();
        searchReset();
    }

    let loopChannel = data => data.map((item) => {
    	return <Option value={item.id + ''} key={item.id} style={{color:item.status=='1'?'black':'red'}}>{item.title}</Option>;
    });

  return (
    <div className={styles.IntroContent}>
        <div className={styles.Top}>
            <div className={styles.introItemTop}>
                所属校区:{` ${topList.orgName != null ? topList.orgName : ''}` || ''}
            </div>

            <div className={styles.introItemTop} >
                课程类型:{` ${topList.courseType == 1 ? '主题式' : topList.courseType == 2 ? '渐进式' : ''}`}
            </div>
			{
				topList.courseType == 2 ? 
					<div className={styles.introItemTop}>
						进度:{` ${topList.progress}/${topList.maxProgress}` || ''}
					</div> : ''
			}
			
            <a className={styles.introEdit} onClick={IntroEdit}>
                编辑
            </a>
        </div>
        <div className={styles.Bottom}>
            <div className={styles.introItemBottom}>
                班级名称:{` ${topList.name != null ? topList.name : ''}` || ''}
            </div>
            <div className={styles.introItemBottom}>
                所属课程:{` ${topList.title != null ? topList.title : ''}`}
            </div>
            <div className={styles.introItemBottom}>
				主教:{` ${bishop || '未安排'}`}
            </div>
			<div className={styles.introItemBottom}>
                助教:{` ${ta.length>0?ta:'未安排'}`}
            </div>
            <div className={styles.introItemBottom}>
                班级人数:{` ${classesListTotal || 0}/${topList.maxStuNum}` || ''}
            </div>
        </div>
    </div>
  );
};

export default Form.create()(ClassesMgrIntro);
