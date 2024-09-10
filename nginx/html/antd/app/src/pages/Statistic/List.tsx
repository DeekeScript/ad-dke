import { removeStatistic, statisticList, statistic } from '@/services/api/api';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, StatisticCard } from '@ant-design/pro-components';
import { Col, message, Popconfirm, Radio } from 'antd';
import React from 'react';
import { history } from 'umi';
import { columns } from './help/list';

export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
    date: 1,
    statistic: {},
    user_id: history.location.query?.user_id,
    agent_user_id: history.location.query?.agent_user_id,
  }

  async componentDidMount(): Promise<void> {
    await this.getStatistic(this.state.date);
  }

  getStatistic = async (date: number) => {
    let params = {
      date: date,
    }
    if (this.state.user_id) {
      params['p_user_id'] = this.state.user_id;
    }

    if (this.state.agent_user_id) {
      params['p_user_id'] = this.state.agent_user_id;
    }
    const res = await statistic(params);
    if (res.success) {
      this.setState({
        statistic: res.data
      });
    }
  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    if (this.state.user_id) {
      params['p_user_id'] = this.state.user_id;
    }

    if (this.state.agent_user_id) {
      params['p_user_id'] = this.state.agent_user_id;
    }

    const res = await statisticList(params);
    return res;
  }

  handleRemove = async (id: number) => {
    let res = await removeStatistic({
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
        <Col style={{ background: '#ffffff' }}>
          <Radio.Group value={this.state.date} onChange={async (v) => {
            this.setState({
              date: v.target.value
            });
            await this.getStatistic(v.target.value);
          }} style={{ margin: 24 + 'px' }}>
            <Radio.Button value={1}>昨日统计数据</Radio.Button>
            <Radio.Button value={7}>近7天统计数据</Radio.Button>
            <Radio.Button value={30}>近30天统计数据</Radio.Button>
          </Radio.Group>

          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日浏览视频数',
                value: this.state.statistic?.view_video || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日浏览目标视频数',
                value: this.state.statistic?.target_video || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日点赞视频数',
                value: this.state.statistic?.zan || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日点赞评论数',
                value: this.state.statistic?.zan_comment || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日评论数',
                value: this.state.statistic?.comment || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日私信用户数',
                value: this.state.statistic?.private_user || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日关注用户数',
                value: this.state.statistic?.focus_user || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日访问用户主页数',
                value: this.state.statistic?.view_user || 0,
              }}
            />
          </StatisticCard.Group>
        </Col>
        <ProTable
          style={{ marginTop: '24px' }}
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          search={false}
          toolBarRender={() => [

          ]}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
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
