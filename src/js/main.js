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
	// clearingCurrentImg();
}
function printImg(img) {
	img.drawTo(canvas);
}
function changeImage(event) {
	if(!originUploadedImg) return;
	const target = event.target;
	const action = target.closest('button').dataset.filter;
	doChange(action);
}
function doChange(action) {
	if(action === 'clear') {
		clearing();
		return;
	}
	clearingCurrentImg();
	for(let pixel of originUploadedImg.values()) {
		const x = pixel.getX();
		const y = pixel.getY();
		let RGBObj = {};
		switch(action) {
			case 'grey':
				RGBObj = makeGrey(pixel);
				break;
			case 'sepia':
				RGBObj = makeSepia(pixel);
				break;
			case 'red':
				RGBObj = makeUnacolor(pixel, 'R');
				break;
			case 'green':
				RGBObj = makeUnacolor(pixel, 'G');
				break;
			case 'clear':
				clearing();
				break;
		}
		if (RGBObj.R === undefined) {
			console.log("Не визначений фільтр ");
			throw new Error("Не визначений фільтр");
			return;
		}
		const newPixel = currentImage.getPixel(x, y);
		newPixel.setRed(RGBObj.R);
		newPixel.setGreen(RGBObj.G);
		newPixel.setBlue(RGBObj.B);
		newPixel.setAlpha(pixel.getAlpha());
	}
	printImg(currentImage);
}
function makeUnacolor(pixel, color) {
	const averageColor = culculateAverageColor(pixel);
	const RGBObj = {};
	const neededColor = culculateNeededColor(averageColor);
	if(averageColor < 128) {
		RGBObj.R = 0;
		RGBObj.G = 0;
		RGBObj.B = 0;
		RGBObj[color] = neededColor;
	} else {
		RGBObj.R = neededColor;
		RGBObj.G = neededColor;
		RGBObj.B = neededColor;
		RGBObj[color] = 255;
	}
	return RGBObj;
}
function culculateNeededColor(averageColor) {
	if(averageColor < 128) {
		return averageColor * 2;
	} else return averageColor * 2 - 255;
}
function makeSepia(pixel) {
	const {Rc, Gc, Bc} = {
		Rc: pixel.getRed(), 
		Gc: pixel.getGreen(), 
		Bc: pixel.getBlue()
	};
	return {
		R: Rc * .393 + Gc * .769 + Bc * .189,
		G: Rc * .349 + Gc * .686 + Bc * .168,
		B: Rc * .272 + Gc * .534 + Bc * .131
	}
}
function clearing() {
	printImg(originUploadedImg);
}
function clearingCurrentImg() {
	currentImage = new SimpleImage(originUploadedImg.getWidth(), originUploadedImg.getHeight());
}
function makeGrey(pixel) {
	const averageColor = culculateAverageColor(pixel);
	return {
		R: averageColor,
		G: averageColor,
		B: averageColor
	}
}
function culculateAverageColor(pixel) {
	const averageColor = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
	if(averageColor > 255) {
		console.log("Не вірний колір");
		throw new Error("Не вірний колір");
	}
	return averageColor;
}
