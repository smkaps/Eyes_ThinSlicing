/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-ready.html"
];

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var EyesExperiment = function() {
  var stims = []
  var practice_stims = []
  var recognition_stims = []  
  var practiced = false
  var piloted = false
  
  // Set the amount of time each image is shown to the subject
  var delay = 0

  var next = function() {
    if(recognition_stims.length === 0){
      finish()
    } else if (practiced === true && piloted === false){
      presentImage('pilot_phase')
    } else if (practiced === false && piloted === false){
      presentImage('practice')
    } else if (piloted === true && practiced === true){
      presentImage('recognition_phase')
    } 
	}

  var presentImage = function (mode){
    var dataset = []
    if(mode === 'practice'){
      dataset = practice_stims
    } else if (mode === 'pilot_phase'){
      dataset = stims
    } else if (mode === 'recognition_phase') {
      dataset = recognition_stims
    }

    stim = dataset[0]

    d3.select('#stim').html("<img id=\"original-image\" class=\"nocursor\" />")//.on('load', function(){
    d3.select('#original-image').on('load', function(){
    
      setTimeout(function(){
          //d3.select('#prompt').html('<form action="javascript:void(0); novalidate"><div id="input-container" class="form-group has-feedback"><input type="number" id="response" /><small id="invalid-feedback" style="opacity:0" class="help-block">Please enter a number greater than or equal to zero (decimals allowed).</small></div><button type="button" id="next-button" value="next-button" class="btn btn-primary m3">Next <span class="glyphicon glyphicon-arrow-right"></span></button></form>')
          if(mode === 'practice'){d3.select('#prompt').html('<form action="javascript:void(0); novalidate"><div id="input-container" class="form-group has-feedback"> Please insert your response here: <input type="number" id="response" min="1" max="2" /><small id="invalid-feedback" style="opacity:0" class="help-block">Please enter either a 1 or a 2.</small></div><button type="button" id="next-button" value="next-button" class="btn btn-primary m3">Next <span class="glyphicon glyphicon-arrow-right"></span></button></form>')
          }
          if(mode === 'pilot_phase'){d3.select('#prompt').html('<form action="javascript:void(0); novalidate"><div id="input-container" class="form-group has-feedback"> Please insert your response here: <input type="number" id="response" min="1" max="2" /><small id="invalid-feedback" style="opacity:0" class="help-block">Please enter either a 1 or a 2.</small></div><button type="button" id="next-button" value="next-button" class="btn btn-primary m3">Next <span class="glyphicon glyphicon-arrow-right"></span></button></form>')
          }
          if(mode === 'recognition_phase'){d3.select('#prompt').html('<form action="javascript:void(0); novalidate"><div id="input-container" class="form-group has-feedback"> Please insert your response here: <input type="number" id="response" min="1" max="2" /><small id="invalid-feedback" style="opacity:0" class="help-block">Please enter either a 1 or a 2.</small></div><button type="button" id="next-button" value="next-button" class="btn btn-primary m3">Next <span class="glyphicon glyphicon-arrow-right"></span></button></form>')
          }

          d3.select('#next-button').on('click', function(){
          response = d3.select('#response').property('value')


            if(response.length > 0){
                psiTurk.recordTrialData({'phase': mode, 'feature': stim.feature, 'quality': stim.quality, 'response': response, 'path': stim.image_path})
                dataset.shift()
                d3.select("svg").remove();   
            if (dataset.length === 0 && mode === 'practice'){
                  practiced = true
                  d3.select('#stim').html('')
                  countdown('The experiment will start in... ')
                  practice_stims = dataset
            } if (dataset.length === 0 && mode === 'pilot_phase'){
                  piloted = true
                  d3.select('#stim').html('')
                  countdown2('This final section asks about familiarity and if you recognize who any of these people are in real life. The experiment will start in... ')
                  stims = dataset
            } if (dataset.length === 0 && mode === 'recognition_phase'){
                  finish()  
            } else if (mode === 'practice' && dataset.length !=0) {
                  practice_stims = dataset
                  next()
            } else if (mode === 'recognition_phase' && dataset.length !=0) {
                  recognition_stims = dataset
                  next()
            } else if (mode === 'pilot_phase' && dataset.length !=0) {
                  stims = dataset
                  next()
                }
            } else {
                d3.select('#input-container').classed('has-error', true)
                d3.select('#invalid-feedback').style('opacity', 1)
              }
                    
                    /*
                    console.log(mode)
                    console.log(stim.quality)
                    console.log(response)
                    console.log(stim.image_path)   
                    console.log(stim.feature)
                    */      
            })

          

              var circleData = [
              { "cx": 240, "cy": 50, "radius": 0, "color" : "white"}];

              var svgcontainer = d3.select("body").append("svg")
                                .attr("width",1000)
                                .attr("height",150)
                                d3.select("body").attr("align","center");                           

              var text = svgcontainer.selectAll("text")
                        .data(circleData)
                        .enter()
                        .append("text");                          

                  if(stim.quality == "YoungOld"){
                    var text2 = "How young is the person in the above image? (1 = Old, 2 = Young)";}
                  if(stim.quality == "TrustworthyUntrustworthy"){
                    var text2 = "How trustworthy is the person in the above image? (1 = Untrustworthy, 2 = Trustworthy)";}
                  if(stim.quality == "FriendlyUnfriendly"){
                    var text2 = "How friendly is the person in the above image? (1 = Unriendly, 2 = Friendly)";}
                  if(stim.quality == "HappySad"){
                    var text2 = "How happy is the person in the above image? (1 = Unhappy, 2 = Happy)";}
                  if(stim.quality == "HonestDishonest"){
                    var text2 = "How honest is the person in the above image? (1 = Dishonest, 2 = Honest)";}
                  if(stim.quality == "KindUnkind"){
                    var text2 = "How kind is the person in the above image? (1 = Unkind, 2 = Kind)";}                    
                 
                  if(stim.quality == "Recognition"){
                    var text2 = "How familiar is the person in the above image? (1 = Not Familiar, 2 = Familiar).";}

              var textLabels = text
                 .attr("x", function(d) { return d.cx; })
                 .attr("y", function(d) { return d.cy; })
                 .text( function (d) {  return text2; })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "15px")
                 .attr("fill", "black"); 

                 



        }, delay)
       })
    d3.select('#original-image').attr('src', stim.image_path).attr('width', 600).attr('height', 200)
  }



  var countdown = function(message){
    d3.select('#prompt').html(message+ '3')
    var time = 3
    var interval = setInterval(function(){
      time = time - 1
      if (time != 0){
        d3.select('#prompt').html(message + time)
      } else {
        clearInterval(interval)
        next()
      }
    }, 1000)
  }

  var countdown2 = function(message){
    d3.select('#prompt').html(message+ '10')
    var time = 10
    var interval = setInterval(function(){
      time = time - 1
      if (time != 0){
        d3.select('#prompt').html(message + time)
      } else {
        clearInterval(interval)
        next()
      }
    }, 1000)
  }

	var finish = function() {
	    //$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');
	// Register the response handler that is defined above to handle any
	// key down events.
  // $("body").focus().keydown(response_handler); 

	// Start the test
  $.getJSON('/static/js/subset_data.json', function(data){
    data = _.shuffle(data)
    stims = data
  $.getJSON('/static/js/practice_data.json', function(data){
    practice_stims = data
  $.getJSON('/static/js/recognition_data.json', function(data){
  	data = _.shuffle(data)
    recognition_stims = data    

  //console.log(stims)
      next()
      })
    })
  })
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

    $('select').each( function(i, val) {
      psiTurk.recordUnstructuredData(this.id, this.value);    
    });
    $('textarea').each( function(i, val) {
      psiTurk.recordUnstructuredData(this.id, this.value);  
    });

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, then quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new EyesExperiment(); } // what you want to do when you are done with instructions
    );
});
