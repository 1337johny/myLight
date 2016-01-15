/**
 * Light Control for RPI controlled LED-Stripe by Jonathan Klaiber
 * 
 * coded for the Pebble Steel with the SDK3. Also should be compatible with Pebble Time.
 * 
 * Author: Jonathan Klaiber
 * Language: English
 * Code: Javascript
 */

//DECLARATIONS - GLOBAL OBJECTS
var UI = require('ui');
var ajax = require('ajax');
var Accel = require('ui/accel');
var Vector2 = require('vector2');

 var currentColorValues = new Array();
 var currentColorHex;

//ACCELERATION FUNCTION
Accel.on('tap', function(e) {
  console.log("!!!!!!!! SHAKE - LIGHT TURNED OFF! !!!!!!!!");
  setLight('000000');
});

//GET THE CURRENT COLOR DATA - HEX & R,G,B VALUE
function ajaxRequest(log) {
    if (log===true) {
    console.log("Function 'ajaxRequest' called");
    }
    var URL_1 = "http://smarthome.fritz.box/led/requireData.php";
  
      ajax({
        url: URL_1, 
        type: 'json',
        async: false,
      },
      function(json) {
        // Data is supplied here
        currentColorHex = json.hex;
        
        if (log===true) {
          console.log("Current Color recived from JSON: #"+currentColorHex);
        }
        
        currentColorValues[0] = currentColorHex.substring(0,2);
        currentColorValues[1] = currentColorHex.substring(2,4);
        currentColorValues[2] = currentColorHex.substring(4,6);
        if (log===true) {
        console.log("Current Color Values R,G,B have been set to: "+currentColorValues);
        }
      },
      function(error) {
        console.log('Ajax failed: ' + error);
      }
    );
    log=false;
    ajax({
        url: URL_1, 
        type: 'json',
        async: false,
      },
      function(json) {
        // Data is supplied here
        currentColorHex = json.hex;
        
        if (log===true) {
          console.log("Current Color recived from JSON: #"+currentColorHex);
        }
        
        currentColorValues[0] = currentColorHex.substring(0,2);
        currentColorValues[1] = currentColorHex.substring(2,4);
        currentColorValues[2] = currentColorHex.substring(4,6);
        if (log===true) {
        console.log("Current Color Values R,G,B have been set to: "+currentColorValues);
        }
      },
      function(error) {
        console.log('Ajax failed: ' + error);
      }
    );
  
}

//AJAX REQUEST
function setLight(value) {
  var _URL = "http://smarthome.fritz.box/led/getURL.php?farbe="+value;
   ajax({url: _URL});
}

//ADDITION
function add(value) {
  if (value==='FF'){}
  else if (value==='EE') {
    value = 'FF';
  }
  else if (value==='DD') {
    value = 'EE';
  }
  else if (value==='CC') {
    value = 'DD';
  }
  else if (value==='BB') {
    value = 'CC';
  }
  else if (value==='AA') {
    value = 'BB';
  }
  else if (value==='99') {
    value='AA';
  }
  else {
    var valueInt = parseInt(value);
    valueInt += 11; 
    value = valueInt;
  }
  return value;
}

//SUBTRACTION
function substract(value) {
  if (value==='00'){}
  else if (value==='11') {
    value = '00';
  }
  else if (value==='FF') {
    value = 'EE';
  }
  else if (value==='EE') {
    value = 'DD';
  }
  else if (value==='DD') {
    value = 'CC';
  }
  else if (value==='CC') {
    value = 'BB';
  }
  else if (value==='BB') {
    value = 'AA';
  }
  else if (value==='AA') {
    value='99';
  }
  else {
    var valueInt = parseInt(value);
    valueInt -= 11; 
    value = valueInt;
  }
  return value;
}

//ADD BRIGHTNESS
function addBrightness() {

  console.log("Function 'addBrightness' called");
  
  var red = add(currentColorValues[0]);
  var green = add(currentColorValues[1]);
  var blue = add(currentColorValues[2]);
  
  var newValue = red+""+green+""+blue;
  
  console.log("added Values R,G,B: "+newValue);
  
  setLight(newValue);
  
  ajaxRequest(false);
}

function substractBrightness() {
  console.log("Function 'substractBrightness' called");
  
  var red = substract(currentColorValues[0]);
  var green = substract(currentColorValues[1]);
  var blue = substract(currentColorValues[2]);
  
  var newValue = red+""+green+""+blue;
  
  console.log("subtracted Values R,G,B: "+newValue);
  
  setLight(newValue);
  
  ajaxRequest(false);
}


//BRIGHTNESS CARD
function showBrightnessCard() {
    ajaxRequest();
    var brightnessCard = new UI.Card({
      action: {
        up: 'images/pebble_action_plus.png',
        down: 'images/pebble_action_minus.png'
      },
      title: 'Brightness',
      subtitle: "#"+currentColorHex
    });
  
  //brightnessCard.icon('images/pebble_action_plus.png');
  
  brightnessCard.on('click', function(e) {
    
    if (e.button==="up") {
      console.log("*-----------------------------------------------------------*");
      console.log("Brightness Card: Up was pressed");
      ajaxRequest(true);
      addBrightness();
      brightnessCard.subtitle("#"+currentColorHex);
      console.log("*-----------------------------------------------------------*");
    } else if (e.button==="down") {
      console.log("*-----------------------------------------------------------*");
      console.log("Brightness Card: Down was pressed");
      ajaxRequest(true);
      substractBrightness();
      brightnessCard.subtitle("#"+currentColorHex);
      console.log("*-----------------------------------------------------------*");
    }
    
  
  });
  
  brightnessCard.show();
  
}                      

/*
function showBrightnessWindow () {
  var wind = new UI.Window();
  
  wind.icon('icon_plus');
  
  var textPlus = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 30),
    text: "+",
    font: 'bitham-42-bold',
    color: 'white',
    textAlign: 'center'
  });
  
  var textMinus = new UI.Text({
    position: new Vector2(0, 100),
    size: new Vector2(144, 30),
    text: "-",
    font: 'bitham-42-bold',
    color: 'white',
    textAlign: 'center'
  });
  
  wind.on('click', 'up', function() {
    console.log("*-----------------------------------------------------------*");
    console.log("Brightness Card: Up was pressed");
    ajaxRequest();
    addBrightness();
    console.log("*-----------------------------------------------------------*");
  });
  
  wind.on('click', 'down', function() {
    console.log("*-----------------------------------------------------------*");
    console.log("Brightness Card: Down was pressed");
    ajaxRequest();
    substractBrightness();
    console.log("*-----------------------------------------------------------*");
  });
  
  wind.add(textPlus);
  wind.add(textMinus);
  
  wind.show();
}
*/

//MAIN MENU
var mainMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Colors',
    }, {
      title: 'Brightness',
    }]
  }]
});
mainMenu.on('select', function(e) {
  if (e.itemIndex === 0) {
    console.log("Selected: "+e.itemIndex);
    colorMenu.show();
  } 
  if (e.itemIndex === 1) {
    console.log("Selected: "+e.itemIndex);
    showBrightnessCard();
  } 
  if (e.itemIndex === 2) {
    console.log("Selected: "+e.itemIndex);
  }
});
mainMenu.show();

//COLOR MENU
var colorMenu = new UI.Menu({
    sections: [{
      items: [{
        title: 'White'
      }, {
        title: 'Red'
      }, {
        title: 'Blue'
      }, {
        title: 'Green'
      }]
    }]
  });
colorMenu.on('select', function(e) {
    
    // LOGS
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    
    //FUNCTION
    switch(e.itemIndex) {
      case 0:
          setLight("FFFFFF");
          break;
      case 1: 
          setLight("FF0000");
          break;
      case 2: 
          setLight("0000FF");
          break;
      case 3: 
          setLight("00FF00");
          break;
    }
  });


