import React from 'react';
import { Button, Modal, Popconfirm, Spin } from 'antd';
import PageModal from '../micro-module/page-modal/PageModal';
import stylesNormal from "./GameCreateComponent.less";
import stylesTms from './GameCreateComponentTms.less';
//是否是番茄田系统
let isTomato = window.runAs=='tomato' ? true : false;
let styles = !isTomato ? stylesNormal : stylesTms;
function GameCreateComponent({

	attrGameFrameUrl,
	attrShowPageModal,
	newGameLoading,
	isH5, // 是否是H5编辑器
	funcHandleClose,
	funcHandleOnSubmit,
	funcUpdateParams,

}) {
	return (
		<div className="createGame">
			<div className={attrShowPageModal ? styles.mask : ''}></div>
			<div
				className={attrShowPageModal ? (isH5 == 1 ? styles.h5BoxTransformOpen : styles.boxTransformOpen) : attrShowPageModal != undefined ? styles.boxTransformCancel : styles.firstTouch}
			>
				{
					isH5 == 1 ?
					<div className={styles.H5create}>
						<Spin spinning ={newGameLoading} size="large"/>
						<iframe
							src={attrGameFrameUrl || ''}
							frameBorder="0"
							width="100%"
							height="100%"
							marginHeight="0"
							marginWidth="0"
							scrolling="auto">
						</iframe>
					</div>
					:
					<iframe
						src={attrGameFrameUrl || ''}
						frameBorder="0"
						width="100%"
						height="100%"
						marginHeight="0"
						marginWidth="0"
						scrolling="auto"
						allowFullScreen>
					</iframe>
				}
				{/* <iframe
					src={attrGameFrameUrl || ''}
					frameBorder="0"
					width="100%"
					height="100%"
					marginHeight="0"
					marginWidth="0"
					scrolling="auto">
				</iframe> */}

			</div>
		</div>
	);
}

export default GameCreateComponent;

