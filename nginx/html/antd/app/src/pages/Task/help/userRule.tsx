import { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
        fixed: 'left',
        width: 100,
    },
    {
        title: '名称',
        dataIndex: 'name',
        ellipsis: true,
        width: 200,
        copyable: true,
    },
    {
        title: '性别',
        dataIndex: 'gender',
        search: false,
        render: (text) => {
            if (!text) {
                return '-';
            }

            text = JSON.parse(text);
            if (text.length === 3) {
                return <Tag>不限</Tag>
            }

            let genders = ['', '男', '女', '未知'];
            return text.map((item, key) => {
                return <Tag key={key}>{genders[item]}</Tag>
            });
        }
    },
    {
        title: '年龄',
        tip: '年龄范围',
        dataIndex: 'min_age',
        search: false,
        render: (text, record) => {
            if (record.min_age === 0 && record.max_age === 0) {
                return '-';
            }
            return record.min_age + ' - ' + record.max_age;
        }
    },
    {
        title: 'IP限制',
        dataIndex: 'province_name',
        search: false,
        render: (v) => {
            if (!v) {
                return '-';
            }
            return v.map((item, key) => {
                return <Tag key={key}>{item}</Tag>
            })
        }
    },
    {
        title: '个人号',
        dataIndex: 'is_person',
        search: false,
        valueEnum: {
            0: { text: '不限' },
            1: {
                text: '是',
            },
            2: {
                text: '否',
            },
        }
    },
    {
        title: '开通橱窗',
        dataIndex: 'open_window',
        search: false,
        valueEnum: {
            0: { text: '不限' },
            1: {
                text: '是',
            },
            2: {
                text: '否',
            },
        }
    },
    {
        title: '团购达人',
        dataIndex: 'is_tuangou',
        search: false,
        valueEnum: {
            0: { text: '不限' },
            1: {
                text: '是',
            },
            2: {
                text: '否',
            },
        }
    },
    {
        title: '获赞数',
        tip: '获赞数范围',
        dataIndex: 'min_zan',
        render: (text, record) => {
            if (record.min_zan === 0 && record.max_zan === 0) {
                return '-';
            }
            return record.min_zan + ' - ' + record.max_zan;
        },
        search: false,
    },
    {
        title: '关注数',
        tip: '关注数范围',
        dataIndex: 'min_focus',
        search: false,
        render: (text, record) => {
            if (record.min_focus === 0 && record.max_focus === 0) {
                return '-';
            }
            return record.min_focus + ' - ' + record.max_focus;
        }
    },
    {
        title: '粉丝数',
        tip: '粉丝数范围',
        dataIndex: 'min_fans',
        search: false,
        render: (text, record) => {
            if (record.min_fans === 0 && record.max_fans === 0) {
                return '-';
            }
            return record.min_fans + ' - ' + record.max_fans;
        }
    },
    {
        title: '作品数',
        tip: '作品数范围',
        dataIndex: 'min_works',
        search: false,
        render: (text, record) => {
            if (record.min_works === 0 && record.max_works === 0) {
                return '-';
            }
            return record.min_works + ' - ' + record.max_works;
        }
    },
    {
        title: '包含关键词',
        tip: '简介包含关键词',
        dataIndex: 'contain',
        ellipsis: true,
        width: 200,
        copyable: true,
        search: false,
    },
    {
        title: '不包含关键词',
        tip: '简介不包含关键词',
        dataIndex: 'no_contain',
        ellipsis: true,
        width: 200,
        copyable: true,
        search: false,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        width: 180,
        search: false,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
