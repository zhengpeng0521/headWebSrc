import React from 'react';
import { Button ,Icon} from 'antd';
import style from './StudentInfoDetail.less';

function StudentInfoDetail({
    studentDetailInfo
}){

	return (
        <div className = { style.yhwu_student_detail_info }>
            <div className = { style.detail_info_image_wrap }>
                <img className = { style.detail_info_image } src = { studentDetailInfo.headimgurl || "https://img.ishanshan.com/gimg/img/8afe8f120696f9964c0ce8e058e7d276" }  />
            </div>
            <div className = { style.detail_info_content }>
                <ul className = { style.detail_info_content_ul }>
                    <li>姓名 : { studentDetailInfo.name }&nbsp;&nbsp; </li>
                    <li>性别 : { studentDetailInfo.sex == '1' ? '男' : studentDetailInfo.sex == '2' ? '女' : null }&nbsp;&nbsp;</li>
                    <li>生日 : { studentDetailInfo.birthday }&nbsp;&nbsp; </li>
                    <li>负责人 : { studentDetailInfo.sellerName }&nbsp;&nbsp; </li>
                    <li>跟进状态 : { studentDetailInfo.saleStatusName }&nbsp;&nbsp; </li>
                    <li>学员类型 : { studentDetailInfo.intentionName }&nbsp;&nbsp; </li>
                    <li>来源 : { studentDetailInfo.channelName }&nbsp;&nbsp; </li>
                    <li>联系方式 : { studentDetailInfo.mobile } &nbsp;&nbsp;</li>
                    <li>所在校区 : { studentDetailInfo.orgName }&nbsp;&nbsp; </li>
                </ul>
            </div>
        </div>
	)
};

export default StudentInfoDetail;
