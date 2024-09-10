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
        title: '是否评论',
        dataIndex: 'is_comment',
        search: false,
        valueEnum: {
            0: { text: '否' },
            1: {
                text: '是',
            }
        },
    },
    {
        title: '是否点赞',
        dataIndex: 'is_zan',
        search: false,
        valueEnum: {
            0: { text: '否' },
            1: {
                text: '是',
            }
        },
    },
    {
        title: '评论内容',
        dataIndex: 'comment',
        search: false,
        render(v) {
            if (!v) {
                return '-';
            }
            return v;
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
