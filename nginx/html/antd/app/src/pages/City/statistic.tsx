import { machineDataList, cityStatistics } from '@/services/api/api';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, StatisticCard } from '@ant-design/pro-components';
import { Col, message, Popconfirm, Radio } from 'antd';
import React from 'react';
import { history } from 'umi';
import { columns } from './help/statistics';

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
    const res = await cityStatistics(params);
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

    const res = await machineDataList(params);
    return res;
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
                value: this.state.statistic?.refresh_video_count || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日新增关注数',
                value: this.state.statistic?.inc_focus_count || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日取消关注数',
                value: this.state.statistic?.dec_focus_count || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日点赞数',
                value: this.state.statistic?.zan_count || 0,
              }}
            />
            <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日评论数',
                value: this.state.statistic?.comment_count || 0,
              }}
            />
            {/* <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日发视频用户数',
                value: this.state.statistic?.new_works_user_count || 0,
              }}
            /> */}
            {/* <StatisticCard
              statistic={{
                title: (this.state.date === 1 ? '昨' : this.state.date) + '日点赞评论数',
                value: this.state.statistic?.zan_commet_count || 0,
              }}
            /> */}
          </StatisticCard.Group>
        </Col>

        <ProTable
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          search={{ labelWidth: 66, }}
          request={this.getData}
          columns={[...columns]}
        />
      </PageContainer>
    );
  }
}
