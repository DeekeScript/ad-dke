import { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
        width: 120,
        fixed: 'left',
    },
    {
        title: '设备ID',
        dataIndex: 'machine_id',
        width: 120,
        //search: false,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: '视频标题',
        dataIndex: 'title',
        ellipsis: true,
        copyable: true,
        width: 320,
        search: false,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: '操作内容',
        dataIndex: 'id',
        search: false,
        width: 180,
        render: (text, record) => {
            return <div>
                {record.is_zan ? <Tag>点赞</Tag> : undefined}
                {record.is_focus ? <Tag>关注</Tag> : undefined}
                {record.is_private_msg ? <Tag>私信</Tag> : undefined}
                {record.is_comment ? <Tag>评论</Tag> : undefined}
                {record.is_view_user ? <Tag>查看主页</Tag> : undefined}
            </div>
        }
    },
    {
        title: '评论内容',
        search: false,
        ellipsis: true,
        copyable: true,
        width: 320,
        dataIndex: 'comment_msg',
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '评论时间',
        search: false,
        dataIndex: 'comment_msg_time',
        width: 180,
        render: (text: string) => {
            if (text) {
                return moment(text * 1000).format("YYYY-MM-DD HH:mm:ss");
            }
            return '-';
        },
    },
    {
        title: '私信内容',
        ellipsis: true,
        copyable: true,
        width: 320,
        dataIndex: 'private_msg',
        search: false,
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '私信时间',
        search: false,
        width: 180,
        dataIndex: 'msg_time',
        render: (text: string) => {
            if (text) {
                return moment(text * 1000).format("YYYY-MM-DD HH:mm:ss");
            }
            return '-';
        },
    },
    {
        title: '关注时间',
        search: false,
        width: 180,
        dataIndex: 'focus_time',
        render: (text: string) => {
            if (text) {
                return moment(text * 1000).format("YYYY-MM-DD HH:mm:ss");
            }
            return '-';
        },
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTimeRange',
        width: 180,
        search: {
            transform: (value) => {
                return {
                    startTime: value[0],
                    endTime: value[1],
                };
            },
        },
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
