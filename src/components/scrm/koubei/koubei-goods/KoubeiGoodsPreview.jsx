import React from 'react';
import styles from './KoubeiGoodsPreview.less';
import {Carousel} from 'antd';

function KoubeiGoodsPreview ({
    koubeiGoods,
}) {

    //图片展示
    let imgList = [];

    let {fengmian,detailImg} = koubeiGoods;

    let previewImgList = [];

    if(fengmian && fengmian.length > 0) {
        fengmian.map(function(detailImgItem) {
            previewImgList.push(detailImgItem);
        });
    }

    if(detailImg && detailImg.length > 0) {
        detailImg.map(function(detailImgItem) {
            previewImgList.push(detailImgItem);
        });
    }

    if(previewImgList && previewImgList.length > 0) {
        previewImgList.map(function(fengmianItem) {
            let imgUrl = '';
            if(fengmianItem && fengmianItem.url && fengmianItem.url.length > 0) {
                imgUrl = fengmianItem.url;
            }
            if(imgUrl == '' && fengmianItem.response && fengmianItem.response.data && fengmianItem.response.data.url && fengmianItem.response.data.url.length > 0) {
                imgUrl = fengmianItem.response.data.url;
            }
            if(imgUrl != '') {
                imgList.push(
                    <div className={styles.goods_banner_img_cont} key={'goods_banner_img_cont_'+imgList.length}>
                        <img src={imgUrl} width="100%" />
                    </div>
                );
            }
        });
    }

    if(imgList.length == 0) {
        imgList.push(
            <div className={styles.goods_banner_img_cont} key={'goods_banner_img_cont_'+0}>
                <img src={'https://img.ishanshan.com/gimg/img/e937c0427f01dd660a8b4909b728616f'} width="100%" />
            </div>
        );
    }

    //课程自定义模板课程及详情数据渲染
    let freeModalCourse = [];
    freeModalCourse = koubeiGoods.freeModalContent.map((freeModalContentItem,freeModalContentIndex) => {
        if(freeModalContentItem.title != '' && freeModalContentItem.title != null && freeModalContentItem.title != undefined){
            let freeModalCourseDetail = [];
            freeModalCourseDetail = (freeModalContentItem.details).map((freeModalCourseDetailItem,freeModalCourseDetailIndex) => {
                if(freeModalCourseDetailItem.value != '' && freeModalCourseDetailItem.value != undefined && freeModalCourseDetailItem.value != null){
                    return(
                        <li className={styles.cont_content} key={'free_cont_detail_content_'+freeModalCourseDetailIndex}>{freeModalCourseDetailItem.value}</li>
                    );
                }
            })
            return(
                <p className={styles.cont_sub_title} key={'free_cont_content_'+freeModalContentIndex}>
                    {freeModalContentItem.title || '课程简介'}
                    {freeModalCourseDetail || []}
                </p>
            );
        }

    })

    //课程自定义模板补充说明及详情数据渲染
    let freeModalCourseSupple = [];
    freeModalCourseSupple = koubeiGoods.freeSuppleModalContent.map((freeModalCourseSuppleItem,freeModalCourseSuppleIndex) => {
        if(freeModalCourseSuppleItem.title != '' && freeModalCourseSuppleItem.title != null && freeModalCourseSuppleItem.title != undefined){
            let freeModalCourseSuppleDetail = [];
            freeModalCourseSuppleDetail = (freeModalCourseSuppleItem.details).map((freeModalCourseSuppleDetailItem,freeModalCourseSuppleDetailIndex) => {
                if(freeModalCourseSuppleDetailItem.value != '' && freeModalCourseSuppleDetailItem.value != undefined && freeModalCourseSuppleDetailItem.value != null){
                    return(
                        <li className={styles.cont_content} key={'free_cont_detail_content_supple'+freeModalCourseSuppleDetailIndex}>{freeModalCourseSuppleDetailItem.value}</li>
                    );
                }
            })
            return(
                <p className={styles.cont_sub_title} key={'free_cont_content_supple' + freeModalCourseSuppleIndex}>
                    {freeModalCourseSuppleItem.title || ''}<br/>
                    { freeModalCourseSuppleDetail || [] }
                </p>
            );
        }
    })


    return (
        <div className={styles.goods_info_preview_cont}>
            <div className={styles.goods_info_preview_content}>

                <div className={styles.picture_banner_cont}>
                    <Carousel autoplay>
                        {imgList}
                    </Carousel>
                </div>

                <div className={styles.pre_goods_cont1}>

					<div className={styles.pre_goods_title}>
						<span className={styles.org_name}>商家名称</span>
						<span className={styles.goods_subject}>{(koubeiGoods.subject || '商品名称')}</span>
					</div>

					<div className={styles.pre_goods_priceandcount}>
						<span className={styles.pre_goods_price}>
							<span className={styles.xianjia_price}>{koubeiGoods.price || '现价'}</span><span className={styles.xianjia_price_unit}>元</span>
							<span className={styles.yuanjia_price}><s>{koubeiGoods.originalPrice || '原价'}</s></span><span className={styles.yuanjia_price_unit}>元</span>
						</span>

						<span className={styles.pre_goods_count}>
							<span className={styles.all_count}>仅售{koubeiGoods.inventory || '库存'}份</span><span className={styles.hassale_count}>已售0份</span>
						</span>
					</div>

					<div className={styles.pre_goods_other}>
						<span className={styles.pre_goods_other_item}>
							<img src={'https://img.ishanshan.com/gimg/img/c9f9893bb98bb7d722d9a81a6444f650'} />
							<span className={styles.pre_goods_other_item_text}>随时退</span>
						</span>
						<span className={styles.pre_goods_other_item}>
							<img src={'https://img.ishanshan.com/gimg/img/c9f9893bb98bb7d722d9a81a6444f650'} />
							<span className={styles.pre_goods_other_item_text}>过期退</span>
						</span>
					</div>
				</div>

               {koubeiGoods.goodsType == 'course' && koubeiGoods.freeOrTemplate == '1' ?
                    <div className={styles.pre_goods_desc}>
                        <p className={styles.cont_title}>详细内容</p>

                        <p className={styles.cont_sub_title}>课程简介</p>
                        {koubeiGoods.goodsIntro && koubeiGoods.goodsIntro.map(function(goodsIntroItem,  goodsIntroIndex) {
                            return (<p className={styles.cont_content} key={'cont_content_' + goodsIntroIndex}><li>{goodsIntroItem || '课程简介'}</li></p>);
                        })}

                        <p className={styles.cont_sub_title}>课程类型</p>
                        <p className={styles.cont_content}><li>{koubeiGoods.courseType || '课程类型'}</li></p>

                        <p className={styles.cont_sub_title}>适合年龄</p>
                        <p className={styles.cont_content}><li>{koubeiGoods.age || '适合年龄'}</li></p>

                        <p className={styles.cont_sub_title}>课时数</p>
                        <p className={styles.cont_content}><li>{koubeiGoods.courseHour ? koubeiGoods.courseHour + '_课时' : '课时数'}</li></p>

                        <p className={styles.cont_sub_title}>课程时长</p>
                        <p className={styles.cont_content}><li>{koubeiGoods.courseDuring ? koubeiGoods.courseDuring + '_分钟' : '课程时长'}</li></p>
                    </div>

				: koubeiGoods.goodsType == 'course' && koubeiGoods.freeOrTemplate == '2' ?
                    <div className={styles.pre_goods_desc}>
                        <p className={styles.cont_title}>详细内容</p>
                        { freeModalCourse || [] }
                    </div>
                :

                koubeiGoods.goodsType == 'activity' && koubeiGoods.freeOrTemplate == '1' ?

				<div className={styles.pre_goods_desc}>
					<p className={styles.cont_title}>详细内容</p>

					<p className={styles.cont_sub_title}>活动简介</p>
					{koubeiGoods.goodsIntro && koubeiGoods.goodsIntro.map(function(goodsIntroItem,  goodsIntroIndex) {
                        return (<p className={styles.cont_content} key={'cont_content_' + goodsIntroIndex}><li>{goodsIntroItem || '活动简介'}</li></p>);
                    })}

					<p className={styles.cont_sub_title}>活动时间</p>
					<p className={styles.cont_content}><li>{koubeiGoods.activityTime || '活动时间'}</li></p>

					<p className={styles.cont_sub_title}>活动地址</p>
					<p className={styles.cont_content}><li>{koubeiGoods.activityAddr || '活动地址'}</li></p>

					<p className={styles.cont_sub_title}>适合年龄</p>
					<p className={styles.cont_content}><li>{koubeiGoods.age || '适合年龄'}</li></p>

				</div>

				: koubeiGoods.goodsType == 'activity' && koubeiGoods.freeOrTemplate == '2' ?
                    <div className={styles.pre_goods_desc}>
                        <p className={styles.cont_title}>详细内容</p>
                        { freeModalCourse || [] }
                    </div>
                :
                null
               }

				<div className={styles.pre_goods_desc}>
					<p className={styles.cont_title}>购买须知</p>

					<p className={styles.cont_sub_title}>有效期</p>
					<p className={styles.cont_content}><li>{koubeiGoods.validityPeriod ? `购买后${koubeiGoods.validityPeriod}天内有效` : '有效期'}</li></p>

                    { koubeiGoods.freeOrTemplate == '2' ?
                        <div>
                            { freeModalCourseSupple || [] }
                        </div>
                        :
                        <div>
                            <p className={styles.cont_sub_title}>预约信息</p>
                            <p className={styles.cont_content}><li>{koubeiGoods.reservation || '预约信息'}</li></p>

                            <p className={styles.cont_sub_title}>试用人群</p>
                            <p className={styles.cont_content}><li>{koubeiGoods.fitPerson || '试用人群'}</li></p>

                            <p className={styles.cont_sub_title}>规则提醒</p>
                            <p className={styles.cont_content}><li>{koubeiGoods.ruleRemind || '规则提醒'}</li></p>
                        </div>
                    }

				</div>

            </div>
        </div>
    );
};

export default KoubeiGoodsPreview;
