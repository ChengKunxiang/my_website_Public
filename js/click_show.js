function get_img(image) {
    console.log(image);
    show_bigger_image(image);
    return image
}

function show_bigger_image(image_name) {
    const imageUrl = `/api/images/${encodeURIComponent(image_name.path)}`;
    console.log(`show_bigger_image = ${imageUrl}`);
    
    document.getElementById('showing_image').src = imageUrl;
}