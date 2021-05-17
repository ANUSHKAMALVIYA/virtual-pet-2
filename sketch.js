//Create variables here
var dog, dogImg, happyDodImg, database, foods, foodStockRef,database;
var feed, addFood,fedTime,lastFed,foodObj
var currentTime, milk,input,name;
var frameCountNow = 0;
var gameState = "hungry";
var gameStateRef;
var input, button;
var bedroomImg, gardenImg, washroomImg, sleepingImg, runImg;

function preload()
{
	//load images here
  dogImg = loadImage("images/dogImg1.png");
  happyDog = loadImage("images/dogImg.png");
  bedroomImg = loadImg("images/bed Room.png")
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png ");
  sleepingImg = loadImage("images/Lazy.png");
  runImg = loadImage("images/running.png");
}


function setup() {  
  database = firebase.database();
createCanvas(1200,500);


foodObj = new Food();

dog = createSprite(width/2+250,height/2,10,10);
dog.addAnimation("hungry",hungryDog);
dog.scale = 0.3;
dog.addAnimation("happy",happyDog)
dog.addAnimation("sleeping",sleepingImg);
dog.addAnimation("run",runImg);

getGameState();

feed = createSprite("Feed the Dog")
feed.position(1050,95);
feed.mousePressed(feedDog);

addFood = createButton("Add Food")
addFood.position(800,95);
addFood.mousePressed(addfoods);
  
input = createInput("Prt name");
input.position(950,120);

button = createButton("Confirm");
button.position(1000,145);
button.mousePressed(createName);

}
function draw() {
currentTime = hour();
if(currentTime === lastFed + 1){
  gameState  = "playing";
  updateGameState();
  foodObj.garden();

}

else if(currentTime === lastFed +2){
gameState = "sleeping";
updateGameState();
foodObj.bedroom();
}

else if(currentTime > lastFed +2 && currentTime <= lastFed +){
  gameState = "bathing";
  updateGameState();
  foodObj.washroom();
}

else{
  gameState = "hungry";
  updateGameState();
  foodObj.washroom();
}

//console.log(gameState);

foodObj.getFoodStock();
//console.log(foodStock);
getGameState();


  //add styles here

  fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
  lastFed = data.val();
  })
  fill(255);
  textSize(20);
  if(lastFed>=12){
    text("Last Feed : ",+ lastFeed% 12+ "PM,350,30");
  }
  else if(lastFed==0){
    text("last Feed : 12 AM",350,30);
  }
  else{
    text("last Feed : "+lastFed +"AM",350,30);
  }

  foodObj.display();
  drawSprites();
}
 
function readStock(data){
  foods = data.val();
  foodObj.updateFoodStock(foods);
}

function feedDog(){
dog.addImage(happyDog);
foodObj.updateFoodStock(foodObj.getFoodStock()-1)
database.ref('/').update({
  Food: foodObj.getFoodStock(),
  FeedTime: hour()
})

}

function addFoods(){
  foods++;
  database.ref('/').update({
    Food: foods
  })
}