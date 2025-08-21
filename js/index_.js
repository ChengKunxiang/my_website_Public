const now = new Date();

function loadItems() {
    var itemList = document.getElementById("itemList");
    itemList.innerHTML = ""; // 清空当前列表

    var items = JSON.parse(localStorage.getItem("itemList"));
    if (items) {
        items.forEach(function(itemText) {
            
            var listItem = document.createElement("li");
            listItem.className = "list-item";

            var itemTextSpan = document.createElement("span");
            itemTextSpan.textContent = itemText.firstElement;
            listItem.appendChild(itemTextSpan);
            // console.log(itemText);

            var itemTimeSmall = document.createElement("small");
            itemTimeSmall.textContent = itemText.secondElement;
            listItem.appendChild(itemTimeSmall);
            // console.log(itemTimeSmall);
            
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "删除";
            deleteButton.onclick = function () {
                listItem.remove();
                saveItems(); // 更新存储
            };

            listItem.appendChild(deleteButton);
            itemList.appendChild(listItem);
        });
    }
}

function addItem() {
    var input = document.getElementById("newItemInput");    
    var input_withtime = input.value.trim();
    var newItemText = input_withtime;
    var CurrentTime = displayCurrentTime();

    // console.log(newItemText);
    // console.log(input_withtime);
    // console.log(input);
    if (input_withtime === "") {
        alert("请输入任务内容！");
        return;
    }

    var itemList = document.getElementById("itemList");
    var listItem = document.createElement("li");
    listItem.className = "list-item";

    var itemTextSpan = document.createElement("span");
    itemTextSpan.textContent = newItemText;
    listItem.appendChild(itemTextSpan);

    var itemTimeSmall = document.createElement("small");
    itemTimeSmall.textContent = `创建于：${CurrentTime}`;
    listItem.appendChild(itemTimeSmall);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "删除";
    deleteButton.onclick = function () {
        listItem.remove();
        saveItems(); // 更新存储
    };
    listItem.appendChild(deleteButton);

    itemList.appendChild(listItem);

    saveItems(); // 保存到本地存储
    input.value = ""; // 清空输入框

}

function saveItems() {
var itemList = document.getElementById("itemList");

var items = [];

for (var i = 0; i < itemList.children.length; i++) {

var children = itemList.children[i].children;

var item = {};

if (children.length > 0) {
    item.firstElement = children[0].textContent; // 获取第一个子元素的内容
}
if (children.length > 1) {
    item.secondElement = children[1].textContent; // 获取第二个子元素的内容
}

items.push(item);
}

localStorage.setItem("itemList", JSON.stringify(items));            
}

 // 获取并显示当前时间
 function displayCurrentTime() {
    // 获取时间的各个部分
    const year = now.getFullYear(); // 年
    const month = now.getMonth() + 1; // 月（getMonth() 返回 0-11）
    const day = now.getDate(); // 日
    const hours = now.getHours(); // 小时
    const minutes = now.getMinutes(); // 分钟
    const seconds = now.getSeconds(); // 秒

    // 格式化时间
    const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // 返回时间
    return formattedTime;
}

function readRowData(button) {
    var cell = button.parentNode;
    var row = cell.parentNode;
    var cells = row.cells;
    // alert(cells[4].innerText);
    document.getElementById("output").innerText = cells[4].innerText;
    navigator.clipboard.writeText(cells[4].innerText).then(function() {
        alert("内容已成功复制到剪贴板！内容为："+ cells[4].innerText);
    }, function(err) {
        alert("复制失败，请手动复制！");
    });
}

function go_to_onlineweb(url) {
    window.open(url,"_blank");
}