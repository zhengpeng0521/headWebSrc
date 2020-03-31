import React from 'react';
import { Popover } from 'antd';

module.exports = [
                    {
                        key: 'id',
                        title: '编号',
                        dataIndex: 'id',
                        width: 150,
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },{
                        key: 'tradeNo',
                        title: '交易单号',
                        dataIndex: 'tradeNo',
                        width: 200,
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },{
                        key: 'businessType',
                        title: '业务类型',
                        dataIndex: 'businessType',
                        width: 120,
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },{
                        key: 'businessName',
                        title: '业务名称',
                        dataIndex: 'businessName',
                        width: 200,
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },{
                        key: 'payUser',
                        title: '发生人',
                        dataIndex: 'payUser',
                        width: 150,
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },{
                        key: 'payAmount',
                        title: '发生金额',
                        dataIndex: 'payAmount',
                        width: 150,
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },{
                        key: 'status',
                        title: '支付状态',
                        dataIndex: 'status',
                        width: 150,
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },{
                        key: 'orgName',
                        title: '所属校区',
                        dataIndex: 'orgName',
                        width: 200,
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },{
                        key: 'modifyTime',
                        title: '提交时间',
                        dataIndex: 'modifyTime',
                        render : (text,record) => (
                            <Popover placement="top" content={text} trigger="hover">
                                { text }
                            </Popover>
                        )
                    },
                ]
