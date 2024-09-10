import { videoList, removeVideo } from '@/services/api/api';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Alert, message, Popconfirm } from 'antd';
import React from 'react';
import { columns } from './help/list';
import { history } from "umi";

export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
  }

  componentDidMount(): void {

  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    const res = await videoList(params);
    return res;
  }

  handleRemove = async (id: number) => {
    let res = await removeVideo({
      id: id,
    });
    console.log(res);
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
    }
  }

  render() {
    return (
      <PageContainer>
        <Alert style={{ marginBottom: 12 + 'px' }} type={'warning'} description={'本系统数据主要是为了客户调整任务，为防止用户倒卖数据，系统只储存近7天的数据！ 同时为了提升嘀客性能，可能会存在重复视频，以及非目标视频不会采集点赞数量等数据！'}></Alert>
        <ProTable
          actionRef={this.actionRef}
          rowKey="id"
          search={{ labelWidth: 68, }}
          scroll={{ x: 2200 }}
          toolBarRender={() => [

          ]}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            fixed: 'right',
            width: 280,
            render: (_, record) => [
              record.type === 1 ? <a key={"machine_video_" + record.id} onClick={() => history.push('./detail?id=' + record.id)}>视频明细</a> : null,
              record.type === 1 ? <a key={"machine_comment_" + record.id} onClick={() => history.push('./comment?id=' + record.id)}>评论区明细</a> : null,
              record.type === 1 ? <a key={"machine_user_" + record.id} onClick={() => history.push('./douyin?id=' + record.id)}>用户明细</a> : null,
              <Popconfirm
                key={'delete__' + record.id}
                title="确定删除吗？"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => this.handleRemove(record.id)}
              > <a key={"delete_" + record.id}>删除</a></Popconfirm>,
            ],
          },]}
        />
      </PageContainer>
    );
  }
}
