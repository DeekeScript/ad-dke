let storage = {
    getToken() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("token");
    },

    setToken(token) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("token", token);
    },

    getMobile() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("mobile");
    },

    setMobile(mobile) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("mobile", mobile);
    },

    getMachineId() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("machine_id");
    },

    setMachineId(machineId) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("machine_id", machineId);
    },

    getInit() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("init");
    },

    setInit(type) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("init", type);
    },

    removeToken() {
        let storage = storages.create("com.dke.qiao");
        storage.remove('token');
        return true;
    },

    setPackage(name) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("package", name);
    },

    getPackage() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("package");
    },

    setTag(name) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("tag", name);
    },

    getTag() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("tag");
    },

    //1无后台，2有后台
    setMachineType(type) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("machineType", type);
    },

    getMachineType() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("machineType");
    },

    setOpenWx(type) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("openWx", type);
    },

    getOpenWx() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("openWx");
    },

    setIsAgent(type) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("isAgent", type);
    },

    getIsAgent() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("isAgent");
    },

    getMakeMoney() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("makeMoney");
    },

    setMakeMoney(type) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("makeMoney", type);
    },

    setCity(city) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("city", city);
    },

    getCity() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("city");
    },

    setExcNicknames(nicknames) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("excNicknames", nicknames);
    },

    getExcNicknames() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("excNicknames");
    },

    setEndTime(time) {
        let storage = storages.create("com.dke.qiao");
        return storage.put("endTime", time);
    },

    getEndTime() {
        let storage = storages.create("com.dke.qiao");
        return storage.get("endTime");
    },

    removeSpeech(index) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getSpeech();
        if (data.length === 0) {
            return true;
        }

        for (let i in data) {
            if (data[i].index === index) {
                data.splice(i, 1);
            }
        }
        storage.put('speech', JSON.stringify(data));
    },

    addSpeech(item) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getSpeech();
        data.push(item);
        storage.put('speech', JSON.stringify(data));
        return data;
    },

    addSpeechAll(items) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getSpeech();

        for (let item of items) {
            data.push(item);
        }
        storage.put('speech', JSON.stringify(data));

        return data;
    },

    getSpeech() {
        let storage = storages.create('com.dke.qiao');
        let data = storage.get('speech');
        if (!data) {
            return [];
        }

        data = JSON.parse(data);
        return data;
    },

    clearSpeech() {
        let storage = storages.create("com.dke.qiao");
        let data = [];
        storage.put('speech', JSON.stringify(data));
        return data;
    },

    removeTask(index) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getTask();
        if (data.length === 0) {
            return true;
        }

        for (let i in data) {
            if (data[i].index === index) {
                data.splice(i, 1);
            }
        }

        storage.put('task', JSON.stringify(data));
    },

    addTask(item) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getTask();
        data.push(item);
        storage.put('task', JSON.stringify(data));
        return data;
    },

    getTask() {
        let storage = storages.create('com.dke.qiao');
        let data = storage.get('task');
        if (!data) {
            return [];
        }

        data = JSON.parse(data);
        return data;
    },

    updateTask(index, title) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getTask();
        if (data.length === 0) {
            return [];
        }

        for (let i in data) {
            if (data[i].index === index) {
                data[i].title = title;
            }
        }

        storage.put('task', JSON.stringify(data));
        return data;
    },

    updateTaskState(index, state) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getTask();
        if (data.length === 0) {
            return false;
        }

        for (let i in data) {
            if (data[i].index === index) {
                data[i].state = state;
            }
        }

        storage.put('task', JSON.stringify(data));
        return true;
    },

    removeTaskDetail(i) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getTaskDetail();
        if (data.length === 0) {
            return true;
        }

        data.splice(i, 1);
        storage.put('taskDetail', JSON.stringify(data));
    },

    addTaskDetail(item) {
        let storage = storages.create("com.dke.qiao");
        let data = this.getTaskDetail();
        data.push(item);
        storage.put('taskDetail', JSON.stringify(data));
        return data;
    },

    getTaskDetail(taskIndex) {
        let storage = storages.create('com.dke.qiao');
        let data = storage.get('taskDetail');
        if (!data || data.length === 0) {
            return [];
        }

        data = JSON.parse(data);
        //log(taskIndex, data);
        if (taskIndex) {
            for (let i in data) {
                if (data[i].taskIndex === taskIndex) {
                    //log(data[i]);
                    return data[i];
                }
            }
            return {};
        }
        return data;
    },

    updateTaskDetail(data, taskTrue) {
        let storage = storages.create("com.dke.qiao");
        let items = this.getTaskDetail();
        let update = false;
        if (items && items.length) {
            for (let i in items) {
                if (items[i].taskIndex === data.taskIndex) {
                    items[i] = data;
                    update = true;
                    break;
                }
            }
        }

        if (!update) {
            items.push(data);
        }
        storage.put('taskDetail', JSON.stringify(items));

        log('taskTrue', taskTrue, data.taskIndex);
        if (taskTrue) {
            this.updateTaskState(data.taskIndex, true);
        }
        return data;
    },

    setMobileStopType(type) {
        let storage = storages.create("com.dke.qiao");
        storage.put('mobileStopType', type);
        return true;
    },

    getMobileStopType() {
        let storage = storages.create("com.dke.qiao");
        return storage.get('mobileStopType');
    },

    //尽量 文件名 + key的模式
    get(key) {
        let storage = storages.create("com.dke.qiao");
        return storage.get(key);
    },

    //尽量 文件名 + key的模式
    set(key, value) {
        let storage = storages.create("com.dke.qiao");
        storage.put(key, value);
        return true;
    },
}

module.exports = storage;
