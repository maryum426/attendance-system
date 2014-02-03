var checkin;
var username;
var userpin;
var company;
var department;
var userAvatar = null;
var offlinePic  = null;
var offPicData = null;
var syncImage = null;
var picurl;
var db = window.openDatabase("users", "1.0", "Users", 52428800);
var table = '<table style="border:1px solid #000;text-align: center;border-collapse:collapse;margin-top:10px;margin-bottom:20px;">';
      
       
        function logout(){
            window.location = "index.html";
        }
        
        
        // This function will only be called once, at the start of the day to insert the records and email 
        //previous day's report. 
        function launch(){
            
            $('#launch').attr('disabled','disabled');
            $('#launch').css({'opacity':'0.4'});
            
            sendEmail();
           
        }
        
       //Getting User Info
        function getInfo(up){

            db.transaction(function(t){
                t.executeSql('SELECT * FROM USERS WHERE userpin ==' + up , [], querySuccess, errorCB);
            });

        }; 
        
       //Check Info in localDB
       function queryDB() {
            $('.pic_upload').hide();
            $('.btn-holder2').hide();
            $('#codeOk').attr('disabled','disabled');
            $('#codeOk').css({'opacity':'0.4'});
            userpin = ($('.code-holder').val()).toString();
            console.log("User Pin: " + userpin);
            
            if(/^[0-9]*$/.test(userpin) == false || userpin == null || userpin == '') {  
	        alert('Invalid Input. Enter again.');	 	
                $('#codeOk').removeAttr('disabled');	 	
                $('#codeOk').css({'opacity':'1.4'});	 	
                $('.code-holder').val(null);	 	
            }
            getInfo(userpin);
            
       }
       
        // Query the success callback
        //Result Found! Now check "CheckIn/Out status"
        function querySuccess(tx, results) {
            
            console.log("Returned rows = " + results.rows.length);
            
            // If result found
            var len = results.rows.length;
            if (len > 0){
                    console.log("Username: " + results.rows.item(0).username);
                    console.log("Comapny: " + results.rows.item(0).company);
                    console.log("Department: " + results.rows.item(0).department);
                    username = results.rows.item(0).username;
                    company = results.rows.item(0).company;
                    department = results.rows.item(0).department;
                    
                    //Storing data in local storage to use efficiently throughout the app.
                    window.localStorage.setItem("pin",userpin);
                    window.localStorage.setItem("username",username);
                    window.localStorage.setItem("company",company);
                    window.localStorage.setItem("department",department);
                    
                    checkCheckIn();
            }
            else if(results.rows.length == 0) {
                alert("User doesnot exist!");
                $('#codeOk').removeAttr('disabled');
                $('#codeOk').css({'opacity':'1.4'});
                $('.code-holder').val(null);
            }
            
        }

        // Transaction error callbacks
        function errorCB(err) {
            console.log("Error processing SQL: "+err.code);
        }
        
        
       // ----------------- Save/Delete records locally ------------------//
       // Updating local records for CheckIn
       // Getting userpin *up* to delete the uploaded record.
       
       function upLocalvfIn(offpic,ct,dep,stat,up){
            db.transaction(function(t){
                console.log("My Query Up local vf!");
                t.executeSql("UPDATE VIRTUALFORCE SET userAvatarIn = '"+ offpic+ "', checkInTime = '" + ct + "', department = '" + dep + "', checkstat = 'checkin', status = '" + stat + "', uploaded = 'false1' WHERE userpin ==" + up , [], queryHome, errorCB);
            });
        }
        
        function upLocalkmIn(offpic,ct,dep,stat,up){
            db.transaction(function(t){
                console.log("My Query Up local km!");
                t.executeSql("UPDATE KUALITATEM SET userAvatarIn = '"+ offpic+ "', checkInTime = '" + ct + "', department = '" + dep + "', checkstat = 'checkin', status = '" + stat + "', uploaded = 'false1' WHERE userpin ==" + up , [], queryHome, errorCB);
            });
        }
        function deleteLocalvf(up){
            db.transaction(function(t){
                console.log("My Query Del local vf!");
                t.executeSql("DELETE FROM VIRTUALFORCE WHERE userpin ==" + up , [], function(){ syncDataCheckIn();}, errorCB);
            });
        }
        function deleteLocalkm(up){
            db.transaction(function(t){
                console.log("My Query Del local km!");
                t.executeSql("DELETE FROM KUALITATEM WHERE userpin ==" + up , [], function(){ syncDataCheckIn();}, errorCB);
            });
        }
        
        // --------------------------- End -----------------------------//
        
        // When Offline/Online: Record Found in Local DB
        function queryRedirect(tx,results){
            
            console.log("Results Length: " + results.rows.length);
     
            if (results.rows.length == 0){
                alert("You've already checked out!\n Bubye! :D");
                $('#codeOk').removeAttr('disabled');
                $('#codeOk').css({'opacity':'1.4'});
                $('.code-holder').val(null);
            }   

            if (results.rows.item(0).checkstat == 'checkin'){
                window.location = "picUpload.html?checkin=false";
            }
            else if (results.rows.item(0).checkstat == 'checkout'){
                alert("You've already checked out!\n Bubye! :D");
                $('#codeOk').removeAttr('disabled');
                $('#codeOk').css({'opacity':'1.4'});
                $('.code-holder').val(null);
            }
            else if (results.rows.item(0).checkstat == '' || results.rows.item(0).check == null){
                window.location = "picUpload.html?checkin=true";
            }
        }
        
        //Check record in VF table
        function chkvf(up,cd){
                                
            db.transaction(function(t1){
                console.log("In checkCheckIn2!");
                console.log("Userpin: " + up);
                console.log("Date: " + cd);
                t1.executeSql("SELECT * FROM VIRTUALFORCE WHERE  userpin ='" + up + "'", [] ,queryRedirect, errorCB);
            });
        };
        
        //Check record in KM table
        function chkkm(up,cd){
                                
            db.transaction(function(t1){
                console.log("In checkCheckIn2!");
                console.log("Userpin: " + up);
                console.log("Date: " + cd);
                t1.executeSql("SELECT * FROM KUALITATEM WHERE  userpin ='" + up + "'", [] ,queryRedirect, errorCB);
            });
        };
        
        function checkCheckIn(){
            console.log("In checkCheckIn!");
            var currentDate = new Date();
            var d = currentDate.toDateString();
            
            //Check checkin/out status            
            if (company == 'virtualforce'){

                chkvf(userpin,d); //Search record in VirtualForce table to check Checkin status

            }
            else if (company == 'kualitatem'){

                chkkm(userpin,d); //Search record in Kualitatem table to check Checkin status    

            }
            
        }
        
        //Take Picture Using PhoneGap Camera API
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
            };

            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(onSuccess,onFail,options);
        }
        
        //Picture Successfully Taken
        var onSuccess = function(data3) {
              
            userAvatar = data3;
            var data;
            data = "data:image/jpeg;base64," + userAvatar;
            $("#my_image").attr("src",data);
            userAvatar = data;
        };

        var onFail = function(e) {
            console.log("On fail " + e);
        };
        
        //Submit Picture
        function uploadOk(){
            
            if (userAvatar == null){
                alert("Take a picture first!");
                $('#submit1').removeAttr('disabled');
                $('#submit1').css({'opacity':'1.4'});
                
            }
            
            $('#submit1').attr('disabled','disabled');
            $('#submit1').css({'opacity':'0.4'});
                    
                   
            var thumbnailw = 400;
            var thumbnailh = 683;
            var ppWidth, ppHeight;
            var image = new Image();
            
            image.src = userAvatar;
            offlinePic = userAvatar;
            window.localStorage.setItem("offlinepic",offlinePic);
            
            //Resizing Image
            var canvas = document.createElement('canvas');
            canvas.width = thumbnailw;
            canvas.height = thumbnailh;

            image.onload = function(){
                
                ppWidth = image.width;
                ppHeight = image.height;

                var context = canvas.getContext('2d');
                context.clearRect(0, 0, thumbnailw, thumbnailh);
                var imageWidth;
                var imageHeight;
                var offsetX = 0;
                var offsetY = 0;

                if (image.width > image.height) {
                    imageWidth = Math.round(thumbnailw * image.width / image.height);
                    imageHeight = thumbnailh;
                    offsetX = - Math.round((imageWidth - thumbnailw) / 2);
                    
                } else {
                    imageHeight = Math.round(thumbnailh * image.height / image.width);
                    imageWidth = thumbnailw;    
                    offsetY = - Math.round((imageHeight - thumbnailh) / 2);            
                    
                }

                context.drawImage(image, offsetX, offsetY, imageWidth, imageHeight);
                
                var data2 = canvas.toDataURL('image/jpeg');

                data2 = data2.replace(/^data:image\/(png|jpeg);base64,/, "");
                
                offPicData  = data2; //Save PicData locally
                
                uploadLocal(); 
            };
                        
        }
        
        function uploadParseFile(pf){
            
            //Initialize Parse
            Parse.initialize("oxdew7mMEtpnkypr0DLtpd5rPg7vFFlgo1VPBCJs","7AtLcq4907OUmsLMpZcv0y4fgrZhUKSvv8iz9ncz");

            var parseFile = new Parse.File("mypic.jpg", {base64:pf});
            
            //Uploading file to Parse
            parseFile.save().then(function() {

                                            userAvatar = parseFile.url();
                                            window.localStorage.setItem("picurl",userAvatar);
                                            uploadParsePic(userAvatar);
                                            console.log (parseFile.url());
                                            console.log("Ok");
                                            console.log("In Uploadfinal!");

                                        }, function(error) {
                                            console.log("Error");
                                            console.log(error);
                                            //setTimeout(function(){console.log("Some Exception.");window.location = "index.html";},1500)
                                        });

        }
        
        function uploadBack(){
            window.location = "index.html";
        }
        
        //Sync local data
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
        
        function uploadPicToParse(pic3,sync_flag){
            
            //console.log("Here in Pic Parse");
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
            
            
            pic3 = pic3.substring(pic3.indexOf(',')+1);
            var jsonData = { "base64":pic3,"_ContentType":"image/jpeg" };
            var blob = JSON.stringify(jsonData);
                        
            userAvatar = 'https://api.parse.com/1/files/' + 'mypicLocal.jpg';
            
             $.ajax({
                    type: "POST",
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Parse-Application-Id", 'oxdew7mMEtpnkypr0DLtpd5rPg7vFFlgo1VPBCJs');
                        request.setRequestHeader("X-Parse-REST-API-Key", 'U20mEfCfZxq1jNMOLLJkQCJieVSpekFDcHRXmLDp');
                        request.setRequestHeader("Content-Type", 'text/plain');
                    },
                    url: userAvatar,
                    data: blob,
                    async: false,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        userAvatar = data.url;
                        console.log("PicUrl: " + userAvatar);
                        return userAvatar;
                    
                    },
                    error: function(data){
                        var obj = jQuery.parseJSON(data);
                        console.log(obj.error);
                        console.log("Some Exception.");
                    }
                    });
        }
        
        function querySyncIn(t,result){  //Sync Check-In Records
            
            if(result.rows.length == 0){ //Go back if no record is found to sync.
                console.log("No Result found!");
                setTimeout(function(){console.log("No result found VF/KM.");window.location = "index.html";},1500)  
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

               var i=0;
               var j=0;
               var k=0;
               var current_pin = 0;
                
               while (i<result.rows.length){

                    if ((result.rows.item(i).userpin).substr(0,1) == '1'){ //Virtual Force
                           console.log("Called for VF!");
                           console.log("UserPin to find: " + result.rows.item(i).userpin);

                           //Upload Record to Parse
                            var query = new Parse.Query("VirtualForce");
                            query.equalTo("userPin", result.rows.item(i).userpin);
                            query.greaterThanOrEqualTo( "createdAt", checkSDate );
                            query.lessThanOrEqualTo("createdAt", checkEDate);
                            query.find({
                                success:function (results) {
                                    console.log("Result in VF found");
                                    console.log("Results Length in VF sync: " +results.length);

                                    //Upload Picture to Parse
                                    uploadPicToParse(result.rows.item(j).userAvatarIn,"vfin");
                                    console.log("UserAvatar Uploaded: " + userAvatar);

                                    results[0].set("userAvatarIn",userAvatar);
                                    results[0].set("checkInTime",result.rows.item(j).checkInTime);
                                    results[0].set("department",result.rows.item(j).department);
                                    results[0].set("check","checkin");
                                    results[0].set("status",result.rows.item(j).status);

                                    j++;
                                    results[0].save(null, {
                                        success:function (kuali) {
                                            console.log(kuali + " saved successfully");
                                            db.transaction(function(t){
                                                console.log("My Query Home Called!");
                                                current_pin = results[0].get("userPin");
                                                t.executeSql("UPDATE VIRTUALFORCE SET uploaded = 'true1' WHERE userpin ==" + current_pin , [], (function(){console.log("Success!");}), errorCB);
                                            });
//                                             if(i == result.rows.length){
//                                                setTimeout(function(){console.log("Done Syncing and Uploading VF.");window.location = "index.html";},1500)   
//                                             }

                                        },
                                        error:function (pSweet, error) {
                                            console.log("saveRecord() -> " + error.code + " " + error.message);
                                            console.log("Some Exception.");

                                        }

                                    });
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                    console.log("Some Exception.");
                                    if(i == result.rows.length){
                                        //setTimeout(function(){window.location = "index.html";},1500)   
                                     }
                                }

                            });

                    }
                    else if ((result.rows.item(i).userpin).substr(0,1) == '2'){ //Kualitatem
                        console.log("Called for KM!");

                            console.log("UserPin to find: " + result.rows.item(i).userpin);
                            
                            //Upload Record to Parse
                            var query = new Parse.Query("Kualitatem");
                            query.equalTo("userPin", result.rows.item(i).userpin);
                            query.greaterThanOrEqualTo( "createdAt", checkSDate );
                            query.lessThanOrEqualTo("createdAt", checkEDate);
                            query.find({
                                success:function (results) {
                                    console.log("Result in KM found");
                                    console.log("Results Length in KM sync: " +results.length);

                                    //Upload Picture to Parse
                                    uploadPicToParse(result.rows.item(k).userAvatarIn,"kmin");
                                    console.log("UserAvatar Uploaded: " + userAvatar);

                                    results[0].set("userAvatarIn",userAvatar);
                                    results[0].set("checkInTime",result.rows.item(k).checkInTime);
                                    results[0].set("department",result.rows.item(k).department);
                                    results[0].set("check","checkin");
                                    results[0].set("status",result.rows.item(k).status);

                                    k++;
                                    results[0].save(null, {
                                        success:function (kuali) {
                                            console.log(kuali + " saved successfully");
                                            db.transaction(function(t){
                                                    console.log("My Query Home Called!");
                                                    current_pin = results[0].get("userPin");
                                                    t.executeSql("UPDATE KUALITATEM SET uploaded = 'true1' WHERE userpin ==" + current_pin , [], (function(){console.log("Success!");}), errorCB);
                                                });
//                                            if(i == result.rows.length){
//                                                setTimeout(function(){console.log("Done Syncing and Uploading VF.");window.location = "index.html";},1500)   
//                                             }
                                        },
                                        error:function (pSweet, error) {
                                            console.log("saveRecord() -> " + error.code + " " + error.message);
                                            console.log("Some Exception.");
                                             
                                        }

                                    });
                                },
                                error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                    console.log("Some Exception.");
                                    if(i == result.rows.length){
                                        //setTimeout(function(){window.location = "index.html";},1500)   
                                     }
                                }

                            });

                    }
                    i++;


                }
                
            }
            
        }
       
        function querySyncOut(t,result){ //Sync Check-out Records
            
            if(result.rows.length == 0){
                console.log("No Result found!");
                setTimeout(function(){console.log("No result found VF/KM.");window.location = "index.html";},1500)  
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

                var i=0;
                var j=0;
                var k=0;
                var current_pin = 0;

                while (i<result.rows.length){
                    if((result.rows.item(i).userpin).substr(0,1) == '1'){
                            console.log("Called for VF!");
                            console.log("UserPin to find: " + result.rows.item(i).userpin);

                            //Upload record to parse
                             var query = new Parse.Query("VirtualForce");
                             query.equalTo("userPin", result.rows.item(i).userpin);
                             query.greaterThanOrEqualTo( "createdAt", checkSDate );
                             query.lessThanOrEqualTo("createdAt", checkEDate);
                             query.equalTo("check","checkin");
                             query.find({
                                 success:function (results) {

                                     console.log("Results Length: " + results.length);

                                     //Upload Picture to Parse
                                     uploadPicToParse(result.rows.item(j).userAvatarOut,"kmout");
                                     console.log("UserAvatar Uploaded: " + userAvatar);
                                     results[0].set("userAvatarOut",userAvatar);
                                     results[0].set("checkOutTime",result.rows.item(j).checkOutTime);
                                     results[0].set("check","checkout");
                                     results[0].set("workingHours",result.rows.item(j).workingHours);


                                     j++;
                                     results[0].save(null, {
                                         success:function (virtualf) {
                                             console.log(virtualf + " saved successfully");
                                             //Deleting local record
                                             db.transaction(function(t){
                                                 console.log("My Query Del local vf!");
                                                 current_pin = results[0].get("userPin");
                                                 t.executeSql("DELETE FROM VIRTUALFORCE WHERE userpin ==" + current_pin , [], function(){console.log("Record successfully deleted VF!")}, errorCB);
                                             });
//                                             if(i == result.rows.length){
//                                                 setTimeout(function(){console.log("Done Syncing and Uploading VF.");window.location = "index.html";},1500)   
//                                              }

                                         },
                                         error:function (pSweet, error) {
                                             console.log("saveRecord() -> " + error.code + " " + error.message);
                                             console.log("Some Exception.");

                                         }

                                     });
                                 },
                                 error:function (error) {
                                             console.log("saveRecord() -> " + error.code + " " + error.message);
                                             if(i == result.rows.length){
                                                //setTimeout(function(){window.location = "index.html";},1500)   
                                             }
                                 }
                             });   
                    }
                    else if((result.rows.item(i).userpin).substr(0,1) == '2'){
                            console.log("Called for KM!");
                            console.log("UserPin to find: " + result.rows.item(i).userpin);

                            //Upload record to parse
                             var query = new Parse.Query("Kualitatem");
                             query.equalTo("userPin", result.rows.item(i).userpin);
                             query.greaterThanOrEqualTo( "createdAt", checkSDate );
                             query.lessThanOrEqualTo("createdAt", checkEDate);
                             query.equalTo("check","checkin");
                             query.find({
                                 success:function (results) {

                                     console.log("Results Length: " + results.length);

                                     //Upload Picture to Parse
                                     uploadPicToParse(result.rows.item(k).userAvatarOut,"kmout");
                                     console.log("UserAvatar Uploaded: " + userAvatar);
                                     results[0].set("userAvatarOut",userAvatar);
                                     results[0].set("checkOutTime",result.rows.item(k).checkOutTime);
                                     results[0].set("check","checkout");
                                     results[0].set("workingHours",result.rows.item(k).workingHours);
                                     k++;
                                     results[0].save(null, {
                                         success:function (virtualf) {
                                             console.log(virtualf + " saved successfully");
                                             //Deleting local record
                                             db.transaction(function(t){
                                                 console.log("My Query Del local km!");
                                                 current_pin = results[0].get("userPin");
                                                 t.executeSql("DELETE FROM KUALITATEM WHERE userpin ==" + current_pin , [], function(){console.log("Record successfully deleted KM!")}, errorCB);
                                             });

//                                             if(i == result.rows.length){
//                                                 setTimeout(function(){console.log("Done Syncing and Uploading KM.");window.location = "index.html";},1500)   
//                                              }

                                         },
                                         error:function (pSweet, error) {
                                             console.log("saveRecord() -> " + error.code + " " + error.message);

                                         }

                                     });
                                 },
                                 error:function (error) {
                                             console.log("saveRecord() -> " + error.code + " " + error.message);
                                             if(i == result.rows.length){
                                                //setTimeout(function(){window.location = "index.html";},1500)   
                                             }
                                 }
                             });
                    }
                    i++; 
                }
            }
        }
       
        //Redirect to Home/Last Screen
        function queryHome(){
            console.log("Going to Redirect!");
            console.log("Checkin Value: " + checkin);
            window.location = "home.html?checkin=" + checkin;
        }
        
        //Upload Current Record to Parse
        var uploadParsePic = function(url){
            
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
            
            if (checkin == 'true'){
                if (company == 'virtualforce'){
                    if (navigator.connection.type != Connection.NONE){
                        
                        console.log("Yes Em Online!");
                        var query = new Parse.Query("VirtualForce");
                        query.equalTo("userPin", userpin);
                        query.greaterThanOrEqualTo( "createdAt", checkSDate );
                        query.lessThanOrEqualTo("createdAt", checkEDate);
                        query.find({
                            success:function (results) {
                                
                                console.log("Uploaded Avatar: " + url);
                                url = window.localStorage.getItem("picurl");
                                results[0].set("userAvatarIn",url);
                                results[0].set("checkInTime",currentTime);
                                results[0].set("department",department);
                                results[0].set("check","checkin");
                                results[0].set("createdAt",currentDate);
                                results[0].set("status",status);
                                results[0].save(null, {
                                    success:function (kuali) {
                                        console.log(kuali + " saved successfully");
                                        
                                        //Update local record.
                                        db.transaction(function(t){
                                            console.log("My Query Up local vf when online!");
                                            t.executeSql("UPDATE VIRTUALFORCE SET uploaded = 'true1' WHERE userpin ==" + userpin , [], function(){console.log("Record Successfully Updated for VF!")}, errorCB);
                                        });
                                        syncDataCheckIn();
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
                    else if(navigator.connection.type == Connection.NONE) {
                        setTimeout(function(){window.location = "index.html";},2000);
                        
                    }
                }
                else if (company == 'kualitatem'){

                    if (navigator.connection.type != Connection.NONE){
                            
                        var query = new Parse.Query("Kualitatem");
                        query.equalTo("userPin", userpin);
                        query.greaterThanOrEqualTo( "createdAt", checkSDate );
                        query.lessThanOrEqualTo("createdAt", checkEDate);
                        query.find({
                            success:function (results) {
                                console.log("Uploaded Avatar: " + url);
                                url = window.localStorage.getItem("picurl");
                                results[0].set("userAvatarIn",url);
                                results[0].set("checkInTime",currentTime);
                                results[0].set("department",department);
                                results[0].set("check","checkin");
                                results[0].set("createdAt",currentDate);
                                results[0].set("status",status);
                                results[0].save(null, {
                                    success:function (kuali) {
                                        console.log(kuali + " saved successfully");
                                        
                                        //Upload local record
                                        db.transaction(function(t){
                                            console.log("My Query Up local km when online!");
                                            t.executeSql("UPDATE KUALITATEM SET uploaded = 'true1' WHERE userpin ==" + userpin , [], function(){console.log("Record Successfully Updated for KM!")}, errorCB);
                                        });
                                        syncDataCheckIn();    
                                    },
                                    error:function (pSweet, error) {
                                        console.log("saveRecord() -> " + error.code + " " + error.message);
                                        console.log("Some Exception.");

                                    }

                                });
                            },
                            error:function (pSweet, error) {
                                    console.log("saveRecord() -> " + error.code + " " + error.message);
                                    console.log("Some Exception.");
                                             
                            }

                        });
                    }
                    else if(navigator.connection.type == Connection.NONE) {
                        setTimeout(function(){window.location = "index.html";},2000);
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
                    if (navigator.connection.type != Connection.NONE){
                           
                            var query = new Parse.Query("VirtualForce");
                            query.equalTo("userPin", userpin);
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

                                      workHours = hours.toString();
                                        
                                        console.log("Uploaded Avatar: " + url);
                                        url = window.localStorage.getItem("picurl");
                                        results[0].set("userAvatarOut",url);
                                        results[0].set("checkOutTime",currentTime);
                                        results[0].set("check","checkout");
                                        results[0].set("workingHours",workHours);
                                        results[0].save(null, {
                                            success:function (virtualf) {
                                                
                                                console.log(virtualf + " saved successfully");
                                                deleteLocalvf(userpin);
                                                syncDataCheckIn();
                                            },
                                            error:function (pSweet, error) {
                                                console.log("saveRecord() -> " + error.code + " " + error.message);
                                                console.log("Some Exception.");
                                            }

                                        });
                                    },
                                    error:function (error) {
                                             console.log("saveRecord() -> " + error.code + " " + error.message);
                                             console.log("Some Exception.");
                                             
                                    }
                            });
                        }
                        else if(navigator.connection.type == Connection.NONE) {

                            setTimeout(function(){window.location = "index.html";},2000);

                        }
                }

                else if (company == 'kualitatem'){
                            if (navigator.connection.type != Connection.NONE){
                                
                                var query = new Parse.Query("Kualitatem");
                                query.equalTo("userPin", userpin);
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

                                          workHours = hours.toString();
                                          console.log("Working Hours " + workHours);

                                            
                                            console.log("Uploaded Avatar: " + url);
                                            url = window.localStorage.getItem("picurl");
                                            results[0].set("userAvatarOut",url);
                                            results[0].set("checkOutTime",currentTime);
                                            results[0].set("check","checkout");
                                            results[0].set("workingHours",workHours);
                                            results[0].save(null, {
                                                success:function (kuali) {
                                                    
                                                    console.log(kuali + " saved successfully");
                                                    deleteLocalkm(userpin);
                                                    syncDataCheckIn();
                                                },
                                                error:function (pSweet, error) {
                                                        console.log("saveRecord() -> " + error.code + " " + error.message);
                                                        console.log("Some Exception.");
                                                        
                                                }

                                            });
                                    },
                                error:function (error) {
                                             console.log("saveRecord() -> " + error.code + " " + error.message);
                                             console.log("Some Exception.");
                                            
                                }
                            });
                        }
                        else if(navigator.connection.type == Connection.NONE) {
                           setTimeout(function(){window.location = "index.html";},2000);
                        }
                    }
            }
            
        }
        
        function calcOffWorkHourvf(tx,results){
            
            var currentDate = new Date();
            var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();
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

            workHours = hours.toString();
            window.localStorage.setItem("picurl",offPicData);
            
            db.transaction(function(t){
                t.executeSql("UPDATE VIRTUALFORCE SET userAvatarOut ='"+ offPicData + "', checkOutTime = '" + currentTime + "', workingHours = '" + workHours + "', checkstat = 'checkout', uploaded = 'false2' WHERE userpin ==" + userpin , [], queryHome, errorCB);
            });
            
            db.transaction(function(t){
                t.executeSql("UPDATE VIRTUALFORCE SET userAvatarOut ='"+ offPicData + "', checkOutTime = '" + currentTime + "', workingHours = '" + workHours + "', checkstat = 'checkout', uploaded = 'false2' WHERE userpin ==" + userpin , [], queryHome, errorCB);
            });
            
        }
        
        function calcOffWorkHourkm(tx,results){
            
            var currentDate = new Date();
            var currentTime = (currentDate.toDateString()+', '+ currentDate.getHours() + ':' + currentDate.getMinutes()).toString();
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

            workHours = hours.toString();
            window.localStorage.setItem("picurl",offPicData);
            db.transaction(function(t){
                t.executeSql("UPDATE KUALITATEM SET userAvatarOut ='"+ offPicData + "', checkOutTime = '" + currentTime + "', workingHours = '" + workHours + "', checkstat = 'checkout', uploaded = 'false2' WHERE userpin ==" + userpin , [], queryHome, errorCB);
            });
            
        }
       
        function takePicture(){
            setTimeout(function(){
                capturePicture();
            },1500);
            
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

            console.log("In sendEmail");
            var newLine = "<br>";
            var msg = '';
            var reportDate;
            var query = new Parse.Query("VirtualForce");
            query.ascending("checkInTime");
            query.startsWith("checkInTime", yesterday.toDateString());
            query.find({
                   success:function (results) {
                           console.log("results =--> " + results.length);
                           console.log("Results =--> results for checkin VF");

                           if(results.length == 0) {
                                   console.log("No Results! VF1");
                                   getKualitatem();
                           } else {	

                                   for(var i=0; i < results.length; i++){
                                        table += '<tr style="border:1px solid #000">';
                                        table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("userPin")  + '</td>';
                                        table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("userName")  + '</td>';
                                        
                                        checkin_time = results[i].get("checkInTime").substr(results[i].get("checkInTime").length - 5);
                                        time = checkin_time.split(':');
                                        
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

                   }
           });
        
        //Get Results for Kualitatem
        function getKualitatem(){

                var query2 = new Parse.Query("Kualitatem");
                query2.ascending("checkInTime");
                query2.startsWith("checkInTime", yesterday.toDateString());
                query2.find({
                       success:function (results) {
                               console.log("results =--> " + results.length);
                               console.log("Results =--> results for checkin KM");

                               if(results.length == 0) {
                                        console.log("No Results! KM1");
                                        uploadAll();
                               } else {	

                                       for(var i=0; i < results.length; i++){
                                            table += '<tr style="border:1px solid #000">';
                                            table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("userPin")  + '</td>';
                                            table += '<td style="border:1px solid #000;padding:5px;">' + results[i].get("userName")  + '</td>';
                                            checkin_time = results[i].get("checkInTime").substr(results[i].get("checkInTime").length - 5);
                                            time = checkin_time.split(':');
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
                               }
                       },
                       error:function (error) {
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
                        fromEmail:fromEmail,
                        toEmail:receiverEmail,
                        ccEmail:ccEmail,
                        subject:subject,
                        html:m_phone
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
        
        //Setting Dynamic messages from Parse when online
        function setMessages(check){
          
            username = window.localStorage.getItem("username");
            var fname = [];
            fname = username.split(" ");
            
            var currentDate = new Date();
            
            if (check == 'true'){
                if(navigator.connection.type != Connection.NONE){ 
                    
                    var query = new Parse.Query("MessageConfig");
                    query.equalTo("messageType", 'checkin');
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
                else if(navigator.connection.type == Connection.NONE) {
                    $('.welcome-message').text("Happy Coding! :)");
                    $('.welcome-text').text('Welcome ');
                    $('#welcome-text2').text(fname[0] + '!');
                    $('.check-text').text("You checked in at");
                }
            }
            else{
                if(navigator.connection.type != Connection.NONE){
                    var query = new Parse.Query("MessageConfig");
                    query.equalTo("messageType", 'checkout');
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
                else if(navigator.connection.type == Connection.NONE) {
                     $('.welcome-message').text("See U tomorrow!");
                     $('.welcome-text').text('Goodbye ');
                     $('#welcome-text2').text(fname[0] + '!');
                     $('.check-text').text("You checked out at");
                }
            }
        }
        
        //Add all users to the localDB and Parse DB
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

        // Populate the local database with current date's records.
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
    
        var uploadLocal = function(){
            
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

                        window.localStorage.setItem("picurl",offPicData);
                        upLocalvfIn(offPicData,currentTime,department,status,userpin);

                }
                else if (company == 'kualitatem'){

                        window.localStorage.setItem("picurl",offPicData);
                        upLocalkmIn(offPicData,currentTime,department,status,userpin);

                }

           }
           else{
               
                if (company == 'virtualforce'){
                   
                        db.transaction(function(t){
                            t.executeSql("SELECT checkInTime FROM VIRTUALFORCE WHERE userpin ==" + userpin , [], calcOffWorkHourvf, errorCB);
                        });

                }

                else if (company == 'kualitatem'){
                            
                        db.transaction(function(t){
                            t.executeSql("SELECT checkInTime FROM KUALITATEM WHERE userpin ==" + userpin , [], calcOffWorkHourkm, errorCB);
                        });

                }
            }
        }
        
        
        var uploadFinal = function(){
             console.log("FucntionUpload!");
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
            //console.log("Check Status: " + checkStatus.toString());
            //console.log("Current Date: " + currentDate.toString());
            
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
           picurl = window.localStorage.getItem("picurl");
           

           if (navigator.connection.type != Connection.NONE){
               
                console.log("Yes Em Online1!");
                uploadParseFile(picurl);
           }
           else if(navigator.connection.type == Connection.NONE) {
               
                setTimeout(function(){window.location = "index.html";},2000);
           }
        }
