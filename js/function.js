function goToLocalPage(url,new_title) {
    const encodedTitle = encodeURIComponent(new_title);
    window.location.href = `${url}?title=${encodedTitle}`; // 跳转到本地页面
}

function goToOnlinePage(url) {
    window.location.href = url; // 跳转到在线页面
}

// 定义一个函数来插入图片
function insertImages(num) {
    const container = document.querySelector(".image-container"); // 获取容器
    const imageUrl = "/photo/nothing.jpg"; // 本地图片路径
    // const count = 10; // 插入的图片数量

    for (let i = 0; i < num; i++) {
        const img = document.createElement("img"); // 创建图片元素
        img.src = imageUrl; // 设置图片路径
        img.alt = "本地图片"; // 设置图片的alt属性
        container.appendChild(img); // 将图片插入到容器中
    }
}

function get_title(){
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title'); // 获取 'title' 参数  
    if (title) {
      console.log(title);
      document.getElementById('titleDiv').innerText = decodeURIComponent(title); // 解码并设置标题
    } 
    return title;
}

function set_background(){
  var backgroundElement = document.getElementById('showing_place');
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get('title'); // 获取 'title' 参数
  // console.log(title);
  
  const bgIndex = title || '萨马拉'; // 默认使用1
  const validBg = ['萨马拉','莫斯科','圣彼得堡','摩尔曼斯克','斯大林格勒'].includes(bgIndex) ? bgIndex : '1'; // 安全过滤
  const images = {
    '萨马拉': 'url(photo/background/background_1.jpg)',
    '莫斯科': 'url(photo/background/background_2.jpg)',
    '圣彼得堡': 'url(photo/background/background_3.jpg)',
    '摩尔曼斯克': 'url(photo/background/background_4.jpg)',
    '斯大林格勒': 'url(photo/background/background_5.jpg)',
  };
  backgroundElement.style.backgroundImage = images['validBg'];
  backgroundElement.style.backgroundSize = 'cover';
}

function convert_lang_title() {
  var Eng_name;
  switch (get_title()){
    case '萨马拉':
      Eng_name = 'samara';
      console.log(`转换成英语${Eng_name}`);
      return Eng_name;
      break;

    case '莫斯科':
      Eng_name = 'moscow';
      console.log(`转换成英语${Eng_name}`);
      return Eng_name;
    break;

    case '圣彼得堡':
      Eng_name = 'Petersburg';
      console.log(`转换成英语${Eng_name}`);
      return Eng_name;
    break;
    
    case '摩尔曼斯克':
      Eng_name = 'Murmansk';
      console.log(`转换成英语${Eng_name}`);
      return Eng_name;
    break;

    case '斯大林格勒':
      Eng_name = 'Stalingrad';
      console.log(`转换成英语${Eng_name}`);
      return Eng_name;
    break;

    default:
        console.log('title传入参数错误!');
        break;
  }
}

function show_images() {
  const title = convert_lang_title();    
    // console.log(title);
    // DOM 完全加载后执行
    const img_url = `/api/images/${encodeURIComponent(title)}`;
    console.log(`img_url = ${img_url}`);
    document.addEventListener('DOMContentLoaded', () => {
      const imageGrid = document.getElementById('image-grid');
      const loading = document.getElementById('loading');
      const errorContainer = document.getElementById('error-container');

      // 获取图片数据
      fetch(img_url)
        .then(response => {
          // 隐藏加载提示
          loading.hidden = true;

          // 检查 HTTP 状态码
          if (!response.ok) {
            throw new Error(`HTTP 错误! 状态码: ${response.status}`);
          }
          return response.json();
        })
        .then(images => {
          // 处理空数据情况
          if (!images || images.length === 0) {
            errorContainer.hidden = false;
            errorContainer.textContent = '没有找到任何图片';
            return;
          }

          // 动态创建图片元素
          images.forEach(imageName => {
            const card = document.createElement('div');
            card.className = 'image-card';
            // console.log(imageName.path);

            const img = document.createElement('img');
            // 关键路径拼接：假设服务器配置了 /images 路由指向图片目录
            img.src = `/api/images/${encodeURIComponent(imageName.path)}`;  //
            // console.log(img.src);
            
            img.alt = `图片：${imageName}`;
            
            // 懒加载优化（现代浏览器支持）
            img.loading = 'lazy';

            // 图片加载失败处理
            img.onerror = () => {
              console.error(`图片加载失败: ${imageName}`);
              img.style.opacity = '0.5'; // 视觉降级
            };

            card.appendChild(img);
            imageGrid.appendChild(card);

             // 为每个 image-card 添加点击事件监听器
             card.addEventListener('click', () => get_img(imageName));
          });
        })
        .catch(error => {
          console.error('请求失败:', error);
          errorContainer.hidden = false;
          errorContainer.textContent = `加载失败：${error.message}`;
        });
    });
}