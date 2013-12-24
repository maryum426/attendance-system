var checkin;
var username;
var userpin;
var company;
var department;
var userAvatar;

        function checkIn(){
            checkin = true;
            console.log('CheckIn');
            window.location = "picUpload.html?checkin=" + checkin;
        }
        
        function checkOut(){
            checkin = false;
            console.log('CheckOut');
            window.location = "picUpload.html?checkin=" + checkin;
        }
        
        function logout(){
            window.location = "index.html";
        }
        
        function codePageOk(){
            $('#codeOk').attr('disabled','disabled');
            userpin = $('.code-holder').val();
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
                        
                        document.cookie = "pin=" + userpin + ";" ; 
                        document.cookie = "username=" + username + ";" ; 
                        document.cookie = "company=" + company + ";"  ;
                        document.cookie = "department=" + department + ";" ;

                        window.location = "check.html";
                    }
                    else {
                       console.log("User doesnot exist!");
                    }
                },
                error:function (error) {
                    console.log("Error -> " + error.code + " " + error.message);
                }

            });
            
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
                
                var options =   {
                    quality: 100,
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
                    
                    $("#my_image").css({'display':'block'});
                    $("#my_image").attr("src",data3);
                    userAvatar = data3;
                    
            };
                
                //console.log("File Path: " + file.path);
        var onFail = function(e) {
            alert("On fail " + e);
            //alert("Profile Picture Progress: " + $rootScope.loginInProgress_profile);
        };
        
        function uploadOk(){
            alert("In Upload!");
            $('#submit').attr('disabled','disabled');
            //URL Parsing
                var loc = window.location.search.substring(1),i, val, params = loc.split("&");
                for (i=0;i<params.length;i++) {
                    val = params[i].split("=");
                    if (val[0] == "checkin") {
                        checkin = unescape(val[1]);
                    }
                }
            console.log("CheckIn: " + checkin);
                    var thumbnail = 400;
                    var ppWidth, ppHeight;
                    var data;
                    data = "data:image/jpeg;base64," + userAvatar;

                    //alert("Image: " + data);
                    var image = new Image();
                    image.src = data;

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
        
        
        
        function uploadBack(){
            window.location = "check.html";
        }
        
         var uploadParsePic = function(url){
            var currentDate = new Date();
            //var currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();
            
            if (company == "virtualforce"){
                var virtualF = new Parse.Object.Extend("VirtualForce");
                var vf = new virtualF();
                if (checkin == 'true'){
                        if (company == 'virtualforce'){
                            
                            var virtualF = Parse.Object.extend("VirtualForce");
                            var vf = new virtualF();
                            vf.set("userPin",userpin);
                            vf.set("userAvatar",url);
                            vf.set("checkInOutTime",currentDate);
                            vf.set("department",department);
                            vf.set("check","checkin")
                            vf.set("createdAt",currentDate);
                            vf.save(null, {
                                success:function (virtualf) {
                                    console.log(virtualf + " saved successfully");
                                    alert("Done Upload!");
                                    window.location = "home.html?checkin=" + checkin;
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                        }
                        else if (company == 'kualitatem'){
                            
                            var kualitatem = Parse.Object.extend("Kualitatem");
                            var km = new kualitatem();
                            km.set("userPin",userpin);
                            km.set("userAvatar",url);
                            km.set("checkInOutTime",currentDate);
                            km.set("department",department);
                            km.set("check","checkin");
                            km.set("createdAt",currentDate);
                            km.save(null, {
                                success:function (kuali) {
                                    console.log(kuali + " saved successfully");
                                    window.location = "home.html?checkin=" + checkin;
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                        }
                    }
                    else{
                        
                        if (company == 'virtualforce'){
                            
                            var virtualF = Parse.Object.extend("VirtualForce");
                            var vf = new virtualF();
                            vf.set("userPin",userpin);
                            vf.set("userAvatar",url);
                            vf.set("checkInOutTime",currentDate);
                            vf.set("department",department);
                            vf.set("check","checkout")
                            vf.set("createdAt",currentDate);
                            vf.save(null, {
                                success:function (virtualf) {
                                    console.log(virtualf + " saved successfully");
                                    window.location = "home.html?checkin=" + checkin;
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                            
                            
                        }
                        else if (company == 'kualitatem'){
                            
                            var kualitatem = Parse.Object.extend("Kualitatem");
                            var km = new kualitatem();
                            km.set("userPin",userpin);
                            km.set("userAvatar",url);
                            km.set("checkInOutTime",currentDate);
                            km.set("department",department);
                            km.set("check","checkout");
                            km.set("createdAt",currentDate);
                            km.save(null, {
                                success:function (kuali) {
                                    console.log(kuali + " saved successfully");
                                    window.location = "home.html?checkin=" + checkin;
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                        }
                    }
        
            }
        }
        
        /*var file;
        var camera = document.getElementById("capture");
        camera.addEventListener("click", function(e) {
            camera.addEventListener("change", function(e) {
               //alert("In change event1");
                var files = e.target.files || e.dataTransfer.files;
                file = files[0];
                $("#my_image").css({'display':'block'});
                //$("#my_image").attr("src",window.URL.createObjectURL(file));
                 
                
                
                //URL Parsing
                *//*var loc = window.location.search.substring(1),i, val, params = loc.split("&");
                for (i=0;i<params.length;i++) {
                    val = params[i].split("=");
                    if (val[0] == "pin") {
                        userpin = unescape(val[1]);
                    }
                    else if(val[0] == "company"){
                        company = unescape(val[1]);
                    }
                    else{
                        department = unescape(val[1]);
                    }
                }*//*
                
                //Get values from cookie
                var ca = document.cookie.split(';');
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
                    
                  }
                    //alert("User Pin: " + userpin);
                    //alert("User Name: " + username);
                    //alert("User Company: " + company);
                    //alert("User Dept: " + department);
                    
                //console.log("URL: " + s);
               
            });
        });*/
        
        
        /*function uploadOk(){
            alert("In Upload!");
            $('#submit').attr('disabled','disabled');
            //URL Parsing
                var loc = window.location.search.substring(1),i, val, params = loc.split("&");
                for (i=0;i<params.length;i++) {
                    val = params[i].split("=");
                    if (val[0] == "checkin") {
                        checkin = unescape(val[1]);
                    }
                }
            console.log("CheckIn: " + checkin);
            
            var userAvatar;
                //Parse.initialize("oxdew7mMEtpnkypr0DLtpd5rPg7vFFlgo1VPBCJs","7AtLcq4907OUmsLMpZcv0y4fgrZhUKSvv8iz9ncz");
                userAvatar = 'https://api.parse.com/1/files/' + file.name;;
                
                 $.ajax({
                    type: "POST",
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Parse-Application-Id", 'oxdew7mMEtpnkypr0DLtpd5rPg7vFFlgo1VPBCJs');
                        request.setRequestHeader("X-Parse-REST-API-Key", 'U20mEfCfZxq1jNMOLLJkQCJieVSpekFDcHRXmLDp');
                        request.setRequestHeader("Content-Type", file.type);
                    },
                    url: userAvatar,
                    data: file,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                    var picUrl = data.url;
                    console.log("PicUrl: " + picUrl);
                    var currentDate = new Date();
                    console.log("Company: " + company);
                    if (checkin == 'true'){
                        if (company == 'virtualforce'){
                            
                            var virtualF = Parse.Object.extend("VirtualForce");
                            var vf = new virtualF();
                            vf.set("userPin",userpin);
                            vf.set("userAvatar",picUrl);
                            vf.set("checkInOutTime",currentDate);
                            vf.set("department",department);
                            vf.set("check","checkin")
                            vf.set("createdAt",currentDate);
                            vf.save(null, {
                                success:function (virtualf) {
                                    console.log(virtualf + " saved successfully");
                                    alert("Done Upload!");
                                    window.location = "home.html?checkin=" + checkin;
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                        }
                        else if (company == 'kualitatem'){
                            
                            var kualitatem = Parse.Object.extend("Kualitatem");
                            var km = new kualitatem();
                            km.set("userPin",userpin);
                            km.set("userAvatar",picUrl);
                            km.set("checkInOutTime",currentDate);
                            km.set("department",department);
                            km.set("check","checkin");
                            km.set("createdAt",currentDate);
                            km.save(null, {
                                success:function (kuali) {
                                    console.log(kuali + " saved successfully");
                                    window.location = "home.html?checkin=" + checkin;
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                        }
                    }
                    else{
                        
                        if (company == 'virtualforce'){
                            
                            var virtualF = Parse.Object.extend("VirtualForce");
                            var vf = new virtualF();
                            vf.set("userPin",userpin);
                            vf.set("userAvatar",picUrl);
                            vf.set("checkInOutTime",currentDate);
                            vf.set("department",department);
                            vf.set("check","checkout")
                            vf.set("createdAt",currentDate);
                            vf.save(null, {
                                success:function (virtualf) {
                                    console.log(virtualf + " saved successfully");
                                    window.location = "home.html?checkin=" + checkin;
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                            
                            
                        }
                        else if (company == 'kualitatem'){
                            
                            var kualitatem = Parse.Object.extend("Kualitatem");
                            var km = new kualitatem();
                            km.set("userPin",userpin);
                            km.set("userAvatar",picUrl);
                            km.set("checkInOutTime",currentDate);
                            km.set("department",department);
                            km.set("check","checkout");
                            km.set("createdAt",currentDate);
                            km.save(null, {
                                success:function (kuali) {
                                    console.log(kuali + " saved successfully");
                                    window.location = "home.html?checkin=" + checkin;
                                    //cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                }

                            });
                        }
                    }
                    },
                    error: function(data){
                             var obj = jQuery.parseJSON(data);
                                console.log(obj.error);
                    }
                    })
            
        }*/
        