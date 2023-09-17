const result = document.querySelector('#final-password');
const copy = document.querySelector('.copy');
const copyMessage = document.querySelector('.copy-message');

const lengthValue = document.querySelector('.length-value');
const slider = document.querySelector('.slider');

const check1 = document.querySelector('#check1');
const check2 = document.querySelector('#check2');
const check3 = document.querySelector('#check3');
const check4 = document.querySelector('#check4');

const strengthColor = document.querySelector('.color');
const generate = document.querySelector('.generate');

const checkboxes = document.querySelectorAll("input[type=checkbox]");
const symbols = '@#$%^&*()_+-{}[]|?.,:*<`~>₹;';

//set default values for password, number of checked boxes, lengthValue
let password = "";
let checkCount = 0;
let length = 7;

// <------------------------------------------------    FUNCTIONS    ------------------------------------------------------------->

//change the password length
function handleSlider() {
    slider.value = length;
    lengthValue.innerHTML = length;
}

/*
-> Math.random() -> it will select any frandom number in range 0 to 1
-> *(max-min) -> it will give the number in the range 0 to max
-> Math.floor() -> it will round off the number from decimal to integer
-> + min -> it will make the range min to max and we will get required number
*/

function getRandomInteger(min ,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRandomNumber() {
    return getRandomInteger(0,9);
}

function getRandomUpperCase() {
    return String.fromCharCode(getRandomInteger(65,90));        // it will convert integer to character value
}

function getRandomLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 122));      
}

function getRandomSymbol() {
    const randSymbol = getRandomInteger(0, symbols.length);     // it will choose a random index from the ysmbol string
    return symbols.charAt(randSymbol);                          // it will give the character stored in the string at that specific index
}

function setIndicatorColor(color) {
    strengthColor.style.backgroundColor = color;
}
setIndicatorColor("#f00")

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;

    if(check1.checked) hasUpper = true;
    if(check2.checked) hasLower = true;
    if(check3.checked) hasNum = true;
    if(check4.checked) hasSymbol = true;

    if( (checkCount > 2 && length >= 6) || (hasUpper && hasLower && hasNum && hasSymbol && length >= 6)) setIndicatorColor("#0f0");     //green
    else if( checkCount == 2 && length >= 5) setIndicatorColor("#ff0");                                                                 //yellow
    else setIndicatorColor("#f00");                                                                                                     //red
}

//this will count the checked boxes everytime there occurs a change
function handleCheckBoxChange() {
    checkCount = 0;
    checkboxes.forEach((box) => {
        if(box.checked) checkCount++;
    });

    //special consition if password length < checboxCount
    if(length < checkCount){
        length = checkCount;
        handleSlider();  //update UI
    }
    calcStrength();
}

function shuffelPassword(array) {
    //Fisher Yates Method
    for( let i = array.length - 1; i > 0; i-- ) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((element) => {
        str += element;
    });

    return str;
}


async function copyPassword() {
    try{
        await navigator.clipboard.writeText(result.value);  //this line will let us copy the value of the final password on clicking the button
        copyMessage.textContent = "copied";
    }
    catch(e) {
        copyMessage.textContent = "can not copy";
    }
    
    //adding an "active" class in the copyMessage to add special css properties to it only when button is clicked
    copyMessage.classList.add("active"); 

    //remove the added class after 2 seconds
    setTimeout(() => {
        copyMessage.classList.remove("active");
    }, 2000);
    
}


// <------------------------------------------------    EVENT LISTENERS    ------------------------------------------------------------->

slider.addEventListener('input', (e) => {
    length = e.target.value;
    handleSlider();
    calcStrength();
})

copy.addEventListener('click', (e) => {
    if(result.value) {
        copyPassword();
    }
})


//whenever there is a change in checkbox it will run the handle function
checkboxes.forEach((box) => {
    box.addEventListener('change', handleCheckBoxChange );
});


generate.addEventListener('click', (e) => {
    if(checkCount === 0) return;
    else {

    if( length < checkCount ) {
        length = checkCount;
        handleSlider();
    }

    //remove old password
    password = "";

    //putting the checkbox values as asked
    let array = [];

    if(check1.checked) array.push(getRandomUpperCase());
    if(check2.checked) array.push(getRandomLowerCase());
    if(check3.checked) array.push(getRandomNumber());
    if(check4.checked) array.push(getRandomSymbol());

    //compulsory addition
    for( let i = 0; i < array.length; i++ ) {
        password += array[i];
    }


    //remaining addition
    for( let i = 0 ; i < length - checkCount; i++ ){
        let randomIndex = getRandomInteger(0, array.length);
        password += array[randomIndex];
    }

    //shuffel the password
    password = shuffelPassword(Array.from(password));

    result.value = password;

    calcStrength();
    
    }

})