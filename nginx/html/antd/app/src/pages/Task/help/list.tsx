import { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
        fixed: 'left',
        width: 120,
    },
    {
        title: '名称',
        dataIndex: 'name',
        ellipsis: true,
        width: 200,
        copyable: true,
    },
    {
        title: '是否同城',
        dataIndex: 'is_city',
        search: false,
        valueEnum: {
            0: { text: '否' },
            1: {
                text: '是',
            },
        }
    },
    {
        title: '描述',
        dataIndex: 'desc',
        ellipsis: true,
        width: 200,
        copyable: true,
        search: false,
    },
    {
        title: '达人规则',
        dataIndex: 'user_rules_names',
        //hideInForm: true,
        search: false,
        render: (text) => {
            return text.map((item) => {
                return <Tag key={item}>{item}</Tag>
            });
        }
    },
    {
        title: '用户规则',
        dataIndex: 'comment_user_rules_names',
        //hideInForm: true,
        search: false,
        render: (text) => {
            return text.map((item) => {
                return <Tag key={item}>{item}</Tag>
            });
        }
    },
    {
        title: '视频规则',
        dataIndex: 'video_rules_names',
        //hideInForm: true,
        search: false,
        render: (text) => {
            return text.map((item) => {
                return <Tag key={item}>{item}</Tag>
            });
        }
    },
    {
        title: '评论规则',
        dataIndex: 'comment_rules_names',
        //hideInForm: true,
        search: false,
        render: (text) => {
            return text.map((item) => {
                return <Tag key={item}>{item}</Tag>
            });
        }
    },
    {
        title: '话术库',
        dataIndex: 'speech_names',
        //hideInForm: true,
        width: 200,
        search: false,
        render: (text) => {
            return text.map((item) => {
                return <Tag key={item['name']}>{item.name + '[' + (item.type === 0 ? '私信' : '评论') + ']'}</Tag>
            });
        }
    },
    {
        title: '任务结束条件',
        dataIndex: 'end_type',
        search: false,
        render: (val, record) => {
            if (val === 0) {
                return "不限制";
            }

            if (val === 1) {
                return "视频数达到：" + record.limit_count;
            }

            if (val === 2) {
                return "目标视频数达到：" + record.limit_count;
            }

            if (val === 3) {
                return "消息数达到：" + record.limit_count;
            }
            return '-';
        }
    },
    {
        title: '状态',
        dataIndex: 'state',
        valueEnum: {
            0: { text: '已关闭' },
            1: {
                text: '已开启',
                status: 'Success',
            },
        },
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        search: false,
        width: 180,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
