

let func = {
    lastFunc: undefined,
    runFunc(func) {
        func();
        this.lastFunc = func;
        return this;
    },
}

function clickTag() {

}

func.runFunc(clickTag);
