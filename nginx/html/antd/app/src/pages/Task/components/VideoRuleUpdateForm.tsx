import {
  DrawerForm,
  ProFormDigitRange,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React, { useState } from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const VideoRuleUpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();
  const [city, setCity] = useState(props.values?.is_city);

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
        data.id = props.values?.id || 0;
        return props.onSubmit(data);
      }}
      width={"500px"}
    >
      <ProFormText name="name" labelCol={{ span: 5 }} rules={[{ required: true, message: '名称不能为空' }]} label="名称" initialValue={props.values?.name || ''} />

      <ProFormSelect rules={[
        {
          required: true,
          message: '请选择视频类型',
        },
      ]} name="is_city" labelCol={{ span: 5 }} label="视频类型" options={[
        { label: '同城', value: 1 },
        { label: '推荐', value: 0 },
      ]} fieldProps={{
        onChange: (v) => {
          console.log(v);
          setCity(v === 1 ? true : false);
        }
      }} initialValue={props.values?.is_city} extra={'同城类型的视频规则只能用于同城任务'} />

      {city ? <ProFormSelect rules={[
        {
          required: true,
          message: '视频距离',
        },
      ]} name="distance" labelCol={{ span: 5 }} label="视频距离" options={[
        { label: '不限', value: 0 },
        { label: '3公里以内', value: 1 },
        { label: '5公里以内', value: 2 },
        { label: '10公里以内', value: 3 },
        { label: '20公里以内', value: 4 },
        { label: '30公里以内', value: 5 },
        { label: '50公里以内', value: 6 },
      ]} initialValue={props.values?.distance} /> : undefined}

      {city ? <ProFormSelect rules={[
        {
          required: true,
          message: '视频时间',
        },
      ]} name="in_time" labelCol={{ span: 5 }} label="视频时间" options={[
        { label: '不限', value: 0 },
        { label: '1小时内', value: 1 },
        { label: '12小时内', value: 2 },
        { label: '1天内', value: 3 },
        { label: '3天内', value: 4 },
        { label: '7天内', value: 5 },
        { label: '15天内', value: 6 },
      ]} initialValue={props.values?.in_time} /> : undefined}

      <ProFormDigitRange
        label="点赞数区间"
        name="zan_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_zan, props.values?.max_zan]}
        extra={'不设置或者都设置为0则不限制'}
      />
      <ProFormDigitRange
        label="评论数区间"
        name="comment_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_comment, props.values?.max_comment]}
        extra={'不设置或者都设置为0则不限制'}
      />
      <ProFormDigitRange
        label="收藏数区间"
        name="collect_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_collect, props.values?.max_collect]}
        extra={'不设置或者都设置为0则不限制'}
      />
      <ProFormDigitRange
        label="分享数区间"
        name="share_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_share, props.values?.max_share]}
        extra={'不设置或者都设置为0则不限制'}
      />
      <ProFormTextArea label={'包含关键词'} labelCol={{ span: 5 }} initialValue={props.values?.contain || ''} name={'contain'} extra={<div>多个关键词使用中文逗号（，）或者英文逗号（,）隔开即可！<a target={'_blank'} href='https://docs.qq.com/doc/DTk9sQ1RMdnZsaU5P'>点击查看详细规则</a></div>} />
      <ProFormTextArea label={'不包含关键词'} labelCol={{ span: 5 }} initialValue={props.values?.no_contain || ''} name={'no_contain'} extra={<div>多个关键词使用中文逗号（，）或者英文逗号（,）隔开即可！<a target={'_blank'} href='https://docs.qq.com/doc/DTk9sQ1RMdnZsaU5P'>点击查看详细规则</a></div>} />
    </DrawerForm>
  );
};
export default VideoRuleUpdateForm;
