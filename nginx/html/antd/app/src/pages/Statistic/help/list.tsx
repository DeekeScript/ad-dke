import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
    },
    {
        title: '任务名称',
        dataIndex: 'task_id',
        search: false,
    },
    {
        title: '设备ID',
        dataIndex: 'machine_id',
        search: false,
    },
    {
        title: '点赞视频数',
        dataIndex: 'zan',
        search: false,
    },
    {
        title: '评论视频数',
        dataIndex: 'comment',
        search: false,
    },
    {
        title: '点赞评论数',
        dataIndex: 'zan_comment',
        search: false,
    },
    {
        title: '评论评论数',
        dataIndex: 'comment_comment',
        search: false,
    },
    {
        title: '关注用户数',
        dataIndex: 'focus_user',
        search: false,
    },
    {
        title: '关注评论区用户数',
        dataIndex: 'focus_comment_user',
        search: false,
    },
    {
        title: '私信用户数',
        dataIndex: 'private_user',
        search: false,
    },
    {
        title: '私信评论区用户数',
        dataIndex: 'private_comment_user',
        search: false,
    },
    {
        title: '浏览视频数',
        dataIndex: 'view_video',
        search: false,
    },
    {
        title: '目标视频数',
        dataIndex: 'target_video',
        search: false,
    },
    {
        title: '查看用户主页数',
        dataIndex: 'view_user',
        search: false,
    },
    {
        title: '统计日期',
        dataIndex: 'date',
        valueType: 'date',
        search: false,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD");
        }
    },
];
