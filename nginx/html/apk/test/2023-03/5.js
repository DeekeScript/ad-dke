let k = 100;
while (true) {
    k--;
    sleep(1000);
    if (k <= 0) {
        break;
    }

    click(1, device.height - 1);
    device.wakeUp();
}