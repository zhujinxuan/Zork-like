'use strict';
function Enemy(name,funcDrop){
  this.name = name;
  this.drop = funcDrop;
}

function Item(name, description){
  this.name = name;
  this.description = description;
}

function dungBall_drop(){
  if (Math.random()>0.5){
    return new Item("Dung Balls", "Life is like a box of Dung balls. You never know what you're gonna get.")
  } else {
    return new Item("Noble Dung Balls", "All Dung balls are equal, but some dung balls are more euqal than others");
  }
}

function Room(name, geoMap){
  var obj = Object();

  obj.name=name;
  obj.geoMap = geoMap;
  obj.enemies = [];

  obj.where={
    default:function(){
      console.log(`You are in ${obj.name}`)
    }
  };

  obj.attack={
    default: function(){
      if (obj.enemies.length === 0) {
        console.log("There are no enemies you can see.")
        console.log("You have no enemy and you have to attack")
        console.log("Therefore, you attack yourself")
        obj.suicide.default();
      } else {
        console.log(obj.enemies)
        var index = parseInt( (Math.random() *obj.enemies.length) );
        console.log(`You are attacking ${obj.enemies[index].name}`)
        console.log(`${obj.enemies[index].name} counterfire back`)
        var new_item = obj.enemies[0].drop();
        console.log(`You get new item: ${new_item.name}`);
        obj.geoMap.character.additem(new_item);
        obj.suicide.default()
      }
    }
  }

  obj.suicide={
    default: function(){
      console.log("You Died");
      obj.enemies=[];
      console.log("You return to the shrine");
      obj.geoMap.position = obj.geoMap.rooms[0];
      obj.where.default();
    }
  }

  obj.go={
    default:function(){
      console.log('You could go');
      console.log(`up: ${obj.up.name}`);
      console.log(`down: ${obj.down.name}`);
    },
    up: function(){
      console.log(`You are leaving ${obj.name}`)
      obj.geoMap.position = obj.up
      console.log(`You are in ${obj.up.name}`)
    },
    down:function(){
      console.log(`You are leaving ${obj.name}`)
      obj.geoMap.position = obj.down
      console.log(`You are in ${obj.down.name}`)
    }
  }
  obj.look={
    default: function(){
      obj.enemies = [];
      console.log('You look around, and found nothing');
      console.log('You can look carefully');
    },
    carefully: function(){
      if (obj.enemies.length === 0){
        obj.enemies = Array.apply(null, new Array(parseInt(Math.random()*10+1))).map(function(){
          return new Enemy((Math.random()>0.5)?"Great Dung Monster":"Dung Monster", dungBall_drop)
          return rival;
        })
      }
      obj.enemies.forEach(function(rival){
        console.log(`You find an enemy ${rival.name}`);
      })
    }
  }
  obj.error = {
    default:function(verb){
      console.log(`The Action ${verb} is not supported yet`);
    },
    target:function(verb, target){
      console.log(`The Action ${verb} does not support ${target} yet`);
    }
  }
  obj.inventory = {
    default:function(){
      obj.geoMap.character.checkInventory();
    }
  };
  obj.allowed_actions = ["go", "where", "look","attack", "suicide", "inventory"]
  return obj;
}

function RoomMap(position_ind, character){

  // SW->SE->NE->NW->SW
  var self = this;
  this.rooms = ['The Southwest Room',  'The Southeast Room', 'The Northwest Room', 'The Northeast Room'].map(function(name){
    return Room(name, self)
  });
  for (var ii = 0;ii<this.rooms.length; ii++){
    this.rooms[ii].up = this.rooms[(ii+1)%4]
    this.rooms[ii].down = this.rooms[(ii+3)%4]
  }
  // Where I am
  this.position=this.rooms[position_ind];
  this.character = character;
}

function Character(charname){
  this.charname= "William";
  this.inventory = [];
  this.printName = function(){
    console.log(`Ah, you are ${this.charname}; that is a really good name`);
  }
  this.additem = function(new_item) {
    this.inventory.push(new_item)
  }
  this.checkInventory = function(){
    if (this.inventory.length ===0) {
      console.log("You have nothing.")
    } else{
      console.log(`You have ${this.inventory.length} items`)
      this.inventory.forEach(function(item){
        console.log(`Item name: ${item.name}`);
        console.log(`Item Description: ${item.description}`);
      })
    }
  }
}


var rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


var main_map = undefined;
var character = undefined;

var question = "What is your name?"
var onset_char = true;
function recursiveGame(){
  rl.question(question, function(str){
    if (onset_char){
      if (character ===undefined){
        character = new Character(str);
        character.printName();
        question = "Would you like to change your name? (y/n)"
        recursiveGame();
      } else {
        if (str === "no" | str === "n") {
          onset_char = false;
          question= "Action: "
          main_map = new RoomMap(0, character)
        } else if (str=== "yes" | str === 'y'){
          question = "What is your name?"
          character = undefined
        }
        recursiveGame();
      }
    } else{
      var [verb,target_str] = str.trimLeft().split(' ')
      target_str= (undefined === target_str)?"default":target_str;
      target_str= ("" === target_str)?"default":target_str;
      var current_pos = main_map.position;
      if (false){
        rl.close()
      }
      if ('' !== verb){
        if ( -1 === current_pos.allowed_actions.indexOf(verb)){
          current_pos.error.default(verb)
        } else if(undefined === current_pos[verb][target_str]){
          current_pos.error.target(verb,target_str);
        } else{
          current_pos[verb][target_str]();
        }
      }
      recursiveGame();
    }
  })
}

recursiveGame()
