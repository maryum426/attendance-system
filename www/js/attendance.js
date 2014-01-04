var checkin;
var username;
var userpin;
var company;
var department;
var userAvatar = null;
var table = '<table style="border:1px solid #000;text-align: center;border-collapse:collapse;margin-top:10px;margin-bottom:20px;">';

        function checkIn(){
            checkin = true;
            console.log('CheckIn');
            if (check == 'checkin')
                {
                    window.location = "picUpload.html?checkin=" + checkin + "&check=checkin";
                }
            else if (check == 'checkout')
                {
                    window.location = "picUpload.html?checkin=" + checkin + "&check=checkout";
                }
            else if (check == 'no')
                {
                    window.location = "picUpload.html?checkin=" + checkin + "&check=no";
                }    
            
        }
        
        function checkOut(){
            checkin = false;
            console.log('CheckOut');
            if (check == 'checkin')
                {
                    window.location = "picUpload.html?checkin=" + checkin + "&check=checkin";
                }
            else if (check == 'checkout')
                {
                    window.location = "picUpload.html?checkin=" + checkin + "&check=checkout";
                }
            else if (check == 'no')
                {
                    window.location = "picUpload.html?checkin=" + checkin + "&check=no";
                }    
        }
        
        function logout(){
            window.location = "index.html";
        }
        
        function launch(){
            
            $('#launch').attr('disabled','disabled');
            
            sendEmail();
           
        }
        
        function codePageOk(){
            $('.pic_upload').hide();
            $('.btn-holder2').hide();
            $('#codeOk').attr('disabled','disabled');
            userpin = ($('.code-holder').val()).toString();
            console.log("User Pin: " + userpin);
            var query = new Parse.Query("Users");
            //var query = new Auth();
            query.equalTo('userPin',userpin);
            query.find({
                success:function (r_auth) {
                    if (r_auth.length > 0) {
                        username = r_auth[0].get("userName");
                        company = r_auth[0].get("company");
                        department = r_auth[0].get("department");
                        
                        //document.cookie = "pin=" + userpin + ";" ; 
                        window.localStorage.setItem("pin",userpin);
                        //document.cookie = "username=" + username + ";" ; 
                        window.localStorage.setItem("username",username);
                        //document.cookie = "company=" + company + ";"  ;
                        window.localStorage.setItem("company",company);
                        //document.cookie = "department=" + department + ";" ;
                        window.localStorage.setItem("department",department);
                        
                        
                            checkCheckIn();

                    }
                    else {
                       alert("User doesnot exist!");
                       $('#codeOk').removeAttr('disabled');
                       $('.code-holder').val(null);
                    }
                },
                error:function (error) {
                    console.log("Error -> " + error.code + " " + error.message);
                }

            });
            
        }
        
        function checkCheckIn(){
            var currentDate = new Date();
            //check checkin/out status

                            if (company == 'virtualforce'){
                                var query = new Parse.Query("VirtualForce");
                                query.equalTo("userPin", userpin);
                                query.startsWith("checkInTime", currentDate.toDateString());
                                query.find({
                                    success:function (results) {
                                        console.log("Results Length: " + results.length);
                                            
                                            if (results.length == 0)
                                                {
                                                    window.location = "check.html?check=no";
                                                }   
                                                
                                            if (results[0].get("check") == 'checkin')
                                                {
                                                    window.location = "check.html?check=checkin";
                                                }
                                            else if (results[0].get("check") == 'checkout')
                                                {
                                                    window.location = "check.html?check=checkout";
                                                }
                                            else if (results[0].get("check") == '' || results[0].get("check") == null)
                                            {
                                                window.location = "check.html?check=no";
                                            }
                                            
                                        },
                                        error:function (error) {

                                        }
                                });
                            }
                            else if (company == 'kualitatem'){
                                var query = new Parse.Query("Kualitatem");
                                query.equalTo("userPin", userpin);
                                query.startsWith("checkInTime", currentDate.toDateString());
                                query.find({
                                    success:function (results) {
                                        console.log("Results Length: " + results.length);

                                            if (results.length == 0)
                                                {
                                                    window.location = "check.html?check=no";
                                                }   
                                                
                                            if (results[0].get("check") == 'checkin')
                                                {
                                                    window.location = "check.html?check=checkin";
                                                }
                                            else if (results[0].get("check") == 'checkout')
                                                {
                                                    window.location = "check.html?check=checkout";
                                                }
                                            else if (results[0].get("check") == '' || results[0].get("check")== null)
                                                {
                                                    window.location = "check.html?check=no";
                                                }
                                        },
                                        error:function (error) {

                                        }
                                });
                            }
        }
        
        /*function codePageBack(){
            if (checkin == true){
                window.location = "index.html";
            }
            else {
                window.location = "index.html";
            }
        }*/
        function capturePicture(){
                //alert("HERE!");
                $('.pic_upload').css({'display':'block'});
                $('.btn-holder2').css({'display':'block'});
                $('#snap-text').css({'display':'none','margin-top':'0'});
                $('.pic-text').css({'display':'none','margin-top':'0'});
                $('#submit').removeAttr('disabled');
                var options =   {
                    quality: 50,
                    cameraDirection:1,
                    sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                    correctOrientation: true,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    allowEdit: true
                };
                // Take picture using device camera and retrieve image as base64-encoded string
                navigator.camera.getPicture(onSuccess,onFail,options);
          }
          var onSuccess = function(data3) {
                    //alert("On success called");
                    
                    userAvatar = data3;
                    var data;
                    data = "data:image/jpeg;base64," + userAvatar;
                    $("#my_image").attr("src",data);
                    userAvatar = data;
            };
                
                //console.log("File Path: " + file.path);
        var onFail = function(e) {
            //alert("On fail " + e);
            //alert("Profile Picture Progress: " + $rootScope.loginInProgress_profile);
        };
        
        function uploadOk(){
            //alert("In Upload!");
            if (userAvatar == null){
                alert("Take a picture first!");
                $('#submit').removeAttr('disabled');
                
            }
            $('#submit').attr('disabled','disabled');
                    var thumbnail = 400;
                    var ppWidth, ppHeight;
                   

                    //alert("Image: " + data);
                    var image = new Image();
                    image.src = userAvatar;

                    var canvas = document.createElement('canvas');

                    canvas.width = thumbnail;
                    canvas.height = thumbnail;


                    image.onload = function(){
                        ppWidth = image.width;
                        ppHeight = image.height;

                        //alert('Width: ' + ppWidth);
                        //alert('Height: ' + ppHeight);

                        var context = canvas.getContext('2d');
                        context.clearRect(0, 0, thumbnail, thumbnail);
                        var imageWidth;
                        var imageHeight;
                        var offsetX = 0;
                        var offsetY = 0;



                        if (image.width > image.height) {
                            imageWidth = Math.round(thumbnail * image.width / image.height);
                            imageHeight = thumbnail;
                            offsetX = - Math.round((imageWidth - thumbnail) / 2);
                            //alert("IF");
                        } else {
                            imageHeight = Math.round(thumbnail * image.height / image.width);
                            imageWidth = thumbnail;    
                            offsetY = - Math.round((imageHeight - thumbnail) / 2);            
                            //alert("ELSE");
                        }

                        context.drawImage(image, offsetX, offsetY, imageWidth, imageHeight);
                        //alert("Image Drawn");
                        //}
                        var data2 = canvas.toDataURL('image/jpeg');

                        //alert ("Data2.1: " + data2);
                        data2 = data2.replace(/^data:image\/(png|jpeg);base64,/, "");
                        //alert ("Data2.2: " + data2);

                        //alert("Source Set!");

                        //Initialize Parse
                        Parse.initialize("oxdew7mMEtpnkypr0DLtpd5rPg7vFFlgo1VPBCJs","7AtLcq4907OUmsLMpZcv0y4fgrZhUKSvv8iz9ncz");

                        
                        var parseFile = new Parse.File("mypic.jpg", {base64:data2});
                        
                        parseFile.save().then(function() {
                                                            //alert("Got it!");
                                                            userAvatar = parseFile.url();
                                                            uploadParsePic(userAvatar);
                                                            //alert (parseFile.url());
                                                            console.log("Ok");

                                                        }, function(error) {
                                                            console.log("Error");
                                                            console.log(error);
                                                        });
                    }
                    
                    
                    
                    
        }
        
        
        
        function uploadBack(check){
            if (check == 'checkin')
                {
                    window.location = "check.html?check=checkin";
                }
            else if (check == 'checkout')
                {
                    window.location = "check.html?check=checkout";
                }
            else if (check == 'no')
                {
                    window.location = "check.html?check=no";
                }    
            
        }
        
         var uploadParsePic = function(url){
             var currentDate = new Date();
             var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();
             var checkStatus = new Date();
             checkStatus.setHours(9);
             checkStatus.setMinutes(30);
             checkStatus.setSeconds(59);
             var checkSDate = new Date();
             var checkEDate = new Date();
             //var compareDate;
             checkSDate.setHours(00);
             checkSDate.setMinutes(00);
             checkSDate.setSeconds(00);
             checkEDate.setHours(23);
             checkEDate.setMinutes(59);
             checkEDate.setSeconds(59);
             var checkStatus = new Date();
             checkStatus.setHours(9);
             checkStatus.setMinutes(30);
             checkStatus.setSeconds(59);
             var status;
             console.log("Check Status: " + checkStatus.toString());
             console.log("Current Date: " + currentDate.toString());
             if ((currentDate < checkStatus || currentDate == checkStatus)){
                 status = 'ontime';
             }
             else{
                 status = 'late';
             }
            
           
            
            //URL Parsing get checkin value
            var loc = window.location.search.substring(1),i, val, params = loc.split("&");
                for (i=0;i<params.length;i++) {
                    val = params[i].split("=");
                    if (val[0] == "checkin") {
                        checkin = unescape(val[1]);
                    }
                }
            
            //Get values from cookie
            /*var ca = document.cookie.split(';');
                for(var i=0; i< ca.length; i++) 
                  {
                    var c = ca[i].trim();
                    if (c.indexOf("pin")== 0) {
                        userpin = (c.substring(c.indexOf("pin").length,c.length)).split("=");
                        userpin = unescape(userpin[1]);
                    }
                    else if (c.indexOf("username")== 0) {
                        username = (c.substring(c.indexOf("username").length,c.length)).split("=");
                        username = unescape(username[1]);
                    }
                    else if (c.indexOf("company")== 0) {
                        company = (c.substring(c.indexOf("company").length,c.length)).split("=");
                        company = unescape(company[1]);
                    }
                    else if (c.indexOf("department")== 0) {
                        department = (c.substring(c.indexOf("department").length,c.length)).split("=");
                        department = unescape(department[1]);
                    }
                    
                  }*/
             userpin = window.localStorage.getItem("pin");
             username = window.localStorage.getItem("username");
             company = window.localStorage.getItem("company");
             department = window.localStorage.getItem("department");
                    //alert("User Pin: " + userpin);
                    //alert("User Name: " + username);
                    //alert("User Company: " + company);
                    //alert("User Dept: " + department);
                    
                    //alert("CheckIn: " + checkin);
               
                if (checkin == 'true'){
                        if (company == 'virtualforce'){
                            //alert("In Virtual Force");
                            var query = new Parse.Query("VirtualForce");
                            //query.ascending("checkInOutTime");
                            query.equalTo("userPin", userpin);
                            //query.equalTo("check", 'checkin');
                            query.greaterThanOrEqualTo( "createdAt", checkSDate );
                            query.lessThanOrEqualTo("createdAt", checkEDate);
                            query.find({
                                success:function (results) {
                                    console.log("Results Length: " +results.length);
                                    //results[0].set("userPin",userpin);
                                    results[0].set("userAvatarIn",url);
                                    results[0].set("checkInTime",currentTime);
                                    results[0].set("department",department);
                                    results[0].set("check","checkin");
                                    results[0].set("createdAt",currentDate);
                                    //results[0].set("userName",username);
                                    results[0].set("status",status);
                                    results[0].save(null, {
                                        success:function (kuali) {
                                            console.log(kuali + " saved successfully");
                                            window.location = "home.html?checkin=" + checkin + "&pic=" + url;
                                            //cb(pSweet);
                                        },
                                        error:function (pSweet, error) {
                                            console.log("saveRecord() -> " + error.code + " " + error.message);
                                        }

                                    });
                                    
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                        }
                        else if (company == 'kualitatem'){
                            
                            var query = new Parse.Query("Kualitatem");
                            //query.ascending("checkInOutTime");
                            query.equalTo("userPin", userpin);
                            //query.equalTo("check", 'checkin');
                            query.greaterThanOrEqualTo( "createdAt", checkSDate );
                            query.lessThanOrEqualTo("createdAt", checkEDate);
                            query.find({
                                success:function (results) {
                                    //console.log(virtualf + " saved successfully");
                                    //results[0].set("userPin",userpin);
                                    results[0].set("userAvatarIn",url);
                                    results[0].set("checkInTime",currentTime);
                                    results[0].set("department",department);
                                    results[0].set("check","checkin");
                                    results[0].set("createdAt",currentDate);
                                    //results[0].set("userName",username);
                                    results[0].set("status",status);
                                    results[0].save(null, {
                                        success:function (kuali) {
                                            console.log(kuali + " saved successfully");
                                            window.location = "home.html?checkin=" + checkin + "&pic=" + url;
                                            //cb(pSweet);
                                        },
                                        error:function (pSweet, error) {
                                            console.log("saveRecord() -> " + error.code + " " + error.message);
                                        }

                                    });
                                    
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                        }
                    }
                    else{
                        var checkinTime = new Date();
                        var hours = new Date();
                        
                        var time2;
                        var time=[];
                        var checkinHr,checkinMn;
                        if (company == 'virtualforce'){
                            var query = new Parse.Query("VirtualForce");
                            //query.ascending("checkInOutTime");
                            query.equalTo("userPin", userpin);
                            //query.equalTo("check", 'checkin');
                            query.startsWith("checkInTime", currentDate.toDateString());
                            query.find({
                                success:function (results) {
                                    console.log("Results Length: " + results.length);
                                      time2 = results[0].get("checkInTime");
                                      time2 = time2.substr(time2.length -5);
                                      time = time2.split(":");
                                      checkinHr = time[0];
                                      checkinMn = time[1];
                                      checkinTime.setHours(checkinHr);
                                      checkinTime.setMinutes(checkinMn);
                                      hours = currentDate - checkinTime;
                                      
                                       var cd = 24 * 60 * 60 * 1000,
                                            ch = 60 * 60 * 1000,
                                            d = Math.floor(hours / cd),
                                            h = '0' + Math.floor( (hours - d * cd) / ch),
                                            m = '0' + Math.round( (hours - d * cd - h * ch) / 60000);
                                        hours = [h.substr(-2), m.substr(-2)].join(':');
                                        //hours = [h.substr(-2) + ' hrs, ' + m.substr(-2) + ' mins'];
                                      
                                      workHours = hours.toString();
                                      //console.log("Working Hours " + workHours);
                                      
                                     
                                        //console.log("Working Hours2 " + workHours);
                                        //var virtualF = Parse.Object.extend("VirtualForce");
                                        //var vf = new virtualF();
                                        //vf.set("userPin",userpin);
                                        results[0].set("userAvatarOut",url);
                                        results[0].set("checkOutTime",currentTime);
                                        //vf.set("department",department);
                                        results[0].set("check","checkout");
                                        //vf.set("createdAt",currentDate);
                                        results[0].set("workingHours",workHours);
                                        //vf.set("userName",username);    
                                        //vf.set("status",status);
                                        results[0].save(null, {
                                            success:function (virtualf) {
                                                console.log(virtualf + " saved successfully");
                                                window.location = "home.html?checkin=" + checkin + "&pic=" + url;
                                                //cb(pSweet);
                                            },
                                            error:function (pSweet, error) {
                                                console.log("saveRecord() -> " + error.code + " " + error.message);
                                            }

                                        });
                                    },
                                    error:function (error) {

                                    }
                            });
                        }
                        
                        else if (company == 'kualitatem'){
                                        var query = new Parse.Query("Kualitatem");
                                        //query.ascending("checkInOutTime");
                                        query.equalTo("userPin", userpin);
                                        //query.equalTo("check", 'checkin');
                                        query.startsWith("checkInTime", currentDate.toDateString());
                                        query.find({
                                            success:function (results) {
                                                console.log("Results Length: " + results.length);
                                                  time2 = results[0].get("checkInTime");
                                                  time2 = time2.substr(time2.length -5);
                                                  time = time2.split(":");
                                                  checkinHr = time[0];
                                                  checkinMn = time[1];
                                                  checkinTime.setHours(checkinHr);
                                                  checkinTime.setMinutes(checkinMn);
                                                  hours = currentDate - checkinTime;

                                                   var cd = 24 * 60 * 60 * 1000,
                                                        ch = 60 * 60 * 1000,
                                                        d = Math.floor(hours / cd),
                                                        h = '0' + Math.floor( (hours - d * cd) / ch),
                                                        m = '0' + Math.round( (hours - d * cd - h * ch) / 60000);
                                                    hours = [h.substr(-2), m.substr(-2)].join(':');
                                                    //hours = [h.substr(-2) + ' hrs, ' + m.substr(-2) + ' mins'];

                                                  workHours = hours.toString();
                                                  console.log("Working Hours " + workHours);
                                      
                                     
                                                    //console.log("Working Hours2 " + workHours);
                                                  
                                                    //var kualitatem = Parse.Object.extend("Kualitatem");
                                                    //var km = new kualitatem();
                                                    //km.set("userPin",userpin);
                                                    results[0].set("userAvatarOut",url);
                                                    results[0].set("checkOutTime",currentTime);
                                                    //km.set("department",department);
                                                    results[0].set("check","checkout");
                                                    //km.set("createdAt",currentDate);
                                                    results[0].set("workingHours",workHours);
                                                    //km.set("userName",username);
                                                    //km.set("status",status);
                                                    results[0].save(null, {
                                                        success:function (kuali) {
                                                            console.log(kuali + " saved successfully");
                                                            window.location = "home.html?checkin=" + checkin + "&pic=" + url;
                                                            //cb(pSweet);
                                                        },
                                                        error:function (pSweet, error) {
                                                            console.log("saveRecord() -> " + error.code + " " + error.message);
                                                        }

                                                    });
                                            },
                                        error:function (error) {

                                        }
                                });
                            }
                    }

        
            
        }
        
        function backToLogin(){
            setTimeout(function(){
                window.location = "index.html";
            },5000);
            
        }
        
        function takePicture(){
            setTimeout(function(){
                capturePicture();
            },4000);
            
        }
        
        
        function sendEmail(){
            var currentDate = new Date();
            var day = currentDate.getDay();
            var yesterday = new Date();
            var checkin_time, checkout_time;
            var time = {};
            console.log('Today: ' + day);
            if (day == 1){
                console.log('Today is Monday!');
                yesterday.setDate(currentDate.getDate()-3);
            }
            else{
                console.log('Any other day!');
                yesterday.setDate(currentDate.getDate()-1);
            }
            
            
            table += '<tr style="border:1px solid #000">';
            table += '<th style="border:1px solid #000;padding:5px;background-color:#dadad4">' + 'User Code'  + '</th>';
            table += '<th style="border:1px solid #000;padding:5px;background-color:#dadad4">' + 'Name'  + '</th>';
            table += '<th style="border:1px solid #000;padding:5px;background-color:#dadad4">' + 'Check-In Time'  + '</th>';
            table += '<th style="border:1px solid #000;padding:5px;background-color:#dadad4">' + 'Check-Out Time'  + '</th>';
            table += '<th style="border:1px solid #000;padding:5px;background-color:#dadad4">' + 'Working Hours'  + '</th>';
            table += '<th style="border:1px solid #000;padding:5px;background-color:#dadad4">' + 'Status'  + '</th>';
            table += '<tr>';
            //console.log("Yesterday's Date: " + yesterday);
            console.log("In sendEmail");
            var newLine = "<br>";
            var msg = '';
            var reportDate;
                var query = new Parse.Query("VirtualForce");
                query.ascending("checkInTime");
                query.startsWith("checkInTime", yesterday.toDateString());
                //query.equalTo("check",'checkin');
                query.find({
                       success:function (results) {
                               console.log("results =--> " + results.length);
                               console.log("Results =--> results for checkin VF");
                               //$('#myGrid').empty();
                               //$("#myGrid").append(results);
                               if(results.length == 0) {
                                       //var txt = "<div>No Result Found</div>";					
                                       //$("#myGrid").append(txt);
                                       console.log("No Results! VF1");
                                       getKualitatem();

                               } else {	
                                       
                                       for(var i=0; i < results.length; i++){
                                               table += '<tr style="border:1px solid #000">';
                                               table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("userPin")  + '</td>';
                                               table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("userName")  + '</td>';
                                               checkin_time = results[i].get("checkInTime").substr(results[i].get("checkInTime").length - 5);
                                                time = checkin_time.split(':');
                                                //console.log("Time[1]: " + time[1]);
                                                if (time[1].length < 2){
                                                    checkin_time = time[0] + ':0' + time[1];
                                                    console.log("CheckinTime: " + checkin_time);
                                                }
                                                checkout_time = results[i].get("checkOutTime").substr(results[i].get("checkOutTime").length - 5);
                                                if (checkout_time == null || checkout_time == ''){
                                                  checkout_time = 'Still Here!';
                                                 }
                                                 else{
                                                     time = checkout_time.split(':');
                                                     if (time[1].length < 2){
                                                         checkout_time = time[0] + ':0' + time[1];
                                                         console.log("CheckoutTime: " + checkout_time);
                                                     }
                                                 }
                                                table += '<td style="border:1px solid #000;padding:5px;">' + checkin_time  + '</td>';
                                                table += '<td style="border:1px solid #000;padding:5px;">' + checkout_time  + '</td>';
                                                table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("workingHours")  + '</td>';
                                                table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("status")  + '</td>';
                                                table += '<tr>';
                                               
                                       }
                                       
                                       getKualitatem();
                                      
                               }		
                               
                       },
                       error:function (error) {
                               // $(".error").show();
                       }
               });
               
               function getKualitatem(){
                   
                   var query2 = new Parse.Query("Kualitatem");
                    query2.ascending("checkInTime");
                    query2.startsWith("checkInTime", yesterday.toDateString());
                    //query2.equalTo("check",'checkin');
                    query2.find({
                           success:function (results) {
                                   console.log("results =--> " + results.length);
                                   console.log("Results =--> results for checkin KM");
                                   //$('#myGrid').empty();
                                   //$("#myGrid").append(results);
                                   if(results.length == 0) {
                                           //var txt = "<div>No Result Found</div>";					
                                           //$("#myGrid").append(txt);
                                            console.log("No Results! KM1");
                                            uploadAll();
                                   } else {	

                                           for(var i=0; i < results.length; i++){
                                                table += '<tr style="border:1px solid #000">';
                                                table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("userPin")  + '</td>';
                                                table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("userName")  + '</td>';
                                                checkin_time = results[i].get("checkInTime").substr(results[i].get("checkInTime").length - 5);
                                                time = checkin_time.split(':');
                                                //console.log("Time[1]: " + time[1]);
                                                if (time[1].length < 2){
                                                    checkin_time = time[0] + ':0' + time[1];
                                                    console.log("CheckinTime: " + checkin_time);
                                                }
                                                checkout_time = results[i].get("checkOutTime").substr(results[i].get("checkOutTime").length - 5);
                                                if (checkout_time == null || checkout_time == ''){
                                                  checkout_time = 'Still Here!';
                                                 }
                                                 else{
                                                     time = checkout_time.split(':');
                                                     if (time[1].length < 2){
                                                         checkout_time = time[0] + ':0' + time[1];
                                                         console.log("CheckoutTime: " + checkout_time);
                                                     }
                                                 }
                                                 table += '<td style="border:1px solid #000;padding:5px;">' + checkin_time  + '</td>';
                                                 table += '<td style="border:1px solid #000;padding:5px;">' + checkout_time  + '</td>';
                                                 reportDate = results[i].get("checkInTime").substr(results[i].get("checkInTime"),15);
                                                 table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("workingHours")  + '</td>';
                                                 table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("status")  + '</td>';
                                                 table += '<tr>';

                                        }
                                            console.log(table += '</table>');
                                           msg = newLine + '<h1 style="margin-left:35%">Attendance Report</h1>' + newLine + "<h3 style='display:inline-block'>Date: </h3>" + "<span style='font-size:14px;margin-left:5px;'>" + reportDate + '</span>' +newLine + table + newLine + newLine;
                                           sendEmailTo('attendance@gmail.com','maryum.babar@virtual-force.com','Attendance Report', msg, function (success) {
                                                if (success) {
                                                    console.log("Email successfully sent!");
                                                    return true;
                                                }
                                                else {
                                                    console.log("EmailBcc having some problem");
                                                    return false;
                                                }
                                            });


                                           //console.log(table += '</table>');


                                   }


                           },
                           error:function (error) {
                                   // $(".error").show();
                           }
                   });
                   
               }
               
               
        }
        
        function sendEmailTo(fromEmail,receiverEmail,ccEmail,subject,m_phone){
            
                console.log("fromEmail" + fromEmail);
                console.log("receiverEmail" + receiverEmail);
                console.log("subject" + subject);
                console.log("body" + m_phone);
            
            Parse.Cloud.run("sendEmailCc",
                    {
                        //key:"key-96p0dt86t-obp8eq1wzgh2aal1l371m3",
                        fromEmail:fromEmail,
                        toEmail:receiverEmail,
                        ccEmail:ccEmail,
                        subject:subject,
                        html:m_phone
                        //fromName:'sweetness',
                        //toName:'m.kashif.abdullah@gmail.com'
                    },
                    {
                        success:function (msg) {
                            uploadAll();
                            return true;
                        },
                        error:function () {
                           return false;
                        }
                    }
                );
        }
        
        
        
        
        function setMessages(check){
            
            
            /*var ca = document.cookie.split(';');
                for(var i=0; i< ca.length; i++) 
                  {
                      var c = ca[i].trim();
                   if (c.indexOf("username")== 0) {
                        username = (c.substring(c.indexOf("username").length,c.length)).split("=");
                        username = unescape(username[1]);
                    }
                  }*/
            username = window.localStorage.getItem("username");
            var currentDate = new Date();
            
            if (check == 'true'){
                var query = new Parse.Query("MessageConfig");
                query.equalTo("messageType", 'checkin');
                //query.equalTo("check", 'checkin');
                query.find({
                    success:function (results) {
                        $('.welcome-message').text(results[0].get("message"));
                        $('.welcome-text').text('Welcome ');
                        $('.welcome-text2').text(username + '!');
                        $('.check-text').text("You checked in at");
                    },
                    error: function (error){

                    }
                });
            }
            else{
                var query = new Parse.Query("MessageConfig");
                query.equalTo("messageType", 'checkout');
                //query.equalTo("check", 'checkin');
                query.find({
                    success:function (results) {
                        $('.welcome-message').text(results[0].get("message"));
                        $('.welcome-text').text('Goodbye ');
                        $('.welcome-text2').text(username + '!');
                        $('.check-text').text("You checked out at");
                    },
                    error: function (error){

                    }
                });
            }
        }
        
        function backToLogin2(){
            alert("Email Sent!");
                window.location = "index.html";
        }
        
        function uploadAll(){
            console.log("In UploadAll!");
             var currentDate = new Date();
             var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();
             var  expiryTime = new Date();
             var todaysDate  = currentDate.toDateString();
             expiryTime.setHours(23);
             expiryTime.setMinutes(59);
             expiryTime.setSeconds(59);
//             var status;
//             console.log("Check Status: " + checkStatus.toString());
//             console.log("Current Date: " + currentDate.toString());
//             if ((currentDate < checkStatus || currentDate == checkStatus)){
//                 status = 'ontime';
//             }
//             else{
//                 status = 'late';
//             }
                var query = new Parse.Query("Users");
                query.find({
                    success:function (r_auth) {
                        if (r_auth.length > 0) {
                            for(var i=0;i < r_auth.length;i++){
                                username = r_auth[i].get("userName");
                                company = r_auth[i].get("company");
                                userpin = r_auth[i].get("userPin");
                                department = r_auth[i].get("department");
                                
                                
                                console.log("Company: " + company);
               
                                if (company == 'virtualforce'){
                                    console.log("In Virtual Force: " + i);
                                    var virtualF = Parse.Object.extend("VirtualForce");
                                    var vf = new virtualF();
                                    vf.set("userPin",userpin);
                                    vf.set("userName",username);
                                    vf.set("department",department);
                                    vf.set("checkInTime",currentTime);
                                    vf.set("status",'absent');
                                    vf.save(null, {
                                        success:function (virtualf) {
                                            console.log(virtualf + " saved successfully");
                                            //document.cookie = "launch=true;" + " expires=" + expiryTime;
                                            window.localStorage.setItem("launch","true");
                                            window.localStorage.setItem("tdate",todaysDate);
                                            //$('#launch').css({'display':'none'});
                                            //$('#login').css({'display':'block'});
                                        },
                                        error:function (pSweet, error) {
                                            console.log("saveRecord() -> " + error.code + " " + error.message);
                                        }

                                    });
                                }
                                else if (company == 'kualitatem'){
                                    
                                    console.log("In Kualitatem: " + i);
                                    var kualitatem = Parse.Object.extend("Kualitatem");
                                    var km = new kualitatem();
                                    km.set("userPin",userpin);
                                    km.set("userName",username);
                                    km.set("department",department);
                                    km.set("checkInTime",currentTime);
                                    km.set("status",'absent');
                                    km.save(null, {
                                        success:function (kuali) {
                                            console.log(kuali + " saved successfully");
                                            window.localStorage.setItem("launch","true");
                                            window.localStorage.setItem("tdate",todaysDate);
                                            //$('#launch').css({'display':'none'});
                                            //$('#login').css({'display':'block'});
                                        },
                                        error:function (pSweet, error) {
                                            console.log("saveRecord() -> " + error.code + " " + error.message);
                                        }

                                    });
                                }
                                
                            }
                            $('#launch').css({'display':'none'});
                            $('#login').css({'display':'block'});
                        }
                    },error: function(){
                        
                    }
                });
        }
      