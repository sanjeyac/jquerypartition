/*
*	JQuery Parition Plugin v0.2
*	
* 	Author: Sanjeya Cooray
*	Web Hosting: http://www.misadev.com
* 
* 	License: GPL v2 - The project is as is.
* 
* 	This is a simple plugin to make an html partition editor widget
*/			
(function($){
    $.fn.extend({ 
        partition: function(options) {

            //default parameters
            var defaults = {
                containerId : $(this).attr('id'),
                values : [ 25, 25, 25, 25],
                width : 500,
                colors: [ "red", "blue", "black", "green"],
                height: 20,					
                onCursorStop: null,
                onDrag: null,
                onInit: null,
                cursorBackgroundColor: '#e6e6e6',
                cursorBorderColor: '#d4d4d4',
                mouseCursor:'e-resize'
            }
            
            var drag = {
                oldPosition : 0,
                enable : false,
                selectedCursor: null,
                firstBox: null,
                secondBox : null,
            };

            
            var cursorMap = {};
            var boxMap = {};		
            var parameters = $.extend(defaults, options);

            /**
             * Updates values array based on cursors position
             */
            function updateValues(){
                var sum=0;
                for (key in boxMap){
                    sum += $("#"+parameters.containerId+' #'+boxMap[key]).width();
                }
                var i = 0;
                for (key in boxMap){
                    var w = $("#"+parameters.containerId+' #'+boxMap[key]).width();
                    var perc = Math.round(w/sum*100);						
                    parameters.values[i] = perc;
                    i++;
                }					
            }

            /**
             * Mouse move listener
             */
            $(document).mousemove(function(e){
                if (drag.enable){	      				
                    var delta = drag.oldPosition - e.pageX;	      				
                    
                    if (delta!=0){
                        //adjust width on move on left box
                        var wLeft = $("#"+parameters.containerId+' #'+drag.firstBox).width();
                        var newPosLeft = wLeft-delta;
                        if (newPosLeft >= 0 || newPosRight < wRight){
                            $("#"+parameters.containerId+' #'+drag.secondBox).width(newPosRight);
                        }                        

                        //adjust width on move on rightbox
                        var wRight = $("#"+parameters.containerId+' #'+drag.secondBox).width();
                        var newPosRight = wRight+delta;
                        if (newPosRight >= 0 || newPosLeft < wLeft){
                            $("#"+parameters.containerId+' #'+drag.firstBox).width(newPosLeft);				      					
                        }

                        drag.oldPosition = e.pageX;
                        updateValues();
                    }				      						      
                    
                    if (parameters.onDrag!=null)
                        parameters.onDrag(parameters.values);			
                }
            });

            /*
             * Mouse release listener
             */
            $(document).mouseup(function(e){
                if (drag.enable){
                    drag.enable = false;
                    drag.actualPosition = e.pageX;
                    if (parameters.onCursorStop!=null)
                        parameters.onCursorStop(parameters.values);				      							
                }
            });   				

            /*
             * Generate the html code for cursors
             */
            function generateHTML(parameters){
                var n = parameters.values.length;			
                
                for( var i=0; i<n; i++ ){                    
                    cursorMap[i]="cursor"+i;
                    boxMap[i]="partBox"+i;
                    var str="<div style='float:left;"+
                            "margin-top:2px;"+
                            "background-color:"+parameters.colors[i]+";"+
                            "height:"+parameters.height+"px;"+
                            "width:"+Math.round(parameters.values[i]*parameters.width/100)+"px;' "+
                            "id='partBox"+i+"' "+
                            "></div>";
                    $("#"+parameters.containerId).append(str);
                    if ( i != n-1){
                        var str="<div style='float:left;"+
                                "background-color:"+parameters.cursorBackgroundColor+";"+
                                "cursor:"+parameters.mouseCursor+";"+
                                "border:solid 1px"+parameters.cursorBorderColor+";"+
                                "height:"+(parameters.height+4)+"px;"+
                                "width:"+parameters.height+"px;' "+
                                "id='"+cursorMap[i]+"' class='dragCursor' "+
                                "></div>";
                        $("#"+parameters.containerId).append(str);
                    }
                }
                $("#"+parameters.containerId).append("<div style='clear:both'></div>");
                enableCursors();								
            }

            /*
             * Enable cursors for drag and drop
             */
            function enableCursors(){                
                $("#"+parameters.containerId+' .dragCursor').mousedown(function(ev){
                    //get selected cursor
                    var selAttrId = $(this).attr('id');
                    for (key in cursorMap){
                        if ( cursorMap[key] == selAttrId ){
                            drag.selectedCursor = parseInt(key);
                        }
                    }
                    //boxes near selected cursors
                    drag.firstBox = boxMap[drag.selectedCursor];						 
                    drag.secondBox = boxMap[drag.selectedCursor+1];								
                    drag.enable = true;
                    drag.oldPosition = ev.pageX;
                    ev.preventDefault();//disable text selection on drag and drop
                });					
            }
            //main
            generateHTML(parameters);
            if ( parameters.onInit != null ){
                parameters.onInit(parameters.values);
            }
        }
    });
})(jQuery);
