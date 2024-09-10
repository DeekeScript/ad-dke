import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
    },
    {
        title: '抖音昵称',
        dataIndex: 'nickname',
    },
    {
        title: '抖音账号',
        dataIndex: 'account',
        renderText: (val: string) => `${val}`,
    },
    {
        title: '距离',
        dataIndex: 'distance',
        search: false,
        render(v) {
            if (!v) {
                return '-';
            }
            return v + 'km';
        }
    },
    {
        title: '年龄',
        dataIndex: 'age',
        search: false,
    },
    {
        title: '性别',
        dataIndex: 'gender',
        search: false,
        valueEnum: {
            3: { text: '未知' },
            1: {
                text: '男',
            },
            2: {
                text: '女',
            },
        },
    },
    {
        title: '获赞数',
        dataIndex: 'zan_count',
        search: false,
    },
    {
        title: '粉丝数',
        dataIndex: 'fans_count',
        search: false,
    },
    {
        title: '关注数',
        dataIndex: 'focus_count',
        search: false,
    },
    {
        title: '作品数',
        dataIndex: 'works_count',
        search: false,
    },
    {
        title: '介绍',
        dataIndex: 'introduce',
        ellipsis: true,
        copyable: true,
        width: 240,
        search: false,
    },
    {
        title: '用户详情',
        dataIndex: 'account',
        search: false,
        render(v) {
            return <a target="_blank" href={'https://www.douyin.com/search/' + v + '?source=switch_tab&type=user'}>点击查看</a>
        }
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        search: false,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
