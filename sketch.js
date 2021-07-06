//Create variables here
var dog,dogImg1,dogImg2;
var foodS,foodStock
var database;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var changeState,readState;
var bedroom,garden,bathroom;
function preload()
{
	//load images here
  dogImg1=loadImage("images/dogImg1.png");
  dogImg2=loadImage("images/dogImg2.png");
  milkimg=loadImage("Milk.png");
  bedroom=loadImage("virtual pet images/Bed Room.png");
garden=loadImage("virtual pet images/Garden.png");
washroom=loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  database=firebase.database();
	createCanvas(600, 600);
  foodObj=new Food();
  
  dog=createSprite(250,300,50,150);
  dog.addImage(dogImg1)
 dog.scale=0.25;
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods)

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val(); })
 
  
}


function draw() {  

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

   if(gameState!="Hungry"){
feed.hide();
addFood.hide();
dog.remove();
   }else{
     feed.show();
     addFood.show();
     dog.addImage(dogImg1)
   }


drawSprites();




}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg2)
  milk=createSprite(130,320,10,10);
  milk.addImage(milkimg);
  milk.scale=0.05;
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
  Food:foodObj.getFoodStock(),
FeedTime:hour()
})

}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })

  
  }

  function update(state){
    database.ref('/').update({
      gameState:state
    });
    
      }
    

