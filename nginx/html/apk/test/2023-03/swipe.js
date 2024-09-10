function sw() {
    let left = device.width * 0.3 + device.width * 0.4 * Math.random();
    let top = device.height * 3 / 4;
    swipe(left, top - 200, left, 300, 100 + Math.random() * 200);
}

function sw3() {
    let left = device.width * 0.3 + device.width * 0.4 * Math.random();
    let top = device.height * 3 / 4;
    swipe(left, top - 200, left, 500, 100 + Math.random() * 200);
}


function sw2() {
    let left = device.width * 0.3 + device.width * 0.4 * Math.random();
    let top = device.height * 3 / 4;
    swipe(left, top, left, 300, 100 + Math.random() * 200);
}



function sw4() {
    let left = device.width * 0.3 + device.width * 0.4 * Math.random();
    let top = device.height * 3 / 4;
    swipe(left, top, left, 500, 100 + Math.random() * 200);
}

sw();
sleep(4000);
sw3();
sleep(4000);
sw2();
sleep(4000);
sw4();
