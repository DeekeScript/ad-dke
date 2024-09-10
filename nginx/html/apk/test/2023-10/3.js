function getContent() {
    let tag = this.getContentTag();
    if (!tag || !tag.desc()) {
        return '';
    }

    let str = tag.desc().split(',,,,')[1]
    return str ? str.split(',')[0] : '';
}

