import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Alert, Form } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const UpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();
  const [type, setType] = useState(props.values?.end_type);
  const [videoRules, setVideoRules] = useState([]);

  let options = [];
  for (let i = 0; i < 24; i++) {
    options.push({ label: (i > 9 ? i : '0' + i) + ':00 - ' + (i > 9 ? i : '0' + i) + ':59', value: i });
  }

  return (
    <DrawerForm
      title={props.values ? '编辑' : '添加'}
      form={form}
      preserve={false}
      trigger={
        props.btn
      }
      layout={'horizontal'}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (data) => {
        console.log(data);
        data.id = props.values?.id || 0;
        return props.onSubmit(data);
      }}
      width={"580px"}
      onVisibleChange={async (v) => {
        if (!v) {
          return true;
        }
        let res = await props.getVideoRules({ is_city: props.values?.is_city });
        if (res.success) {
          setVideoRules(res.data);
        }
      }}
    >
      <Alert type="warning" style={{ marginBottom: '24px' }} description={"前期规则设置可以适当放宽，后续可以根据数据反馈做相应调整哦！"} />
      <ProFormText name="name" rules={[
        {
          required: true,
          message: '请输入名称',
        },
      ]} label="名称" labelCol={{ span: 6 }} initialValue={props.values?.name || ''} />
      <ProFormSelect
        name="is_city"
        labelCol={{ span: 6 }}
        label="是否同城"
        options={[
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ]}
        fieldProps={{
          onChange: async (v) => {
            let res = await props.getVideoRules({ is_city: v });
            form.setFieldValue('video_rule', []);
            if (res.success) {
              setVideoRules(res.data);
            }
          }
        }}
        rules={[
          {
            required: true,
            message: '请选择是否同城',
          },
        ]}
        initialValue={props.values?.is_city}
        extra={<div>选择“是”，则本任务为同城任务，只会刷同城视频</div>}
      />
      <ProFormSelect
        name="type"
        labelCol={{ span: 6 }}
        label="类型"
        options={[
          { label: '完全模拟人|刷视频｜评论｜点赞｜关注｜私信等', value: 1 },
          //{ label: '完全模拟人|养号', value: 2 },
        ]}
        rules={[
          {
            required: true,
            message: '请选择类型',
          },
        ]}
        initialValue={props.values?.type || undefined}
        extra={<div>如果你的账号还没有养号【人工养号更佳】，请参阅养号细则，请参考：<a target={'_blank'} href='https://docs.qq.com/doc/DTlhDYnV6WHNDSVph'>点击查看详情</a></div>}
      />
      <ProFormSelect
        mode='multiple'
        name="hour"
        labelCol={{ span: 6 }}
        label="时间段"
        options={options}
        rules={[
          {
            required: true,
            message: '请输入时间段',
          },
        ]}
        initialValue={props.values?.hour && JSON.parse(props.values?.hour)}
        extra={'为躲避风控，建议每天运行6小时（分时段）左右；请根据自己的行业属性设置时间段'}
      />
      <ProFormSelect mode='multiple' name="video_rule" options={videoRules} fieldProps={{  }} rules={[
        {
          required: true,
          message: '请选择视频规则',
        },
      ]} labelCol={{ span: 6 }} label="视频规则" initialValue={props.values?.video_rule && JSON.parse(props.values?.video_rule)} extra={'如果选择的是同城任务，则需要创建同城视频规则'} />
      <ProFormSelect mode='multiple' name="user_rule" request={async () => {
        let res = await props.getUserRules();
        return res.data;
      }} rules={[
        {
          required: true,
          message: '请选择达人规则',
        },
      ]} labelCol={{ span: 6 }} label="达人规则" initialValue={props.values?.user_rule && JSON.parse(props.values?.user_rule)} extra={'视频作者的规则'} />
      <ProFormSelect mode='multiple' name="comment_user_rule" request={async () => {
        let res = await props.getUserRules();
        return res.data;
      }} rules={[
        {
          required: true,
          message: '请选择用户规则',
        },
      ]} labelCol={{ span: 6 }} label="用户规则" initialValue={props.values?.comment_user_rule && JSON.parse(props.values?.comment_user_rule)} extra={'被私信用户规则'} />
      <ProFormSelect mode='multiple' rules={[
        {
          required: true,
          message: '请选择评论规则',
        },
      ]} name="comment_rule" request={async () => {
        let res = await props.getCommentRules();
        return res.data;
      }} labelCol={{ span: 6 }} label="评论规则" initialValue={props.values?.comment_rule && JSON.parse(props.values?.comment_rule)} />
      <ProFormSelect mode='multiple' name="lib_id" request={async () => {
        let res = await props.getSpeechLib();
        return res.data;
      }} rules={[
        {
          required: true,
          message: '请选择话术库',
        },
      ]} labelCol={{ span: 6 }} label="话术库" initialValue={props.values?.lib_id && JSON.parse(props.values?.lib_id)} />
      <ProFormSelect name={'end_type'} label={'任务结束类型'} labelCol={{ span: 6 }} initialValue={props.values?.end_type} options={[
        { label: '不限制', value: 0 },
        { label: '视频数达到限制', value: 1 },
        { label: '目标视频数达到限制', value: 2 },
        { label: '消息数达到限制', value: 3 }
      ]} rules={[
        {
          required: true,
          message: '请输入任务结束类型',
        },
      ]} fieldProps={{
        onChange: (v) => setType(v * 1)
      }} style={{ marginBottom: 16 }} />
      {type === 0 ? null : <ProFormDigit rules={[
        {
          required: true,
          message: '请输入限制数量',
        },
      ]} name="limit_count" labelCol={{ span: 6 }} label="限制数量" initialValue={props.values?.limit_count || ''} />}
      <ProFormSelect name="comment_zan_fre" rules={[
        {
          required: true,
          message: '请选择点赞视频评论频率',
        },
      ]} labelCol={{ span: 6 }} label="点赞视频评论频率" options={[
        { label: '不点赞视频评论', value: 0 },
        { label: '小于10个/小时【很安全】', value: 1 },
        { label: '10-20个/小时【很安全】', value: 2 },
        { label: '20-30个/小时【较安全】', value: 3 },
        { label: '30-40个/小时【较安全】', value: 4 },
        { label: '40-50个/小时【不可持续】', value: 5 },
        { label: '50-60个/小时【不可持续】', value: 6 },
        { label: '大于60个/小时【高危】', value: 7 },
      ]} initialValue={props.values?.comment_zan_fre} extra={'数值不是越大越好，太大了容易被风控捕捉'} />
      <ProFormSelect name="comment_fre" rules={[
        {
          required: true,
          message: '请选择评论视频频率',
        },
      ]} labelCol={{ span: 6 }} label="评论视频频率" options={[
        { label: '不评论视频', value: 0 },
        { label: '低【很安全】', value: 1 },
        { label: '中低【很安全】', value: 2 },
        { label: '中【较安全】', value: 3 },
        { label: '中高【较安全】', value: 4 },
        { label: '高【不可持续】', value: 5 },
      ]} initialValue={props.values?.comment_fre} extra={'频率跟话术库的内容种类有一定关系，种类太少，频率高，风险更大'} />
      <ProFormSelect name="private_fre" rules={[
        {
          required: true,
          message: '请选择私信用户频率',
        },
      ]} labelCol={{ span: 6 }} label="私信用户频率" options={[
        { label: '不私信用户', value: 0 },
        { label: '低【很安全】', value: 1 },
        { label: '中低【很安全】', value: 2 },
        { label: '中【较安全】', value: 3 },
        { label: '中高【较安全】', value: 4 },
        { label: '高【不可持续】', value: 5 },
      ]} initialValue={props.values?.private_fre} extra={'频率跟话术库的内容种类有一定关系，种类太少，频率高，风险更大'} />

      <ProFormSelect name="focus_fre" rules={[
        {
          required: true,
          message: '请选择关注用户频率',
        },
      ]} labelCol={{ span: 6 }} label="关注用户频率" options={[
        { label: '不关注用户', value: 0 },
        { label: '低【很安全】', value: 1 },
        { label: '中低【很安全】', value: 2 },
        { label: '中【较安全】', value: 3 },
        { label: '中高【较安全】', value: 4 },
        { label: '高【不可持续】', value: 5 },
      ]} initialValue={props.values?.focus_fre} extra={'请定期清理关注的人，尽量让关注人数小于自己的粉丝数量'} />

      <ProFormSelect name="video_zan_fre" rules={[
        {
          required: true,
          message: '请选择点赞视频频率',
        },
      ]} labelCol={{ span: 6 }} label="点赞视频频率" options={[
        { label: '不点赞视频', value: 0 },
        { label: '小于5%【很安全】', value: 1 },
        { label: '5%-10%【很安全】', value: 2 },
        { label: '10%-15%【很安全】', value: 3 },
        { label: '15%-20%【较安全】', value: 4 },
        { label: '20%-30%【较安全】', value: 5 },
        { label: '30%-40%【不可持续】', value: 6 },
        { label: '大于50%【高危】', value: 7 },
      ]} initialValue={props.values?.video_zan_fre} extra={'数值不是越大越好，太大了容易被风控捕捉'} />
      <ProFormSelect rules={[
        {
          required: true,
          message: '请选择刷视频频率',
        },
      ]} name="refresh_video_fre" labelCol={{ span: 6 }} label="刷视频频率" options={[
        { label: '小于100条/小时【很安全】', value: 1 },
        { label: '100-150条/小时【很安全】', value: 2 },
        { label: '150-250条/小时【较安全】', value: 3 },
        { label: '250-350条/小时【较安全】', value: 4 },
        { label: '350-400条/小时【不可持续】', value: 5 },
        { label: '大于400条/小时【高危】', value: 6 },
      ]} initialValue={props.values?.refresh_video_fre} extra={'数值不是越大越好，太大了容易被风控捕捉'} />
      <ProFormSelect name="state" rules={[
        {
          required: true,
          message: '请输入任务可用状态',
        },
      ]} labelCol={{ span: 6 }} label="任务可用状态" options={[
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ]} initialValue={props.values?.state} extra={'关闭后，手机端无法查看到此任务'} />
      <ProFormDateTimePicker name={'end_time'} label={'任务结束时间'} labelCol={{ span: 6 }} extra={'不填写表示不限制结束时间'} initialValue={props.values?.end_time ? moment(props.values.end_time * 1000).format("YYYY-MM-DD HH:mm:ss") : undefined} />
      <ProFormTextArea name="desc" labelCol={{ span: 6 }} label="描述" initialValue={props.values?.desc || ''} />
    </DrawerForm>
  );
};
export default UpdateForm;
