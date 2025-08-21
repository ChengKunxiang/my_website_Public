function switch_background(title) {
    console.log(`switch_background: title = ${title}`);
    
    switch (title) {
        case '萨马拉':
            console.log(title);
            document.getElementById('showing_place').style.backgroundImage = "url('/photo/background/background_1.jpg')";
        break;

        case '莫斯科':
            console.log(title);
            document.getElementById('showing_place').style.backgroundImage = "url('/photo/background/background_2.jpg')";
        break;

        case '圣彼得堡':
            console.log(title);
            document.getElementById('showing_place').style.backgroundImage = "url('/photo/background/background_3.jpg')";
        break;
        
        case '摩尔曼斯克':
            console.log(title);
            document.getElementById('showing_place').style.backgroundImage = "url('/photo/background/background_4.jpg')";
        break;

        case '斯大林格勒':
            console.log(title);
            document.getElementById('showing_place').style.backgroundImage = "url('/photo/background/background_5.jpg')";
        break;

        default:
            console.log('title传入参数错误!');
            break;
    }
}

function change_title(){
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title'); // 获取 'title' 参数

    // 如果参数存在，设置网页标题
    if (title) {
        document.title = decodeURIComponent(title); // 解码并设置标题
    }
    console.log("修改标题成功！");    
}