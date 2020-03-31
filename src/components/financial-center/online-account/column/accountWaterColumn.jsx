import React from 'react';
import { Popover } from 'antd';

module.exports = [
                {
                    key: 'id',
                    title: '编号',
                    dataIndex: 'id',
                    width: 180,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'tradeNo',
                    title: '交易单号',
                    dataIndex: 'tradeNo',
                    width: 250,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'subject',
                    title: '描述',
                    dataIndex: 'subject',
                    width: 250,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'amount',
                    title: '发生金额',
                    dataIndex: 'amount',
                    width: 150,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'balance',
                    title: '账户余额',
                    dataIndex: 'balance',
                    width: 150,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'trxType',
                    title: '类型',
                    dataIndex: 'trxType',
                    width: 100,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'createTime',
                    title: '提交时间',
                    dataIndex: 'createTime',
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },
            ]
