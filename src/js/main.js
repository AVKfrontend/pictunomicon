const loadInput = document.getElementById('load');
const canvas = document.getElementById('can');
const controls = document.querySelector('.work-area__controls');
let originUploadedImg;
let currentImage;
loadInput.addEventListener("change", updateImage);
controls.addEventListener('click', changeImage);

function updateImage() {
	if(!loadInput) {
		console.log("Файл не вибран");
		return;
	}
	originUploadedImg = new SimpleImage(loadInput);
	printImg(originUploadedImg);
}
function printImg(img) {
	img.drawTo(canvas);
	//console.log(img.getPixel(2,2));
}
function changeImage(event) {
	const target = event.target;
	const action = target.closest('button').dataset.filter;
	doChange(action);
}
function doChange(action) {
	switch(action) {
		case 'grey':
			makeGrey();
			break;
	}
}
function makeGrey() {
	if(!originUploadedImg) return;
	currentImage = new SimpleImage(originUploadedImg.getWidth(), originUploadedImg.getHeight());
	for(let pixel of originUploadedImg.values()) {
		const x = pixel.getX();
		const y = pixel.getY();
		const averageColor = makeGreyColor(pixel);
		const newPixel = currentImage.getPixel(x, y);
		newPixel.setRed(averageColor);
		newPixel.setGreen(averageColor);
		newPixel.setBlue(averageColor);

	}
	printImg(currentImage);
}
function makeGreyColor(pixel) {
	const averageColor = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
	if(averageColor > 255) {
		console.log("Не вірний колір");
		throw new Error("Не вірний колір");
	}
	return averageColor;
}
