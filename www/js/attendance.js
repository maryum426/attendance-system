var checkin;
var username;
var userpin;
var company;
var department;
var userAvatar = null;
var offlinePic  = null;
var offPicData = null;
var db = window.openDatabase("users", "1.0", "Users", 2048576);
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
            $('#launch').css({'opacity':'0.4'});
            
            sendEmail();
           
        }
        
        
       function queryDB() {
            $('.pic_upload').hide();
            $('.btn-holder2').hide();
            $('#codeOk').attr('disabled','disabled');
            $('#codeOk').css({'opacity':'0.4'});
            userpin = ($('.code-holder').val()).toString();
            console.log("User Pin: " + userpin);
            
            //Getting User Info
            function it(up){
                
                db.transaction(function(t){
                    t.executeSql('SELECT * FROM USERS WHERE userpin ==' + up , [], querySuccess, errorCB);
                });
                
            };
            it(userpin);
            checkCheckIn();
            
            
       }
       
       function errorCB9 (err){	 	
            console.log("I am wild!")	 	
        }
        
        // Query the success callback
        function querySuccess(tx, results) {
            
            console.log("Returned rows = " + results.rows.length);
            // This will be true since it was a SELECT statement and so rowsAffected was 0
            var len = results.rows.length;
            if (len > 0){
                    console.log("Username: " + results.rows.item(0).username);
                    console.log("Comapny: " + results.rows.item(0).company);
                    console.log("Department: " + results.rows.item(0).department);
                    username = results.rows.item(0).username;
                    company = results.rows.item(0).company;
                    department = results.rows.item(0).department;
                    
                    
                    //Storing data in local storage  for efficiency
                    window.localStorage.setItem("pin",userpin);
                    
                    window.localStorage.setItem("username",username);
                    
                    window.localStorage.setItem("company",company);
                    
                    window.localStorage.setItem("department",department);
                    
                    
                
            }
            else if(results.rows.length) {
                alert("User doesnot exist!");
                $('#codeOk').removeAttr('disabled');
                $('#codeOk').css({'opacity':'1.4'});
                $('.code-holder').val(null);
             }
            
            checkCheckIn();
        }

        // Transaction error callbacks
    
        function errorCB(err) {
            console.log("Error processing SQL: "+err.code);
        }
        
        function errorCB2(err) {
            console.log("Error processing SQL: "+err.code);
        }
        
        function errorCBout(err) {	 	
            console.log("Error in offline Checkout");	 	
        }
        
        /*function codePageOk() {
            
            $('.pic_upload').hide();
            $('.btn-holder2').hide();
            $('#codeOk').attr('disabled','disabled');
            $('#codeOk').css({'opacity':'0.4'});
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
                       console.log("User doesnot exist!");
                       $('#codeOk').removeAttr('disabled');
                       $('#codeOk').css({'opacity':'1.4'});
                       $('.code-holder').val(null);
                    }
                },
                error:function (error) {
                    console.log("Error -> " + error.code + " " + error.message);
                }

            });
            
        }*/
       
       //Save records locally
       function upLocalvfIn(offpic,ct,dep,stat,up){
            db.transaction(function(t){
                alert("My Query Up local vf!");
                t.executeSql("UPDATE VIRTUALFORCE SET userAvatarIn = '"+ offpic+ "', checkInTime = '" + ct + "', department = '" + dep + "', checkstat = 'checkin', status = '" + stat + "', uploaded = 'true1' WHERE userpin ==" + up , [], queryHome, errorCB);
            });
        }
        
        function upLocalkmIn(offpic,ct,dep,stat,up){
            db.transaction(function(t){
                alert("My Query Up local km!");
                t.executeSql("UPDATE KUALITATEM SET userAvatarIn = '"+ offpic+ "', checkInTime = '" + ct + "', department = '" + dep + "', checkstat = 'checkin', status = '" + stat + "', uploaded = 'true1' WHERE userpin ==" + up , [], queryHome, errorCB);
            });
        }
        function deleteLocalvf(up){
            db.transaction(function(t){
                alert("My Query Del local vf!");
                t.executeSql("DELETE FROM VIRTUALFORCE WHERE userpin ==" + up , [], queryHome, errorCB);
            });
        }
        function deleteLocalkm(up){
            db.transaction(function(t){
                alert("My Query Del local km!");
                t.executeSql("DELETE FROM KUALITATEM WHERE userpin ==" + up , [], queryHome, errorCB);
            });
        }
        
        function queryRedirect(tx,results){
            //WHERE  userpin ='" + up + "'"+"AND SUBSTR(checkInTime,1,7) =' " + cd + "'
            console.log("Results Length: " + results.rows.length);
            //console.log("checkintime : " + results.rows.item(0).Newcol);
                
            if (results.rows.length == 0)
                    {
                       alert("You've already checked out!\n Bubye! :D");
                       $('#codeOk').removeAttr('disabled');
                       $('#codeOk').css({'opacity':'1.4'});
                       $('.code-holder').val(null);
                    }   

                if (results.rows.item(0).checkstat == 'checkin')
                    {
                        window.location = "picUpload.html?checkin=false";
                    }
                else if (results.rows.item(0).checkstat == 'checkout')
                    {
                        window.location = "picUpload.html?checkin=true";
                    }
                else if (results.rows.item(0).checkstat == '' || results.rows.item(0).check == null)
                    {
                        window.location = "picUpload.html?checkin=true";
                    }
        }
        
        function it6(up,cd){
                                
            db.transaction(function(t1){
                console.log("In checkCheckIn2!");
                console.log("Userpin: " + up);
                console.log("Date: " + cd);
                t1.executeSql("SELECT * FROM VIRTUALFORCE WHERE  userpin ='" + up + "'", [] ,queryRedirect, errorCB2);
            });
        };
        
        function offCheckkm(up,cd){
            //console.log("In DB!");
            db.transaction(function(t){
                t.executeSql("SELECT substr(checkInTime,0,15) FROM KUALITATEM WHERE userpin ='" + up + "'", [] ,queryRedirect, errorCB2);
            });
        }
        
        function checkCheckIn(){
            console.log("In checkCheckIn!");
            var currentDate = new Date();
            var d = currentDate.toDateString();
            //Check checkin/out status
                        
                            if (company == 'virtualforce'){
                                
                               if (navigator.onLine){
                                var query = new Parse.Query("VirtualForce");
                                query.equalTo("userPin", userpin);
                                query.startsWith("checkInTime", currentDate.toDateString());
                                query.find({
                                    success:function (results) {
                                        console.log("Results Length: " + results.length);
                                            
                                            if (results.length == 0)
                                                {
                                                    console.log("User doesnot exist!");
                                                    $('#codeOk').removeAttr('disabled');
                                                    $('#codeOk').css({'opacity':'1.4'});
                                                    $('.code-holder').val(null);
                                                }   
                                                
                                            if (results[0].get("check") == 'checkin')
                                                {
                                                    window.location = "picUpload.html?checkin=false";
                                                }
                                            else if (results[0].get("check") == 'checkout')
                                                {
                                                    window.location = "picUpload.html?checkin=true";
                                                }
                                            else if (results[0].get("check") == '' || results[0].get("check") == null)
                                                {
                                                    window.location = "picUpload.html?checkin=true";
                                                }
                                            
                                        },
                                        error:function (error) {

                                        }
                                });
                               }
                               else{
                                   it6(userpin,d);
                               }
                                 
                            }
                            else if (company == 'kualitatem'){
                                if(navigator.onLine){
                                var query = new Parse.Query("Kualitatem");
                                query.equalTo("userPin", userpin);
                                query.startsWith("checkInTime", currentDate.toDateString());
                                query.find({
                                    success:function (results) {
                                        console.log("Results Length: " + results.length);

                                            if (results.length == 0)
                                                {
                                                    console.log("User doesnot exist!");
                                                    $('#codeOk').removeAttr('disabled');
                                                    $('#codeOk').css({'opacity':'1.4'});
                                                    $('.code-holder').val(null);
                                                }   
                                                
                                           if (results[0].get("check") == 'checkin')
                                                {
                                                    window.location = "picUpload.html?checkin=false";
                                                }
                                            else if (results[0].get("check") == 'checkout')
                                                {
                                                    window.location = "picUpload.html?checkin=true";
                                                }
                                            else if (results[0].get("check") == '' || results[0].get("check") == null)
                                                {
                                                    window.location = "checkpicUpload.html?checkin=true";
                                                }
                                        },
                                        error:function (error) {

                                        }
                                });
                                }
                                else{
                                   it(userpin,d);    
                                }
                             
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
                
                $('.pic_upload').css({'display':'block'});
                $('.btn-holder2').css({'display':'block'});
                $('#snap-text').css({'display':'none','margin-top':'0'});
                $('.pic-text').css({'display':'none','margin-top':'0'});
                $('#submit1').removeAttr('disabled');
                $('#submit1').css({'opacity':'1.4'});
                var options =   {
                    quality: 50,
                    cameraDirection:1,
                    sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                    correctOrientation: true,
                    destinationType: navigator.camera.DestinationType.DATA_URL
                    //allowEdit: true
                };
                
                // Take picture using device camera and retrieve image as base64-encoded string
                navigator.camera.getPicture(onSuccess,onFail,options);
          }
          var onSuccess = function(data3) {
              
                    //console.log("On success called");      
                    userAvatar = data3;
                    var data;
                    data = "data:image/jpeg;base64," + userAvatar;
                    $("#my_image").attr("src",data);
                    userAvatar = data;
            };

        var onFail = function(e) {
            //console.log("On fail " + e);
            //console.log("Profile Picture Progress: " + $rootScope.loginInProgress_profile);
        };
        
        function uploadOk(){
            //console.log("In Upload!");
            if (userAvatar == null){
                alert("Take a picture first!");
                $('#submit1').removeAttr('disabled');
                $('#submit1').css({'opacity':'1.4'});
                
            }
            
            $('#submit1').attr('disabled','disabled');
            $('#submit1').css({'opacity':'0.4'});
                    
                   
            var thumbnail = 400;
            var ppWidth, ppHeight;
            //console.log("Image: " + data);
            var image = new Image();
            image.src = userAvatar;
            offlinePic = userAvatar;
            
            //Resizing Image
            var canvas = document.createElement('canvas');

            canvas.width = thumbnail;
            canvas.height = thumbnail;


            image.onload = function(){
                
                ppWidth = image.width;
                ppHeight = image.height;

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
                    //console.log("IF");
                } else {
                    imageHeight = Math.round(thumbnail * image.height / image.width);
                    imageWidth = thumbnail;    
                    offsetY = - Math.round((imageHeight - thumbnail) / 2);            
                    //console.log("ELSE");
                }

                context.drawImage(image, offsetX, offsetY, imageWidth, imageHeight);
                var data2 = canvas.toDataURL('image/jpeg');

                data2 = data2.replace(/^data:image\/(png|jpeg);base64,/, "");
                offPicData  = data2;

                if (navigator.onLine){ //Online
                    
                    uploadParseFile(data2);
                    
                }
                else{ //Offline
                    uploadParsePic(userAvatar,offPicData); 
                }

                        
        }
        
        function uploadParseFile(pf){
            
            //Initialize Parse
            Parse.initialize("oxdew7mMEtpnkypr0DLtpd5rPg7vFFlgo1VPBCJs","7AtLcq4907OUmsLMpZcv0y4fgrZhUKSvv8iz9ncz");

            var parseFile = new Parse.File("mypic.jpg", {base64:pf});
            
            //Uploading file to Parse
            parseFile.save().then(function() {
                                            //console.log("Got it!");
                                            userAvatar = parseFile.url();
                                            uploadParsePic(userAvatar,pf);
                                            console.log (parseFile.url());
                                            console.log("Ok");
                                            console.log("In Uploadfinal!");

                                        }, function(error) {
                                            console.log("Error");
                                            console.log(error);
                                        });
            }
        }
        
        function uploadBack(){
            window.location = "index.html";
        }
        
        function syncDataCheckIn(){
            console.log("Sync Data Called");
            
            if (checkin == 'true'){ //Checked-In
                
                console.log("Sync Data Called Checkin!");
                    db.transaction(function(t){
                        console.log("This query called!");
                        t.executeSql("SELECT * FROM VIRTUALFORCE WHERE uploaded == 'false1'", [], querySyncIn, errorCB);
                        t.executeSql("SELECT * FROM KUALITATEM WHERE uploaded == 'false1'", [], querySyncIn, errorCB);
                    });
                
            }
            else{ //Checked-Out
                
                console.log("Sync Data Called Checkout!");
                    db.transaction(function(t){
                        t.executeSql("SELECT * FROM VIRTUALFORCE WHERE uploaded ='false2'", [], querySyncOut, errorCB);
                        t.executeSql("SELECT * FROM KUALITATEM WHERE uploaded ='false2'", [], querySyncOut, errorCB);
                    });
                
            }
        }
        
        function uploadPicToParse(pic3){
            
            //Initialize Parse
            Parse.initialize("oxdew7mMEtpnkypr0DLtpd5rPg7vFFlgo1VPBCJs","7AtLcq4907OUmsLMpZcv0y4fgrZhUKSvv8iz9ncz");

            var parseFile = new Parse.File("mypic.jpg", {base64:pic3});
            
            //Uploading Pic to Parse
            parseFile.save().then(function() {
                                            //console.log("Got it!");
                                            userAvatar = parseFile.url();
                                            console.log (parseFile.url());
                                            console.log("Ok");
                                            console.log("In Uploadfinal!");

                                        }, function(error) {
                                            console.log("Error");
                                            console.log(error);
                                        });
            
        }
        
        function querySyncIn(t,result){  //Sync Check-In Records
            if(result.rows.length == 0){
                console.log("No Result found!");
                return;
            }
            else{
                console.log("Sync CheckIn");
                var currentDate = new Date();
                var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();

                var checkStatus = new Date(); // Status : late,ontime
                checkStatus.setHours(9);
                checkStatus.setMinutes(30);
                checkStatus.setSeconds(59);

                var checkSDate = new Date(); //Start Date
                checkSDate.setHours(00);
                checkSDate.setMinutes(00);
                checkSDate.setSeconds(00);

                var checkEDate = new Date(); //End Date
                checkEDate.setHours(23);
                checkEDate.setMinutes(59);
                checkEDate.setSeconds(59);

                var status;

                console.log("Check Status: " + checkStatus.toString());
                console.log("Current Date: " + currentDate.toString());

                if ((currentDate < checkStatus || currentDate == checkStatus)){
                    status = 'ontime';
                }
                else{
                    status = 'late';
                }

                var j=0;
                var k=0;

                //console.log("Query Results: " + result.rows.length);
                for (var i=0;i<result.rows.length;i++){
                     //console.log("In Loop!");
                    if ((result.rows.item(i).userpin).substr(0,1) == '1'){
                               console.log("Called for VF!");
                               console.log("UserPin to find: " + result.rows.item(i).userpin);

                               var query = new Parse.Query("VirtualForce");
                               query.equalTo("userPin", result.rows.item(i).userpin);
                               query.greaterThanOrEqualTo( "createdAt", checkSDate );
                               query.lessThanOrEqualTo("createdAt", checkEDate);
                               query.find({
                                   success:function (results) {
                                       console.log("Result in VF found");
                                       console.log("Results Length in VF sync: " +results.length);
                                       console.log("Results Found: " + result.rows.item(j).checkInTime);
                                       console.log("Results Found (Username): " + result.rows.item(j).username);

                                       //Upload Picture to Parse

                                       uploadPicToParse(result.rows.item(j).userAvatarIn);
                                       results[0].set("userAvatarIn",userAvatar);
                                       results[0].set("checkInTime",result.rows.item(j).checkInTime);
                                       results[0].set("department",result.rows.item(j).department);
                                       results[0].set("check","checkin");
                                       results[0].set("createdAt",currentDate);
                                       results[0].set("status",result.rows.item(j).status);
                                       db.transaction(function(t){
                                           console.log("My Query Home Called!");
                                           t.executeSql("UPDATE VIRTUALFORCE SET uploaded = 'true1' WHERE userpin ==" + result.rows.item(j).userpin , [], (function(){console.log("Success!");}), errorCB);
                                       });
                                       j++;
                                       results[0].save(null, {
                                           success:function (kuali) {
                                               console.log(kuali + " saved successfully");

                                           },
                                           error:function (pSweet, error) {
                                               console.log("saveRecord() -> " + error.code + " " + error.message);
                                           }

                                       });
                                   },
                                   error:function (pSweet, error) {
                                       console.log("saveRecord() -> " + error.code + " " + error.message);
                                   }

                               });
                    }
                    else if ((result.rows.item(i).userpin).substr(0,1) == '2'){
                        console.log("Called for KM!");
                               var query = new Parse.Query("Kualitatem");
                               query.equalTo("userPin", result.rows.item(i).userpin);
                               query.greaterThanOrEqualTo( "createdAt", checkSDate );
                               query.lessThanOrEqualTo("createdAt", checkEDate);
                               query.find({
                                   success:function (results) {
                                       //console.log("Results Length: " +results.length);

                                       //Upload Picture to Parse
                                       uploadPicToParse(result.rows.item(k).userAvatarIn);
                                       results[0].set("userAvatarIn",userAvatar);
                                       results[0].set("checkInTime",result.rows.item(k).checkInTime);
                                       results[0].set("department",result.rows.item(k).department);
                                       results[0].set("check","checkin");
                                       results[0].set("createdAt",currentDate);
                                       results[0].set("status",result.rows.item(k).status);
                                       db.transaction(function(t){
                                           console.log("My Query Home Called!");

                                           //Update record locally
                                           t.executeSql("UPDATE KUALITATEM SET uploaded = 'true1' WHERE userpin ==" + result.rows.item(j).userpin , [], (function(){console.log("Success!");}), errorCB);
                                       });
                                       k++;
                                       results[0].save(null, {
                                           success:function (kuali) {
                                               console.log(kuali + " saved successfully");

                                           },
                                           error:function (pSweet, error) {
                                               console.log("saveRecord() -> " + error.code + " " + error.message);
                                           }

                                       });
                                   },
                                   error:function (pSweet, error) {
                                       console.log("saveRecord() -> " + error.code + " " + error.message);
                                   }

                               });
                    }
                }
            }
        }
        
        function querySyncOut(t,result){ //Sync Check-out Records
            
            if(result.rows.length == 0){
                console.log("No Result found!");
                return;
            }
            else{
                var currentDate = new Date();
                var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();

                var checkStatus = new Date(); // Status : late,ontime
                checkStatus.setHours(9);
                checkStatus.setMinutes(30);
                checkStatus.setSeconds(59);

                var checkSDate = new Date(); //Start Date
                checkSDate.setHours(00);
                checkSDate.setMinutes(00);
                checkSDate.setSeconds(00);

                var checkEDate = new Date(); //End Date
                checkEDate.setHours(23);
                checkEDate.setMinutes(59);
                checkEDate.setSeconds(59);

                var status;
                console.log("Check Status: " + checkStatus.toString());
                console.log("Current Date: " + currentDate.toString());

                if ((currentDate < checkStatus || currentDate == checkStatus)){
                    status = 'ontime';
                }
                else{
                    status = 'late';
                }

                console.log("Query Results: " + result.rows.length);

                var j=0;
                var k=0;

                for (var i=0;i<result.rows.length;i++){
                    if((result.rows.item(i).userpin).substr(0,1) == '1'){

                                var query = new Parse.Query("VirtualForce");
                                query.equalTo("userPin", result.rows.item(i).userpin);
                                query.greaterThanOrEqualTo( "createdAt", checkSDate );
                                query.lessThanOrEqualTo("createdAt", checkEDate);
                                query.find({
                                    success:function (results) {

                                        console.log("Results Length: " + results.length);

                                        //Upload Picture to Parse
                                        uploadPicToParse(result.rows.item(j).userAvatarOut);

                                        results[0].set("userAvatarOut",userAvatar);
                                        results[0].set("checkOutTime",result.rows.item(j).checkOutTime);
                                        results[0].set("check","checkout");
                                        results[0].set("workingHours",result.rows.item(j).workingHours);

                                        deleteLocalvf(result.rows.item(j).userpin);
                                        j++;
                                        results[0].save(null, {
                                            success:function (virtualf) {
                                                console.log(virtualf + " saved successfully");


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
                    else if((result.rows.item(i).userpin).substr(0,1) == '2'){
                                var query = new Parse.Query("Kualitatem");
                                query.equalTo("userPin", result.rows.item(i).userpin);
                                query.greaterThanOrEqualTo( "createdAt", checkSDate );
                                query.lessThanOrEqualTo("createdAt", checkEDate);
                                query.find({
                                    success:function (results) {

                                        console.log("Results Length: " + results.length);

                                        //Upload Picture to Parse
                                        uploadPicToParse(result.rows.item(k).userAvatarOut);
                                        results[0].set("userAvatarOut",userAvatar);
                                        results[0].set("checkOutTime",result.rows.item(k).checkOutTime);
                                        results[0].set("check","checkout");
                                        results[0].set("workingHours",result.rows.item(k).workingHours);
                                        deleteLocalkm(result.rows.item(k).userpin);
                                        k++;
                                        results[0].save(null, {
                                            success:function (virtualf) {
                                                console.log(virtualf + " saved successfully");

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
        }
       
        function queryHome(){
            alert("Going to Redirect!");
            window.location = "home.html?checkin=" + checkin + "&pic=" + offlinePic;
        }

        
        
        
         var uploadParsePic = function(url){
             //console.log("In UploadPic!");
            var currentDate = new Date();
            var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();
            
            var checkStatus = new Date(); // Status : late,ontime
            checkStatus.setHours(9);
            checkStatus.setMinutes(30);
            checkStatus.setSeconds(59);
            
            var checkSDate = new Date(); //Start Date
            checkSDate.setHours(00);
            checkSDate.setMinutes(00);
            checkSDate.setSeconds(00);
            
            var checkEDate = new Date(); //End Date
            checkEDate.setHours(23);
            checkEDate.setMinutes(59);
            checkEDate.setSeconds(59);
            
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

           userpin = window.localStorage.getItem("pin");
           username = window.localStorage.getItem("username");
           company = window.localStorage.getItem("company");
           department = window.localStorage.getItem("department");
           
            if (checkin == 'true'){
                if (company == 'virtualforce'){
                    //console.log("In Virtual Force");
                    if (navigator.onLine){
                        console.log("Yes Em Online!");
                        syncDataCheckIn();
                        var query = new Parse.Query("VirtualForce");
                        query.equalTo("userPin", userpin);
                        query.greaterThanOrEqualTo( "createdAt", checkSDate );
                        query.lessThanOrEqualTo("createdAt", checkEDate);
                        query.find({
                            success:function (results) {
                                //console.log("Results Length: " +results.length);
                                results[0].set("userAvatarIn",url);
                                results[0].set("checkInTime",currentTime);
                                results[0].set("department",department);
                                results[0].set("check","checkin");
                                results[0].set("createdAt",currentDate);
                                results[0].set("status",status);
                                results[0].save(null, {
                                    success:function (kuali) {
                                        console.log(kuali + " saved successfully");
                                        
                                        upLocalvfIn(picUrl,currentTime,department,status,userpin);
                                          
                                    },
                                    error:function (pSweet, error) {
                                    }

                                });
                            },
                            error:function (pSweet, error) {
                                console.log("saveRecord() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                    else{
                        db.transaction(function(t){
                            t.executeSql("UPDATE VIRTUALFORCE SET userAvatarIn = '"+ offPicData + "' , checkInTime = '" + currentTime + "' , department = '" + department + "' , checkstat = 'checkin', status = '" + status + "' , uploaded = 'false1' WHERE userpin ==" + userpin , [], queryHome, errorCB9);
                        });
                    }
                }
                else if (company == 'kualitatem'){

                    if (navigator.onLine){
                        syncDataCheckIn(); 
                        var query = new Parse.Query("Kualitatem");
                        query.equalTo("userPin", userpin);
                        query.greaterThanOrEqualTo( "createdAt", checkSDate );
                        query.lessThanOrEqualTo("createdAt", checkEDate);
                        query.find({
                            success:function (results) {
                                
                                results[0].set("userAvatarIn",picUrl);
                                results[0].set("checkInTime",currentTime);
                                results[0].set("department",department);
                                results[0].set("check","checkin");
                                results[0].set("createdAt",currentDate);
                                results[0].set("status",status);
                                results[0].save(null, {
                                    success:function (kuali) {
                                        console.log(kuali + " saved successfully");
                                         
                                        upLocalkmIn(picUrl,currentTime,department,status,userpin);
                                        

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
                    else{
                        db.transaction(function(t){
                            t.executeSql("UPDATE KUALITATEM SET userAvatarIn = '"+ offPicData + "' , checkInTime = '" + currentTime + "' , department = '" + department + "' , checkstat = 'checkin', status = '" + status + "' , uploaded = 'false1' WHERE userpin ==" + userpin , [], queryHome, errorCB9);
                        });
                    }
                }
            }
            else{
                var checkinTime = new Date();
                var hours = new Date();
                var workHours;
                var time2;
                var time=[];
                var checkinHr,checkinMn;
                if (company == 'virtualforce'){
                    if (navigator.onLine){
                            syncDataCheckIn(); 
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

                                        results[0].set("userAvatarOut",picUrl);
                                        results[0].set("checkOutTime",currentTime);
                                        results[0].set("check","checkout");
                                        results[0].set("workingHours",workHours);
                                        results[0].save(null, {
                                            success:function (virtualf) {
                                                console.log(virtualf + " saved successfully");
                                                 
                                                deleteLocalvf(userpin);
                                                db.transaction(function(t){
                                                       t.executeSql("UPDATE VIRTUALFORCE SET userAvatarOut ='"+ userAvatar + "', checkOutTime = '" + currentTime + "', workingHours = '" + workHours + "', checkstat = 'checkout', uploaded = 'true2' WHERE userpin ==" + userpin , [], queryHome, errorCBout);
                                                   });
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
                        else{

                            db.transaction(function(t){
                                t.executeSql("SELECT checkInTime FROM VIRTUALFORCE WHERE userpin ==" + userpin , [], calcOffWorkHourvf, errorCBout);
                            });

                        }
                }

                else if (company == 'kualitatem'){
                            if (navigator.onLine){
                                syncDataCheckIn();
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

                                            results[0].set("userAvatarOut",picUrl);
                                            results[0].set("checkOutTime",currentTime);
                                            results[0].set("check","checkout");
                                            results[0].set("workingHours",workHours);
                                            results[0].save(null, {
                                                success:function (kuali) {
                                                    console.log(kuali + " saved successfully");
                                                      
                                                    deleteLocalkm(userpin);
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
                        else{
                            db.transaction(function(t){
                                t.executeSql("SELECT checkInTime FROM KUALITATEM WHERE userpin ==" + userpin , [], calcOffWorkHourkm, errorCBout);
                            });
                        }
                    }
            }



        }
        
        function calcOffWorkHourvf(tx,results){
            
            var currentDate = new Date();
            var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();
            //compareDate = checkDate.toDateString().substr(4,6) + ',' + checkDate.getFullYear();
            var checkinTime = new Date();
            var hours = new Date();
            var workHours;
            var time2;
            var time=[];
            var checkinHr,checkinMn;
            
            time2 = results.rows.item(0).checkInTime;
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
            db.transaction(function(t){
                t.executeSql("UPDATE VIRTUALFORCE SET userAvatarOut ='"+ offPicData + "', checkOutTime = '" + currentTime + "', workingHours = '" + workHours + "', checkstat = 'checkout', uploaded = 'false2' WHERE userpin ==" + userpin , [], queryHome, errorCBout);
            });
            
        }
        
        function calcOffWorkHourkm(tx,results){
            
            var currentDate = new Date();
            var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();
            //compareDate = checkDate.toDateString().substr(4,6) + ',' + checkDate.getFullYear();
            var checkinTime = new Date();
            var hours = new Date();
            var workHours;
            var time2;
            var time=[];
            var checkinHr,checkinMn;
            
            time2 = results.rows.item(0).checkInTime;
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
            db.transaction(function(t){
                t.executeSql("UPDATE KUALITATEM SET userAvatarOut ='"+ offPicData + "', checkOutTime = '" + currentTime + "', workingHours = '" + workHours + "', checkstat = 'checkout', uploaded = 'false2' WHERE userpin ==" + userpin , [], queryHome, errorCBout);
            });
            
        }
        
        function backToLogin(){
            setTimeout(function(){
                window.location = "index.html";
            },5000);
            
        }
        
        function takePicture(){
            setTimeout(function(){
                capturePicture();
            },3000);
            
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
                                                
                                                
                                                if (results[i].get("status") == "absent"){
                                                        checkin_time = 'nil';
                                                        checkout_time = 'nil';
                                                    }
                                                if (results[i].get("checkOutTime") == null || results[i].get("checkOutTime") == ''){
                                                    checkout_time = 'nil';
                                                }
                                                else{
                                                    checkout_time = results[i].get("checkOutTime").substr(results[i].get("checkOutTime").length - 5);
                                                    
                                                    if (checkout_time == null || checkout_time == ''){
                                                  checkout_time = 'nil';
                                                 }
                                                 else{
                                                     time = checkout_time.split(':');
                                                     if (time[1].length < 2){
                                                         checkout_time = time[0] + ':0' + time[1];
                                                         console.log("CheckoutTime: " + checkout_time);
                                                     }
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
                                                
                                                
                                                if (results[i].get("status") == "absent"){
                                                        checkin_time = 'nil';
                                                        checkout_time = 'nil';
                                                    }
                                                if (results[i].get("checkOutTime") == null || results[i].get("checkOutTime") == ''){
                                                    checkout_time = 'nil';
                                                }
                                                else{
                                                    checkout_time = results[i].get("checkOutTime").substr(results[i].get("checkOutTime").length - 5);
                                                    
                                                    if (checkout_time == null || checkout_time == ''){
                                                  checkout_time = 'nil';
                                                 }
                                                 else{
                                                     time = checkout_time.split(':');
                                                     if (time[1].length < 2){
                                                         checkout_time = time[0] + ':0' + time[1];
                                                         console.log("CheckoutTime: " + checkout_time);
                                                     }
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
                                           sendEmailTo('attendance@gmail.com','maryum.babar@virtual-force.com','maryum.babar@gmail.com','Attendance Report', msg, function (success) {
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
          
            username = window.localStorage.getItem("username");
            var fname = [];
            fname = username.split(" ");
            
            var currentDate = new Date();
            
            if (check == 'true'){
                if(navigator.onLine){
                    var query = new Parse.Query("MessageConfig");
                    query.equalTo("messageType", 'checkin');
                    //query.equalTo("check", 'checkin');
                    query.find({
                        success:function (results) {
                            $('.welcome-message').text(results[0].get("message"));
                            $('.welcome-text').text('Welcome ');
                            $('#welcome-text2').text(fname[0] + '!');
                            $('.check-text').text("You checked in at");
                        },
                        error: function (error){

                        }
                    });     
                }
                else{
                    $('.welcome-message').text("Happy Coding! :)");
                    $('.welcome-text').text('Welcome ');
                    $('#welcome-text2').text(fname[0] + '!');
                    $('.check-text').text("You checked in at");
                }
            }
            else{
                if(navigator.onLine){
                    var query = new Parse.Query("MessageConfig");
                    query.equalTo("messageType", 'checkout');
                    //query.equalTo("check", 'checkin');
                    query.find({
                        success:function (results) {
                            $('.welcome-message').text(results[0].get("message"));
                            $('.welcome-text').text('Goodbye ');
                            $('#welcome-text2').text(fname[0] + '!');
                            $('.check-text').text("You checked out at");
                        },
                        error: function (error){

                        }
                    });
                }
                else{
                     $('.welcome-message').text("See U tomorrow!");
                     $('.welcome-text').text('Goodbye ');
                     $('#welcome-text2').text(fname[0] + '!');
                     $('.check-text').text("You checked out at");
                }
            }
        }
        
        function backToLogin2(){
            console.log("Email Sent!");
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

            db.transaction(populateDB, errorCB, successCB);

        // Transaction error callback

        function errorCB(tx, err) {
            console.log("Error processing SQL: "+err);
        }

        // Transaction success callback

        function successCB() {
            console.log("success!");
        }

        // Populate the database
        
        function populateDB(tx) {
            tx.executeSql('DROP TABLE IF EXISTS USERS');
            tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id TEXT PRIMARY_KEY, username TEXT, userpin TEXT, company TEXT, department TEXT)');
            
            tx.executeSql('DROP TABLE IF EXISTS VIRTUALFORCE');
            tx.executeSql('CREATE TABLE IF NOT EXISTS VIRTUALFORCE (id TEXT PRIMARY_KEY, username TEXT, userpin TEXT, checkInTime TEXT, checkOutTime TEXT, workingHours TEXT, department TEXT, userAvatarIn TEXT, userAvatarOut TEXT, status TEXT, checkstat TEXT, uploaded TEXT)');
            
            tx.executeSql('DROP TABLE IF EXISTS KUALITATEM');
            tx.executeSql('CREATE TABLE IF NOT EXISTS KUALITATEM (id TEXT PRIMARY_KEY, username TEXT, userpin TEXT, checkInTime TEXT, checkOutTime TEXT, workingHours TEXT, department TEXT, userAvatarIn TEXT, userAvatarOut TEXT, status TEXT, checkstat TEXT, uploaded TEXT)');
         
            var query = new Parse.Query("Users");
                query.find({
                    success:function (r_auth) {
                        if (r_auth.length > 0) {
                            for(var i=0;i < r_auth.length;i++){
                                username = r_auth[i].get("userName");
                                company = r_auth[i].get("company");
                                userpin = r_auth[i].get("userPin");
                                department = r_auth[i].get("department");
                                
                                function it2(value,un,up,cit,coutt,wh,dept,uai,uao,stat,chk,upload){
                                                console.log("In VFDB!");
                                                db.transaction(function(t){
                                                    t.executeSql('INSERT INTO VIRTUALFORCE (id, username, userpin, checkInTime, checkOutTime, workingHours, department, userAvatarIn, userAvatarOut, status, checkstat, uploaded) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[value, un,up,cit,coutt,wh,dept,uai,uao,stat,chk,upload]);
                                                });
                                };
                                
                                function it3(value,un,up,cit,coutt,wh,dept,uai,uao,stat,chk,upload){
                                                console.log("In KMDB!");
                                                db.transaction(function(t){
                                                    t.executeSql('INSERT INTO KUALITATEM (id, username, userpin, checkInTime, checkOutTime, workingHours, department, userAvatarIn, userAvatarOut, status, checkstat, uploaded) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[value, un,up,cit,coutt,wh,dept,uai,uao,stat,chk,upload]);
                                                });
                                };
                                function it(value,un,up,com,dep){
                                                    console.log("UserPin: " + up);
                                                    db.transaction(function(t){
                                                        t.executeSql('INSERT INTO USERS (id, username, userpin, company, department) VALUES (?,?,?,?,?)',[value, un,up,com,dep]);

                                                    });
                                    };
                                    it(i,username,userpin,company,department);
                               
                                console.log("Company: " + company);
               
                                if ((r_auth[i].get("userPin")).substr(0,1) == '1'){
                                    console.log("In Virtual Force: " + i);
                                   
                                    var virtualF = Parse.Object.extend("VirtualForce");
                                    
                                    
                                    it2(i,username,userpin,currentTime,"","",department,"","","absent","","");
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
                                            
                                            
                                            
                                            
                                        },
                                        error:function (pSweet, error) {
                                            console.log("saveRecord() -> " + error.code + " " + error.message);
                                        }

                                    });
                                }
                                else if ((r_auth[i].get("userPin")).substr(0,1) == '2'){
                                    
                                    console.log("In Kualitatem: " + i);
                                    
                                    
                                    var kualitatem = Parse.Object.extend("Kualitatem");
                                    
                                    
                                    it3(i,username,userpin,currentTime,"","",department,"","","absent","","");
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
        }
      