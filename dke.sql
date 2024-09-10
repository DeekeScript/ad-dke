/*
 Navicat Premium Data Transfer

 Source Server         : 官网数据库
 Source Server Type    : MySQL
 Source Server Version : 80033 (8.0.33)
 Source Host           : 127.0.0.1:3306
 Source Schema         : dke

 Target Server Type    : MySQL
 Target Server Version : 80033 (8.0.33)
 File Encoding         : 65001

 Date: 24/02/2024 11:51:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dke_agent
-- ----------------------------
DROP TABLE IF EXISTS `dke_agent`;
CREATE TABLE `dke_agent`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `mobile` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '手机号',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '名称',
  `weixin` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '微信号',
  `douyin` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '抖音号',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '描述',
  `machine_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器数量',
  `all_machine_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '累计机器数量',
  `pay_money` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '消费金额',
  `open_wx` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '开启微信群控',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_mobile`(`mobile` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '代理商' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_city_black_focus_user
-- ----------------------------
DROP TABLE IF EXISTS `dke_city_black_focus_user`;
CREATE TABLE `dke_city_black_focus_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商ID',
  `dy_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '抖音用户id',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_city_focus_user
-- ----------------------------
DROP TABLE IF EXISTS `dke_city_focus_user`;
CREATE TABLE `dke_city_focus_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商',
  `account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音账号',
  `nickname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音昵称',
  `age` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '年龄',
  `gender` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '0未知，1男，2女',
  `zan_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数量',
  `fans_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '粉丝数量',
  `focus_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '粉丝数',
  `introduce` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '介绍',
  `works_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '作品数量',
  `distance` double(4, 2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '第一次距离',
  `is_cancel` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否取消关注，超过10%用户没有发视频，就取消关注',
  `works_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '最新视频链接',
  `no_works_day` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '连续多少天没发作品；目前规定15天没有作品，就取消关注',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 164 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '同城关注列表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_city_focus_user_op
-- ----------------------------
DROP TABLE IF EXISTS `dke_city_focus_user_op`;
CREATE TABLE `dke_city_focus_user_op`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商ID',
  `dy_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关注列表的用户ID',
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
  `is_comment` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否评论',
  `is_zan` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否点赞',
  `has_new_works` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否有新作品',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `date` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '每天的操作',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_city_machine_data
-- ----------------------------
DROP TABLE IF EXISTS `dke_city_machine_data`;
CREATE TABLE `dke_city_machine_data`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音账号',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商ID',
  `focus_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关注数',
  `inc_focus_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '新增关注',
  `dec_focus_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '取消关注数',
  `comment_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论数',
  `zan_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `zan_comment_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞评论数',
  `refresh_video_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '刷视频数量',
  `new_works_user_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '发作品人数',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `date` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '日期',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_comment_rule
-- ----------------------------
DROP TABLE IF EXISTS `dke_comment_rule`;
CREATE TABLE `dke_comment_rule`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '名称',
  `min_comment` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小评论长度',
  `max_comment` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大评论长度',
  `nickname_type` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '0不限，1，字母；2数字；3汉字，4表情，5其他符号',
  `min_zan` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小点赞数',
  `max_zan` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大点赞数',
  `in_time` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '{ label: \'30分钟内\', value: 1 },\n          { label: \'1小时内\', value: 2 },\n          { label: \'12小时内\', value: 3 },\n          { label: \'3天内\', value: 4 },\n          { label: \'7天内\', value: 5 },\n          { label: \'1月内\', value: 6 },\n          { label: \'3月内\', value: 7 },\n          { label: \'6月内\', value: 8 },\n          { label: \'不限制\', value: 9 },',
  `province_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '省份ID集合，json数据',
  `contain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '包含关键词',
  `no_contain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '不包含关键词',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_contact
-- ----------------------------
DROP TABLE IF EXISTS `dke_contact`;
CREATE TABLE `dke_contact`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '状态，0通讯录已同步给手机，1手机已入库，2已完成',
  `detail_update` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否更新了grab_keyword_phone的状态',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 52 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_douyin_method
-- ----------------------------
DROP TABLE IF EXISTS `dke_douyin_method`;
CREATE TABLE `dke_douyin_method`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `douyin` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音号',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `private_close` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '是否不可以私信',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_machine_id`(`machine_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_douyin`(`douyin` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_grab_keyword
-- ----------------------------
DROP TABLE IF EXISTS `dke_grab_keyword`;
CREATE TABLE `dke_grab_keyword`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `keyword` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '关键词',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '描述',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `pass_rate` decimal(10, 2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '通过率',
  `suc_rate` decimal(10, 2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '成功率',
  `repeat_rate` decimal(10, 2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '重复率',
  `fail_rate` decimal(10, 2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '无效率',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '0待运行，1已运行',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `lock` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否锁定，锁定之后，不能操作',
  `lock_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '锁定时间，超过12小时就解开',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 410 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_grab_keyword_phone
-- ----------------------------
DROP TABLE IF EXISTS `dke_grab_keyword_phone`;
CREATE TABLE `dke_grab_keyword_phone`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `keyword_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关键词ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商ID',
  `account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音号',
  `nickname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音昵称',
  `contact_id` int NOT NULL DEFAULT 0 COMMENT '关联dke_contact表，为-1表示是搜索添加，大于0表示为通讯录添加',
  `gender` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '性别',
  `age` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '年龄',
  `mobile` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手机号/电话号',
  `wx` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '微信号',
  `zan_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `focus_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关注数',
  `fans_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '粉丝数',
  `work_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '作品数',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '设备ID',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '状态，1已完成，0未完成',
  `qw_status` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '企业微信状态，0未添加，1已添加',
  `wx_status` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '微信状态0待添加，1添加失败，2添加成功',
  `ip` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'IP，地址',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '类型，0普通号，1蓝V，2微信',
  `desc` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '简介',
  `op_suc` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否添加通讯录成功，如果长时间没成功，定时脚本会重置',
  `op_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '获取数据的时间',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_machine_id`(`machine_id` ASC) USING BTREE,
  INDEX `idx_contact_id`(`contact_id` ASC) USING BTREE,
  INDEX `idx_keyword_id`(`keyword_id` ASC) USING BTREE,
  INDEX `idx_mobile`(`mobile` ASC) USING BTREE,
  INDEX `idx_account`(`account` ASC) USING BTREE,
  INDEX `idx_wx`(`wx` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10032 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_live_code
-- ----------------------------
DROP TABLE IF EXISTS `dke_live_code`;
CREATE TABLE `dke_live_code`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_live_message
-- ----------------------------
DROP TABLE IF EXISTS `dke_live_message`;
CREATE TABLE `dke_live_message`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `code` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关联dke_live_code表',
  `nickname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音昵称，去重使用',
  `text` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '聊天内容',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_code`(`code` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_nickname`(`nickname` ASC) USING BTREE,
  INDEX `idx_text`(`text` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_log
-- ----------------------------
DROP TABLE IF EXISTS `dke_log`;
CREATE TABLE `dke_log`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `agent_user_id` bigint UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理用户ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '0一般错误（不用理会），1致命错误（系统无法正常运行，可能是版本更新导致的等相关问题），2系统缺少设置错误，3其他错误',
  `desc` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '日志内容',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_machine_id`(`machine_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 106542 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_login_log
-- ----------------------------
DROP TABLE IF EXISTS `dke_login_log`;
CREATE TABLE `dke_login_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip` int UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Ip地址',
  `mobile` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '手机号',
  `password` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_ip`(`ip` ASC) USING BTREE,
  INDEX `idx_mobile`(`mobile` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 636 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_machine
-- ----------------------------
DROP TABLE IF EXISTS `dke_machine`;
CREATE TABLE `dke_machine`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '密钥',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理用户ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '机器名称',
  `number` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '机器编号',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '说明',
  `type` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '1无后台，2带后台',
  `mid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '安卓手机唯一识别码',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `start_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '开始时间',
  `ent_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '结束时间',
  `updated_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '每次绑定时间，mid更换之后，需要等待3天才可以',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE,
  INDEX `idx_secret`(`secret` ASC) USING BTREE,
  INDEX `idx_mid`(`mid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 41130 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '代理商' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_op
-- ----------------------------
DROP TABLE IF EXISTS `dke_op`;
CREATE TABLE `dke_op`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '操作，0点赞视频，1点赞评论，2评论，3关注，4私信，5访问主页，6刷视频',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `task_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '任务ID',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_user_agent_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_op`(`type` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_task_id`(`task_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 666749 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_option
-- ----------------------------
DROP TABLE IF EXISTS `dke_option`;
CREATE TABLE `dke_option`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `key` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'key',
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'value',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_key`(`key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_province
-- ----------------------------
DROP TABLE IF EXISTS `dke_province`;
CREATE TABLE `dke_province`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `tx_province_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '省份信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_speech
-- ----------------------------
DROP TABLE IF EXISTS `dke_speech`;
CREATE TABLE `dke_speech`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `lib_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '话术库ID',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '内容',
  `level` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '智能等级，0不使用智能混淆，1使用基础，2高级，3VIP（收费）',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_lib_id`(`lib_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 506 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '评论话术表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_speech_lib
-- ----------------------------
DROP TABLE IF EXISTS `dke_speech_lib`;
CREATE TABLE `dke_speech_lib`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '话术库名称',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '话术库描述',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '1私信，0评论',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_statistic
-- ----------------------------
DROP TABLE IF EXISTS `dke_statistic`;
CREATE TABLE `dke_statistic`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `task_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '任务ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '手机ID',
  `zan` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `comment` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论视频数',
  `zan_comment` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞视频评论数',
  `comment_comment` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论评论数',
  `focus_user` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关注主播数',
  `focus_comment_user` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关注视频下的用户数',
  `private_user` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '私信达人数',
  `private_comment_user` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '私信评论用户数',
  `view_video` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览视频数',
  `target_video` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '目标视频数',
  `view_user` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '查看用户数',
  `date` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '统计日期',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_machine_id`(`machine_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_task_id`(`task_id` ASC) USING BTREE,
  INDEX `idx_date`(`date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 354 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_task
-- ----------------------------
DROP TABLE IF EXISTS `dke_task`;
CREATE TABLE `dke_task`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '商户ID',
  `is_city` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否同城任务',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '任务名称',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '类型，1模拟人，2养号',
  `hour` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '执行时间段',
  `video_rule` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '视频规则ID',
  `user_rule` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '达人规则ID',
  `comment_user_rule` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '视频评论用户的规则',
  `comment_rule` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '评论规则ID',
  `lib_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '话术库ID，json格式',
  `end_type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '任务结束类型0视频数，1目标视频数，2消息数\n{ label: \'不限制\', value: 0 },\n        { label: \'视频数达到限制\', value: 1 },\n        { label: \'目标视频数达到限制\', value: 2 },\n        { label: \'消息数达到限制\', value: 3 }\n',
  `comment_zan_fre` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论点赞频率 { label: \'不点赞视频评论\', value: 0 },\n        { label: \'小于10个/小时【很安全】\', value: 1 },\n        { label: \'10-20个/小时【很安全】\', value: 2 },\n        { label: \'20-30个/小时【较安全】\', value: 3 },\n        { label: \'30-40个/小时【较安全】\', value: 4 },\n        { label: \'40-50个/小时【不可持续】\', value: 5 },\n        { label: \'50-60个/小时【不可持续】\', value: 6 },\n        { label: \'大于60个/小时【高危】\', value: 7 },\n',
  `video_zan_fre` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '视频点赞频率 { label: \'不点赞视频\', value: 0 },\n        { label: \'小于5%【很安全】\', value: 1 },\n        { label: \'5%-10%【很安全】\', value: 2 },\n        { label: \'10%-15%【很安全】\', value: 3 },\n        { label: \'15%-20%【较安全】\', value: 4 },\n        { label: \'20%-30%【较安全】\', value: 5 },\n        { label: \'30%-40%【不可持续】\', value: 6 },\n        { label: \'大于50%【高危】\', value: 7 },\n { label: \'不点赞视频\', value: 0 },\n        { label: \'小于5%【很安全】\', value: 1 },\n        { label: \'5%-10%【很安全】\', value: 2 },\n        { label: \'10%-15%【很安全】\', value: 3 },\n        { label: \'15%-20%【较安全】\', value: 4 },\n        { label: \'20%-30%【较安全】\', value: 5 },\n        { label: \'30%-40%【不可持续】\', value: 6 },\n        { label: \'大于50%【高危】\', value: 7 },\n',
  `comment_fre` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论频率 { label: ‘不评论\', value: 0 },\n        { label: \'低【很安全】\', value: 1 },\n        { label: \'中低【很安全】\', value: 2 },\n        { label: \'中【较安全】\', value: 3 },\n        { label: \'中高【较安全】\', value: 4 },\n        { label: \'高【不可持续】\', value: 5 },\n',
  `private_fre` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '私信频率 { label: \'不私信用户\', value: 0 },\n        { label: \'低【很安全】\', value: 1 },\n        { label: \'中低【很安全】\', value: 2 },\n        { label: \'中【较安全】\', value: 3 },\n        { label: \'中高【较安全】\', value: 4 },\n        { label: \'高【不可持续】\', value: 5 },',
  `focus_fre` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '关注频率',
  `refresh_video_fre` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '刷视频频率',
  `limit_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '使用数量，需要与endType结合使用',
  `end_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '任务结束时间，搭配type一起使用',
  `state` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '开启状态，0未开启，1已开启',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '任务说明',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_task_machine
-- ----------------------------
DROP TABLE IF EXISTS `dke_task_machine`;
CREATE TABLE `dke_task_machine`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `task_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '任务ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '手机ID',
  `state` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '任务执行状态',
  `deleted` tinyint(1) NOT NULL COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_user
-- ----------------------------
DROP TABLE IF EXISTS `dke_user`;
CREATE TABLE `dke_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `mobile` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '手机号，登陆账号',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '姓名',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `salt` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '盐值',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `state` tinyint UNSIGNED NOT NULL DEFAULT 1 COMMENT '是否已启用',
  `role_type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '1代理，2商户，0管理员',
  `token` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '登陆验证token',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理的用户ID',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '0使用1年，1试用1个月，2试用3天，3试用3个月',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_mobile`(`mobile` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_token`(`token` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 167 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_user_rule
-- ----------------------------
DROP TABLE IF EXISTS `dke_user_rule`;
CREATE TABLE `dke_user_rule`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '名称',
  `min_zan` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小获赞数',
  `max_zan` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大获赞数',
  `gender` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '1男 ，2女，3未知',
  `min_age` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小年龄',
  `max_age` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大年龄',
  `min_focus` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小关注数',
  `max_focus` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大关注数',
  `max_fans` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大粉丝数',
  `min_fans` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小粉丝数',
  `min_works` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小作品数',
  `max_works` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大分享数',
  `contain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '包含关键词',
  `no_contain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '不包含关键词',
  `is_person` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否是个人账号；0不限，1是，2否',
  `is_tuangou` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否团购带货，0不限，1是，2否',
  `open_window` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否开启橱窗，0不限，1是，2否',
  `province_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '地域，省份ID ，json格式',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_video
-- ----------------------------
DROP TABLE IF EXISTS `dke_video`;
CREATE TABLE `dke_video`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `task_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '任务ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `douyin` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '抖音号',
  `nickname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '抖音昵称',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `zan_count` int NOT NULL COMMENT '点赞数',
  `comment_count` int NOT NULL COMMENT '评论数量',
  `collect_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '收藏',
  `keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '匹配的关键词，多个关键词使用英文逗号隔开',
  `no_keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '不匹配关键词',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '类型，0刷到的视频，1，目标视频',
  `watch_second` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '观看时长',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_title`(`title` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_nickname`(`nickname` ASC) USING BTREE,
  INDEX `idx_douyin`(`douyin` ASC) USING BTREE,
  INDEX `idx_task_id`(`task_id` ASC) USING BTREE,
  INDEX `task_machine_id`(`machine_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 525324 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '操作的视频' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_video_comment
-- ----------------------------
DROP TABLE IF EXISTS `dke_video_comment`;
CREATE TABLE `dke_video_comment`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `video_id` bigint UNSIGNED NOT NULL DEFAULT 0 COMMENT '视频ID',
  `nickname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户昵称',
  `douyin` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音号',
  `keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '评论被匹配的关键词，多个关键词使用英文逗号隔开',
  `no_keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '未匹配个关键词，多个逗号隔开',
  `province_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '地域，省份',
  `in_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '采集的时候，展示的距离采集时的时间，秒',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '评论内容',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE,
  INDEX `idx_machine_id`(`machine_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 58078 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '视频评论，采集视频 下面的评论内容' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_video_detail
-- ----------------------------
DROP TABLE IF EXISTS `dke_video_detail`;
CREATE TABLE `dke_video_detail`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `video_id` bigint UNSIGNED NOT NULL DEFAULT 0 COMMENT '视频ID',
  `op` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '操作类型，0评论视频，1评论评论，2私信评论人，3点赞评论',
  `keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '评论或者视频被匹配的关键词，多个关键词使用英文逗号隔开',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '评论内容，或者是视频标题',
  `back_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '回复内容',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_video_douyin
-- ----------------------------
DROP TABLE IF EXISTS `dke_video_douyin`;
CREATE TABLE `dke_video_douyin`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `video_id` bigint UNSIGNED NOT NULL DEFAULT 0 COMMENT '视频ID',
  `douyin` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音号',
  `nickname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '抖音昵称',
  `zan_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '获赞数',
  `focus_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关注数',
  `fans_count` int NOT NULL COMMENT '粉丝数',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '类型，0视频作者，1视频评论人，2其他（看评论来的）',
  `is_tuangou` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否是团购达人',
  `is_person` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否是个人',
  `open_window` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否开启橱窗',
  `works_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '作品数',
  `province_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '省份ID',
  `gender` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '3未知，1男，2女',
  `age` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '年龄',
  `introduce` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户介绍',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE,
  INDEX `idx_nickname`(`nickname` ASC) USING BTREE,
  INDEX `idx_douyin`(`douyin` ASC) USING BTREE,
  INDEX `idx_machine_id`(`machine_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44979 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_video_op
-- ----------------------------
DROP TABLE IF EXISTS `dke_video_op`;
CREATE TABLE `dke_video_op`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `video_id` bigint UNSIGNED NOT NULL DEFAULT 0 COMMENT '视频ID',
  `machine_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '机器ID',
  `video_comment_id` bigint UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论内容ID',
  `type` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '0操作视频，1操作视频评论',
  `is_zan` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否点赞',
  `zan_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞时间',
  `is_private_msg` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否私信',
  `private_msg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '私信内容',
  `is_comment` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否评论视频',
  `comment_msg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '评论内容',
  `comment_msg_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论时间',
  `msg_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '私信时间',
  `is_focus` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否关注',
  `is_view_user` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览用户主页',
  `view_user_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览用户主页',
  `focus_time` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '关注时间',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_video_comment_id`(`video_comment_id` ASC) USING BTREE,
  INDEX `idx_machine_id`(`machine_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 64198 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dke_video_rule
-- ----------------------------
DROP TABLE IF EXISTS `dke_video_rule`;
CREATE TABLE `dke_video_rule`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '名称',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `agent_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '代理商用户ID',
  `min_zan` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小点赞数',
  `max_zan` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大点赞数',
  `min_comment` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小评论数',
  `max_comment` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大评论数',
  `max_collect` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大收藏数',
  `min_collect` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小收藏数',
  `min_share` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最小分享数',
  `max_share` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '最大分享数',
  `contain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '包含关键词',
  `no_contain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '不包含关键词',
  `deleted` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `is_city` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否同城',
  `distance` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT ' 0: { text: \'不限\' },\n            1: { text: \'5公里以内\' },\n            2: { text: \'10公里以内\' },\n            3: { text: \'20公里以内\' },\n            4: { text: \'30公里以内\' },\n            5: { text: \'50公里以内\' },',
  `in_time` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '0: { text: \'不限\' },\n            1: { text: \'1小时内\' },\n            2: { text: \'12小时内\' },\n            3: { text: \'1天内\' },\n            4: { text: \'3天内\' },\n            5: { text: \'7天内\' },\n            6: { text: \'15天内\' },',
  `created_at` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_agent_user_id`(`agent_user_id` ASC) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
