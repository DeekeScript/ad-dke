import {
  DrawerForm,
  ProFormDigitRange,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const CommentRuleUpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();

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
      <ProFormText name="name" labelCol={{ span: 5 }} rules={[
        { required: true, message: '名称不能为空' }
      ]} label="名称" initialValue={props.values?.name || ''} />

      <ProFormSelect
        mode='multiple'
        name="nickname_type"
        initialValue={props.values?.nickname_type && JSON.parse(props.values?.nickname_type)}
        labelCol={{ span: 5 }}
        label="昵称类型"
        rules={[
          { required: true, message: '昵称类型不能为空' }
        ]}
        options={[
          { label: '不限', value: 0 },
          { label: '含字母', value: 1 },
          { label: '含数字', value: 2 },
          { label: '含汉字', value: 3 },
          { label: '含表情', value: 4 },
        ]}
        extra={'选择“字母”表示含字母即可；选择两个表示必须同时包含两者，以此类推'}
      />
      <ProFormSelect
        name="in_time"
        initialValue={props.values?.in_time}
        labelCol={{ span: 5 }}
        label="时间限制"
        rules={[
          { required: true, message: '时间限制不能为空' }
        ]}
        options={[
          { label: '30分钟内', value: 1 },
          { label: '1小时内', value: 2 },
          { label: '12小时内', value: 3 },
          { label: '3天内', value: 4 },
          { label: '7天内', value: 5 },
          { label: '1月内', value: 6 },
          { label: '3月内', value: 7 },
          { label: '6月内', value: 8 },
          { label: '不限制', value: 9 },
        ]}
        extra={'如果用户的评论时间满足此要求，则可能会对这条评论或者这条评论的用户进行操作'}
      />
      <ProFormSelect
        mode='multiple'
        name="province_id"
        initialValue={props.values?.province_id ? JSON.parse(props.values?.province_id) : undefined}
        labelCol={{ span: 5 }}
        label="IP限制"
        rules={[
          { required: true, message: 'IP限制不能为空' }
        ]}
        request={async () => {
          let res = await props.getProvince();
          if (res.success) {
            let r = res.data.map((item) => {
              return { label: item.name, value: item.id };
            });
            r.unshift({ label: '不限制', value: 0 });
            return r;
          }
        }}
        extra={'如果用户的评论IP满足此要求，则可能会对这条评论或者这条评论的用户进行操作'}
      />
      <ProFormDigitRange
        label="评论长度区间"
        name={'comment_range'}
        initialValue={[props.values?.min_comment, props.values?.max_comment]}
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        extra={'不设置或者都设置为0则不限制'}
      />
      <ProFormDigitRange
        label="点赞数区间"
        name="zan_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_zan, props.values?.max_zan]}
        extra={'不设置或者都设置为0则不限制'}
      />
      <ProFormTextArea initialValue={props.values?.contain || ''} label={'包含关键词'} labelCol={{ span: 5 }} name={'contain'} extra={<div>多个关键词使用中文逗号（，）或者英文逗号（,）隔开即可！<a target={'_blank'} href='https://docs.qq.com/doc/DTk9sQ1RMdnZsaU5P'>点击查看详细规则</a></div>} />
      <ProFormTextArea initialValue={props.values?.no_contain || ''} label={'不包含关键词'} labelCol={{ span: 5 }} name={'no_contain'} extra={<div>多个关键词使用中文逗号（，）或者英文逗号（,）隔开即可！<a target={'_blank'} href='https://docs.qq.com/doc/DTk9sQ1RMdnZsaU5P'>点击查看详细规则</a></div>} />
    </DrawerForm>
  );
};
export default CommentRuleUpdateForm;
